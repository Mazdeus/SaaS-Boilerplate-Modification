# 🚀 Tutorial Setup Database PostgreSQL Neon - BRODO SaaS Boilerplate

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Setup Neon Database](#setup-neon-database)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Setup Database Schema](#setup-database-schema)
5. [Verifikasi Setup](#verifikasi-setup)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## 📦 Prerequisites

Pastikan sudah terinstall:
- ✅ **Node.js** (v18 atau lebih baru)
- ✅ **npm** atau **yarn**
- ✅ **Git**
- ✅ Akun **Neon** (gratis di [neon.tech](https://neon.tech))

## 🌐 Setup Neon Database

### Step 1: Buat Akun Neon
1. Kunjungi [console.neon.tech](https://console.neon.tech)
2. Sign up dengan GitHub/Google/Email
3. Verifikasi email (jika diperlukan)

### Step 2: Buat Database Project
1. **Klik "Create a project"**
2. **Pilih region terdekat:**
   - Untuk Indonesia: `Asia Pacific (Singapore)`
   - Atau `US East (Ohio)` jika Singapore tidak tersedia
3. **Isi informasi project:**
   ```
   Project name: BRODO-SaaS-Database
   Database name: neondb (default)
   PostgreSQL version: 16 (recommended)
   ```
4. **Klik "Create project"**

### Step 3: Dapatkan Connection String
Setelah project dibuat, Anda akan melihat **Connection Details**:

```bash
# Format connection string
postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Contoh:
postgresql://neondb_owner:abc123xyz@ep-holy-sky-a1scxln7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

⚠️ **PENTING:** 
- Simpan connection string ini dengan aman
- Password hanya ditampilkan sekali
- Jika lupa password, bisa reset di dashboard

---

## ⚙️ Konfigurasi Environment

### Step 1: Clone Repository
```bash
# Clone project terbaru
git clone [repository-url]
cd SaaS-Boilerplate-Modification

# Install dependencies
npm install
```

### Step 2: Buat File Environment
Buat file `.env.local` di root folder project:

```bash
# Windows
copy .env.example .env.local

# macOS/Linux  
cp .env.example .env.local
```

### Step 3: Konfigurasi DATABASE_URL
Edit file `.env.local` dan tambahkan:

```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Ganti dengan connection string dari Neon dashboard
```

### Step 4: Install Dependencies Database
```bash
# Install Neon serverless package
npm install @neondatabase/serverless

# Verify installation
npm list @neondatabase/serverless
```

---

## 🗄️ Setup Database Schema

### Step 1: Test Koneksi Database
```bash
# Test koneksi ke Neon
npm run db:test
```

**Output yang diharapkan:**
```
✅ Connection successful
📊 PostgreSQL: PostgreSQL 16.9
⚠️  No tables found. Database might be empty.
```

### Step 2: Setup Schema & Data
```bash
# Jalankan setup database lengkap
npm run db:setup
```

**Proses yang terjadi:**
1. 🔍 Test koneksi database
2. 📖 Load schema dari `database/setup-complete.sql`
3. 🏗️ Buat 19 tables dengan relationships
4. 📊 Populate dengan data real BRODO company
5. ✅ Setup constraints & indexes

**Output sukses:**
```
🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!
📋 Tables created:
  ✓ organization
  ✓ todo
  ✓ contact_submission
  ✓ cms_user
  ✓ company_info
  ✓ company_branch
  ✓ hero_section
  ✓ about_section
  ... dan 11 tables lainnya
```

### Step 3: Validasi Setup
```bash
# Validasi database lengkap
npm run db:validate
```

**Hasil validasi yang diharapakan:**
```
🎯 FINAL VALIDATION RESULT
🎉 ✅ VALIDATION PASSED!
🏆 Database setup is 100% complete:
   • 19 tables created successfully
   • 14 tables populated with real data
   • Constraints and indexes in place
   • Ready for production use!
```

---

## 🔍 Verifikasi Setup

### 1. Explore Database dengan Drizzle Studio
```bash
# Buka GUI database
npm run db:studio
```
- Browser akan terbuka di `https://local.drizzle.studio`
- Explore tables dan data yang sudah ter-populate
- Verify data BRODO company sudah masuk

### 2. Test Aplikasi
```bash
# Start development server
npm run dev
```
- Buka `http://localhost:3000`
- Test halaman yang menggunakan database
- Verify CMS functionality

### 3. Check Available Commands
```bash
# List semua database commands
npm run | grep db:
```

**Available commands:**
```bash
npm run db:test      # Test koneksi database
npm run db:setup     # Setup schema + data
npm run db:validate  # Validasi setup
npm run db:studio    # GUI database explorer
npm run db:reset     # ⚠️ DANGER: Reset semua data
```

---

## 🔧 Troubleshooting

### ❌ Problem: "Cannot find module '@neondatabase/serverless'"
**Solution:**
```bash
npm install @neondatabase/serverless
```

### ❌ Problem: "DATABASE_URL not found"
**Solution:**
1. Pastikan file `.env.local` ada di root project
2. Check format DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```
3. Pastikan tidak ada spasi atau quotes salah

### ❌ Problem: "Connection failed"
**Possible causes:**
1. **Wrong connection string** - Copy ulang dari Neon dashboard
2. **Project suspended** - Check Neon dashboard
3. **Network issues** - Test internet connection
4. **Special characters in password** - URL encode special chars

### ❌ Problem: "Permission denied"
**Solution:**
1. Check apakah Neon project masih aktif
2. Verify role permissions di Neon dashboard
3. Try regenerate password di Neon

### ❌ Problem: "Tables already exist"
**This is normal!** Script menggunakan:
- `CREATE TABLE IF NOT EXISTS` - Aman untuk tables existing
- `INSERT ... ON CONFLICT` - Aman untuk data existing

---

## 🎯 Next Steps

### Setelah Setup Berhasil:

#### 1. **Development Workflow**
```bash
# Start development
npm run dev

# Explore database
npm run db:studio

# Check database status
npm run db:validate
```

#### 2. **CMS Access**
- URL: `http://localhost:3000/admin`
- Default admin:
  ```
  Username: admin
  Password: admin123
  ```

#### 3. **Database Management**
- Use **Drizzle Studio** untuk GUI management
- Schema changes via `src/models/Schema.ts`
- Migrations via Drizzle commands

#### 4. **Production Deployment**
- Neon database sudah production-ready
- Update `DATABASE_URL` di production environment
- No additional setup needed

---

## 📚 Additional Resources

### Database Structure
- **19 Tables total:**
  - 5 Core tables (organization, todo, contact_submission, cms_user, images)
  - 14 BRODO company tables (real data)
- **Real company data included:**
  - Company info & branches (15 locations)
  - Products & collections (real BRODO items)
  - Team members (founders & staff)
  - Testimonials & social media

### File Structure
```
project-root/
├── database/
│   └── setup-complete.sql     # Complete schema + data
├── migrations/                # Drizzle auto-generated
├── src/models/Schema.ts       # TypeScript schema
├── setup-database.js          # Setup script
├── test-database.js          # Connection test
└── validate-database.js      # Validation script
```

### Useful Commands Reference
```bash
# Database operations
npm run db:test              # Test connection
npm run db:setup             # Full setup
npm run db:validate          # Validate setup
npm run db:studio            # GUI explorer

# Development
npm run dev                  # Start dev server
npm run build               # Build for production

# Type checking
npm run check-types         # TypeScript validation
```

---

## 🆘 Need Help?

Jika mengalami masalah:
1. **Check logs** - Error messages biasanya descriptive
2. **Validate .env.local** - Pastikan DATABASE_URL benar
3. **Test connection** - `npm run db:test` harus sukses dulu
4. **Check Neon dashboard** - Pastikan project aktif
5. **Ask team** - Share error message lengkap

**Happy coding! 🚀**
