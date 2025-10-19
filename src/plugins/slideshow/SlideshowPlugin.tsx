'use client';

/**
 * Slideshow Plugin
 * Displays rotating images with captions
 */

import React, { useEffect, useState } from 'react';

type Slide = {
  image: string;
  caption: string;
  description?: string;
};

const defaultSlides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    caption: 'Welcome to Our Platform',
    description: 'Build your SaaS faster with our boilerplate',
  },
  {
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
    caption: 'Powerful Features',
    description: 'Everything you need to launch your product',
  },
  {
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
    caption: 'Join Our Community',
    description: 'Thousands of developers trust our platform',
  },
];

export function SlideshowPlugin({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={`slide-${slide.caption}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex h-full items-center justify-center bg-gradient-to-r from-blue-500/90 to-purple-600/90 p-8 text-center">
            <div className="max-w-3xl">
              <h2 className="mb-4 text-4xl font-bold text-white">
                {slide.caption}
              </h2>
              {slide.description && (
                <p className="text-xl text-white/90">{slide.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={`dot-${slide.caption}-${index}`}
            onClick={() => goToSlide(index)}
            className={`size-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
}
