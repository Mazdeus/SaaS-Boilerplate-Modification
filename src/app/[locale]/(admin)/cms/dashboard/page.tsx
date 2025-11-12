'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Target, 
  Users, 
  Star, 
  ShoppingBag, 
  Package, 
  Store,
  Film,
  Wrench,
  Info,
  Building2,
  MapPin
} from 'lucide-react';

type Stats = {
  heroes: number;
  testimonials: number;
  products: number;
  companyBranches: number;
  teamMembers: number;
  collections: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    heroes: 0,
    testimonials: 0,
    products: 0,
    companyBranches: 0,
    teamMembers: 0,
    collections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/en/cms/login');
    }
  }, [status, router]);

  // Fetch stats from database
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/stats');
      if (response.ok) {
        const data = await response.json();
        console.log('Stats fetched:', data);
        if (data.success && data.data) {
          setStats(data.data);
        }
      } else {
        console.error('Failed to fetch stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/cms/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Minimalist Brown Theme */}
      <header className="border-b border-gray-200 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  BRODO CMS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Content Management System
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner - Brown Gradient */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {session.user?.name}!
          </h2>
          <p className="text-amber-100">
            Manage your BRODO company profile content from this dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Hero Sections"
            value={stats.heroes}
            icon={<Target className="size-6" />}
            color="blue"
            href="/en/cms/hero"
          />
          <StatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={<Users className="size-6" />}
            color="green"
            href="/en/cms/team"
          />
          <StatCard
            title="Testimonials"
            value={stats.testimonials}
            icon={<Star className="size-6" />}
            color="yellow"
            href="/en/cms/testimonials"
          />
          <StatCard
            title="Products"
            value={stats.products}
            icon={<ShoppingBag className="size-6" />}
            color="purple"
            href="/en/cms/products"
          />
          <StatCard
            title="Collections"
            value={stats.collections}
            icon={<Package className="size-6" />}
            color="blue"
            href="/en/cms/collections"
          />
          <StatCard
            title="Company Branches"
            value={stats.companyBranches}
            icon={<Store className="size-6" />}
            color="green"
            href="/en/cms/company-branches"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Hero Sections"
              description="Manage slideshow banners"
              icon={<Film className="size-5" />}
              href="/en/cms/hero"
            />
            <QuickActionCard
              title="Team Members"
              description="Manage team profiles"
              icon={<Users className="size-5" />}
              href="/en/cms/team"
            />
            <QuickActionCard
              title="Products"
              description="Manage product catalog"
              icon={<ShoppingBag className="size-5" />}
              href="/en/cms/products"
            />
            <QuickActionCard
              title="Collections"
              description="Manage product collections"
              icon={<Package className="size-5" />}
              href="/en/cms/collections"
            />
            <QuickActionCard
              title="Testimonials"
              description="Manage customer reviews"
              icon={<Star className="size-5" />}
              href="/en/cms/testimonials"
            />
            <QuickActionCard
              title="Services & Values"
              description="Edit company values"
              icon={<Wrench className="size-5" />}
              href="/en/cms/services"
            />
            <QuickActionCard
              title="About Us"
              description="Update about content"
              icon={<Info className="size-5" />}
              href="/en/cms/about"
            />
            <QuickActionCard
              title="Company Info"
              description="Edit company details"
              icon={<Building2 className="size-5" />}
              href="/en/cms/company-info"
            />
            <QuickActionCard
              title="Company Branches"
              description="Manage store locations"
              icon={<MapPin className="size-5" />}
              href="/en/cms/company-branches"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'purple';
  href: string;
}

function StatCard({ title, value, icon, color, href }: StatCardProps) {
  const colorClasses = {
    blue: 'from-amber-600 to-amber-700',
    yellow: 'from-amber-700 to-amber-800',
    green: 'from-amber-700 to-brown-800',
    purple: 'from-amber-800 to-amber-900',
  };

  return (
    <a
      href={href}
      className="block bg-white dark:bg-gray-800 p-6 transition-all hover:bg-stone-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </a>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, description, icon, href }: QuickActionCardProps) {
  return (
    <a
      href={href}
      className="block p-4 border-l-2 border-gray-200 dark:border-gray-700 hover:border-amber-700 dark:hover:border-amber-600 bg-gray-50 hover:bg-gray-100 transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-amber-700 group-hover:text-amber-800 transition-colors">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}

