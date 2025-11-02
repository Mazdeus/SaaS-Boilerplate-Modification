'use client';

export function StoreLocatorWidget() {
  const stores = [
    {
      id: 1,
      name: 'BRODO Kemang',
      address: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
      phone: '+62 21 7199 4567',
      hours: 'Sen-Min: 10.00 - 22.00',
      maps: 'https://goo.gl/maps/example1',
    },
    {
      id: 2,
      name: 'BRODO Senopati',
      address: 'Jl. Senopati No. 25, Jakarta Selatan',
      phone: '+62 21 7278 8901',
      hours: 'Sen-Min: 10.00 - 22.00',
      maps: 'https://goo.gl/maps/example2',
    },
    {
      id: 3,
      name: 'BRODO PIK',
      address: 'PIK Avenue Mall, Jakarta Utara',
      phone: '+62 21 5020 3456',
      hours: 'Sen-Min: 10.00 - 22.00',
      maps: 'https://goo.gl/maps/example3',
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-red-100 p-2">
            <span className="text-red-600">📍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Kunjungi Toko Kami</h3>
        </div>
        <p className="text-xs text-gray-500">
          {stores.length}+ lokasi toko & partner di Indonesia
        </p>
      </div>
      
      <div className="space-y-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="space-y-2 rounded-lg border border-gray-200 p-3 transition-all hover:border-red-300 hover:bg-gray-50"
          >
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-red-600">📍</span>
              {store.name}
            </h4>
            
            <div className="ml-6 space-y-1.5">
              <p className="text-xs leading-relaxed text-gray-600">
                📍 {store.address}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>📞</span>
                <a 
                  href={`tel:${store.phone}`}
                  className="transition-colors hover:text-red-600"
                >
                  {store.phone}
                </a>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>🕐</span>
                {store.hours}
              </div>
            </div>

            <a
              href={store.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span>🧭</span>
              Petunjuk Arah
            </a>
          </div>
        ))}

        <a
          href="https://bro.do/pages/stores"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <span>📍</span>
          Lihat Semua Toko
        </a>

        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="mb-1 text-xs font-medium text-red-900">
            💡 Tips:
          </p>
          <p className="text-xs text-red-800">
            Hubungi toko sebelum berkunjung untuk memastikan stok produk yang Anda inginkan
          </p>
        </div>
      </div>
    </div>
  );
}
