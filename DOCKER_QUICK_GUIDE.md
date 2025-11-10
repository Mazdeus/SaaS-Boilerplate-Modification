# 🐳 Quick Docker Guide

## Masalah yang Sudah Diperbaiki ✅

Error saat `docker build` karena missing environment variables **sudah diperbaiki**.

## Cara Build Docker Image

### Option 1: Menggunakan Script (Recommended) ⭐

```powershell
# Build image
.\docker-build.ps1

# Test locally
.\docker-run.ps1
```

### Option 2: Manual

```powershell
# Build dengan pass environment variables
docker build `
    --build-arg DATABASE_URL="$env:DATABASE_URL" `
    --build-arg CLERK_SECRET_KEY="$env:CLERK_SECRET_KEY" `
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
    --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in" `
    --build-arg NEXTAUTH_SECRET="$env:NEXTAUTH_SECRET" `
    --build-arg NEXTAUTH_URL="http://localhost:3000" `
    -t company-profile:latest .

# Run
docker run -p 3000:3000 --env-file .env.production company-profile:latest
```

## File Penting

- ✅ `.env.production` - Environment variables production (SUDAH ADA)
- ✅ `Dockerfile` - Docker configuration (SUDAH DIUPDATE)
- ✅ `docker-build.ps1` - Build script otomatis (BARU)
- ✅ `docker-run.ps1` - Run script untuk testing (BARU)
- ✅ `src/libs/Env.ts` - Made Stripe variables optional (SUDAH DIUPDATE)

## Test URLs

Setelah container running, test di:
- http://localhost:3000
- http://localhost:3000/en/company-profile
- http://localhost:3000/cms/login

## Troubleshooting

### Build Error: "Invalid environment variables"
✅ Sudah diperbaiki dengan script `docker-build.ps1`

### Build Timeout
- Increase Docker Desktop resources (Settings → Resources)
- Clear cache: `docker builder prune`

### Container tidak start
- Check logs: `docker logs <container-id>`
- Verify .env.production terisi dengan benar

## Next Steps

1. ✅ Build berhasil dengan `.\docker-build.ps1`
2. Test lokal dengan `.\docker-run.ps1`
3. Deploy ke Azure dengan `.\deploy.ps1`

---

**Detail lengkap**: Lihat [DOCKER_BUILD_FIX.md](./DOCKER_BUILD_FIX.md)
