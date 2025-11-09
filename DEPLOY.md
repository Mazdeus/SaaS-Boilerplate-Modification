# 🚀 Panduan Deployment Aplikasi Company Profile & CMS

Panduan lengkap untuk men-deploy aplikasi Next.js Company Profile dengan CMS agar bisa diakses secara online oleh orang lain.

---

## 📋 Daftar Isi

1. [Persiapan Sebelum Deploy](#persiapan-sebelum-deploy)
2. [Pilihan Platform Deployment](#pilihan-platform-deployment)
3. [Deployment ke Vercel (RECOMMENDED)](#deployment-ke-vercel-recommended)
4. [Deployment ke Netlify](#deployment-ke-netlify)
5. [Deployment dengan Docker](#deployment-dengan-docker)
6. [Konfigurasi Database Production](#konfigurasi-database-production)
7. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
8. [Testing Setelah Deploy](#testing-setelah-deploy)
9. [Troubleshooting](#troubleshooting)

---

## ⚙️ Persiapan Sebelum Deploy

### ⚡ Catatan Penting: Deploy dari Branch

**ANDA BISA DEPLOY DARI BRANCH APA SAJA!** Tidak harus dari `main`.

#### Opsi 1: Deploy Langsung dari Branch `cms-integrated` (Quick & Easy)
✅ **Recommended untuk testing atau jika branch sudah stabil**

```bash
# Pastikan branch Anda up-to-date
git add .
git commit -m "Ready for deployment"
git push origin cms-integrated
```

Saat setup di Vercel/Netlify, pilih branch `cms-integrated` sebagai production branch.

#### Opsi 2: Merge ke Main Dulu (Best Practice untuk Production)
✅ **Recommended untuk deployment final/production**

```bash
# Switch ke main
git checkout main

# Merge dari cms-integrated
git merge cms-integrated

# Push ke remote
git push origin main
```

**Pilih yang mana?**
- **Testing/Development**: Deploy langsung dari `cms-integrated`
- **Production/Final**: Merge ke `main` dulu

### 1. Pastikan Aplikasi Berjalan Lokal

```bash
# Test aplikasi di lokal
npm run dev
```

Buka http://localhost:3000 dan pastikan:
- ✅ Company Profile dapat diakses
- ✅ CMS dapat diakses dan berfungsi
- ✅ Database terkoneksi dengan baik

### 2. Build Test Lokal

```bash
# Build aplikasi
npm run build

# Test production build
npm run start
```

Pastikan tidak ada error saat build dan aplikasi berjalan dengan baik di mode production.

### 3. Checklist Sebelum Deploy

- [ ] Database production sudah siap (Neon/PostgreSQL)
- [ ] Semua environment variables sudah disiapkan
- [ ] Code sudah di-commit ke Git
- [ ] Repository sudah di-push ke GitHub/GitLab
- [ ] Authentication (Clerk) sudah dikonfigurasi

---

## 🌐 Pilihan Platform Deployment

### Perbandingan Platform

| Platform | Gratis | Mudah | Database | Domain | Rekomendasi |
|----------|--------|-------|----------|--------|-------------|
| **Vercel** | ✅ Yes | ⭐⭐⭐⭐⭐ | External | ✅ Yes | **TERBAIK** untuk Next.js |
| **Netlify** | ✅ Yes | ⭐⭐⭐⭐ | External | ✅ Yes | Alternatif bagus |
| **Docker + VPS** | Bayar | ⭐⭐⭐ | Include | Bayar | Untuk kontrol penuh |

**Rekomendasi: Gunakan Vercel** karena:
- Dibuat oleh pembuat Next.js
- Deploy otomatis dari GitHub
- CDN global gratis
- SSL certificate gratis
- Domain gratis (.vercel.app)

---

## 🎯 Deployment ke Vercel (RECOMMENDED)

### Langkah 1: Persiapan Repository

#### Pilih Branch untuk Deploy

**Opsi A: Deploy dari Branch `cms-integrated` (Current Branch)**
```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Prepare for deployment from cms-integrated"
git push origin cms-integrated
```

**Opsi B: Deploy dari Branch `main`**
```bash
# Merge ke main terlebih dahulu
git checkout main
git merge cms-integrated
git push origin main

# Atau buat Pull Request di GitHub lalu merge
```

💡 **Tips**: Untuk testing, deploy dari `cms-integrated` dulu. Jika sudah OK, baru merge ke `main`.

### Langkah 2: Setup Neon Database (Production)

1. **Buat Account Neon**
   - Kunjungi https://neon.tech
   - Sign up dengan GitHub (gratis)

2. **Buat Database Project**
   - Klik "Create a project"
   - Berikan nama: `company-profile-db`
   - Region: pilih yang terdekat (Singapore/Asia)

3. **Dapatkan Connection String**
   - Di dashboard Neon, klik "Connection Details"
   - Copy connection string (format: `postgresql://user:pass@host/db`)
   - Simpan untuk nanti

### Langkah 3: Setup Vercel Account

1. **Buat Account Vercel**
   - Kunjungi https://vercel.com
   - Sign up dengan GitHub account
   - Authorize Vercel mengakses repositories

2. **Import Project**
   - Di Vercel Dashboard, klik **"New Project"**
   - Pilih repository aplikasi Anda: `SaaS-Boilerplate-Modification`
   - Klik **"Import"**

3. **Pilih Branch untuk Deploy**
   
   ⚠️ **PENTING**: Di halaman import, Vercel otomatis pilih branch default (biasanya `main`)
   
   **Jika ingin deploy dari branch lain (seperti `cms-integrated`), ada 2 cara:**

   **Cara 1: Ubah Default Branch di GitHub Dulu (RECOMMENDED)**
   1. Buka repository di GitHub: `https://github.com/Mazdeus/SaaS-Boilerplate-Modification`
   2. Klik **Settings** (di repository - icon ⚙️)
   3. **DI HALAMAN GENERAL** (bukan Branches!), scroll ke bawah
   4. Cari bagian **"Default branch"** (ada di atas bagian "Branch protection rules")
   5. Klik tombol ↔️ (switch icon) atau tombol pensil/edit
   6. Pilih `cms-integrated` dari dropdown
   7. Klik **Update** dan konfirmasi dengan klik "I understand, update the default branch"
   8. Kembali ke Vercel dan refresh → akan otomatis detect `cms-integrated`
   
   **CATATAN**: Jika tidak menemukan bagian "Default branch", berarti Anda sedang di halaman yang salah (seperti "Branch protection rules"). Kembali ke halaman **Settings > General** terlebih dahulu.
   
   **Cara 2: Deploy Dulu, Ubah Branch Nanti**
   1. Deploy dari `main` dulu (klik Continue/Deploy)
   2. Setelah deploy selesai, buka Project Settings di Vercel
   3. Klik **Git** di sidebar
   4. Di "Production Branch", ubah dari `main` ke `cms-integrated`
   5. Klik **Save**
   6. Trigger redeploy dengan push commit baru ke `cms-integrated`

### Langkah 4: Konfigurasi Build Settings

Vercel sudah otomatis mendeteksi:
- ✅ **Framework Preset**: Next.js
- ✅ **Build Command**: `npm run build` (otomatis)
- ✅ **Output Directory**: `.next` (otomatis)
- ✅ **Install Command**: `npm install` (otomatis)

**Anda tidak perlu ubah apapun di "Build and Output Settings"** - biarkan default! ✓

### Langkah 5: Konfigurasi Environment Variables

⚠️ **JANGAN DEPLOY DULU!** Setup environment variables terlebih dahulu.

Klik **"Environment Variables"** untuk expand, lalu tambahkan variables berikut:

#### A. Database Configuration
```bash
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```
*(Paste connection string dari Neon)*

#### B. NextAuth Configuration
```bash
NEXTAUTH_SECRET=generate_random_string_here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Cara generate NEXTAUTH_SECRET:**
```bash
# Di terminal lokal:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### C. Clerk Authentication
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

#### D. Stripe (Opsional, jika menggunakan payment)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Langkah 6: Deploy

1. **Deploy Pertama Kali**
   - ✅ Pastikan Framework Preset = **Next.js**
   - ✅ Pastikan Environment Variables sudah diisi semua
   - ✅ Build and Output Settings biarkan default
   - Klik tombol **"Deploy"** di bawah
   - Tunggu proses build (2-5 menit)
   - Aplikasi akan otomatis di-deploy

2. **Akses Aplikasi**
   - Setelah deploy selesai, Vercel akan memberikan URL
   - Format: `https://saa-s-boilerplate-modification.vercel.app`
   - Buka URL tersebut di browser

3. **Ubah ke Branch `cms-integrated` (Jika Deploy dari `main`)**
   - Di Vercel Dashboard, buka project Anda
   - Klik **Settings** → **Git**
   - Ubah "Production Branch" dari `main` ke `cms-integrated`
   - Klik **Save**
   - Push commit baru ke `cms-integrated` untuk trigger redeploy

### Langkah 7: Setup Database Tables

Setelah deploy, database masih kosong. Jalankan migrations:

**Opsi A: Via Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Link project
vercel link

# Jalankan migration
vercel env pull .env.local
npm run db:migrate
```

**Opsi B: Via Neon SQL Editor**
1. Buka Neon dashboard
2. Pilih database project Anda
3. Klik "SQL Editor"
4. Copy isi file `migrations/0000_init-db.sql`
5. Paste dan execute di SQL Editor
6. Ulangi untuk file migration lainnya secara berurutan:
   - `0001_friendly_iron_lad.sql`
   - `0002_cms_schema.sql`
   - `0003_add_image_url_columns.sql`
   - `0004_add_company_info_table.sql`
   - `0005_add_company_branch.sql`
   - `0006_add_instagram_and_subtitle.sql`
   - `0007_create_brand_branch.sql`

### Langkah 8: Update Clerk Settings

1. Buka Clerk Dashboard (https://dashboard.clerk.com)
2. Pilih aplikasi Anda
3. Klik **"Domains"** di sidebar
4. Tambahkan domain Vercel: `your-app-name.vercel.app`
5. Update redirect URLs:
   - Sign-in URL: `https://your-app-name.vercel.app/sign-in`
   - Sign-up URL: `https://your-app-name.vercel.app/sign-up`
   - After sign-in: `https://your-app-name.vercel.app/dashboard`

### Langkah 9: Testing

Akses aplikasi di URL Vercel Anda dan test:
- ✅ Company Profile dapat diakses
- ✅ CMS login berfungsi
- ✅ CRUD operations di CMS bekerja
- ✅ Data tersimpan di database

---

## 🔷 Deployment ke Netlify

### Langkah 1: Setup Netlify Account

1. Kunjungi https://netlify.com
2. Sign up dengan GitHub
3. Klik **"Add new site"** → **"Import an existing project"**

### Langkah 2: Konfigurasi Build Settings

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# (Sama seperti di Vercel, lihat bagian Konfigurasi Environment Variables)
```

### Langkah 3: Deploy

1. Klik **"Deploy site"**
2. Tunggu build selesai
3. Akses aplikasi di URL yang diberikan (format: `xxx.netlify.app`)

### Catatan Netlify:
- Netlify lebih cocok untuk static site
- Untuk Next.js dengan server-side features, Vercel lebih direkomendasikan

---

## 🐳 Deployment dengan Docker

### Prasyarat
- Docker Desktop terinstall
- VPS/Cloud Server (DigitalOcean, AWS, Google Cloud)

### Langkah 1: Buat Dockerfile

Buat file `Dockerfile` di root project:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Langkah 2: Update next.config.mjs

Tambahkan konfigurasi output standalone:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
export default withSentryConfig(
  bundleAnalyzer(
    withNextIntlConfig({
      eslint: {
        dirs: ['.'],
      },
      poweredByHeader: false,
      reactStrictMode: true,
      output: 'standalone', // Tambahkan ini
      experimental: {
        serverComponentsExternalPackages: ['@electric-sql/pglite'],
      },
    }),
  ),
  // ... sentry config
);
```

### Langkah 3: Buat docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        DATABASE_URL: ${DATABASE_URL}
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
        NEXTAUTH_URL: ${NEXTAUTH_URL}
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
```

### Langkah 4: Buat .dockerignore

```bash
# .dockerignore
node_modules
.next
.git
.env.local
npm-debug.log
README.md
.vscode
coverage
.idea
```

### Langkah 5: Build dan Run Docker

```bash
# Build Docker image
docker build -t company-profile .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key" \
  -e NEXTAUTH_SECRET="your_secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  company-profile

# Atau dengan docker-compose
docker-compose up -d
```

### Langkah 6: Deploy ke VPS

1. **Push ke Docker Hub**
```bash
docker tag company-profile yourusername/company-profile:latest
docker push yourusername/company-profile:latest
```

2. **Di VPS (DigitalOcean/AWS)**
```bash
# Install Docker di VPS
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Pull dan run image
docker pull yourusername/company-profile:latest
docker run -d -p 80:3000 \
  -e DATABASE_URL="..." \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="http://your-vps-ip" \
  yourusername/company-profile:latest
```

---

## 🗄️ Konfigurasi Database Production

### Setup Neon PostgreSQL (Recommended - GRATIS)

1. **Buat Account**
   - https://neon.tech → Sign up (gratis)

2. **Buat Project**
   - New Project → Pilih region terdekat
   - Database name: `company_profile`

3. **Dapatkan Connection String**
   ```bash
   # Format connection string:
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

4. **Setup Tables**
   - Gunakan Neon SQL Editor atau
   - Jalankan migrations via `npm run db:migrate`

### Alternatif Database Lain

#### Supabase (Gratis)
- https://supabase.com
- Kelebihan: Includes authentication, storage, realtime
- Connection string tersedia di dashboard

#### ElephantSQL (Gratis tier available)
- https://elephantsql.com
- Gratis 20MB storage
- Mudah digunakan

#### Railway (Gratis tier)
- https://railway.app
- Deploy database langsung dari dashboard

---

## 🔐 Konfigurasi Environment Variables

### Environment Variables yang Dibutuhkan

Buat file `.env.production` atau setting di platform deployment:

```bash
# ========================================
# DATABASE
# ========================================
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# ========================================
# NEXTAUTH (untuk CMS Authentication)
# ========================================
NEXTAUTH_SECRET=your_random_secret_minimum_32_characters_long
NEXTAUTH_URL=https://your-domain.com

# ========================================
# CLERK (untuk User Authentication)
# ========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx

# ========================================
# STRIPE (Opsional)
# ========================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ========================================
# SENTRY (Opsional - Error Monitoring)
# ========================================
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Cara Generate Secret Keys

```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Atau gunakan OpenSSL
openssl rand -base64 32
```

---

## ✅ Testing Setelah Deploy

### 1. Test Company Profile

```bash
# Buka di browser
https://your-app-name.vercel.app
```

Cek:
- [ ] Homepage loading dengan benar
- [ ] Navigasi menu berfungsi
- [ ] Content dari database muncul
- [ ] Images loading
- [ ] Responsive di mobile

### 2. Test CMS

```bash
# Login ke CMS
https://your-app-name.vercel.app/cms/login
```

Cek:
- [ ] Login berfungsi
- [ ] Dashboard accessible
- [ ] CRUD operations bekerja (Create, Read, Update, Delete)
- [ ] Upload image berfungsi
- [ ] Perubahan data langsung terlihat di company profile

### 3. Test Database Connection

```bash
# Via Neon dashboard atau Drizzle Studio
npm run db:studio
```

### 4. Performance Testing

Gunakan tools berikut:
- **PageSpeed Insights**: https://pagespeed.web.dev
- **GTmetrix**: https://gtmetrix.com
- **Lighthouse** (di Chrome DevTools)

Target minimal:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🔧 Troubleshooting

### Problem: Build Error di Vercel

**Solusi:**
```bash
# Clear cache dan rebuild
# Di Vercel Dashboard:
# Settings → General → Clear Cache → Redeploy
```

### Problem: Database Connection Failed

**Solusi:**
1. Cek connection string di environment variables
2. Pastikan `?sslmode=require` ada di akhir connection string
3. Test koneksi dari lokal:
```bash
npm run db:test
```

### Problem: Environment Variables Tidak Terbaca

**Solusi:**
1. Pastikan variable sudah di-set di platform (Vercel/Netlify)
2. Untuk public variables, harus diawali `NEXT_PUBLIC_`
3. Redeploy setelah menambah/mengubah env variables

### Problem: 404 Error di Halaman CMS

**Solusi:**
```bash
# Pastikan middleware.ts configured dengan benar
# Check src/middleware.ts
```

### Problem: Images Tidak Muncul

**Solusi:**
1. Cek `next.config.mjs` untuk image domains
2. Pastikan image URLs accessible
3. Untuk external images, tambahkan domain di config:
```javascript
// next.config.mjs
images: {
  domains: ['your-image-domain.com'],
}
```

### Problem: Slow Loading

**Solusi:**
1. Enable compression di next.config.mjs
2. Optimize images (gunakan Next.js Image component)
3. Implement caching strategy
4. Use CDN (Vercel sudah include)

---

## 🎉 Selamat!

Aplikasi Company Profile & CMS Anda sekarang sudah online dan bisa diakses oleh orang lain!

### Next Steps

1. **Custom Domain** (Opsional)
   - Beli domain di Namecheap/GoDaddy
   - Point DNS ke Vercel
   - Setup di Vercel: Settings → Domains

2. **Setup SSL Certificate**
   - Otomatis di Vercel/Netlify
   - Manual untuk VPS: https://letsencrypt.org

3. **Monitoring**
   - Setup Sentry untuk error tracking
   - Enable Vercel Analytics
   - Setup uptime monitoring (UptimeRobot)

4. **Backup Database**
   - Neon provides automatic backups
   - Setup manual backup cron job

5. **SEO Optimization**
   - Add Google Analytics
   - Submit sitemap to Google Search Console
   - Setup Open Graph tags

---

## 📞 Support

Jika mengalami masalah:
1. Check logs di Vercel Dashboard
2. Test di local terlebih dahulu
3. Pastikan environment variables sudah benar
4. Check database connection

---

## 📚 Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Neon Database Docs**: https://neon.tech/docs
- **Clerk Documentation**: https://clerk.com/docs

---

**Dibuat dengan ❤️ untuk kemudahan deployment**

*Last updated: November 2025*
