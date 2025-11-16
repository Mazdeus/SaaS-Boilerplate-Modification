# 🚀 Quick Commands Cheat Sheet

Referensi cepat untuk command-command yang sering dipakai.

---

## 📡 DNS Checks

### Check DNS Propagation (Windows/PowerShell)
```powershell
# Run script
.\scripts\check-dns.ps1

# Manual check
nslookup brodofootwear.studio
nslookup www.brodofootwear.studio

# Flush DNS cache
ipconfig /flushdns
```

### Check DNS Propagation (Linux/Mac/Bash)
```bash
# Run script
./scripts/check-dns.sh

# Manual check
nslookup brodofootwear.studio
dig brodofootwear.studio +short

# Flush DNS cache (Linux)
sudo systemd-resolve --flush-caches

# Flush DNS cache (Mac)
sudo dscacheutil -flushcache
```

---

## 🖥️ Azure VM - SSH & Basic Commands

### SSH ke Azure VM
```bash
ssh azureuser@40.81.26.137
# Ganti 'azureuser' dengan username VM Anda
```

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

### Check Running Processes
```bash
top
htop  # jika terinstall
```

---

## 🐳 Docker Commands

### Check Running Containers
```bash
docker ps
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Restart Containers
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app

# Stop and start (rebuild)
docker-compose down
docker-compose up -d --build
```

### Rebuild After Code Changes
```bash
# Stop containers
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Check logs
docker-compose logs -f app
```

### Clean Up Docker
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

---

## 🌐 Nginx Commands

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### Start/Stop/Restart Nginx
```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx  # Reload config without downtime
```

### Test Nginx Configuration
```bash
sudo nginx -t
```

### View Nginx Logs
```bash
# Access log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/brodofootwear.access.log

# Error log
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/brodofootwear.error.log
```

### Edit Nginx Configuration
```bash
# Edit site config
sudo nano /etc/nginx/sites-available/brodofootwear.studio

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 🔐 SSL/Certbot Commands

### Setup SSL (First Time)
```bash
# Run automated script
sudo ./scripts/setup-ssl.sh

# Manual setup
sudo certbot --nginx -d brodofootwear.studio -d www.brodofootwear.studio
```

### Check SSL Certificates
```bash
sudo certbot certificates
```

### Renew SSL Manually
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

### Delete Certificate (if needed)
```bash
sudo certbot delete --cert-name brodofootwear.studio
```

---

## 🔥 Firewall Commands (UFW)

### Check Firewall Status
```bash
sudo ufw status
sudo ufw status verbose
```

### Allow Ports
```bash
# HTTP
sudo ufw allow 80/tcp

# HTTPS
sudo ufw allow 443/tcp

# SSH
sudo ufw allow 22/tcp

# Docker port (if needed)
sudo ufw allow 3000/tcp
```

### Enable/Disable Firewall
```bash
sudo ufw enable
sudo ufw disable
```

### Delete Rule
```bash
sudo ufw delete allow 3000/tcp
```

---

## 🔍 Troubleshooting Commands

### Check Port Listening
```bash
# Check if port 3000 is listening
sudo netstat -tulpn | grep 3000

# Check if Nginx is listening on 80/443
sudo netstat -tulpn | grep nginx
```

### Check Process Using a Port
```bash
# Find process on port 3000
sudo lsof -i :3000

# Kill process (if needed)
sudo kill -9 <PID>
```

### Test Connection to Next.js App
```bash
# From VM
curl http://localhost:3000

# Test proxy
curl -I http://localhost
```

### Check System Logs
```bash
# System logs
sudo journalctl -xe

# Nginx logs
sudo journalctl -u nginx

# Docker logs
sudo journalctl -u docker
```

---

## 📊 Monitoring Commands

### Real-time Resource Monitoring
```bash
# CPU/Memory
top

# Better UI (if installed)
htop

# Disk I/O
iotop  # requires sudo

# Network
iftop  # requires sudo
```

### Check System Info
```bash
# OS version
cat /etc/os-release

# Kernel version
uname -a

# CPU info
lscpu

# Memory info
cat /proc/meminfo
```

---

## 🗂️ File Management Commands

### Navigate & View Files
```bash
# Go to app directory
cd /path/to/your/app

# List files
ls -lah

# View file
cat filename
less filename  # scrollable
nano filename  # edit
```

### Copy/Move/Delete
```bash
# Copy
cp source destination
cp -r folder/ destination/  # recursive (folders)

# Move/Rename
mv source destination

# Delete
rm filename
rm -rf folder/  # recursive (BE CAREFUL!)
```

### Change Permissions
```bash
# Make script executable
chmod +x script.sh

# Change ownership
sudo chown user:group filename
```

---

## 🔄 Quick Deployment Workflow

### After Code Changes (Local → VM)

```bash
# 1. On local machine: Commit & push
git add .
git commit -m "Your changes"
git push origin revised

# 2. SSH to VM
ssh azureuser@40.81.26.137

# 3. Pull latest code
cd /path/to/your/app
git pull origin revised

# 4. Rebuild Docker
docker-compose down
docker-compose up -d --build

# 5. Check logs
docker-compose logs -f app

# 6. Test site
curl http://localhost:3000
```

---

## 🧪 Testing Commands

### Test Website Locally
```bash
# Test HTTP
curl http://brodofootwear.studio

# Test HTTPS
curl https://brodofootwear.studio

# Test with headers
curl -I https://brodofootwear.studio

# Test redirect
curl -L http://brodofootwear.studio
```

### Test from Browser
1. Open: https://brodofootwear.studio
2. Check SSL: Klik icon gembok di address bar
3. Open DevTools (F12) → Network → Refresh

### Test SSL Grade
- Online tool: https://www.ssllabs.com/ssltest/
- Masukkan: brodofootwear.studio

---

## 📝 Useful Aliases (Optional)

Tambahkan di `~/.bashrc` atau `~/.zshrc`:

```bash
# Docker aliases
alias dps='docker ps'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'
alias dcu='docker-compose up -d --build'
alias dcd='docker-compose down'

# Nginx aliases
alias ngtest='sudo nginx -t'
alias ngreload='sudo systemctl reload nginx'
alias ngrestart='sudo systemctl restart nginx'
alias nglogs='sudo tail -f /var/log/nginx/error.log'

# SSL aliases
alias sslcheck='sudo certbot certificates'
alias sslrenew='sudo certbot renew && sudo systemctl reload nginx'

# App directory
alias gotoapp='cd /path/to/your/app'

# Git shortcuts
alias gs='git status'
alias gp='git pull'
alias gc='git commit -m'
```

Reload bashrc:
```bash
source ~/.bashrc
```

---

## 🆘 Emergency Commands

### If Site is Down - Quick Fix

```bash
# 1. Check Docker
docker-compose ps
docker-compose restart

# 2. Check Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# 3. Check logs
docker-compose logs --tail=50 app
sudo tail -f /var/log/nginx/brodofootwear.error.log

# 4. Check ports
sudo netstat -tulpn | grep 3000
sudo netstat -tulpn | grep nginx
```

### If Out of Disk Space

```bash
# Check space
df -h

# Clean Docker
docker system prune -a

# Clean logs
sudo journalctl --vacuum-time=7d

# Find large files
sudo du -sh /* | sort -h
```

### If Memory is Full

```bash
# Check memory
free -h

# Restart services
docker-compose restart
sudo systemctl restart nginx

# Reboot VM (last resort)
sudo reboot
```

---

## 📚 Helpful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Docker Docs**: https://docs.docker.com
- **Nginx Docs**: https://nginx.org/en/docs/
- **Certbot Docs**: https://certbot.eff.org/docs/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **DNS Checker**: https://dnschecker.org

---

**Quick Reference:** Print this page and keep handy! 🖨️
