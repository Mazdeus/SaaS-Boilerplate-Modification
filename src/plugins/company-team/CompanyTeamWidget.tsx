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
  photo?: string;
};

const teamMembers: TeamMember[] = [
  { 
    id: 1, 
    name: 'Muhammad Yukka Harlanda', 
    role: 'Co-Founder & CEO', 
    avatar: '👨‍💼',
    photo: '/assets/Muhammad Yukka.jpg'
  },
  { 
    id: 2, 
    name: 'Putera Dwi Karunia', 
    role: 'Co-Founder & Creative Partner', 
    avatar: '👨‍🎨',
    photo: '/assets/Putera Dwi.jfif'
  },
];

export function CompanyTeamWidget() {
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
            {member.photo ? (
              <div 
                className="size-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${member.photo})` }}
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                {member.avatar}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
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
