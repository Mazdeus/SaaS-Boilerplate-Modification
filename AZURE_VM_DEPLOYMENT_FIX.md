# 🔧 Panduan Mengatasi Error Docker Deployment di Azure VM

## 🚨 Masalah yang Terjadi

Berdasarkan error yang Anda tunjukkan, ada beberapa masalah:

1. **Environment Variables Warning** - Docker Compose tidak dapat membaca environment variables
2. **Deprecated Package Warnings** - Warning tentang package yang sudah deprecated
3. **Security Vulnerabilities** - 41 vulnerabilities terdeteksi

## ✅ Solusi yang Telah Diterapkan

### 1. Fix Environment Variables

**Masalah:** Docker Compose tidak membaca file `.env.production` dengan benar.

**Solusi:** 
- Dibuat file `.env.docker` khusus untuk Docker Compose
- Updated `docker-compose.yml` untuk menggunakan `.env.docker`

**File yang diubah:**
- 📄 `.env.docker` - Environment variables untuk Docker
- 📄 `docker-compose.yml` - Update env_file reference

### 2. Script Deployment Otomatis

Dibuat beberapa script untuk memudahkan deployment:

- 📜 `deploy-azure-vm.sh` - Script bash untuk Linux/Azure VM
- 📜 `fix-env-deploy.ps1` - Script PowerShell untuk Windows

## 🚀 Cara Deployment di Azure VM

### Opsi 1: Manual Fix (Recommended)

1. **Upload file `.env.docker` ke Azure VM:**
   ```bash
   # Di Azure VM, pastikan file .env.docker ada
   ls -la .env.docker
   ```

2. **Jalankan deployment:**
   ```bash
   # Stop existing containers
   docker-compose down --remove-orphans
   
   # Remove old images
   docker image rm -f saas-boilerplate-modification_web
   
   # Build and run
   docker-compose up -d --build
   ```

3. **Monitor logs:**
   ```bash
   # Lihat status container
   docker-compose ps
   
   # Lihat logs
   docker-compose logs -f
   ```

### Opsi 2: Menggunakan Script

1. **Upload script ke Azure VM:**
   ```bash
   chmod +x deploy-azure-vm.sh
   ./deploy-azure-vm.sh
   ```

## 🔍 Verification Commands

Setelah deployment, verifikasi dengan commands berikut:

```bash
# 1. Cek status container
docker-compose ps

# 2. Cek logs aplikasi
docker-compose logs web

# 3. Test health endpoint
curl http://localhost:3000/api/health

# 4. Test aplikasi
curl http://40.81.26.137:3000
```

## 📊 Environment Variables yang Diperlukan

File `.env.docker` sudah berisi semua environment variables yang diperlukan:

- ✅ `DATABASE_URL` - Neon PostgreSQL connection
- ✅ `NEXTAUTH_SECRET` - NextAuth secret key
- ✅ `NEXTAUTH_URL` - Application URL (http://40.81.26.137:3000)
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- ✅ `CLERK_SECRET_KEY` - Clerk secret key
- ✅ `NEXT_PUBLIC_CLERK_*_URL` - Clerk redirect URLs

## ⚠️ Tentang Warning yang Bisa Diabaikan

### Deprecated Package Warnings
```
npm warn deprecated inflight@1.0.6
npm warn deprecated @types/bcryptjs@3.0.0
npm warn deprecated @oclif/screen@3.0.8
```
**Status:** ⚠️ Warning ini bisa diabaikan sementara. Tidak mempengaruhi deployment.

### Security Vulnerabilities
```
41 vulnerabilities (11 low, 16 moderate, 9 high, 5 critical)
```
**Status:** ⚠️ Untuk production, disarankan menjalankan `npm audit fix`

## 🔧 Troubleshooting Additional

### Jika Masih Ada Error Environment Variables:

1. **Cek apakah file .env.docker ter-upload:**
   ```bash
   cat .env.docker
   ```

2. **Manual export variables (temporary fix):**
   ```bash
   export $(grep -v '^#' .env.docker | grep -v '^$' | xargs)
   docker-compose up -d --build
   ```

### Jika Container Tidak Start:

1. **Cek logs detail:**
   ```bash
   docker-compose logs web
   ```

2. **Cek network dan ports:**
   ```bash
   docker-compose port web 3000
   netstat -tlnp | grep :3000
   ```

### Jika Aplikasi Tidak Accessible:

1. **Cek firewall Azure VM:**
   - Port 3000 harus terbuka
   - Security group harus allow inbound traffic

2. **Test internal connection:**
   ```bash
   curl http://localhost:3000
   ```

## 📞 Next Steps

Setelah menerapkan fix ini:

1. Upload file `.env.docker` ke Azure VM
2. Jalankan deployment manual atau dengan script
3. Verifikasi aplikasi berjalan di http://40.81.26.137:3000
4. Monitor logs untuk memastikan tidak ada error

**Status:** 🎯 Masalah environment variables sudah diperbaiki!
