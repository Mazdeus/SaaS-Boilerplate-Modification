/**
 * useSmoothScroll Hook
 * Provides smooth scrolling functionality for anchor links
 * Part of UX Enhancement - Navigation System
 */

import { useCallback } from 'react';

export function useSmoothScroll() {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Only handle anchor links (starting with #)
      if (href.startsWith('#')) {
        e.preventDefault();
        const sectionId = href.substring(1); // Remove the # character
        scrollToSection(sectionId);
      }
    },
    [scrollToSection],
  );

  return { scrollToSection, handleAnchorClick };
}
