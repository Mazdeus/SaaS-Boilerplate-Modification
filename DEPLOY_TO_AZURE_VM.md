# 🚀 Deploy Docker ke Azure VM (40.81.26.137)

Panduan deploy aplikasi ke Azure VM menggunakan Docker.

---

## 📋 Prerequisites

- ✅ Azure VM sudah running (Public IP: 40.81.26.137)
- ✅ Docker sudah terinstall di VM
- ✅ Port 3000 (atau 80/443) dibuka di Azure Network Security Group
- ✅ SSH access ke VM

---

## 🔧 Step 1: Persiapan Azure VM

### 1.1 Login ke Azure VM via SSH

```powershell
# Dari local machine
ssh azureuser@40.81.26.137

# Atau jika pakai key file
ssh -i path/to/key.pem azureuser@40.81.26.137
```

### 1.2 Install Docker di VM (jika belum)

```bash
# Update package manager
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Logout dan login kembali agar group changes apply
exit
```

Login kembali:
```powershell
ssh azureuser@40.81.26.137
```

Verify Docker:
```bash
docker --version
docker ps
```

### 1.3 Install Docker Compose di VM

```bash
# Download docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

---

## 📦 Step 2: Transfer Files ke Azure VM

### Option A: Using Git (Recommended)

```bash
# Di Azure VM
cd ~
git clone https://github.com/Mazdeus/SaaS-Boilerplate-Modification.git
cd SaaS-Boilerplate-Modification
git checkout cms-integrated
```

### Option B: Using SCP (Transfer from Local)

```powershell
# Dari local machine (PowerShell)
# Transfer folder ke VM
scp -r "D:\KULIAH\POLBAN 2023\TEKNIK INFORMATIKA\SEMESTER 5\Pengembangan_Web\Praktek\Pertemuan_12\SaaS-Boilerplate-Modification" azureuser@40.81.26.137:~/

# Atau transfer specific files
scp .env.production azureuser@40.81.26.137:~/SaaS-Boilerplate-Modification/
scp docker-compose.yml azureuser@40.81.26.137:~/SaaS-Boilerplate-Modification/
scp Dockerfile azureuser@40.81.26.137:~/SaaS-Boilerplate-Modification/
```

---

## 🔐 Step 3: Setup Environment Variables di VM

```bash
# Di Azure VM
cd ~/SaaS-Boilerplate-Modification

# Create .env.production file
nano .env.production
```

Copy paste content ini:

```bash
# Database
DATABASE_URL="postgresql://neondb_owner:npg_noAX1zZPq0sJ@ep-autumn-dream-a1o813be-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Node Environment
NODE_ENV=production

# NextAuth Configuration
NEXTAUTH_SECRET=tzjdocqIWk0mH28L0K6HUT7HAd6fgzeoIhXQeKYlz68=
NEXTAUTH_URL="http://40.81.26.137:3000"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3dlZXBpbmctdGVhbC01OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_EdgEDWb5XVAVtGNz1Xiz7k1v26NIsDgjXFtLyYP6Uu

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## 🐳 Step 4: Build & Run Docker Container di VM

### 4.1 Build Docker Image

```bash
# Di Azure VM
cd ~/SaaS-Boilerplate-Modification

# Build dengan docker-compose
docker-compose --env-file .env.production build
```

### 4.2 Run Container

```bash
# Run di background
docker-compose --env-file .env.production up -d

# Check logs
docker-compose --env-file .env.production logs -f

# Check running containers
docker ps
```

---

## 🔥 Step 5: Setup Firewall & Network Security Group

### 5.1 Di Azure Portal

1. Buka Azure Portal → Virtual Machines → Your VM
2. Klik **Networking** (di sidebar kiri)
3. Klik **Add inbound port rule**
4. Configure:
   ```
   Source: Any
   Source port ranges: *
   Destination: Any
   Service: Custom
   Destination port ranges: 3000
   Protocol: TCP
   Action: Allow
   Priority: 1000
   Name: AllowPort3000
   ```
5. Klik **Add**

### 5.2 Di VM (UFW Firewall)

```bash
# Check firewall status
sudo ufw status

# Allow port 3000
sudo ufw allow 3000/tcp

# Atau allow from specific IP only
# sudo ufw allow from YOUR_IP to any port 3000

# Enable firewall jika belum
sudo ufw enable

# Verify
sudo ufw status
```

---

## ✅ Step 6: Test Aplikasi

### 6.1 Test dari VM (Internal)

```bash
# Di VM
curl http://localhost:3000
```

### 6.2 Test dari Browser (External)

Buka browser dan akses:
```
http://40.81.26.137:3000
```

### 6.3 Test Endpoints

- **Homepage**: `http://40.81.26.137:3000`
- **Company Profile**: `http://40.81.26.137:3000/en/company-profile`
- **CMS Login**: `http://40.81.26.137:3000/cms/login`
- **Dashboard**: `http://40.81.26.137:3000/en/dashboard`

---

## 🔄 Step 7: Auto-Start Container (Optional)

Agar container otomatis start saat VM restart:

```bash
# Update docker-compose.yml restart policy (sudah ada di config)
# restart: unless-stopped

# Atau setup systemd service
sudo nano /etc/systemd/system/company-profile.service
```

Content:
```ini
[Unit]
Description=Company Profile Docker Container
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/azureuser/SaaS-Boilerplate-Modification
ExecStart=/usr/local/bin/docker-compose --env-file .env.production up -d
ExecStop=/usr/local/bin/docker-compose --env-file .env.production down
User=azureuser

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable company-profile.service
sudo systemctl start company-profile.service
sudo systemctl status company-profile.service
```

---

## 🌐 Step 8: Setup Nginx Reverse Proxy (Recommended)

Untuk production, gunakan Nginx sebagai reverse proxy dan setup SSL.

### 8.1 Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx -y
```

### 8.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/company-profile
```

Content:
```nginx
server {
    listen 80;
    server_name 40.81.26.137;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/company-profile /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Allow Nginx through firewall:
```bash
sudo ufw allow 'Nginx Full'
```

Now access via port 80:
```
http://40.81.26.137
```

Update `.env.production`:
```bash
NEXTAUTH_URL="http://40.81.26.137"
```

Rebuild:
```bash
docker-compose --env-file .env.production down
docker-compose --env-file .env.production up -d --build
```

---

## 🔒 Step 9: Setup SSL/HTTPS (Optional but Recommended)

### Option A: Using Let's Encrypt (Requires Domain)

Jika Anda punya domain yang pointing ke IP ini:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update `.env.production`:
```bash
NEXTAUTH_URL="https://yourdomain.com"
```

### Option B: Self-Signed Certificate (Development Only)

```bash
# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt

# Update Nginx config untuk HTTPS
# (see Nginx SSL configuration)
```

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Docker container logs
docker-compose --env-file .env.production logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart container
docker-compose --env-file .env.production restart

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application

```bash
# Pull latest changes
git pull origin cms-integrated

# Rebuild and restart
docker-compose --env-file .env.production down
docker-compose --env-file .env.production up -d --build
```

---

## 🎯 Quick Command Summary

```bash
# Build & Start
docker-compose --env-file .env.production up -d --build

# Stop
docker-compose --env-file .env.production down

# View Logs
docker-compose --env-file .env.production logs -f

# Restart
docker-compose --env-file .env.production restart

# Check Status
docker ps
docker-compose --env-file .env.production ps
```

---

## 🔍 Troubleshooting

### Container tidak start

```bash
# Check logs
docker-compose --env-file .env.production logs

# Check container status
docker ps -a

# Check if port already in use
sudo netstat -tulpn | grep :3000
```

### Tidak bisa akses dari browser

```bash
# Check if container running
docker ps

# Check if port listening
sudo netstat -tulpn | grep :3000

# Check firewall
sudo ufw status

# Check Azure NSG di portal
```

### Database connection error

```bash
# Test dari VM
curl -X GET "https://ep-autumn-dream-a1o813be-pooler.ap-southeast-1.aws.neon.tech"

# Check environment variables
docker-compose --env-file .env.production config
```

---

## 📝 Important Notes

1. **Security**: 
   - Jangan expose sensitive ports ke public
   - Gunakan firewall rules yang ketat
   - Setup SSL untuk production

2. **Performance**:
   - Monitor VM resources (CPU, Memory)
   - Scale VM size jika diperlukan
   - Use Nginx caching

3. **Backup**:
   - Backup database regularly
   - Backup VM disk images
   - Store `.env.production` securely

---

## 🎉 Selesai!

Aplikasi Anda sekarang running di:
```
http://40.81.26.137:3000
```

Atau jika pakai Nginx:
```
http://40.81.26.137
```

Next steps:
- [ ] Setup domain name
- [ ] Configure SSL/HTTPS
- [ ] Setup monitoring
- [ ] Configure auto-backup
