'use client';

/**
 * Scroll to Top Button Component
 * Floating button that appears when user scrolls down
 * Smooth scroll to top on click
 */

import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ScrollToTopButtonProps {
  /** Scroll position threshold to show button (default: 300px) */
  threshold?: number;
  /** Bottom position offset (default: 24px) */
  bottom?: number;
  /** Right position offset (default: 24px) */
  right?: number;
}

export function ScrollToTopButton({
  threshold = 300,
  bottom = 24,
  right = 24,
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down past threshold
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    // Check initial scroll position
    toggleVisibility();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-xl transition-all hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 dark:from-amber-600 dark:to-amber-800"
      style={{
        bottom: `${bottom}px`,
        right: `${right}px`,
      }}
      aria-label="Scroll to top"
      title="Kembali ke atas"
    >
      <ArrowUp className="size-6" />
    </button>
  );
}

