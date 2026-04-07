import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function DELETE(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    const userId = auth.user.id;

    // Delete profile (cascades to educations)
    await prisma.profile.delete({ where: { id: userId } }).catch(() => {
      // Ignore if already gone
    });

    // Delete the Supabase auth user
    const admin = createSupabaseServiceClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true });
    clearAuthCookies(res);
    return res;
  } catch (e) {
    console.error('[delete-account]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
