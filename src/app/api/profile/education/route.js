import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';

// POST /api/profile/education — add an education entry
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

  const { degree, fieldOfStudy, specialization } = body;

  const education = await prisma.education.create({
    data: {
      profileId: auth.user.id,
      degree: degree ?? null,
      fieldOfStudy: fieldOfStudy ?? null,
      specialization: specialization ?? null,
    },
    select: {
      id: true,
      degree: true,
      fieldOfStudy: true,
      specialization: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, education }, { status: 201 });
}
