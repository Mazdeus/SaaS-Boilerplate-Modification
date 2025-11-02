'use client';

export function CompanyStatsWidget() {
  const stats = [
    {
      icon: '📈',
      label: 'Tahun Berdiri',
      value: '2010',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: '👥',
      label: 'Pelanggan Setia',
      value: '50K+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: '🏆',
      label: 'Produk Terjual',
      value: '200K+',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      icon: '📍',
      label: 'Toko & Mitra',
      value: '30+',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">BRODO dalam Angka</h3>
        <p className="text-xs text-gray-500">
          Perjalanan kami dari waktu ke waktu
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300"
            >
              <div className={`inline-flex rounded-lg p-2 ${stat.bgColor}`}>
                <div className="text-xl">{stat.icon}</div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs leading-tight text-gray-600">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-center text-xs italic text-gray-500">
            "Kepercayaan pelanggan adalah pencapaian terbesar kami"
          </p>
        </div>
      </div>
    </div>
  );
}
