/**
 * Dark Theme Configuration
 * Dark mode with elegant colors
 */

import type { ThemeConfig } from '@/core/types';

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  description: 'Elegant dark mode design',
  colors: {
    primary: '#60a5fa', // Light Blue
    secondary: '#94a3b8', // Light Slate
    background: '#0f172a',
    foreground: '#f1f5f9',
    accent: '#c084fc', // Light Purple
  },
  fonts: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },
  styles: {
    borderRadius: '0.75rem',
    spacing: '1.25rem',
  },
};
