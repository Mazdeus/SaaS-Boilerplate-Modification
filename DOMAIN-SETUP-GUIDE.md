# Hosting ke Domain brodofootwear.studio dengan Azure VM

## Overview
Aplikasi Anda sudah running di Azure VM dengan IP `40.81.26.137:3000`. Sekarang kita akan mengarahkan domain `brodofootwear.studio` ke server tersebut.

## Langkah-Langkah Setup

### 1. Setup DNS di Name.com

Login ke dashboard Name.com dan konfigurasi DNS records:

#### A. DNS Records yang Diperlukan

**A Records:**
```
Type: A
Host: @
Answer: 40.81.26.137
TTL: 300 (5 minutes)

Type: A
Host: www
Answer: 40.81.26.137
TTL: 300
```

**Cara Setting:**
1. Login ke https://www.name.com
2. Klik domain `brodofootwear.studio`
3. Pilih menu "DNS Records"
4. Klik "Add Record"
5. Tambahkan kedua A records di atas

### 2. Setup Nginx Reverse Proxy di Azure VM

Nginx akan menerima request dari domain dan meneruskannya ke aplikasi Next.js di port 3000.

#### SSH ke Azure VM:
```bash
ssh user@40.81.26.137
```

#### Install Nginx:
```bash
sudo apt update
sudo apt install -y nginx
```

#### Create Nginx Configuration:
```bash
sudo nano /etc/nginx/sites-available/brodofootwear.studio
```

**Paste konfigurasi ini:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name brodofootwear.studio www.brodofootwear.studio;

    # Increase client body size for uploads
    client_max_body_size 50M;

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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
    }
}
```

**Save:** `Ctrl + X`, `Y`, `Enter`

#### Enable the Site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/brodofootwear.studio /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Check Nginx Status:
```bash
sudo systemctl status nginx
```

### 3. Update Next.js Configuration

Update `.env.production` di Azure VM:

```bash
cd ~/SaaS-Boilerplate-Modification
nano .env.production
```

**Update NEXT_PUBLIC_API_URL:**
```bash
# Before
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"

# After
NEXT_PUBLIC_API_URL="https://brodofootwear.studio"
```

**Save and restart Docker:**
```bash
docker-compose down
docker-compose up -d
```

### 4. Setup SSL Certificate (HTTPS)

Gunakan Let's Encrypt untuk SSL gratis:

#### Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Obtain SSL Certificate:
```bash
sudo certbot --nginx -d brodofootwear.studio -d www.brodofootwear.studio
```

**Follow the prompts:**
- Email: masukkan email Anda
- Agree to terms: `Y`
- Share email: `N` (optional)
- Redirect HTTP to HTTPS: `2` (Yes, redirect)

#### Auto-renewal:
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot will auto-renew every 90 days via systemd timer
```

### 5. Update Nginx Config for SSL (Automatic by Certbot)

Certbot akan otomatis update nginx config. Tapi Anda bisa cek:

```bash
sudo nano /etc/nginx/sites-available/brodofootwear.studio
```

Seharusnya sudah ada section untuk SSL:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name brodofootwear.studio www.brodofootwear.studio;

    ssl_certificate /etc/letsencrypt/live/brodofootwear.studio/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/brodofootwear.studio/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ... rest of config
}

server {
    listen 80;
    server_name brodofootwear.studio www.brodofootwear.studio;
    return 301 https://$server_name$request_uri;
}
```

### 6. Open Port 80 and 443 in Azure NSG

#### Via Azure Portal:
1. Go to Azure Portal → Virtual Machines
2. Select your VM
3. Settings → Networking
4. Add inbound port rules:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

#### Via Azure CLI:
```bash
# HTTP
az vm open-port --port 80 --resource-group YOUR_RESOURCE_GROUP --name YOUR_VM_NAME --priority 1001

# HTTPS
az vm open-port --port 443 --resource-group YOUR_RESOURCE_GROUP --name YOUR_VM_NAME --priority 1002
```

### 7. Configure Firewall di VM (UFW)

```bash
# Allow Nginx
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

### 8. Test Domain

Tunggu 5-15 menit untuk DNS propagation, lalu test:

```bash
# Test DNS resolution
nslookup brodofootwear.studio

# Test HTTP
curl -I http://brodofootwear.studio

# Test HTTPS
curl -I https://brodofootwear.studio
```

**Via Browser:**
```
https://brodofootwear.studio
https://www.brodofootwear.studio
```

## Troubleshooting

### DNS Belum Propagate
```bash
# Check DNS
dig brodofootwear.studio

# Check from different DNS
nslookup brodofootwear.studio 8.8.8.8
```

### Nginx Error
```bash
# Check error log
sudo tail -f /var/log/nginx/error.log

# Check access log
sudo tail -f /var/log/nginx/access.log
```

### SSL Certificate Error
```bash
# Renew manually
sudo certbot renew --force-renewal

# Check certificate status
sudo certbot certificates
```

### Application Not Responding
```bash
# Check if app is running
docker-compose ps

# Check logs
docker-compose logs -f

# Restart
docker-compose restart
```

## Performance Optimization (Optional)

### A. Enable Gzip Compression

Edit Nginx config:
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### B. Enable Caching

Already configured in nginx config above.

### C. Setup CDN (Optional)

Consider using Cloudflare for:
- DDoS protection
- CDN caching
- Free SSL

## Summary Commands

**Quick setup script:**
```bash
# 1. Install Nginx
sudo apt update && sudo apt install -y nginx

# 2. Create config
sudo nano /etc/nginx/sites-available/brodofootwear.studio
# (paste config from above)

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/brodofootwear.studio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 4. Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# 5. Get SSL
sudo certbot --nginx -d brodofootwear.studio -d www.brodofootwear.studio

# 6. Update .env.production
cd ~/SaaS-Boilerplate-Modification
nano .env.production
# Update NEXT_PUBLIC_API_URL="https://brodofootwear.studio"

# 7. Restart app
docker-compose down && docker-compose up -d
```

## Expected Result

After setup:
- ✅ `http://brodofootwear.studio` → redirects to HTTPS
- ✅ `https://brodofootwear.studio` → shows your app
- ✅ `https://www.brodofootwear.studio` → shows your app
- ✅ SSL certificate is valid (green padlock)
- ✅ Auto-renewal configured

## Monitoring

### Check if site is up:
```bash
# From VM
curl -I https://brodofootwear.studio

# Check SSL
openssl s_client -connect brodofootwear.studio:443 -servername brodofootwear.studio
```

### Monitor logs:
```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# App logs
docker-compose logs -f
```

---

**Your site will be live at:** `https://brodofootwear.studio` 🚀
