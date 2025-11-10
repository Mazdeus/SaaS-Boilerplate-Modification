# ===================================================================
# Script PowerShell untuk fix semua warning dan error
# ===================================================================

Write-Host "🔧 Fixing Docker Build Issues..." -ForegroundColor Green

# 1. Update browserslist database
Write-Host "`n📋 Updating browserslist database..." -ForegroundColor Yellow
try {
    npx update-browserslist-db@latest
    Write-Host "✅ Browserslist database updated" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Could not update browserslist database" -ForegroundColor Yellow
}

# 2. Fix npm audit issues (non-breaking only)
Write-Host "`n🔒 Fixing npm security vulnerabilities..." -ForegroundColor Yellow
try {
    npm audit fix
    Write-Host "✅ Fixed non-breaking vulnerabilities" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Some vulnerabilities require manual review" -ForegroundColor Yellow
}

# 3. Create conditional database setup for build time
Write-Host "`n💾 Creating conditional database setup..." -ForegroundColor Yellow

$databaseBuildFix = @'
/**
 * Conditional database setup for Docker builds
 * This script will only run database operations if we're in runtime (not build time)
 */

// Check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.BUILD_TIME === 'true';

if (isBuildTime) {
  console.log('⏭️ Skipping database operations during build time');
  process.exit(0);
}

// Runtime database setup
console.log('🗄️ Running database setup at runtime...');
require('./setup-database.js');
'@

Set-Content -Path "database-build-fix.js" -Value $databaseBuildFix
Write-Host "✅ Created database-build-fix.js" -ForegroundColor Green

# 4. Update package.json with safe build scripts
Write-Host "`n📦 Updating package.json scripts..." -ForegroundColor Yellow

$packageJson = Get-Content -Path "package.json" | ConvertFrom-Json
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "db:migrate" -Value "node database-build-fix.js" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "build:safe" -Value "NEXT_TELEMETRY_DISABLED=1 npm run build" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "postbuild" -Value "echo 'Build completed successfully'" -Force

$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path "package.json"
Write-Host "✅ Updated package.json scripts" -ForegroundColor Green

# 5. Add dynamic exports to CMS API routes
Write-Host "`n🔄 Adding dynamic exports to API routes..." -ForegroundColor Yellow

$cmsRoutes = @(
    "src/app/api/cms/about/route.ts",
    "src/app/api/cms/about/[id]/route.ts",
    "src/app/api/cms/brand-branches/route.ts",
    "src/app/api/cms/brand-branches/[id]/route.ts",
    "src/app/api/cms/collections/route.ts",
    "src/app/api/cms/company-branches/route.ts",
    "src/app/api/cms/company-branches/[id]/route.ts",
    "src/app/api/cms/company-info/route.ts",
    "src/app/api/cms/company-info/[id]/route.ts",
    "src/app/api/cms/hero/route.ts",
    "src/app/api/cms/hero/[id]/route.ts",
    "src/app/api/cms/products/route.ts",
    "src/app/api/cms/products/[id]/route.ts",
    "src/app/api/cms/services/route.ts",
    "src/app/api/cms/services/[id]/route.ts",
    "src/app/api/cms/stats/route.ts",
    "src/app/api/cms/team/route.ts",
    "src/app/api/cms/team/[id]/route.ts",
    "src/app/api/cms/testimonials/route.ts",
    "src/app/api/cms/testimonials/[id]/route.ts"
)

$dynamicExports = @"

// Force dynamic rendering for CMS API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
"@

foreach ($route in $cmsRoutes) {
    if (Test-Path $route) {
        $content = Get-Content -Path $route -Raw
        if (-not $content.Contains("export const dynamic")) {
            # Add dynamic exports after imports
            $content = $content -replace '(import.*?;\s*)', "`$1$dynamicExports`n"
            Set-Content -Path $route -Value $content
            Write-Host "✅ Updated: $route" -ForegroundColor Green
        } else {
            Write-Host "⏭️ Already fixed: $route" -ForegroundColor Yellow
        }
    }
}

# 6. Create fixed Dockerfile
Write-Host "`n🐳 Creating fixed Dockerfile..." -ForegroundColor Yellow

$dockerfileFixed = @'
# ===================================================================
# Fixed Multi-stage Dockerfile for Next.js SaaS Boilerplate
# ===================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies and update browserslist
RUN npm ci && npx update-browserslist-db@latest

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BUILD_TIME=true
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

# Build application safely
RUN npm run build:safe

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_TIME=false

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy database files
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/database ./database
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/setup-database.js ./setup-database.js
COPY --from=builder /app/database-build-fix.js ./database-build-fix.js

# Create cache directory and set permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Setup database on container start, then start the server
CMD ["sh", "-c", "node database-build-fix.js && node server.js"]
'@

Set-Content -Path "Dockerfile.fixed" -Value $dockerfileFixed
Write-Host "✅ Created Dockerfile.fixed" -ForegroundColor Green

# 7. Create fixed docker-compose
Write-Host "`n🔧 Creating fixed docker-compose..." -ForegroundColor Yellow

$dockerComposeFixed = @'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.fixed
      args:
        # Pass build-time environment variables
        - DATABASE_URL=${DATABASE_URL}
        - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
        - NEXTAUTH_URL=${NEXTAUTH_URL}
        - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
        - NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
        - NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
        - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      - NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}
    env_file:
      - .env.docker
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
'@

Set-Content -Path "docker-compose.fixed.yml" -Value $dockerComposeFixed
Write-Host "✅ Created docker-compose.fixed.yml" -ForegroundColor Green

Write-Host "`n🎉 All fixes applied successfully!" -ForegroundColor Green
Write-Host "`n📋 Summary of fixes:" -ForegroundColor Cyan
Write-Host "   ✅ Updated browserslist database" -ForegroundColor White
Write-Host "   ✅ Fixed npm security vulnerabilities (non-breaking)" -ForegroundColor White  
Write-Host "   ✅ Created conditional database setup for build time" -ForegroundColor White
Write-Host "   ✅ Added dynamic exports to all CMS API routes" -ForegroundColor White
Write-Host "   ✅ Created Dockerfile.fixed with proper build handling" -ForegroundColor White
Write-Host "   ✅ Created docker-compose.fixed.yml" -ForegroundColor White

Write-Host "`n🚀 To deploy with fixes:" -ForegroundColor Yellow
Write-Host "   1. docker-compose -f docker-compose.fixed.yml down" -ForegroundColor White
Write-Host "   2. docker-compose -f docker-compose.fixed.yml up -d --build" -ForegroundColor White

Write-Host "`n💡 This will resolve:" -ForegroundColor Yellow
Write-Host "   🔹 Dynamic server usage errors" -ForegroundColor White
Write-Host "   🔹 Database table missing errors during build" -ForegroundColor White
Write-Host "   🔹 Browserslist warnings" -ForegroundColor White
Write-Host "   🔹 Static generation issues" -ForegroundColor White
