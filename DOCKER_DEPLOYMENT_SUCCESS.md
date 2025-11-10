# ✅ Docker Deployment - SUCCESS GUIDE

## 📋 Summary

Docker container **BERHASIL** running dengan konfigurasi berikut:

### Container Info
- **Status**: ✅ Running
- **Port**: 3000:3000
- **Environment**: Production
- **Database**: Neon PostgreSQL (Connected)
- **Authentication**: Clerk (Configured)

---

## 🚀 Langkah-Langkah yang Sudah Dilakukan

### 1. ✅ Setup Database
```powershell
npm run db:test
```
**Result**: Database connection successful, CRUD operations working

### 2. ✅ Configure Environment Variables
File: `.env.production`
```bash
DATABASE_URL="postgresql://neondb_owner:***@ep-autumn-dream-a1o813be-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="tzjdocqIWk0mH28L0K6HUT7HAd6fgzeoIhXQeKYlz68="
NEXTAUTH_URL="https://40.81.26.137"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***
CLERK_SECRET_KEY=sk_test_***
```

### 3. ✅ Build Docker Image
```powershell
docker-compose --env-file .env.production up --build
```

### 4. ✅ Verify Application
```powershell
# Test endpoint
curl http://localhost:3000

# Result: HTTP 200 OK
# Company profile data loaded successfully
```

---

## 🎯 Commands yang BENAR untuk Docker Deployment

### Option 1: Menggunakan Docker Compose (RECOMMENDED)

```powershell
# Build dan run
docker-compose --env-file .env.production up --build

# Run di background
docker-compose --env-file .env.production up -d

# View logs
docker-compose --env-file .env.production logs -f

# Stop containers
docker-compose --env-file .env.production down
```

### Option 2: Manual Docker Build & Run

```powershell
# 1. Build image dengan environment variables
docker build `
  --build-arg DATABASE_URL="$env:DATABASE_URL" `
  --build-arg NEXTAUTH_SECRET="$env:NEXTAUTH_SECRET" `
  --build-arg NEXTAUTH_URL="$env:NEXTAUTH_URL" `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
  --build-arg CLERK_SECRET_KEY="$env:CLERK_SECRET_KEY" `
  -t company-profile:latest .

# 2. Run container
docker run -p 3000:3000 --env-file .env.production company-profile:latest
```

---

## 📊 Verification Checklist

### Local Testing

- [x] **Database Connection**: ✅ Connected to Neon PostgreSQL
- [x] **Container Build**: ✅ Built successfully dengan environment variables
- [x] **Container Running**: ✅ Running on port 3000
- [x] **HTTP Response**: ✅ 200 OK
- [x] **Company Profile Data**: ✅ Loaded from database (BRODO, products, etc.)
- [x] **Environment Variables**: ✅ All loaded correctly

### Endpoints to Test

Open browser dan test:

1. **Homepage**: http://localhost:3000
   - Expected: Landing page dengan Clerk authentication

2. **Company Profile**: http://localhost:3000/en/company-profile
   - Expected: Company profile dengan data dari database

3. **CMS Login**: http://localhost:3000/cms/login
   - Expected: CMS login form

4. **Sign In**: http://localhost:3000/sign-in
   - Expected: Clerk sign-in page

---

## 🔧 Troubleshooting

### Problem: Container tidak start

**Check logs**:
```powershell
docker-compose --env-file .env.production logs
```

**Check container status**:
```powershell
docker ps -a
```

### Problem: Database connection error

**Test database connection**:
```powershell
npm run db:test
```

**Verify DATABASE_URL** di `.env.production`

### Problem: Environment variables tidak ter-load

**Pastikan menggunakan flag `--env-file`**:
```powershell
docker-compose --env-file .env.production up
```

**JANGAN** gunakan:
```powershell
docker-compose up  # ❌ Tidak akan load .env.production
```

---

## 📦 Next Steps: Deploy to Azure

Setelah lokal berhasil, siap untuk deploy ke Azure:

### 1. Tag Image untuk Azure Container Registry

```powershell
# Login ke Azure
az login

# Tag image
$ACR_LOGIN_SERVER = "acrcompanyprofile.azurecr.io"
docker tag company-profile:latest "$ACR_LOGIN_SERVER/company-profile:latest"

# Push ke ACR
docker push "$ACR_LOGIN_SERVER/company-profile:latest"
```

### 2. Deploy ke Azure Container Apps

```powershell
# Deploy container app
az containerapp create `
  --name app-company-profile `
  --resource-group rg-company-profile `
  --environment env-company-profile `
  --image "$ACR_LOGIN_SERVER/company-profile:latest" `
  --target-port 3000 `
  --ingress external `
  --env-vars `
    "DATABASE_URL=secretref:database-url" `
    "NEXTAUTH_SECRET=secretref:nextauth-secret" `
    "NEXTAUTH_URL=https://yourdomain.com"
```

### 3. Configure Domain

Update DNS di Namecheap untuk point ke Azure Container Apps FQDN.

---

## 💡 Important Notes

### ⚠️ Before Building Docker Image

**SELALU** test database connection terlebih dahulu:
```powershell
npm run db:test
```

### ⚠️ Environment Variables

**PASTIKAN** semua environment variables yang diperlukan ada di `.env.production`:
- `DATABASE_URL` - Harus valid dan accessible
- `NEXTAUTH_SECRET` - Generated dengan secure random string
- `NEXTAUTH_URL` - URL production atau IP address
- Clerk keys (publishable dan secret)

### ⚠️ Docker Compose

**GUNAKAN** flag `--env-file .env.production` setiap kali menjalankan docker-compose:
```powershell
# ✅ BENAR
docker-compose --env-file .env.production up

# ❌ SALAH (tidak akan load env vars)
docker-compose up
```

---

## 🎉 Success Indicators

Aplikasi berhasil jika Anda melihat:

1. ✅ Container status: **Up**
2. ✅ HTTP response: **200 OK**
3. ✅ Company profile data ter-load di http://localhost:3000/en/company-profile
4. ✅ CMS accessible di http://localhost:3000/cms/login
5. ✅ Clerk authentication working di http://localhost:3000/sign-in

---

## 📞 Commands Reference

### Start Application
```powershell
docker-compose --env-file .env.production up -d
```

### View Logs
```powershell
docker-compose --env-file .env.production logs -f
```

### Stop Application
```powershell
docker-compose --env-file .env.production down
```

### Rebuild
```powershell
docker-compose --env-file .env.production up --build
```

### Remove Everything (Clean Start)
```powershell
docker-compose --env-file .env.production down -v
docker system prune -a
```

---

**🎊 CONGRATULATIONS! Docker deployment berhasil!**

Next: Proceed to Azure deployment mengikuti [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
