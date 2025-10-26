'use client';

/**
 * Company Services Section
 * Reusable services component for company profile
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React from 'react';

type Service = {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
};

const services: Service[] = [
  {
    id: 1,
    icon: '💻',
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies',
    features: ['React & Next.js', 'TypeScript', 'Responsive Design', 'API Integration'],
  },
  {
    id: 2,
    icon: '📱',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications',
    features: ['iOS & Android', 'React Native', 'Flutter', 'App Store Deployment'],
  },
  {
    id: 3,
    icon: '☁️',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment',
    features: ['AWS & Azure', 'DevOps', 'CI/CD', 'Auto-scaling'],
  },
  {
    id: 4,
    icon: '🔒',
    title: 'Security',
    description: 'Enterprise-grade security and compliance',
    features: ['SSL/TLS', 'Authentication', 'Data Encryption', 'Security Audits'],
  },
];

export function CompanyServices() {
  return (
    <section id="services" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Our Services</h2>
          <p className="text-xl text-gray-600">
            Comprehensive solutions to power your digital transformation
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map(service => (
            <div
              key={service.id}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-100 text-3xl group-hover:bg-blue-600 group-hover:text-white">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mb-4 text-sm text-gray-600">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map(feature => (
                  <li
                    key={`${service.id}-${feature}`}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <button
                type="button"
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-lg text-gray-700">
            Need a custom solution? Let's talk!
          </p>
          <a
            href="#contact"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
