'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function InstagramPage() {
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.juicer.io/embed/bro-do-24f67da1-0036-4210-8d6b-e6110211de24/embed-code.js';
    script.async = true;
    script.defer = true;

    let timeoutId: NodeJS.Timeout;
    let checkInterval: NodeJS.Timeout;

    script.onload = () => {
      console.log('Juicer embed script loaded');
      
      // Check if content actually loads after script is loaded
      // Wait a bit for Juicer to initialize and fetch data
      timeoutId = setTimeout(() => {
        const juicerFeed = document.querySelector('.juicer-feed');
        const juicerItems = document.querySelectorAll('.juicer-feed li');
        
        // If no items loaded after timeout, show fallback
        if (!juicerFeed || juicerItems.length === 0) {
          console.warn('Juicer feed loaded but no content appeared - likely CORS error');
          setShowFallback(true);
        }
        setIsLoading(false);
      }, 5000); // Wait 5 seconds for content to load

      // Also check periodically if content appears
      let attempts = 0;
      checkInterval = setInterval(() => {
        const juicerItems = document.querySelectorAll('.juicer-feed li');
        if (juicerItems.length > 0) {
          // Content loaded successfully
          clearTimeout(timeoutId);
          clearInterval(checkInterval);
          setIsLoading(false);
          console.log('Juicer content loaded successfully');
        }
        attempts++;
        // Stop checking after 10 attempts (5 seconds)
        if (attempts >= 10) {
          clearInterval(checkInterval);
        }
      }, 500);
    };

    script.onerror = () => {
      console.error('Failed to load Juicer embed script');
      setShowFallback(true);
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (checkInterval) clearInterval(checkInterval);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fallback Instagram posts
  const instagramPosts = [
    {
      id: 1,
      image: '/assets/img-stock-1.webp',
      caption: 'Koleksi terbaru dari Brodo - Kenyamanan yang autentik',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 2,
      image: '/assets/img-stock-2.webp',
      caption: 'Crafted with passion and tradition',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 3,
      image: '/assets/img-stock-3.webp',
      caption: 'Style meets comfort',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 4,
      image: '/assets/img-stock-4.webp',
      caption: 'Premium quality footwear',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 5,
      image: '/assets/img-stock-5.webp',
      caption: 'Authentic Indonesian craftsmanship',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 6,
      image: '/assets/img-stock-6.webp',
      caption: 'New arrivals this week',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 7,
      image: '/assets/img-stock-7.webp',
      caption: 'Behind the scenes',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 8,
      image: '/assets/img-stock-8.webp',
      caption: 'Community favorites',
      link: 'https://instagram.com/bro.do',
    },
    {
      id: 9,
      image: '/assets/img-stock-9.webp',
      caption: 'Explore our collection',
      link: 'https://instagram.com/bro.do',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-brodo-blue via-brodo-blue-light to-brodo-blue-dark text-white py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Aktivitas Terbaru
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto">
                Ikuti aktivitas terbaru kami di Instagram. Lihat produk-produk terbaru, 
                momen di balik layar, dan highlight dari komunitas kami.
              </p>
            </div>
          </div>
        </div>

        {/* Instagram Gallery Section */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Loading State */}
            {isLoading && !showFallback && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brodo-blue"></div>
                <p className="mt-4 text-gray-600">Memuat konten Instagram...</p>
              </div>
            )}

            {/* Juicer.io Feed Container */}
            {!showFallback && (
              <div className={`juicer-feed-container ${isLoading ? 'hidden' : ''}`}>
                <ul className="juicer-feed" data-feed-id="bro-do" data-per="12"></ul>
              </div>
            )}

            {/* Fallback Static Gallery */}
            {showFallback && (
              <div>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm font-medium">Menampilkan galeri alternatif</span>
                  </div>
                </div>
                
                {/* Instagram Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {instagramPosts.map((post) => (
                    <a
                      key={post.id}
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={post.image}
                          alt={post.caption}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 sm:p-6 text-white">
                            <p className="text-sm sm:text-base line-clamp-2">{post.caption}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm opacity-75">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                              <span>Lihat di Instagram</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Note about live feed */}
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Lihat lebih banyak konten kami di Instagram official
              </p>
              <a
                href="https://instagram.com/bro.do"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brodo-blue hover:text-brodo-blue-dark font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@bro.do - Follow untuk update terbaru</span>
              </a>
            </div>

            {/* CTA Section */}
            <div className="mt-12 sm:mt-16 text-center bg-gradient-to-r from-brodo-blue to-brodo-blue-light rounded-xl p-8 sm:p-10 lg:p-12 text-white shadow-xl">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  Bergabunglah dengan Komunitas Kami
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
                  Follow kami di Instagram untuk konten eksklusif, penawaran spesial, dan update produk terbaru!
                </p>
                <a
                  href="https://instagram.com/bro.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-brodo-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm sm:text-base">Follow @bro.do</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
