'use client';

/**
 * Export Demo Page
 * Demonstrates data export functionality
 */

import React, { useState } from 'react';

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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Export Data Demo
        </h1>
        <p className="text-gray-600">
          Export table data to various formats (CSV, Excel, JSON)
        </p>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Export Options
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <span>📄</span>
            Export to CSV
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <span>📊</span>
            Export to Excel
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            <span>📋</span>
            Export to JSON
          </button>
        </div>

        {exportStatus && (
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-blue-800">
            {exportStatus}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
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
        <div className="rounded-lg border bg-green-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            📄 CSV Export
          </h3>
          <p className="text-sm text-green-700">
            Comma-Separated Values format. Compatible with Excel, Google Sheets,
            and most data analysis tools.
          </p>
        </div>

        <div className="rounded-lg border bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">
            📊 Excel Export
          </h3>
          <p className="text-sm text-blue-700">
            Microsoft Excel format (.xlsx). Preserves formatting and can be
            opened directly in Excel.
          </p>
        </div>

        <div className="rounded-lg border bg-purple-50 p-6">
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
      <div className="mt-8 rounded-lg border bg-gray-50 p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          💡 Implementation Details
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Export Helper Location:</strong>
            {' '}
            <code className="rounded bg-gray-200 px-2 py-1">
              src/helpers/exportHelper.ts
            </code>
          </p>
          <p>
            <strong>Functions Used:</strong>
            {' '}
            downloadCSV(), downloadExcel(),
            downloadJSON()
          </p>
          <p>
            <strong>Features:</strong>
            {' '}
            Client-side export, no server required,
            instant download
          </p>
        </div>
      </div>
    </div>
  );
}
