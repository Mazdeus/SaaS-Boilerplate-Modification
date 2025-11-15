'use client';

import { useState, useEffect } from 'react';
import SafeImage from './SafeImage';
import Link from 'next/link';

interface HeroSlide {
  id: string | number;
  title: string;
  subtitle: string | null;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeSlides = slides.filter(slide => slide.isActive);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) {
    return (
      <div className="relative h-[600px] bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">No hero sections available</p>
      </div>
    );
  }

  const slide = activeSlides[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image with Blur and Blue Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {slide.imageUrl ? (
          <SafeImage
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover blur-sm"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-brodo-blue opacity-50" />
      </div>

      {/* Centered Content */}
      <div className="relative h-full flex items-center justify-center z-10">
        <div className={`container-brodo text-center transition-all duration-500 ${
          isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}>
          {/* Subtitle */}
          {slide.subtitle && (
            <p className="text-white/90 text-lg sm:text-xl mb-4 font-light tracking-wide">
              {slide.subtitle}
            </p>
          )}
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {slide.title}
          </h1>
          
          {/* Description */}
          {slide.description && (
            <p className="text-white/90 text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              {slide.description}
            </p>
          )}
          
          {/* CTA Button */}
          {slide.ctaText && slide.ctaLink && (
            <Link 
              href={slide.ctaLink}
              className="inline-block bg-white text-brodo-blue px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {slide.ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsAnimating(false);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
                setIsAnimating(false);
              }, 500);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
                setIsAnimating(false);
              }, 500);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
