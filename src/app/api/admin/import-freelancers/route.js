import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { sendWelcomeFreelancerEmail } from '@/lib/mailer';

function generatePassword(length = 12) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    if (!rows.length) {
      return NextResponse.json({ ok: false, error: 'No rows provided' }, { status: 400 });
    }

    const loginUrl = `${new URL(request.url).origin}/login`;
    const supabase = createSupabaseServiceClient();
    const results = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const firstName = String(row.firstName ?? '').trim();
      const lastName  = String(row.lastName  ?? '').trim();
      const email     = String(row.email     ?? '').trim().toLowerCase();
      const region    = row.region || null;
      const role      = row.role === 'ADMIN' ? 'ADMIN' : 'FREELANCER';

      if (!email || (!firstName && !lastName)) {
        results.push({ email, status: 'skipped', reason: 'Missing required fields' });
        continue;
      }

      const password = generatePassword();
      const fullName = `${firstName} ${lastName}`.trim();

      try {
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email, password, email_confirm: true,
          user_metadata: { fullName },
        });

        if (userError) {
          results.push({ email, status: 'failed', reason: userError.message });
          continue;
        }

        const userId = userData.user.id;

        await prisma.profile.upsert({
          where: { id: userId },
          create: { id: userId, email, firstName, lastName, fullName, role, region, accountStatus: 'ACTIVE' },
          update: { firstName, lastName, fullName, role, region, accountStatus: 'ACTIVE' },
        });

        // Stagger emails: 5s base + random 0–10s between each
        if (i > 0) await sleep(5000 + Math.floor(Math.random() * 10000));

        await sendWelcomeFreelancerEmail(email, firstName, password, loginUrl);
        results.push({ email, status: 'success' });
      } catch (err) {
        results.push({ email, status: 'failed', reason: err?.message ?? 'Unknown error' });
      }
    }

    const succeeded = results.filter((r) => r.status === 'success').length;
    const failed    = results.filter((r) => r.status === 'failed').length;
    const skipped   = results.filter((r) => r.status === 'skipped').length;

    return NextResponse.json({ ok: true, results, summary: { succeeded, failed, skipped } });
  } catch (e) {
    console.error('[import-freelancers]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
