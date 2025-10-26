'use client';

/**
 * Main Layout - Default Theme
 * Primary layout for public pages
 * With Collapsible Sidebar - Part of Layout & Partial System
 */

import React from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { AREAS } from '@/core/types';
import { useSidebar } from '@/hooks/useSidebar';

import { Footer } from '../partials/Footer';
import { Header } from '../partials/Header';

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainLayout({ children, className = '' }: MainLayoutProps) {
  const {
    sidebarState,
    isMobile,
    toggleSidebar,
    closeSidebar,
    isSidebarOpen,
  } = useSidebar();

  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      {/* Header Area with Sidebar Controls */}
      <Header
        onToggleLeftSidebar={() => toggleSidebar('left')}
        onToggleRightSidebar={() => toggleSidebar('right')}
        leftSidebarOpen={isSidebarOpen('left')}
        rightSidebarOpen={isSidebarOpen('right')}
      />

      {/* Header Extra Area - for plugins/widgets */}
      <AreaRenderer area={AREAS.HEADER_EXTRA} />

      {/* Hero Area - for banners, slideshows */}
      <AreaRenderer area={AREAS.HERO} />

      {/* Main Content - Seamless Layout */}
      <main className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Collapsible Sidebar Left */}
        <CollapsibleSidebar
          area={AREAS.SIDEBAR_LEFT}
          position="left"
          isOpen={sidebarState.left}
          onClose={() => closeSidebar('left')}
          isMobile={isMobile}
          fallback={(
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              No widgets in left sidebar
              <br />
              <span className="text-xs">
                Register plugins to this area
              </span>
            </div>
          )}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Content Before Area */}
            <AreaRenderer area={AREAS.CONTENT_BEFORE} />

            {/* Main Content */}
            {children}

            {/* Content After Area */}
            <AreaRenderer area={AREAS.CONTENT_AFTER} />
          </div>
        </div>

        {/* Collapsible Sidebar Right */}
        <CollapsibleSidebar
          area={AREAS.SIDEBAR_RIGHT}
          position="right"
          isOpen={sidebarState.right}
          onClose={() => closeSidebar('right')}
          isMobile={isMobile}
          fallback={(
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              No widgets in right sidebar
              <br />
              <span className="text-xs">
                Register plugins to this area
              </span>
            </div>
          )}
        />
      </main>

      {/* Footer Widgets Area */}
      <AreaRenderer area={AREAS.FOOTER_WIDGETS} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
