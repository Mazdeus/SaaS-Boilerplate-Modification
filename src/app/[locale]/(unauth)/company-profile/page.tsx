'use client';

/**
 * BRODO Company Profile Page
 * Real company profile for BRODO - Indonesian Footwear Brand
 * Praktikum Minggu ke-9 - Template Engine Implementation
 *
 * Templating Concepts Demonstrated:
 * 1. Layout & Partial System - Uses MainLayout with reusable sections
 * 2. Area/Region System - Registers widgets to sidebar areas
 * 3. Component Composition - Combines multiple reusable components
 * 4. Plugin System - Uses company-specific widgets
 */

import React, { useEffect } from 'react';

import { BrodoAbout } from '@/components/company/BrodoAbout';
import { BrodoProducts } from '@/components/company/BrodoProducts';
import { BrodoValues } from '@/components/company/BrodoValues';
import { useArea } from '@/contexts/AreaContext';
import { AREAS } from '@/core/types';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';
import BrandPhilosophyWidget from '@/plugins/brand-philosophy/BrandPhilosophyWidget';
import { BrodoNewsWidget } from '@/plugins/brodo-news/BrodoNewsWidget';
import { BrodoRewardsWidget } from '@/plugins/brodo-rewards/BrodoRewardsWidget';
import { CompanyInfoWidget } from '@/plugins/company-info/CompanyInfoWidget';
import { CompanySlideshowPlugin } from '@/plugins/company-slideshow/CompanySlideshowPlugin';
import { CompanyStatsWidget } from '@/plugins/company-stats/CompanyStatsWidget';
import { CompanyTeamWidget } from '@/plugins/company-team/CompanyTeamWidget';
import { CompanyValuesWidget } from '@/plugins/company-values/CompanyValuesWidget';
import { FeaturedProductWidget } from '@/plugins/featured-product/FeaturedProductWidget';
import ProductionInsightWidget from '@/plugins/production-insight/ProductionInsightWidget';
import { SocialMediaWidget } from '@/plugins/social-media/SocialMediaWidget';
import { StoreLocatorWidget } from '@/plugins/store-locator/StoreLocatorWidget';
import { SustainabilityWidget } from '@/plugins/sustainability/SustainabilityWidget';
import { TestimonialsWidget } from '@/plugins/testimonials/TestimonialsWidget';
import { MainLayout } from '@/themes/default/layouts/MainLayout';

// Define plugin mapping for this page
const companyPagePlugins = {
  'company-slideshow': {
    component: CompanySlideshowPlugin,
    area: AREAS.HERO,
    priority: 10,
  },
  // LEFT SIDEBAR WIDGETS
  'company-info-widget': {
    component: CompanyInfoWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 10,
  },
  'company-values-widget': {
    component: CompanyValuesWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 20,
  },
  'brand-philosophy-widget': {
    component: BrandPhilosophyWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 30,
  },
  'production-insight-widget': {
    component: ProductionInsightWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 35,
  },
  'sustainability-widget': {
    component: SustainabilityWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 40,
  },
  'company-stats-widget': {
    component: CompanyStatsWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 50,
  },
  // RIGHT SIDEBAR WIDGETS
  'featured-product-widget': {
    component: FeaturedProductWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 10,
  },
  'brodo-news-widget': {
    component: BrodoNewsWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 20,
  },
  'brodo-rewards-widget': {
    component: BrodoRewardsWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 30,
  },
  'social-media-widget': {
    component: SocialMediaWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 40,
  },
  'testimonials-widget': {
    component: TestimonialsWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 50,
  },
  'store-locator-widget': {
    component: StoreLocatorWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 60,
  },
  'company-team-widget': {
    component: CompanyTeamWidget,
    area: AREAS.SIDEBAR_RIGHT,
    priority: 70,
  },
};

export default function CompanyProfilePage() {
  const { registerComponent } = useArea();

  // Clean up areas when route changes to prevent duplicates
  useRouteCleanup({ areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT, AREAS.SIDEBAR_RIGHT] });

  // Register all plugins manually to ensure they all load
  useEffect(() => {
    // Register all plugins from companyPagePlugins
    Object.entries(companyPagePlugins).forEach(([pluginId, config]) => {
      registerComponent(config.area, {
        id: pluginId,
        component: config.component,
        priority: config.priority,
        enabled: true,
        areaId: config.area,
      });
    });

    // Cleanup function
    return () => {
      // Areas will be cleaned up by useRouteCleanup
    };
  }, [registerComponent]);

  return (
    <MainLayout>
      {/* Hero Area uses SLIDESHOW via Area System */}
      {/* The slideshow is registered to AREAS.HERO above */}

      {/* About Section - BRODO Company Info */}
      <BrodoAbout />

      {/* Products Section - BRODO Product Categories */}
      <BrodoProducts />

      {/* Values Section - BRODO Philosophy */}
      <BrodoValues />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Apa Kata Mereka
            </h2>
            <p className="text-xl text-gray-600">
              Testimoni dari pengguna setia BRODO
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: 1,
                name: 'Budi Santoso',
                company: 'Entrepreneur',
                testimonial: 'BRODO adalah pilihan terbaik untuk sepatu sehari-hari. Nyaman, stylish, dan yang penting buatan Indonesia!',
                rating: 5,
              },
              {
                id: 2,
                name: 'Ahmad Rahman',
                company: 'Creative Director',
                testimonial: 'Kualitas setara brand internasional dengan harga yang lebih terjangkau. Bangga pakai produk lokal!',
                rating: 5,
              },
              {
                id: 3,
                name: 'Dimas Prasetyo',
                company: 'Software Engineer',
                testimonial: 'Sudah 3 tahun pakai BRODO dan tidak pernah kecewa. Desainnya selalu update dan kualitasnya konsisten.',
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
          <h2 className="mb-4 text-4xl font-bold">Siap Memulai Langkah Baru?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Hubungi kami untuk informasi produk, kolaborasi, atau pertanyaan lainnya
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hello@bro.do"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Email Kami
            </a>
            <a
              href="tel:+622288115555"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-colors hover:bg-white hover:text-blue-600"
            >
              Hubungi Sekarang
            </a>
            <a
              href="https://bro.do"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-colors hover:bg-white hover:text-blue-600"
            >
              Kunjungi Toko
            </a>
          </div>
          <div className="mt-8">
            <p className="text-sm text-blue-100">
              Alamat: Jl. Gudang Utara No. 40B, Bandung, Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Templating Info Banner */}
      <div className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-3 text-lg font-bold text-blue-900">
              🎓 Templating Concepts - BRODO Company Profile
            </h3>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Layout & Partial</p>
                <p className="text-gray-600">Header, Footer reusable dengan navigasi anchor scroll</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Area/Region System</p>
                <p className="text-gray-600">Slideshow di Hero, Widgets di Sidebars (Info, Values, Team)</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Plugin System</p>
                <p className="text-gray-600">4 plugins: Slideshow, CompanyInfo, Values, Team</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="mb-1 font-semibold text-gray-900">Real Content</p>
                <p className="text-gray-600">BRODO - Brand Sepatu Lokal Bandung sejak 2010</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
