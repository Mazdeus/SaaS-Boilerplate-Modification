'use client';

/**
 * Area Context Provider
 * Provides area/region management across the application
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { areaManager } from '@/core/AreaManager';
import type { AreaComponent, AreaContextType, AreaType } from '@/core/types';
import { logger } from '@/libs/Logger';

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export function AreaProvider({ children }: { children: React.ReactNode }) {
  const [, forceUpdate] = useState({});

  // Force re-render when areas change
  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    logger.info('[AreaProvider] Initialized');
  }, []);

  const registerComponent = useCallback(
    (area: AreaType, component: AreaComponent) => {
      // Check if component is already registered to prevent unnecessary re-renders
      const existing = areaManager.getComponent(area, component.id);
      if (existing && existing.component === component.component) {
        logger.info(`[AreaContext] Component "${component.id}" already registered to "${area}", skipping...`);
        return;
      }

      areaManager.register(area, component);
      refresh();
    },
    [refresh],
  );

  const unregisterComponent = useCallback(
    (area: AreaType, componentId: string) => {
      areaManager.unregister(area, componentId);
      refresh();
    },
    [refresh],
  );

  const getComponents = useCallback((area: AreaType) => {
    return areaManager.getComponents(area);
  }, []);

  const toggleComponent = useCallback(
    (area: AreaType, componentId: string) => {
      areaManager.toggleComponent(area, componentId);
      refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({
      areas: new Map(), // This will be populated by areaManager
      registerComponent,
      unregisterComponent,
      getComponents,
      toggleComponent,
    }),
    [registerComponent, unregisterComponent, getComponents, toggleComponent],
  );

  return <AreaContext.Provider value={value}>{children}</AreaContext.Provider>;
}

// Custom hook to use area context
export function useArea(): AreaContextType {
  const context = useContext(AreaContext);
  if (context === undefined) {
    throw new Error('useArea must be used within an AreaProvider');
  }
  return context;
}
