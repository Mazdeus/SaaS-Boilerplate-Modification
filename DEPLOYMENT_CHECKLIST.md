# 📋 Deployment Checklist - Azure dengan Docker & Namecheap

Gunakan checklist ini untuk memastikan semua langkah deployment telah dilakukan dengan benar.

---

## 🔧 Persiapan (Pre-Deployment)

### Software & Tools
- [ ] Docker Desktop terinstall dan running
- [ ] Azure CLI terinstall (`az --version`)
- [ ] Node.js 20+ terinstall
- [ ] Git terinstall
- [ ] Login ke Azure (`az login`)

### Akun & Services
- [ ] Azure account aktif (dengan free credits jika baru)
- [ ] Neon Database account ([neon.tech](https://neon.tech))
- [ ] Clerk account ([clerk.com](https://clerk.com))
- [ ] Namecheap domain terbeli
- [ ] (Optional) Stripe account untuk payment

---

## 🗄️ Database Setup

- [ ] Login ke Neon.tech
- [ ] Buat project PostgreSQL baru
- [ ] Copy connection string dari Neon
- [ ] Save connection string (format: `postgresql://user:pass@host/db?sslmode=require`)
- [ ] Copy `.env.example` ke `.env.local`
- [ ] Paste DATABASE_URL ke `.env.local`
- [ ] Run `npm install`
- [ ] Run `npm run db:test` - ✅ Connection successful
- [ ] Run `npm run db:setup` - ✅ Database initialized
- [ ] Verify database di Drizzle Studio (`npm run db:studio`)
- [ ] Cek tables ter-create dengan benar
- [ ] Cek data company profile ada

---

## 🔐 Environment Variables Setup

### Development (.env.local)
- [ ] `DATABASE_URL` terisi dengan Neon connection string
- [ ] Test aplikasi lokal (`npm run dev`)
- [ ] Akses http://localhost:3000 - ✅ Berfungsi

### Production (.env.production)
- [ ] Copy `.env.production.example` ke `.env.production`
- [ ] `DATABASE_URL` - Same dengan Neon production database
- [ ] `NEXTAUTH_SECRET` - Generate dengan `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Set ke `https://yourdomain.com` (domain production)
- [ ] `CLERK_SECRET_KEY` - Production key dari Clerk dashboard
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Production publishable key
- [ ] (Optional) `STRIPE_SECRET_KEY` - Jika menggunakan Stripe
- [ ] Verify file `.env.production` TIDAK di-commit ke Git

---

## 🐳 Docker Testing

### Local Docker Build
- [ ] Build image: `docker build -t company-profile:latest .`
- [ ] Image berhasil di-build tanpa error
- [ ] Run container: `docker run -p 3000:3000 --env-file .env.production company-profile:latest`
- [ ] Container start tanpa error
- [ ] Test http://localhost:3000
- [ ] Test http://localhost:3000/en/company-profile - ✅ Data tampil
- [ ] Test http://localhost:3000/cms/login - ✅ Login page tampil
- [ ] Stop container: `docker stop <container-id>`

---

## ☁️ Azure Resource Creation

### Resource Group
- [ ] Login: `az login`
- [ ] Create resource group: `az group create --name rg-company-profile --location southeastasia`
- [ ] Verify: `az group list --output table`

### Azure Container Registry (ACR)
- [ ] Create ACR: `az acr create --resource-group rg-company-profile --name acrcompanyprofile --sku Basic --admin-enabled true`
- [ ] Login to ACR: `az acr login --name acrcompanyprofile`
- [ ] Get ACR login server
- [ ] Tag image untuk ACR
- [ ] Push image ke ACR: `docker push <acr-server>/company-profile:latest`
- [ ] Verify image di ACR: `az acr repository list --name acrcompanyprofile`

### Container Apps Environment
- [ ] Install extension: `az extension add --name containerapp --upgrade`
- [ ] Register providers
- [ ] Create Log Analytics workspace
- [ ] Create Container Apps environment
- [ ] Verify environment created

---

## 🚀 Application Deployment

### Container App Creation
- [ ] Get ACR credentials (username & password)
- [ ] Prepare all environment variables
- [ ] Create container app dengan command atau script
- [ ] Wait for deployment completion (5-10 menit)
- [ ] Check deployment status
- [ ] Get application FQDN/URL
- [ ] Save Azure URL: `https://<app-name>.southeastasia.azurecontainerapps.io`

### Initial Testing
- [ ] Access Azure URL di browser
- [ ] Test company profile page
- [ ] Test CMS login
- [ ] Check logs: `az containerapp logs show --name app-company-profile --resource-group rg-company-profile`
- [ ] Verify no errors in logs

---

## 🌍 Domain Configuration

### Namecheap Setup
- [ ] Login ke Namecheap account
- [ ] Pilih domain yang akan digunakan
- [ ] Go to Advanced DNS
- [ ] Tambah CNAME record untuk root (@) → Azure FQDN
- [ ] Tambah CNAME record untuk www → Azure FQDN
- [ ] Tambah TXT record untuk verification (asuid)
- [ ] Save DNS records
- [ ] Screenshot konfigurasi DNS untuk referensi

### Azure Custom Domain
- [ ] Add hostname: `az containerapp hostname add --name app-company-profile --resource-group rg-company-profile --hostname yourdomain.com`
- [ ] Add www subdomain
- [ ] Get verification token dari Azure
- [ ] Verify domain ownership
- [ ] Wait for DNS propagation (5 menit - 48 jam)
- [ ] Test DNS: `nslookup yourdomain.com`
- [ ] Clear local DNS cache: `ipconfig /flushdns`

---

## 🔒 SSL & Security

### SSL Certificate
- [ ] Azure auto-provision SSL certificate
- [ ] Verify certificate status
- [ ] Check certificate in browser (lock icon)
- [ ] Test HTTPS: `https://yourdomain.com`
- [ ] Test HTTP redirect to HTTPS

### Update Application URLs
- [ ] Update NEXTAUTH_URL environment variable ke production domain
- [ ] Restart/redeploy container app
- [ ] Verify env vars updated

### Clerk Configuration Update
- [ ] Login to Clerk Dashboard
- [ ] Settings → Domains
- [ ] Add production domain: `yourdomain.com`
- [ ] Update Authorized Origins: `https://yourdomain.com`
- [ ] Update Redirect URLs:
  - [ ] `https://yourdomain.com/sign-in`
  - [ ] `https://yourdomain.com/sign-up`
  - [ ] `https://yourdomain.com/dashboard`
- [ ] Save Clerk settings

---

## ✅ Final Testing & Verification

### Functional Testing
- [ ] Homepage: `https://yourdomain.com` - ✅
- [ ] Company Profile EN: `https://yourdomain.com/en/company-profile` - ✅
- [ ] Company Profile ID: `https://yourdomain.com/id/company-profile` - ✅
- [ ] CMS Login: `https://yourdomain.com/cms/login` - ✅
- [ ] Login dengan credentials - ✅
- [ ] Dashboard accessible setelah login - ✅
- [ ] CRUD operations di CMS - ✅
- [ ] Logout berfungsi - ✅

### Performance Testing
- [ ] Page load time < 3 detik
- [ ] Images loading dengan benar
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Different browsers tested (Chrome, Firefox, Safari)

### Security Testing
- [ ] HTTPS aktif (lock icon)
- [ ] SSL certificate valid
- [ ] HTTP redirect ke HTTPS
- [ ] Authentication berfungsi
- [ ] Authorization/permissions bekerja
- [ ] Sensitive data tidak exposed

### API & Health Check
- [ ] Health check endpoint: `https://yourdomain.com/api/health` - ✅
- [ ] Response time acceptable
- [ ] Status code 200

---

## 📊 Monitoring & Maintenance

### Setup Monitoring
- [ ] Azure Portal bookmarked
- [ ] Container logs accessible
- [ ] Setup uptime monitoring (e.g., UptimeRobot)
- [ ] Configure email alerts
- [ ] Set budget alerts di Azure

### Documentation
- [ ] Document all credentials (securely!)
- [ ] Save connection strings
- [ ] Document domain configuration
- [ ] Save Azure resource names
- [ ] Create runbook for common tasks

### Backup & Recovery
- [ ] Database backup strategy defined
- [ ] Backup schedule configured di Neon
- [ ] Test database restore procedure
- [ ] Document rollback procedure

---

## 🎯 Post-Deployment Tasks

### SEO & Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Setup Google Analytics (jika diperlukan)
- [ ] Configure meta tags
- [ ] Verify Open Graph tags
- [ ] Test social media sharing

### Performance Optimization
- [ ] Enable CDN untuk static assets (jika perlu)
- [ ] Optimize images
- [ ] Configure caching headers
- [ ] Run Lighthouse audit
- [ ] Fix performance issues

### User Communication
- [ ] Update documentation dengan production URLs
- [ ] Inform users/stakeholders
- [ ] Provide login instructions
- [ ] Create user guide untuk CMS

---

## 📝 Quick Reference

### Important URLs
```
Production Site: https://yourdomain.com
Company Profile: https://yourdomain.com/en/company-profile
CMS Login: https://yourdomain.com/cms/login
Dashboard: https://yourdomain.com/en/dashboard
Health Check: https://yourdomain.com/api/health

Azure Portal: https://portal.azure.com
Neon Dashboard: https://console.neon.tech
Clerk Dashboard: https://dashboard.clerk.com
Namecheap: https://www.namecheap.com
```

### Resource Names
```
Resource Group: rg-company-profile
ACR: acrcompanyprofile
Container App: app-company-profile
Environment: env-app-company-profile
Location: southeastasia
```

### Useful Commands
```powershell
# View logs
az containerapp logs show --name app-company-profile --resource-group rg-company-profile --follow

# Restart app
az containerapp revision restart --name app-company-profile --resource-group rg-company-profile

# Update app
az containerapp update --name app-company-profile --resource-group rg-company-profile

# View all resources
az resource list --resource-group rg-company-profile --output table
```

---

## ✨ Success Criteria

Deployment dianggap sukses jika:

- ✅ Website accessible di `https://yourdomain.com`
- ✅ SSL certificate valid dan HTTPS berfungsi
- ✅ Company Profile page tampil dengan data yang benar
- ✅ CMS login berfungsi
- ✅ Dashboard accessible setelah login
- ✅ CRUD operations di CMS bekerja
- ✅ No console errors
- ✅ Performance acceptable (load time < 3s)
- ✅ Mobile responsive
- ✅ Authentication & authorization bekerja

---

## 📞 Troubleshooting Quick Links

Jika ada masalah:

1. ✅ Check [DEPLOYMENT_GUIDE.md - Troubleshooting Section](./DEPLOYMENT_GUIDE.md#-troubleshooting)
2. ✅ View Azure logs
3. ✅ Check database connectivity
4. ✅ Verify DNS configuration
5. ✅ Review environment variables

---

**Date Completed**: _______________

**Deployed By**: _______________

**Notes**: 
```
[Add any notes, issues encountered, or special configurations here]
```

---

🎉 **Congratulations on successful deployment!**
