'use client';

/**
 * Theme Context Provider
 * Provides theme management across the application
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { themeManager } from '@/core/ThemeManager';
import type { ThemeConfig, ThemeContextType } from '@/core/types';
import { logger } from '@/libs/Logger';
import { darkTheme } from '@/themes/dark/theme.config';
import { defaultTheme } from '@/themes/default/theme.config';
import { modernTheme } from '@/themes/modern/theme.config';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);

  // Register all themes on mount
  useEffect(() => {
    // Register themes
    themeManager.registerTheme(defaultTheme);
    themeManager.registerTheme(modernTheme);
    themeManager.registerTheme(darkTheme);

    // Initialize theme manager
    themeManager.initialize();

    // Load current theme
    const theme = themeManager.getCurrentTheme();
    if (theme) {
      setCurrentTheme(theme);
    }

    // Get available themes after registration
    const themes = themeManager.getAvailableThemes();
    setAvailableThemes(themes);

    setIsLoading(false);

    logger.info('[ThemeProvider] Initialized with theme:', theme?.name);
    logger.info('[ThemeProvider] Available themes:', themes.length);
  }, []);

  // Set theme function
  const setTheme = useCallback((themeId: string) => {
    const success = themeManager.setTheme(themeId);
    if (success) {
      const theme = themeManager.getCurrentTheme();
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      currentTheme,
      availableThemes,
      setTheme,
      isLoading,
    }),
    [currentTheme, availableThemes, setTheme, isLoading],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
