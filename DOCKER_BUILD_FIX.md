# Docker Build Fix - Environment Variables

## Masalah yang Ditemukan

Ketika menjalankan `docker build -t company-profile:latest .`, terjadi error:

```
❌ Invalid environment variables: {
  STRIPE_SECRET_KEY: [ 'Required' ],
  STRIPE_WEBHOOK_SECRET: [ 'Required' ],
  BILLING_PLAN_ENV: [ 'Required' ],
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: [ 'Required' ],
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: [ 'Required' ]
}
```

## Penyebab

1. **Environment variables tidak di-pass ke Docker build**
   - Next.js build memvalidasi environment variables di `src/libs/Env.ts`
   - Beberapa variables di-mark sebagai `required` (`.min(1)`)
   - Docker build tidak punya akses ke `.env.production`

2. **Missing environment variables di .env.production**
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` tidak ada
   - Stripe variables di-mark required tapi tidak digunakan

## Solusi yang Diterapkan

### 1. Update `src/libs/Env.ts`
Ubah variables yang tidak critical menjadi optional:

```typescript
// Before
STRIPE_SECRET_KEY: z.string().min(1),
NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),

// After
STRIPE_SECRET_KEY: z.string().optional(),
NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
```

### 2. Update `.env.production`
Tambahkan missing Clerk URLs:

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Update `Dockerfile`
Tambahkan build arguments untuk pass environment variables:

```dockerfile
# Build arguments for environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Set environment variables for build
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ... etc
```

### 4. Buat Script `docker-build.ps1`
Script otomatis untuk load `.env.production` dan pass ke Docker build:

```powershell
# Load from .env.production
$DATABASE_URL = Get-EnvValue "DATABASE_URL"

# Build dengan build args
docker build `
    --build-arg DATABASE_URL="$DATABASE_URL" `
    --build-arg CLERK_SECRET_KEY="$CLERK_SECRET_KEY" `
    ...
    -t company-profile:latest .
```

## Cara Menggunakan

### Build Docker Image

```powershell
# Gunakan script (recommended)
.\docker-build.ps1

# Atau manual dengan build args
docker build `
    --build-arg DATABASE_URL="your-db-url" `
    --build-arg CLERK_SECRET_KEY="your-key" `
    -t company-profile:latest .
```

### Test Docker Locally

```powershell
# Gunakan script
.\docker-run.ps1

# Atau manual
docker run -p 3000:3000 --env-file .env.production company-profile:latest
```

## Files yang Diubah

1. ✅ `src/libs/Env.ts` - Made optional variables
2. ✅ `.env.production` - Added Clerk URLs
3. ✅ `Dockerfile` - Added build arguments
4. ✅ `docker-build.ps1` - New build script
5. ✅ `docker-run.ps1` - New run script

## Verification

Setelah build berhasil:

```powershell
# Check image ada
docker images | Select-String "company-profile"

# Test run
.\docker-run.ps1

# Test di browser
# http://localhost:3000
```

## Troubleshooting

### Jika masih error "Required environment variables"

1. Check `.env.production` ada dan terisi
2. Verify script load variables dengan benar
3. Check Docker build arguments di-pass

### Jika build timeout

1. Increase Docker resources (CPU/Memory)
2. Check internet connection
3. Clear Docker cache: `docker builder prune`

---

**Status**: ✅ FIXED  
**Date**: November 10, 2025  
**Build Method**: Use `.\docker-build.ps1`
