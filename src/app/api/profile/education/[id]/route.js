import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';

// PUT /api/profile/education/[id] — update an education entry
export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  // Ensure the education entry belongs to the authenticated user
  const existing = await prisma.education.findUnique({
    where: { id },
    select: { profileId: true },
  });

  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  if (existing.profileId !== auth.user.id) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { degree, fieldOfStudy, specialization } = body;

  const education = await prisma.education.update({
    where: { id },
    data: {
      ...(degree !== undefined && { degree }),
      ...(fieldOfStudy !== undefined && { fieldOfStudy }),
      ...(specialization !== undefined && { specialization }),
    },
    select: {
      id: true,
      degree: true,
      fieldOfStudy: true,
      specialization: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, education });
}

// DELETE /api/profile/education/[id] — remove an education entry
export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  const existing = await prisma.education.findUnique({
    where: { id },
    select: { profileId: true },
  });

  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  if (existing.profileId !== auth.user.id) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  await prisma.education.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
