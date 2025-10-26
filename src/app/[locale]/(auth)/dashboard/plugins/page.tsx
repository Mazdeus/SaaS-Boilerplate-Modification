'use client';

/**
 * Plugin Manager Page
 * Manage and configure plugins
 */

import React, { useEffect, useState } from 'react';

import { useArea } from '@/contexts/AreaContext';
import { areaManager } from '@/core/AreaManager';
import { AREAS } from '@/core/types';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';
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

export default function PluginsPage() {
  const { registerComponent } = useArea();
  const [plugins, setPlugins] = useState(availablePlugins);

  // Clean up areas when route changes to prevent duplicates
  useRouteCleanup({ areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT, AREAS.SIDEBAR_RIGHT] });

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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Plugin Manager
        </h1>
        <p className="text-gray-600">
          Manage and configure plugins for your application
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Plugins</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Active Plugins</p>
          <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Inactive Plugins</p>
          <p className="text-3xl font-bold text-gray-600">{stats.disabled}</p>
        </div>
      </div>

      {/* Plugin List */}
      <div className="space-y-4">
        {plugins.map(plugin => (
          <div
            key={plugin.id}
            className={`rounded-lg border bg-white p-6 transition-all ${
              plugin.enabled ? 'border-green-200' : 'border-gray-200'
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
                      {plugin.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="mb-3 text-gray-600">{plugin.description}</p>

                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <span>
                      By
                      {plugin.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Can be used in:</span>
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
                  {plugin.enabled ? 'Disable' : 'Enable'}
                </button>

                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 rounded-lg border bg-blue-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">
          💡 About Plugins
        </h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Enable plugins to activate their functionality</li>
          <li>• Each plugin can be placed in specific areas</li>
          <li>• Changes take effect immediately</li>
          <li>• Settings are saved to localStorage</li>
        </ul>
      </div>
    </div>
  );
}
