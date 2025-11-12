'use client';

/**
 * Company Slideshow Plugin
 * Image carousel for company profile hero area
 * Demonstrates Area/Region System with dynamic slideshow
 * Part of Company Profile - Templating Praktikum Week 9
 */

import React, { useEffect, useState } from 'react';

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  background: string;
  backgroundImage?: string;
  ctaText: string;
  ctaLink: string;
};

// Default shoe backgrounds for variety
const defaultShoeBackgrounds = [
  '/assets/brodo-gentlemen.webp',
  '/assets/brodo-ventura.webp', 
  '/assets/brodo-alpha.webp',
  '/assets/brogues.webp',
];

export function CompanySlideshowPlugin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/public/hero');
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          // Transform API data to Slide format
          const transformedSlides = data.data.map((item: any, index: number) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || '',
            description: item.description || '',
            background: item.gradientFrom && item.gradientTo 
              ? `from-${item.gradientFrom} to-${item.gradientTo}`
              : 'from-amber-900/90 via-stone-800/90 to-brown-900/90',
            // Use API image OR default shoe background (rotate through array)
            backgroundImage: item.imageUrl || defaultShoeBackgrounds[index % defaultShoeBackgrounds.length],
            ctaText: item.ctaText || 'Learn More',
            ctaLink: item.ctaLink || '#',
          }));
          setSlides(transformedSlides);
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-play slideshow
  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-brown-900 py-20 text-white">
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="animate-pulse">
                <div className="mb-4 h-12 bg-white/20 rounded"></div>
                <div className="mb-6 h-8 bg-white/20 rounded"></div>
                <div className="mb-8 h-6 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no slides
  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative bg-gradient-to-br from-amber-900 via-stone-800 to-brown-900 py-20 text-white">
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-5xl font-bold">No Content Available</h1>
              <p className="text-lg opacity-80">Please add hero content from the CMS dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  if (!currentSlideData) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      {/* Slideshow Container with Background Image */}
      <div
        className="relative bg-cover bg-center py-32 text-white transition-all duration-1000"
        style={{
          backgroundImage: currentSlideData.backgroundImage 
            ? `url(${currentSlideData.backgroundImage})` 
            : 'none',
        }}
      >
        {/* Overlay with warm brown tones */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.background}`} />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            {/* Slide Content with Animation */}
            <div
              key={currentSlide}
              className="animate-fadeIn"
            >
              <h1 className="mb-4 text-5xl font-bold drop-shadow-lg">
                {currentSlideData.title}
              </h1>
              <p className="mb-6 text-2xl font-light opacity-90 drop-shadow">
                {currentSlideData.subtitle}
              </p>
              <p className="mb-8 text-lg opacity-80 drop-shadow">
                {currentSlideData.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-4">
                <a
                  href={currentSlideData.ctaLink}
                  className="rounded-lg bg-amber-50 px-8 py-3 font-semibold text-amber-900 transition-all hover:scale-105 hover:bg-white hover:shadow-xl"
                >
                  {currentSlideData.ctaText}
                </a>
                <a
                  href="#about"
                  className="rounded-lg border-2 border-amber-50 px-8 py-3 font-semibold text-amber-50 transition-all hover:bg-amber-50 hover:text-amber-900"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {slides.map(slide => (
                <button
                  key={`dot-${slide.id}`}
                  onClick={() => goToSlide(slide.id - 1)}
                  className={`size-3 rounded-full transition-all ${
                    slide.id - 1 === currentSlide
                      ? 'w-8 bg-white'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${slide.id}`}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Previous/Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Previous slide"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Next slide"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
        {currentSlide + 1}
        {' '}
        /
        {slides.length}
      </div>
    </section>
  );
}
