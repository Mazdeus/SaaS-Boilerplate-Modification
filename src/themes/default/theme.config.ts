/**
 * Default Theme Configuration
 * Clean, minimal, professional design
 */

import type { ThemeConfig } from '@/core/types';

export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'Clean and minimal professional design',
  colors: {
    primary: '#3b82f6', // Blue
    secondary: '#64748b', // Slate
    background: '#ffffff',
    foreground: '#0f172a',
    accent: '#8b5cf6', // Purple
  },
  fonts: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },
  styles: {
    borderRadius: '0.5rem',
    spacing: '1rem',
  },
};
