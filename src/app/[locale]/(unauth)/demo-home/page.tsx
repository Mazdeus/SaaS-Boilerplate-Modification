'use client';

/**
 * Demo Home Page
 * Landing page demonstrating all templating features
 */

import Link from 'next/link';
import React, { useEffect } from 'react';

import { useArea } from '@/contexts/AreaContext';
import { AREAS } from '@/core/types';
import {
  QuickActionsWidget,
  RecentPostsWidget,
  SlideshowPlugin,
  UserStatsWidget,
} from '@/plugins';
import { MainLayout } from '@/themes/default/layouts/MainLayout';

export default function DemoHomePage() {
  const { registerComponent } = useArea();

  useEffect(() => {
    // Register demo components to showcase areas
    registerComponent(AREAS.HERO, {
      id: 'demo-slideshow',
      component: SlideshowPlugin,
      priority: 10,
      enabled: true,
      areaId: AREAS.HERO,
    });

    registerComponent(AREAS.SIDEBAR_LEFT, {
      id: 'demo-user-stats',
      component: UserStatsWidget,
      priority: 10,
      enabled: true,
      areaId: AREAS.SIDEBAR_LEFT,
    });

    registerComponent(AREAS.SIDEBAR_LEFT, {
      id: 'demo-quick-actions',
      component: QuickActionsWidget,
      priority: 20,
      enabled: true,
      areaId: AREAS.SIDEBAR_LEFT,
    });

    registerComponent(AREAS.SIDEBAR_RIGHT, {
      id: 'demo-recent-posts',
      component: RecentPostsWidget,
      priority: 10,
      enabled: true,
      areaId: AREAS.SIDEBAR_RIGHT,
    });
  }, [registerComponent]);

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            Templating System Demo
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Praktikum Minggu ke-8 - Implementasi Konsep Templating
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/demo/theme-switcher"
            className="group rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 transition-all hover:border-blue-400 hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-bold text-blue-900">
              Theme System
            </h2>
            <p className="mb-4 text-blue-700">
              Switch between different themes dynamically. See visual changes in
              real-time.
            </p>
            <span className="text-sm font-medium text-blue-600 group-hover:underline">
              Try Theme Switcher →
            </span>
          </Link>

          <Link
            href="/demo/areas"
            className="group rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-8 transition-all hover:border-purple-400 hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-bold text-purple-900">
              Area/Region System
            </h2>
            <p className="mb-4 text-purple-700">
              Dynamic component placement in predefined areas. Modular and
              flexible.
            </p>
            <span className="text-sm font-medium text-purple-600 group-hover:underline">
              Explore Areas →
            </span>
          </Link>

          <Link
            href="/demo/plugins"
            className="group rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-8 transition-all hover:border-green-400 hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-bold text-green-900">
              Plugin System
            </h2>
            <p className="mb-4 text-green-700">
              Enable/disable plugins dynamically. Extend functionality without
              touching core code.
            </p>
            <span className="text-sm font-medium text-green-600 group-hover:underline">
              Manage Plugins →
            </span>
          </Link>

          <Link
            href="/demo/export-demo"
            className="group rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-8 transition-all hover:border-orange-400 hover:shadow-lg"
          >
            <h2 className="mb-2 text-2xl font-bold text-orange-900">
              Export Helpers
            </h2>
            <p className="mb-4 text-orange-700">
              Export data to CSV, Excel, and JSON formats. Simple and efficient.
            </p>
            <span className="text-sm font-medium text-orange-600 group-hover:underline">
              Try Export Demo →
            </span>
          </Link>
        </div>

        {/* Implementation Summary */}
        <div className="rounded-lg border bg-white p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Konsep yang Diimplementasikan
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-900">
                1. Template Engine Abstraction
              </h3>
              <p className="text-sm text-green-700">
                Component registry dan dynamic rendering system
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">
                2. Layout & Partial
              </h3>
              <p className="text-sm text-blue-700">
                Reusable layouts (Main, Dashboard) dan partials (Header, Footer)
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-4">
              <h3 className="mb-2 font-semibold text-purple-900">
                3. Area/Region System
              </h3>
              <p className="text-sm text-purple-700">
                8 predefined areas untuk dynamic component placement
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-4">
              <h3 className="mb-2 font-semibold text-orange-900">
                4. Theme System
              </h3>
              <p className="text-sm text-orange-700">
                3 themes (Default, Modern, Dark) dengan localStorage persistence
              </p>
            </div>

            <div className="rounded-lg bg-pink-50 p-4">
              <h3 className="mb-2 font-semibold text-pink-900">
                5. Plugin/Module System
              </h3>
              <p className="text-sm text-pink-700">
                Plugin registry dengan 4+ plugins (Slideshow, Stats, Posts, Actions)
              </p>
            </div>

            <div className="rounded-lg bg-indigo-50 p-4">
              <h3 className="mb-2 font-semibold text-indigo-900">
                6. Template Helpers
              </h3>
              <p className="text-sm text-indigo-700">
                Export (CSV, Excel, JSON) dan Format helpers
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Sidebar Demo */}
        <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-blue-900">
            🍔 NEW: Collapsible Sidebars!
          </h2>

          <div className="mb-6 space-y-3">
            <p className="text-lg text-blue-800">
              <strong>Click the burger icons (☰)</strong>
              {' '}
              in the header to toggle sidebars:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">👈</span>
                  <h3 className="font-semibold text-gray-900">Left Sidebar</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Click the left burger menu to toggle left sidebar with User Stats & Quick Actions widgets
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  <h3 className="font-semibold text-gray-900">Right Sidebar</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Click the right burger menu to toggle right sidebar with Recent Posts widget
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/80 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">How It Works:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Desktop:</strong>
                  {' '}
                  Sidebars collapse/expand smoothly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Mobile:</strong>
                  {' '}
                  Sidebars slide in as overlay with backdrop
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Dynamic Area Rendering:</strong>
                  {' '}
                  Widgets loaded from Area System
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Part of Templating:</strong>
                  {' '}
                  Layout & Partial system demonstration
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Original Sidebar Info */}
        <div className="rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            About the Sidebars
          </h2>
          <p className="text-gray-600">
            The widgets in the sidebars are rendered dynamically using the
            {' '}
            <strong>Area/Region System</strong>
            .
            They're registered as plugins and can be enabled/disabled from the Plugin Manager.
            This demonstrates the
            {' '}
            <strong>modular architecture</strong>
            {' '}
            of our templating system.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
