'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname.includes('/cms/login')) {
      setIsLoading(false);
      return;
    }

    if (status === 'loading') {
      // Still loading session
      return;
    }

    if (status === 'unauthenticated' || !session) {
      // Not authenticated, redirect to login with return URL
      const currentPath = pathname;
      const loginUrl = `/cms/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
      return;
    }

    if (status === 'authenticated' && session) {
      // Authenticated, allow access
      setIsLoading(false);
      return;
    }
  }, [session, status, router, pathname]);

  // Show loading spinner while checking auth
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto">
            <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we're on login page, always show it
  if (pathname.includes('/cms/login')) {
    return <>{children}</>;
  }

  // If authenticated, show protected content
  if (session) {
    return <>{children}</>;
  }

  // Fallback (should not reach here due to useEffect redirect)
  return null;
}
