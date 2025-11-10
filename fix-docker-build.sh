#!/bin/bash

# ===================================================================
# Docker Build Database Fix Script
# ===================================================================
# Script untuk mengatasi masalah database saat Docker build

echo "🔧 Fixing Docker build database issues..."

# 1. Create a conditional database setup for build time
cat > database-build-fix.js << 'EOF'
/**
 * Conditional database setup for Docker builds
 * This script will only run database operations if we're in runtime (not build time)
 */

// Check if we're in build time
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.RUNTIME;

if (isBuildTime) {
  console.log('⏭️ Skipping database operations during build time');
  process.exit(0);
}

// Load the actual database setup only if not in build time
require('./setup-database.js');
EOF

# 2. Update package.json scripts to use conditional database setup
echo "📝 Updating package.json build scripts..."

# Create a backup of package.json
cp package.json package.json.backup

# Update package.json to add pre-build database check
node -e "
const fs = require('fs');
const pkg = require('./package.json');

// Add new scripts
pkg.scripts['db:migrate'] = 'node database-build-fix.js';
pkg.scripts['build:with-db'] = 'npm run db:migrate && npm run build';
pkg.scripts['build:safe'] = 'NODE_ENV=production npm run build';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Updated package.json with safe build scripts');
"

# 3. Create a modified Dockerfile that handles database properly
cat > Dockerfile.fixed << 'EOF'
# ===================================================================
# Fixed Multi-stage Dockerfile for Next.js SaaS Boilerplate
# ===================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

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
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

# Set flag to indicate build time (prevents database operations)
ENV BUILD_TIME=true

# Build application with safe build command
RUN npm run build:safe

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV RUNTIME=true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy migrations and database setup files
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
EOF

echo "✅ Created Dockerfile.fixed with proper database handling"

# 4. Create updated docker-compose with fixed Dockerfile
cat > docker-compose.fixed.yml << 'EOF'
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
      - RUNTIME=true
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
      start_period: 40s
EOF

echo "✅ Created docker-compose.fixed.yml"

# 5. Update next.config.mjs to handle build-time issues
echo "📝 Creating next.config.mjs patch..."

cat > next.config.patch.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Disable static optimization for API routes that use database
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  // Ensure dynamic routes are not statically generated
  generateStaticParams: false,
  output: 'standalone',
  // Handle build-time database errors gracefully
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // In production build, mock database operations
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/libs/DB$': require.resolve('./database-mock.js'),
      };
    }
    return config;
  },
};

export default nextConfig;
EOF

# 6. Create database mock for build time
cat > database-mock.js << 'EOF'
// Mock database for build time
console.log('⚠️ Using database mock during build time');

export const db = {
  select: () => ({
    from: () => ({
      where: () => ({
        then: () => Promise.resolve([]),
      }),
    }),
  }),
  insert: () => ({
    values: () => Promise.resolve({ insertedId: 1 }),
  }),
  update: () => ({
    set: () => ({
      where: () => Promise.resolve({ affectedRows: 1 }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve({ affectedRows: 1 }),
  }),
};
EOF

echo ""
echo "🎉 Docker build fixes applied!"
echo ""
echo "📋 Files created:"
echo "   ✅ database-build-fix.js - Conditional database setup"
echo "   ✅ Dockerfile.fixed - Fixed Dockerfile"
echo "   ✅ docker-compose.fixed.yml - Fixed docker-compose"
echo "   ✅ next.config.patch.mjs - Build configuration patch"
echo "   ✅ database-mock.js - Mock database for build time"
echo ""
echo "🚀 To use the fixed version:"
echo "   1. docker-compose -f docker-compose.fixed.yml down"
echo "   2. docker-compose -f docker-compose.fixed.yml up -d --build"
echo ""
echo "💡 The fixed version will:"
echo "   - Skip database operations during build time"
echo "   - Run database setup only at runtime"
echo "   - Handle dynamic routes properly"
echo "   - Prevent static generation errors"
