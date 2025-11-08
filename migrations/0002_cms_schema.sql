-- CMS Schema Migration for BRODO Company Profile
-- Generated: November 3, 2025

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS "cms_user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(100) NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" VARCHAR(20) DEFAULT 'editor',
    "is_active" BOOLEAN DEFAULT true,
    "last_login" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 2. Hero Section Table
CREATE TABLE IF NOT EXISTS "hero_section" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "cta_text" VARCHAR(100),
    "cta_link" VARCHAR(200),
    "image_id" INTEGER,
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 3. About Section Table
CREATE TABLE IF NOT EXISTS "about_section" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "who_we_are" TEXT,
    "what_we_do" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "stats_clients" INTEGER DEFAULT 0,
    "stats_projects" INTEGER DEFAULT 0,
    "stats_years" INTEGER DEFAULT 0,
    "stats_team" INTEGER DEFAULT 0,
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 4. Team Members Table
CREATE TABLE IF NOT EXISTS "team_member" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "image_id" INTEGER,
    "linkedin_url" VARCHAR(200),
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 5. Service Items Table
CREATE TABLE IF NOT EXISTS "service_item" (
    "id" SERIAL PRIMARY KEY,
    "icon" VARCHAR(50),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 6. Company Values Table
CREATE TABLE IF NOT EXISTS "company_value" (
    "id" SERIAL PRIMARY KEY,
    "icon" VARCHAR(50),
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS "testimonial" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100),
    "company" VARCHAR(100),
    "message" TEXT NOT NULL,
    "rating" INTEGER DEFAULT 5,
    "avatar_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 8. Collection Items Table
CREATE TABLE IF NOT EXISTS "collection_item" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "image_id" INTEGER,
    "product_link" VARCHAR(300),
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 9. Product Items Table
CREATE TABLE IF NOT EXISTS "product_item" (
    "id" SERIAL PRIMARY KEY,
    "collection_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "price" INTEGER,
    "image_id" INTEGER,
    "product_link" VARCHAR(300),
    "is_featured" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 10. Images / Media Library Table
CREATE TABLE IF NOT EXISTS "images" (
    "id" SERIAL PRIMARY KEY,
    "file_name" VARCHAR(150) NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" VARCHAR(200),
    "type" VARCHAR(50),
    "width" INTEGER,
    "height" INTEGER,
    "file_size" INTEGER,
    "mime_type" VARCHAR(50),
    "uploaded_by" INTEGER,
    "uploaded_at" TIMESTAMP DEFAULT NOW()
);

-- 11. Contact Info Table
CREATE TABLE IF NOT EXISTS "contact_info" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(100),
    "phone" VARCHAR(30),
    "address" TEXT,
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100) DEFAULT 'Indonesia',
    "map_location" VARCHAR(300),
    "business_hours" TEXT,
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 12. Social Media Table
CREATE TABLE IF NOT EXISTS "social_media" (
    "id" SERIAL PRIMARY KEY,
    "platform" VARCHAR(50) NOT NULL,
    "url" VARCHAR(200) NOT NULL,
    "icon" VARCHAR(50),
    "order" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 13. Site Settings Table
CREATE TABLE IF NOT EXISTS "site_settings" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(100) NOT NULL UNIQUE,
    "value" TEXT,
    "type" VARCHAR(50) DEFAULT 'string',
    "description" TEXT,
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- 14. Activity Log Table
CREATE TABLE IF NOT EXISTS "activity_log" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER,
    "action" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" INTEGER,
    "details" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- Add Foreign Key Constraints
ALTER TABLE "hero_section" ADD CONSTRAINT "hero_section_image_id_fkey" 
    FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "team_member" ADD CONSTRAINT "team_member_image_id_fkey" 
    FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "testimonial" ADD CONSTRAINT "testimonial_avatar_id_fkey" 
    FOREIGN KEY ("avatar_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_image_id_fkey" 
    FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "product_item" ADD CONSTRAINT "product_item_collection_id_fkey" 
    FOREIGN KEY ("collection_id") REFERENCES "collection_item"("id") ON DELETE CASCADE;

ALTER TABLE "product_item" ADD CONSTRAINT "product_item_image_id_fkey" 
    FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL;

ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_fkey" 
    FOREIGN KEY ("uploaded_by") REFERENCES "cms_user"("id") ON DELETE SET NULL;

ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "cms_user"("id") ON DELETE CASCADE;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS "idx_cms_user_email" ON "cms_user"("email");
CREATE INDEX IF NOT EXISTS "idx_cms_user_username" ON "cms_user"("username");
CREATE INDEX IF NOT EXISTS "idx_hero_section_order" ON "hero_section"("order");
CREATE INDEX IF NOT EXISTS "idx_hero_section_active" ON "hero_section"("is_active");
CREATE INDEX IF NOT EXISTS "idx_team_member_order" ON "team_member"("order");
CREATE INDEX IF NOT EXISTS "idx_service_item_order" ON "service_item"("order");
CREATE INDEX IF NOT EXISTS "idx_company_value_order" ON "company_value"("order");
CREATE INDEX IF NOT EXISTS "idx_testimonial_rating" ON "testimonial"("rating");
CREATE INDEX IF NOT EXISTS "idx_collection_item_slug" ON "collection_item"("slug");
CREATE INDEX IF NOT EXISTS "idx_product_item_slug" ON "product_item"("slug");
CREATE INDEX IF NOT EXISTS "idx_product_item_featured" ON "product_item"("is_featured");
CREATE INDEX IF NOT EXISTS "idx_images_type" ON "images"("type");
CREATE INDEX IF NOT EXISTS "idx_social_media_platform" ON "social_media"("platform");
CREATE INDEX IF NOT EXISTS "idx_site_settings_key" ON "site_settings"("key");
CREATE INDEX IF NOT EXISTS "idx_activity_log_user_id" ON "activity_log"("user_id");
CREATE INDEX IF NOT EXISTS "idx_activity_log_entity" ON "activity_log"("entity_type", "entity_id");

-- Insert Default Admin User
-- Password: Admin123! (Change this in production!)
INSERT INTO "cms_user" ("username", "email", "password_hash", "role", "is_active")
VALUES (
    'admin',
    'admin@brodo.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.z8fQOi',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert Default Contact Info
INSERT INTO "contact_info" ("email", "phone", "address", "city", "province", "country")
VALUES (
    'hello@bro.do',
    '(022) 8811-5555',
    'Jl. Gudang Utara No. 40B',
    'Bandung',
    'Jawa Barat',
    'Indonesia'
) ON CONFLICT DO NOTHING;

-- Insert Default About Section
INSERT INTO "about_section" (
    "title",
    "who_we_are",
    "what_we_do",
    "stats_clients",
    "stats_projects",
    "stats_years",
    "stats_team"
)
VALUES (
    'About BRODO',
    'BRODO adalah brand sepatu lokal Indonesia yang didirikan pada tahun 2010 di Bandung.',
    'Kami memproduksi sepatu berkualitas tinggi dengan desain yang stylish dan nyaman.',
    100,
    500,
    15,
    50
) ON CONFLICT DO NOTHING;

-- Insert Default Social Media
INSERT INTO "social_media" ("platform", "url", "icon", "order")
VALUES
    ('Instagram', 'https://www.instagram.com/brodo.footwear/', 'Instagram', 1),
    ('Facebook', 'https://www.facebook.com/brodo.footwear', 'Facebook', 2),
    ('Twitter', 'https://twitter.com/brodofootwear', 'Twitter', 3),
    ('LinkedIn', 'https://www.linkedin.com/company/brodo-footwear/', 'Linkedin', 4)
ON CONFLICT DO NOTHING;
