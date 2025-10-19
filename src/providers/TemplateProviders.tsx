'use client';

/**
 * Template Providers
 * Wraps all templating system providers
 */

import React from 'react';

import { AreaProvider } from '@/contexts/AreaContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function TemplateProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AreaProvider>{children}</AreaProvider>
    </ThemeProvider>
  );
}
