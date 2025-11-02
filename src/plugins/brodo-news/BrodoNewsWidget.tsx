'use client';

export function BrodoNewsWidget() {
  const news = [
    {
      id: 1,
      title: 'Koleksi Winter 2024',
      date: 'Des 2024',
      category: 'Produk Baru',
      badge: 'New',
      badgeColor: 'bg-blue-600',
      description: 'Temukan koleksi terbaru BRODO untuk musim dingin dengan desain yang lebih hangat dan stylish.',
    },
    {
      id: 2,
      title: 'Sale Akhir Tahun',
      date: 'Des 2024',
      category: 'Promo',
      badge: 'Hot',
      badgeColor: 'bg-red-600',
      description: 'Diskon hingga 40% untuk semua koleksi pilihan. Jangan lewatkan!',
    },
    {
      id: 3,
      title: 'Kolaborasi Limited',
      date: 'Jan 2025',
      category: 'Campaign',
      badge: 'Soon',
      badgeColor: 'bg-gray-600',
      description: 'Kolaborasi spesial dengan desainer lokal untuk edisi terbatas.',
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2">
            <span className="text-blue-600">📢</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Kabar BRODO</h3>
        </div>
        <p className="text-xs text-gray-500">
          Update terbaru dan campaign menarik
        </p>
      </div>
      
      <div className="space-y-3">
        {news.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-500 hover:bg-gray-50"
          >
            <div className="mb-2 flex items-start justify-between">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${item.badgeColor}`}>
                {item.badge}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>📅</span>
                {item.date}
              </div>
            </div>
            
            <h4 className="mb-1 text-sm font-semibold transition-colors group-hover:text-blue-600">
              {item.title}
            </h4>
            
            <p className="mb-2 text-xs leading-relaxed text-gray-600">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-blue-600">
                {item.category}
              </span>
              <span className="text-gray-500 transition-all group-hover:translate-x-1 group-hover:text-blue-600">→</span>
            </div>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-2">
          <a
            href="https://bro.do/blogs/news"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Lihat Semua Berita
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
