'use client';

/**
 * BRODO Values Section
 * Company values and philosophy for BRODO
 * Part of Layout & Partial System - Templating Praktikum Week 9
 */

import React from 'react';

type Value = {
  id: number;
  icon: string;
  title: string;
  description: string;
  quote: string;
};

const values: Value[] = [
  {
    id: 1,
    icon: '✨',
    title: 'Keaslian (Authenticity)',
    description: 'Setiap produk dibuat dengan karakter dan kejujuran. Kami bangga dengan identitas lokal dan tidak berusaha meniru brand lain.',
    quote: 'Menjadi diri sendiri adalah kekuatan terbesar',
  },
  {
    id: 2,
    icon: '⭐',
    title: 'Kualitas (Quality)',
    description: 'Material premium, pengerjaan detail, produksi lokal. Kami tidak kompromi dalam hal kualitas untuk kepuasan pelanggan.',
    quote: 'Kualitas bukan kebetulan, tapi hasil dedikasi',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Kemandirian & Kerajinan Lokal',
    description: 'Mengandalkan pengrajin lokal Bandung/Cibaduyut. Kami percaya pada kekuatan kolaborasi dan memberdayakan industri lokal.',
    quote: 'Bersama kita kuat, lokal kita banggakan',
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Inovasi (Innovation)',
    description: 'Terus berkembang mengikuti tren dan teknologi untuk pria aktif. Kami tidak pernah berhenti berinovasi dalam desain dan kenyamanan.',
    quote: 'Inovasi adalah jalan menuju masa depan',
  },
];

export function BrodoValues() {
  return (
    <section id="values" className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium text-blue-600">Nilai & Filosofi</p>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Apa yang Kami Percaya
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Di BRODO, kami percaya bahwa alas kaki bukan sekadar produk - melainkan bagian dari cerita hidup. 
            Nilai-nilai kami menjadi dasar setiap desain, produksi, dan interaksi kami dengan pelanggan.
          </p>
        </div>

        {/* Values Grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          {values.map(value => (
            <div
              key={value.id}
              className="group rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-500 hover:shadow-xl"
            >
              {/* Icon */}
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 text-4xl transition-transform group-hover:scale-110">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-gray-900">{value.title}</h3>

              {/* Description */}
              <p className="mb-4 text-gray-600">{value.description}</p>

              {/* Quote */}
              <blockquote className="border-l-4 border-blue-600 bg-blue-50 p-4 italic text-gray-700">
                "{value.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Philosophy Statement */}
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-6 text-3xl font-bold">
              "Live Epic with Your Shoes"
            </h3>
            <p className="mb-8 text-lg text-blue-100">
              Kami percaya bahwa setiap langkah yang Anda ambil adalah bagian dari perjalanan hidup yang epic. 
              BRODO hadir untuk menemani setiap momen penting, dari hari kerja hingga petualangan akhir pekan. 
              Dengan menggabungkan kenyamanan, gaya, dan kebanggaan lokal, kami ingin Anda merasa percaya diri 
              dan siap menaklukkan dunia dengan sepatu buatan Indonesia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm font-medium">Made in Indonesia</p>
              </div>
              <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm font-medium">Premium Quality</p>
              </div>
              <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm font-medium">Local Pride</p>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsmanship Highlight */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div 
              className="mx-auto mb-4 size-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/img-stock-6.webp)' }}
            />
            <h4 className="mb-2 text-lg font-bold text-gray-900">Produksi Lokal</h4>
            <p className="text-sm text-gray-600">
              Dikerjakan oleh pengrajin berpengalaman di Cibaduyut, Bandung
            </p>
          </div>
          <div className="text-center">
            <div 
              className="mx-auto mb-4 size-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/img-stock-8.webp)' }}
            />
            <h4 className="mb-2 text-lg font-bold text-gray-900">Desain Original</h4>
            <p className="text-sm text-gray-600">
              Setiap produk dirancang khusus untuk gaya hidup pria Indonesia
            </p>
          </div>
          <div className="text-center">
            <div 
              className="mx-auto mb-4 size-20 rounded-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/img-stock-9.webp)' }}
            />
            <h4 className="mb-2 text-lg font-bold text-gray-900">Sustainability</h4>
            <p className="text-sm text-gray-600">
              Komitmen terhadap praktik produksi yang bertanggung jawab
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
