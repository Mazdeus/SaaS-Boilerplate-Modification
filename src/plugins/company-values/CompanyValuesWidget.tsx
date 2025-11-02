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
    icon: '🚀',
    title: 'Innovation',
    description: 'Constantly pushing boundaries',
  },
  {
    id: 2,
    icon: '⭐',
    title: 'Quality',
    description: 'Delivering excellence in every project',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Collaboration',
    description: 'Working together towards success',
  },
  {
    id: 4,
    icon: '📈',
    title: 'Growth',
    description: 'Continuous learning and improvement',
  },
];

export function CompanyValuesWidget() {
  return (
    <div className="border-b border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Nilai & Filosofi Kami
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
