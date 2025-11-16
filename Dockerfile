# Dockerfile for Next.js Production Build
# Multi-stage build for optimized image size

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# Debug: List the .next directory structure
RUN echo "=== Build Output Structure ===" && \
    ls -la .next/ && \
    echo "=== Checking standalone ===" && \
    (ls -la .next/standalone || echo "No standalone directory") && \
    echo "=== Checking static ===" && \
    ls -la .next/static

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Copy assets folder
COPY --from=builder /app/assets ./assets

# Copy package.json and node_modules for non-standalone fallback
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy the entire .next folder
COPY --from=builder /app/.next ./.next

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use npm start which works with or without standalone
CMD ["npm", "start"]
