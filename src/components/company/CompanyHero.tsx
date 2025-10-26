'use client';

/**
 * Company Hero Section
 * Reusable hero component for company profile
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React from 'react';

type CompanyHeroProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
};

export function CompanyHero({
  title = 'Welcome to SaaS Template',
  subtitle = 'Building the Future of Software',
  description = 'We are a leading technology company dedicated to creating innovative solutions that help businesses grow and succeed in the digital age.',
  ctaText = 'Get in Touch',
  ctaLink = '#contact',
}: CompanyHeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-5xl font-bold">{title}</h1>
          <p className="mb-6 text-2xl font-light text-blue-100">{subtitle}</p>
          <p className="mb-8 text-lg text-blue-50">{description}</p>

          <div className="flex justify-center gap-4">
            <a
              href={ctaLink}
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              {ctaText}
            </a>
            <a
              href="#about"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
