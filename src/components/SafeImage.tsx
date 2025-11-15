/**
 * SafeImage Component
 * Wrapper for Next.js Image with error handling and fallback
 * Accepts any string input: URLs, relative paths, usernames, etc.
 * Gracefully handles invalid images without breaking the UI
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Helper to check if a string is a valid URL
 */
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to check if URL is an external image source
 */
function isExternalUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  fallback,
  objectFit = 'cover',
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // If no src or error occurred, show fallback
  if (!src || error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-4xl">📷</span>
      </div>
    );
  }

  // Trim whitespace
  const cleanSrc = src.trim();

  // If empty after trim, show fallback
  if (!cleanSrc) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-4xl">📷</span>
      </div>
    );
  }

  // Always use regular img tag for local assets (safer and more flexible)
  // This includes: /assets/, /public/, or any relative path starting with /
  if (cleanSrc.startsWith('/')) {
    return (
      <img
        src={cleanSrc}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit } : undefined}
        onError={() => setError(true)}
      />
    );
  }

  // For external URLs, try to use Next.js Image for optimization
  if (isExternalUrl(cleanSrc) && isValidUrl(cleanSrc)) {
    try {
      return (
        <Image
          src={cleanSrc}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={className}
          priority={priority}
          onError={() => setError(true)}
          style={fill ? { objectFit } : undefined}
          unoptimized={true} // Use unoptimized for external images to avoid build issues
        />
      );
    } catch (e) {
      // If Next.js Image fails, fall back to regular img
      return (
        <img
          src={cleanSrc}
          alt={alt}
          className={className}
          style={fill ? { width: '100%', height: '100%', objectFit } : undefined}
          onError={() => setError(true)}
        />
      );
    }
  }

  // For any other string (username, invalid URL, etc.), try regular img tag
  // This will fail gracefully and show fallback if image doesn't load
  return (
    <img
      src={cleanSrc}
      alt={alt}
      className={className}
      style={fill ? { width: '100%', height: '100%', objectFit } : undefined}
      onError={() => setError(true)}
    />
  );
}
