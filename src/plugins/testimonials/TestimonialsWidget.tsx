'use client';

import { useEffect, useState } from 'react';

type Testimonial = {
  id: number;
  customerName: string;
  customerRole: string;
  content: string;
  rating: number;
  order: number;
};

export function TestimonialsWidget() {
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
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-24 rounded-lg bg-gray-200" />
            <div className="h-24 rounded-lg bg-gray-200" />
            <div className="h-24 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = testimonials.length > 0
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    : 0;

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2">
            <span className="text-blue-600">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Kata Mereka</h3>
        </div>
        {testimonials.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'}>⭐</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">{avgRating.toFixed(1)}/5.0 ({testimonials.length} reviews)</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-300"
          >
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < testimonial.rating ? 'text-sm text-amber-400' : 'text-sm text-gray-300'}>⭐</span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-xs italic leading-relaxed text-gray-600">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-lg">
                👤
              </div>
              <div>
                <p className="text-xs font-semibold">{testimonial.customerName}</p>
                <p className="text-[10px] text-gray-600">{testimonial.customerRole}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://bro.do/pages/testimonials"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full rounded-md border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Lihat Semua Testimoni
      </a>
    </div>
  );
}

