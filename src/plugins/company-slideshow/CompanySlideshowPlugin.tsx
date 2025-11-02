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

const slides: Slide[] = [
  {
    id: 1,
    title: 'BRODO',
    subtitle: 'Langkah Awal Gaya Lokal',
    description: 'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter, hasil karya anak bangsa dari Bandung.',
    background: 'from-blue-600 to-blue-800',
    backgroundImage: '/assets/img-stock-1.webp',
    ctaText: 'Lihat Produk',
    ctaLink: '#products',
  },
  {
    id: 2,
    title: 'Innovation & Excellence',
    subtitle: 'Dari Bandung untuk Indonesia',
    description: 'Sejak 2010, kami memanfaatkan kerajinan lokal Cibaduyut dan material premium untuk menciptakan alas kaki stylish yang terjangkau untuk pria Indonesia.',
    background: 'from-purple-600 to-purple-800',
    backgroundImage: '/assets/img-stock-7.webp',
    ctaText: 'Tentang Kami',
    ctaLink: '#about',
  },
  {
    id: 3,
    title: 'Quality Craftsmanship',
    subtitle: 'Produk Berkualitas Internasional',
    description: 'Setiap produk BRODO dirancang dengan detail, menggunakan bahan pilihan dan dikerjakan oleh pengrajin berpengalaman untuk hasil terbaik.',
    background: 'from-green-600 to-green-800',
    backgroundImage: '/assets/img-stock-10.webp',
    ctaLink: '#values',
    ctaText: 'Nilai Kami',
  },
  {
    id: 4,
    title: 'Join the Movement',
    subtitle: 'Live Epic with Your Shoes',
    description: 'Bergabunglah dengan ribuan pria Indonesia yang telah mempercayai BRODO sebagai pilihan alas kaki mereka. Wujudkan gaya hidup yang epic!',
    background: 'from-orange-600 to-orange-800',
    backgroundImage: '/assets/img-stock-13.webp',
    ctaText: 'Hubungi Kami',
    ctaLink: '#contact',
  },
];

export function CompanySlideshowPlugin() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  if (!currentSlideData) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      {/* Slideshow Container with Background Image */}
      <div
        className="relative bg-cover bg-center py-20 text-white transition-all duration-500"
        style={{
          backgroundImage: currentSlideData.backgroundImage 
            ? `url(${currentSlideData.backgroundImage})` 
            : 'none',
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.background} opacity-80`} />
        
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
                  className="rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg"
                >
                  {currentSlideData.ctaText}
                </a>
                <a
                  href="#about"
                  className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition-all hover:bg-white hover:text-gray-900"
                >
                  Learn More
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
