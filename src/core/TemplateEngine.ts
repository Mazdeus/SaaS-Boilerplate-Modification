/**
 * Template Engine Abstraction
 * Provides abstraction layer between code and template rendering
 * Practical Week 8 - Templating Concepts
 */

import type { ComponentType } from 'react';

import { logger } from '@/libs/Logger';

import type {
  ComponentRegistry,
  LayoutProps,
  PartialProps,
  TemplateEngineConfig,
} from './types';

class TemplateEngine {
  private config: TemplateEngineConfig;
  private registry: ComponentRegistry;

  constructor(config?: Partial<TemplateEngineConfig>) {
    this.config = {
      defaultTheme: 'default',
      enableAreaSystem: true,
      enablePluginSystem: true,
      storageKey: 'template-engine-config',
      ...config,
    };

    this.registry = {
      layouts: new Map(),
      partials: new Map(),
      components: new Map(),
    };

    this.loadConfig();
  }

  // ============================================================================
  // COMPONENT REGISTRATION
  // ============================================================================

  registerLayout(name: string, component: ComponentType<LayoutProps>): void {
    this.registry.layouts.set(name, component);
    logger.info(`[TemplateEngine] Layout registered: ${name}`);
  }

  registerPartial(name: string, component: ComponentType<PartialProps>): void {
    this.registry.partials.set(name, component);
    logger.info(`[TemplateEngine] Partial registered: ${name}`);
  }

  registerComponent(name: string, component: ComponentType<any>): void {
    this.registry.components.set(name, component);
    logger.info(`[TemplateEngine] Component registered: ${name}`);
  }

  // ============================================================================
  // COMPONENT RETRIEVAL
  // ============================================================================

  getLayout(name: string): ComponentType<LayoutProps> | undefined {
    return this.registry.layouts.get(name);
  }

  getPartial(name: string): ComponentType<PartialProps> | undefined {
    return this.registry.partials.get(name);
  }

  getComponent(name: string): ComponentType<any> | undefined {
    return this.registry.components.get(name);
  }

  getAllLayouts(): Map<string, ComponentType<LayoutProps>> {
    return this.registry.layouts;
  }

  getAllPartials(): Map<string, ComponentType<PartialProps>> {
    return this.registry.partials;
  }

  getAllComponents(): Map<string, ComponentType<any>> {
    return this.registry.components;
  }

  // ============================================================================
  // CONFIGURATION MANAGEMENT
  // ============================================================================

  getConfig(): TemplateEngineConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<TemplateEngineConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
    };
    this.saveConfig();
  }

  private loadConfig(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      logger.error('[TemplateEngine] Failed to load config:', error);
    }
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.config),
      );
    } catch (error) {
      logger.error('[TemplateEngine] Failed to save config:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  clear(): void {
    this.registry.layouts.clear();
    this.registry.partials.clear();
    this.registry.components.clear();
    logger.info('[TemplateEngine] Registry cleared');
  }

  getStats() {
    return {
      layouts: this.registry.layouts.size,
      partials: this.registry.partials.size,
      components: this.registry.components.size,
    };
  }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();

export default TemplateEngine;
