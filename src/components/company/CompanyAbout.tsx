'use client';

/**
 * Company About Section
 * Reusable about component for company profile
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React from 'react';

export function CompanyAbout() {
  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* About us Header */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">About us</p>
          <h2 className="text-4xl font-bold text-gray-900">
            We are more than Digital Agency
          </h2>
        </div>

        {/* Image Grid */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Large image on the left */}
          <div className="overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
              alt="Team collaboration"
              className="size-full object-cover"
            />
          </div>

          {/* Two smaller images on the right */}
          <div className="grid grid-rows-2 gap-4">
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop"
                alt="Team meeting"
                className="size-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=300&fit=crop"
                alt="Team working"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Who are we & What we do */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Who are we */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Who are we</h3>
            <p className="mb-4 text-gray-600">
              We're a team of marketers and creative thinkers helping companies exceeding and development business. With years of experience in driving results of your website against a variety of best practice and industry standards criteria.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
            >
              Learn More →
            </button>
          </div>

          {/* What we do */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">What we do</h3>
            <p className="mb-4 text-gray-600">
              To achieve the best user experience for your audience, we recommend conducting user research to understand the needs and desires of your target audience. Finally, regularly analyze and garner insights and identify opportunities.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
            >
              Learn More →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-blue-600">500+</div>
            <div className="text-sm font-medium text-gray-700">Clients</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-green-600">50+</div>
            <div className="text-sm font-medium text-gray-700">Team Members</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-purple-600">100+</div>
            <div className="text-sm font-medium text-gray-700">Projects</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-orange-600">4+</div>
            <div className="text-sm font-medium text-gray-700">Years</div>
          </div>
        </div>
      </div>
    </section>
  );
}
