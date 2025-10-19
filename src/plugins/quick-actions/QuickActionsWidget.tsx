'use client';

/**
 * Quick Actions Widget Plugin
 * Displays quick action buttons
 */

import Link from 'next/link';
import React from 'react';

export function QuickActionsWidget() {
  const actions = [
    {
      label: 'New Project',
      href: '#',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Export Data',
      href: '/dashboard/export-demo',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Settings',
      href: '#',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
    {
      label: 'Support',
      href: '#',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={`action-${action.label}-${index}`}
            href={action.href}
            className={`flex items-center justify-center rounded-lg ${action.color} p-4 text-center text-white transition-colors`}
          >
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
