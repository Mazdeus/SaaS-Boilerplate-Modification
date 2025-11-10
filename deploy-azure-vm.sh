#!/bin/bash

# ===================================================================
# Azure VM Docker Deployment Script
# ===================================================================
# Script untuk mengatasi masalah environment variables di Docker Compose

echo "🚀 Memulai deployment Docker di Azure VM..."

# Fungsi untuk memeriksa apakah file ada
check_file() {
    if [ ! -f "$1" ]; then
        echo "❌ Error: File $1 tidak ditemukan!"
        exit 1
    fi
    echo "✅ File $1 ditemukan"
}

# Periksa file yang diperlukan
echo "📋 Memeriksa file yang diperlukan..."
check_file ".env.production"
check_file "docker-compose.yml"
check_file "Dockerfile"

# Export environment variables dari .env.production
echo "🔧 Mengexport environment variables..."

# Membaca dan mengexport variabel dari .env.production
export $(grep -v '^#' .env.production | grep -v '^$' | xargs)

# Menampilkan variabel yang telah di-export (tanpa menampilkan nilai secret)
echo "📊 Environment variables yang akan digunakan:"
echo "- DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "- NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:10}..."
echo "- NEXTAUTH_URL: $NEXTAUTH_URL"
echo "- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:0:20}..."
echo "- CLERK_SECRET_KEY: ${CLERK_SECRET_KEY:0:10}..."
echo "- NEXT_PUBLIC_CLERK_SIGN_IN_URL: $NEXT_PUBLIC_CLERK_SIGN_IN_URL"
echo "- NEXT_PUBLIC_CLERK_SIGN_UP_URL: $NEXT_PUBLIC_CLERK_SIGN_UP_URL"
echo "- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: $NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
echo "- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: $NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"

# Membersihkan container yang ada
echo "🧹 Membersihkan container yang ada..."
docker-compose down --remove-orphans

# Menghapus image lama untuk memaksa rebuild
echo "🗑️ Menghapus image lama..."
docker image rm -f saas-boilerplate-modification_web 2>/dev/null || true

# Build dan run dengan environment variables yang telah di-export
echo "🏗️ Building dan menjalankan aplikasi..."
docker-compose up -d --build

# Menunggu container start
echo "⏳ Menunggu container untuk start..."
sleep 10

# Memeriksa status container
echo "📋 Memeriksa status container..."
docker-compose ps

# Memeriksa logs
echo "📝 Menampilkan logs terbaru..."
docker-compose logs --tail=20

# Menampilkan URL aplikasi
echo ""
echo "🎉 Deployment selesai!"
echo "🌐 Aplikasi dapat diakses di: $NEXTAUTH_URL"
echo "📊 Gunakan 'docker-compose logs -f' untuk melihat logs secara real-time"
echo "🔍 Gunakan 'docker-compose ps' untuk memeriksa status container"
