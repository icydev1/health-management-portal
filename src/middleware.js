import { NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'sb-access-token';

const PROTECTED_PREFIXES = ['/freelancer', '/admin'];
const AUTH_ONLY_PATHS    = ['/login', '/signup'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Block unauthenticated access to protected routes
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(url);
  }

  // Redirect already-authenticated users away from login/signup
  const isAuthPage = AUTH_ONLY_PATHS.includes(pathname);
  if (isAuthPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/freelancer/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
};
