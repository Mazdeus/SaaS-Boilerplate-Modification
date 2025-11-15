'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CMSSidebar from '@/components/cms/CMSSidebar';
import SessionTimer from '@/components/cms/SessionTimer';

interface DashboardStats {
  heroSections: number;
  collections: number;
  products: number;
  stores: number;
  testimonials: number;
  messages: number;
  teamMembers: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CMSDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    heroSections: 0,
    collections: 0,
    products: 0,
    stores: 0,
    testimonials: 0,
    messages: 0,
    teamMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/cms/login');
          return;
        }
        
        const data = await response.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
        }
        
        // Fetch dashboard stats
        await fetchStats();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/cms/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [heroRes, collRes, storesRes, testimonRes, messagesRes] = await Promise.all([
        fetch('/api/hero-sections'),
        fetch('/api/collections'),
        fetch('/api/stores'),
        fetch('/api/testimonials'),
        fetch('/api/contact-messages'),
      ]);

      const [heroData, collData, storesData, testimonData, messagesData] = await Promise.all([
        heroRes.json(),
        collRes.json(),
        storesRes.json(),
        testimonRes.json(),
        messagesRes.json(),
      ]);

      setStats({
        heroSections: heroData.data?.length || 0,
        collections: collData.data?.length || 0,
        products: 0, // Will be updated when we add products API
        stores: storesData.data?.length || 0,
        testimonials: testimonData.data?.length || 0,
        messages: messagesData.data?.length || 0,
        teamMembers: 0, // Will be updated when we add team API
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { name: 'Hero Sections', href: '/cms/hero', icon: '🎯', count: stats.heroSections },
    { name: 'Collections', href: '/cms/collections', icon: '📦', count: stats.collections },
    { name: 'Stores', href: '/cms/stores', icon: '🏪', count: stats.stores },
    { name: 'Testimonials', href: '/cms/testimonials', icon: '⭐', count: stats.testimonials },
    { name: 'Messages', href: '/cms/messages', icon: '✉️', count: stats.messages },
    { name: 'About Us', href: '/cms/about', icon: 'ℹ️', count: 1 },
    { name: 'Settings', href: '/cms/settings', icon: '⚙️', count: 1 },
    { name: 'Users', href: '/cms/users', icon: '👥', count: 1 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Session Timer */}
      <SessionTimer />
      
      {/* Sidebar */}
      <CMSSidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 cms-main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header with Welcome Message */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user ? `Halo, ${user.name}!` : 'Dashboard'}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Welcome to BRODO CMS. Manage your content below.
                </p>
              </div>
              {user && (
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-brodo-blue-light/10 rounded-lg border border-brodo-blue-light">
                  <div className="w-10 h-10 bg-brodo-blue text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Stats Overview */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">🎯</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Hero Sections</dt>
                      <dd className="text-2xl font-semibold text-brodo-blue">{stats.heroSections}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">📦</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Collections</dt>
                      <dd className="text-2xl font-semibold text-brodo-blue">{stats.collections}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">🏪</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Stores</dt>
                      <dd className="text-2xl font-semibold text-brodo-blue">{stats.stores}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">✉️</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Messages</dt>
                      <dd className="text-2xl font-semibold text-brodo-blue">{stats.messages}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-brodo-blue hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brodo-blue"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{link.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{link.name}</p>
                    {link.count !== undefined && (
                      <p className="text-sm text-gray-500">{link.count} items</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-sm text-gray-500">Activity logging will be implemented soon.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

