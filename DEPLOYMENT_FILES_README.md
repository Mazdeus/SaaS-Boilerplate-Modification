# 📦 Deployment Files Overview

Dokumentasi lengkap untuk deployment website Company Profile & CMS ke Azure dengan Docker dan domain Namecheap.

---

## 📄 File-File Deployment yang Tersedia

### 1. **DEPLOYMENT_GUIDE.md** 📖
**Panduan Deployment Lengkap**

File utama dengan dokumentasi komprehensif untuk deployment.

**Isi:**
- ✅ Prasyarat lengkap (software, akun, tools)
- ✅ Setup database Neon PostgreSQL step-by-step
- ✅ Konfigurasi environment variables
- ✅ Docker build & testing lokal
- ✅ Deploy ke Azure Container Registry (ACR)
- ✅ Deploy ke Azure Container Apps
- ✅ Konfigurasi domain Namecheap
- ✅ Setup SSL/HTTPS otomatis
- ✅ Testing & verification
- ✅ Troubleshooting lengkap
- ✅ Estimasi biaya Azure
- ✅ Update & rollback procedures

**Untuk siapa:**
- Developer yang baru pertama kali deploy ke Azure
- Membutuhkan penjelasan detail setiap langkah
- Ingin memahami proses deployment secara mendalam

**Waktu baca:** ~20-30 menit  
**Waktu eksekusi:** ~2-3 jam (untuk pertama kali)

---

### 2. **QUICK_DEPLOYMENT.md** ⚡
**Panduan Deployment Cepat**

Reference singkat untuk deployment cepat tanpa penjelasan panjang.

**Isi:**
- ✅ Quick start commands
- ✅ One-liner setup scripts
- ✅ Minimal explanation
- ✅ Quick troubleshooting
- ✅ Deployment checklist singkat

**Untuk siapa:**
- Developer berpengalaman dengan Azure
- Sudah pernah deploy sebelumnya
- Butuh reference cepat

**Waktu baca:** ~5 menit  
**Waktu eksekusi:** ~30 menit

---

### 3. **DEPLOYMENT_CHECKLIST.md** ✅
**Checklist Deployment**

Daftar periksa untuk memastikan semua langkah deployment telah dilakukan.

**Isi:**
- ✅ Persiapan pre-deployment
- ✅ Database setup checklist
- ✅ Environment variables checklist
- ✅ Docker testing checklist
- ✅ Azure resources checklist
- ✅ Domain & SSL checklist
- ✅ Final testing checklist
- ✅ Post-deployment tasks
- ✅ Quick reference commands

**Untuk siapa:**
- Semua developer (beginner & advanced)
- Quality assurance
- Project manager
- Tracking progress deployment

**Cara pakai:** 
Print atau open di editor, centang setiap item yang sudah selesai.

---

### 4. **Dockerfile** 🐳
**Docker Image Configuration**

Multi-stage Dockerfile untuk build optimized production image.

**Features:**
- ✅ Multi-stage build (deps → builder → runner)
- ✅ Optimized image size
- ✅ Security best practices (non-root user)
- ✅ Next.js standalone output
- ✅ Production-ready configuration

**Stages:**
1. **deps** - Install dependencies only
2. **builder** - Build Next.js application
3. **runner** - Minimal runtime image

**Resulting image size:** ~200-300 MB

---

### 5. **.dockerignore** 📦
**Docker Build Optimization**

Mengurangi context size saat build Docker image.

**Excludes:**
- node_modules (akan di-install fresh)
- .next, out, build (akan di-generate)
- .env files (security)
- Testing files
- Documentation
- Git files

**Benefits:**
- ⚡ Faster build time
- 💾 Smaller image size
- 🔒 Better security

---

### 6. **docker-compose.yml** 🐙
**Local Docker Testing**

Untuk test production build di local sebelum deploy.

**Features:**
- ✅ Production environment simulation
- ✅ Environment variable loading
- ✅ Health check configuration
- ✅ Auto-restart policy
- ✅ Port mapping

**Usage:**
```bash
docker-compose up        # Start
docker-compose down      # Stop
docker-compose logs -f   # View logs
```

---

### 7. **.env.production.example** 🔐
**Production Environment Template**

Template untuk environment variables production.

**Contains:**
- DATABASE_URL (Neon PostgreSQL)
- NEXTAUTH_SECRET & NEXTAUTH_URL
- Clerk authentication keys
- Stripe payment keys (optional)
- Other production settings

**Instructions:**
```bash
# 1. Copy template
cp .env.production.example .env.production

# 2. Fill in values
# 3. NEVER commit .env.production to Git!
```

---

### 8. **deploy.ps1** 🚀
**Automated Deployment Script**

PowerShell script untuk automated deployment ke Azure.

**Features:**
- ✅ One-command deployment
- ✅ Prerequisite checking
- ✅ Color-coded output
- ✅ Error handling
- ✅ Progress tracking
- ✅ Auto resource creation
- ✅ Environment variable loading

**Usage:**
```powershell
# Full deployment
.\deploy.ps1

# Custom parameters
.\deploy.ps1 -ResourceGroup "my-rg" -Location "eastasia"
```

**Steps automated:**
1. Check prerequisites
2. Create Resource Group
3. Create ACR
4. Build & push Docker image
5. Create Container Apps environment
6. Deploy application
7. Configure environment variables
8. Show deployment summary

**Waktu eksekusi:** ~15-20 menit

---

### 9. **src/app/api/health/route.ts** ❤️
**Health Check Endpoint**

API endpoint untuk monitoring container health.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T...",
  "uptime": 12345,
  "environment": "production"
}
```

**Used by:**
- Azure Container Apps health probes
- Uptime monitoring services (UptimeRobot, etc.)
- Load balancer health checks

---

### 10. **next.config.mjs** (Updated) ⚙️
**Next.js Configuration**

Updated dengan `output: 'standalone'` untuk Docker deployment.

**Key change:**
```javascript
output: 'standalone',  // Enable standalone output for Docker
```

**Why needed:**
- Generates self-contained build
- Reduces production image size
- Only includes necessary files
- Required for containerized deployment

---

## 🚀 Quick Start Guide

### Pertama Kali Deploy:

1. **Baca dokumentasi lengkap:**
   ```
   📖 DEPLOYMENT_GUIDE.md (20-30 min)
   ```

2. **Siapkan environment:**
   - Setup database di Neon
   - Configure `.env.production`
   - Test Docker lokal

3. **Deploy dengan script:**
   ```powershell
   .\deploy.ps1
   ```

4. **Ikuti checklist:**
   ```
   ✅ DEPLOYMENT_CHECKLIST.md
   ```

### Deploy Berikutnya:

1. **Quick reference:**
   ```
   ⚡ QUICK_DEPLOYMENT.md (5 min)
   ```

2. **Update & redeploy:**
   ```powershell
   .\deploy.ps1
   ```

---

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Phase                        │
├─────────────────────────────────────────────────────────────┤
│  1. Setup Database (Neon)                                   │
│  2. Configure .env.production                               │
│  3. Test locally: npm run dev                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Docker Testing                            │
├─────────────────────────────────────────────────────────────┤
│  4. Build: docker build -t company-profile .                │
│  5. Test: docker run -p 3000:3000 ...                       │
│  6. Verify: http://localhost:3000                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Azure Deployment                          │
├─────────────────────────────────────────────────────────────┤
│  7. Run: .\deploy.ps1                                       │
│  8. Wait for completion (15-20 min)                         │
│  9. Get Azure URL                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Configuration                      │
├─────────────────────────────────────────────────────────────┤
│ 10. Configure Namecheap DNS                                 │
│ 11. Add custom domain in Azure                              │
│ 12. Wait for SSL certificate                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Final Verification                        │
├─────────────────────────────────────────────────────────────┤
│ 13. Test: https://yourdomain.com                            │
│ 14. Verify all features working                             │
│ 15. Complete checklist                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 URLs Setelah Deployment

### Development
```
Local: http://localhost:3000
Company Profile: http://localhost:3000/en/company-profile
CMS Login: http://localhost:3000/cms/login
```

### Azure (Before Custom Domain)
```
App URL: https://app-company-profile.southeastasia.azurecontainerapps.io
Company Profile: https://app-company-profile.southeastasia.azurecontainerapps.io/en/company-profile
CMS Login: https://app-company-profile.southeastasia.azurecontainerapps.io/cms/login
```

### Production (After Domain Setup)
```
Website: https://yourdomain.com
Company Profile: https://yourdomain.com/en/company-profile
CMS Login: https://yourdomain.com/cms/login
Dashboard: https://yourdomain.com/en/dashboard
Health Check: https://yourdomain.com/api/health
```

---

## 🔐 Security Notes

### ⚠️ PENTING - File yang TIDAK BOLEH di-commit:

- ❌ `.env.production` - Contains production secrets
- ❌ `.env.local` - Contains local development secrets
- ❌ Any file with actual passwords/keys

### ✅ File yang AMAN di-commit:

- ✅ `.env.example` - Template only
- ✅ `.env.production.example` - Template only
- ✅ All `.md` documentation files
- ✅ `Dockerfile`, `docker-compose.yml`
- ✅ `deploy.ps1` (no secrets)

**Verify `.gitignore` includes:**
```
.env*.local
.env.production
```

---

## 💡 Tips & Best Practices

### 1. **Version Control**
- Gunakan Git tags untuk setiap deployment
- Commit sebelum deploy
- Document changes di CHANGELOG

### 2. **Testing**
- Selalu test Docker build lokal dulu
- Verify semua environment variables
- Test health check endpoint

### 3. **Monitoring**
- Setup uptime monitoring (UptimeRobot)
- Configure Azure alerts
- Monitor logs regularly

### 4. **Backup**
- Backup database secara berkala
- Document all configurations
- Keep deployment logs

### 5. **Updates**
- Build dengan version tags
- Test updates di local first
- Keep rollback plan ready

---

## 📞 Support & Resources

### Documentation
- **Main Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Quick Ref:** [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### External Resources
- [Azure Container Apps Docs](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/)

### Dashboards
- [Azure Portal](https://portal.azure.com)
- [Neon Database](https://console.neon.tech)
- [Clerk Auth](https://dashboard.clerk.com)

---

## 🎉 Success!

Dengan file-file deployment ini, Anda dapat:

✅ Deploy aplikasi ke Azure dengan mudah  
✅ Menggunakan Docker untuk containerization  
✅ Setup custom domain dari Namecheap  
✅ Automatic SSL/HTTPS  
✅ Production-ready configuration  
✅ Easy monitoring & maintenance  

**Happy Deploying! 🚀**

---

*Last Updated: November 2025*  
*Version: 1.0.0*
