'use client';

/**
 * Company Team Widget Plugin
 * Displays team members
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React from 'react';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

const teamMembers: TeamMember[] = [
  { id: 1, name: 'John Doe', role: 'CEO & Founder', avatar: '👨‍💼' },
  { id: 2, name: 'Jane Smith', role: 'CTO', avatar: '👩‍💻' },
  { id: 3, name: 'Bob Johnson', role: 'Lead Developer', avatar: '👨‍💻' },
  { id: 4, name: 'Alice Brown', role: 'Product Manager', avatar: '👩‍💼' },
];

export function CompanyTeamWidget() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Our Leadership Team
      </h3>

      <div className="space-y-3">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              {member.avatar}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        View Full Team
      </button>
    </div>
  );
}
