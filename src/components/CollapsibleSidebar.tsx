'use client';

/**
 * Collapsible Sidebar Component
 * Part of Layout & Partial System - Templating Praktikum
 * Demonstrates dynamic area rendering with user interaction
 */

import React, { useEffect } from 'react';

import { AreaRenderer } from '@/components/AreaRenderer';
import type { AreaType } from '@/core/types';

type CollapsibleSidebarProps = {
  area: AreaType;
  position: 'left' | 'right';
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  fallback?: React.ReactNode;
};

export function CollapsibleSidebar({
  area,
  position,
  isOpen,
  onClose,
  isMobile,
  fallback,
}: CollapsibleSidebarProps) {
  // Close sidebar on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Mobile: Overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 z-50 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[320px] md:w-[360px]${
            position === 'left' ? 'left-0' : 'right-0'
          } ${
            isOpen
              ? 'translate-x-0'
              : position === 'left'
                ? '-translate-x-full'
                : 'translate-x-full'
          }`}
        >
          {/* Close Button */}
          <div className="flex items-center justify-between border-b bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">
              {position === 'left' ? 'Left Sidebar' : 'Right Sidebar'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
              aria-label="Close sidebar"
            >
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
          </div>

          {/* Sidebar Content */}
          <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">
            <AreaRenderer area={area} fallback={fallback} />
          </div>
        </aside>
      </>
    );
  }

  // Desktop: Always visible (collapsible) - Seamless integration
  return (
    <aside
      className={`border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72 opacity-100' : 'w-0 border-0 opacity-0'
      } shrink-0 overflow-hidden`}
    >
      {isOpen && (
        <div className="h-full p-4">
          <div className="space-y-4">
            <AreaRenderer area={area} fallback={fallback} />
          </div>
        </div>
      )}
    </aside>
  );
}
