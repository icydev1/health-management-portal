import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE } from './cookies';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getTokenFromRequest(request) {
  const header = request.headers.get('authorization');
  if (header && header.toLowerCase().startsWith('bearer ')) {
    return header.slice('bearer '.length).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function requireAuth(request) {
  const token = await getTokenFromRequest(request);
  if (!token) {
    return { ok: false, status: 401, error: 'Missing access token' };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: 'Invalid or expired token' };
  }

  return { ok: true, token, user: data.user };
}

export function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at);
}
