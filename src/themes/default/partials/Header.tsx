'use client';

/**
 * Header Partial Component - Default Theme
 * Reusable header with navigation and sidebar controls
 * Part of Layout & Partial System - Templating Praktikum
 */

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { SidebarToggleButton } from '@/components/SidebarToggleButton';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

type HeaderProps = {
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
  hideSidebarControls?: boolean;
};

export function Header({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen = false,
  rightSidebarOpen = false,
  hideSidebarControls = false,
}: HeaderProps) {
  const { handleAnchorClick } = useSmoothScroll();
  const scrollDirection = useScrollDirection({ threshold: 10 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Auto-hide on mobile when scrolling down (but not if menu is open)
  const isHidden = scrollDirection === 'down' && !isMobileMenuOpen;

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking on a link
  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    handleAnchorClick(e, anchor);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-30 border-b bg-white shadow-sm transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Left Sidebar Toggle Button */}
          {!hideSidebarControls && onToggleLeftSidebar && (
            <SidebarToggleButton
              onClick={onToggleLeftSidebar}
              position="left"
              ariaLabel="Toggle left sidebar"
              className={leftSidebarOpen ? 'bg-amber-50 text-amber-700' : ''}
            />
          )}

          <Link href="/company-profile" className="text-xl font-bold text-amber-700 dark:text-amber-500">
            BRODO
          </Link>

          {/* Hamburger Menu Button - Visible on mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`ml-4 flex items-center justify-center rounded-md p-2 transition-colors lg:hidden ${
              isMobileMenuOpen 
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden items-center gap-6 lg:flex">
            <a
              href="#about"
              onClick={e => handleAnchorClick(e, '#about')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-500"
            >
              Tentang Kami
            </a>
            <a
              href="#products"
              onClick={e => handleAnchorClick(e, '#products')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-500"
            >
              Produk Kami
            </a>
            <a
              href="#values"
              onClick={e => handleAnchorClick(e, '#values')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-500"
            >
              Nilai & Filosofi
            </a>
            <a
              href="#testimonials"
              onClick={e => handleAnchorClick(e, '#testimonials')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-500"
            >
              Testimoni
            </a>
            <a
              href="#contact"
              onClick={e => handleAnchorClick(e, '#contact')}
              className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-500"
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
            className="hidden rounded-md bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-sm font-medium text-white transition-all hover:from-amber-800 hover:to-brown-900 hover:shadow-md dark:from-amber-600 dark:to-amber-800 sm:inline-block"
          >
            Belanja Sekarang
          </a>

          {/* Right Sidebar Toggle Button */}
          {!hideSidebarControls && onToggleRightSidebar && (
            <SidebarToggleButton
              onClick={onToggleRightSidebar}
              position="right"
              ariaLabel="Toggle right sidebar"
              className={rightSidebarOpen ? 'bg-amber-50 text-amber-700' : ''}
            />
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Collapsible, hidden on desktop */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop for mobile menu */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Panel */}
          <nav className="absolute left-0 right-0 top-full z-50 border-t bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:hidden">
            <div className="container mx-auto px-4 py-3">
              <a
                href="#about"
                onClick={e => handleMobileNavClick(e, '#about')}
                className="block cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-500"
              >
                Tentang Kami
              </a>
              <a
                href="#products"
                onClick={e => handleMobileNavClick(e, '#products')}
                className="block cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-500"
              >
                Produk Kami
              </a>
              <a
                href="#values"
                onClick={e => handleMobileNavClick(e, '#values')}
                className="block cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-500"
              >
                Nilai & Filosofi
              </a>
              <a
                href="#testimonials"
                onClick={e => handleMobileNavClick(e, '#testimonials')}
                className="block cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-500"
              >
                Testimoni
              </a>
              <a
                href="#contact"
                onClick={e => handleMobileNavClick(e, '#contact')}
                className="block cursor-pointer rounded-md px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-amber-500"
              >
                Kontak
              </a>
              <a
                href="https://bro.do"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block rounded-md bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-3 text-center text-sm font-medium text-white transition-all hover:from-amber-800 hover:to-brown-900 dark:from-amber-600 dark:to-amber-800"
              >
                Belanja Sekarang
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
