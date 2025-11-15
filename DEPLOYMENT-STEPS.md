# Deployment Steps ke Azure VM

## Prerequisites Checklist
- ✅ Code sudah di-push ke GitHub
- ✅ Git clone di Azure VM (40.81.26.137)
- ✅ `.env.production` sudah dibuat dan diisi

## Step-by-Step Deployment

### Step 1: Verifikasi File di Azure VM

SSH ke Azure VM:
```bash
ssh user@40.81.26.137
```

Masuk ke directory project:
```bash
cd ~/brodo-cms
# atau directory dimana Anda clone repo
```

Verifikasi semua file ada:
```bash
ls -la
```

Harus ada file:
- `Dockerfile`
- `docker-compose.yml`
- `.env.production`
- `package.json`
- `next.config.mjs`

### Step 2: Install Docker (Jika belum terinstall)

```bash
# Update package manager
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Install Docker Compose
sudo apt-get install -y docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (agar tidak perlu sudo)
sudo usermod -aG docker $USER

# Logout dan login lagi agar perubahan berlaku
exit
```

SSH lagi setelah logout:
```bash
ssh user@40.81.26.137
cd ~/brodo-cms
```

Verifikasi Docker terinstall:
```bash
docker --version
docker-compose --version
```

### Step 3: Verifikasi .env.production

Pastikan `.env.production` sudah diisi dengan benar:
```bash
cat .env.production
```

Harus berisi (dengan nilai sebenarnya, bukan template):
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-actual-secret-here"
NODE_ENV=production
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"
```

Jika masih kosong, edit:
```bash
nano .env.production
```

### Step 4: Build dan Run Docker Container

Build Docker image:
```bash
docker-compose build
```

Ini akan memakan waktu beberapa menit (3-5 menit) karena:
- Install dependencies
- Build Next.js production
- Create optimized image

Jalankan container:
```bash
docker-compose up -d
```

Flag `-d` = detached mode (run in background)

### Step 5: Verifikasi Container Running

Check container status:
```bash
docker-compose ps
```

Output yang diharapkan:
```
NAME                COMMAND             SERVICE             STATUS              PORTS
brodo-cms-app-1     "node server.js"    app                 Up 10 seconds       0.0.0.0:3000->3000/tcp
```

Lihat logs:
```bash
docker-compose logs -f
```

Tekan `Ctrl+C` untuk keluar dari logs.

### Step 6: Test Aplikasi

**Test dari dalam VM:**
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-16T...",
  "environment": "production"
}
```

**Test dari browser Anda (di local):**

Buka browser dan akses:
```
http://40.81.26.137:3000
```

Seharusnya muncul homepage Brodo!

### Step 7: Test CMS Login

Akses CMS:
```
http://40.81.26.137:3000/cms/login
```

Login dengan kredensial dari database Anda.

### Step 8: Configure Azure Network Security Group (NSG)

Pastikan port 3000 terbuka di Azure NSG:

**Via Azure Portal:**
1. Buka Azure Portal → Virtual Machines
2. Pilih VM Anda (40.81.26.137)
3. Settings → Networking
4. Inbound port rules → Add inbound port rule
5. Isi:
   - Port: 3000
   - Protocol: TCP
   - Action: Allow
   - Priority: 1000
   - Name: AllowNextJS
6. Save

**Via Azure CLI:**
```bash
az vm open-port --port 3000 --resource-group YOUR_RESOURCE_GROUP --name YOUR_VM_NAME
```

### Step 9: Setup Firewall di VM (Opsional)

Jika menggunakan UFW firewall:
```bash
# Check status
sudo ufw status

# Allow port 3000
sudo ufw allow 3000/tcp

# Reload
sudo ufw reload
```

## Common Commands

### Start containers
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### Restart containers
```bash
docker-compose restart
```

### View logs
```bash
docker-compose logs -f
```

### View specific service logs
```bash
docker-compose logs -f app
```

### Rebuild after code changes
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Run database migrations
```bash
docker-compose exec app npm run db:push
```

### Check container resource usage
```bash
docker stats
```

## Troubleshooting

### Problem: Container tidak start
```bash
# Check logs
docker-compose logs

# Check specific error
docker-compose logs app
```

### Problem: Port 3000 sudah digunakan
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

### Problem: Database connection error
```bash
# Verify DATABASE_URL in .env.production
cat .env.production

# Test database connection from VM
psql "postgresql://user:pass@host:5432/dbname"
```

### Problem: Build fails
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

### Problem: Cannot access from browser
1. Check container is running: `docker-compose ps`
2. Check logs: `docker-compose logs`
3. Test from VM: `curl http://localhost:3000`
4. Check Azure NSG allows port 3000
5. Check VM firewall: `sudo ufw status`

### Problem: 502 Bad Gateway
```bash
# Restart container
docker-compose restart

# Check if app is healthy
curl http://localhost:3000/api/health
```

## Monitoring

### Setup auto-restart on failure
Already configured in `docker-compose.yml`:
```yaml
restart: unless-stopped
```

### Monitor logs in real-time
```bash
docker-compose logs -f --tail=100
```

### Check disk space
```bash
df -h
```

### Clean up unused Docker resources
```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove specific stopped containers
docker-compose down --volumes
```

## Production Best Practices

1. **Always use `.env.production`** for secrets, never hardcode
2. **Regular backups** of database
3. **Monitor logs** for errors: `docker-compose logs -f`
4. **Update dependencies** regularly: `npm update`
5. **SSL/HTTPS** setup with Nginx reverse proxy (recommended for production)
6. **Regular security updates** on Azure VM: `sudo apt update && sudo apt upgrade`

## Next Steps (Optional but Recommended)

### Setup Nginx Reverse Proxy with SSL
Create file: `NGINX-SETUP.md` for instructions on:
- Installing Nginx
- Configure reverse proxy
- Setup SSL with Let's Encrypt
- Use domain instead of IP

### Setup Monitoring
- PM2 for process management
- Application Insights for Azure
- Log aggregation

### CI/CD with GitHub Actions
Already configured in `.github/workflows/deploy.yml` (if exists)

## Quick Reference

```bash
# Status check
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Update code
git pull && docker-compose down && docker-compose build && docker-compose up -d

# Full reset
docker-compose down --volumes && docker system prune -a
```

---

**Your application should now be live at:** `http://40.81.26.137:3000` 🚀
