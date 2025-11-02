'use client';

export function SustainabilityWidget() {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-green-100 p-2">
            <span className="text-green-600">🌱</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Langkah Berkelanjutan</h3>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="size-2 rounded-full bg-green-500" />
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Kami berkomitmen mengurangi limbah produksi dan menggunakan bahan ramah 
              lingkungan untuk koleksi terbaru kami.
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">
              🌱 Inisiatif Kami:
            </p>
            <ul className="ml-4 space-y-1 text-xs text-green-800">
              <li>• Penggunaan kulit ramah lingkungan</li>
              <li>• Minimalisir limbah produksi</li>
              <li>• Program daur ulang kemasan</li>
              <li>• Pendampingan pengrajin lokal</li>
            </ul>
          </div>
        </div>

        <a
          href="https://bro.do/pages/about-us"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Pelajari Lebih Lanjut
          <span>🔗</span>
        </a>
      </div>
    </div>
  );
}
