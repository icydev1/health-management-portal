import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { sendConfirmationEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (error) {
      const msg = error.message?.toLowerCase?.() ?? '';
      if (msg.includes('rate limit') || msg.includes('too many requests')) {
        return NextResponse.json(
          { ok: false, error: 'Too many requests. Please wait and try again.' },
          { status: 429 },
        );
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    const confirmUrl = data?.properties?.action_link;
    if (confirmUrl) {
      await sendConfirmationEmail(email, confirmUrl);
    }

    return NextResponse.json({ ok: true, message: 'Verification email sent.' });
  } catch (e) {
    console.error('[resend-verification] error:', e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 },
    );
  }
}
