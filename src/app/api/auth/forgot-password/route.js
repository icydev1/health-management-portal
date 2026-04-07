import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { sendResetPasswordEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    const siteUrl = new URL(request.url).origin;
    const redirectTo = process.env.PASSWORD_RESET_REDIRECT_URL ?? `${siteUrl}/reset-password`;

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    if (error) {
      // Don't reveal whether the email exists; still return success to client
      console.error('[forgot-password] generateLink error:', error.message);
      return NextResponse.json({ ok: true, message: 'If the email exists, a reset link was sent.' });
    }

    let resetUrl = data?.properties?.action_link;
    if (resetUrl) {
      // Force the redirect_to to our actual domain regardless of Supabase dashboard setting
      const linkObj = new URL(resetUrl);
      linkObj.searchParams.set('redirect_to', redirectTo);
      resetUrl = linkObj.toString();
      await sendResetPasswordEmail(email, resetUrl);
    }

    return NextResponse.json({ ok: true, message: 'If the email exists, a reset link was sent.' });
  } catch (e) {
    console.error('[forgot-password] error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 },
    );
  }
}
