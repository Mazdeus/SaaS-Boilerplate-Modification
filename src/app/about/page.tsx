import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { db } from '@/db';
import { aboutSection, founders, companyValues } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAboutData() {
  const [aboutData] = await db.select().from(aboutSection).limit(1);
  return aboutData;
}

async function getFounders() {
  const foundersList = await db
    .select()
    .from(founders)
    .where(eq(founders.isActive, true))
    .orderBy(founders.displayOrder);
  return foundersList;
}

async function getCompanyValues() {
  const valuesList = await db
    .select()
    .from(companyValues)
    .where(eq(companyValues.isActive, true))
    .orderBy(companyValues.displayOrder);
  return valuesList;
}

export default async function AboutPage() {
  const aboutData = await getAboutData();
  const foundersList = await getFounders();
  const valuesList = await getCompanyValues();

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-brodo-blue text-white py-20">
          <div className="container-brodo">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {aboutData?.title || 'Tentang Brodo'}
              </h1>
              <p className="text-xl text-gray-200">
                {aboutData?.introText || 'Pelajari tentang kisah kami, misi, dan orang-orang di balik Brodo.'}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        {aboutData && (
          <section className="section-padding">
            <div className="container-brodo">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Mission */}
                {aboutData.missionTitle && (
                  <div className="card">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-brodo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-brodo-blue mb-4">
                      {aboutData.missionTitle}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {aboutData.missionContent}
                    </p>
                  </div>
                )}

                {/* Vision */}
                {aboutData.visionTitle && (
                  <div className="card">
                    <div className="w-16 h-16 bg-brodo-blue rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-brodo-blue mb-4">
                      {aboutData.visionTitle}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {aboutData.visionContent}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Founders */}
        {foundersList.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-brodo">
              <div className="text-center mb-12">
                <h2 className="section-title">Pendiri Kami</h2>
                <p className="section-subtitle">
                  Kenali para visioner di balik Brodo
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 justify-items-center max-w-3xl mx-auto">
                {foundersList.map((founder) => (
                  <div key={founder.id} className="card text-center w-full max-w-sm">
                    {founder.imageUrl && (
                      <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                        <Image
                          src={founder.imageUrl}
                          alt={founder.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-brodo-blue mb-2">
                      {founder.name}
                    </h3>
                    <p className="text-gray-600 font-medium mb-4">
                      {founder.position}
                    </p>
                    <p className="text-gray-700 mb-6">
                      {founder.bio}
                    </p>
                    <div className="flex justify-center space-x-4">
                      {founder.linkedinUrl && (
                        <a
                          href={founder.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brodo-blue hover:text-brodo-blue-dark transition-colors"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {founder.instagramUrl && (
                        <a
                          href={founder.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brodo-blue hover:text-brodo-blue-dark transition-colors"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Values */}
        {valuesList.length > 0 && (
          <section className="section-padding">
            <div className="container-brodo">
              <div className="text-center mb-12">
                <h2 className="section-title">Nilai-Nilai Kami</h2>
                <p className="section-subtitle">
                  Prinsip yang memandu segala yang kami lakukan
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center max-w-6xl mx-auto">
                {valuesList.map((value, index) => (
                  <div key={value.id} className="text-center w-full max-w-sm">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      index % 2 === 0 ? 'bg-blue-100' : 'bg-brodo-blue'
                    }`}>
                      <svg 
                        className={`w-10 h-10 ${index % 2 === 0 ? 'text-brodo-blue' : 'text-white'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brodo-blue mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
