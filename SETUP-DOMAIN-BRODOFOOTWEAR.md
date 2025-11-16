# 🌐 Setup Domain brodofootwear.studio → Azure VM

Panduan lengkap untuk mengarahkan domain **brodofootwear.studio** (dari name.com) ke Azure VM Anda di **40.81.26.137**.

---

## 📋 Prerequisites

✅ Domain: `brodofootwear.studio` sudah terdaftar di name.com  
✅ Azure VM IP: `40.81.26.137`  
✅ App sudah running via Docker di VM (port 3000)  
✅ SSH access ke Azure VM

---

## 🚀 Step 1: Konfigurasi DNS di Name.com

### Login ke Name.com

1. Buka https://www.name.com/account/login
2. Login dengan akun Anda
3. Pilih domain **brodofootwear.studio**

### Tambahkan DNS Records

Klik **"Manage"** → **"DNS Records"** → **"Add Record"**

#### Record 1: Root Domain (@)
```
Type: A
Host: @
Answer: 40.81.26.137
TTL: 300
```

#### Record 2: WWW Subdomain
```
Type: A
Host: www
Answer: 40.81.26.137
TTL: 300
```

### Screenshot Referensi DNS Setup:
```
┌─────────────────────────────────────────────────┐
│ Type │ Host │ Answer         │ TTL  │ Actions │
├─────────────────────────────────────────────────┤
│ A    │ @    │ 40.81.26.137   │ 300  │ Edit    │
│ A    │ www  │ 40.81.26.137   │ 300  │ Edit    │
└─────────────────────────────────────────────────┘
```

**⏱️ Catatan:** Propagasi DNS bisa memakan waktu 5 menit - 48 jam (biasanya < 1 jam)

### Verifikasi DNS (Opsional)

Tunggu beberapa menit, lalu test di terminal/PowerShell:

```powershell
nslookup brodofootwear.studio
nslookup www.brodofootwear.studio
```

Output yang diharapkan:
```
Server:  UnKnown
Address:  ...

Non-authoritative answer:
Name:    brodofootwear.studio
Address:  40.81.26.137
```

---

## 🖥️ Step 2: Setup Nginx Reverse Proxy di Azure VM

### SSH ke Azure VM

```bash
ssh azureuser@40.81.26.137
# Ganti 'azureuser' dengan username VM Anda
```

### Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Buat Konfigurasi Nginx untuk Domain

```bash
sudo nano /etc/nginx/sites-available/brodofootwear.studio
```

**Paste konfigurasi berikut:**

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name brodofootwear.studio www.brodofootwear.studio;
    
    # Logs
    access_log /var/log/nginx/brodofootwear.access.log;
    error_log /var/log/nginx/brodofootwear.error.log;
    
    # Proxy ke Next.js app di port 3000
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching (Next.js)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
    
    # Favicon & robots.txt
    location = /favicon.ico {
        proxy_pass http://localhost:3000;
        access_log off;
    }
    
    location = /robots.txt {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

**Simpan:** Tekan `Ctrl+X` → `Y` → `Enter`

### Enable Site & Test Konfigurasi

```bash
# Enable site dengan symbolic link
sudo ln -s /etc/nginx/sites-available/brodofootwear.studio /etc/nginx/sites-enabled/

# Test konfigurasi Nginx
sudo nginx -t
```

Output yang diharapkan:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

### Enable Nginx Auto-Start

```bash
sudo systemctl enable nginx
```

---

## 🔐 Step 3: Update Next.js Configuration

### Update `next.config.mjs`

Buka file di local (VM atau local):

```bash
nano next.config.mjs
```

**Update untuk production:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production domain
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  images: {
    domains: ['brodofootwear.studio', 'www.brodofootwear.studio'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brodofootwear.studio',
      },
      {
        protocol: 'https',
        hostname: 'www.brodofootwear.studio',
      },
    ],
  },
};

export default nextConfig;
```

### Update `.env.production`

```bash
nano .env.production
```

**Update public URL:**

```env
# Public URL
NEXT_PUBLIC_API_URL=https://brodofootwear.studio/api

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brodo_db"

# JWT Secret
JWT_SECRET="1f04f4534b4ee73eb1503eb4d45e82259f40956652557b111ca88fdd8995a7b8"

# Session
SESSION_SECRET="b8g4d0f2c5e7a9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9"
SESSION_MAX_AGE=600000

# Environment
NODE_ENV=production
```

### Rebuild & Restart Docker

```bash
cd /path/to/your/app

# Rebuild dengan env baru
docker-compose down
docker-compose up -d --build

# Check logs
docker-compose logs -f app
```

---

## 🔒 Step 4: Setup SSL/HTTPS dengan Let's Encrypt (Gratis)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Generate SSL Certificate

```bash
sudo certbot --nginx -d brodofootwear.studio -d www.brodofootwear.studio
```

**Jawab pertanyaan:**
1. Email: Masukkan email Anda
2. Terms of Service: `Y` (agree)
3. Share email: `N` (optional)
4. Redirect HTTP to HTTPS: `2` (pilih redirect)

Certbot akan otomatis:
- Generate SSL certificate
- Update konfigurasi Nginx
- Setup auto-renewal

### Verifikasi Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### Check SSL Certificate

```bash
sudo certbot certificates
```

---

## ✅ Step 5: Verifikasi & Testing

### Test Akses Domain

Buka browser dan akses:
- http://brodofootwear.studio (akan redirect ke HTTPS)
- https://brodofootwear.studio
- https://www.brodofootwear.studio

### Check Nginx Logs (jika ada error)

```bash
# Access logs
sudo tail -f /var/log/nginx/brodofootwear.access.log

# Error logs
sudo tail -f /var/log/nginx/brodofootwear.error.log
```

### Check Next.js App Logs

```bash
cd /path/to/your/app
docker-compose logs -f app
```

### Test SSL Grade (Opsional)

Buka https://www.ssllabs.com/ssltest/ dan test domain Anda.

---

## 🔧 Troubleshooting

### ❌ Domain masih belum resolve

**Problem:** `nslookup brodofootwear.studio` tidak menampilkan IP yang benar

**Solusi:**
1. Cek DNS records di name.com (pastikan A records sudah benar)
2. Tunggu propagasi DNS (bisa sampai 48 jam, biasanya < 1 jam)
3. Clear DNS cache di local:
   ```powershell
   # Windows
   ipconfig /flushdns
   
   # Linux/Mac
   sudo systemd-resolve --flush-caches
   ```

### ❌ "502 Bad Gateway" saat akses domain

**Problem:** Nginx tidak bisa connect ke Next.js app

**Solusi:**
```bash
# Check apakah Next.js app running
docker-compose ps

# Check apakah port 3000 listening
sudo netstat -tulpn | grep 3000

# Restart Docker
docker-compose restart

# Check Nginx error logs
sudo tail -f /var/log/nginx/brodofootwear.error.log
```

### ❌ "Connection timed out" saat akses domain

**Problem:** Azure VM firewall/NSG memblokir port 80/443

**Solusi:**
1. Login ke Azure Portal
2. Buka VM → **Network settings**
3. Tambahkan **Inbound port rules**:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   
```bash
# Allow di firewall VM (jika pakai UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### ❌ SSL certificate gagal generate

**Problem:** Certbot error atau DNS belum propagate

**Solusi:**
```bash
# Pastikan DNS sudah resolve
nslookup brodofootwear.studio

# Pastikan port 80 terbuka
sudo ufw status

# Coba generate manual
sudo certbot certonly --nginx -d brodofootwear.studio -d www.brodofootwear.studio
```

### ❌ "ERR_TOO_MANY_REDIRECTS"

**Problem:** Infinite redirect loop

**Solusi:**
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/brodofootwear.studio

# Pastikan ada:
proxy_set_header X-Forwarded-Proto $scheme;

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 Monitoring & Maintenance

### Check Nginx Status

```bash
sudo systemctl status nginx
```

### Restart Nginx (jika perlu)

```bash
sudo systemctl restart nginx
```

### Check SSL Certificate Expiry

```bash
sudo certbot certificates
```

### Manual SSL Renewal (jika auto-renewal gagal)

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Monitor Logs Real-time

```bash
# Nginx access
sudo tail -f /var/log/nginx/brodofootwear.access.log

# Nginx error
sudo tail -f /var/log/nginx/brodofootwear.error.log

# Next.js app
docker-compose logs -f app
```

---

## 🎯 Checklist Lengkap

- [ ] DNS A records ditambahkan di name.com (@ dan www)
- [ ] DNS sudah propagate (test dengan `nslookup`)
- [ ] Nginx terinstall dan running di Azure VM
- [ ] Konfigurasi Nginx untuk domain sudah dibuat
- [ ] Nginx config di-test (`sudo nginx -t`) dan restart
- [ ] Port 80/443 terbuka di Azure NSG/firewall
- [ ] `next.config.mjs` sudah update domain
- [ ] `.env.production` sudah update `NEXT_PUBLIC_API_URL`
- [ ] Docker container rebuild dan running
- [ ] SSL certificate terinstall via Certbot
- [ ] HTTPS redirect berfungsi
- [ ] Website accessible via https://brodofootwear.studio
- [ ] Auto-renewal SSL di-test (`sudo certbot renew --dry-run`)

---

## 📞 Support

Jika ada masalah, check:
1. **DNS**: `nslookup brodofootwear.studio`
2. **Nginx**: `sudo nginx -t` dan `sudo systemctl status nginx`
3. **Docker**: `docker-compose ps` dan `docker-compose logs app`
4. **Firewall**: `sudo ufw status` atau Azure NSG settings
5. **Logs**: Nginx error logs dan Next.js logs

---

## 🎉 Selesai!

Website Anda sekarang live di:
- **https://brodofootwear.studio**
- **https://www.brodofootwear.studio**

Dengan SSL certificate dari Let's Encrypt (valid 90 hari, auto-renew).

---

**Last Updated:** 2025-06-01  
**Author:** GitHub Copilot  
**Azure VM IP:** 40.81.26.137  
**Domain:** brodofootwear.studio (name.com)
