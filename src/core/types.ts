/**
 * Core Type Definitions for Templating System
 * Practical Week 8 - Templating Concepts
 */

import type { ComponentType, ReactNode } from 'react';

// ============================================================================
// THEME SYSTEM TYPES
// ============================================================================

export type ThemeConfig = {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    borderRadius: string;
    spacing: string;
  };
};

export type ThemeContextType = {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  setTheme: (themeId: string) => void;
  isLoading: boolean;
};

// ============================================================================
// AREA/REGION SYSTEM TYPES
// ============================================================================

export const AREAS = {
  HERO: 'hero',
  SIDEBAR_LEFT: 'sidebar-left',
  SIDEBAR_RIGHT: 'sidebar-right',
  CONTENT_BEFORE: 'content-before',
  CONTENT_AFTER: 'content-after',
  FOOTER_WIDGETS: 'footer-widgets',
  DASHBOARD_WIDGETS: 'dashboard-widgets',
  HEADER_EXTRA: 'header-extra',
} as const;

export type AreaType = typeof AREAS[keyof typeof AREAS];

export type AreaComponent = {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
  priority: number;
  enabled: boolean;
  areaId: AreaType;
};

export type AreaContextType = {
  areas: Map<AreaType, AreaComponent[]>;
  registerComponent: (area: AreaType, component: AreaComponent) => void;
  unregisterComponent: (area: AreaType, componentId: string) => void;
  getComponents: (area: AreaType) => AreaComponent[];
  toggleComponent: (area: AreaType, componentId: string) => void;
};

// ============================================================================
// PLUGIN SYSTEM TYPES
// ============================================================================

export type Plugin = {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  areas: AreaType[];
  component: ComponentType<any>;
  config?: Record<string, any>;
  enabled: boolean;
  icon?: ReactNode;
};

export type PluginRegistry = {
  plugins: Map<string, Plugin>;
  register: (plugin: Plugin) => void;
  unregister: (pluginId: string) => void;
  get: (pluginId: string) => Plugin | undefined;
  getAll: () => Plugin[];
  getByArea: (area: AreaType) => Plugin[];
  enable: (pluginId: string) => void;
  disable: (pluginId: string) => void;
  togglePlugin: (pluginId: string) => void;
};

// ============================================================================
// LAYOUT SYSTEM TYPES
// ============================================================================

export type LayoutProps = {
  children: ReactNode;
  theme?: ThemeConfig;
  className?: string;
};

export type PartialProps = {
  className?: string;
  [key: string]: any;
};

// ============================================================================
// TEMPLATE ENGINE TYPES
// ============================================================================

export type TemplateEngineConfig = {
  defaultTheme: string;
  enableAreaSystem: boolean;
  enablePluginSystem: boolean;
  storageKey: string;
};

export type ComponentRegistry = {
  layouts: Map<string, ComponentType<LayoutProps>>;
  partials: Map<string, ComponentType<PartialProps>>;
  components: Map<string, ComponentType<any>>;
};

// ============================================================================
// EXPORT HELPER TYPES
// ============================================================================

export type ExportOptions = {
  filename?: string;
  fields?: string[];
  sheetName?: string;
};

export type ExportFormat = 'csv' | 'excel' | 'json';

// ============================================================================
// STORAGE TYPES
// ============================================================================

export type TemplateStorage = {
  theme: string;
  plugins: Record<string, boolean>;
  areas: Record<string, string[]>;
};
