'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const menuItems = [
  {
    title: 'Dashboard',
    icon: '📊',
    href: '/cms/dashboard',
  },
  {
    title: 'Hero Sections',
    icon: '🎯',
    href: '/cms/hero',
  },
  {
    title: 'About Us',
    icon: '📖',
    href: '/cms/about',
  },
  {
    title: 'Company Values',
    icon: '⭐',
    href: '/cms/values',
  },
  {
    title: 'Team Members',
    icon: '👥',
    href: '/cms/founders',
  },
  {
    title: 'Collections',
    icon: '👟',
    href: '/cms/collections',
  },
  {
    title: 'Stores',
    icon: '🏪',
    href: '/cms/stores',
  },
  {
    title: 'Testimonials',
    icon: '💬',
    href: '/cms/testimonials',
  },
  {
    title: 'Messages',
    icon: '✉️',
    href: '/cms/messages',
  },
  {
    title: 'Settings',
    icon: '⚙️',
    href: '/cms/settings',
  },
  {
    title: 'Users',
    icon: '👤',
    href: '/cms/users',
  },
];

export default function CMSSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/cms/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Fixed position tidak menutupi content */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between cms-mobile-header">
        <div className="flex items-center px-4 gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md bg-brodo-blue text-white shadow-sm hover:bg-brodo-blue-dark transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <h1 className="text-base sm:text-lg font-bold text-brodo-blue">Brodo CMS</h1>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-brodo-blue text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-brodo-blue-light flex-shrink-0">
          <Link href="/cms/dashboard" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>Brodo CMS</h1>
            <p className="text-sm text-gray-300 mt-1">Content Management</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto sidebar-nav">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-brodo-blue-light text-white'
                        : 'text-gray-200 hover:bg-brodo-blue-light'
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brodo-blue-light flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-4 py-3 rounded-lg text-gray-200 hover:bg-brodo-blue-light transition-colors mb-2"
          >
            <span className="text-xl mr-3">🌐</span>
            <span className="font-medium">View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-200 hover:bg-red-600 transition-colors"
          >
            <span className="text-xl mr-3">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
