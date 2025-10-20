'use client';

/**
 * Plugin Manager Demo Page
 * PUBLIC version - Manage and configure plugins (Demo Mode)
 */

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { DemoBadge } from '@/components/DemoBadge';
import { useArea } from '@/contexts/AreaContext';
import { areaManager } from '@/core/AreaManager';
import { AREAS } from '@/core/types';
import {
  pluginRegistry,
  QuickActionsWidget,
  RecentPostsWidget,
  SlideshowPlugin,
  UserStatsWidget,
} from '@/plugins';

// Register all available plugins
const availablePlugins = [
  {
    id: 'slideshow',
    name: 'Slideshow',
    version: '1.0.0',
    description: 'Display rotating images with captions in hero area',
    author: 'Templating Team',
    areas: [AREAS.HERO],
    component: SlideshowPlugin,
    enabled: true,
    icon: '🎠',
  },
  {
    id: 'user-stats',
    name: 'User Statistics',
    version: '1.0.0',
    description: 'Display user statistics and metrics',
    author: 'Templating Team',
    areas: [AREAS.SIDEBAR_LEFT, AREAS.DASHBOARD_WIDGETS],
    component: UserStatsWidget,
    enabled: true,
    icon: '📊',
  },
  {
    id: 'recent-posts',
    name: 'Recent Posts',
    version: '1.0.0',
    description: 'Show recent blog posts and updates',
    author: 'Templating Team',
    areas: [AREAS.SIDEBAR_RIGHT, AREAS.SIDEBAR_LEFT],
    component: RecentPostsWidget,
    enabled: false,
    icon: '📝',
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    version: '1.0.0',
    description: 'Quick access to common actions',
    author: 'Templating Team',
    areas: [AREAS.SIDEBAR_LEFT, AREAS.DASHBOARD_WIDGETS],
    component: QuickActionsWidget,
    enabled: true,
    icon: '⚡',
  },
];

export default function PluginsDemoPage() {
  const { registerComponent } = useArea();
  const [plugins, setPlugins] = useState(availablePlugins);

  useEffect(() => {
    // Register all plugins
    availablePlugins.forEach((plugin) => {
      pluginRegistry.register(plugin);
    });
  }, []);

  const togglePlugin = (pluginId: string) => {
    setPlugins(prev =>
      prev.map((p) => {
        if (p.id === pluginId) {
          const newEnabled = !p.enabled;

          // Update plugin registry
          if (newEnabled) {
            pluginRegistry.enable(pluginId);

            // Register to default area
            if (p.areas.length > 0 && p.areas[0]) {
              registerComponent(p.areas[0], {
                id: `${pluginId}-component`,
                component: p.component,
                priority: 10,
                enabled: true,
                areaId: p.areas[0],
              });
            }
          } else {
            pluginRegistry.disable(pluginId);

            // Unregister from all areas
            p.areas.forEach((area) => {
              areaManager.unregister(area, `${pluginId}-component`);
            });
          }

          return { ...p, enabled: newEnabled };
        }
        return p;
      }),
    );
  };

  const stats = pluginRegistry.getStats();

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Plugin Manager
            </h1>
            <DemoBadge />
          </div>
          <p className="text-gray-600">
            Manage and configure plugins for your application. Toggle plugins on/off and see them in action!
          </p>

          {/* Navigation */}
          <div className="mt-4 flex gap-3">
            <Link
              href="/demo-home"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Demo Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/demo/areas"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Areas Demo
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Total Plugins</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Active Plugins</p>
            <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Inactive Plugins</p>
            <p className="text-3xl font-bold text-gray-600">{stats.disabled}</p>
          </div>
        </div>

        {/* Plugin List */}
        <div className="space-y-4">
          {plugins.map(plugin => (
            <div
              key={plugin.id}
              className={`rounded-lg border bg-white p-6 shadow-sm transition-all ${
                plugin.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-16 items-center justify-center rounded-lg bg-gray-100 text-3xl">
                    {plugin.icon}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {plugin.name}
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        v
                        {plugin.version}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          plugin.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plugin.enabled ? '✓ Active' : '○ Inactive'}
                      </span>
                    </div>

                    <p className="mb-3 text-gray-600">{plugin.description}</p>

                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                      <span>
                        👤 By
                        {' '}
                        {plugin.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">📍 Can be used in:</span>
                      <div className="flex flex-wrap gap-2">
                        {plugin.areas.map(area => (
                          <span
                            key={area}
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => togglePlugin(plugin.id)}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      plugin.enabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {plugin.enabled ? '✕ Disable' : '✓ Enable'}
                  </button>

                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Info */}
        <div className="mt-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            💡 How Plugins Work
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>
              <strong>Enable/Disable:</strong>
              {' '}
              Toggle plugins to see them appear or disappear in their designated areas
            </li>
            <li>
              <strong>Multiple Areas:</strong>
              {' '}
              Some plugins can be placed in different areas of your application
            </li>
            <li>
              <strong>Live Updates:</strong>
              {' '}
              Changes take effect immediately without page refresh
            </li>
            <li>
              <strong>Persistent:</strong>
              {' '}
              Plugin states are saved to localStorage
            </li>
            <li>
              <strong>Try it:</strong>
              {' '}
              Enable/disable plugins and visit the
              {' '}
              <Link href="/demo/areas" className="font-semibold underline">
                Areas Demo
              </Link>
              {' '}
              to see them in action!
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/demo/areas"
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white hover:from-purple-700 hover:to-pink-700"
          >
            See Plugins in Areas →
          </Link>
          <Link
            href="/demo/theme-switcher"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Try Theme Switcher
          </Link>
          <Link
            href="/demo-home"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
