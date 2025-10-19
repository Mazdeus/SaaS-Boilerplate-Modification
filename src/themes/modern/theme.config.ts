/**
 * Modern Theme Configuration
 * Bold, colorful, contemporary design
 */

import type { ThemeConfig } from '@/core/types';

export const modernTheme: ThemeConfig = {
  id: 'modern',
  name: 'Modern',
  description: 'Bold and colorful contemporary design',
  colors: {
    primary: '#ec4899', // Pink
    secondary: '#f59e0b', // Amber
    background: '#fafafa',
    foreground: '#18181b',
    accent: '#a855f7', // Purple
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
  },
  styles: {
    borderRadius: '1rem',
    spacing: '1.5rem',
  },
};
