import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  // Skip middleware for API auth routes and public assets
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/test-cookies') ||
    request.nextUrl.pathname.startsWith('/api/set-test-cookie') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon') ||
    request.nextUrl.pathname === '/auth' ||
    request.nextUrl.pathname === '/test-auth' ||
    request.nextUrl.pathname === '/form-auth'
  ) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value
  const allCookies = request.cookies.getAll()
  // Add colored logs for visibility
  const color = (c: string) => `\x1b[${c}m`;
  const reset = '\x1b[0m';
  console.log(color('36'), '[MIDDLEWARE]', reset, 'Checking token for path:', request.nextUrl.pathname);
  console.log(color('36'), '[MIDDLEWARE]', reset, 'All cookies:', allCookies.map(c => `${c.name}=${c.value?.substring(0, 10)}...`));
  console.log(color('36'), '[MIDDLEWARE]', reset, 'Auth-token specifically:', token ? `${token.substring(0, 20)}...` : 'not found');
  console.log(color('36'), '[MIDDLEWARE]', reset, 'Token exists:', !!token);

  // If no token, redirect to auth page
  if (!token) {
    console.log(color('31'), '[MIDDLEWARE]', reset, 'NO TOKEN, redirecting to /auth');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Verify token
  const user = await verifyTokenEdge(token);
  console.log(color('36'), '[MIDDLEWARE]', reset, 'Token valid:', !!user);
  if (!user) {
    console.log(color('31'), '[MIDDLEWARE]', reset, 'INVALID TOKEN, redirecting to /auth');
    console.log(color('33'), '[MIDDLEWARE]', reset, 'JWT_SECRET in middleware:', process.env.NEXT_PUBLIC_JWT_SECRET);
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  console.log(color('32'), '[MIDDLEWARE]', reset, 'ALLOWING ACCESS to:', request.nextUrl.pathname);
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (auth page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}
