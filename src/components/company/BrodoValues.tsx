'use client';

/**
 * BRODO Values Section
 * Company values and philosophy for BRODO
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import { 
  Heart, 
  Award, 
  Users, 
  Sparkles,
  CheckCircle2,
  Shield,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Value = {
  id: number;
  icon: string;
  title: string;
  description: string;
  quote: string;
};

// Map of icons to use based on keywords in title
const getIconComponent = (title: string, iconString: string) => {
  const lowerTitle = title.toLowerCase();
  
  // Check for specific keywords - using warm brown/amber tones
  if (lowerTitle.includes('kualitas') || lowerTitle.includes('quality')) {
    return <Award className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('inovasi') || lowerTitle.includes('innovation')) {
    return <Lightbulb className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('pelanggan') || lowerTitle.includes('customer')) {
    return <Heart className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('tim') || lowerTitle.includes('team') || lowerTitle.includes('kolaborasi')) {
    return <Users className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('keberlanjutan') || lowerTitle.includes('sustainability')) {
    return <Shield className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('keunggulan') || lowerTitle.includes('excellence')) {
    return <TrendingUp className="size-8 text-amber-700" />;
  }
  if (lowerTitle.includes('kepercayaan') || lowerTitle.includes('trust')) {
    return <CheckCircle2 className="size-8 text-amber-700" />;
  }
  
  // Default to sparkles for other values
  return <Sparkles className="size-8 text-amber-700" />;
};

export function BrodoValues() {
  const [values, setValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        const res = await fetch('/api/public/services');
        const data = await res.json();
        
        if (data.success && data.data.length > 0) {
          const transformedValues = data.data.map((item: any) => ({
            id: item.id,
            icon: item.icon || '⭐',
            title: item.title,
            description: item.description || '',
            quote: item.subtitle || 'Our core value',
          }));
          setValues(transformedValues);
        }
      } catch (error) {
        console.error('Failed to fetch values:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValues();
  }, []);

  if (isLoading) {
    return (
      <section id="values" className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-12 text-center">
              <div className="mb-2 h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              <div className="mb-4 h-10 w-64 bg-gray-200 rounded mx-auto"></div>
              <div className="h-6 w-full max-w-3xl bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="values" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm text-gray-500">Nilai & Filosofi</p>
          <h2 className="mb-4 text-3xl font-semibold text-gray-900">
            Apa yang Kami Percaya
          </h2>
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-600">
            Di BRODO, kami percaya bahwa alas kaki bukan sekadar produk - melainkan bagian dari cerita hidup. 
            Nilai-nilai kami menjadi dasar setiap desain, produksi, dan interaksi kami dengan pelanggan.
          </p>
        </div>

        {/* Values Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {values.map(value => (
            <div
              key={value.id}
              className="group border-l-2 border-gray-200 bg-gray-50 p-10 transition-all hover:border-gray-900 hover:bg-white"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex">
                {getIconComponent(value.title, value.icon)}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{value.title}</h3>

              {/* Description */}
              <p className="mb-5 leading-relaxed text-gray-600">{value.description}</p>

              {/* Quote */}
              <blockquote className="text-sm italic text-gray-500">
                "{value.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Philosophy Statement */}
        <div className="border-t border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-5 text-2xl font-semibold text-gray-900">
              "Live Epic with Your Shoes"
            </h3>
            <p className="mb-10 leading-relaxed text-gray-600">
              Kami percaya bahwa setiap langkah yang Anda ambil adalah bagian dari perjalanan hidup yang epic. 
              BRODO hadir untuk menemani setiap momen penting, dari hari kerja hingga petualangan akhir pekan. 
              Dengan menggabungkan kenyamanan, gaya, dan kebanggaan lokal, kami ingin Anda merasa percaya diri 
              dan siap menaklukkan dunia dengan sepatu buatan Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>Made in Indonesia</span>
              <span>•</span>
              <span>Premium Quality</span>
              <span>•</span>
              <span>Local Pride</span>
            </div>
          </div>
        </div>

        {/* Craftsmanship Highlight */}
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <div className="text-center">
            <div 
              className="mx-auto mb-5 size-24 rounded-full bg-cover bg-center grayscale transition-all hover:grayscale-0"
              style={{ backgroundImage: 'url(/assets/img-stock-6.webp)' }}
            />
            <h4 className="mb-2 text-base font-semibold text-gray-900">Produksi Lokal</h4>
            <p className="text-sm leading-relaxed text-gray-600">
              Dikerjakan oleh pengrajin berpengalaman di Cibaduyut, Bandung
            </p>
          </div>
          <div className="text-center">
            <div 
              className="mx-auto mb-5 size-24 rounded-full bg-cover bg-center grayscale transition-all hover:grayscale-0"
              style={{ backgroundImage: 'url(/assets/img-stock-8.webp)' }}
            />
            <h4 className="mb-2 text-base font-semibold text-gray-900">Desain Original</h4>
            <p className="text-sm leading-relaxed text-gray-600">
              Setiap produk dirancang khusus untuk gaya hidup pria Indonesia
            </p>
          </div>
          <div className="text-center">
            <div 
              className="mx-auto mb-5 size-24 rounded-full bg-cover bg-center grayscale transition-all hover:grayscale-0"
              style={{ backgroundImage: 'url(/assets/img-stock-9.webp)' }}
            />
            <h4 className="mb-2 text-base font-semibold text-gray-900">Sustainability</h4>
            <p className="text-sm leading-relaxed text-gray-600">
              Komitmen terhadap praktik produksi yang bertanggung jawab
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
