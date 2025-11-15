# Setup Production Environment Variables

## Overview
File `.env.production` berisi kredensial rahasia untuk production. File ini **TIDAK boleh di-commit** ke Git.

## Quick Setup

### 1. Generate JWT Secret
```bash
# Di local machine atau di Azure VM
openssl rand -base64 32
```

Contoh output:
```
a8f5f167f44f4964e6c998dee827110c
```

### 2. Setup di Local (untuk testing)

Copy dari template:
```bash
cp .env.production.example .env.production
```

Edit `.env.production` dan isi:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/brodo_cms?schema=public"
JWT_SECRET="PASTE_YOUR_GENERATED_SECRET_HERE"
NODE_ENV=production
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Setup di Azure VM

**a. Upload template ke VM:**
```bash
scp .env.production.example user@40.81.26.137:~/brodo-cms/.env.production
```

**b. SSH ke VM dan edit:**
```bash
ssh user@40.81.26.137
cd ~/brodo-cms
nano .env.production
```

**c. Isi dengan nilai production:**
```bash
DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host:5432/brodo_cms?schema=public"
JWT_SECRET="a8f5f167f44f4964e6c998dee827110c"  # Hasil dari openssl rand -base64 32
NODE_ENV=production
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"  # Atau domain Anda
```

## Environment Variables Explained

### DATABASE_URL (Required)
Connection string ke PostgreSQL database Anda.

**Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

**Example:**
```
postgresql://admin:SecurePass123@db-server.postgres.database.azure.com:5432/brodo_cms?schema=public
```

### JWT_SECRET (Required)
Secret key untuk signing JWT tokens di CMS authentication.

**Penting:**
- Minimal 32 karakter
- Gunakan random generator (jangan buat manual)
- **JANGAN SHARE** secret ini dengan siapapun
- Jika secret berubah, semua user harus login ulang

**Generate:**
```bash
openssl rand -base64 32
```

**Catatan:** Jika Anda ingin JWT token dari local bisa digunakan di production (atau sebaliknya), gunakan JWT_SECRET yang **sama** di `.env.local` dan `.env.production`.

### NODE_ENV (Required)
Harus di-set ke `production` untuk production deployment.

```bash
NODE_ENV=production
```

### NEXT_PUBLIC_API_URL (Required)
Base URL untuk API calls dari frontend.

**Production:**
```bash
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"
```

**Atau dengan custom domain:**
```bash
NEXT_PUBLIC_API_URL="https://brodo.yourdomain.com"
```

## Security Checklist

✅ `.env.production` ada di `.gitignore`  
✅ JWT_SECRET di-generate secara random  
✅ DATABASE_URL menggunakan password yang kuat  
✅ File `.env.production` memiliki permission 600 di server  

**Set file permission di Azure VM:**
```bash
chmod 600 .env.production
```

## Troubleshooting

### Problem: CMS login tidak berfungsi
**Solution:** Pastikan `JWT_SECRET` di `.env.production` sama dengan yang di `.env.local` (jika Anda ingin share sessions).

### Problem: Database connection error
**Solution:** 
1. Cek `DATABASE_URL` format nya benar
2. Pastikan database accessible dari Azure VM
3. Test koneksi: `psql "postgresql://user:pass@host:5432/dbname"`

### Problem: API calls dari frontend gagal
**Solution:** Pastikan `NEXT_PUBLIC_API_URL` sesuai dengan domain/IP Azure VM Anda.

## Files Structure

```
brodo-cms/
├── .env.local               # Local development (Git ignored)
├── .env.production          # Production secrets (Git ignored) ⚠️
├── .env.production.example  # Template for production (Committed to Git) ✓
└── docker-compose.yml       # Reads .env.production
```

## Best Practices

1. **Never commit** `.env.production` dengan nilai sebenarnya
2. **Always use** `.env.production.example` sebagai template
3. **Rotate** JWT_SECRET secara berkala (setiap 3-6 bulan)
4. **Backup** `.env.production` di secure location (password manager)
5. **Different secrets** untuk production vs development

## Example Workflow

**Developer A setup production:**
```bash
# Generate secret
openssl rand -base64 32
# Output: xyz123abc456...

# Create .env.production
cp .env.production.example .env.production
nano .env.production  # Isi JWT_SECRET=xyz123abc456...

# Share secret securely dengan Developer B (via password manager/Signal/etc)
```

**Developer B setup local:**
```bash
# Receive secret from Developer A securely
# Create .env.local
cp .env.local.example .env.local
nano .env.local  # Isi JWT_SECRET yang sama: xyz123abc456...
```

Now both can login to CMS with same credentials!
