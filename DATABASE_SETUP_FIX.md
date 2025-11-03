# 🔧 DATABASE SETUP & FIX - Contact Form Error

## ❌ **ERROR YANG TERJADI:**

```
❌ Oops!
An unexpected error occurred. Please try again later.
```

**Penyebab:** Database belum dikonfigurasi. Contact form mencoba menyimpan data ke database, tapi `DATABASE_URL` belum diset.

---

## ✅ **SOLUSI LENGKAP - 3 OPSI:**

### **OPSI 1: Pakai PGlite (In-Memory) - TERCEPAT!** ⭐ RECOMMENDED

**PGlite** adalah PostgreSQL yang berjalan di memory (tidak perlu install PostgreSQL).

#### **Langkah-langkah:**

1. **Pastikan `.env.local` sudah ada DATABASE_URL:**
   ```bash
   # .env.local
   DATABASE_URL=
   ```
   *(Kosong = otomatis pakai PGlite)*

2. **Restart server:**
   ```bash
   # Tekan Ctrl+C di terminal yang running npm run dev
   npm run dev
   ```

3. **Test lagi di browser:**
   ```
   http://localhost:3000/company-profile
   ```

**✅ KEUNTUNGAN:**
- ✅ Tidak perlu setup apapun
- ✅ Gratis selamanya
- ✅ Langsung jalan
- ✅ Cocok untuk development

**❌ KEKURANGAN:**
- ❌ Data hilang saat server restart
- ❌ Tidak untuk production
- ❌ Tidak bisa diakses dari luar

---

### **OPSI 2: Pakai Neon (PostgreSQL Cloud) - FREE TIER** 🌟

**Neon** adalah PostgreSQL cloud dengan free tier yang bagus untuk development & production.

#### **Langkah-langkah:**

1. **Daftar di Neon:**
   - Buka: https://neon.tech
   - Sign up dengan GitHub (gratis)
   - Verify email

2. **Create Database:**
   - Click "Create Project"
   - Pilih region: AWS / Singapore (terdekat)
   - Database name: `brodo-company-profile`
   - Click "Create Project"

3. **Copy Connection String:**
   - Setelah project dibuat, lihat "Connection Details"
   - Copy **Connection string** yang mirip:
     ```
     postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```

4. **Tambahkan ke `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

5. **Restart server:**
   ```bash
   npm run dev
   ```

6. **Migration akan auto-run** saat server start pertama kali!

**✅ KEUNTUNGAN:**
- ✅ **Data persisten** (tidak hilang saat restart)
- ✅ **Free tier 0.5GB** (cukup untuk development)
- ✅ Bisa diakses dari mana saja
- ✅ **Production-ready**
- ✅ Auto-scaling

**📊 Free Tier Limits:**
- Storage: 0.5 GB
- Data transfer: 5 GB/month
- Compute: 100 jam/month
- (Cukup untuk project kuliah!)

---

### **OPSI 3: Pakai Supabase (PostgreSQL + Bonus Features)** 🚀

**Supabase** adalah Firebase alternative dengan PostgreSQL built-in.

#### **Langkah-langkah:**

1. **Daftar di Supabase:**
   - Buka: https://supabase.com
   - Sign up dengan GitHub
   - Verify email

2. **Create Project:**
   - Click "New Project"
   - Organization: Create new atau pilih existing
   - Name: `brodo-company-profile`
   - Database Password: **CATAT PASSWORD INI!**
   - Region: Southeast Asia (Singapore)
   - Click "Create new project"
   - *Tunggu 2-3 menit untuk setup*

3. **Get Connection String:**
   - Sidebar → "Settings" → "Database"
   - Scroll ke "Connection string"
   - Tab: "URI"
   - Copy connection string:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
     ```
   - **Replace `[YOUR-PASSWORD]`** dengan password yang tadi dibuat!

4. **Tambahkan ke `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
   ```

5. **Restart server:**
   ```bash
   npm run dev
   ```

**✅ KEUNTUNGAN:**
- ✅ Data persisten
- ✅ **Free tier 500MB** database
- ✅ Bonus: Auth, Storage, Realtime (bisa dipakai nanti)
- ✅ Nice dashboard untuk lihat data
- ✅ Production-ready

**📊 Free Tier Limits:**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 2 GB
- (Lebih dari cukup!)

---

## 🎯 **REKOMENDASI SAYA:**

### **Untuk Sekarang (Testing/Development):**
👉 **OPSI 1: PGlite** - Paling cepat, tinggal restart server!

### **Untuk Production/Demo Dosen:**
👉 **OPSI 2: Neon** atau **OPSI 3: Supabase**
- Data tidak hilang saat restart
- Bisa demo dari laptop manapun
- Terlihat lebih profesional

---

## 🔧 **LANGKAH QUICK FIX (Pakai PGlite):**

```bash
# 1. Pastikan .env.local punya DATABASE_URL (boleh kosong)
# File: .env.local
DATABASE_URL=

# 2. Stop server jika running (Ctrl+C)

# 3. Clear build cache
Remove-Item -Recurse -Force .next

# 4. Start server lagi
npm run dev

# 5. Tunggu sampai Ready
# Output: ✓ Ready in 4.7s

# 6. Test di browser
# http://localhost:3000/company-profile
```

---

## 🧪 **CARA VERIFY DATABASE JALAN:**

### **Test 1: Cek Migration**

Ketika server start, di terminal seharusnya ada log seperti:
```
○ Compiling /instrumentation ...
✓ Compiled /instrumentation in 1763ms
```

Jika tidak ada error berarti migration sukses!

---

### **Test 2: Cek Database via Drizzle Studio**

```bash
# Buka terminal baru (jangan stop dev server)
npm run db:studio
```

**Expected:**
- Server starts di `http://localhost:4983`
- Buka di browser
- Lihat table `contact_submission`

**Jika table muncul = Database setup sukses!** ✅

---

### **Test 3: Submit Contact Form**

1. Buka: `http://localhost:3000/company-profile`
2. Scroll ke form "Hubungi Kami"
3. Isi form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Subject: `Test`
   - Message: `Testing database connection`
4. Click "Kirim Pesan"

**Expected:**
- ✅ Green message: "Terima Kasih!"
- ✅ Form resets
- ✅ No error

---

### **Test 4: Verify Data Saved**

```bash
# Di Drizzle Studio (http://localhost:4983)
# Refresh table contact_submission
# Atau via browser console:
```

```javascript
fetch('/api/contact')
  .then(res => res.json())
  .then(data => console.table(data.data));
```

**Expected:** Table shows your test data!

---

## 🐛 **TROUBLESHOOTING:**

### **Error: "Failed to connect to database"**

**Kemungkinan:**
1. DATABASE_URL salah format
2. Database belum dibuat
3. Network issue

**Solution:**
```bash
# Check .env.local
cat .env.local

# Pastikan DATABASE_URL ada (boleh kosong untuk PGlite)
DATABASE_URL=

# Restart server
npm run dev
```

---

### **Error: "Table contact_submission does not exist"**

**Kemungkinan:** Migration belum run

**Solution:**
```bash
# Re-generate migration
npm run db:generate

# Restart server (migration auto-run on start)
npm run dev
```

---

### **Error: "Invalid connection string"**

**Kemungkinan:** Format DATABASE_URL salah

**Format yang benar:**
```bash
# PostgreSQL format:
postgresql://username:password@host:5432/database

# Example Neon:
postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Example Supabase:
postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

# PGlite (empty):
DATABASE_URL=
```

---

## 📚 **PENJELASAN TEKNIS:**

### **Apa itu PGlite?**

PGlite adalah **PostgreSQL yang berjalan di WebAssembly** (WASM).

**Cara kerja:**
1. Server Next.js start
2. PGlite initialize database di memory
3. Migration auto-run
4. Database ready!

**Keuntungan:**
- Zero configuration
- No PostgreSQL installation needed
- Perfect untuk development

**Kekurangan:**
- Data hilang saat restart
- Tidak bisa production
- Single user only

---

### **Kenapa Perlu Database?**

Contact form menyimpan data submission ke database agar:
- ✅ Data tersimpan permanen
- ✅ Bisa diakses kapan saja
- ✅ Admin bisa review submissions
- ✅ Analytics & reporting
- ✅ Email notification (future)

**Tanpa database:**
- ❌ Data hilang
- ❌ Tidak ada history
- ❌ Tidak production-ready

---

### **Bagaimana Migration Bekerja?**

```
1. Schema.ts (define table structure)
   ↓
2. npm run db:generate (create SQL migration)
   ↓
3. migrations/0001_xxx.sql (SQL file created)
   ↓
4. Server start → Auto run migration
   ↓
5. Table created in database ✅
```

**File migration:** `migrations/0001_friendly_iron_lad.sql`

---

## 🎯 **SUMMARY:**

### **Problem:**
- Contact form error karena database tidak configured

### **Root Cause:**
- `DATABASE_URL` tidak ada di `.env.local`
- Migration belum run

### **Solution:**
1. ✅ Add `DATABASE_URL=` ke `.env.local`
2. ✅ Restart server
3. ✅ Migration auto-run
4. ✅ Test form again!

### **Best Practice:**
- Development: PGlite (quick & easy)
- Production: Neon/Supabase (persistent data)

---

## 🚀 **NEXT STEPS:**

Setelah database setup:

1. **Test Contact Form** ✅
   - Submit beberapa kali
   - Verify di Drizzle Studio

2. **Setup Production Database** (optional)
   - Pilih Neon atau Supabase
   - Deploy ke Vercel

3. **Build Admin Dashboard** (future)
   - View all submissions
   - Mark as resolved
   - Send responses

---

## 📞 **NEED HELP?**

Jika masih error setelah ikuti langkah di atas:

1. Check terminal logs untuk error detail
2. Check browser console (F12) untuk error
3. Screenshot error message
4. Check `DATABASE_URL` format

---

**Created:** November 2, 2025  
**Status:** Database Setup Guide  
**Next:** Test contact form after setup!

---

## ✅ **QUICK CHECKLIST:**

- [ ] Add `DATABASE_URL=` to `.env.local`
- [ ] Restart dev server (`npm run dev`)
- [ ] Wait for "Ready in X.Xs"
- [ ] Open `http://localhost:3000/company-profile`
- [ ] Test contact form
- [ ] See green success message
- [ ] Open Drizzle Studio to verify data
- [ ] Success! 🎉
