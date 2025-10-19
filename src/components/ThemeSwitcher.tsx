'use client';

/**
 * Theme Switcher Component
 * Allows users to switch between available themes
 */

import React from 'react';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="text-sm font-medium">
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentTheme.id}
        onChange={e => setTheme(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
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
