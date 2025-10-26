'use client';

/**
 * Area Renderer Component
 * Renders all components registered to a specific area
 */

import React, { useEffect, useState } from 'react';

import { useArea } from '@/contexts/AreaContext';
import type { AreaComponent, AreaType } from '@/core/types';

type AreaRendererProps = {
  area: AreaType;
  className?: string;
  fallback?: React.ReactNode;
};

export function AreaRenderer({
  area,
  className = '',
  fallback = null,
}: AreaRendererProps) {
  const { getComponents } = useArea();
  const [components, setComponents] = useState<AreaComponent[]>([]);

  // Update components when they change
  useEffect(() => {
    const updateComponents = () => {
      const newComponents = getComponents(area);
      setComponents(newComponents);
    };

    // Initial load
    updateComponents();

    // Poll for changes (simple solution)
    const interval = setInterval(updateComponents, 200);

    return () => clearInterval(interval);
  }, [area, getComponents]);

  if (components.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <div className={`area-${area} ${className}`} data-area={area}>
      {components.map((areaComponent) => {
        const Component = areaComponent.component;
        return (
          <div
            key={areaComponent.id}
            className="area-component"
            data-component-id={areaComponent.id}
            data-priority={areaComponent.priority}
          >
            <Component {...(areaComponent.props || {})} />
          </div>
        );
      })}
    </div>
  );
}
