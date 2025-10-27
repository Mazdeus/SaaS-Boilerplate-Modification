'use client';

/**
 * Header Partial Component - Default Theme
 * Reusable header with navigation and sidebar controls
 * Part of Layout & Partial System - Templating Praktikum
 */

import Link from 'next/link';
import React from 'react';

import { SidebarToggleButton } from '@/components/SidebarToggleButton';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

type HeaderProps = {
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
};

export function Header({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen = false,
  rightSidebarOpen = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Left Sidebar Toggle Button */}
          {onToggleLeftSidebar && (
            <SidebarToggleButton
              onClick={onToggleLeftSidebar}
              position="left"
              ariaLabel="Toggle left sidebar"
              className={leftSidebarOpen ? 'bg-blue-50 text-blue-600' : ''}
            />
          )}

          <Link href="/" className="text-xl font-bold text-blue-600">
            SaaS Template
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/company-profile"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Company Profile
            </Link>
            <Link
              href="/demo-home"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Demo
            </Link>
            {/* <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link> */}
            <Link
              href="/demo/theme-switcher"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Themes
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {/* <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-gray-700 hover:text-blue-600 sm:inline-block"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:inline-block"
          >
            Get Started
          </Link> */}

          {/* Right Sidebar Toggle Button */}
          {onToggleRightSidebar && (
            <SidebarToggleButton
              onClick={onToggleRightSidebar}
              position="right"
              ariaLabel="Toggle right sidebar"
              className={rightSidebarOpen ? 'bg-blue-50 text-blue-600' : ''}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
