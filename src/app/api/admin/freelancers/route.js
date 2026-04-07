import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { sendWelcomeFreelancerEmail } from '@/lib/mailer';

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const search       = searchParams.get('search')?.trim() ?? '';
    const statusFilter = searchParams.get('status') ?? 'ALL';
    const roleFilter   = searchParams.get('role')   ?? 'ALL';

    const profiles = await prisma.profile.findMany({
      where: {
        NOT: [{ id: auth.user.id }, { isSuperadmin: true }],
        ...(roleFilter !== 'ALL' ? { role: roleFilter } : {}),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName:  { contains: search, mode: 'insensitive' } },
            { fullName:  { contains: search, mode: 'insensitive' } },
            { email:     { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true, firstName: true, lastName: true, fullName: true,
        email: true, region: true, role: true, accountStatus: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const freelancers = profiles
      .map((p) => ({ ...p, status: p.accountStatus }))
      .filter((p) => statusFilter === 'ALL' || p.status === statusFilter);
    // roleFilter already applied in DB query; no client-side re-filter needed

    return NextResponse.json({ ok: true, freelancers });
  } catch (e) {
    console.error('[admin/freelancers GET]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    // Only superadmin may assign ADMIN role
    const callerProfile = await prisma.profile.findUnique({
      where: { id: auth.user.id },
      select: { isSuperadmin: true },
    });
    const callerIsSuperadmin = callerProfile?.isSuperadmin === true;

    const body = await request.json();
    const firstName = String(body.firstName ?? '').trim();
    const lastName  = String(body.lastName  ?? '').trim();
    const email     = String(body.email     ?? '').trim().toLowerCase();
    const region    = body.region || null;
    const role      = callerIsSuperadmin && body.role === 'ADMIN' ? 'ADMIN' : 'FREELANCER';

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ ok: false, error: 'First name, last name and email are required' }, { status: 400 });
    }

    const password = generatePassword();
    const fullName = `${firstName} ${lastName}`;

    const supabase = createSupabaseServiceClient();
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { fullName },
    });

    if (userError) {
      const msg = userError.message?.toLowerCase() ?? '';
      if (msg.includes('already') || msg.includes('exists')) {
        return NextResponse.json({ ok: false, error: 'A user with this email already exists.' }, { status: 400 });
      }
      return NextResponse.json({ ok: false, error: userError.message }, { status: 400 });
    }

    const userId = userData.user.id;

    await prisma.profile.upsert({
      where: { id: userId },
      create: { id: userId, email, firstName, lastName, fullName, role, region, accountStatus: 'ACTIVE' },
      update: { firstName, lastName, fullName, role, region, accountStatus: 'ACTIVE' },
    });

    const loginUrl = `${new URL(request.url).origin}/login`;
    await sendWelcomeFreelancerEmail(email, firstName, password, loginUrl);

    return NextResponse.json({ ok: true, message: 'Freelancer created and welcome email sent.' });
  } catch (e) {
    console.error('[admin/freelancers POST]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
