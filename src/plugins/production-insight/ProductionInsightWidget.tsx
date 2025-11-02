'use client';

/**
 * Production Insight Widget Plugin
 * Showcases BRODO's production process and craftsmanship
 * Left Sidebar - Company Profile
 */

import React from 'react';

export function ProductionInsightWidget() {
  return (
    <div className="border-b border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        <h3 className="text-lg font-semibold text-gray-900">
          Proses Produksi
        </h3>
      </div>

      <div className="space-y-4">
        {/* Hero Statement */}
        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-red-50 p-4">
          <h4 className="mb-2 text-base font-bold text-gray-900">
            Dibuat dengan Tangan, Bukan Mesin
          </h4>
          <p className="text-sm text-gray-700">
            Setiap pasang sepatu BRODO dikerjakan oleh pengrajin dari Bandung dengan standar presisi tinggi — dari potongan kulit hingga jahitan akhir.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              1
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Pemilihan Material</p>
              <p className="text-xs text-gray-600">Kulit premium pilihan</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
              2
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Pemotongan Presisi</p>
              <p className="text-xs text-gray-600">Dikerjakan dengan teliti</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
              3
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Jahitan Handmade</p>
              <p className="text-xs text-gray-600">Detail sempurna</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
              4
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">Quality Control</p>
              <p className="text-xs text-gray-600">Inspeksi menyeluruh</p>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="overflow-hidden rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=200&fit=crop"
            alt="BRODO Workshop"
            className="size-full object-cover"
          />
        </div>

        {/* CTA */}
        <a
          href="https://www.youtube.com/@BrodoFootwear"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Lihat Proses Produksi
        </a>

        {/* Badge */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-xs font-semibold text-gray-900">🏭 Proudly Made in Bandung</p>
        </div>
      </div>
    </div>
  );
}

export default ProductionInsightWidget;
