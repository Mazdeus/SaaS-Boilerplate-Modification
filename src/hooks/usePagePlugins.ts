/**
 * Page-Based Plugin Management Hook
 * Automatically manages plugins based on current page
 */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useArea } from '@/contexts/AreaContext';
import { areaManager } from '@/core/AreaManager';
import { getPagePluginConfig } from '@/core/PagePluginConfig';
import { AREAS, type AreaType } from '@/core/types';
import { logger } from '@/libs/Logger';

type PagePluginMapping = {
  [pluginId: string]: {
    component: React.ComponentType<any>;
    area: AreaType;
    priority: number;
  };
};

export function usePagePlugins(pluginMapping: PagePluginMapping) {
  const pathname = usePathname();
  const { registerComponent } = useArea();

  useEffect(() => {
    const config = getPagePluginConfig(pathname);

    if (!config) {
      logger.warn(`[usePagePlugins] No config found for page: ${pathname}`);
      return;
    }

    // Clear all areas first to prevent conflicts
    Object.values(AREAS).forEach((area) => {
      areaManager.clearArea(area);
    });

    // Register only allowed plugins for this page
    if (config.defaultPlugins) {
      config.defaultPlugins.forEach(({ pluginId, area, priority = 10 }) => {
        const plugin = pluginMapping[pluginId];

        if (plugin) {
          registerComponent(area, {
            id: pluginId,
            component: plugin.component,
            priority,
            enabled: true,
            areaId: area,
          });

          logger.info(`[usePagePlugins] Registered ${pluginId} to ${area} for page ${pathname}`);
        } else {
          logger.warn(`[usePagePlugins] Plugin ${pluginId} not found in mapping`);
        }
      });
    }

    // Optional: Register additional plugins that are allowed but not in defaults
    config.allowedPlugins.forEach((pluginId) => {
      if (pluginId === '*') {
        return;
      } // Skip wildcard

      const plugin = pluginMapping[pluginId];
      const isAlreadyRegistered = config.defaultPlugins?.some(p => p.pluginId === pluginId);

      if (plugin && !isAlreadyRegistered) {
        // Register to default area or first available area
        const targetArea = plugin.area || AREAS.SIDEBAR_LEFT;

        registerComponent(targetArea, {
          id: pluginId,
          component: plugin.component,
          priority: plugin.priority || 50, // Lower priority for non-default plugins
          enabled: false, // Disabled by default, can be enabled manually
          areaId: targetArea,
        });
      }
    });
  }, [pathname, pluginMapping, registerComponent]);
}

/**
 * Simplified hook for common use cases
 */
export function useAutoPagePlugins() {
  const pathname = usePathname();

  useEffect(() => {
    const config = getPagePluginConfig(pathname);

    if (!config || !config.defaultPlugins) {
      return;
    }

    // Clear areas that will be used
    const areasToUse = config.defaultPlugins.map(p => p.area);
    const uniqueAreas = [...new Set(areasToUse)];

    uniqueAreas.forEach((area) => {
      areaManager.clearArea(area);
    });

    logger.info(`[useAutoPagePlugins] Auto-configured plugins for page: ${pathname}`);
  }, [pathname]);
}
