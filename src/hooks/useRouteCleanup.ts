/**
 * Route Cleanup Hook
 * Automatically cleans up area components when route changes
 */

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { areaManager } from '@/core/AreaManager';
import type { AreaType } from '@/core/types';
import { logger } from '@/libs/Logger';

type RouteCleanupConfig = {
  areas?: AreaType[];
  clearAll?: boolean;
  pattern?: string;
};

export function useRouteCleanup(config: RouteCleanupConfig = {}) {
  const pathname = usePathname();
  const previousPath = useRef<string>();

  useEffect(() => {
    // Skip on initial mount
    if (!previousPath.current) {
      previousPath.current = pathname;
      return;
    }

    // Only cleanup when route actually changes
    if (previousPath.current !== pathname) {
      logger.info(`[useRouteCleanup] Route changed from ${previousPath.current} to ${pathname}`);

      if (config.clearAll) {
        areaManager.clearAll();
      } else if (config.areas) {
        config.areas.forEach((area) => {
          areaManager.clearArea(area);
        });
      } else if (config.pattern) {
        areaManager.clearComponentsByPattern(config.pattern);
      }

      previousPath.current = pathname;
    }
  }, [pathname, config]);
}
