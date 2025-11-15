# Azure VM Deployment - Quick Commands Reference

## 📦 Pre-deployment (Local)

### Test Docker build locally
```powershell
# Windows
.\docker-setup.ps1

# Or manually
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### Push to GitHub
```powershell
git add .
git commit -m "Add Docker deployment configuration"
git push origin revised
```

## 🚀 Deployment to Azure VM (40.81.26.137)

### Connect to VM
```bash
ssh azureuser@40.81.26.137
```

### One-Command Deployment
```bash
# Using automated script
cd /opt/brodo-cms
sudo ./deploy.sh
```

### Manual Deployment Steps
```bash
# 1. Update code
cd /opt/brodo-cms
git pull origin revised

# 2. Stop existing containers
sudo docker-compose down

# 3. Rebuild and start
sudo docker-compose up -d --build

# 4. Check status
sudo docker ps
sudo docker-compose logs -f
```

## 🔍 Monitoring & Management

### View logs
```bash
# All logs
sudo docker-compose logs -f

# Last 100 lines
sudo docker-compose logs -f --tail=100

# Specific container
sudo docker logs brodo-cms-app -f
```

### Container management
```bash
# Status
sudo docker ps

# Restart
sudo docker-compose restart

# Stop
sudo docker-compose down

# Remove all (including volumes)
sudo docker-compose down -v
```

### Resource usage
```bash
# Container stats
sudo docker stats

# Disk usage
sudo docker system df

# Clean up unused images
sudo docker image prune -a
```

### Shell access
```bash
# Access container shell
sudo docker exec -it brodo-cms-app sh

# Inside container, you can:
# - Check files: ls -la
# - View env: env | grep DATABASE
# - Test app: wget -O- http://localhost:3000/api/health
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
sudo docker-compose logs

# Remove and rebuild
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### Port already in use
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database connection issues
```bash
# Test database connection from VM
psql "postgresql://username:password@host:5432/database"

# Or using docker
sudo docker exec -it brodo-cms-app sh
# Inside container:
node -e "console.log(process.env.DATABASE_URL)"
```

### Out of memory
```bash
# Check memory
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### View application errors
```bash
# Real-time logs
sudo docker-compose logs -f brodo-cms

# Search for errors
sudo docker-compose logs | grep -i error
```

## 🔄 Update Deployment

### Quick update
```bash
cd /opt/brodo-cms
git pull origin revised
sudo docker-compose up -d --build
```

### Zero-downtime update (advanced)
```bash
# Build new image
sudo docker-compose build

# Start new container
sudo docker-compose up -d --no-deps --build brodo-cms

# Old container will be replaced automatically
```

## 📊 Health Checks

### Check if app is running
```bash
# From VM
curl http://localhost:3000/api/health

# From outside
curl http://40.81.26.137:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"...","environment":"production"}
```

### Check specific pages
```bash
# Homepage
curl -I http://localhost:3000/

# CMS login
curl -I http://localhost:3000/cms/login

# API endpoint
curl http://localhost:3000/api/collections
```

## 🔐 Security

### View environment variables
```bash
# Don't expose in logs!
sudo docker exec brodo-cms-app sh -c 'echo $DATABASE_URL'
```

### Update secrets
```bash
cd /opt/brodo-cms
nano .env.production  # Edit secrets
sudo docker-compose down
sudo docker-compose up -d
```

### Check for vulnerabilities
```bash
# Scan image
sudo docker scan brodo-cms-app
```

## 📝 Backup

### Backup container data
```bash
# Create backup directory
mkdir -p ~/backups

# Backup container
sudo docker export brodo-cms-app > ~/backups/brodo-cms-$(date +%Y%m%d).tar
```

### Backup database (if on same VM)
```bash
pg_dump database_name > ~/backups/db-backup-$(date +%Y%m%d).sql
```

## 🎯 Quick Tests

### Test everything is working
```bash
# Health check
curl http://localhost:3000/api/health

# Homepage loads
curl -s http://localhost:3000 | grep -i brodo

# API responds
curl http://localhost:3000/api/collections

# Check container is healthy
sudo docker ps --filter "name=brodo-cms-app" --format "table {{.Names}}\t{{.Status}}"
```

## 📱 Access URLs

After successful deployment:

- **Homepage**: http://40.81.26.137:3000
- **CMS Login**: http://40.81.26.137:3000/cms/login
- **API Health**: http://40.81.26.137:3000/api/health
- **Collections**: http://40.81.26.137:3000/collections
- **Stores**: http://40.81.26.137:3000/stores
- **Contact**: http://40.81.26.137:3000/contact

## 🆘 Emergency Commands

### Complete reset
```bash
cd /opt/brodo-cms
sudo docker-compose down -v  # ⚠️ This removes volumes!
sudo docker system prune -a  # Clean everything
git pull origin revised
sudo docker-compose up -d --build
```

### Rollback to previous version
```bash
cd /opt/brodo-cms
git log --oneline  # Find commit hash
git checkout <previous-commit-hash>
sudo docker-compose down
sudo docker-compose up -d --build
```
