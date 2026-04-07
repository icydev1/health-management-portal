import { NextResponse } from 'next/server';
import { requireAuth, isEmailVerified } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

const BUCKET = 'icy';

async function resolveProfileImageUrl(path) {
  if (!path) return null;
  // If it's already a full URL (legacy), return as-is
  if (path.startsWith('http')) return path;
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7-day signed URL
  return data?.signedUrl ?? null;
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  if (!isEmailVerified(auth.user)) {
    return NextResponse.json(
      { ok: false, error: 'Email not verified', needsVerification: true, email: auth.user.email ?? null },
      { status: 403 },
    );
  }

  const fullName = auth.user.user_metadata?.fullName ?? auth.user.user_metadata?.full_name ?? null;
  const email = auth.user.email ?? null;

  // Upsert: create the profile row on first access if it doesn't exist yet
  await prisma.profile.upsert({
    where: { id: auth.user.id },
    create: {
      id: auth.user.id,
      email,
      fullName,
      role: 'FREELANCER',
    },
    update: {},
  });

  const profile = await prisma.profile.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      role: true,
      isSuperadmin: true,
      firstName: true,
      lastName: true,
      fullName: true,
      email: true,
      phone: true,
      profileImage: true,
      verificationStatus: true,
      region: true,
      dateOfBirth: true,
      primaryAddress: true,
      secondaryAddress: true,
      languages: true,
      educations: {
        select: {
          id: true,
          degree: true,
          fieldOfStudy: true,
          specialization: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const profileImageUrl = await resolveProfileImageUrl(profile.profileImage);

  return NextResponse.json({ ok: true, profile: { ...profile, profileImage: profileImageUrl } });
}

export async function PUT(request) {
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

  const {
    firstName,
    lastName,
    fullName,
    phone,
    dateOfBirth,
    primaryAddress,
    secondaryAddress,
    region,
    languages,
  } = body;

  const profile = await prisma.profile.update({
    where: { id: auth.user.id },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(fullName !== undefined && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(dateOfBirth !== undefined && {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      }),
      ...(primaryAddress !== undefined && { primaryAddress }),
      ...(secondaryAddress !== undefined && { secondaryAddress }),
      ...(region !== undefined && { region: region || null }),
      ...(languages !== undefined && { languages }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      fullName: true,
      email: true,
      phone: true,
      region: true,
      dateOfBirth: true,
      primaryAddress: true,
      secondaryAddress: true,
      languages: true,
      verificationStatus: true,
      educations: {
        select: {
          id: true,
          degree: true,
          fieldOfStudy: true,
          specialization: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      updatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, profile });
}
