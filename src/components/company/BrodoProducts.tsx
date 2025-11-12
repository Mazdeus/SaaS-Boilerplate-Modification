'use client';

/**
 * BRODO Products Section
 * Product categories showcase for BRODO
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import { Check, ArrowRight } from 'lucide-react';
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
    <section id="products" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm text-gray-500">Produk Kami</p>
          <h2 className="mb-4 text-3xl font-semibold text-gray-900">
            Koleksi BRODO
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-600">
            Kami menghadirkan berbagai lini produk - dirancang untuk gaya hidup pria Indonesia yang dinamis
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {collections.map(product => (
            <div
              key={product.id}
              className="group overflow-hidden bg-white transition-all hover:bg-gray-50"
            >
              {/* Product Image as Background */}
              <div className="relative h-64 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.title}</h3>
                
                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-gray-600">{product.description}</p>

                {/* Features List */}
                {product.features.length > 0 && (
                  <ul className="mb-5 space-y-1.5">
                    {product.features.map((feature, index) => (
                      <li key={`${product.id}-feature-${index}`} className="flex items-start text-xs text-gray-500">
                        <Check className="mr-2 mt-0.5 size-3.5 shrink-0 text-gray-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Link */}
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
                >
                  Lihat Koleksi
                  <ArrowRight className="ml-1 size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Product Highlight */}
        {featuredProduct && (
          <div className="mt-16 border-t border-gray-200 bg-white p-10">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-gray-500">Produk Unggulan</p>
                <h3 className="mb-4 text-2xl font-semibold text-gray-900">{featuredProduct.name}</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  {featuredProduct.description}
                </p>
                <a
                  href={featuredProduct.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-medium text-gray-900 transition-colors hover:text-gray-600"
                >
                  Lihat Detail
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </div>
              <div className="overflow-hidden">
                <div
                  className="h-80 w-full bg-cover bg-center grayscale transition-all hover:grayscale-0"
                  style={{ backgroundImage: `url(${featuredProduct.imageUrl || '/assets/img-stock-5.webp'})` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Shop CTA */}
        <div className="mt-16 border-t border-gray-200 bg-white p-10 text-center">
          <p className="mb-5 text-sm text-gray-600">
            Temukan lebih banyak produk BRODO di toko online kami
          </p>
          <a
            href="https://bro.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium text-gray-900 transition-colors hover:text-gray-600"
          >
            Kunjungi Toko BRODO
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
