import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';

export async function POST(request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const currentPassword = String(body.currentPassword ?? '');
  const newPassword     = String(body.newPassword     ?? '');

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { ok: false, error: 'Current password and new password are required' },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { ok: false, error: 'New password must be at least 8 characters' },
      { status: 400 },
    );
  }

  const email = auth.user.email;

  // Verify current password by attempting sign-in
  const supabase = createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return NextResponse.json(
      { ok: false, error: 'Current password is incorrect' },
      { status: 400 },
    );
  }

  // Update password via service role
  const admin = createSupabaseServiceClient();
  const { error: updateError } = await admin.auth.admin.updateUserById(auth.user.id, {
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: 'Password updated successfully.' });
}
