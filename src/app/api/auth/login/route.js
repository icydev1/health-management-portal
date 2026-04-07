import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message?.toLowerCase?.() ?? '';
      if (
        msg.includes('email not confirmed') ||
        msg.includes('email not verified') ||
        msg.includes('confirm your email')
      ) {
        return NextResponse.json(
          { ok: false, needsVerification: true, email },
          { status: 403 },
        );
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    }

    const session = data.session;
    if (!session?.access_token) {
      return NextResponse.json({ ok: false, error: 'Missing session' }, { status: 500 });
    }

    if (!data.user?.email_confirmed_at) {
      return NextResponse.json(
        { ok: false, needsVerification: true, email },
        { status: 403 },
      );
    }

    let role = 'FREELANCER';
    let is_superadmin = false;
    const profile = await prisma.profile.findUnique({
      where: { id: data.user.id },
      select: { role: true, isSuperadmin: true, accountStatus: true },
    });
    if (profile?.role) role = profile.role;
    if (typeof profile?.isSuperadmin === 'boolean') is_superadmin = profile.isSuperadmin;

    // If email just confirmed and account is still PENDING → auto-activate
    if (profile?.accountStatus === 'PENDING' && data.user.email_confirmed_at) {
      await prisma.profile.update({
        where: { id: data.user.id },
        data: { accountStatus: 'ACTIVE' },
      }).catch(() => {});
      profile.accountStatus = 'ACTIVE';
    }

    // Block login for non-active accounts (skip for superadmin)
    if (!is_superadmin && profile?.accountStatus && profile.accountStatus !== 'ACTIVE') {
      return NextResponse.json(
        { ok: false, error: 'Your account is not active. Please contact an administrator.' },
        { status: 403 },
      );
    }

    const redirectTo = role === 'ADMIN' ? '/admin/dashboard' : '/freelancer/dashboard';

    const res = NextResponse.json({
      ok: true,
      user: data.user,
      role,
      is_superadmin,
      redirectTo,
    });
    setAuthCookies(res, session);
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 },
    );
  }
}
