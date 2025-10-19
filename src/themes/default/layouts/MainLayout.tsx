/**
 * Main Layout - Default Theme
 * Primary layout for public pages
 */

import React from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import { AREAS } from '@/core/types';

import { Footer } from '../partials/Footer';
import { Header } from '../partials/Header';

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col ${className}`}>
      {/* Header Area */}
      <Header />

      {/* Header Extra Area - for plugins/widgets */}
      <AreaRenderer area={AREAS.HEADER_EXTRA} />

      {/* Hero Area - for banners, slideshows */}
      <AreaRenderer area={AREAS.HERO} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Left Area */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <AreaRenderer
                area={AREAS.SIDEBAR_LEFT}
                fallback={(
                  <div className="text-sm text-gray-500">
                    No widgets in left sidebar
                  </div>
                )}
              />
            </aside>

            {/* Content */}
            <div className="flex-1">
              {/* Content Before Area */}
              <AreaRenderer area={AREAS.CONTENT_BEFORE} />

              {/* Main Content */}
              {children}

              {/* Content After Area */}
              <AreaRenderer area={AREAS.CONTENT_AFTER} />
            </div>

            {/* Sidebar Right Area */}
            <aside className="hidden w-64 shrink-0 xl:block">
              <AreaRenderer
                area={AREAS.SIDEBAR_RIGHT}
                fallback={(
                  <div className="text-sm text-gray-500">
                    No widgets in right sidebar
                  </div>
                )}
              />
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Widgets Area */}
      <AreaRenderer area={AREAS.FOOTER_WIDGETS} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
