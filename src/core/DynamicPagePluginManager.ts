/**
 * Dynamic Page Plugin Manager
 * Combines static configuration with dynamic user preferences
 */

import { areaManager } from '@/core/AreaManager';
import { isPluginAllowedOnPage } from '@/core/PagePluginConfig';
import type { AreaType } from '@/core/types';
import { logger } from '@/libs/Logger';

export type DynamicPlugin = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  author?: string;
  icon?: string;
  component: React.ComponentType<any>;
  areas: AreaType[];
  enabled: boolean;
  priority?: number;
  userToggleable?: boolean; // Can user enable/disable this plugin?
  pageRelevant?: boolean; // Is this plugin relevant for current page?
};

class DynamicPagePluginManager {
  private plugins: Map<string, DynamicPlugin> = new Map();
  private userPreferences: Map<string, boolean> = new Map();
  private storageKey = 'dynamic-page-plugins';

  constructor() {
    this.loadUserPreferences();
  }

  /**
   * Register a plugin that can be dynamically managed
   */
  registerPlugin(plugin: DynamicPlugin) {
    this.plugins.set(plugin.id, plugin);

    // Load user preference for this plugin
    const userEnabled = this.userPreferences.get(plugin.id);
    if (userEnabled !== undefined) {
      plugin.enabled = userEnabled;
    }

    logger.info(`[DynamicPagePluginManager] Registered plugin: ${plugin.id}`);
  }

  /**
   * Get plugins that are relevant for current page
   */
  getRelevantPlugins(pathname: string): DynamicPlugin[] {
    return Array.from(this.plugins.values()).filter((plugin) => {
      // Check if plugin is allowed on this page
      const isAllowed = isPluginAllowedOnPage(pathname, plugin.id);
      const isRelevant = plugin.pageRelevant ?? true;

      return isAllowed && isRelevant;
    });
  }

  /**
   * Get enabled plugins for current page
   */
  getEnabledPlugins(pathname: string): DynamicPlugin[] {
    return this.getRelevantPlugins(pathname).filter(plugin => plugin.enabled);
  }

  /**
   * Toggle a plugin on/off (user action)
   */
  togglePlugin(pluginId: string, pathname: string): boolean {
    const plugin = this.plugins.get(pluginId);

    if (!plugin) {
      logger.warn(`[DynamicPagePluginManager] Plugin not found: ${pluginId}`);
      return false;
    }

    if (!plugin.userToggleable) {
      logger.warn(`[DynamicPagePluginManager] Plugin not user-toggleable: ${pluginId}`);
      return false;
    }

    if (!isPluginAllowedOnPage(pathname, pluginId)) {
      logger.warn(`[DynamicPagePluginManager] Plugin not allowed on page: ${pluginId} on ${pathname}`);
      return false;
    }

    // Toggle the plugin
    plugin.enabled = !plugin.enabled;

    // Save user preference
    this.userPreferences.set(pluginId, plugin.enabled);
    this.saveUserPreferences();

    // Update area manager
    if (plugin.enabled) {
      // Register to first available area
      const targetArea = plugin.areas[0];
      if (targetArea) {
        areaManager.register(targetArea, {
          id: `${pluginId}-dynamic`,
          component: plugin.component,
          priority: plugin.priority || 50,
          enabled: true,
          areaId: targetArea,
        });
      }
    } else {
      // Unregister from all areas
      plugin.areas.forEach((area) => {
        areaManager.unregister(area, `${pluginId}-dynamic`);
      });
    }

    logger.info(`[DynamicPagePluginManager] Toggled plugin ${pluginId}: ${plugin.enabled}`);
    return plugin.enabled;
  }

  /**
   * Initialize plugins for a specific page
   */
  initializeForPage(pathname: string) {
    // Clear all dynamic plugins first
    this.clearDynamicPlugins();

    // Register enabled plugins for this page
    const enabledPlugins = this.getEnabledPlugins(pathname);

    enabledPlugins.forEach((plugin) => {
      const targetArea = plugin.areas[0]; // Use first area as default

      if (targetArea) {
        areaManager.register(targetArea, {
          id: `${plugin.id}-dynamic`,
          component: plugin.component,
          priority: plugin.priority || 50,
          enabled: true,
          areaId: targetArea,
        });
      }
    });

    logger.info(`[DynamicPagePluginManager] Initialized ${enabledPlugins.length} plugins for page: ${pathname}`);
  }

  /**
   * Clear all dynamic plugins from areas
   */
  private clearDynamicPlugins() {
    this.plugins.forEach((plugin) => {
      plugin.areas.forEach((area) => {
        areaManager.unregister(area, `${plugin.id}-dynamic`);
      });
    });
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const preferences: Record<string, boolean> = {};
      this.userPreferences.forEach((enabled, pluginId) => {
        preferences[pluginId] = enabled;
      });

      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch (error) {
      logger.error('[DynamicPagePluginManager] Failed to save preferences:', error);
    }
  }

  /**
   * Load user preferences from localStorage
   */
  private loadUserPreferences() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const preferences = JSON.parse(stored);
        Object.entries(preferences).forEach(([pluginId, enabled]) => {
          this.userPreferences.set(pluginId, enabled as boolean);
        });
      }
    } catch (error) {
      logger.error('[DynamicPagePluginManager] Failed to load preferences:', error);
    }
  }

  /**
   * Get statistics
   */
  getStats(pathname: string) {
    const relevant = this.getRelevantPlugins(pathname);
    const enabled = this.getEnabledPlugins(pathname);

    return {
      total: this.plugins.size,
      relevant: relevant.length,
      enabled: enabled.length,
      disabled: relevant.length - enabled.length,
    };
  }

  /**
   * Get all plugins with their current state for UI
   */
  getPluginsForUI(pathname: string): DynamicPlugin[] {
    return this.getRelevantPlugins(pathname).map(plugin => ({
      ...plugin,
      pageRelevant: isPluginAllowedOnPage(pathname, plugin.id),
    }));
  }
}

// Export singleton
export const dynamicPagePluginManager = new DynamicPagePluginManager();

export default DynamicPagePluginManager;
