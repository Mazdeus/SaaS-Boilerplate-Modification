/**
 * Theme Manager
 * Manages theme switching and theme configurations
 * Practical Week 8 - Templating Concepts
 */

import { logger } from '@/libs/Logger';

import type { ThemeConfig } from './types';

class ThemeManager {
  private themes: Map<string, ThemeConfig>;
  private currentThemeId: string;
  private storageKey = 'theme-preference';

  constructor() {
    this.themes = new Map();
    this.currentThemeId = 'default';
    this.loadPreference();
  }

  // ============================================================================
  // THEME REGISTRATION
  // ============================================================================

  /**
   * Register a new theme
   */
  registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);
    logger.info(`[ThemeManager] Theme registered: ${theme.name}`);
  }

  /**
   * Unregister a theme
   */
  unregisterTheme(themeId: string): void {
    if (this.currentThemeId === themeId) {
      logger.warn(`[ThemeManager] Cannot unregister active theme: ${themeId}`);
      return;
    }

    this.themes.delete(themeId);
    logger.info(`[ThemeManager] Theme unregistered: ${themeId}`);
  }

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  /**
   * Set active theme
   */
  setTheme(themeId: string): boolean {
    if (!this.themes.has(themeId)) {
      logger.error(`[ThemeManager] Theme not found: ${themeId}`);
      return false;
    }

    this.currentThemeId = themeId;
    this.savePreference();
    this.applyTheme();

    logger.info(`[ThemeManager] Theme changed to: ${themeId}`);
    return true;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): ThemeConfig | undefined {
    return this.themes.get(this.currentThemeId);
  }

  /**
   * Get theme by ID
   */
  getTheme(themeId: string): ThemeConfig | undefined {
    return this.themes.get(themeId);
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get current theme ID
   */
  getCurrentThemeId(): string {
    return this.currentThemeId;
  }

  // ============================================================================
  // THEME APPLICATION
  // ============================================================================

  /**
   * Apply theme CSS variables to document
   */
  private applyTheme(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const theme = this.getCurrentTheme();
    if (!theme) {
      return;
    }

    const root = document.documentElement;

    // Apply colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }

    // Apply fonts
    if (theme.fonts) {
      Object.entries(theme.fonts).forEach(([key, value]) => {
        root.style.setProperty(`--theme-font-${key}`, value);
      });
    }

    // Apply styles
    if (theme.styles) {
      Object.entries(theme.styles).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }

    // Update data attribute for CSS selectors
    root.setAttribute('data-theme', theme.id);

    logger.info(`[ThemeManager] Theme applied: ${theme.name}`);
  }

  /**
   * Initialize theme on app start
   */
  initialize(): void {
    this.applyTheme();
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  private savePreference(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, this.currentThemeId);
    } catch (error) {
      logger.error('[ThemeManager] Failed to save preference:', error);
    }
  }

  private loadPreference(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.currentThemeId = stored;
      }
    } catch (error) {
      logger.error('[ThemeManager] Failed to load preference:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalThemes: this.themes.size,
      currentTheme: this.currentThemeId,
      availableThemes: Array.from(this.themes.keys()),
    };
  }

  /**
   * Reset to default theme
   */
  reset(): void {
    this.setTheme('default');
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

export default ThemeManager;
