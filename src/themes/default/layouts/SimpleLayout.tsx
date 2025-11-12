'use client';

/**
 * Simple Layout - Without Sidebars
 * Minimalist layout for company profile page
 * Clean and user-friendly design
 */

import React from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { AREAS } from '@/core/types';

import { Footer } from '../partials/Footer';
import { Header } from '../partials/Header';

type SimpleLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function SimpleLayout({ children, className = '' }: SimpleLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      {/* Header Area - No sidebar controls */}
      <Header 
        onToggleLeftSidebar={() => {}}
        onToggleRightSidebar={() => {}}
        leftSidebarOpen={false}
        rightSidebarOpen={false}
        hideSidebarControls={true}
      />

      {/* Header Extra Area - for plugins/widgets */}
      <AreaRenderer area={AREAS.HEADER_EXTRA} />

      {/* Hero Area - for banners, slideshows */}
      <AreaRenderer area={AREAS.HERO} />

      {/* Main Content - Full Width, No Sidebars */}
      <main className="flex-1 bg-gray-50">
        <div className="w-full">
          {/* Content Before Area */}
          <AreaRenderer area={AREAS.CONTENT_BEFORE} />

          {/* Main Content */}
          {children}

          {/* Content After Area */}
          <AreaRenderer area={AREAS.CONTENT_AFTER} />
        </div>
      </main>

      {/* Footer Widgets Area */}
      <AreaRenderer area={AREAS.FOOTER_WIDGETS} />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button - Positioned above DemoBadge */}
      <ScrollToTopButton 
        threshold={300} 
        bottom={80} 
        right={24} 
      />
    </div>
  );
}

