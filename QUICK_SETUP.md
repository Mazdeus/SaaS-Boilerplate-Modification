# 🚀 Quick Setup Guide - Database Integration

> **Target:** Teman-teman yang belum integrasi dengan PostgreSQL Neon

## ⚡ TL;DR - Quick Steps

### 1. Buat Neon Database (5 menit)
```bash
1. Daftar di: https://console.neon.tech
2. Create project → pilih region Singapore
3. Copy connection string
```

### 2. Setup Environment (2 menit)
```bash
# Clone & install
git pull origin main
npm install @neondatabase/serverless

# Buat .env.local
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### 3. Setup Database (2 menit)
```bash
# Test koneksi
npm run db:test

# Setup complete
npm run db:setup

# Validasi
npm run db:validate
```

### 4. Start Development
```bash
npm run dev
# ✅ Database ready!
```

---

## 🆘 Common Issues & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| `MODULE_NOT_FOUND @neondatabase/serverless` | `npm install @neondatabase/serverless` |
| `DATABASE_URL not found` | Check `.env.local` exists and format correct |
| `Connection failed` | Copy fresh connection string from Neon dashboard |
| `Permission denied` | Check Neon project is active, regenerate password |

---

## 📋 Verification Checklist

- [ ] Neon account created
- [ ] Project created with Singapore region
- [ ] CONNECTION_STRING copied
- [ ] `.env.local` file created with correct DATABASE_URL
- [ ] `@neondatabase/serverless` installed
- [ ] `npm run db:test` shows ✅ Connection successful
- [ ] `npm run db:setup` shows ✅ DATABASE SETUP COMPLETED
- [ ] `npm run db:validate` shows ✅ VALIDATION PASSED
- [ ] `npm run dev` starts successfully
- [ ] `npm run db:studio` opens database GUI

---

## 📞 Support

**Kalau stuck:** Share error message + screenshot ke grup chat

**Full tutorial:** Baca `DATABASE_SETUP_TUTORIAL.md` untuk panduan lengkap
