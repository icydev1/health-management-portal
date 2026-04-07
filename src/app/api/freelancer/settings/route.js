import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';

const SELECT = {
  notifyEmail: true,
  notifySms: true,
  notifyJobAlerts: true,
  notifyPayoutAlerts: true,
};

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    const settings = await prisma.profile.findUnique({
      where: { id: auth.user.id },
      select: SELECT,
    });

    if (!settings) {
      return NextResponse.json({ ok: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    console.error('[settings GET]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
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

    const { notifyEmail, notifySms, notifyJobAlerts, notifyPayoutAlerts } = body;

    const settings = await prisma.profile.update({
      where: { id: auth.user.id },
      data: {
        ...(notifyEmail        !== undefined && { notifyEmail:        Boolean(notifyEmail) }),
        ...(notifySms          !== undefined && { notifySms:          Boolean(notifySms) }),
        ...(notifyJobAlerts    !== undefined && { notifyJobAlerts:    Boolean(notifyJobAlerts) }),
        ...(notifyPayoutAlerts !== undefined && { notifyPayoutAlerts: Boolean(notifyPayoutAlerts) }),
      },
      select: SELECT,
    });

    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    console.error('[settings PUT]', e);
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}
