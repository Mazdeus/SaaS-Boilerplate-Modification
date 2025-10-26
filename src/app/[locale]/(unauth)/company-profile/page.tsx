'use client';

/**
 * Company Profile Page
 * Demonstrates templating concepts with company profile domain
 * Praktikum Minggu ke-9 - Template Engine Implementation
 *
 * Templating Concepts Demonstrated:
 * 1. Layout & Partial System - Uses MainLayout with reusable sections
 * 2. Area/Region System - Registers widgets to sidebar areas
 * 3. Component Composition - Combines multiple reusable components
 * 4. Plugin System - Uses company-specific widgets
 */

import React, { useEffect } from 'react';

import { CompanyAbout } from '@/components/company/CompanyAbout';
import { CompanyServices } from '@/components/company/CompanyServices';
import { useArea } from '@/contexts/AreaContext';
import { AREAS } from '@/core/types';
import { usePagePlugins } from '@/hooks/usePagePlugins';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';
import { CompanyInfoWidget } from '@/plugins/company-info/CompanyInfoWidget';
import { CompanySlideshowPlugin } from '@/plugins/company-slideshow/CompanySlideshowPlugin';
import { CompanyTeamWidget } from '@/plugins/company-team/CompanyTeamWidget';
import { CompanyValuesWidget } from '@/plugins/company-values/CompanyValuesWidget';
import { MainLayout } from '@/themes/default/layouts/MainLayout';

// Define plugin mapping for this page
const companyPagePlugins = {
  'company-slideshow': {
    component: CompanySlideshowPlugin,
    area: AREAS.HERO,
    priority: 10,
  },
  'company-info-widget': {
    component: CompanyInfoWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 5,
  },
  'company-values-widget': {
    component: CompanyValuesWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 15,
  },
  'company-team-widget': {
    component: CompanyTeamWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 5,
  },
};

export default function CompanyProfilePage() {
  const { registerComponent } = useArea();

  // Clean up areas when route changes to prevent duplicates
  useRouteCleanup({ areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT, AREAS.SIDEBAR_RIGHT] });

  // Use page-based plugin system
  usePagePlugins(companyPagePlugins);

  // Fallback manual registration (can be removed once page plugin system is stable)
  useEffect(() => {
    // This will be handled by usePagePlugins, but keeping as fallback
    const timer = setTimeout(() => {
      // The usePagePlugins hook should handle registration automatically
      // based on PagePluginConfig
    }, 100);

    return () => clearTimeout(timer);
  }, [registerComponent]);

  return (
    <MainLayout>
      {/* Hero Area now uses SLIDESHOW via Area System! */}
      {/* CompanyHero static component replaced with dynamic area rendering */}
      {/* The slideshow is registered to AREAS.HERO above */}

      {/* About Section - Reusable Partial */}
      <CompanyAbout />

      {/* Services Section - Reusable Partial */}
      <CompanyServices />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from real businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: 1,
                name: 'Sarah Johnson',
                company: 'Tech Startup Inc.',
                testimonial: 'Working with SaaS Template has been a game-changer for our business. Their expertise and dedication are unmatched.',
                rating: 5,
              },
              {
                id: 2,
                name: 'Michael Chen',
                company: 'E-Commerce Solutions',
                testimonial: 'The team delivered beyond our expectations. Professional, responsive, and highly skilled.',
                rating: 5,
              },
              {
                id: 3,
                name: 'Emily Davis',
                company: 'Digital Agency',
                testimonial: 'Outstanding service and quality. They truly understand modern web development.',
                rating: 5,
              },
            ].map(testimonial => (
              <div
                key={testimonial.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={`star-${testimonial.id}-${i}`} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 italic text-gray-700">
                  "
                  {testimonial.testimonial}
                  "
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Let's discuss how we can help your business grow
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:info@saastemplate.com"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Email Us
            </a>
            <a
              href="tel:+6281234567890"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-colors hover:bg-white hover:text-blue-600"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Templating Info Banner */}
      <div className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-bold text-blue-900">
              🎓 Templating Concepts Demonstrated
            </h3>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Layout & Partial</p>
                <p className="text-gray-600">Uses MainLayout with reusable sections (Hero, About, Services)</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Area/Region System</p>
                <p className="text-gray-600">Company widgets registered to left & right sidebars</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Plugin System</p>
                <p className="text-gray-600">CompanyInfo, Team, Values widgets as plugins</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Theme System</p>
                <p className="text-gray-600">Uses current theme styling (try theme switcher!)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
