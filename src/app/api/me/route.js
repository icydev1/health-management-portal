import { NextResponse } from 'next/server';
import { requireAuth, isEmailVerified } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  if (!isEmailVerified(auth.user)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Email not verified',
        needsVerification: true,
        email: auth.user.email ?? null,
      },
      { status: 403 },
    );
  }

  const profile = await prisma.profile.findUnique({
    where: { id: auth.user.id },
    select: { role: true, isSuperadmin: true },
  });
  const role = profile?.role ?? 'FREELANCER';
  const redirectTo = role === 'ADMIN' ? '/admin/dashboard' : '/freelancer/dashboard';

  return NextResponse.json({
    ok: true,
    user: auth.user,
    role,
    is_superadmin: profile?.isSuperadmin ?? false,
    redirectTo,
  });
}
