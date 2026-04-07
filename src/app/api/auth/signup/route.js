import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const email     = String(body.email     ?? '').trim();
    const password  = String(body.password  ?? '');
    const fullName  = String(body.fullName  ?? '').trim();
    const firstName = String(body.firstName ?? '').trim();
    const lastName  = String(body.lastName  ?? '').trim();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // Create user without triggering Supabase's built-in email
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: fullName ? { fullName } : undefined,
    });

    if (createError || !createData?.user) {
      const msg = createError?.message?.toLowerCase?.() ?? '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        return NextResponse.json(
          { ok: false, error: 'An account with this email already exists.' },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { ok: false, error: createError?.message ?? 'Signup failed' },
        { status: 400 },
      );
    }

    const user = createData.user;

    // Create profile row immediately
    await prisma.profile.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email,
        fullName: fullName || null,
        firstName: firstName || null,
        lastName: lastName || null,
        role: 'FREELANCER',
      },
      update: {},
    });

    // Generate a confirmation link and send via our SMTP
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${siteUrl}/login` },
    });

    const confirmUrl = linkData?.properties?.action_link;
    if (confirmUrl) {
      await sendConfirmationEmail(email, confirmUrl);
    }

    return NextResponse.json({
      ok: true,
      user,
      session: null,
      message: 'Account created. Please check your email to verify before accessing your profile.',
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Server error' },
      { status: 500 },
    );
  }
}
