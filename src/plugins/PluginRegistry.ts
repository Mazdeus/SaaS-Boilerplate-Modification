/**
 * Plugin Registry
 * Central registry for all plugins
 */

import type { AreaType, Plugin } from '@/core/types';
import { logger } from '@/libs/Logger';

class PluginRegistry {
  private plugins: Map<string, Plugin>;
  private storageKey = 'plugin-registry-state';

  constructor() {
    this.plugins = new Map();
    this.loadState();
  }

  // ============================================================================
  // REGISTRATION
  // ============================================================================

  register(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    this.saveState();
    logger.info(`[PluginRegistry] Registered plugin: ${plugin.name}`);
  }

  unregister(pluginId: string): void {
    this.plugins.delete(pluginId);
    this.saveState();
    logger.info(`[PluginRegistry] Unregistered plugin: ${pluginId}`);
  }

  // ============================================================================
  // RETRIEVAL
  // ============================================================================

  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getEnabled(): Plugin[] {
    return this.getAll().filter(p => p.enabled);
  }

  getByArea(area: AreaType): Plugin[] {
    return this.getAll().filter(p => p.areas.includes(area) && p.enabled);
  }

  // ============================================================================
  // MANAGEMENT
  // ============================================================================

  enable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
      this.saveState();
      logger.info(`[PluginRegistry] Enabled plugin: ${pluginId}`);
    }
  }

  disable(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
      this.saveState();
      logger.info(`[PluginRegistry] Disabled plugin: ${pluginId}`);
    }
  }

  togglePlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = !plugin.enabled;
      this.saveState();
      logger.info(
        `[PluginRegistry] Toggled plugin: ${pluginId} to ${plugin.enabled}`,
      );
    }
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  private saveState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const state: Record<string, any> = {};

      this.plugins.forEach((plugin, id) => {
        state[id] = {
          enabled: plugin.enabled,
          config: plugin.config,
        };
      });

      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      logger.error('[PluginRegistry] Failed to save state:', error);
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

      // State will be applied when plugins are registered
      JSON.parse(stored); // Validate JSON format
      logger.info('[PluginRegistry] State loaded');
    } catch (error) {
      logger.error('[PluginRegistry] Failed to load state:', error);
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  getStats() {
    return {
      total: this.plugins.size,
      enabled: this.getEnabled().length,
      disabled: this.getAll().filter(p => !p.enabled).length,
    };
  }
}

// Export singleton
export const pluginRegistry = new PluginRegistry();

export default PluginRegistry;
