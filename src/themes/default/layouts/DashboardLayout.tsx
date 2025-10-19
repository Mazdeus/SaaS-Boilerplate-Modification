/**
 * Dashboard Layout - Default Theme
 * Layout for authenticated dashboard pages
 */

import Link from 'next/link';
import React from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { AREAS } from '@/core/types';

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardLayout({
  children,
  className = '',
}: DashboardLayoutProps) {
  return (
    <div className={`flex min-h-screen ${className}`}>
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Dashboard
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/plugins"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Plugins
          </Link>
          <Link
            href="/dashboard/export-demo"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Export Data
          </Link>
          <Link
            href="/demo/areas"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Areas Demo
          </Link>
          <Link
            href="/demo/theme-switcher"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Themes
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Dashboard Widgets Area */}
        <div className="bg-gray-50 p-4">
          <AreaRenderer area={AREAS.DASHBOARD_WIDGETS} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
