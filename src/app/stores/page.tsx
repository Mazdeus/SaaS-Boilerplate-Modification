import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  openingHours: string | null;
  mapsUrl: string | null;
  imageUrl: string | null;
  instagramUsername: string | null;
  isActive: boolean;
}

async function getStores(): Promise<Store[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/stores`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-brodo-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Toko Kami
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Kunjungi kami di lokasi kami di seluruh Indonesia
        </section>

        {/* Stores List */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {stores.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Tidak ada lokasi toko yang tersedia saat ini.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
                {stores.map((store) => (
                  <a
                    key={store.id}
                    href={store.instagramUsername ? `https://www.instagram.com/${store.instagramUsername}` : '#'}
                    target={store.instagramUsername ? "_blank" : undefined}
                    rel={store.instagramUsername ? "noopener noreferrer" : undefined}
                    className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)] max-w-sm cursor-pointer"
                  >
                    {store.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={store.imageUrl}
                          alt={store.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        {/* Blue overlay that fades on hover */}
                        <div className="absolute inset-0 bg-brodo-blue opacity-40 group-hover:opacity-0 transition-opacity duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-brodo-blue mb-2">
                        {store.name}
                      </h3>
                      
                      <div className="space-y-3 text-gray-600">
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-brodo-blue-light"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p>{store.address}</p>
                            <p>{store.city}, {store.province}</p>
                            {store.postalCode && <p>{store.postalCode}</p>}
                          </div>
                        </div>

                        {store.phone && (
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-3 flex-shrink-0 text-brodo-blue-light"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <a
                              href={`tel:${store.phone}`}
                              className="hover:text-brodo-blue transition-colors"
                            >
                              {store.phone}
                            </a>
                          </div>
                        )}

                        {store.email && (
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-3 flex-shrink-0 text-brodo-blue-light"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <a
                              href={`mailto:${store.email}`}
                              className="hover:text-brodo-blue transition-colors"
                            >
                              {store.email}
                            </a>
                          </div>
                        )}

                        {store.openingHours && (
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-brodo-blue-light"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p>{store.openingHours}</p>
                          </div>
                        )}
                      </div>

                      {store.mapsUrl && (
                        <a
                          href={store.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center text-brodo-blue hover:text-brodo-blue-light transition-colors font-medium"
                        >
                          <span>View on Maps</span>
                          <svg
                            className="ml-2 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
