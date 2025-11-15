import SafeImage from '@/components/SafeImage';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface CollectionImage {
  id: number;
  imageUrl: string;
  altText: string;
  displayOrder: number;
}

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  images: CollectionImage[];
}

async function getCollections(): Promise<Collection[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/collections`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const collections = await getCollections();
  const collection = collections.find((c) => c.slug === params.slug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-brodo-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-lg md:text-xl text-gray-200">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Image */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96 md:h-[600px] rounded-lg overflow-hidden shadow-xl">
                <SafeImage
                  src={collection.imageUrl}
                  alt={collection.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {collection.images && collection.images.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-brodo-blue mb-12 text-center">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collection.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <SafeImage
                        src={image.imageUrl}
                        alt={image.altText || collection.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
