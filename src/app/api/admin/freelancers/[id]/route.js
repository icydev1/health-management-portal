import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function PUT(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    // Only superadmin may change role to ADMIN
    const callerProfile = await prisma.profile.findUnique({
      where: { id: auth.user.id },
      select: { isSuperadmin: true },
    });
    const callerIsSuperadmin = callerProfile?.isSuperadmin === true;

    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, region, accountStatus } = body;
    // Guard: non-superadmin cannot elevate role to ADMIN
    const role = callerIsSuperadmin ? body.role : undefined;

    const profile = await prisma.profile.update({
      where: { id },
      data: {
        ...(firstName     !== undefined && { firstName }),
        ...(lastName      !== undefined && { lastName }),
        ...(email         !== undefined && { email }),
        ...(region        !== undefined && { region: region || null }),
        ...(role          !== undefined && { role }),
        ...(accountStatus !== undefined && { accountStatus }),
        ...(firstName !== undefined && lastName !== undefined && {
          fullName: `${firstName} ${lastName}`.trim(),
        }),
      },
      select: {
        id: true, firstName: true, lastName: true,
        fullName: true, email: true, region: true, role: true, accountStatus: true,
      },
    });

    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    console.error('[admin/freelancers PUT]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { id } = await params;

    await prisma.profile.delete({ where: { id } }).catch(() => {});

    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/freelancers DELETE]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { id } = await params;

    const profile = await prisma.profile.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true,
        fullName: true, email: true, region: true, role: true,
        accountStatus: true, createdAt: true,
      },
    });

    if (!profile) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
