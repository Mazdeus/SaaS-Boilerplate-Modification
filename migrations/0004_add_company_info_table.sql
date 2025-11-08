-- Add company_info table for storing company profile information
CREATE TABLE IF NOT EXISTS "company_info" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(150) NOT NULL,
  "tagline" text,
  "description" text,
  "founded_year" integer,
  "location" varchar(200),
  "industry" varchar(100),
  "employees" integer,
  "email" varchar(100),
  "phone" varchar(30),
  "address" text,
  "logo_url" varchar(500),
  "is_active" boolean DEFAULT true,
  "updated_at" timestamp DEFAULT now()
);

-- Insert default company info
INSERT INTO "company_info" (name, tagline, description, founded_year, location, industry, employees, email, phone, is_active)
VALUES (
  'BRODO',
  'Langkah Awal Gaya Lokal',
  'Brand sepatu lokal Indonesia yang berkomitmen menghadirkan produk berkualitas tinggi, nyaman, dan penuh karakter',
  2010,
  'Bandung, Indonesia',
  'Footwear & Fashion',
  50,
  'info@bro.do',
  '+62-xxx-xxxx-xxxx',
  true
) ON CONFLICT DO NOTHING;
