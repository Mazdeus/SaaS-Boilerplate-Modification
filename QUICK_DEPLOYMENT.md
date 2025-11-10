# ⚡ Quick Deployment Guide - Azure + Namecheap

Panduan singkat untuk deployment cepat. Untuk detail lengkap, lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🚀 Quick Start (30 Menit)

### 1. Prasyarat
```powershell
# Install & Login
choco install docker-desktop azure-cli  # atau download manual
az login
docker login
```

### 2. Setup Database
1. Buat account di [Neon.tech](https://neon.tech)
2. Copy connection string
3. Setup database:
```powershell
Copy-Item .env.example .env.local
# Edit .env.local, paste DATABASE_URL
npm install
npm run db:setup
```

### 3. Setup Environment
```powershell
# Copy dan edit .env.production
Copy-Item .env.production.example .env.production

# Edit dengan:
# - DATABASE_URL (dari Neon)
# - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
# - CLERK keys (dari clerk.com)
# - NEXTAUTH_URL=https://yourdomain.com
```

### 4. Build & Test Docker
```powershell
# Build
docker build -t company-profile:latest .

# Test lokal
docker run -p 3000:3000 --env-file .env.production company-profile:latest

# Test di http://localhost:3000
```

### 5. Deploy ke Azure
```powershell
# Variables
$RG = "rg-company-profile"
$ACR = "acrcompanyprofile"
$APP = "app-company-profile"
$LOCATION = "southeastasia"

# Create resources
az group create --name $RG --location $LOCATION
az acr create --resource-group $RG --name $ACR --sku Basic --admin-enabled true

# Push image
az acr login --name $ACR
$ACR_SERVER = az acr show --name $ACR --query loginServer --output tsv
docker tag company-profile:latest "$ACR_SERVER/company-profile:latest"
docker push "$ACR_SERVER/company-profile:latest"

# Get ACR credentials
$ACR_USER = az acr credential show --name $ACR --query username --output tsv
$ACR_PASS = az acr credential show --name $ACR --query "passwords[0].value" --output tsv

# Create Container Apps environment
az extension add --name containerapp --upgrade
az containerapp env create --name env-$APP --resource-group $RG --location $LOCATION

# Deploy app
az containerapp create `
  --name $APP `
  --resource-group $RG `
  --environment env-$APP `
  --image "$ACR_SERVER/company-profile:latest" `
  --target-port 3000 `
  --ingress external `
  --registry-server $ACR_SERVER `
  --registry-username $ACR_USER `
  --registry-password $ACR_PASS `
  --cpu 1.0 --memory 2.0Gi `
  --min-replicas 1 --max-replicas 3 `
  --secrets `
    "database-url=YOUR_NEON_DB_URL" `
    "nextauth-secret=YOUR_NEXTAUTH_SECRET" `
    "clerk-secret=YOUR_CLERK_SECRET_KEY" `
  --env-vars `
    "DATABASE_URL=secretref:database-url" `
    "NEXTAUTH_SECRET=secretref:nextauth-secret" `
    "CLERK_SECRET_KEY=secretref:clerk-secret" `
    "NEXTAUTH_URL=https://yourdomain.com" `
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUB_KEY" `
    "NODE_ENV=production"

# Get URL
az containerapp show --name $APP --resource-group $RG --query properties.configuration.ingress.fqdn
```

### 6. Setup Domain Namecheap
1. Login ke Namecheap
2. Pilih domain → Advanced DNS
3. Tambah records:
   ```
   Type: CNAME, Host: @, Value: <app-fqdn-dari-azure>
   Type: CNAME, Host: www, Value: <app-fqdn-dari-azure>
   ```
4. Tunggu 5-30 menit

5. Bind domain di Azure:
```powershell
az containerapp hostname add --name $APP --resource-group $RG --hostname yourdomain.com
az containerapp hostname add --name $APP --resource-group $RG --hostname www.yourdomain.com
```

### 7. Verifikasi ✅
- Company Profile: `https://yourdomain.com/en/company-profile`
- CMS Login: `https://yourdomain.com/cms/login`
- Dashboard: `https://yourdomain.com/en/dashboard`

---

## 🔄 Update Aplikasi

```powershell
# Build new version
docker build -t company-profile:v1.1.0 .

# Tag & Push
$ACR_SERVER = az acr show --name $ACR --query loginServer --output tsv
docker tag company-profile:v1.1.0 "$ACR_SERVER/company-profile:latest"
docker push "$ACR_SERVER/company-profile:latest"

# Update app (auto-deploy)
az containerapp update --name $APP --resource-group $RG --image "$ACR_SERVER/company-profile:latest"
```

---

## 🐛 Quick Troubleshooting

### App tidak start
```powershell
# Check logs
az containerapp logs show --name $APP --resource-group $RG --tail 50
```

### Database error
- Cek DATABASE_URL benar
- Test: `npm run db:test`
- Verify Neon DB active

### Domain tidak resolve
- Tunggu DNS propagation (up to 48h)
- Clear DNS: `ipconfig /flushdns`
- Test: `nslookup yourdomain.com`

### View all resources
```powershell
az resource list --resource-group $RG --output table
```

---

## 💡 Tips

1. **Testing lokal**: Selalu test Docker lokal sebelum deploy
2. **Environment vars**: Double-check semua secrets sudah benar
3. **DNS**: DNS propagation bisa sampai 24-48 jam
4. **Monitoring**: Setup uptime monitoring di [UptimeRobot](https://uptimerobot.com)
5. **Backup**: Backup database secara berkala
6. **SSL**: Azure auto-provision SSL certificate gratis

---

## 📋 Checklist Deployment

- [ ] Database setup di Neon
- [ ] Environment variables configured
- [ ] Docker image built & tested locally
- [ ] Azure resources created
- [ ] Image pushed to ACR
- [ ] Container App deployed
- [ ] Domain DNS configured
- [ ] Domain verified di Azure
- [ ] SSL certificate active
- [ ] Application tested online
- [ ] Clerk domain updated
- [ ] CMS login working

---

## 📞 Help

Detail lengkap: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Azure Portal: https://portal.azure.com
Neon Dashboard: https://console.neon.tech
Clerk Dashboard: https://dashboard.clerk.com
