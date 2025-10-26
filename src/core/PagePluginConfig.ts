/**
 * Page Plugin Configuration
 * Defines which plugins are relevant for each page
 */

import type { AreaType } from '@/core/types';
import { AREAS } from '@/core/types';

export type PagePluginConfig = {
  [pagePath: string]: {
    allowedPlugins: string[];
    defaultPlugins?: {
      pluginId: string;
      area: AreaType;
      priority?: number;
    }[];
  };
};

export const pagePluginConfig: PagePluginConfig = {
  // Company Profile Page
  '/company-profile': {
    allowedPlugins: [
      'company-info-widget',
      'company-team-widget',
      'company-values-widget',
      'company-slideshow',
    ],
    defaultPlugins: [
      {
        pluginId: 'company-slideshow',
        area: AREAS.HERO,
        priority: 10,
      },
      {
        pluginId: 'company-info-widget',
        area: AREAS.SIDEBAR_LEFT,
        priority: 5,
      },
      {
        pluginId: 'company-values-widget',
        area: AREAS.SIDEBAR_LEFT,
        priority: 15,
      },
      {
        pluginId: 'company-team-widget',
        area: AREAS.SIDEBAR_RIGHT,
        priority: 5,
      },
    ],
  },

  // Demo Home Page
  '/demo-home': {
    allowedPlugins: [
      'demo-slideshow',
      'demo-user-stats',
      'demo-quick-actions',
      'demo-recent-posts',
    ],
    defaultPlugins: [
      {
        pluginId: 'demo-slideshow',
        area: AREAS.HERO,
        priority: 10,
      },
      {
        pluginId: 'demo-user-stats',
        area: AREAS.SIDEBAR_LEFT,
        priority: 10,
      },
      {
        pluginId: 'demo-quick-actions',
        area: AREAS.SIDEBAR_LEFT,
        priority: 20,
      },
      {
        pluginId: 'demo-recent-posts',
        area: AREAS.SIDEBAR_RIGHT,
        priority: 10,
      },
    ],
  },

  // Demo Areas Page
  '/demo/areas': {
    allowedPlugins: [
      'slideshow-demo',
      'user-stats-demo',
      'quick-actions-demo',
      'recent-posts-demo',
    ],
    defaultPlugins: [
      {
        pluginId: 'slideshow-demo',
        area: AREAS.HERO,
        priority: 10,
      },
      {
        pluginId: 'user-stats-demo',
        area: AREAS.SIDEBAR_LEFT,
        priority: 10,
      },
      {
        pluginId: 'quick-actions-demo',
        area: AREAS.SIDEBAR_LEFT,
        priority: 20,
      },
      {
        pluginId: 'recent-posts-demo',
        area: AREAS.SIDEBAR_RIGHT,
        priority: 10,
      },
    ],
  },

  // Plugin Demo Pages - Show all for demonstration
  '/demo/plugins': {
    allowedPlugins: ['*'], // Allow all plugins
  },

  '/dashboard/plugins': {
    allowedPlugins: ['*'], // Allow all plugins
  },

  // Default fallback for other pages
  '*': {
    allowedPlugins: [], // No plugins by default
  },
};

/**
 * Get plugin configuration for a specific page
 */
export function getPagePluginConfig(pathname: string) {
  // Try exact match first
  if (pagePluginConfig[pathname]) {
    return pagePluginConfig[pathname];
  }

  // Try partial matches
  for (const [path, config] of Object.entries(pagePluginConfig)) {
    if (path !== '*' && pathname.startsWith(path)) {
      return config;
    }
  }

  // Return default config
  return pagePluginConfig['*'];
}

/**
 * Check if a plugin is allowed on a specific page
 */
export function isPluginAllowedOnPage(pathname: string, pluginId: string): boolean {
  const config = getPagePluginConfig(pathname);

  if (!config) {
    return false;
  }

  // If allowedPlugins contains '*', allow all plugins
  if (config.allowedPlugins.includes('*')) {
    return true;
  }

  return config.allowedPlugins.includes(pluginId);
}
