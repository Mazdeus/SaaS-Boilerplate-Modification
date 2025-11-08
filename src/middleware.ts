import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/onboarding(.*)',
  '/:locale/onboarding(.*)',
  '/api(.*)',
  '/:locale/api(.*)',
]);

// Public API routes that don't require authentication
const isPublicApiRoute = createRouteMatcher([
  '/api/contact',
  '/api/public(.*)',
  '/:locale/api/public(.*)',
]);

// NextAuth API routes - must bypass all middleware
const isNextAuthRoute = createRouteMatcher([
  '/api/auth(.*)',
]);

// CMS routes (use NextAuth instead of Clerk)
const isCmsRoute = createRouteMatcher([
  '/cms(.*)',
  '/:locale/cms(.*)',
]);

// CMS API routes (let them handle auth internally)
const isCmsApiRoute = createRouteMatcher([
  '/api/cms(.*)',
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Allow NextAuth API routes to bypass ALL middleware
  if (isNextAuthRoute(request)) {
    return NextResponse.next();
  }

  // Allow CMS API routes to bypass middleware (they handle auth internally)
  if (isCmsApiRoute(request)) {
    return NextResponse.next();
  }

  // Allow CMS routes to bypass Clerk middleware - use NextAuth instead
  if (isCmsRoute(request)) {
    return intlMiddleware(request);
  }

  // Allow public API routes without authentication
  if (isPublicApiRoute(request)) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.includes('/sign-in')
    || request.nextUrl.pathname.includes('/sign-up')
    || isProtectedRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      const authObj = await auth();

      if (
        authObj.userId
        && !authObj.orgId
        && req.nextUrl.pathname.includes('/dashboard')
        && !req.nextUrl.pathname.endsWith('/organization-selection')
      ) {
        const orgSelection = new URL(
          '/onboarding/organization-selection',
          req.url,
        );

        return NextResponse.redirect(orgSelection);
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
