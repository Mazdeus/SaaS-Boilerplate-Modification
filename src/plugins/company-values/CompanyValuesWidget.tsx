'use client';

/**
 * Company Values Widget Plugin
 * Displays company core values
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React from 'react';

type Value = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

const values: Value[] = [
  {
    id: 1,
    icon: '🎯',
    title: 'Excellence',
    description: 'We strive for excellence in everything we do',
  },
  {
    id: 2,
    icon: '🤝',
    title: 'Collaboration',
    description: 'Teamwork makes the dream work',
  },
  {
    id: 3,
    icon: '💡',
    title: 'Innovation',
    description: 'Always pushing boundaries and thinking ahead',
  },
  {
    id: 4,
    icon: '🌟',
    title: 'Integrity',
    description: 'Honesty and transparency in all we do',
  },
];

export function CompanyValuesWidget() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Our Core Values
      </h3>

      <div className="space-y-3">
        {values.map(value => (
          <div
            key={value.id}
            className="rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">{value.icon}</span>
              <h4 className="font-semibold text-gray-900">{value.title}</h4>
            </div>
            <p className="text-sm text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
