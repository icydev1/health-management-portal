import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { setAuthCookies } from '@/lib/auth/cookies';

export async function POST(request) {
  try {
    const body = await request.json();
    const newPassword = String(body.newPassword ?? '');
    const code = body.code ? String(body.code) : null;
    const accessToken = body.access_token ? String(body.access_token) : null;
    const refreshToken = body.refresh_token ? String(body.refresh_token) : null;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'New password must be at least 8 characters' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();

    let session = null;
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
      session = data.session;
    } else if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
      }
      session = data.session;
    } else {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Missing reset credentials. Provide either `code` or (`access_token` and `refresh_token`).',
        },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 400 });
    }

    const res = NextResponse.json({
      ok: true,
      message: 'Password updated',
    });
    if (session?.access_token && session?.refresh_token) {
      setAuthCookies(res, session);
    }
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 },
    );
  }
}
