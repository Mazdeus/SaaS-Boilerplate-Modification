'use client';

/**
 * Export Demo Page - PUBLIC VERSION
 * Demonstrates data export functionality (Demo Mode)
 */

import Link from 'next/link';
import React, { useState } from 'react';

import { DemoBadge } from '@/components/DemoBadge';
import { downloadCSV, downloadExcel, downloadJSON } from '@/helpers';

// Sample data
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'Inactive',
    joinDate: '2024-03-10',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-04-05',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Viewer',
    status: 'Active',
    joinDate: '2024-05-12',
  },
];

export default function ExportDemoPage() {
  const [data] = useState(sampleUsers);
  const [exportStatus, setExportStatus] = useState('');

  const handleExportCSV = () => {
    try {
      downloadCSV(data, 'users-export.csv');
      setExportStatus('✅ CSV file downloaded successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch {
      setExportStatus('❌ Failed to export CSV');
    }
  };

  const handleExportExcel = () => {
    try {
      downloadExcel(data, 'users-export.xlsx');
      setExportStatus('✅ Excel file downloaded successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch {
      setExportStatus('❌ Failed to export Excel');
    }
  };

  const handleExportJSON = () => {
    try {
      downloadJSON(data, 'users-export.json');
      setExportStatus('✅ JSON file downloaded successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch {
      setExportStatus('❌ Failed to export JSON');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Export Data Demo
            </h1>
            <DemoBadge />
          </div>
          <p className="text-gray-600">
            Export table data to various formats (CSV, Excel, JSON). Try downloading the sample data below!
          </p>

          {/* Navigation */}
          <div className="mt-4 flex gap-3">
            <Link
              href="/demo-home"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Demo Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/demo/plugins"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage Plugins
            </Link>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Export Options
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              <span>📄</span>
              Export to CSV
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <span>📊</span>
              Export to Excel
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
            >
              <span>📋</span>
              Export to JSON
            </button>
          </div>

          {exportStatus && (
            <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-green-800 shadow-sm">
              {exportStatus}
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-gray-50 p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Sample Users Data (
              {data.length}
              {' '}
              records)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Join Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {user.joinDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-green-900">
              📄 CSV Export
            </h3>
            <p className="text-sm text-green-700">
              Comma-Separated Values format. Compatible with Excel, Google Sheets,
              and most data analysis tools.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-blue-900">
              📊 Excel Export
            </h3>
            <p className="text-sm text-blue-700">
              Microsoft Excel format (.xlsx). Preserves formatting and can be
              opened directly in Excel.
            </p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
            <h3 className="mb-2 text-lg font-semibold text-purple-900">
              📋 JSON Export
            </h3>
            <p className="text-sm text-purple-700">
              JavaScript Object Notation. Ideal for API integration and data
              interchange between systems.
            </p>
          </div>
        </div>

        {/* Implementation Info */}
        <div className="mt-8 rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            💡 Implementation Details
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Export Helper Location:</strong>
              {' '}
              <code className="rounded bg-white px-2 py-1 font-mono text-xs">
                src/helpers/exportHelper.ts
              </code>
            </p>
            <p>
              <strong>Functions Used:</strong>
              {' '}
              <code className="rounded bg-white px-2 py-1 font-mono text-xs">
                downloadCSV()
              </code>
              ,
              {' '}
              <code className="rounded bg-white px-2 py-1 font-mono text-xs">
                downloadExcel()
              </code>
              ,
              {' '}
              <code className="rounded bg-white px-2 py-1 font-mono text-xs">
                downloadJSON()
              </code>
            </p>
            <p>
              <strong>Features:</strong>
              {' '}
              Client-side export, no server required,
              instant download, works with any data array
            </p>
            <p>
              <strong>Use Case:</strong>
              {' '}
              Perfect for exporting reports, user lists,
              analytics data, and more
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/demo/plugins"
            className="rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-white hover:from-green-700 hover:to-emerald-700"
          >
            Manage Plugins →
          </Link>
          <Link
            href="/demo/areas"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            View Areas Demo
          </Link>
          <Link
            href="/demo-home"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
