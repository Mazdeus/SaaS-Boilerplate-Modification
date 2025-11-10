#!/bin/bash

# ===================================================================
# Quick Fix Deployment Script for Azure VM
# ===================================================================

echo "🚀 Quick Fix untuk Error Docker Build di Azure VM"
echo "================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'  
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Stop existing containers
echo -e "\n${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down --remove-orphans

# Step 2: Remove old images to force rebuild
echo -e "\n${YELLOW}🗑️ Removing old images...${NC}"
docker image rm -f saas-boilerplate-modification_web 2>/dev/null || true

# Step 3: Update browserslist database  
echo -e "\n${YELLOW}📋 Updating browserslist database...${NC}"
npx update-browserslist-db@latest || echo "Warning: Could not update browserslist"

# Step 4: Fix npm audit (non-breaking only)
echo -e "\n${YELLOW}🔒 Fixing npm vulnerabilities...${NC}"
npm audit fix || echo "Warning: Some vulnerabilities require manual review"

# Step 5: Build and start with fixed configuration
echo -e "\n${GREEN}🏗️ Building with fixed configuration...${NC}"
docker-compose -f docker-compose.fixed.yml up -d --build

# Step 6: Wait for container to start
echo -e "\n${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 30

# Step 7: Check container status
echo -e "\n${GREEN}📋 Checking container status...${NC}"
docker-compose -f docker-compose.fixed.yml ps

# Step 8: Show recent logs
echo -e "\n${GREEN}📝 Recent logs:${NC}"
docker-compose -f docker-compose.fixed.yml logs --tail=20

# Step 9: Health check
echo -e "\n${GREEN}🏥 Performing health check...${NC}"
sleep 10

if curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "\n${GREEN}✅ SUCCESS: Application is healthy and running!${NC}"
    echo -e "${GREEN}🌐 Application URL: http://40.81.26.137:3000${NC}"
else
    echo -e "\n${YELLOW}⚠️ Application may still be starting up...${NC}"
    echo -e "${YELLOW}📊 Check logs: docker-compose -f docker-compose.fixed.yml logs -f${NC}"
fi

echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
echo -e "\n${YELLOW}📋 Commands for monitoring:${NC}"
echo -e "   ${NC}docker-compose -f docker-compose.fixed.yml ps${NC}     - Check status"
echo -e "   ${NC}docker-compose -f docker-compose.fixed.yml logs -f${NC} - View logs"
echo -e "   ${NC}curl http://40.81.26.137:3000${NC}                     - Test app"
