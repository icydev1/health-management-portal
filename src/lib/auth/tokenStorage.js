/**
 * Access token is stored in httpOnly cookies (set by /api/auth/login).
 * Client code must not read the token; use fetch(..., { credentials: 'same-origin' }).
 */

export async function logoutViaApi() {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
  } catch {
    // ignore
  }
}
