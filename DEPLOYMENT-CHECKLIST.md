# 🚀 Deployment Checklist untuk brodofootwear.studio

## ✅ Status Konfigurasi

### 1. Next.js Configuration (`next.config.mjs`)
- ✅ `output: 'standalone'` - **SUDAH DITAMBAHKAN**
- ✅ Domain configuration untuk `brodofootwear.studio`
- ✅ Security headers (X-Frame-Options, CSP, dll)
- ✅ Image domains untuk production

### 2. Environment Variables (`.env.production`)
⚠️ **PERLU DIPERBARUI** dengan nilai yang Anda buat:
```bash
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
JWT_SECRET="1f04f4534b4ee73eb1503eb4d45e82259f40956652557b111ca88fdd8995a7b8"
NEXT_PUBLIC_API_URL="http://40.81.26.137:3000"  # Atau https://brodofootwear.studio setelah SSL
```

**PENTING**: Setelah domain aktif, ubah `NEXT_PUBLIC_API_URL` menjadi:
```bash
NEXT_PUBLIC_API_URL="https://brodofootwear.studio"
```

### 3. Docker Configuration
- ✅ Dockerfile multi-stage build
- ✅ docker-compose.yml dengan healthcheck
- ✅ .dockerignore untuk optimasi build

### 4. Domain & DNS (name.com)
📋 **LANGKAH-LANGKAH**:

#### A. Setup DNS Records di name.com
1. Login ke https://www.name.com
2. Pilih domain `brodofootwear.studio`
3. Buka DNS Settings
4. Tambahkan/Edit records:

```
Type    Host    Answer              TTL
A       @       40.81.26.137        300 (5 menit)
A       www     40.81.26.137        300
```

5. Tunggu propagasi DNS (5-30 menit)
6. Test dengan: `nslookup brodofootwear.studio`

#### B. Setup SSL/HTTPS dengan Let's Encrypt
**Di Azure VM**, jalankan:

```bash
# Install Nginx (reverse proxy)
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y

# Stop sementara jika ada service di port 80
sudo systemctl stop nginx

# Dapatkan SSL certificate
sudo certbot certonly --standalone -d brodofootwear.studio -d www.brodofootwear.studio

# Configure Nginx
sudo nano /etc/nginx/sites-available/brodo
```

**Nginx Configuration** (`/etc/nginx/sites-available/brodo`):
```nginx
server {
    listen 80;
    server_name brodofootwear.studio www.brodofootwear.studio;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name brodofootwear.studio www.brodofootwear.studio;

    ssl_certificate /etc/letsencrypt/live/brodofootwear.studio/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/brodofootwear.studio/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/brodo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

# Auto-renew SSL
sudo certbot renew --dry-run
```

## 📦 Deployment Steps

### Step 1: Commit & Push Perubahan
```powershell
git add .
git commit -m "fix: add standalone output to next.config.mjs for Docker"
git push origin revised
```

### Step 2: Deploy ke Azure VM
```bash
# SSH ke VM
ssh azureuser@40.81.26.137

# Navigate to project
cd ~/brodo-cms

# Pull latest changes
git pull origin revised

# PENTING: Edit .env.production dengan nilai sebenarnya
nano .env.production

# Rebuild & restart containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f brodo-cms

# Check health
curl http://localhost:3000/api/health
```

### Step 3: Verify Deployment
1. **Local check** (di VM):
   ```bash
   curl http://localhost:3000
   curl http://localhost:3000/api/health
   ```

2. **External check** (dari browser Anda):
   - http://40.81.26.137:3000
   - http://brodofootwear.studio (setelah DNS propagasi)
   - https://brodofootwear.studio (setelah SSL setup)

3. **Test functionality**:
   - ✅ Homepage loads
   - ✅ CMS login: https://brodofootwear.studio/cms/login
   - ✅ Collections page
   - ✅ Stores page
   - ✅ Contact form
   - ✅ Instagram page (Juicer embed)

## 🔧 Troubleshooting

### Issue: Docker build fails
```bash
# Check Docker logs
docker-compose logs brodo-cms

# Rebuild with verbose output
docker-compose build --no-cache --progress=plain

# Check disk space
df -h
```

### Issue: Container keeps restarting
```bash
# Check logs
docker logs brodo-cms-app

# Check environment variables
docker exec brodo-cms-app env | grep -E 'DATABASE_URL|JWT_SECRET'

# Test database connection
docker exec brodo-cms-app node -e "console.log(process.env.DATABASE_URL)"
```

### Issue: 502 Bad Gateway (Nginx)
```bash
# Check if Next.js is running
curl http://localhost:3000

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: DNS not resolving
```bash
# Test DNS propagation
nslookup brodofootwear.studio
dig brodofootwear.studio

# Check online: https://www.whatsmydns.net/
```

### Issue: SSL certificate fails
```bash
# Make sure ports 80 and 443 are open in Azure Network Security Group
# Make sure DNS is pointing to your VM
# Try manual certificate request:
sudo certbot certonly --manual -d brodofootwear.studio
```

## 📋 Post-Deployment Checklist

- [ ] DNS records added to name.com
- [ ] DNS propagation verified (brodofootwear.studio resolves to 40.81.26.137)
- [ ] SSL certificate obtained with Let's Encrypt
- [ ] Nginx configured as reverse proxy
- [ ] Docker container running successfully
- [ ] .env.production updated with correct values
- [ ] NEXT_PUBLIC_API_URL updated to https://brodofootwear.studio
- [ ] All pages load correctly on HTTPS
- [ ] CMS login works
- [ ] Database connection successful
- [ ] Instagram Juicer embed loads
- [ ] Contact form submissions work
- [ ] Image uploads work
- [ ] Mobile responsiveness verified
- [ ] SSL auto-renewal configured

## 🎯 Final Configuration Summary

### Environment Variables (Production)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
JWT_SECRET=<your-generated-secret>
NEXT_PUBLIC_API_URL=https://brodofootwear.studio
NODE_ENV=production
```

### URLs
- **Public Site**: https://brodofootwear.studio
- **CMS Login**: https://brodofootwear.studio/cms/login
- **API Endpoint**: https://brodofootwear.studio/api
- **Health Check**: https://brodofootwear.studio/api/health

### Ports
- **80** (HTTP) → Nginx → redirect to HTTPS
- **443** (HTTPS) → Nginx → proxy to localhost:3000
- **3000** (Next.js) → Docker container (internal only)

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs/deployment
- **Docker Docs**: https://docs.docker.com/
- **Let's Encrypt**: https://letsencrypt.org/getting-started/
- **Nginx Docs**: https://nginx.org/en/docs/
- **name.com Support**: https://www.name.com/support

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Domain**: brodofootwear.studio
**Server**: Azure VM (40.81.26.137)
