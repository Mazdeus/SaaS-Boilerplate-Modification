# 🚀 Panduan Deployment ke Azure dengan Docker dan Domain Namecheap

Panduan lengkap untuk men-deploy aplikasi Company Profile & CMS ke Azure menggunakan Docker dan menghubungkan dengan domain Namecheap agar dapat diakses secara online.

---

## 📋 Daftar Isi

1. [Prasyarat](#-prasyarat)
2. [Persiapan Database](#-persiapan-database)
3. [Persiapan Environment Variables](#-persiapan-environment-variables)
4. [Build & Test Docker Lokal](#-build--test-docker-lokal)
5. [Deploy ke Azure Container Registry](#-deploy-ke-azure-container-registry)
6. [Deploy ke Azure Container Apps](#-deploy-ke-azure-container-apps)
7. [Konfigurasi Domain Namecheap](#-konfigurasi-domain-namecheap)
8. [Konfigurasi SSL/HTTPS](#-konfigurasi-sslhttps)
9. [Testing & Verification](#-testing--verification)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Prasyarat

### Software yang Diperlukan
- [x] **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- [x] **Azure CLI** - [Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [x] **Node.js 20+** - untuk development lokal
- [x] **Git** - untuk version control

### Akun yang Diperlukan
- [x] **Azure Account** - [Daftar](https://azure.microsoft.com/free/)
  - Free tier tersedia dengan $200 kredit untuk 30 hari pertama
- [x] **Neon Database** - [Daftar](https://neon.tech)
  - Free tier: 0.5 GB storage, 1 project
- [x] **Namecheap Domain** - [Beli Domain](https://www.namecheap.com)
- [x] **Clerk** - [Daftar](https://clerk.com) - untuk authentication
- [x] (Optional) **Stripe** - untuk payment gateway

### Verifikasi Instalasi

```powershell
# Check Docker
docker --version
docker compose version

# Check Azure CLI
az --version

# Login ke Azure
az login

# Check Node.js
node --version
npm --version
```

---

## 🗄️ Persiapan Database

### 1. Setup Neon PostgreSQL Database

1. **Buat Account di Neon**
   - Kunjungi [https://neon.tech](https://neon.tech)
   - Daftar menggunakan GitHub atau email

2. **Buat Project Baru**
   - Klik "New Project"
   - Nama: `company-profile-db` (atau nama lain)
   - Region: Pilih yang terdekat (Singapore/Tokyo untuk Indonesia)
   - PostgreSQL Version: 16 (recommended)

3. **Dapatkan Connection String**
   - Setelah project dibuat, copy **Connection String**
   - Format: `postgresql://username:password@ep-xxx.region.aws.neon.tech/main?sslmode=require`
   - **Simpan connection string ini!** Akan digunakan nanti

4. **Setup Database Schema**
   
   Setelah mendapatkan connection string, setup database:

   ```powershell
   # Clone repository jika belum
   git clone <your-repo-url>
   cd SaaS-Boilerplate-Modification
   
   # Install dependencies
   npm install
   
   # Copy .env.example ke .env.local
   Copy-Item .env.example .env.local
   
   # Edit .env.local dan masukkan DATABASE_URL dari Neon
   # DATABASE_URL="postgresql://..."
   
   # Test koneksi database
   npm run db:test
   
   # Setup database schema dan initial data
   npm run db:setup
   ```

5. **Verifikasi Database**
   - Jalankan `npm run db:studio` untuk membuka Drizzle Studio
   - Periksa apakah tables sudah ter-create dengan benar
   - Cek data company profile sudah ada

---

## 🔐 Persiapan Environment Variables

### 1. Clerk Authentication Setup

1. **Buat Account Clerk**
   - Kunjungi [https://clerk.com](https://clerk.com)
   - Daftar dan buat aplikasi baru

2. **Konfigurasi Clerk**
   - Nama aplikasi: "Company Profile CMS"
   - Aktifkan: Email/Password authentication
   - Konfigurasi redirect URLs:
     - Sign-in URL: `/sign-in`
     - Sign-up URL: `/sign-up`
     - After sign-in: `/dashboard`

3. **Dapatkan API Keys**
   - Dashboard → API Keys
   - Copy **Publishable Key** dan **Secret Key**

### 2. NextAuth Setup (untuk CMS)

Generate NextAuth secret:

```powershell
# Menggunakan OpenSSL (jika terinstall)
openssl rand -base64 32

# Atau menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Buat File Environment Production

```powershell
# Copy template
Copy-Item .env.production.example .env.production

# Edit .env.production dengan nilai yang sesuai
```

**File `.env.production`** harus berisi:

```bash
# Database
DATABASE_URL="postgresql://user:pass@neon-host/main?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="<generated-secret-dari-step-2>"
NEXTAUTH_URL="https://yourdomain.com"

# Clerk - Production Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Optional: Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

⚠️ **PENTING**: 
- **JANGAN** commit file `.env.production` ke Git!
- File ini sudah ada di `.gitignore`

---

## 🐳 Build & Test Docker Lokal

### 1. Build Docker Image

```powershell
# Gunakan script otomatis (Recommended)
.\docker-build.ps1

# Atau manual build
docker build -t company-profile:latest .

# Verifikasi image berhasil dibuat
docker images | Select-String "company-profile"
```

### 2. Verifikasi Database Connection

Sebelum menjalankan container, **PASTIKAN** database sudah setup dengan benar:

```powershell
# Test koneksi database dengan credentials dari .env.production
# Install dependencies jika belum
npm install

# Test database connection
npm run db:test

# Jika berhasil, setup/migrate schema
npm run db:setup
```

**PENTING**: Database harus accessible dari Azure/production environment!

### 3. Test dengan Docker Compose (RECOMMENDED)

Gunakan `docker-compose` untuk memastikan semua environment variables dan dependencies ter-load dengan benar:

```powershell
# Build dan run dengan docker-compose
docker-compose up --build

# Atau run di background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

**Keuntungan menggunakan docker-compose**:
- ✅ Auto-load environment variables dari `.env.production`
- ✅ Health check otomatis
- ✅ Easy restart dan management
- ✅ Konsisten dengan production setup

### 4. Alternative: Test dengan Docker Run Manual

Jika ingin test tanpa docker-compose:

```powershell
# Manual run dengan env file
docker run -p 3000:3000 --env-file .env.production company-profile:latest

# Atau dengan environment variables explicit
docker run -p 3000:3000 `
  -e DATABASE_URL="your-database-url" `
  -e NEXTAUTH_SECRET="your-secret" `
  -e NEXTAUTH_URL="https://your-domain-or-ip" `
  company-profile:latest
```

**Note**: Anda mungkin melihat error `getaddrinfo EAI_AGAIN base` di logs. Ini adalah warning dari background process dan **tidak mempengaruhi** aplikasi. Aplikasi tetap berjalan normal selama Anda melihat pesan:
```
✓ Ready in XXXms
```

### 5. Test Aplikasi

Buka browser dan akses:

- **Company Profile**: http://localhost:3000/en/company-profile
- **CMS Login**: http://localhost:3000/cms/login
- **Dashboard**: http://localhost:3000/en/dashboard

Periksa:
- ✅ Halaman company profile tampil dengan data dari database
- ✅ CMS login berfungsi (gunakan credentials dari database)
- ✅ Dashboard bisa diakses setelah login
- ✅ Data dapat di-update melalui CMS
- ✅ **TIDAK ADA** database connection errors di logs
- ✅ **TIDAK ADA** environment variable errors

### 6. Troubleshooting Local Docker

**Problem: Database Connection Error**
```
Error: P1001: Can't reach database server
```
**Solusi**:
1. Pastikan DATABASE_URL di `.env.production` benar
2. Test connection: `npm run db:test`
3. Pastikan Neon database allow connections dari IP Anda
4. Check firewall settings

**Problem: Container Exits Immediately**
```powershell
# Check logs untuk error
docker-compose logs

# Atau untuk manual run
docker logs <container-id>
```

**Solusi**:
- Verify semua required environment variables ada
- Check syntax di `.env.production` (no extra spaces, quotes, etc.)
- Pastikan NEXTAUTH_SECRET dan CLERK_SECRET_KEY valid

### 7. Stop Container

```powershell
# Jika menggunakan docker-compose (RECOMMENDED)
docker-compose down

# Remove volumes jika perlu reset
docker-compose down -v

# Jika menggunakan docker run manual
docker ps  # Lihat container ID
docker stop <container-id>
docker rm <container-id>  # Remove container
```

---

## ☁️ Deploy ke Azure Container Registry

### 1. Login ke Azure

```powershell
# Login ke Azure account
az login

# Set subscription (jika punya multiple subscription)
az account list --output table
az account set --subscription "<subscription-id>"
```

### 2. Buat Resource Group

```powershell
# Buat resource group di region Southeast Asia
az group create `
  --name rg-company-profile `
  --location southeastasia

# Verifikasi
az group list --output table
```

### 3. Buat Azure Container Registry (ACR)

```powershell
# Buat ACR dengan SKU Basic
az acr create `
  --resource-group rg-company-profile `
  --name acrcompanyprofile `
  --sku Basic `
  --admin-enabled true

# Login ke ACR
az acr login --name acrcompanyprofile
```

> **Note**: Nama ACR harus unik secara global dan hanya huruf kecil + angka.

### 4. Tag dan Push Image

```powershell
# Get ACR login server
$ACR_LOGIN_SERVER = az acr show --name acrcompanyprofile --query loginServer --output tsv

# Tag image
docker tag company-profile:latest "$ACR_LOGIN_SERVER/company-profile:latest"
docker tag company-profile:latest "$ACR_LOGIN_SERVER/company-profile:v1.0.0"

# Push ke ACR
docker push "$ACR_LOGIN_SERVER/company-profile:latest"
docker push "$ACR_LOGIN_SERVER/company-profile:v1.0.0"

# Verifikasi
az acr repository list --name acrcompanyprofile --output table
az acr repository show-tags --name acrcompanyprofile --repository company-profile --output table
```

---

## 🌐 Deploy ke Azure Container Apps

### 1. Install Azure Container Apps Extension

```powershell
az extension add --name containerapp --upgrade
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

### 2. Buat Container Apps Environment

```powershell
# Buat Log Analytics workspace
az monitor log-analytics workspace create `
  --resource-group rg-company-profile `
  --workspace-name law-company-profile `
  --location southeastasia

# Get workspace ID dan key
$WORKSPACE_ID = az monitor log-analytics workspace show `
  --resource-group rg-company-profile `
  --workspace-name law-company-profile `
  --query customerId `
  --output tsv

$WORKSPACE_KEY = az monitor log-analytics workspace get-shared-keys `
  --resource-group rg-company-profile `
  --workspace-name law-company-profile `
  --query primarySharedKey `
  --output tsv

# Buat Container Apps environment
az containerapp env create `
  --name env-company-profile `
  --resource-group rg-company-profile `
  --location southeastasia `
  --logs-workspace-id $WORKSPACE_ID `
  --logs-workspace-key $WORKSPACE_KEY
```

### 3. Get ACR Credentials

```powershell
$ACR_USERNAME = az acr credential show `
  --name acrcompanyprofile `
  --query username `
  --output tsv

$ACR_PASSWORD = az acr credential show `
  --name acrcompanyprofile `
  --query "passwords[0].value" `
  --output tsv

$ACR_LOGIN_SERVER = az acr show `
  --name acrcompanyprofile `
  --query loginServer `
  --output tsv
```

### 4. Deploy Container App

```powershell
# Deploy dengan environment variables
az containerapp create `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --environment env-company-profile `
  --image "$ACR_LOGIN_SERVER/company-profile:latest" `
  --target-port 3000 `
  --ingress external `
  --registry-server $ACR_LOGIN_SERVER `
  --registry-username $ACR_USERNAME `
  --registry-password $ACR_PASSWORD `
  --cpu 1.0 `
  --memory 2.0Gi `
  --min-replicas 1 `
  --max-replicas 3 `
  --env-vars `
    "NODE_ENV=production" `
    "NEXT_TELEMETRY_DISABLED=1" `
  --secrets `
    "database-url=<YOUR_NEON_DATABASE_URL>" `
    "nextauth-secret=<YOUR_NEXTAUTH_SECRET>" `
    "clerk-secret=<YOUR_CLERK_SECRET_KEY>"
```

### 5. Set Environment Variables sebagai Secrets

Untuk keamanan yang lebih baik, gunakan secrets:

```powershell
# Update secrets
az containerapp secret set `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --secrets `
    "database-url=<YOUR_NEON_DATABASE_URL>" `
    "nextauth-secret=<YOUR_NEXTAUTH_SECRET>" `
    "clerk-secret=<YOUR_CLERK_SECRET_KEY>" `
    "stripe-secret=<YOUR_STRIPE_SECRET_KEY>"

# Update environment variables to reference secrets
az containerapp update `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --set-env-vars `
    "DATABASE_URL=secretref:database-url" `
    "NEXTAUTH_SECRET=secretref:nextauth-secret" `
    "CLERK_SECRET_KEY=secretref:clerk-secret" `
    "STRIPE_SECRET_KEY=secretref:stripe-secret" `
    "NEXTAUTH_URL=https://yourdomain.com" `
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>"
```

### 6. Get Application URL

```powershell
# Get FQDN (Fully Qualified Domain Name)
$APP_URL = az containerapp show `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --query properties.configuration.ingress.fqdn `
  --output tsv

Write-Host "Application URL: https://$APP_URL"
```

Test aplikasi dengan URL Azure:
- `https://<app-name>.southeastasia.azurecontainerapps.io`

---

## 🌍 Konfigurasi Domain Namecheap

### 1. Persiapan di Azure

#### Option A: Menggunakan Azure Container Apps Custom Domain (Recommended)

```powershell
# Add custom domain ke Container App
az containerapp hostname add `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname yourdomain.com

# Add www subdomain
az containerapp hostname add `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname www.yourdomain.com
```

Azure akan memberikan TXT record untuk verifikasi domain.

#### Option B: Menggunakan Azure Application Gateway (Advanced)

Untuk kontrol lebih detail, gunakan Application Gateway dengan static IP.

### 2. Konfigurasi di Namecheap

1. **Login ke Namecheap**
   - Buka [https://www.namecheap.com](https://www.namecheap.com)
   - Login ke account Anda
   - Pilih domain yang akan digunakan

2. **Setup DNS Records**
   
   **Pilih: Advanced DNS**

   Tambahkan records berikut:

   | Type  | Host | Value | TTL |
   |-------|------|-------|-----|
   | CNAME | @ | `<app-fqdn>` | Automatic |
   | CNAME | www | `<app-fqdn>` | Automatic |
   | TXT | asuid | `<verification-token>` | Automatic |

   **Contoh**:
   ```
   CNAME Record:
   - Host: @
   - Value: app-company-profile.southeastasia.azurecontainerapps.io
   - TTL: Automatic

   CNAME Record:
   - Host: www
   - Value: app-company-profile.southeastasia.azurecontainerapps.io
   - TTL: Automatic

   TXT Record (untuk verifikasi):
   - Host: asuid
   - Value: <token dari Azure>
   - TTL: Automatic
   ```

3. **Tunggu Propagasi DNS**
   - DNS propagation biasanya 5-30 menit
   - Kadang bisa sampai 24-48 jam

4. **Verifikasi DNS Propagation**

   ```powershell
   # Check DNS propagation
   nslookup yourdomain.com
   nslookup www.yourdomain.com
   
   # Atau gunakan online tools:
   # https://www.whatsmydns.net/
   ```

### 3. Verifikasi Domain di Azure

```powershell
# Bind certificate untuk domain
az containerapp hostname bind `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname yourdomain.com `
  --environment env-company-profile `
  --validation-method CNAME

# Untuk www subdomain
az containerapp hostname bind `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname www.yourdomain.com `
  --environment env-company-profile `
  --validation-method CNAME
```

---

## 🔒 Konfigurasi SSL/HTTPS

Azure Container Apps secara otomatis menyediakan SSL certificate gratis!

### 1. Automatic Managed Certificate

```powershell
# Azure akan otomatis provision Let's Encrypt certificate
# Verifikasi certificate status
az containerapp hostname list `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --output table
```

### 2. Update Environment Variables dengan Domain

```powershell
# Update NEXTAUTH_URL dengan domain production
az containerapp update `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --set-env-vars `
    "NEXTAUTH_URL=https://yourdomain.com"
```

### 3. Update Clerk Configuration

1. Login ke Clerk Dashboard
2. Settings → Domains
3. Tambahkan domain production: `yourdomain.com`
4. Update Authorized Redirect URLs:
   - `https://yourdomain.com/sign-in`
   - `https://yourdomain.com/sign-up`
   - `https://yourdomain.com/dashboard`

### 4. Force HTTPS Redirect

Aplikasi Next.js sudah menghandle HTTPS redirect otomatis. Verifikasi dengan:

```powershell
# Test HTTP redirect ke HTTPS
curl -I http://yourdomain.com
```

Should return `301 Moved Permanently` redirect ke `https://`

---

## ✅ Testing & Verification

### 1. Functional Testing

Test semua endpoint penting:

```powershell
# Test homepage
curl https://yourdomain.com

# Test company profile
curl https://yourdomain.com/en/company-profile

# Test CMS login page
curl https://yourdomain.com/cms/login

# Test API health (jika ada)
curl https://yourdomain.com/api/health
```

### 2. Manual Testing Checklist

Akses website dan test:

#### Company Profile Pages
- [ ] Homepage loads correctly
- [ ] `/en/company-profile` menampilkan data yang benar
- [ ] `/id/company-profile` (jika ada) menampilkan data bahasa Indonesia
- [ ] Images dan assets loading dengan benar
- [ ] Navigation berfungsi
- [ ] Responsive design pada mobile

#### CMS & Authentication
- [ ] `/cms/login` accessible
- [ ] Login dengan credentials berfungsi
- [ ] Redirect ke dashboard setelah login
- [ ] Dashboard menampilkan data dengan benar
- [ ] CRUD operations berfungsi:
  - [ ] Create new content
  - [ ] Read/View content
  - [ ] Update existing content
  - [ ] Delete content
- [ ] Logout berfungsi
- [ ] Session management bekerja

#### Performance & Security
- [ ] HTTPS berfungsi (lock icon di browser)
- [ ] SSL certificate valid
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] No console errors

### 3. Monitoring & Logs

```powershell
# View application logs
az containerapp logs show `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --follow

# View container app details
az containerapp show `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --output json

# Check revision status
az containerapp revision list `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --output table
```

### 4. Performance Testing

```powershell
# Test response time
Measure-Command { 
  Invoke-WebRequest -Uri "https://yourdomain.com" -UseBasicParsing 
}

# Load testing dengan simple script
for ($i=1; $i -le 10; $i++) {
  Invoke-WebRequest -Uri "https://yourdomain.com/en/company-profile" -UseBasicParsing
  Write-Host "Request $i completed"
}
```

---

## 🔄 Update & Deployment

### Melakukan Update Aplikasi

1. **Build Image Baru**

```powershell
# Build dengan version tag baru
docker build -t company-profile:v1.1.0 .

# Tag untuk ACR
$ACR_LOGIN_SERVER = az acr show --name acrcompanyprofile --query loginServer --output tsv
docker tag company-profile:v1.1.0 "$ACR_LOGIN_SERVER/company-profile:v1.1.0"
docker tag company-profile:v1.1.0 "$ACR_LOGIN_SERVER/company-profile:latest"

# Push ke ACR
docker push "$ACR_LOGIN_SERVER/company-profile:v1.1.0"
docker push "$ACR_LOGIN_SERVER/company-profile:latest"
```

2. **Update Container App**

```powershell
# Azure Container Apps akan auto-update jika image tag berubah
# Atau force update dengan revision baru
az containerapp update `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --image "$ACR_LOGIN_SERVER/company-profile:v1.1.0"
```

3. **Rollback jika Diperlukan**

```powershell
# List revisions
az containerapp revision list `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --output table

# Activate previous revision
az containerapp revision activate `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --revision <revision-name>
```

---

## 🔧 Troubleshooting

### Problem: Container Tidak Start

```powershell
# Check logs
az containerapp logs show `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --tail 100

# Check environment variables
az containerapp show `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --query "properties.template.containers[0].env"
```

**Solusi**:
- Pastikan semua environment variables ter-set dengan benar
- Verify DATABASE_URL accessible dari Azure
- Check image build berhasil

### Problem: Database Connection Failed

**Gejala**: Error "Connection refused" atau "timeout"

**Solusi**:
1. Verify DATABASE_URL format benar
2. Check Neon database aktif dan accessible
3. Test connection dari Azure:

```powershell
# Test database dari local
npm run db:test

# Check Neon database status di dashboard
```

### Problem: Domain Tidak Resolve

**Gejala**: Domain tidak bisa diakses, DNS tidak resolve

**Solusi**:
1. Tunggu DNS propagation (up to 48 hours)
2. Verify DNS records di Namecheap benar
3. Clear DNS cache:

```powershell
# Windows
ipconfig /flushdns

# Test DNS
nslookup yourdomain.com
```

### Problem: SSL Certificate Error

**Solusi**:
```powershell
# Re-bind hostname
az containerapp hostname delete `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname yourdomain.com

az containerapp hostname add `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --hostname yourdomain.com
```

### Problem: 500 Internal Server Error

**Solusi**:
1. Check application logs
2. Verify environment variables
3. Test image locally first
4. Check database migrations completed

### Problem: Memory/CPU Issues

```powershell
# Scale up resources
az containerapp update `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --cpu 2.0 `
  --memory 4.0Gi

# Scale replicas
az containerapp update `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --min-replicas 2 `
  --max-replicas 5
```

---

## 💰 Estimasi Biaya Azure

### Container Apps Pricing (Pay-as-you-go)

**Basic Configuration**:
- 1 vCPU, 2 GB RAM
- Running 24/7
- ~$30-50 USD/bulan

**Production Configuration**:
- 2 vCPU, 4 GB RAM
- Auto-scaling 1-3 replicas
- ~$100-150 USD/bulan

**Free Tier**:
- Azure Container Apps: 180,000 vCPU-seconds + 360,000 GiB-seconds per month free
- Cukup untuk low-traffic website

### Cost Optimization Tips

1. **Use consumption plan** - Bayar hanya saat ada traffic
2. **Configure auto-scaling** - Scale down saat traffic rendah
3. **Use Azure free tier** - Manfaatkan free credits
4. **Monitor usage** - Set budget alerts

```powershell
# Set budget alert
az consumption budget create `
  --budget-name company-profile-budget `
  --amount 50 `
  --time-grain Monthly `
  --resource-group rg-company-profile
```

---

## 📚 Resources & Links

### Official Documentation
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)

### Tools
- [Neon Database](https://neon.tech)
- [Clerk Authentication](https://clerk.com)
- [Namecheap DNS](https://www.namecheap.com/support/knowledgebase/category/10128/premium-dns/)

### Monitoring
- [Azure Portal](https://portal.azure.com)
- [Uptime Robot](https://uptimerobot.com) - Free uptime monitoring
- [Google Search Console](https://search.google.com/search-console) - SEO monitoring

---

## 🎉 Selamat!

Website Anda sekarang sudah online dan dapat diakses oleh siapa saja!

**URLs yang dapat diakses**:
- **Company Profile**: `https://yourdomain.com/en/company-profile`
- **CMS Login**: `https://yourdomain.com/cms/login`
- **Dashboard**: `https://yourdomain.com/en/dashboard` (after login)

### Next Steps

1. **Setup Monitoring**
   - Configure uptime monitoring
   - Setup error tracking (Sentry)
   - Enable analytics

2. **SEO Optimization**
   - Submit sitemap ke Google
   - Configure meta tags
   - Setup Google Analytics

3. **Security**
   - Regular security updates
   - Backup database regularly
   - Monitor access logs

4. **Performance**
   - Setup CDN untuk static assets
   - Optimize images
   - Enable caching

---

## 📞 Support

Jika mengalami masalah:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review Azure logs
3. Check database connectivity
4. Verify DNS configuration

**Happy Deploying! 🚀**
