'use client';

/**
 * Header Partial Component - Default Theme
 * Reusable header with navigation
 */

import Link from 'next/link';
import React from 'react';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SaaS Template
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/demo/theme-switcher"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Themes
            </Link>
            <Link
              href="/demo/areas"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Areas Demo
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
