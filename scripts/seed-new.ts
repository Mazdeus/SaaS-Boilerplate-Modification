// ====================================================================
// BRODO CMS - Database Seed Script
// Migrate data from setup-complete.sql to new schema
// ====================================================================

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import * as schema from '../src/db/schema';

// Load environment variables
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env.local');
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // ================================================================
    // CLEAR ALL EXISTING DATA (in reverse order of dependencies)
    // ================================================================
    console.log('🗑️  Clearing existing data...');
    
    await db.delete(schema.collectionImages);
    await db.delete(schema.images);
    await db.delete(schema.collections);
    await db.delete(schema.testimonials);
    await db.delete(schema.stores);
    await db.delete(schema.contactMessages);
    await db.delete(schema.companyValues);
    await db.delete(schema.founders);
    await db.delete(schema.aboutSection);
    await db.delete(schema.heroSections);
    await db.delete(schema.seoSettings);
    await db.delete(schema.socialMedia);
    await db.delete(schema.companyInfo);
    await db.delete(schema.cmsUsers);
    
    console.log('✅ All existing data cleared\n');

    // ================================================================
    // 1. CMS USERS (Authentication)
    // ================================================================
    console.log('📝 Seeding CMS Users...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(schema.cmsUsers).values({
      username: 'admin',
      email: 'admin@brodo.com',
      passwordHash: hashedPassword,
      fullName: 'Admin BRODO',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ CMS User created: admin@brodo.com (password: admin123)\n');

    // ================================================================
    // 2. HERO SECTIONS (Homepage Slider)
    // ================================================================
    console.log('📝 Seeding Hero Sections...');
    await db.insert(schema.heroSections).values([
      {
        title: 'BRODO',
        subtitle: 'Langkah Awal Gaya Lokal',
        description: 'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter, hasil karya anak bangsa dari Bandung.',
        imageUrl: '/assets/img-stock-1.webp',
        ctaText: 'Lihat Produk',
        ctaLink: '/collections',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'Innovation & Excellence',
        subtitle: 'Dari Bandung untuk Indonesia',
        description: 'Sejak 2010, kami memanfaatkan kerajinan lokal Cibaduyut dan material premium untuk menciptakan alas kaki stylish yang terjangkau untuk pria Indonesia.',
        imageUrl: '/assets/img-stock-7.webp',
        ctaText: 'Tentang Kami',
        ctaLink: '/about',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'Quality Craftsmanship',
        subtitle: 'Produk Berkualitas Internasional',
        description: 'Setiap produk BRODO dirancang dengan detail, menggunakan bahan pilihan dan dikerjakan oleh pengrajin berpengalaman untuk hasil terbaik.',
        imageUrl: '/assets/img-stock-10.webp',
        ctaText: 'Nilai Kami',
        ctaLink: '/about#values',
        displayOrder: 3,
        isActive: true,
      },
      {
        title: 'Join the Movement',
        subtitle: 'Live Epic with Your Shoes',
        description: 'Bergabunglah dengan ribuan pria Indonesia yang telah mempercayai BRODO sebagai pilihan alas kaki mereka. Wujudkan gaya hidup yang epic!',
        imageUrl: '/assets/img-stock-13.webp',
        ctaText: 'Hubungi Kami',
        ctaLink: '/contact',
        displayOrder: 4,
        isActive: true,
      },
    ]);
    console.log('✅ 4 Hero Sections created\n');

    // ================================================================
    // 3. ABOUT SECTION
    // ================================================================
    console.log('📝 Seeding About Section...');
    await db.insert(schema.aboutSection).values({
      title: 'Tentang BRODO',
      introText: 'BRODO didirikan di Bandung pada tahun 2010 oleh insinyur muda yang melihat peluang: menyajikan sepatu stylish, berkualitas, dan terjangkau untuk pria di Indonesia.',
      storyTitle: 'Cerita Kami',
      storyContent: 'Kami memanfaatkan kerajinan lokal di Cibaduyut dan material premium untuk menghasilkan sepatu berkualitas internasional. Setiap produk BRODO dirancang dengan detail dan dikerjakan oleh pengrajin berpengalaman.',
      missionTitle: 'Misi',
      missionContent: 'Memberdayakan industri alas kaki lokal dan memperkuat kebanggaan terhadap produk Indonesia. Kami memanfaatkan kerajinan lokal di Cibaduyut dan material premium untuk menghasilkan sepatu berkualitas internasional.',
      visionTitle: 'Visi',
      visionContent: 'Menjadi brand gaya hidup pria terdepan di Asia Tenggara. Kami berkomitmen untuk terus berinovasi dan menghadirkan produk yang tidak hanya stylish, tetapi juga mencerminkan identitas dan kebanggaan Indonesia.',
      imageUrl: '/assets/img-stock-2.webp',
      statsLabel1: 'Pelanggan',
      statsValue1: 100000,
      statsLabel2: 'Tahun Berdiri',
      statsValue2: 15,
      statsLabel3: 'Toko',
      statsValue3: 15,
      statsLabel4: 'Tim',
      statsValue4: 50,
    });
    console.log('✅ About Section created\n');

    // ================================================================
    // 4. COMPANY VALUES
    // ================================================================
    console.log('📝 Seeding Company Values...');
    await db.insert(schema.companyValues).values([
      {
        icon: '✨',
        title: 'Keaslian (Authenticity)',
        subtitle: 'Menjadi diri sendiri adalah kekuatan terbesar.',
        description: 'Setiap produk dibuat dengan karakter dan kejujuran. Kami bangga dengan identitas lokal dan tidak berusaha meniru brand lain. Menjadi diri sendiri adalah kekuatan terbesar.',
        displayOrder: 1,
        isActive: true,
      },
      {
        icon: '⭐',
        title: 'Kualitas (Quality)',
        subtitle: 'Kualitas bukan kebetulan, tapi hasil dedikasi.',
        description: 'Material premium, pengerjaan detail, produksi lokal. Kami tidak kompromi dalam hal kualitas untuk kepuasan pelanggan. Kualitas bukan kebetulan, tapi hasil dedikasi.',
        displayOrder: 2,
        isActive: true,
      },
      {
        icon: '🤝',
        title: 'Kemandirian & Kerajinan Lokal',
        subtitle: 'Dibuat oleh tangan lokal, untuk kebanggaan nasional.',
        description: 'Mengandalkan pengrajin lokal Bandung/Cibaduyut. Kami percaya pada kekuatan kolaborasi dan memberdayakan industri lokal. Bersama kita kuat, lokal kita banggakan.',
        displayOrder: 3,
        isActive: true,
      },
      {
        icon: '🚀',
        title: 'Inovasi (Innovation)',
        subtitle: 'Berinovasi tanpa henti, melangkah menuju masa depan.',
        description: 'Terus berkembang mengikuti tren dan teknologi untuk pria aktif. Kami tidak pernah berhenti berinovasi dalam desain dan kenyamanan. Inovasi adalah jalan menuju masa depan.',
        displayOrder: 4,
        isActive: true,
      },
    ]);
    console.log('✅ 4 Company Values created\n');

    // ================================================================
    // 5. FOUNDERS
    // ================================================================
    console.log('📝 Seeding Founders...');
    await db.insert(schema.founders).values([
      {
        name: 'Muhammad Yukka Harlanda',
        position: 'Co-Founder & CEO',
        bio: 'Insinyur muda yang memulai BRODO dari kebutuhan pribadi akan sepatu berkualitas. Dengan visi kuat, ia membawa BRODO menjadi brand lokal yang diakui.',
        imageUrl: '/assets/muhammad-yukka.webp',
        linkedinUrl: 'https://www.linkedin.com/in/yukka-harlanda/',
        displayOrder: 1,
        isActive: true,
      },
      {
        name: 'Putera Dwi Karunia',
        position: 'Co-Founder & Creative Partner',
        bio: 'Partner kreatif yang memastikan setiap desain BRODO memiliki karakter unik dan sesuai dengan gaya hidup pria Indonesia modern.',
        imageUrl: '/assets/putera-dwi.webp',
        linkedinUrl: 'https://www.linkedin.com/in/putera-dwi/',
        displayOrder: 2,
        isActive: true,
      },
    ]);
    console.log('✅ 2 Founders created\n');

    // ================================================================
    // 6. COLLECTIONS
    // ================================================================
    console.log('📝 Seeding Collections...');
    const collectionsData = await db.insert(schema.collections).values([
      {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Sola nyaman, desain modern, cocok untuk aktivitas harian & kasual',
        imageUrl: '/assets/sneakers.webp',
        displayOrder: 1,
        isActive: true,
      },
      {
        name: 'Formal Sandals',
        slug: 'formal-sandals',
        description: 'Santai namun stylish, cocok untuk waktu luang dan acara semi-formal',
        imageUrl: '/assets/sandals.webp',
        displayOrder: 2,
        isActive: true,
      },
      {
        name: 'Essentials',
        slug: 'essentials',
        description: 'Koleksi pakaian essential untuk melengkapi gaya BRODO',
        imageUrl: '/assets/essentials.webp',
        displayOrder: 3,
        isActive: true,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Kaus kaki premium, sabuk kulit, dompet - melengkapi gaya BRODO',
        imageUrl: '/assets/accessories.webp',
        displayOrder: 4,
        isActive: true,
      },
    ]).returning();
    console.log('✅ 4 Collections created\n');

    // ================================================================
    // 7. IMAGES LIBRARY
    // ================================================================
    console.log('📝 Seeding Images Library...');
    const imagesData = await db.insert(schema.images).values([
      // Hero images
      { fileName: 'img-stock-1.webp', url: '/assets/img-stock-1.webp', altText: 'BRODO Hero Image', category: 'hero' },
      { fileName: 'img-stock-7.webp', url: '/assets/img-stock-7.webp', altText: 'Innovation & Excellence', category: 'hero' },
      { fileName: 'img-stock-10.webp', url: '/assets/img-stock-10.webp', altText: 'Quality Craftsmanship', category: 'hero' },
      { fileName: 'img-stock-13.webp', url: '/assets/img-stock-13.webp', altText: 'Join the Movement', category: 'hero' },
      
      // Collection images
      { fileName: 'sneakers.webp', url: '/assets/sneakers.webp', altText: 'BRODO Sneakers Collection', category: 'collection' },
      { fileName: 'sandals.webp', url: '/assets/sandals.webp', altText: 'BRODO Formal Sandals', category: 'collection' },
      { fileName: 'essentials.webp', url: '/assets/essentials.webp', altText: 'BRODO Essentials', category: 'collection' },
      { fileName: 'accessories.webp', url: '/assets/accessories.webp', altText: 'BRODO Accessories', category: 'collection' },
      
      // Product stock images
      { fileName: 'img-stock-2.webp', url: '/assets/img-stock-2.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-3.webp', url: '/assets/img-stock-3.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-4.webp', url: '/assets/img-stock-4.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-5.webp', url: '/assets/img-stock-5.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-6.webp', url: '/assets/img-stock-6.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-8.webp', url: '/assets/img-stock-8.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-9.webp', url: '/assets/img-stock-9.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-11.webp', url: '/assets/img-stock-11.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'img-stock-12.webp', url: '/assets/img-stock-12.webp', altText: 'BRODO Product', category: 'product' },
      { fileName: 'ventura.webp', url: '/assets/ventura.webp', altText: 'BRODO Ventura Series', category: 'product' },
      
      // Team images
      { fileName: 'muhammad-yukka.webp', url: '/assets/muhammad-yukka.webp', altText: 'Muhammad Yukka Harlanda', category: 'team' },
      { fileName: 'putera-dwi.webp', url: '/assets/putera-dwi.webp', altText: 'Putera Dwi Karunia', category: 'team' },
      
      // Logo
      { fileName: 'brodo-logo-horizontal.png', url: '/assets/brodo-logo-horizontal.png', altText: 'BRODO Logo', category: 'general' },
      { fileName: 'brodo-logo-square.png', url: '/assets/brodo-logo-square.png', altText: 'BRODO Logo Square', category: 'general' },
    ]).returning();
    console.log('✅ 22 Images created\n');

    // ================================================================
    // 8. COLLECTION IMAGES (Gallery)
    // ================================================================
    console.log('📝 Seeding Collection Images...');
    await db.insert(schema.collectionImages).values([
      // Sneakers collection
      { collectionId: collectionsData[0].id, imageId: imagesData[8].id, caption: 'Classic Sneakers', displayOrder: 1 },
      { collectionId: collectionsData[0].id, imageId: imagesData[9].id, caption: 'Modern Design', displayOrder: 2 },
      { collectionId: collectionsData[0].id, imageId: imagesData[10].id, caption: 'Comfort Fit', displayOrder: 3 },
      { collectionId: collectionsData[0].id, imageId: imagesData[17].id, caption: 'Ventura Series', displayOrder: 4 },
      
      // Formal Sandals collection
      { collectionId: collectionsData[1].id, imageId: imagesData[11].id, caption: 'Premium Sandals', displayOrder: 1 },
      { collectionId: collectionsData[1].id, imageId: imagesData[12].id, caption: 'Casual Style', displayOrder: 2 },
      { collectionId: collectionsData[1].id, imageId: imagesData[13].id, caption: 'Summer Collection', displayOrder: 3 },
      
      // Essentials collection
      { collectionId: collectionsData[2].id, imageId: imagesData[14].id, caption: 'Essential Wear', displayOrder: 1 },
      { collectionId: collectionsData[2].id, imageId: imagesData[15].id, caption: 'Daily Essentials', displayOrder: 2 },
      
      // Accessories collection
      { collectionId: collectionsData[3].id, imageId: imagesData[16].id, caption: 'Premium Accessories', displayOrder: 1 },
    ]);
    console.log('✅ 10 Collection Images linked\n');

    // ================================================================
    // 9. STORES
    // ================================================================
    console.log('📝 Seeding Stores...');
    await db.insert(schema.stores).values([
      {
        name: 'Brodo Kemang',
        address: 'Jl. Kemang Selatan VIII No.55, RW.2, Bangka, Kec. Mampang Prapatan',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12730',
        phoneNumber: '0821-8477-1510',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Kemang+Jakarta',
        instagramUsername: 'brodokemang',
        displayOrder: 1,
        isActive: false,
      },
      {
        name: 'Brodo Grand Indonesia',
        address: 'Grand Indonesia East Mall Lt.3, Jalan MH. Thamrin No.1, Menteng',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        postalCode: '10230',
        phoneNumber: '0852-1266-5211',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Grand+Indonesia+East+Mall',
        instagramUsername: 'brodograndindo',
        displayOrder: 2,
        isActive: true,
      },
      {
        name: 'Brodo Tebet',
        address: 'Jl. Tebet Utara Dalam No.7, RT.3/RW.2, Tebet Timur',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12820',
        phoneNumber: '0852-1310-4344',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Tebet+Jakarta',
        instagramUsername: 'brodotebet',
        displayOrder: 3,
        isActive: false,
      },
      {
        name: 'Brodo Bandung',
        address: 'Jl. Lombok No.11, Merdeka, Kec. Sumur Bandung',
        city: 'Bandung',
        province: 'Jawa Barat',
        postalCode: '40113',
        phoneNumber: '0822-4684-7084',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Bandung',
        instagramUsername: 'brodobandung',
        displayOrder: 4,
        isActive: true,
      },
      {
        name: 'Brodo Bekasi',
        address: 'Jl. Boulevard Raya No.35, RT.005/RW.017, Jaka Setia, Bekasi Selatan',
        city: 'Bekasi',
        province: 'Jawa Barat',
        postalCode: '17147',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Bekasi',
        instagramUsername: 'brodobekasi',
        displayOrder: 5,
        isActive: false,
      },
      {
        name: 'Brodo Depok',
        address: 'Jl. Margonda No.303b, Kemiri Muka, Kecamatan Beji',
        city: 'Depok',
        province: 'Jawa Barat',
        postalCode: '16423',
        phoneNumber: '0852-1991-3802',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Depok',
        instagramUsername: 'brododepok',
        displayOrder: 6,
        isActive: false,
      },
      {
        name: 'Brodo Tangerang',
        address: 'Ruko South Goldfinch Blok B.10, Jl. Springs Boulevard, Gading Serpong, Kec. Pagedangan',
        city: 'Kabupaten Tangerang',
        province: 'Banten',
        postalCode: '15332',
        phoneNumber: '0812-9110-0520',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Tangerang+Gading+Serpong',
        instagramUsername: 'brodotangerang',
        displayOrder: 7,
        isActive: false,
      },
      {
        name: 'Brodo Surabaya',
        address: 'Tunjungan Plaza 2 Lt.1, Jl. Basuki Rahmat No.8-12, Kedungdoro',
        city: 'Surabaya',
        province: 'Jawa Timur',
        postalCode: '60261',
        phoneNumber: '0821-3131-7926',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Tunjungan+Plaza+2+Surabaya',
        instagramUsername: 'brodosurabaya',
        displayOrder: 8,
        isActive: false,
      },
      {
        name: 'Shoes And Care Malang',
        address: 'Terusan Dieng 33',
        city: 'Malang',
        province: 'Jawa Timur',
        postalCode: '65146',
        operatingHours: '09:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Terusan+Dieng+33+Malang',
        displayOrder: 9,
        isActive: false,
      },
      {
        name: 'Brodo Jogja',
        address: 'Jl. Affandi No.51, Gejayan, Kec. Depok',
        city: 'Yogyakarta',
        province: 'Daerah Istimewa Yogyakarta',
        postalCode: '55281',
        phoneNumber: '0812-1919-2057',
        operatingHours: '10:00–21:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Jogja+Affandi',
        instagramUsername: 'brodojogja',
        displayOrder: 10,
        isActive: true,
      },
      {
        name: 'Brodo Medan',
        address: 'Jl. Setia Budi Kel. No.14C, Tj. Rejo, Medan Sunggal',
        city: 'Medan',
        province: 'Sumatera Utara',
        postalCode: '20119',
        phoneNumber: '0821-2413-0427',
        operatingHours: '10:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Medan',
        instagramUsername: 'brodomedan',
        displayOrder: 11,
        isActive: false,
      },
      {
        name: 'Brodo Aceh',
        address: 'Jl. Tgk. T. Panglima Nyak Makam No.88, Lambhuk, Ulee Kareng',
        city: 'Banda Aceh',
        province: 'Aceh',
        postalCode: '23118',
        phoneNumber: '0823-2014-6478',
        operatingHours: '09:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Brodo+Aceh',
        instagramUsername: 'brodo.aceh',
        displayOrder: 12,
        isActive: false,
      },
      {
        name: 'Rahada Pekanbaru',
        address: 'Jalan Garuda Sakti Gg. Sepakat No.35, Kecamatan Tampan',
        city: 'Pekanbaru',
        province: 'Riau',
        phoneNumber: '0813-1772-2237',
        operatingHours: '09:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Rahada+Pekanbaru',
        displayOrder: 13,
        isActive: false,
      },
      {
        name: 'Harapan Madjoe Denpasar',
        address: 'Jalan Lange V, Denpasar Barat',
        city: 'Denpasar',
        province: 'Bali',
        operatingHours: '09:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Harapan+Madjoe+Denpasar+Bali',
        displayOrder: 14,
        isActive: false,
      },
      {
        name: 'Super Local Palu',
        address: 'Jl. Jenderal Basuki Rahmat, Tatura Selatan, Kec. Palu Selatan',
        city: 'Palu',
        province: 'Sulawesi Tengah',
        postalCode: '94111',
        operatingHours: '09:00–20:00',
        mapUrl: 'https://maps.google.com/?q=Super+Local+Palu',
        displayOrder: 15,
        isActive: false,
      },
    ]);
    console.log('✅ 15 Stores created\n');

    // ================================================================
    // 10. TESTIMONIALS
    // ================================================================
    console.log('📝 Seeding Testimonials...');
    await db.insert(schema.testimonials).values([
      {
        customerName: 'Budi Santoso',
        customerCompany: 'Entrepreneur',
        testimonialText: 'BRODO adalah pilihan terbaik untuk sepatu sehari-hari. Nyaman, stylish, dan yang penting buatan Indonesia!',
        rating: 5,
        displayOrder: 1,
        isActive: true,
      },
      {
        customerName: 'Ahmad Rahman',
        customerCompany: 'Creative Director',
        testimonialText: 'Kualitas setara brand internasional dengan harga yang lebih terjangkau. Bangga pakai produk lokal!',
        rating: 5,
        displayOrder: 2,
        isActive: true,
      },
      {
        customerName: 'Dimas Prasetyo',
        customerCompany: 'Software Engineer',
        testimonialText: 'Sudah 3 tahun pakai BRODO dan tidak pernah kecewa. Desainnya selalu update dan kualitasnya konsisten.',
        rating: 5,
        displayOrder: 3,
        isActive: true,
      },
      {
        customerName: 'Andi Pratama',
        customerCompany: 'Entrepreneur',
        testimonialText: 'Kualitas sepatu BRODO memang luar biasa. Sudah 3 tahun pakai masih tetap bagus dan nyaman!',
        rating: 5,
        displayOrder: 4,
        isActive: true,
      },
      {
        customerName: 'Siti Nurhaliza',
        customerCompany: 'Content Creator',
        testimonialText: 'Desainnya timeless dan cocok untuk berbagai acara. Worth every penny!',
        rating: 5,
        displayOrder: 5,
        isActive: true,
      },
    ]);
    console.log('✅ 5 Testimonials created\n');

    // ================================================================
    // 11. CONTACT MESSAGES (Sample)
    // ================================================================
    console.log('📝 Seeding Contact Messages...');
    await db.insert(schema.contactMessages).values({
      name: 'Ahmad Maulana',
      email: 'ahmad@example.com',
      phoneNumber: '+6281234567890',
      subject: 'Pertanyaan tentang produk',
      message: 'Halo, saya tertarik dengan koleksi sneakers BRODO. Apakah tersedia untuk ukuran 44?',
      isRead: false,
    });
    console.log('✅ 1 Sample Contact Message created\n');

    // ================================================================
    // 12. COMPANY INFO (Global Settings)
    // ================================================================
    console.log('📝 Seeding Company Info...');
    await db.insert(schema.companyInfo).values({
      companyName: 'BRODO',
      tagline: 'Langkah Awal Gaya Lokal',
      description: 'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter, hasil karya anak bangsa dari Bandung.',
      foundedYear: 2010,
      email: 'hello@bro.do',
      phoneNumber: '(022) 8811-5555',
      whatsappNumber: '+62 812-3456-7890',
      address: 'Jl. Gudang Utara No. 40B',
      city: 'Bandung',
      province: 'Jawa Barat',
      logoUrl: '/assets/brodo-logo-horizontal.png',
      faviconUrl: '/favicon.ico',
      footerText: '© 2024 BRODO Indonesia. All rights reserved. Crafted with passion in Bandung.',
    });
    console.log('✅ Company Info created\n');

    // ================================================================
    // 13. SOCIAL MEDIA
    // ================================================================
    console.log('📝 Seeding Social Media...');
    await db.insert(schema.socialMedia).values([
      {
        platform: 'instagram',
        url: 'https://www.instagram.com/brodo.footwear/',
        displayOrder: 1,
        isActive: true,
      },
      {
        platform: 'facebook',
        url: 'https://www.facebook.com/BRODOfootwear/',
        displayOrder: 2,
        isActive: true,
      },
      {
        platform: 'twitter',
        url: 'https://twitter.com/brodo',
        displayOrder: 3,
        isActive: true,
      },
      {
        platform: 'youtube',
        url: 'https://www.youtube.com/channel/UCxxx',
        displayOrder: 4,
        isActive: true,
      },
      {
        platform: 'linkedin',
        url: 'https://www.linkedin.com/company/brodo/',
        displayOrder: 5,
        isActive: true,
      },
    ]);
    console.log('✅ 5 Social Media links created\n');

    // ================================================================
    // 14. SEO SETTINGS
    // ================================================================
    console.log('📝 Seeding SEO Settings...');
    await db.insert(schema.seoSettings).values([
      {
        pageName: 'homepage',
        metaTitle: 'BRODO - Sepatu Lokal Berkualitas Premium | Live Epic with Your Shoes',
        metaDescription: 'BRODO adalah brand sepatu lokal Indonesia dengan kualitas premium. Sejak 2010 dari Bandung untuk Indonesia. Sneakers, Sandals, Essentials & Accessories.',
        metaKeywords: 'BRODO, sepatu lokal, sepatu Indonesia, sneakers, sandals, footwear, Bandung, Cibaduyut, sepatu pria',
        ogImage: '/assets/img-stock-1.webp',
      },
      {
        pageName: 'about',
        metaTitle: 'Tentang BRODO - Brand Sepatu Lokal Indonesia Sejak 2010',
        metaDescription: 'Kenali lebih dekat BRODO, brand sepatu lokal Indonesia yang didirikan di Bandung tahun 2010. Misi, visi, dan nilai-nilai kami dalam menghadirkan produk berkualitas.',
        metaKeywords: 'tentang BRODO, sejarah BRODO, visi misi BRODO, brand lokal Indonesia',
        ogImage: '/assets/img-stock-2.webp',
      },
      {
        pageName: 'collections',
        metaTitle: 'Koleksi Produk BRODO - Sneakers, Sandals, Essentials & Accessories',
        metaDescription: 'Jelajahi koleksi lengkap BRODO: Sneakers modern, Formal Sandals stylish, Essentials wear, dan Accessories premium. Produk berkualitas untuk gaya hidup Anda.',
        metaKeywords: 'koleksi BRODO, sneakers BRODO, sandals BRODO, accessories BRODO',
        ogImage: '/assets/sneakers.webp',
      },
      {
        pageName: 'stores',
        metaTitle: 'Lokasi Toko BRODO - 15+ Store di Seluruh Indonesia',
        metaDescription: 'Temukan toko BRODO terdekat di Jakarta, Bandung, Surabaya, Yogyakarta, Medan, dan kota besar lainnya. 15+ store di seluruh Indonesia.',
        metaKeywords: 'toko BRODO, store BRODO, lokasi BRODO, BRODO Jakarta, BRODO Bandung',
        ogImage: '/assets/img-stock-3.webp',
      },
      {
        pageName: 'contact',
        metaTitle: 'Hubungi Kami - BRODO Indonesia',
        metaDescription: 'Ada pertanyaan atau ingin berkolaborasi? Hubungi tim BRODO melalui email, telepon, atau kunjungi kantor pusat kami di Bandung.',
        metaKeywords: 'kontak BRODO, hubungi BRODO, customer service BRODO',
        ogImage: '/assets/img-stock-4.webp',
      },
      {
        pageName: 'instagram',
        metaTitle: 'Instagram Feed BRODO - Update Terbaru & Inspirasi',
        metaDescription: 'Lihat update terbaru dari BRODO Instagram. Inspirasi gaya, product launch, dan behind the scenes dari brand sepatu lokal Indonesia favorit Anda.',
        metaKeywords: 'instagram BRODO, social media BRODO, update BRODO',
        ogImage: '/assets/img-stock-5.webp',
      },
    ]);
    console.log('✅ 6 SEO Settings created\n');

    // ================================================================
    // SEED COMPLETE
    // ================================================================
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 CMS User');
    console.log('   - 4 Hero Sections');
    console.log('   - 1 About Section');
    console.log('   - 4 Company Values');
    console.log('   - 2 Founders');
    console.log('   - 4 Collections');
    console.log('   - 22 Images');
    console.log('   - 10 Collection Images');
    console.log('   - 15 Stores');
    console.log('   - 5 Testimonials');
    console.log('   - 1 Contact Message');
    console.log('   - 1 Company Info');
    console.log('   - 5 Social Media');
    console.log('   - 6 SEO Settings');
    console.log('\n🔐 Admin Login:');
    console.log('   Email: admin@brodo.com');
    console.log('   Password: admin123');
    console.log('\n✨ Ready to start development!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log('👋 Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
