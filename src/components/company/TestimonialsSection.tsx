'use client';

import React, { useEffect, useState } from 'react';

type Testimonial = {
  id: number;
  customerName: string;
  customerPosition: string;
  company: string;
  content: string;
  rating: number;
};

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTestimonials(data.data.slice(0, 3)); // Show only first 3
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
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
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex gap-1">
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                </div>
                <div className="mb-4 h-20 rounded bg-gray-200"></div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-3 w-32 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
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
          {testimonials.map(testimonial => (
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
                {testimonial.content}
                "
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.customerName}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.customerPosition}
                  {testimonial.company && `, ${testimonial.company}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
