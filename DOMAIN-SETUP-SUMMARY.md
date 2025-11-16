# 🌐 Domain Setup Summary - brodofootwear.studio

**Quick overview of domain setup process and status.**

---

## 📊 Current Status

### Domain Information
- **Domain:** brodofootwear.studio
- **Registrar:** name.com
- **Nameservers:** name.com default
- **DNS Provider:** name.com

### Infrastructure
- **Hosting:** Azure Virtual Machine
- **IP Address:** 40.81.26.137
- **Web Server:** Nginx (reverse proxy)
- **Application:** Next.js (Docker)
- **SSL:** Let's Encrypt (Free, auto-renew)

---

## ✅ Setup Checklist

### Phase 1: DNS Configuration (name.com)
- [ ] Login to name.com dashboard
- [ ] Add A record: `@` → `40.81.26.137`
- [ ] Add A record: `www` → `40.81.26.137`
- [ ] Wait for DNS propagation (5 min - 48 hours)
- [ ] Verify with: `nslookup brodofootwear.studio`

**Tools:**
- Script: `.\scripts\check-dns.ps1` (Windows)
- Script: `./scripts/check-dns.sh` (Linux/Mac)

---

### Phase 2: Azure VM Configuration

#### Firewall/NSG Rules
- [ ] Open port 80 (HTTP) in Azure NSG
- [ ] Open port 443 (HTTPS) in Azure NSG
- [ ] Configure UFW firewall on VM (if applicable)

#### Commands:
```bash
# Azure Portal
VM → Network settings → Add inbound port rule

# VM Firewall (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

### Phase 3: Nginx Setup

- [ ] SSH to Azure VM
- [ ] Install Nginx: `sudo apt install nginx`
- [ ] Create site config: `/etc/nginx/sites-available/brodofootwear.studio`
- [ ] Enable site: `sudo ln -s ...`
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

**Reference:** [SETUP-DOMAIN-BRODOFOOTWEAR.md](SETUP-DOMAIN-BRODOFOOTWEAR.md) - Step 2

---

### Phase 4: SSL Certificate (Let's Encrypt)

- [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx`
- [ ] Generate certificate: `sudo certbot --nginx -d brodofootwear.studio -d www.brodofootwear.studio`
- [ ] Choose redirect HTTP to HTTPS
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`

**Automated Script:**
```bash
sudo ./scripts/setup-ssl.sh
```

**Reference:** [SETUP-DOMAIN-BRODOFOOTWEAR.md](SETUP-DOMAIN-BRODOFOOTWEAR.md) - Step 4

---

### Phase 5: Next.js Configuration

- [ ] Update `next.config.mjs` with domain
- [ ] Update `.env.production` with `NEXT_PUBLIC_API_URL`
- [ ] Rebuild Docker: `docker-compose down && docker-compose up -d --build`
- [ ] Verify app is running: `docker-compose logs -f app`

**Reference:** [SETUP-DOMAIN-BRODOFOOTWEAR.md](SETUP-DOMAIN-BRODOFOOTWEAR.md) - Step 3

---

### Phase 6: Testing & Verification

- [ ] Test HTTP: `http://brodofootwear.studio` (should redirect to HTTPS)
- [ ] Test HTTPS: `https://brodofootwear.studio`
- [ ] Test WWW: `https://www.brodofootwear.studio`
- [ ] Verify SSL certificate (click lock icon in browser)
- [ ] Test SSL grade: https://www.ssllabs.com/ssltest/
- [ ] Check all pages work correctly
- [ ] Test CMS login: `https://brodofootwear.studio/cms/login`

---

## 🔧 Troubleshooting Guide

### DNS Not Resolving
**Problem:** `nslookup brodofootwear.studio` returns wrong IP or error

**Solutions:**
1. Check DNS records at name.com (must be `40.81.26.137`)
2. Wait for DNS propagation (up to 48 hours)
3. Flush local DNS cache:
   - Windows: `ipconfig /flushdns`
   - Linux: `sudo systemd-resolve --flush-caches`
   - Mac: `sudo dscacheutil -flushcache`

---

### 502 Bad Gateway
**Problem:** Nginx shows "502 Bad Gateway"

**Causes & Solutions:**
- **Next.js app not running**
  ```bash
  docker-compose ps
  docker-compose up -d
  ```
- **Wrong proxy port in Nginx**
  ```bash
  # Check Nginx config
  sudo nano /etc/nginx/sites-available/brodofootwear.studio
  # Ensure: proxy_pass http://localhost:3000;
  ```
- **Check logs**
  ```bash
  docker-compose logs -f app
  sudo tail -f /var/log/nginx/brodofootwear.error.log
  ```

---

### Connection Timed Out
**Problem:** Cannot access site, connection times out

**Causes & Solutions:**
- **Azure NSG blocking ports**
  - Azure Portal → VM → Network settings
  - Add inbound rules for port 80 and 443
- **VM firewall blocking**
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  ```
- **Nginx not running**
  ```bash
  sudo systemctl status nginx
  sudo systemctl start nginx
  ```

---

### SSL Certificate Failed
**Problem:** Certbot fails to generate certificate

**Causes & Solutions:**
- **DNS not propagated yet**
  - Wait and verify: `nslookup brodofootwear.studio`
- **Port 80 blocked**
  - Check Azure NSG and UFW
- **Nginx config error**
  ```bash
  sudo nginx -t
  ```

---

### ERR_TOO_MANY_REDIRECTS
**Problem:** Browser shows infinite redirect loop

**Solution:**
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/brodofootwear.studio

# Ensure this line exists in location block:
proxy_set_header X-Forwarded-Proto $scheme;

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📁 Important Files & Locations

### On Azure VM

**Nginx Configuration:**
```
/etc/nginx/sites-available/brodofootwear.studio
/etc/nginx/sites-enabled/brodofootwear.studio
```

**Nginx Logs:**
```
/var/log/nginx/brodofootwear.access.log
/var/log/nginx/brodofootwear.error.log
```

**SSL Certificates:**
```
/etc/letsencrypt/live/brodofootwear.studio/fullchain.pem
/etc/letsencrypt/live/brodofootwear.studio/privkey.pem
```

**Application:**
```
/path/to/your/app/
├── .env.production
├── next.config.mjs
├── docker-compose.yml
└── Dockerfile
```

---

### In Project Repository

**Documentation:**
```
SETUP-DOMAIN-BRODOFOOTWEAR.md  # Main setup guide
COMMANDS-CHEATSHEET.md         # Quick commands reference
DOMAIN-SETUP-GUIDE.md          # General domain guide
DEPLOYMENT-STEPS.md            # Docker deployment guide
```

**Scripts:**
```
scripts/check-dns.ps1          # Windows DNS check
scripts/check-dns.sh           # Linux/Mac DNS check
scripts/setup-ssl.sh           # Automated SSL setup
```

---

## 🚀 Quick Deploy After Code Changes

```bash
# 1. Local: Push to GitHub
git add .
git commit -m "Your changes"
git push origin revised

# 2. SSH to Azure VM
ssh azureuser@40.81.26.137

# 3. Pull latest code
cd /path/to/your/app
git pull origin revised

# 4. Rebuild Docker
docker-compose down
docker-compose up -d --build

# 5. Verify
docker-compose logs -f app
curl https://brodofootwear.studio
```

**Full reference:** [COMMANDS-CHEATSHEET.md](COMMANDS-CHEATSHEET.md)

---

## 📞 Support Resources

### Documentation
- **Main Guide:** [SETUP-DOMAIN-BRODOFOOTWEAR.md](SETUP-DOMAIN-BRODOFOOTWEAR.md)
- **Commands:** [COMMANDS-CHEATSHEET.md](COMMANDS-CHEATSHEET.md)
- **Deployment:** [DEPLOYMENT-STEPS.md](DEPLOYMENT-STEPS.md)

### External Resources
- **DNS Checker:** https://dnschecker.org
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **Next.js Docs:** https://nextjs.org/docs
- **Nginx Docs:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/docs/

### Quick Commands
```bash
# Check DNS
.\scripts\check-dns.ps1

# Check site status
curl -I https://brodofootwear.studio

# View logs
docker-compose logs -f app
sudo tail -f /var/log/nginx/brodofootwear.error.log

# Restart services
docker-compose restart
sudo systemctl restart nginx
```

---

## 📊 Expected Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | DNS configuration at name.com | 5 minutes |
| 2 | DNS propagation (wait time) | 5 min - 48 hours |
| 3 | Azure NSG/firewall setup | 5 minutes |
| 4 | Nginx installation & config | 10 minutes |
| 5 | SSL certificate generation | 5 minutes |
| 6 | Next.js config update | 5 minutes |
| 7 | Testing & verification | 10 minutes |
| **Total** | **Active work** | **~40 minutes** |
| | **+ DNS propagation** | **varies** |

---

## ✅ Post-Setup Maintenance

### Regular Checks
- [ ] Monitor SSL certificate expiry (auto-renews 30 days before)
- [ ] Check disk space: `df -h`
- [ ] Monitor logs for errors
- [ ] Backup database regularly
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`

### SSL Auto-Renewal
Certbot auto-renews certificates via systemd timer. Verify:
```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

### Monitoring Commands
```bash
# Check all services
sudo systemctl status nginx
docker-compose ps

# View recent logs
docker-compose logs --tail=100 app
sudo tail -100 /var/log/nginx/brodofootwear.error.log

# Check SSL expiry
sudo certbot certificates
```

---

**Setup Date:** 2025-06-01  
**Domain:** brodofootwear.studio  
**IP:** 40.81.26.137  
**SSL:** Let's Encrypt (90-day, auto-renew)
