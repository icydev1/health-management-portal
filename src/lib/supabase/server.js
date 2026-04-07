import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('Missing env var: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
  if (!anonKey)
    throw new Error('Missing env var: SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createSupabaseServerClientWithAuth(accessToken) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('Missing env var: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
  if (!anonKey)
    throw new Error('Missing env var: SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');

  return createClient(url, anonKey, {
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('Missing env var: SUPABASE_URL');
  if (!serviceKey) throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function getPasswordResetRedirectUrl(requestUrl) {
  const configured = process.env.PASSWORD_RESET_REDIRECT_URL;
  if (configured) return configured;

  const origin = new URL(requestUrl).origin;
  return `${origin}/reset-password`;
}
