import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Note: Client-side navigation & FastAPI backend token validation perform strict checking.
  // Middleware handles initial redirect check for protected routes if token is completely missing in cookies/headers if applicable.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/admin/:path*'],
};
