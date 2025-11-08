'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function CMSNavigation() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/en/cms/login' });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left: Back to Dashboard + Current Page */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/en/cms/dashboard" 
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <span className="text-gray-300">|</span>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname.includes('/collections')) return 'Collections Management';
  if (pathname.includes('/products')) return 'Products Management';
  if (pathname.includes('/hero')) return 'Hero Section';
  if (pathname.includes('/services')) return 'Services & Values';
  if (pathname.includes('/testimonials')) return 'Testimonials';
  if (pathname.includes('/team')) return 'Team Members';
  if (pathname.includes('/about')) return 'About Us';
  if (pathname.includes('/company-info')) return 'Company Information';
  if (pathname.includes('/company-branches')) return 'Company Branches';
  if (pathname.includes('/dashboard')) return 'Dashboard';
  return 'CMS Management';
}
