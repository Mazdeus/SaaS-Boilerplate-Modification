#!/bin/bash

# Deployment script for Azure VM
# Run this script on your Azure VM (40.81.26.137)

set -e

echo "🚀 Starting Brodo CMS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/brodo-cms"
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"  # Update this
BRANCH="main"  # or "revised"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully${NC}"
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
fi

# Create application directory
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Creating application directory...${NC}"
    mkdir -p $APP_DIR
fi

cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}Updating repository...${NC}"
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone -b $BRANCH $REPO_URL .
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo -e "${YELLOW}Please create .env.production with your configuration${NC}"
    exit 1
fi

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down || true

# Remove old images
echo -e "${YELLOW}Removing old images...${NC}"
docker image prune -f

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose up -d --build

# Wait for container to be healthy
echo -e "${YELLOW}Waiting for application to be ready...${NC}"
sleep 10

# Check if container is running
if [ "$(docker ps -q -f name=brodo-cms-app)" ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}Application is running at: http://40.81.26.137:3000${NC}"
    echo ""
    echo "📊 Container status:"
    docker ps -f name=brodo-cms-app
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🔄 To restart: docker-compose restart"
    echo "🛑 To stop: docker-compose down"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Checking logs..."
    docker-compose logs
    exit 1
fi
