import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
);

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for CMS routes
  if (pathname.startsWith('/cms')) {
    // Allow access to login page
    if (pathname === '/cms/login') {
      // If user is already authenticated, redirect to dashboard
      const token = request.cookies.get('auth_token')?.value;
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          return NextResponse.redirect(new URL('/cms/dashboard', request.url));
        }
      }
      return NextResponse.next();
    }

    // Redirect /cms to /cms/dashboard if authenticated, otherwise to /cms/login
    if (pathname === '/cms' || pathname === '/cms/') {
      const token = request.cookies.get('auth_token')?.value;
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          return NextResponse.redirect(new URL('/cms/dashboard', request.url));
        }
      }
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }

    // For all other CMS routes, require authentication
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      // Token invalid, redirect to login
      const response = NextResponse.redirect(new URL('/cms/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/cms/:path*',
};
