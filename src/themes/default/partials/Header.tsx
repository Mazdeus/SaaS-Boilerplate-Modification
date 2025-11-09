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
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

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
  const { handleAnchorClick } = useSmoothScroll();

  return (
    <header className="sticky top-0 z-30 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
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

          <Link href="/company-profile" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            BRODO
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden items-center gap-6 lg:flex">
            <a
              href="#about"
              onClick={e => handleAnchorClick(e, '#about')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Tentang Kami
            </a>
            <a
              href="#products"
              onClick={e => handleAnchorClick(e, '#products')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Produk Kami
            </a>
            <a
              href="#values"
              onClick={e => handleAnchorClick(e, '#values')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Nilai & Filosofi
            </a>
            <a
              href="#team"
              onClick={e => handleAnchorClick(e, '#team')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Tim & Cerita
            </a>
            <a
              href="#contact"
              onClick={e => handleAnchorClick(e, '#contact')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Kontak
            </a>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          <a
            href="https://bro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 sm:inline-block"
          >
            Belanja Sekarang
          </a>

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

      {/* Mobile Navigation Menu - Always visible on mobile, hidden on desktop */}
      <nav className="border-t bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden">
        <div className="container mx-auto px-4 py-2">
          <a
            href="#about"
            onClick={e => handleAnchorClick(e, '#about')}
            className="block cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            Tentang Kami
          </a>
          <a
            href="#products"
            onClick={e => handleAnchorClick(e, '#products')}
            className="block cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            Produk Kami
          </a>
          <a
            href="#values"
            onClick={e => handleAnchorClick(e, '#values')}
            className="block cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            Nilai & Filosofi
          </a>
          <a
            href="#team"
            onClick={e => handleAnchorClick(e, '#team')}
            className="block cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            Tim & Cerita
          </a>
          <a
            href="#contact"
            onClick={e => handleAnchorClick(e, '#contact')}
            className="block cursor-pointer rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            Kontak
          </a>
          <a
            href="https://bro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Belanja Sekarang
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
