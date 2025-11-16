#!/bin/bash
# Quick Deploy Script untuk brodofootwear.studio
# Usage: ./scripts/deploy-to-vm.sh

set -e  # Exit on error

echo "🚀 Brodo CMS - Quick Deploy to Azure VM"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VM_USER="azureuser"
VM_IP="40.81.26.137"
PROJECT_DIR="~/brodo-cms"
BRANCH="revised"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Step 1: Check if we can connect to VM
echo ""
print_info "Step 1: Checking connection to Azure VM..."
if ssh -o ConnectTimeout=5 ${VM_USER}@${VM_IP} "echo 'Connected'" > /dev/null 2>&1; then
    print_success "Connection to VM established"
else
    print_error "Cannot connect to VM. Please check:"
    echo "  - Is the VM running?"
    echo "  - Is your SSH key configured?"
    echo "  - Is the IP address correct?"
    exit 1
fi

# Step 2: Pull latest code
echo ""
print_info "Step 2: Pulling latest code from GitHub..."
ssh ${VM_USER}@${VM_IP} << 'ENDSSH'
cd ~/brodo-cms
echo "Current directory: $(pwd)"
echo "Current branch: $(git branch --show-current)"
git pull origin revised
if [ $? -eq 0 ]; then
    echo "✅ Code pulled successfully"
else
    echo "❌ Failed to pull code"
    exit 1
fi
ENDSSH

# Step 3: Check environment file
echo ""
print_warning "Step 3: Checking .env.production..."
print_info "Please verify your .env.production file contains:"
echo "  - DATABASE_URL (with actual credentials)"
echo "  - JWT_SECRET (strong random string)"
echo "  - NEXT_PUBLIC_API_URL (https://brodofootwear.studio after SSL)"
echo ""
read -p "Have you verified .env.production? (y/n): " env_confirmed

if [ "$env_confirmed" != "y" ]; then
    print_error "Please update .env.production first!"
    echo "Run: ssh ${VM_USER}@${VM_IP} 'nano ~/brodo-cms/.env.production'"
    exit 1
fi

# Step 4: Rebuild Docker containers
echo ""
print_info "Step 4: Rebuilding Docker containers..."
print_warning "This will take a few minutes..."
ssh ${VM_USER}@${VM_IP} << 'ENDSSH'
cd ~/brodo-cms

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old images (optional, uncomment if needed)
# docker system prune -af

# Build new containers
echo "Building new Docker image..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Start containers
echo "Starting containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Containers started successfully"
else
    echo "❌ Failed to start containers"
    exit 1
fi
ENDSSH

# Step 5: Wait for container to be healthy
echo ""
print_info "Step 5: Waiting for container to be healthy..."
sleep 10

ssh ${VM_USER}@${VM_IP} << 'ENDSSH'
cd ~/brodo-cms

# Check container status
echo "Container status:"
docker-compose ps

# Check logs
echo ""
echo "Recent logs:"
docker-compose logs --tail=20 brodo-cms

# Test health endpoint
echo ""
echo "Testing health endpoint..."
sleep 5
curl -f http://localhost:3000/api/health || echo "Health check failed"
ENDSSH

# Step 6: Final verification
echo ""
print_success "Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Test locally: ssh ${VM_USER}@${VM_IP} 'curl http://localhost:3000'"
echo "2. Test externally: http://${VM_IP}:3000"
echo "3. Check logs: ssh ${VM_USER}@${VM_IP} 'cd ~/brodo-cms && docker-compose logs -f'"
echo ""
echo "🌐 After DNS propagation:"
echo "   - http://brodofootwear.studio (after DNS)"
echo "   - https://brodofootwear.studio (after SSL setup)"
echo ""
print_warning "Don't forget to:"
echo "  ✓ Setup DNS records on name.com"
echo "  ✓ Install SSL certificate with Let's Encrypt"
echo "  ✓ Configure Nginx reverse proxy"
echo ""
print_success "Happy deploying! 🎉"
