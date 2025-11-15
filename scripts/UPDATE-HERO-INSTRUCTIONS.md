# Instructions to Update Hero Sections

Karena psql tidak tersedia di terminal, Anda bisa mengupdate hero section descriptions dengan salah satu cara berikut:

## Option 1: Via Drizzle Studio (Recommended)
1. Run: `npm run db:studio`
2. Buka browser ke URL yang diberikan (biasanya https://local.drizzle.studio)
3. Pilih table `hero_sections`
4. Edit setiap row dan tambahkan description:
   - "Crafted with passion, designed for authenticity. Explore our premium collection of Indonesian footwear."
   - "Experience the perfect blend of tradition and innovation in every step."
   - "Discover timeless designs that tell a story of craftsmanship and quality."

## Option 2: Via pgAdmin atau PostgreSQL GUI
1. Buka pgAdmin atau database GUI lainnya
2. Connect ke database `brodo_db`
3. Run query dari file `scripts/update-hero-descriptions.sql`

## Option 3: Via CMS (Akan dibuat nanti)
Nanti akan ada halaman CMS untuk edit hero sections langsung dari web interface.
