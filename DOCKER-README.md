# 🐳 Docker Deployment Files Summary

All files needed for deploying Brodo CMS to Azure VM using Docker.

## 📁 File Structure

```
.
├── Dockerfile                 # Main Docker image configuration
├── docker-compose.yml         # Docker Compose orchestration
├── .dockerignore             # Files to exclude from Docker build
├── .env.production           # Production environment variables (DO NOT COMMIT)
├── .env.production.example   # Template for .env.production
├── nginx.conf                # Nginx reverse proxy config (optional)
├── deploy.sh                 # Automated deployment script for VM
├── docker-setup.ps1          # Local Docker testing script (Windows)
├── healthcheck.js            # Docker health check script
├── DEPLOYMENT.md             # Complete deployment guide
├── DOCKER-COMMANDS.md        # Quick reference commands
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions auto-deployment
```

## 🚀 Quick Start

### 1. Local Testing (Windows)

```powershell
# Run setup script
.\docker-setup.ps1

# Or manually
docker-compose build
docker-compose up -d
```

### 2. Deploy to Azure VM

```bash
# SSH to VM
ssh azureuser@40.81.26.137

# Upload files and run
cd /opt/brodo-cms
sudo ./deploy.sh
```

## 📋 File Descriptions

### Dockerfile
Multi-stage build configuration:
- **Stage 1 (deps)**: Install dependencies
- **Stage 2 (builder)**: Build Next.js application
- **Stage 3 (runner)**: Production runtime

Optimizations:
- ✅ Multi-stage build (smaller image)
- ✅ Non-root user for security
- ✅ Only production dependencies
- ✅ Standalone Next.js output

### docker-compose.yml
Orchestrates container deployment:
- Port mapping: 3000:3000
- Environment variables from .env.production
- Auto-restart policy
- Health check configuration
- Network isolation

### .env.production
**IMPORTANT**: Create from `.env.production.example`

Required variables:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-characters"
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"
```

### deploy.sh
Automated deployment script that:
1. Installs Docker & Docker Compose (if needed)
2. Clones/updates repository
3. Builds Docker image
4. Starts container
5. Verifies deployment

### nginx.conf (Optional)
Reverse proxy configuration for:
- Better performance
- SSL/TLS support
- Static file caching
- Security headers

## 🔧 Configuration Details

### Dockerfile Optimizations

```dockerfile
# Multi-stage build reduces final image size
FROM node:18-alpine AS deps    # Only dependencies
FROM node:18-alpine AS builder # Build application
FROM node:18-alpine AS runner  # Run production

# Security: Non-root user
USER nextjs

# Health check endpoint
HEALTHCHECK CMD node healthcheck.js
```

### Docker Compose Services

```yaml
services:
  brodo-cms:
    restart: unless-stopped  # Auto-restart
    ports: ["3000:3000"]    # Port mapping
    env_file: .env.production
    healthcheck:            # Monitor container health
```

## 🎯 Deployment Targets

### Development
```bash
docker-compose up -d
```

### Production (Azure VM)
```bash
ssh azureuser@40.81.26.137
cd /opt/brodo-cms
sudo ./deploy.sh
```

### CI/CD (GitHub Actions)
Automatic deployment on push to `main` or `revised` branch

## 📊 Resource Requirements

### Minimum
- CPU: 1 core
- RAM: 2GB
- Disk: 20GB
- Network: Port 3000 open

### Recommended
- CPU: 2 cores
- RAM: 4GB
- Disk: 50GB
- Network: Ports 80, 443, 3000 open

## 🔐 Security Checklist

- [ ] `.env.production` is NOT committed to Git
- [ ] Strong `JWT_SECRET` (32+ characters) - Generate with: `openssl rand -base64 32`
- [ ] Database credentials are secure
- [ ] Firewall configured (only allow necessary ports)
- [ ] Regular security updates
- [ ] Container runs as non-root user
- [ ] Network isolation with Docker networks

## 🐛 Common Issues

### Port already in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Out of memory
```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Database connection failed
```bash
# Test from container
docker exec -it brodo-cms-app sh
env | grep DATABASE_URL
```

## 📚 Documentation

- **DEPLOYMENT.md**: Complete deployment guide
- **DOCKER-COMMANDS.md**: Quick reference commands
- **QUICKSTART.md**: Setup for local development
- **.github/GITHUB-ACTIONS.md**: Auto-deployment setup

## 🆘 Support

### View logs
```bash
docker-compose logs -f
```

### Container shell
```bash
docker exec -it brodo-cms-app sh
```

### Health check
```bash
curl http://localhost:3000/api/health
```

## 🎉 Success Indicators

After deployment, verify:

✅ Container is running: `docker ps`
✅ Health check passes: `curl http://40.81.26.137:3000/api/health`
✅ Homepage loads: `http://40.81.26.137:3000`
✅ CMS accessible: `http://40.81.26.137:3000/cms/login`
✅ No errors in logs: `docker-compose logs`

## 📞 Need Help?

1. Check logs: `docker-compose logs -f`
2. Review DEPLOYMENT.md
3. Check DOCKER-COMMANDS.md for troubleshooting
4. Verify .env.production configuration

---

Made with ❤️ for Brodo CMS
