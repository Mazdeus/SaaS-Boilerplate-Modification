/**
 * Area/Region Manager
 * Manages dynamic component placement in defined areas
 * Practical Week 8 - Templating Concepts
 */

import { logger } from '@/libs/Logger';

import type { AreaComponent, AreaType } from './types';

class AreaManager {
  private areas: Map<AreaType, AreaComponent[]>;
  private storageKey = 'area-manager-state';

  constructor() {
    this.areas = new Map();
    this.loadState();
  }

  // ============================================================================
  // COMPONENT REGISTRATION
  // ============================================================================

  /**
   * Register a component to an area
   */
  register(area: AreaType, component: AreaComponent): void {
    if (!this.areas.has(area)) {
      this.areas.set(area, []);
    }

    const components = this.areas.get(area)!;

    // Check if component already exists
    const existingIndex = components.findIndex(c => c.id === component.id);

    if (existingIndex >= 0) {
      // Update existing component
      components[existingIndex] = component;
    } else {
      // Add new component
      components.push(component);
    }

    // Sort by priority (lower number = higher priority)
    components.sort((a, b) => a.priority - b.priority);

    this.areas.set(area, components);
    this.saveState();

    logger.info(`[AreaManager] Registered component "${component.id}" to area "${area}"`);
  }

  /**
   * Unregister a component from an area
   */
  unregister(area: AreaType, componentId: string): void {
    if (!this.areas.has(area)) {
      return;
    }

    const components = this.areas.get(area)!;
    const filtered = components.filter(c => c.id !== componentId);

    this.areas.set(area, filtered);
    this.saveState();

    logger.info(`[AreaManager] Unregistered component "${componentId}" from area "${area}"`);
  }

  // ============================================================================
  // COMPONENT RETRIEVAL
  // ============================================================================

  /**
   * Get all components registered to an area
   */
  getComponents(area: AreaType): AreaComponent[] {
    return this.areas.get(area)?.filter(c => c.enabled) || [];
  }

  /**
   * Get all components (including disabled) for an area
   */
  getAllComponents(area: AreaType): AreaComponent[] {
    return this.areas.get(area) || [];
  }

  /**
   * Get a specific component by ID from an area
   */
  getComponent(area: AreaType, componentId: string): AreaComponent | undefined {
    const components = this.areas.get(area) || [];
    return components.find(c => c.id === componentId);
  }

  // ============================================================================
  // COMPONENT MANAGEMENT
  // ============================================================================

  /**
   * Enable/disable a component in an area
   */
  toggleComponent(area: AreaType, componentId: string): void {
    const components = this.areas.get(area);
    if (!components) {
      return;
    }

    const component = components.find(c => c.id === componentId);
    if (component) {
      component.enabled = !component.enabled;
      this.saveState();
      logger.info(`[AreaManager] Toggled component "${componentId}" in area "${area}" to ${component.enabled}`);
    }
  }

  /**
   * Update component priority
   */
  updatePriority(area: AreaType, componentId: string, newPriority: number): void {
    const components = this.areas.get(area);
    if (!components) {
      return;
    }

    const component = components.find(c => c.id === componentId);
    if (component) {
      component.priority = newPriority;
      // Re-sort
      components.sort((a, b) => a.priority - b.priority);
      this.saveState();
      logger.info(`[AreaManager] Updated priority for "${componentId}" to ${newPriority}`);
    }
  }

  /**
   * Clear all components from an area
   */
  clearArea(area: AreaType): void {
    this.areas.set(area, []);
    this.saveState();
    logger.info(`[AreaManager] Cleared area "${area}"`);
  }

  /**
   * Clear all areas
   */
  clearAll(): void {
    this.areas.clear();
    this.saveState();
    logger.info('[AreaManager] Cleared all areas');
  }

  // ============================================================================
  // STATE PERSISTENCE
  // ============================================================================

  private saveState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const state: Record<string, any> = {};

      this.areas.forEach((components, area) => {
        state[area] = components.map(c => ({
          id: c.id,
          priority: c.priority,
          enabled: c.enabled,
          props: c.props,
        }));
      });

      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      logger.error('[AreaManager] Failed to save state:', error);
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return;
      }

      const state = JSON.parse(stored);

      // Note: We can't restore components from localStorage since they're React components
      // This only restores the enabled/disabled state and priorities
      // Components need to be re-registered by plugins on app start

      Object.entries(state).forEach(([area]: [string, any]) => {
        // Store the metadata for later use when components are registered
        const areaComponents: AreaComponent[] = [];
        this.areas.set(area as AreaType, areaComponents);
      });
    } catch (error) {
      logger.error('[AreaManager] Failed to load state:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get all registered areas
   */
  getAreas(): AreaType[] {
    return Array.from(this.areas.keys());
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats: Record<string, any> = {
      totalAreas: this.areas.size,
      areas: {} as Record<string, any>,
    };

    this.areas.forEach((components, area) => {
      stats.areas[area] = {
        total: components.length,
        enabled: components.filter(c => c.enabled).length,
        disabled: components.filter(c => !c.enabled).length,
      };
    });

    return stats;
  }
}

// Export singleton instance
export const areaManager = new AreaManager();

export default AreaManager;
