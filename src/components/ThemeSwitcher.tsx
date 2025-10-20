'use client';

/**
 * Theme Switcher Component
 * Allows users to switch between available themes
 */

import React, { useEffect } from 'react';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { currentTheme, availableThemes, setTheme, isLoading } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ThemeSwitcher] Current Theme:', currentTheme);
    // eslint-disable-next-line no-console
    console.log('[ThemeSwitcher] Available Themes:', availableThemes);
  }, [currentTheme, availableThemes]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Loading themes...</span>
      </div>
    );
  }

  if (!availableThemes || availableThemes.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-500">No themes available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme?.id || 'default'}
        onChange={(e) => {
          // eslint-disable-next-line no-console
          console.log('[ThemeSwitcher] Switching to:', e.target.value);
          setTheme(e.target.value);
        }}
        className="min-w-[120px] cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {availableThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
