'use client';

/**
 * Company Values Widget Plugin
 * Displays company core values
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React, { useEffect, useState } from 'react';

type Value = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export function CompanyValuesWidget() {
  const [values, setValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await fetch('/api/public/services');
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          const transformedValues = data.data.map((item: any) => ({
            id: item.id,
            icon: item.icon || '⭐',
            title: item.title,
            description: item.description || '',
          }));
          setValues(transformedValues);
        }
      } catch (error) {
        console.error('Failed to fetch values:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValues();
  }, []);

  if (isLoading) {
    return (
      <div className="border-b border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Nilai & Filosofi Kami
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (values.length === 0) {
    return (
      <div className="border-b border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Nilai & Filosofi Kami
        </h3>
        <p className="text-sm text-gray-500">No values available yet.</p>
      </div>
    );
  }

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
