'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function InstagramPage() {
  const [showFallback, setShowFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create Juicer embed script
    const script = document.createElement('script');
    script.src =
      'https://www.juicer.io/embed/bro-do-16c4fdbe-b337-4f13-b891-f7ec4f0d6f83/embed-code.js';
    script.async = true;
    script.defer = true;

    const container = document.getElementById('juicer-container');
    if (container) container.appendChild(script);

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    script.onload = () => {
      console.log('Juicer script loaded');

      // Wait for Juicer to inject its own <ul class="juicer-feed">
      timeoutId = setTimeout(() => {
        const items = document.querySelectorAll('.juicer-feed li');
        if (items.length === 0) {
          console.warn('Juicer loaded but feed is empty → fallback');
          setShowFallback(true);
        }
        setIsLoading(false);
      }, 4000);

      // Continuous check for content
      let attempts = 0;
      intervalId = setInterval(() => {
        const items = document.querySelectorAll('.juicer-feed li');
        if (items.length > 0) {
          console.log('Juicer feed loaded successfully');
          setIsLoading(false);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        }
        attempts++;
        if (attempts >= 10) {
          clearInterval(intervalId);
        }
      }, 300);
    };

    script.onerror = () => {
      console.error('Failed to load Juicer script');
      setShowFallback(true);
      setIsLoading(false);
    };

    return () => {
      // Cleanup
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

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
        <div className="bg-gradient-to-br from-brodo-blue via-brodo-blue-light to-brodo-blue-dark text-white py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Aktivitas Terbaru
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto">
              Ikuti aktivitas terbaru kami di Instagram.
            </p>
          </div>
        </div>

        <div className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Loading */}
            {isLoading && !showFallback && (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-b-2 border-brodo-blue rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Memuat konten Instagram...</p>
              </div>
            )}

            {/* Juicer container (NO <ul> manually created) */}
            {!showFallback && (
              <div
                id="juicer-container"
                className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
              ></div>
            )}

            {/* Fallback */}
            {showFallback && (
              <div>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium">Menampilkan galeri alternatif</span>
                  </div>
                </div>

                {/* Grid fallback */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instagramPosts.map((post) => (
                    <a
                      key={post.id}
                      href={post.link}
                      target="_blank"
                      className="rounded-lg overflow-hidden shadow hover:shadow-xl transition"
                    >
                      <img src={post.image} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}