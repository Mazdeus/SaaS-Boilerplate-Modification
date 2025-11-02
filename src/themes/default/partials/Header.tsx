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

          <Link href="/company-profile" className="text-xl font-bold text-blue-600">
            BRODO
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <a
              href="#about"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Tentang Kami
            </a>
            <a
              href="#products"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Produk Kami
            </a>
            <a
              href="#values"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Nilai & Filosofi
            </a>
            <a
              href="#team"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Tim & Cerita
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
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
            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:inline-block"
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
    </header>
  );
}

export default Header;
