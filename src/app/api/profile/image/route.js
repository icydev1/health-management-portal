import { NextResponse } from 'next/server';
import { requireAuth, isEmailVerified } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const BUCKET = 'icy';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  if (!isEmailVerified(auth.user)) {
    return NextResponse.json({ ok: false, error: 'Email not verified' }, { status: 403 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('image');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok: false, error: 'No image file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'Image too large. Max 5 MB.' }, { status: 400 });
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  const storagePath = `${auth.user.id}/avatar.${ext}`;

  const supabase = createSupabaseServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  // Store only the path; generate a signed URL for the immediate response
  await prisma.profile.update({
    where: { id: auth.user.id },
    data: { profileImage: storagePath },
  });

  const { data: signedData, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

  if (signedError) {
    return NextResponse.json({ ok: false, error: signedError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, imageUrl: signedData.signedUrl });
}
