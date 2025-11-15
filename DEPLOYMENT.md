# 🚀 Deployment Guide - Azure VM dengan Docker

Panduan lengkap untuk deploy Brodo CMS ke Azure VM menggunakan Docker.

## 📋 Prerequisites

- Azure VM dengan IP: **40.81.26.137**
- OS: Ubuntu 20.04 atau lebih baru
- RAM: Minimal 2GB
- Storage: Minimal 20GB
- Port 3000 harus dibuka di Azure Network Security Group
- SSH access ke VM

## 🔧 Persiapan Azure VM

### 1. Connect ke Azure VM via SSH

```bash
ssh azureuser@40.81.26.137
```

### 2. Update sistem

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Buka port di Azure Portal

1. Login ke Azure Portal
2. Navigasi ke VM → Networking → Inbound port rules
3. Tambahkan rule:
   - Port: 3000
   - Protocol: TCP
   - Source: Any
   - Name: Allow-HTTP-3000

Atau gunakan Azure CLI:

```bash
az vm open-port --resource-group YOUR_RESOURCE_GROUP --name YOUR_VM_NAME --port 3000
```

## 📦 Metode Deployment

### Option 1: Deployment Otomatis (Recommended)

#### Step 1: Upload file ke VM

Di komputer lokal Anda:

```bash
# Zip project
tar -czf brodo-cms.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .

# Upload ke VM
scp brodo-cms.tar.gz azureuser@40.81.26.137:/tmp/
```

#### Step 2: Extract dan setup di VM

```bash
ssh azureuser@40.81.26.137

# Create app directory
sudo mkdir -p /opt/brodo-cms
sudo chown $USER:$USER /opt/brodo-cms

# Extract files
cd /opt/brodo-cms
tar -xzf /tmp/brodo-cms.tar.gz

# Make deploy script executable
chmod +x deploy.sh
```

#### Step 3: Konfigurasi Environment Variables

```bash
cd /opt/brodo-cms

# Edit .env.production dengan nilai yang sesuai
nano .env.production
```

**Update nilai berikut:**

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"
```

#### Step 4: Run deployment script

```bash
sudo ./deploy.sh
```

Script ini akan:
- ✅ Install Docker dan Docker Compose
- ✅ Build Docker image
- ✅ Start container
- ✅ Verify deployment

### Option 2: Manual Deployment

#### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### Step 2: Transfer files ke VM

```bash
# Di komputer lokal
scp -r . azureuser@40.81.26.137:/opt/brodo-cms/
```

#### Step 3: Setup environment

```bash
ssh azureuser@40.81.26.137
cd /opt/brodo-cms

# Edit .env.production
nano .env.production
```

#### Step 4: Build dan run

```bash
# Build image
sudo docker-compose build

# Start container
sudo docker-compose up -d

# Check logs
sudo docker-compose logs -f
```

## 🔍 Verifikasi Deployment

### 1. Check container status

```bash
sudo docker ps
```

Output yang diharapkan:
```
CONTAINER ID   IMAGE           STATUS          PORTS
xxxxx          brodo-cms:latest   Up 2 minutes   0.0.0.0:3000->3000/tcp
```

### 2. Check logs

```bash
sudo docker-compose logs -f brodo-cms
```

### 3. Test aplikasi

```bash
# Dari VM
curl http://localhost:3000

# Dari browser
http://40.81.26.137:3000
```

## 🛠️ Management Commands

### View logs

```bash
sudo docker-compose logs -f
```

### Restart aplikasi

```bash
sudo docker-compose restart
```

### Stop aplikasi

```bash
sudo docker-compose down
```

### Update aplikasi

```bash
cd /opt/brodo-cms
git pull origin main  # atau branch yang sesuai
sudo docker-compose down
sudo docker-compose up -d --build
```

### View resource usage

```bash
sudo docker stats
```

### Clean up unused images

```bash
sudo docker image prune -a
```

## 🔒 Setup Nginx Reverse Proxy (Optional - Recommended)

### 1. Install Nginx

```bash
sudo apt install nginx -y
```

### 2. Configure Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/brodo-cms
sudo ln -s /etc/nginx/sites-available/brodo-cms /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default config
```

### 3. Test dan restart Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. Update port di Azure

- Ubah port dari 3000 ke 80
- Atau buka kedua port

## 🔐 Security Best Practices

1. **Generate strong JWT_SECRET**
   ```bash
   openssl rand -base64 32
   ```

2. **Gunakan environment variables yang kuat**

3. **Enable firewall**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS (jika menggunakan SSL)
   sudo ufw enable
   ```

4. **Regular updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## 📊 Monitoring

### Check disk space

```bash
df -h
```

### Check memory usage

```bash
free -h
```

### Monitor Docker logs

```bash
sudo docker-compose logs -f --tail=100
```

## 🐛 Troubleshooting

### Container tidak start

```bash
# Check logs
sudo docker-compose logs

# Rebuild tanpa cache
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### Port sudah digunakan

```bash
# Check apa yang menggunakan port 3000
sudo lsof -i :3000

# Kill process jika perlu
sudo kill -9 <PID>
```

### Database connection error

1. Pastikan DATABASE_URL benar
2. Pastikan database server accessible dari VM
3. Check network security groups

### Out of memory

```bash
# Check memory
free -h

# Restart container
sudo docker-compose restart
```

## 📝 Post-Deployment Checklist

- [ ] Aplikasi accessible di http://40.81.26.137:3000
- [ ] Database connection berhasil
- [ ] CMS login berfungsi
- [ ] Image upload berfungsi
- [ ] Public pages load dengan benar
- [ ] Docker container restart otomatis jika VM reboot
- [ ] Logs dapat diakses
- [ ] Backup strategy implemented

## 🔄 Auto-restart on VM reboot

Docker Compose dengan `restart: unless-stopped` akan otomatis restart container saat VM reboot.

Verify dengan:

```bash
sudo reboot
# Tunggu VM restart, lalu check:
sudo docker ps
```

## 📞 Support

Jika ada masalah:
1. Check logs: `sudo docker-compose logs -f`
2. Check container status: `sudo docker ps -a`
3. Verify environment variables: `cat .env.production`
4. Check network: `sudo netstat -tlnp | grep 3000`

## 🎉 Success!

Jika semua berjalan lancar, aplikasi Anda sekarang live di:

**http://40.81.26.137:3000**

- Public site: http://40.81.26.137:3000
- CMS login: http://40.81.26.137:3000/cms/login
- API health: http://40.81.26.137:3000/api/health
