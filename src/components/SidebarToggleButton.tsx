'use client';

/**
 * Sidebar Toggle Button Component
 * Part of Layout & Partial System - Templating Praktikum
 * Burger menu button to toggle collapsible sidebars
 */

import React from 'react';

type SidebarToggleButtonProps = {
  onClick: () => void;
  position: 'left' | 'right';
  className?: string;
  ariaLabel?: string;
};

export function SidebarToggleButton({
  onClick,
  position,
  className = '',
  ariaLabel,
}: SidebarToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={ariaLabel || `Toggle ${position} sidebar`}
      type="button"
    >
      {/* Hamburger Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

/**
 * Sidebar Close Button Component
 * X icon for closing sidebar
 */
type SidebarCloseButtonProps = {
  onClick: () => void;
  className?: string;
};

export function SidebarCloseButton({
  onClick,
  className = '',
}: SidebarCloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label="Close sidebar"
      type="button"
    >
      {/* X Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
