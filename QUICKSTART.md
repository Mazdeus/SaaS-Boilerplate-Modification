# 🚀 Quick Start Guide - Brodo CMS

> **Setup aplikasi dalam 5 menit! Database sudah siap, tinggal jalankan!**

---

## 📋 Prerequisites (Yang Harus Ada)

Pastikan sudah install:
- ✅ **Node.js** versi 18 atau lebih baru ([Download di sini](https://nodejs.org/))
- ✅ **Git** ([Download di sini](https://git-scm.com/))
- ✅ **Code Editor** (disarankan VS Code)

---

## 🎯 Langkah Setup (Super Simple!)

### 1️⃣ Clone/Download Project

**Pilih salah satu:**

**Opsi A - Pakai Git:**
```bash
git clone [URL-REPOSITORY-INI]
cd Mission-2.1
```

**Opsi B - Download ZIP:**
1. Download project sebagai ZIP
2. Extract ke folder `Mission-2.1`
3. Buka terminal/command prompt di folder tersebut

---

### 2️⃣ Install Dependencies

Buka terminal di folder project, lalu jalankan:

```bash
npm install
```

⏱️ **Tunggu 1-2 menit** sampai selesai download semua packages.

---

### 3️⃣ Setup Environment Variables

**Buat file `.env.local`** di root folder project dengan isi:

```bash
# Database (sudah siap pakai, tidak perlu ubah!)
DATABASE_URL=postgresql://neondb_owner:npg_qZRv1goBJue0@ep-round-sound-a1e9anjp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret (sudah aman, tidak perlu ubah!)
JWT_SECRET=6d3f2ae6f2ceb3f83669a2564a39ec4b8040af01264233700a8ebfe203678e72

# Next.js URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> 💡 **Copy-paste aja semua!** Database dan konfigurasi sudah siap pakai.

---

### 4️⃣ Jalankan Development Server

```bash
npm run dev
```

✅ Tunggu sampai muncul pesan:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

---

### 5️⃣ Buka di Browser

**Public Website:**
```
http://localhost:3000
```

**CMS (Admin Panel):**
```
http://localhost:3000/cms/login
```

**Login CMS:**
- 📧 Email: `admin@brodo.com`
- 🔑 Password: `admin123`

---

## 🎉 Selesai! Aplikasi Sudah Jalan!

### Halaman yang Bisa Diakses:

#### 🌐 Public Pages:
- **Homepage**: `http://localhost:3000`
- **Tentang Kami**: `http://localhost:3000/about`
- **Koleksi**: `http://localhost:3000/collections`
- **Toko**: `http://localhost:3000/stores`
- **Aktivitas Terbaru**: `http://localhost:3000/instagram`
- **Kontak**: `http://localhost:3000/contact`

#### 🔐 CMS Pages (Login Required):
- **Dashboard**: `http://localhost:3000/cms/dashboard`
- **Hero Sections**: `http://localhost:3000/cms/hero`
- **Company Values**: `http://localhost:3000/cms/values`
- **Team Members**: `http://localhost:3000/cms/founders`
- **Collections**: `http://localhost:3000/cms/collections`
- **Stores**: `http://localhost:3000/cms/stores`
- **Testimonials**: `http://localhost:3000/cms/testimonials`
- **Messages**: `http://localhost:3000/cms/messages`
- **Settings**: `http://localhost:3000/cms/settings`

---

## 🛠️ Commands Berguna

```bash
# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production build
npm start

# Check TypeScript errors
npm run type-check

# Format code
npm run format
```

---

## 📱 Testing di Mobile/Tablet

1. Pastikan komputer dan HP/tablet dalam **WiFi yang sama**
2. Cek IP address komputer:
   - Windows: `ipconfig` (cari IPv4 Address)
   - Mac/Linux: `ifconfig` atau `ip addr`
3. Buka di HP/tablet: `http://[IP-KOMPUTER]:3000`
   - Contoh: `http://192.168.1.5:3000`

---

## ❓ Troubleshooting

### Port 3000 sudah dipakai?
Jika ada error "Port 3000 is already in use":

**Windows:**
```bash
npx kill-port 3000
npm run dev
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill
npm run dev
```

Atau ubah port di `package.json`:
```json
"dev": "next dev -p 3001"
```

---

### Database error?
Cek koneksi internet kamu, karena database pakai Neon (cloud database).

---

### npm install error?
1. Hapus folder `node_modules` dan file `package-lock.json`
2. Jalankan `npm install` lagi

---

### Build error?
Coba:
```bash
npm run type-check
```
Untuk lihat error TypeScript yang ada.

---

## 💾 Database Info

- **Type**: PostgreSQL (Neon Cloud)
- **Status**: ✅ Sudah seeded dengan data demo
- **Location**: Singapore (ap-southeast-1)
- **Users yang sudah ada**:
  - Admin: `admin@brodo.com` / `admin123`

> ⚠️ **NOTE**: Database ini shared untuk testing. Jangan hapus data penting!

---

## 📚 Dokumentasi Lengkap

Untuk informasi lebih detail, baca:

- **[README.md](./README.md)** - Overview lengkap project
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Detail teknis implementasi
- **[CHANGELOG-FIXES.md](./CHANGELOG-FIXES.md)** - Bug fixes & improvements
- **[DISPLAY-ORDER-GUIDE.md](./DISPLAY-ORDER-GUIDE.md)** - Cara kerja display order
- **[RESPONSIVE-FIX.md](./RESPONSIVE-FIX.md)** - Responsive design guide
- **[INSTAGRAM-PAGE.md](./INSTAGRAM-PAGE.md)** - Instagram integration guide

---

## 🎯 Quick Features Test

### Test 1: Lihat Public Website
1. Buka `http://localhost:3000`
2. Klik menu "Koleksi", "Toko", "Aktivitas Terbaru"
3. Scroll dan lihat testimonials dengan foto customer

### Test 2: Login ke CMS
1. Buka `http://localhost:3000/cms/login`
2. Login dengan `admin@brodo.com` / `admin123`
3. Dashboard akan muncul dengan overview data

### Test 3: CRUD Operations
1. Di CMS, buka "Collections"
2. Klik "Add Collection" untuk tambah data
3. Edit atau delete collection yang ada
4. Lihat perubahan di public page

### Test 4: Contact Form
1. Buka `http://localhost:3000/contact`
2. Isi form dan submit
3. Buka CMS → Messages untuk lihat pesan yang masuk

### Test 5: Responsive Design
1. Buka browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test di berbagai ukuran: Mobile, Tablet, Desktop
4. Test CMS juga - sidebar harus jadi burger menu di mobile

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Auth**: JWT (jose)
- **Validation**: Zod

---

## 📞 Butuh Bantuan?

Jika ada masalah:
1. Cek dokumentasi di folder project
2. Lihat console/terminal untuk error messages
3. Pastikan Node.js versi 18+
4. Pastikan koneksi internet stabil (untuk database)

---

## ⚡ Pro Tips

1. **Auto-reload**: Next.js akan auto-reload saat kamu edit code
2. **Console**: Selalu cek browser console (F12) untuk debug
3. **Network**: Cek Network tab di DevTools untuk lihat API calls
4. **Database**: Data di database persistent, tidak hilang saat restart
5. **Hot Reload**: Kadang perlu hard refresh (Ctrl+Shift+R) jika CSS tidak update

---

## 🚀 Next Steps

Setelah aplikasi jalan:

1. ✅ Explore semua fitur di CMS
2. ✅ Coba CRUD operations (Create, Read, Update, Delete)
3. ✅ Test responsive design di berbagai device
4. ✅ Pelajari code structure di `src/` folder
5. ✅ Baca dokumentasi untuk detail implementasi

---

## 📝 Notes

- Database sudah diisi dengan data demo untuk testing
- CMS punya role-based access (admin & super_admin)
- Semua images disimpan di folder `public/assets/`
- Display order otomatis ter-normalize (1, 2, 3, 4...)
- Form validation menggunakan Zod schema

---

**Happy Coding! 🎉**

Last Updated: November 15, 2025  
Version: 1.2.0  
Status: Production Ready ✅
