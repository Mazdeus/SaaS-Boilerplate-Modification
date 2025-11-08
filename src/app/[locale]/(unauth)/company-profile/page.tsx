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

import React, { useEffect, useState } from 'react';

import { BrodoAbout } from '@/components/company/BrodoAbout';
import { BrodoProducts } from '@/components/company/BrodoProducts';
import { BrodoValues } from '@/components/company/BrodoValues';
import { ContactForm } from '@/components/company/ContactForm';
import { TestimonialsSection } from '@/components/company/TestimonialsSection';
import { useArea } from '@/contexts/AreaContext';
import { AREAS } from '@/core/types';
import { useRouteCleanup } from '@/hooks/useRouteCleanup';
import { BrodoNewsWidget } from '@/plugins/brodo-news/BrodoNewsWidget';
import { CompanyInfoWidget } from '@/plugins/company-info/CompanyInfoWidget';
import { CompanySlideshowPlugin } from '@/plugins/company-slideshow/CompanySlideshowPlugin';
import { CompanyTeamWidget } from '@/plugins/company-team/CompanyTeamWidget';
import { CompanyValuesWidget } from '@/plugins/company-values/CompanyValuesWidget';
import { FeaturedProductWidget } from '@/plugins/featured-product/FeaturedProductWidget';
import ProductionInsightWidget from '@/plugins/production-insight/ProductionInsightWidget';
import { StoreLocatorWidget } from '@/plugins/store-locator/StoreLocatorWidget';
import { SustainabilityWidget } from '@/plugins/sustainability/SustainabilityWidget';
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

// Sidebar Settings Type
type SidebarSettings = {
  companyInfo: boolean;
  featuredProducts: boolean;
  valuesPhilosophy: boolean;
  storeLocator: boolean;
  teamLeadership: boolean;
};

export default function CompanyProfilePage() {
  const { registerComponent } = useArea();
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    companyInfo: true,
    featuredProducts: true,
    valuesPhilosophy: true,
    storeLocator: true,
    teamLeadership: true,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Clean up areas when route changes to prevent duplicates
  useRouteCleanup({ areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT, AREAS.SIDEBAR_RIGHT] });

  // Register all plugins manually to ensure they all load, but only if enabled in settings
  useEffect(() => {
    if (!settingsLoaded) return; // Wait for settings to load
    
    // Define which plugins are controlled by which setting
    const pluginSettingsMap: Record<string, keyof SidebarSettings> = {
      'company-info-widget': 'companyInfo',
      'company-values-widget': 'valuesPhilosophy',
      'featured-product-widget': 'featuredProducts',
      'store-locator-widget': 'storeLocator',
      'company-team-widget': 'teamLeadership',
    };

    // Register all plugins from companyPagePlugins
    Object.entries(companyPagePlugins).forEach(([pluginId, config]) => {
      // Check if this plugin is controlled by settings
      const settingKey = pluginSettingsMap[pluginId];
      const isEnabled = settingKey ? sidebarSettings[settingKey] : true; // Default enabled for non-sidebar plugins
      
      if (isEnabled) {
        registerComponent(config.area, {
          id: pluginId,
          component: config.component,
          priority: config.priority,
          enabled: true,
          areaId: config.area,
        });
      }
    });

    // Cleanup function
    return () => {
      // Areas will be cleaned up by useRouteCleanup
    };
  }, [registerComponent, settingsLoaded, sidebarSettings]);

  // Fetch sidebar settings from API
  useEffect(() => {
    const fetchSidebarSettings = async () => {
      try {
        const response = await fetch('/api/public/sidebar-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSidebarSettings(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sidebar settings:', error);
      } finally {
        setSettingsLoaded(true);
      }
    };

    fetchSidebarSettings();
  }, []);

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
      <TestimonialsSection />

      {/* Contact Form Section - NEW BACKEND FEATURE! */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Hubungi Kami
            </h2>
            <p className="text-xl text-gray-600">
              Punya pertanyaan? Kami siap membantu Anda!
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">Siap Memulai Langkah Baru?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Atau hubungi kami langsung untuk respons lebih cepat
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
