'use client';

export function FeaturedProductWidget() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="space-y-2 p-6 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Produk Pilihan</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            ⭐ Best Seller
          </span>
        </div>
      </div>
      
      <div className="space-y-4 p-6 pb-6 pt-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img 
            src="/assets/ventura.webp" 
            alt="BRODO Ventura Full Black EL"
            className="size-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 text-base font-semibold">BRODO - Sepatu Ventura Full Black EL</h3>
            <p className="text-xs leading-relaxed text-gray-600">
              Sepatu formal premium dengan desain minimalis dan kenyamanan maksimal. 
              Cocok untuk berbagai acara formal.
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400">⭐</span>
            ))}
            <span className="ml-1 text-xs text-gray-500">(4.9 / 5.0)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">Rp 685.000</span>
            <span className="text-sm text-gray-500 line-through">Rp 891.000</span>
          </div>

          {/* Features */}
          <div className="space-y-1 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium">✓ Full Grain Leather</p>
            <p className="text-xs font-medium">✓ Handcrafted Quality</p>
            <p className="text-xs font-medium">✓ Free Shipping</p>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="https://bro.do/collections/footwear"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8B4513] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6F3609]"
        >
          <span>🛍️</span>
          Lihat Produk
        </a>

        <p className="text-center text-[10px] text-gray-500">
          *Promo terbatas hingga akhir bulan
        </p>
      </div>
    </div>
  );
}
