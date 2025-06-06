import { auth } from '@/lib/auth';

export default auth((req) => {
  // If the user is NOT authenticated and is NOT already on /sign-in
  if (!req.auth && req.nextUrl.pathname !== '/sign-in') {
    const url = new URL('/sign-in', req.nextUrl.origin);
    return Response.redirect(url);
  }
  // Otherwise, allow
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg).*)'],
};
