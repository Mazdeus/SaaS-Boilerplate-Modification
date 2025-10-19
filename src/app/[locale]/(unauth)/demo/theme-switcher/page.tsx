'use client';

/**
 * Theme Switcher Demo Page
 * Demonstrates theme switching functionality
 */

import React from 'react';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSwitcherPage() {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            🎨 Theme Switcher Demo
          </h1>
          <p className="text-lg text-gray-600">
            Switch between different themes to see the visual changes
          </p>
        </div>

        {/* Current Theme Info */}
        <div className="mb-8 rounded-lg border-2 border-blue-500 bg-blue-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-blue-900">
            Current Theme:
            {' '}
            {currentTheme.name}
          </h2>
          <p className="text-blue-700">{currentTheme.description}</p>
        </div>

        {/* Theme Selection */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Select a Theme
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableThemes.map(theme => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`rounded-lg border-2 p-6 text-left transition-all ${
                  currentTheme.id === theme.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {theme.name}
                  </h3>
                  {currentTheme.id === theme.id && (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                      Active
                    </span>
                  )}
                </div>

                <p className="mb-4 text-sm text-gray-600">{theme.description}</p>

                {/* Color Preview */}
                <div className="mb-3">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Colors:
                  </p>
                  <div className="flex gap-2">
                    <div
                      className="size-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="size-8 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="size-8 rounded border"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                {/* Font Preview */}
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Font:</p>
                  <p
                    className="text-sm"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {theme.fonts.heading}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Features Demo */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Theme Preview
          </h2>

          <div className="space-y-6">
            {/* Buttons */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Buttons
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Secondary Button
                </button>
                <button
                  type="button"
                  className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  Accent Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Cards
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-lg border bg-gray-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">
                      Card
                      {' '}
                      {i}
                    </h4>
                    <p className="text-sm text-gray-600">
                      This is a sample card component
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Typography
              </h3>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  Heading 1
                </h1>
                <h2 className="text-3xl font-bold text-gray-900">
                  Heading 2
                </h2>
                <h3 className="text-2xl font-bold text-gray-900">
                  Heading 3
                </h3>
                <p className="text-gray-600">
                  This is a regular paragraph with body text. The font changes
                  based on the selected theme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
