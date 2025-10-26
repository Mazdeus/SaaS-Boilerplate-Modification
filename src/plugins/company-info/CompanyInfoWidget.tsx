'use client';

/**
 * Company Info Widget Plugin
 * Displays company information in sidebar
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React from 'react';

export function CompanyInfoWidget() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Company Info
      </h3>

      <div className="space-y-4">
        {/* Logo/Name */}
        <div className="text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            ST
          </div>
          <h4 className="font-semibold text-gray-900">SaaS Template</h4>
          <p className="text-xs text-gray-500">Tech Company</p>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">📍</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Location</p>
              <p className="text-xs text-gray-600">Bandung, Indonesia</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-blue-600">👥</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Team Size</p>
              <p className="text-xs text-gray-600">50+ Employees</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-blue-600">📅</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Established</p>
              <p className="text-xs text-gray-600">2020</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-blue-600">🏆</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">Industry</p>
              <p className="text-xs text-gray-600">Software Development</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-700">Contact Us</p>
          <a
            href="mailto:info@saastemplate.com"
            className="block text-xs text-blue-600 hover:underline"
          >
            info@saastemplate.com
          </a>
          <a
            href="tel:+6281234567890"
            className="block text-xs text-blue-600 hover:underline"
          >
            +62 812-3456-7890
          </a>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-100 pt-3">
          <p className="mb-2 text-xs font-medium text-gray-700">Follow Us</p>
          <div className="flex gap-2">
            <a
              href="https://linkedin.com"
              className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm">in</span>
            </a>
            <a
              href="https://github.com"
              className="flex size-8 items-center justify-center rounded-md bg-gray-800 text-white hover:bg-gray-900"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm">gh</span>
            </a>
            <a
              href="https://twitter.com"
              className="flex size-8 items-center justify-center rounded-md bg-blue-400 text-white hover:bg-blue-500"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm">tw</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
