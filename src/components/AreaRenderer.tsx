'use client';

/**
 * Area Renderer Component
 * Renders all components registered to a specific area
 */

import React from 'react';

import { useArea } from '@/contexts/AreaContext';
import type { AreaType } from '@/core/types';

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
  const components = getComponents(area);

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
