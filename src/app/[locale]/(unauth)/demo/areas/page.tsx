'use client';

/**
 * Areas Demo Page
 * Demonstrates the area/region system
 */

import React, { useEffect } from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import { useArea } from '@/contexts/AreaContext';
import { areaManager } from '@/core/AreaManager';
import { AREAS } from '@/core/types';
import {
  QuickActionsWidget,
  RecentPostsWidget,
  SlideshowPlugin,
  UserStatsWidget,
} from '@/plugins';

export default function AreasPage() {
  const { registerComponent } = useArea();

  useEffect(() => {
    // Register plugins to various areas for demo
    registerComponent(AREAS.HERO, {
      id: 'slideshow-demo',
      component: SlideshowPlugin,
      priority: 10,
      enabled: true,
      areaId: AREAS.HERO,
    });

    registerComponent(AREAS.SIDEBAR_LEFT, {
      id: 'user-stats-demo',
      component: UserStatsWidget,
      priority: 10,
      enabled: true,
      areaId: AREAS.SIDEBAR_LEFT,
    });

    registerComponent(AREAS.SIDEBAR_LEFT, {
      id: 'quick-actions-demo',
      component: QuickActionsWidget,
      priority: 20,
      enabled: true,
      areaId: AREAS.SIDEBAR_LEFT,
    });

    registerComponent(AREAS.SIDEBAR_RIGHT, {
      id: 'recent-posts-demo',
      component: RecentPostsWidget,
      priority: 10,
      enabled: true,
      areaId: AREAS.SIDEBAR_RIGHT,
    });
  }, [registerComponent]);

  const allAreas = Object.values(AREAS);
  const stats = areaManager.getStats();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Areas / Regions Demo
          </h1>
          <p className="text-lg text-gray-600">
            Dynamic component placement system in action
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 rounded-lg border bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-blue-900">
            Area System Statistics
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-600">Total Areas</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalAreas}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-600">Available Areas</p>
              <p className="text-2xl font-bold text-green-600">
                {allAreas.length}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-600">Active Components</p>
              <p className="text-2xl font-bold text-purple-600">
                {Object.values(stats.areas).reduce(
                  (acc: number, area: any) => acc + area.enabled,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Area List */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Available Areas
          </h2>

          <div className="space-y-4">
            {allAreas.map((area) => {
              const components = areaManager.getAllComponents(area);
              const areaStats = stats.areas[area] || {
                total: 0,
                enabled: 0,
                disabled: 0,
              };

              return (
                <div key={area} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {area}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {areaStats.enabled}
                        {' '}
                        active,
                        {areaStats.disabled}
                        {' '}
                        disabled
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        areaStats.enabled > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {areaStats.enabled > 0 ? 'Active' : 'Empty'}
                    </span>
                  </div>

                  {components.length > 0 && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Registered Components:
                      </p>
                      <ul className="space-y-1">
                        {components.map(comp => (
                          <li
                            key={comp.id}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <span
                              className={`size-2 rounded-full ${
                                comp.enabled ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                            {comp.id}
                            {' '}
                            (Priority:
                            {comp.priority}
                            )
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Demo */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Live Area Rendering
          </h2>

          <div className="space-y-8">
            {/* Hero Area */}
            <div className="rounded-lg border-2 border-dashed border-purple-300 p-4">
              <p className="mb-2 text-sm font-medium text-purple-600">
                AREA: HERO
              </p>
              <AreaRenderer
                area={AREAS.HERO}
                fallback={<p className="text-gray-500">No components in hero area</p>}
              />
            </div>

            {/* Sidebar Areas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border-2 border-dashed border-blue-300 p-4">
                <p className="mb-2 text-sm font-medium text-blue-600">
                  AREA: SIDEBAR_LEFT
                </p>
                <AreaRenderer
                  area={AREAS.SIDEBAR_LEFT}
                  fallback={<p className="text-gray-500">No components</p>}
                  className="space-y-4"
                />
              </div>

              <div className="rounded-lg border-2 border-dashed border-green-300 p-4">
                <p className="mb-2 text-sm font-medium text-green-600">
                  AREA: SIDEBAR_RIGHT
                </p>
                <AreaRenderer
                  area={AREAS.SIDEBAR_RIGHT}
                  fallback={<p className="text-gray-500">No components</p>}
                  className="space-y-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg border bg-gray-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            💡 How Areas Work
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Areas are predefined zones in layouts where components can be placed</li>
            <li>• Plugins can register themselves to specific areas</li>
            <li>• Components are sorted by priority (lower number = higher priority)</li>
            <li>• Areas can be enabled/disabled dynamically</li>
            <li>• Multiple components can exist in the same area</li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
