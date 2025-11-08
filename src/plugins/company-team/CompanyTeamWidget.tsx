'use client';

/**
 * Company Team Widget Plugin
 * Displays team members from database
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React, { useEffect, useState } from 'react';

type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  order: number;
};

export function CompanyTeamWidget() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/team')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTeamMembers(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching team members:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="border-b border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Tim Leadership Kami
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-16 rounded-lg bg-gray-200" />
          <div className="h-16 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Tim Leadership Kami
      </h3>

      <div className="space-y-3">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            {member.imageUrl ? (
              <div 
                className="size-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${member.imageUrl})` }}
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                👤
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.position}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://bro.do/pages/about-us"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full rounded-md border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Lihat Tim Lengkap
      </a>
    </div>
  );
}
