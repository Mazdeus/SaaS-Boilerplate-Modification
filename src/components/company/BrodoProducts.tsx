'use client';

/**
 * BRODO Products Section
 * Product categories showcase for BRODO
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  image: string;
  title: string;
  description: string;
  features: string[];
  link: string;
};

export function BrodoProducts() {
  const [collections, setCollections] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, featuredRes] = await Promise.all([
          fetch('/api/public/collections'),
          fetch('/api/public/products?featured=true'),
        ]);
        
        const collectionsJson = await collectionsRes.json();
        const featuredJson = await featuredRes.json();
        
        if (collectionsJson.success && collectionsJson.data.length > 0) {
          const transformedCollections = collectionsJson.data.map((item: any) => ({
            id: item.id,
            image: item.imageUrl || '/assets/sneakers.webp',
            title: item.name,
            description: item.description || '',
            features: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
            link: item.url || '#',
          }));
          setCollections(transformedCollections);
        }
        
        if (featuredJson.success && featuredJson.data.length > 0) {
          setFeaturedProduct(featuredJson.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch products data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section id="products" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-12 text-center">
              <div className="mb-2 h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              <div className="mb-4 h-10 w-64 bg-gray-200 rounded mx-auto"></div>
              <div className="h-6 w-full max-w-3xl bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="products" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium text-blue-600">Produk Kami</p>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Koleksi BRODO
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Kami menghadirkan berbagai lini produk - dirancang untuk gaya hidup pria Indonesia yang dinamis
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {collections.map(product => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-500 hover:shadow-lg"
            >
              {/* Product Image as Background */}
              <div className="relative h-48 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{product.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <p className="mb-4 text-sm text-gray-600">{product.description}</p>

                {/* Features List */}
                {product.features.length > 0 && (
                  <ul className="mb-6 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={`${product.id}-feature-${index}`} className="flex items-center text-sm text-gray-700">
                        <svg
                          className="mr-2 size-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Lihat Koleksi
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Product Highlight */}
        {featuredProduct && (
          <div className="mt-16 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-3xl font-bold">Produk Unggulan</h3>
                <p className="mb-6 text-lg text-blue-100">
                  {featuredProduct.name} - {featuredProduct.description}
                </p>
                <a
                  href={featuredProduct.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Lihat Detail
                </a>
              </div>
              <div className="overflow-hidden rounded-lg">
                <div
                  className="h-64 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredProduct.imageUrl || '/assets/img-stock-5.webp'})` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Shop CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            Temukan lebih banyak produk BRODO di toko online kami
          </p>
          <a
            href="https://bro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
          >
            Kunjungi Toko BRODO
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
