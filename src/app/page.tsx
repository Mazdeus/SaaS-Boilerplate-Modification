import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ScrollAnimation from '@/components/ScrollAnimation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/db';
import { heroSections, collections, testimonials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCollectionUrl } from '@/lib/collection-urls';
import SafeImage from '@/components/SafeImage';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHeroSections() {
  const sections = await db
    .select()
    .from(heroSections)
    .where(eq(heroSections.isActive, true))
    .orderBy(heroSections.displayOrder);
  return sections;
}

async function getFeaturedCollections() {
  const collectionsList = await db
    .select()
    .from(collections)
    .where(eq(collections.isActive, true))
    .orderBy(collections.displayOrder)
    .limit(3);
  return collectionsList;
}

async function getTestimonials() {
  const testimonialsList = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(testimonials.displayOrder)
    .limit(3);
  return testimonialsList;
}

export default async function HomePage() {
  const heroSections = await getHeroSections();
  const featuredCollections = await getFeaturedCollections();
  const testimonialsList = await getTestimonials();

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section Carousel */}
        <HeroCarousel slides={heroSections} />

        {/* About Preview */}
        <ScrollAnimation>
          <section className="section-padding bg-gray-50">
            <div className="container-brodo">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="section-title">Tentang Brodo</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Brodo adalah merek alas kaki terkemuka di Indonesia yang memadukan 
                    kerajinan tradisional dengan desain kontemporer. Sejak didirikan, kami 
                    berdedikasi untuk menciptakan sepatu berkualitas tinggi dan autentik yang 
                    menceritakan sebuah kisah.
                  </p>
                  <p className="text-lg text-gray-700 mb-8">
                    Setiap pasang sepatu Brodo merepresentasikan komitmen kami terhadap 
                    keunggulan, keberlanjutan, dan warisan kaya dari kerajinan Indonesia.
                  </p>
                  <Link href="/about" className="btn-primary">
                    Baca Kisah Kami
                  </Link>
                </div>
                <div className="relative h-96 rounded-card-lg overflow-hidden">
                  <Image
                    src="/assets/img-stock-2.webp"
                    alt="Tentang Brodo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Featured Collections */}
        <ScrollAnimation>
          <section className="section-padding">
            <div className="container-brodo">
              <div className="text-center mb-12">
                <h2 className="section-title">Koleksi Kami</h2>
                <p className="section-subtitle">
                  Temukan koleksi alas kaki pilihan kami yang dikurasi dengan teliti
                </p>
              </div>
              {featuredCollections.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto mb-12">
                    {featuredCollections.map((collection, idx) => (
                      <a 
                        key={collection.id}
                        href={getCollectionUrl(collection.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card group cursor-pointer hover:shadow-brodo-lg transition-all duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)] max-w-sm"
                      >
                        <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gray-200">
                          {collection.imageUrl && (
                            <>
                              <Image
                                src={collection.imageUrl}
                                alt={collection.name}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                              />
                              {/* Blue overlay that fades on hover */}
                              <div className="absolute inset-0 bg-brodo-blue opacity-40 group-hover:opacity-0 transition-opacity duration-500" />
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-brodo-blue">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-gray-600 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link href="/collections" className="btn-primary">
                      Lihat Semua Koleksi
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada koleksi tersedia.</p>
                </div>
              )}
            </div>
          </section>
        </ScrollAnimation>

        {/* Testimonials */}
        <ScrollAnimation>
          <section className="section-padding bg-brodo-blue text-white">
            <div className="container-brodo">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Apa Kata Pelanggan Kami
                </h2>
                <p className="text-xl text-gray-200">
                  Dengarkan dari mereka yang mencintai Brodo
                </p>
              </div>
              {testimonialsList.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
                  {testimonialsList.map((testimonial, idx) => (
                    <ScrollAnimation key={testimonial.id} delay={idx * 100}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-card-lg p-6 w-full max-w-sm">
                        {/* Customer Image */}
                        {testimonial.customerImageUrl && (
                          <div className="flex justify-center mb-4">
                            <SafeImage
                              src={testimonial.customerImageUrl}
                              alt={testimonial.customerName}
                              width={80}
                              height={80}
                              className="rounded-full object-cover border-4 border-white/20"
                            />
                          </div>
                        )}
                        
                        {/* Rating Stars */}
                        <div className="flex items-center justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        
                        {/* Testimonial Text */}
                        <p className="text-gray-200 mb-4 text-center">
                          "{testimonial.testimonialText}"
                        </p>
                        
                        {/* Customer Info */}
                        <div className="text-center">
                          <div className="font-semibold">{testimonial.customerName}</div>
                          {testimonial.customerPosition && (
                            <div className="text-sm text-gray-300">{testimonial.customerPosition}</div>
                          )}
                          {testimonial.customerCompany && (
                            <div className="text-sm text-gray-300">{testimonial.customerCompany}</div>
                          )}
                        </div>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-200">Belum ada testimoni tersedia.</p>
                </div>
              )}
            </div>
          </section>
        </ScrollAnimation>

        {/* CTA Section */}
        <ScrollAnimation>
          <section className="section-padding bg-gray-100">
            <div className="container-brodo text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-brodo-blue mb-6">
                Kunjungi Toko Kami
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Rasakan pengalaman Brodo secara langsung di lokasi kami di seluruh Indonesia
              </p>
              <Link href="/stores" className="btn-primary">
                Temukan Toko Terdekat
              </Link>
            </div>
          </section>
        </ScrollAnimation>
      </main>

      <Footer />
    </>
  );
}
