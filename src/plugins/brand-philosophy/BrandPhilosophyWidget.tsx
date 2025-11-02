'use client';

/**
 * Brand Philosophy Widget Plugin
 * Displays BRODO's brand philosophy and principles
 * Left Sidebar - Company Profile
 */

import React from 'react';

export function BrandPhilosophyWidget() {
  return (
    <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">💬</span>
        <h3 className="text-lg font-semibold text-gray-900">
          Filosofi Brand Kami
        </h3>
      </div>

      <div className="space-y-4">
        {/* Main Quote */}
        <blockquote className="border-l-4 border-blue-600 bg-white p-4 italic text-gray-700">
          "Kami percaya bahwa sepatu bukan sekadar alas kaki — tapi cerminan perjalanan hidup."
        </blockquote>

        {/* Description */}
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm leading-relaxed text-gray-600">
            BRODO menggabungkan <strong className="text-blue-600">ketulusan tangan pengrajin lokal</strong>, 
            {' '}<strong className="text-purple-600">material premium</strong>, dan{' '}
            <strong className="text-green-600">inovasi desain modern</strong> untuk setiap langkah Anda.
          </p>
        </div>

        {/* Icon Features */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white p-3 text-center">
            <div className="mb-1 text-2xl">🤲</div>
            <p className="text-xs font-medium text-gray-700">Ketulusan</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center">
            <div className="mb-1 text-2xl">⭐</div>
            <p className="text-xs font-medium text-gray-700">Premium</p>
          </div>
          <div className="rounded-lg bg-white p-3 text-center">
            <div className="mb-1 text-2xl">🚀</div>
            <p className="text-xs font-medium text-gray-700">Inovasi</p>
          </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
            <span>🇮🇩</span>
            <span>Lokal Tapi Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandPhilosophyWidget;
