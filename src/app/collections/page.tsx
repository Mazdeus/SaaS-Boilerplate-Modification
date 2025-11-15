import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCollectionUrl } from '@/lib/collection-urls';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

async function getCollections(): Promise<Collection[]> {
  try {
    // For server-side rendering, use internal API call
    // Check if we're running in server (no window object)
    const isServer = typeof window === 'undefined';
    
    let baseUrl: string;
    if (isServer) {
      // In Docker container, use localhost:3000
      // In development, use localhost:3000
      baseUrl = 'http://localhost:3000';
    } else {
      // Client-side, use public API URL or current origin
      baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    }
    
    console.log('[Collections] Fetching from:', `${baseUrl}/api/collections`, 'isServer:', isServer);
    
    const res = await fetch(`${baseUrl}/api/collections`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[Collections] Response status:', res.status);

    if (!res.ok) {
      console.error('[Collections] API response not OK:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    console.log('[Collections] Data received:', data.data?.length || 0, 'items');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-brodo-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Koleksi Kami
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                Temukan pilihan alas kaki premium kami yang dikurasi dengan penuh hasrat dan presisi.
              </p>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {collections.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Tidak ada koleksi yang tersedia saat ini.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)] max-w-sm"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="relative h-80 overflow-hidden">
                        <SafeImage
                          src={collection.imageUrl}
                          alt={collection.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        {/* Blue overlay that fades on hover */}
                        <div className="absolute inset-0 bg-brodo-blue opacity-40 group-hover:opacity-0 transition-opacity duration-500" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-brodo-blue mb-2 group-hover:text-brodo-blue-light transition-colors">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {collection.description}
                          </p>
                        )}
                        <a 
                          href={getCollectionUrl(collection.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block w-full text-center bg-brodo-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-brodo-blue-light transition-colors duration-300"
                        >
                          Lihat Koleksi
                        </a>
                      </div>
                    </div>
                  </div>
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
