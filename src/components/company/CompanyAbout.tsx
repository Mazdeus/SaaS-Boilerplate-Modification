'use client';

/**
 * Company About Section
 * Reusable about component for company profile
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React from 'react';

export function CompanyAbout() {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">About Us</h2>
            <p className="text-xl text-gray-600">
              Our story, mission, and what drives us forward
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Our Story */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">📖</span>
                <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
              </div>
              <p className="mb-4 text-gray-600">
                Founded in 2020, SaaS Template started with a simple mission: to help businesses leverage technology for growth. What began as a small team of passionate developers has grown into a thriving company serving clients worldwide.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and push boundaries, always keeping our clients' success at the heart of everything we do.
              </p>
            </div>

            {/* Our Mission */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="mb-4 text-gray-600">
                To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation. We believe in creating software that makes a real difference.
              </p>
              <p className="text-gray-600">
                Our commitment is to deliver exceptional value through innovative products, outstanding service, and lasting partnerships.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">500+</div>
              <div className="text-sm font-medium text-gray-700">Clients</div>
            </div>
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">50+</div>
              <div className="text-sm font-medium text-gray-700">Team Members</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-purple-600">100+</div>
              <div className="text-sm font-medium text-gray-700">Projects</div>
            </div>
            <div className="rounded-lg bg-orange-50 p-6 text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">4+</div>
              <div className="text-sm font-medium text-gray-700">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
