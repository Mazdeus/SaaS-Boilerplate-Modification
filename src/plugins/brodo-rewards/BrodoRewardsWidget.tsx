'use client';

export function BrodoRewardsWidget() {
  const benefits = [
    { icon: '⭐', text: 'Poin setiap pembelian' },
    { icon: '🎁', text: 'Voucher eksklusif' },
    { icon: '🏆', text: 'Early access produk baru' },
    { icon: '✨', text: 'Birthday surprise' },
  ];

  return (
    <div className="w-full rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-100 p-2">
            <span className="text-amber-600">🎁</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">BRODO Rewards</h3>
        </div>
        <span className="inline-block rounded-full bg-amber-600 px-3 py-1 text-xs font-medium text-white">
          ✨ Program Loyalty
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg bg-white/60 p-4 text-center">
          <p className="text-sm font-semibold text-amber-900">
            Kumpulkan poin, dapatkan rewards!
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-amber-600">
              100
            </span>
            <span className="text-sm text-gray-600">
              poin = Rp 10.000
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-amber-900">
            Keuntungan Member:
          </p>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-white/40 p-2 text-xs text-amber-800"
              >
                <span className="text-amber-600">{benefit.icon}</span>
                {benefit.text}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-amber-100/50 p-3 text-center">
          <p className="mb-1 text-xs font-medium text-amber-900">
            🎁 Bonus Register
          </p>
          <p className="text-lg font-bold text-amber-600">
            50 Poin Gratis!
          </p>
        </div>

        <a
          href="https://bro.do/account/register"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          Daftar Sekarang
        </a>

        <p className="text-center text-[10px] text-gray-600">
          Sudah member? <a href="https://bro.do/account/login" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">Login di sini</a>
        </p>
      </div>
    </div>
  );
}
