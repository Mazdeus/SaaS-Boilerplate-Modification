'use client';

/**
 * BRODO About Section
 * Company profile about section for BRODO brand
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import { Target, Rocket } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function BrodoAbout() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, infoRes] = await Promise.all([
          fetch('/api/public/about'),
          fetch('/api/public/company-info'),
        ]);
        
        const aboutJson = await aboutRes.json();
        const infoJson = await infoRes.json();
        
        if (aboutJson.success && aboutJson.data) {
          setAboutData(aboutJson.data);
        }
        
        if (infoJson.success && infoJson.data) {
          setCompanyInfo(infoJson.data);
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section id="about" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-12 text-center">
              <div className="mb-2 h-4 w-32 bg-gray-200 rounded mx-auto"></div>
              <div className="mb-4 h-10 w-64 bg-gray-200 rounded mx-auto"></div>
              <div className="h-6 w-full max-w-3xl bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* About us Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium text-amber-700">Tentang Kami</p>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            {aboutData?.title || 'Siapa Kami'}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {aboutData?.description || 'BRODO didirikan di Bandung pada tahun 2010 oleh insinyur muda yang melihat peluang: menyajikan sepatu stylish, berkualitas, dan terjangkau untuk pria di Indonesia.'}
          </p>
        </div>

        {/* Image Grid */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Large image on the left */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="h-96 w-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/img-stock-2.webp)' }}
            />
          </div>

          {/* Two smaller images on the right */}
          <div className="grid grid-rows-2 gap-4">
            <div className="overflow-hidden rounded-lg">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/img-stock-3.webp)' }}
              />
            </div>
            <div className="overflow-hidden rounded-lg">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: 'url(/assets/img-stock-4.webp)' }}
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {/* Mission */}
          <div className="group bg-white p-10 transition-all hover:bg-gray-50">
            <div className="mb-5 inline-flex">
              <Target className="size-7 text-gray-900" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Misi Kami</h3>
            <p className="leading-relaxed text-gray-600">
              {aboutData?.mission || 'Memberdayakan industri alas kaki lokal dan memperkuat kebanggaan terhadap produk Indonesia. Kami memanfaatkan kerajinan lokal di Cibaduyut dan material premium untuk menghasilkan sepatu berkualitas internasional.'}
            </p>
          </div>

          {/* Vision */}
          <div className="group bg-white p-10 transition-all hover:bg-gray-50">
            <div className="mb-5 inline-flex">
              <Rocket className="size-7 text-gray-900" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Visi Kami</h3>
            <p className="leading-relaxed text-gray-600">
              {aboutData?.vision || 'Menjadi brand gaya hidup pria terdepan di Asia Tenggara. Kami berkomitmen untuk terus berinovasi dan menghadirkan produk yang tidak hanya stylish, tetapi juga mencerminkan identitas dan kebanggaan Indonesia.'}
            </p>
          </div>
        </div>

        {/* Company Info Stats */}
        <div className="mb-8 bg-white p-10">
          <h3 className="mb-10 text-center text-xl font-semibold text-gray-900">
            BRODO dalam Angka
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold tracking-tight text-gray-900">{companyInfo?.foundedYear || '2010'}</div>
              <div className="text-sm text-gray-500">Tahun Berdiri</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold tracking-tight text-gray-900">{companyInfo?.employees || '50'}+</div>
              <div className="text-sm text-gray-500">Tim Berpengalaman</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold tracking-tight text-gray-900">100K+</div>
              <div className="text-sm text-gray-500">Produk Terjual</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold tracking-tight text-gray-900">15+</div>
              <div className="text-sm text-gray-500">Tahun Pengalaman</div>
            </div>
          </div>
        </div>

        {/* Founders Info */}
        <div className="border-t border-gray-100 bg-white p-10 pt-16">
          <h3 className="mb-10 text-center text-xl font-semibold text-gray-900">
            Para Pendiri
          </h3>
          <div className="grid gap-12 md:grid-cols-2">
            {/* Founder 1 */}
            <div className="flex flex-col items-center text-center">
              <img 
                src="/assets/muhammad-yukka.webp" 
                alt="Muhammad Yukka Harlanda"
                className="mb-5 size-28 rounded-full object-cover grayscale transition-all hover:grayscale-0"
              />
              <h4 className="mb-1 text-base font-semibold text-gray-900">Muhammad Yukka Harlanda</h4>
              <p className="mb-4 text-sm text-gray-500">Co-Founder & CEO</p>
              <p className="text-sm leading-relaxed text-gray-600">
                Insinyur muda yang memulai BRODO dari kebutuhan pribadi akan sepatu berkualitas. 
                Dengan visi kuat, ia membawa BRODO menjadi brand lokal yang diakui.
              </p>
            </div>

            {/* Founder 2 */}
            <div className="flex flex-col items-center text-center">
              <img 
                src="/assets/putera-dwi.webp" 
                alt="Putera Dwi Karunia"
                className="mb-5 size-28 rounded-full object-cover grayscale transition-all hover:grayscale-0"
              />
              <h4 className="mb-1 text-base font-semibold text-gray-900">Putera Dwi Karunia</h4>
              <p className="mb-4 text-sm text-gray-500">Co-Founder & Creative Partner</p>
              <p className="text-sm leading-relaxed text-gray-600">
                Partner kreatif yang memastikan setiap desain BRODO memiliki karakter unik dan 
                sesuai dengan gaya hidup pria Indonesia modern.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
