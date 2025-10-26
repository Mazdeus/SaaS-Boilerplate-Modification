'use client';

/**
 * User Stats Widget Plugin
 * Displays user statistics
 */

import React from 'react';

export function UserStatsWidget() {
  const stats = [
    { label: 'Active Users', value: '1,234', color: 'bg-blue-500' },
    { label: 'Projects', value: '56', color: 'bg-green-500' },
    { label: 'Storage Used', value: '2.3 GB', color: 'bg-purple-500' },
    { label: 'API Calls', value: '45.2K', color: 'bg-orange-500' },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Your Statistics
      </h3>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={`stat-${stat.label}-${index}`}
            className="flex items-center justify-between rounded-md bg-gray-50 p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-3 rounded-full ${stat.color}`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                <p className="text-xs text-gray-500">Last updated: Today</p>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
}
