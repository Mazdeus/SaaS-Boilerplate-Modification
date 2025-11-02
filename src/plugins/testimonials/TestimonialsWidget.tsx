'use client';

export function TestimonialsWidget() {
  const testimonials = [
    {
      id: 1,
      name: 'Andi Pratama',
      role: 'Entrepreneur',
      rating: 5,
      text: 'Kualitas sepatu BRODO memang luar biasa. Sudah 3 tahun pakai masih tetap bagus dan nyaman!',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      role: 'Content Creator',
      rating: 5,
      text: 'Desainnya timeless dan cocok untuk berbagai acara. Worth every penny!',
      avatar: '👩‍💻',
    },
    {
      id: 3,
      name: 'Budi Santoso',
      role: 'Professional',
      rating: 5,
      text: 'Pelayanan customer service sangat responsif. Pengiriman cepat dan produk sesuai ekspektasi.',
      avatar: '👨‍💼',
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-100 p-2">
            <span className="text-blue-600">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Kata Mereka</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-400">⭐</span>
            ))}
          </div>
          <span className="text-xs text-gray-500">4.9/5.0 (2,847 reviews)</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-300"
          >
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-sm text-amber-400">⭐</span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-xs italic leading-relaxed text-gray-600">
              "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-lg">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-xs font-semibold">{testimonial.name}</p>
                <p className="text-[10px] text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-2 text-center">
          <a
            href="https://bro.do/pages/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Baca Semua Review →
          </a>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="mb-1 text-xs font-medium">✍️ Punya pengalaman dengan BRODO?</p>
          <a
            href="https://bro.do/pages/write-review"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Tulis Review Kamu
          </a>
        </div>
      </div>
    </div>
  );
}
