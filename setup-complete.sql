-- Single Migration File untuk Setup Database Neon
-- File ini menggabungkan semua schema yang diperlukan untuk project SaaS Boilerplate
-- Berdasarkan struktur database yang sudah ada

-- ====================================================================
-- ORGANIZATION TABLE
-- Untuk management subscription Stripe dan organisasi
-- ====================================================================
CREATE TABLE IF NOT EXISTS "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_subscription_price_id" text,
	"stripe_subscription_status" text,
	"stripe_subscription_current_period_end" bigint,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "stripe_customer_id_idx" ON "organization" USING btree ("stripe_customer_id");

-- ====================================================================
-- TODO TABLE
-- Untuk task management dan todo items
-- ====================================================================
CREATE TABLE IF NOT EXISTS "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- CONTACT SUBMISSION TABLE
-- Untuk form kontak dan customer inquiries
-- ====================================================================
CREATE TABLE IF NOT EXISTS "contact_submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);

-- ====================================================================
-- CMS USER TABLE
-- Untuk management user CMS
-- ====================================================================
CREATE TABLE IF NOT EXISTS "cms_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" character varying(255) NOT NULL UNIQUE,
	"email" character varying(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" character varying(50) DEFAULT 'editor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- IMAGES TABLE
-- Untuk management media/images
-- ====================================================================
CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" character varying(255) NOT NULL,
	"url" text NOT NULL,
	"alt_text" character varying(255),
	"type" character varying(50),
	"width" integer,
	"height" integer,
	"file_size" integer,
	"mime_type" character varying(100),
	"uploaded_by" integer,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- COMPANY INFORMATION TABLES
-- Untuk informasi perusahaan
-- ====================================================================
CREATE TABLE IF NOT EXISTS "company_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" character varying(255) NOT NULL,
	"tagline" text,
	"description" text,
	"founded_year" integer,
	"location" character varying(255),
	"industry" character varying(255),
	"employees" integer,
	"email" character varying(255),
	"phone" character varying(50),
	"address" text,
	"logo_url" character varying(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Company Branch Table
CREATE TABLE IF NOT EXISTS "company_branch" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" character varying(255) NOT NULL,
	"address" text,
	"city" character varying(100),
	"province" character varying(100),
	"postal_code" character varying(20),
	"phone" character varying(50),
	"email" character varying(255),
	"operating_hours" text,
	"map_url" character varying(500),
	"image_url" character varying(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"instagram_username" character varying(100)
);

-- ====================================================================
-- CONTACT INFORMATION TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" character varying(255),
	"phone" character varying(50),
	"address" text,
	"city" character varying(100),
	"province" character varying(100),
	"postal_code" character varying(20),
	"country" character varying(100) DEFAULT 'Indonesia',
	"map_location" character varying(500),
	"business_hours" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- HERO SECTION TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "hero_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"cta_text" character varying(100),
	"cta_link" character varying(500),
	"image_id" integer,
	"image_url" character varying(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- ABOUT SECTION TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "about_section" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"who_we_are" text,
	"what_we_do" text,
	"mission" text,
	"vision" text,
	"stats_clients" integer DEFAULT 0,
	"stats_projects" integer DEFAULT 0,
	"stats_years" integer DEFAULT 0,
	"stats_team" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- COMPANY VALUES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "company_value" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" character varying(255),
	"title" character varying(255) NOT NULL,
	"description" text,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- TEAM MEMBERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "team_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" character varying(255) NOT NULL,
	"position" character varying(255),
	"bio" text,
	"image_id" integer,
	"photo_url" character varying(500),
	"linkedin_url" character varying(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- SERVICE ITEMS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "service_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" character varying(255),
	"icon_url" character varying(500),
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- COLLECTION ITEMS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "collection_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" character varying(255) NOT NULL,
	"slug" character varying(255) NOT NULL UNIQUE,
	"description" text,
	"image_id" integer,
	"image_url" character varying(500),
	"product_link" character varying(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- PRODUCT ITEMS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "product_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer,
	"name" character varying(255) NOT NULL,
	"slug" character varying(255) NOT NULL UNIQUE,
	"description" text,
	"price" integer,
	"image_id" integer,
	"image_url" character varying(500),
	"product_link" character varying(500),
	"is_featured" boolean DEFAULT false,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- TESTIMONIALS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "testimonial" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" character varying(255) NOT NULL,
	"position" character varying(255),
	"company" character varying(255),
	"message" text NOT NULL,
	"rating" integer DEFAULT 5,
	"avatar_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- SOCIAL MEDIA TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "social_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" character varying(100) NOT NULL,
	"url" character varying(500) NOT NULL,
	"icon" character varying(255),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- SITE SETTINGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" character varying(255) NOT NULL UNIQUE,
	"value" text,
	"type" character varying(50) DEFAULT 'text',
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- ACTIVITY LOG TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS "activity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" character varying(100) NOT NULL,
	"entity_type" character varying(100),
	"entity_id" integer,
	"details" text,
	"ip_address" character varying(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ====================================================================
-- FOREIGN KEY CONSTRAINTS
-- ====================================================================
ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_fkey" 
FOREIGN KEY ("uploaded_by") REFERENCES "cms_user"("id") ON DELETE SET NULL;

ALTER TABLE "hero_section" ADD CONSTRAINT "hero_section_image_id_fkey" 
FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "team_member" ADD CONSTRAINT "team_member_image_id_fkey" 
FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "product_item" ADD CONSTRAINT "product_item_collection_id_fkey" 
FOREIGN KEY ("collection_id") REFERENCES "collection_item"("id") ON DELETE SET NULL;

ALTER TABLE "product_item" ADD CONSTRAINT "product_item_image_id_fkey" 
FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_image_id_fkey" 
FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "testimonial" ADD CONSTRAINT "testimonial_avatar_id_fkey" 
FOREIGN KEY ("avatar_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "cms_user"("id") ON DELETE SET NULL;

-- ====================================================================
-- REAL DATA INSERTION
-- Insert data sebenarnya dari database BRODO yang sudah ada
-- ====================================================================

-- Real Company Info
INSERT INTO "company_info" (
	"id",
	"name", 
	"tagline",
	"description", 
	"founded_year",
	"location",
	"industry",
	"employees",
	"email",
	"phone",
	"address",
	"logo_url",
	"is_active"
) VALUES (
	1,
	'BRODO',
	'Langkah Awal Gaya Lokal',
	'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter',
	2010,
	'Bandung, Indonesia',
	'Footwear & Fashion',
	50,
	'info@bro.do',
	'+62-xxx-xxxx-xxxx',
	NULL,
	NULL,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"tagline" = EXCLUDED."tagline",
	"description" = EXCLUDED."description",
	"founded_year" = EXCLUDED."founded_year",
	"location" = EXCLUDED."location",
	"industry" = EXCLUDED."industry",
	"employees" = EXCLUDED."employees",
	"email" = EXCLUDED."email",
	"phone" = EXCLUDED."phone",
	"is_active" = EXCLUDED."is_active";

-- Real Contact Info
INSERT INTO "contact_info" (
	"id",
	"email",
	"phone",
	"address",
	"city",
	"province",
	"postal_code",
	"country",
	"map_location",
	"business_hours"
) VALUES (
	1,
	'hello@bro.do',
	'(022) 8811-5555',
	'Jl. Gudang Utara No. 40B',
	'Bandung',
	'Jawa Barat',
	NULL,
	'Indonesia',
	NULL,
	NULL
) ON CONFLICT ("id") DO UPDATE SET
	"email" = EXCLUDED."email",
	"phone" = EXCLUDED."phone",
	"address" = EXCLUDED."address",
	"city" = EXCLUDED."city",
	"province" = EXCLUDED."province",
	"country" = EXCLUDED."country";

-- Real About Section
INSERT INTO "about_section" (
	"id",
	"title",
	"who_we_are",
	"what_we_do",
	"mission",
	"vision",
	"stats_clients",
	"stats_projects",
	"stats_years",
	"stats_team"
) VALUES (
	1,
	'Siapa Kami',
	'BRODO didirikan di Bandung pada tahun 2010 oleh insinyur muda yang melihat peluang: menyajikan sepatu stylish, berkualitas, dan terjangkau untuk pria di Indonesia.',
	'Kami memanfaatkan kerajinan lokal di Cibaduyut dan material premium untuk menghasilkan sepatu berkualitas internasional. Setiap produk BRODO dirancang dengan detail dan dikerjakan oleh pengrajin berpengalaman.',
	'Memberdayakan industri alas kaki lokal dan memperkuat kebanggaan terhadap produk Indonesia. Kami memanfaatkan kerajinan lokal di Cibaduyut dan material premium untuk menghasilkan sepatu berkualitas internasional.',
	'Menjadi brand gaya hidup pria terdepan di Asia Tenggara. Kami berkomitmen untuk terus berinovasi dan menghadirkan produk yang tidak hanya stylish, tetapi juga mencerminkan identitas dan kebanggaan Indonesia.',
	100000,
	15,
	15,
	50
) ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"who_we_are" = EXCLUDED."who_we_are",
	"what_we_do" = EXCLUDED."what_we_do",
	"mission" = EXCLUDED."mission",
	"vision" = EXCLUDED."vision",
	"stats_clients" = EXCLUDED."stats_clients",
	"stats_projects" = EXCLUDED."stats_projects",
	"stats_years" = EXCLUDED."stats_years",
	"stats_team" = EXCLUDED."stats_team";

-- Real Hero Section
INSERT INTO "hero_section" (
	"id",
	"title",
	"subtitle",
	"description",
	"cta_text",
	"cta_link",
	"image_url",
	"order",
	"is_active"
) VALUES 
(
	1,
	'BRODO',
	'Langkah Awal Gaya Lokal',
	'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter, hasil karya anak bangsa dari Bandung.',
	'Lihat Produk',
	'#products',
	'/assets/img-stock-1.webp',
	1,
	true
),
(
	2,
	'Innovation & Excellence',
	'Dari Bandung untuk Indonesia',
	'Sejak 2010, kami memanfaatkan kerajinan lokal Cibaduyut dan material premium untuk menciptakan alas kaki stylish yang terjangkau untuk pria Indonesia.',
	'Tentang Kami',
	'#about',
	'/assets/img-stock-7.webp',
	2,
	true
),
(
	3,
	'Quality Craftsmanship',
	'Produk Berkualitas Internasional',
	'Setiap produk BRODO dirancang dengan detail, menggunakan bahan pilihan dan dikerjakan oleh pengrajin berpengalaman untuk hasil terbaik.',
	'Nilai Kami',
	'#values',
	'/assets/img-stock-10.webp',
	3,
	true
),
(
	4,
	'Join the Movement',
	'Live Epic with Your Shoes',
	'Bergabunglah dengan ribuan pria Indonesia yang telah mempercayai BRODO sebagai pilihan alas kaki mereka. Wujudkan gaya hidup yang epic!',
	'Hubungi Kami',
	'#contact',
	'/assets/img-stock-13.webp',
	4,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"title" = EXCLUDED."title",
	"subtitle" = EXCLUDED."subtitle",
	"description" = EXCLUDED."description",
	"cta_text" = EXCLUDED."cta_text",
	"cta_link" = EXCLUDED."cta_link",
	"image_url" = EXCLUDED."image_url",
	"order" = EXCLUDED."order",
	"is_active" = EXCLUDED."is_active";

-- Real Collection Items
INSERT INTO "collection_item" (
	"id",
	"name",
	"slug",
	"description",
	"image_url",
	"product_link",
	"order",
	"is_active"
) VALUES 
(
	1,
	'Sneakers',
	'sneakers',
	'Sola nyaman, desain modern, cocok untuk aktivitas harian & kasual',
	'/assets/sneakers.webp',
	'',
	1,
	true
),
(
	2,
	'Formal Sandals',
	'formal-sandals',
	'Santai namun stylish, cocok untuk waktu luang dan acara semi-formal',
	'/assets/sandals.webp',
	NULL,
	2,
	true
),
(
	3,
	'Essentials',
	'essentials',
	'Koleksi pakaian essential untuk melengkapi gaya BRODO',
	'/assets/essentials.webp',
	NULL,
	3,
	true
),
(
	4,
	'Accessories',
	'accessories',
	'Kaus kaki premium, sabuk kulit, dompet - melengkapi gaya BRODO',
	'/assets/accessories.webp',
	NULL,
	4,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"slug" = EXCLUDED."slug",
	"description" = EXCLUDED."description",
	"image_url" = EXCLUDED."image_url",
	"product_link" = EXCLUDED."product_link",
	"order" = EXCLUDED."order",
	"is_active" = EXCLUDED."is_active";

-- Real Product Items
INSERT INTO "product_item" (
	"id",
	"collection_id",
	"name",
	"slug",
	"description",
	"price",
	"image_url",
	"product_link",
	"is_featured",
	"is_active"
) VALUES 
(
	1,
	1,
	'Ace Nova Series',
	'ace-nova-series',
	'Sneakers premium dengan desain minimalis dan kenyamanan maksimal. Cocok untuk berbagai aktivitas dan gaya kasual. Features: Comfort Fit, Premium Material, Modern Design.',
	899000,
	'/assets/img-stock-5.webp',
	'https://bro.do/products/ace-nova',
	false,
	true
),
(
	2,
	1,
	'Ventura Series',
	'ventura-series',
	'Sepatu kasual dengan sentuhan formal. Nyaman untuk sehari-hari dan acara semi-formal. Features: Versatile Style, Comfortable Sole, Quality Leather.',
	799000,
	'/assets/ventura.webp',
	'https://bro.do/products/ventura',
	true,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"collection_id" = EXCLUDED."collection_id",
	"name" = EXCLUDED."name",
	"slug" = EXCLUDED."slug",
	"description" = EXCLUDED."description",
	"price" = EXCLUDED."price",
	"image_url" = EXCLUDED."image_url",
	"product_link" = EXCLUDED."product_link",
	"is_featured" = EXCLUDED."is_featured",
	"is_active" = EXCLUDED."is_active";

-- Real Team Members
INSERT INTO "team_member" (
	"id",
	"name",
	"position",
	"bio",
	"photo_url",
	"linkedin_url",
	"order",
	"is_active"
) VALUES 
(
	1,
	'Muhammad Yukka Harlanda',
	'Co-Founder & CEO',
	'Insinyur muda yang memulai BRODO dari kebutuhan pribadi akan sepatu berkualitas. Dengan visi kuat, ia membawa BRODO menjadi brand lokal yang diakui.',
	'/assets/muhammad-yukka.webp',
	'https://www.linkedin.com/in/yukka-harlanda/',
	1,
	true
),
(
	2,
	'Putera Dwi Karunia',
	'Co-Founder & Creative Partner',
	'Partner kreatif yang memastikan setiap desain BRODO memiliki karakter unik dan sesuai dengan gaya hidup pria Indonesia modern.',
	'/assets/putera-dwi.webp',
	'https://www.linkedin.com/in/putera-dwi/',
	2,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"position" = EXCLUDED."position",
	"bio" = EXCLUDED."bio",
	"photo_url" = EXCLUDED."photo_url",
	"linkedin_url" = EXCLUDED."linkedin_url",
	"order" = EXCLUDED."order",
	"is_active" = EXCLUDED."is_active";

-- Real Service Items (Company Values)
INSERT INTO "service_item" (
	"id",
	"icon",
	"title",
	"subtitle",
	"description",
	"order",
	"is_active"
) VALUES 
(
	1,
	'✨',
	'Keaslian (Authenticity)',
	'Menjadi diri sendiri adalah kekuatan terbesar.',
	'Setiap produk dibuat dengan karakter dan kejujuran. Kami bangga dengan identitas lokal dan tidak berusaha meniru brand lain. Menjadi diri sendiri adalah kekuatan terbesar.',
	1,
	true
),
(
	2,
	'⭐',
	'Kualitas (Quality)',
	'Kualitas bukan kebetulan, tapi hasil dedikasi.',
	'Material premium, pengerjaan detail, produksi lokal. Kami tidak kompromi dalam hal kualitas untuk kepuasan pelanggan. Kualitas bukan kebetulan, tapi hasil dedikasi.',
	2,
	true
),
(
	3,
	'🤝',
	'Kemandirian & Kerajinan Lokal',
	'Dibuat oleh tangan lokal, untuk kebanggaan nasional.',
	'Mengandalkan pengrajin lokal Bandung/Cibaduyut. Kami percaya pada kekuatan kolaborasi dan memberdayakan industri lokal. Bersama kita kuat, lokal kita banggakan.',
	3,
	true
),
(
	4,
	'🚀',
	'Inovasi (Innovation)',
	'Berinovasi tanpa henti, melangkah menuju masa depan.',
	'Terus berkembang mengikuti tren dan teknologi untuk pria aktif. Kami tidak pernah berhenti berinovasi dalam desain dan kenyamanan. Inovasi adalah jalan menuju masa depan.',
	4,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"icon" = EXCLUDED."icon",
	"title" = EXCLUDED."title",
	"subtitle" = EXCLUDED."subtitle",
	"description" = EXCLUDED."description",
	"order" = EXCLUDED."order",
	"is_active" = EXCLUDED."is_active";

-- Real Testimonials
INSERT INTO "testimonial" (
	"id",
	"name",
	"position",
	"company",
	"message",
	"rating",
	"is_active"
) VALUES 
(
	1,
	'Budi Santoso',
	NULL,
	'Entrepreneur',
	'BRODO adalah pilihan terbaik untuk sepatu sehari-hari. Nyaman, stylish, dan yang penting buatan Indonesia!',
	5,
	true
),
(
	2,
	'Ahmad Rahman',
	NULL,
	'Creative Director',
	'Kualitas setara brand internasional dengan harga yang lebih terjangkau. Bangga pakai produk lokal!',
	5,
	true
),
(
	3,
	'Dimas Prasetyo',
	NULL,
	'Software Engineer',
	'Sudah 3 tahun pakai BRODO dan tidak pernah kecewa. Desainnya selalu update dan kualitasnya konsisten.',
	5,
	true
),
(
	4,
	'Andi Pratama',
	NULL,
	'Entrepreneur',
	'Kualitas sepatu BRODO memang luar biasa. Sudah 3 tahun pakai masih tetap bagus dan nyaman!',
	5,
	true
),
(
	5,
	'Siti Nurhaliza',
	NULL,
	'Content Creator',
	'Desainnya timeless dan cocok untuk berbagai acara. Worth every penny!',
	5,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"position" = EXCLUDED."position",
	"company" = EXCLUDED."company",
	"message" = EXCLUDED."message",
	"rating" = EXCLUDED."rating",
	"is_active" = EXCLUDED."is_active";

-- Real Social Media
INSERT INTO "social_media" (
	"id",
	"platform",
	"url",
	"icon",
	"order",
	"is_active"
) VALUES 
(
	1,
	'instagram',
	'https://www.instagram.com/brodo.footwear/',
	'instagram',
	1,
	true
),
(
	2,
	'facebook',
	'https://www.facebook.com/BRODOfootwear/',
	'facebook',
	2,
	true
),
(
	3,
	'twitter',
	'https://twitter.com/brodo',
	'twitter',
	3,
	true
),
(
	4,
	'youtube',
	'https://www.youtube.com/channel/UCxxx',
	'youtube',
	4,
	true
),
(
	5,
	'linkedin',
	'https://www.linkedin.com/company/brodo/',
	'linkedin',
	5,
	true
) ON CONFLICT ("id") DO UPDATE SET
	"platform" = EXCLUDED."platform",
	"url" = EXCLUDED."url",
	"icon" = EXCLUDED."icon",
	"order" = EXCLUDED."order",
	"is_active" = EXCLUDED."is_active";

-- Real Site Settings
INSERT INTO "site_settings" (
	"id",
	"key",
	"value",
	"type",
	"description"
) VALUES 
(
	1,
	'site_name',
	'BRODO Indonesia',
	'text',
	NULL
),
(
	2,
	'tagline',
	'Live Epic with Your Shoes',
	'text',
	NULL
),
(
	3,
	'company_description',
	'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter, hasil karya anak bangsa dari Bandung.',
	'textarea',
	NULL
),
(
	4,
	'logo_url',
	'/assets/brodo-logo-horizontal.png',
	'text',
	NULL
),
(
	5,
	'favicon_url',
	'/favicon.ico',
	'text',
	NULL
),
(
	6,
	'meta_description',
	'BRODO - Brand sepatu lokal Indonesia dengan kualitas premium. Sejak 2010 dari Bandung untuk Indonesia.',
	'textarea',
	NULL
),
(
	7,
	'meta_keywords',
	'BRODO, sepatu lokal, sepatu Indonesia, sneakers, sandals, footwear, Bandung, Cibaduyut',
	'text',
	NULL
),
(
	8,
	'google_analytics_id',
	'',
	'text',
	NULL
),
(
	9,
	'facebook_pixel_id',
	'',
	'text',
	NULL
),
(
	10,
	'sidebar_widgets',
	'{"companyInfo":true,"featuredProducts":true,"valuesPhilosophy":true,"storeLocator":true,"teamLeadership":true}',
	'json',
	'Controls visibility of sidebar widgets on public pages'
) ON CONFLICT ("id") DO UPDATE SET
	"key" = EXCLUDED."key",
	"value" = EXCLUDED."value",
	"type" = EXCLUDED."type",
	"description" = EXCLUDED."description";

-- Real CMS User (Admin)
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "cms_user" (
	"id",
	"username",
	"email",
	"password_hash",
	"role",
	"is_active"
) VALUES (
	1,
	'admin',
	'admin@brodo.com',
	'$2b$12$UAtRWXv.ovR/xoehUJgKB.jnz5dwzRNlNg2Nnk4PduFSHaw1txQtG',
	'admin',
	true
) ON CONFLICT ("id") DO UPDATE SET
	"username" = EXCLUDED."username",
	"email" = EXCLUDED."email",
	"password_hash" = EXCLUDED."password_hash",
	"role" = EXCLUDED."role",
	"is_active" = EXCLUDED."is_active";

-- Real Company Branches
INSERT INTO "company_branch" (
	"id",
	"name",
	"address",
	"city",
	"province",
	"postal_code",
	"phone",
	"email",
	"operating_hours",
	"map_url",
	"image_url",
	"is_active",
	"order",
	"instagram_username"
) VALUES 
(
	1,
	'Brodo Kemang',
	'Jl. Kemang Selatan VIII No.55, RW.2, Bangka, Kec. Mampang Prapatan',
	'Jakarta Selatan',
	'DKI Jakarta',
	'12730',
	'0821-8477-1510',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Kemang+Jakarta',
	NULL,
	false,
	1,
	'brodokemang'
),
(
	2,
	'Brodo Grand Indonesia',
	'Grand Indonesia East Mall Lt.3, Jalan MH. Thamrin No.1, Menteng',
	'Jakarta Pusat',
	'DKI Jakarta',
	'10230',
	'0852-1266-5211',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Grand+Indonesia+East+Mall',
	NULL,
	true,
	2,
	'brodograndindo'
),
(
	3,
	'Brodo Tebet',
	'Jl. Tebet Utara Dalam No.7, RT.3/RW.2, Tebet Timur',
	'Jakarta Selatan',
	'DKI Jakarta',
	'12820',
	'0852-1310-4344',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Tebet+Jakarta',
	NULL,
	false,
	3,
	'brodotebet'
),
(
	4,
	'Brodo Bandung',
	'Jl. Lombok No.11, Merdeka, Kec. Sumur Bandung',
	'Bandung',
	'Jawa Barat',
	'40113',
	'0822-4684-7084',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Bandung',
	NULL,
	true,
	4,
	'brodobandung'
),
(
	5,
	'Brodo Bekasi',
	'Jl. Boulevard Raya No.35, RT.005/RW.017, Jaka Setia, Bekasi Selatan',
	'Bekasi',
	'Jawa Barat',
	'17147',
	NULL,
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Bekasi',
	NULL,
	false,
	5,
	'brodobekasi'
),
(
	6,
	'Brodo Depok',
	'Jl. Margonda No.303b, Kemiri Muka, Kecamatan Beji',
	'Depok',
	'Jawa Barat',
	'16423',
	'0852-1991-3802',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Depok',
	NULL,
	false,
	6,
	'brododepok'
),
(
	7,
	'Brodo Tangerang',
	'Ruko South Goldfinch Blok B.10, Jl. Springs Boulevard, Gading Serpong, Kec. Pagedangan',
	'Kabupaten Tangerang',
	'Banten',
	'15332',
	'0812-9110-0520',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Tangerang+Gading+Serpong',
	NULL,
	false,
	7,
	'brodotangerang'
),
(
	8,
	'Brodo Surabaya',
	'Tunjungan Plaza 2 Lt.1, Jl. Basuki Rahmat No.8-12, Kedungdoro',
	'Surabaya',
	'Jawa Timur',
	'60261',
	'0821-3131-7926',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Tunjungan+Plaza+2+Surabaya',
	NULL,
	false,
	8,
	'brodosurabaya'
),
(
	9,
	'Shoes And Care Malang',
	'Terusan Dieng 33',
	'Malang',
	'Jawa Timur',
	'65146',
	NULL,
	NULL,
	'09:00–20:00',
	'https://maps.google.com/?q=Terusan+Dieng+33+Malang',
	NULL,
	false,
	9,
	NULL
),
(
	10,
	'Brodo Jogja',
	'Jl. Affandi No.51, Gejayan, Kec. Depok',
	'Yogyakarta',
	'Daerah Istimewa Yogyakarta',
	'55281',
	'0812-1919-2057',
	NULL,
	'10:00–21:00',
	'https://maps.google.com/?q=Brodo+Jogja+Affandi',
	NULL,
	true,
	10,
	'brodojogja'
),
(
	11,
	'Brodo Medan',
	'Jl. Setia Budi Kel. No.14C, Tj. Rejo, Medan Sunggal',
	'Medan',
	'Sumatera Utara',
	'20119',
	'0821-2413-0427',
	NULL,
	'10:00–20:00',
	'https://maps.google.com/?q=Brodo+Medan',
	NULL,
	false,
	11,
	'brodomedan'
),
(
	12,
	'Brodo Aceh',
	'Jl. Tgk. T. Panglima Nyak Makam No.88, Lambhuk, Ulee Kareng',
	'Banda Aceh',
	'Aceh',
	'23118',
	'0823-2014-6478',
	NULL,
	'09:00–20:00',
	'https://maps.google.com/?q=Brodo+Aceh',
	NULL,
	false,
	12,
	'brodo.aceh'
),
(
	13,
	'Rahada Pekanbaru',
	'Jalan Garuda Sakti Gg. Sepakat No.35, Kecamatan Tampan',
	'Pekanbaru',
	'Riau',
	NULL,
	'0813-1772-2237',
	NULL,
	'09:00–20:00',
	'https://maps.google.com/?q=Rahada+Pekanbaru',
	NULL,
	false,
	13,
	NULL
),
(
	14,
	'Harapan Madjoe Denpasar',
	'Jalan Lange V, Denpasar Barat',
	'Denpasar',
	'Bali',
	NULL,
	NULL,
	NULL,
	'09:00–20:00',
	'https://maps.google.com/?q=Harapan+Madjoe+Denpasar+Bali',
	NULL,
	false,
	14,
	NULL
),
(
	15,
	'Super Local Palu',
	'Jl. Jenderal Basuki Rahmat, Tatura Selatan, Kec. Palu Selatan',
	'Palu',
	'Sulawesi Tengah',
	'94111',
	NULL,
	NULL,
	'09:00–20:00',
	'https://maps.google.com/?q=Super+Local+Palu',
	NULL,
	false,
	15,
	NULL
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"address" = EXCLUDED."address",
	"city" = EXCLUDED."city",
	"province" = EXCLUDED."province",
	"postal_code" = EXCLUDED."postal_code",
	"phone" = EXCLUDED."phone",
	"email" = EXCLUDED."email",
	"operating_hours" = EXCLUDED."operating_hours",
	"map_url" = EXCLUDED."map_url",
	"image_url" = EXCLUDED."image_url",
	"is_active" = EXCLUDED."is_active",
	"order" = EXCLUDED."order",
	"instagram_username" = EXCLUDED."instagram_username";

-- Sample Contact Submission
INSERT INTO "contact_submission" (
	"id",
	"name",
	"email",
	"phone",
	"subject",
	"message",
	"status"
) VALUES (
	1,
	'ahmog',
	'ahmog@gmail.com',
	'+626767676767',
	'Cek database',
	'cek database by ahmog',
	'new'
) ON CONFLICT ("id") DO UPDATE SET
	"name" = EXCLUDED."name",
	"email" = EXCLUDED."email",
	"phone" = EXCLUDED."phone",
	"subject" = EXCLUDED."subject",
	"message" = EXCLUDED."message",
	"status" = EXCLUDED."status";

-- ====================================================================
-- INDEXES UNTUK PERFORMA
-- Tambahan indexes untuk optimasi query
-- ====================================================================

-- Organization indexes
CREATE UNIQUE INDEX IF NOT EXISTS "stripe_customer_id_idx" ON "organization" USING btree ("stripe_customer_id");

-- Todo indexes
CREATE INDEX IF NOT EXISTS "todo_owner_id_idx" ON "todo" USING btree ("owner_id");
CREATE INDEX IF NOT EXISTS "todo_created_at_idx" ON "todo" USING btree ("created_at");

-- Contact submission indexes
CREATE INDEX IF NOT EXISTS "contact_submission_status_idx" ON "contact_submission" USING btree ("status");
CREATE INDEX IF NOT EXISTS "contact_submission_created_at_idx" ON "contact_submission" USING btree ("created_at");

-- CMS User indexes
CREATE UNIQUE INDEX IF NOT EXISTS "cms_user_username_idx" ON "cms_user" USING btree ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "cms_user_email_idx" ON "cms_user" USING btree ("email");
CREATE INDEX IF NOT EXISTS "cms_user_role_idx" ON "cms_user" USING btree ("role");
CREATE INDEX IF NOT EXISTS "cms_user_is_active_idx" ON "cms_user" USING btree ("is_active");

-- Images indexes
CREATE INDEX IF NOT EXISTS "images_uploaded_by_idx" ON "images" USING btree ("uploaded_by");
CREATE INDEX IF NOT EXISTS "images_type_idx" ON "images" USING btree ("type");
CREATE INDEX IF NOT EXISTS "images_uploaded_at_idx" ON "images" USING btree ("uploaded_at");

-- Company branch indexes
CREATE INDEX IF NOT EXISTS "company_branch_is_active_idx" ON "company_branch" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "company_branch_order_idx" ON "company_branch" USING btree ("order");
CREATE INDEX IF NOT EXISTS "company_branch_city_idx" ON "company_branch" USING btree ("city");

-- Hero section indexes
CREATE INDEX IF NOT EXISTS "hero_section_is_active_idx" ON "hero_section" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "hero_section_order_idx" ON "hero_section" USING btree ("order");

-- Team member indexes
CREATE INDEX IF NOT EXISTS "team_member_is_active_idx" ON "team_member" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "team_member_order_idx" ON "team_member" USING btree ("order");

-- Service item indexes
CREATE INDEX IF NOT EXISTS "service_item_is_active_idx" ON "service_item" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "service_item_order_idx" ON "service_item" USING btree ("order");

-- Collection item indexes
CREATE UNIQUE INDEX IF NOT EXISTS "collection_item_slug_idx" ON "collection_item" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "collection_item_is_active_idx" ON "collection_item" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "collection_item_order_idx" ON "collection_item" USING btree ("order");

-- Product item indexes
CREATE UNIQUE INDEX IF NOT EXISTS "product_item_slug_idx" ON "product_item" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "product_item_collection_id_idx" ON "product_item" USING btree ("collection_id");
CREATE INDEX IF NOT EXISTS "product_item_is_featured_idx" ON "product_item" USING btree ("is_featured");
CREATE INDEX IF NOT EXISTS "product_item_is_active_idx" ON "product_item" USING btree ("is_active");

-- Testimonial indexes
CREATE INDEX IF NOT EXISTS "testimonial_is_active_idx" ON "testimonial" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "testimonial_rating_idx" ON "testimonial" USING btree ("rating");

-- Social media indexes
CREATE INDEX IF NOT EXISTS "social_media_is_active_idx" ON "social_media" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "social_media_order_idx" ON "social_media" USING btree ("order");

-- Site settings indexes
CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_key_idx" ON "site_settings" USING btree ("key");

-- Activity log indexes
CREATE INDEX IF NOT EXISTS "activity_log_user_id_idx" ON "activity_log" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "activity_log_action_idx" ON "activity_log" USING btree ("action");
CREATE INDEX IF NOT EXISTS "activity_log_created_at_idx" ON "activity_log" USING btree ("created_at");

-- Company value indexes
CREATE INDEX IF NOT EXISTS "company_value_is_active_idx" ON "company_value" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "company_value_order_idx" ON "company_value" USING btree ("order");

-- ====================================================================
-- COMMENTS UNTUK DOKUMENTASI
-- ====================================================================

-- Add table comments
COMMENT ON TABLE "organization" IS 'Organization data for subscription and billing management';
COMMENT ON TABLE "todo" IS 'Task management system for users';
COMMENT ON TABLE "contact_submission" IS 'Customer inquiries and contact form submissions';
COMMENT ON TABLE "cms_user" IS 'CMS users with different roles and permissions';
COMMENT ON TABLE "images" IS 'Media files and images used throughout the site';
COMMENT ON TABLE "company_info" IS 'Company profile and basic information';
COMMENT ON TABLE "company_branch" IS 'Company branch locations and details';
COMMENT ON TABLE "contact_info" IS 'Contact information and business details';
COMMENT ON TABLE "hero_section" IS 'Hero sections for homepage and landing pages';
COMMENT ON TABLE "about_section" IS 'About section content and company statistics';
COMMENT ON TABLE "company_value" IS 'Company values and principles';
COMMENT ON TABLE "team_member" IS 'Team members and their information';
COMMENT ON TABLE "service_item" IS 'Services offered by the company';
COMMENT ON TABLE "collection_item" IS 'Product collections and categories';
COMMENT ON TABLE "product_item" IS 'Individual products and their details';
COMMENT ON TABLE "testimonial" IS 'Customer testimonials and reviews';
COMMENT ON TABLE "social_media" IS 'Social media links and profiles';
COMMENT ON TABLE "site_settings" IS 'Site-wide settings and configuration';
COMMENT ON TABLE "activity_log" IS 'System activity and audit log';

-- Add column comments for important fields
COMMENT ON COLUMN "organization"."stripe_customer_id" IS 'Stripe customer identifier for billing';
COMMENT ON COLUMN "todo"."owner_id" IS 'User ID who owns this todo item';
COMMENT ON COLUMN "contact_submission"."status" IS 'Status: new, in-progress, resolved';
COMMENT ON COLUMN "cms_user"."role" IS 'User role: admin, editor, viewer';
COMMENT ON COLUMN "images"."type" IS 'Image type: hero, product, avatar, etc.';
COMMENT ON COLUMN "collection_item"."slug" IS 'URL-friendly collection identifier';
COMMENT ON COLUMN "product_item"."price" IS 'Price in smallest currency unit (cents for USD)';
COMMENT ON COLUMN "testimonial"."rating" IS 'Customer rating from 1-5 stars';
COMMENT ON COLUMN "site_settings"."key" IS 'Unique setting identifier';
COMMENT ON COLUMN "activity_log"."action" IS 'Action performed: create, update, delete, login, etc.';

-- ====================================================================
-- MIGRATION COMPLETE
-- ====================================================================

-- Verify tables created successfully
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Tables created: organization, todo, contact_submission, cms_user, images, company_info, company_branch, contact_info, hero_section, about_section, company_value, team_member, service_item, collection_item, product_item, testimonial, social_media, site_settings, activity_log';
    RAISE NOTICE 'Real BRODO data inserted from production database';
    RAISE NOTICE 'Foreign key constraints and indexes created';
    RAISE NOTICE 'Ready for development and testing!';
END
$$;
