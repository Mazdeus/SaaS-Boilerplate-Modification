#!/bin/bash

# Quick Deployment Script for Azure VM
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Brodo CMS - Quick Deployment Script"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production not found!${NC}"
    echo -e "${YELLOW}Please create .env.production file first.${NC}"
    echo ""
    echo "Quick setup:"
    echo "  cp .env.production.example .env.production"
    echo "  nano .env.production  # Fill in your secrets"
    exit 1
fi

# Verify critical environment variables
echo -e "${BLUE}📋 Verifying environment variables...${NC}"
if ! grep -q "JWT_SECRET=\"\"" .env.production && grep -q "DATABASE_URL=" .env.production; then
    echo -e "${GREEN}✅ Environment variables look good!${NC}"
else
    echo -e "${RED}❌ Warning: .env.production might not be configured properly${NC}"
    echo -e "${YELLOW}Please check JWT_SECRET and DATABASE_URL${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Docker is installed
echo -e "${BLUE}🐳 Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo ""
    echo "Install Docker with:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y docker.io docker-compose"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo ""
    echo "Install Docker Compose with:"
    echo "  sudo apt-get install -y docker-compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Pull latest code
echo -e "${BLUE}📥 Pulling latest code from Git...${NC}"
if [ -d .git ]; then
    git pull origin main || git pull origin master || echo -e "${YELLOW}⚠️  Could not pull from Git (might not be needed)${NC}"
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo -e "${YELLOW}⚠️  Not a git repository, skipping pull${NC}"
fi

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose down || echo -e "${YELLOW}⚠️  No containers to stop${NC}"

# Build Docker image
echo -e "${BLUE}🔨 Building Docker image...${NC}"
echo -e "${YELLOW}This may take 3-5 minutes...${NC}"
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Start containers
echo -e "${BLUE}▶️  Starting containers...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Containers started successfully!${NC}"
else
    echo -e "${RED}❌ Failed to start containers!${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

# Wait for application to start
echo -e "${BLUE}⏳ Waiting for application to start...${NC}"
sleep 5

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Container is running!${NC}"
else
    echo -e "${RED}❌ Container is not running!${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

# Test health endpoint
echo -e "${BLUE}🏥 Testing health endpoint...${NC}"
sleep 3
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed (app might still be starting)${NC}"
    echo "Check manually: curl http://localhost:3000/api/health"
fi

# Show logs
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Container Status:${NC}"
docker-compose ps
echo ""
echo -e "${BLUE}📝 Recent Logs:${NC}"
docker-compose logs --tail=20
echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo "  - Homepage: http://40.81.26.137:3000"
echo "  - CMS Login: http://40.81.26.137:3000/cms/login"
echo "  - Health Check: http://40.81.26.137:3000/api/health"
echo ""
echo -e "${BLUE}📚 Useful Commands:${NC}"
echo "  - View logs: docker-compose logs -f"
echo "  - Restart: docker-compose restart"
echo "  - Stop: docker-compose down"
echo "  - Status: docker-compose ps"
echo ""
echo -e "${YELLOW}💡 Note: Make sure port 3000 is open in Azure NSG!${NC}"
echo ""
