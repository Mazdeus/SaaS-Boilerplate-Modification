# 🔐 Guide: Generate Production Secrets

## ⚠️ IMPORTANT: Security Best Practices

**NEVER use the example secrets in production!** Always generate unique, random secrets for your production environment.

---

## 📋 How to Generate Secrets

### Method 1: Using OpenSSL (Recommended)

On your Azure VM or any Linux/Mac terminal:

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate SESSION_SECRET
openssl rand -hex 32
```

**Output example:**
```
a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6
```

### Method 2: Using Node.js

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Method 3: Using PowerShell (Windows)

```powershell
# Generate JWT_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# Generate SESSION_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

---

## 📝 Example `.env.production` Template

```bash
# ====================================
# BRODO CMS - PRODUCTION ENVIRONMENT
# ====================================

# Public URL (your custom domain)
NEXT_PUBLIC_API_URL=https://brodofootwear.studio/api

# Database Connection
DATABASE_URL="postgresql://brodo_user:YOUR_DB_PASSWORD@localhost:5432/brodo_db"

# JWT Secret (MUST be 32+ characters, use openssl rand -hex 32)
JWT_SECRET="REPLACE_WITH_GENERATED_SECRET_FROM_OPENSSL_64_CHARS"

# Session Secret (MUST be 32+ characters, use openssl rand -hex 32)
SESSION_SECRET="REPLACE_WITH_GENERATED_SECRET_FROM_OPENSSL_64_CHARS"

# Session Duration (10 minutes = 600000 ms)
SESSION_MAX_AGE=600000

# Environment
NODE_ENV=production

# Optional: Add if you need image uploads to work
NEXT_PUBLIC_BASE_URL=https://brodofootwear.studio
```

---

## 🚀 Steps to Set Up Production Secrets

### On Your Azure VM:

1. **Generate secrets:**
   ```bash
   cd ~/SaaS-Boilerplate-Modification
   
   # Generate JWT_SECRET
   echo "JWT_SECRET=$(openssl rand -hex 32)"
   
   # Generate SESSION_SECRET
   echo "SESSION_SECRET=$(openssl rand -hex 32)"
   ```

2. **Edit `.env.production`:**
   ```bash
   nano .env.production
   ```

3. **Copy the generated secrets and paste them into the file:**
   ```bash
   JWT_SECRET="a7f3c9e1b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6"
   SESSION_SECRET="b8g4d0f2c5e7a9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9"
   ```

4. **Save and exit:**
   - Press `Ctrl + O` (save)
   - Press `Enter`
   - Press `Ctrl + X` (exit)

5. **Verify the file:**
   ```bash
   cat .env.production
   ```

6. **Restart Docker container:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

---

## ✅ Security Checklist

- [ ] JWT_SECRET is at least 32 characters (64 recommended)
- [ ] SESSION_SECRET is at least 32 characters (64 recommended)
- [ ] Secrets are randomly generated (not example values)
- [ ] `.env.production` is NOT committed to Git
- [ ] `.env.production` has restricted permissions: `chmod 600 .env.production`
- [ ] Database password is strong and unique
- [ ] All secrets are different from each other

---

## 🔒 Securing Your `.env.production`

```bash
# Set proper permissions (only owner can read/write)
chmod 600 .env.production

# Verify permissions
ls -l .env.production
# Should show: -rw------- (owner read/write only)
```

---

## 🧪 Test Your Configuration

After setting up secrets, test your app:

1. **Check if app is running:**
   ```bash
   docker-compose ps
   docker-compose logs app
   ```

2. **Test login:**
   - Go to: https://brodofootwear.studio/cms/login
   - Try logging in with your CMS user
   - Check if session persists for 10 minutes

3. **Test API:**
   ```bash
   curl https://brodofootwear.studio/api/collections
   ```

---

## ⚠️ Troubleshooting

### Error: "Invalid JWT secret"
- Make sure JWT_SECRET is at least 32 characters
- Check for extra spaces or quotes in `.env.production`
- Restart Docker: `docker-compose restart`

### Error: "Session expired immediately"
- Make sure SESSION_SECRET is properly set
- Check SESSION_MAX_AGE is 600000 (10 minutes)
- Clear browser cookies and try again

### Error: "Cannot read .env.production"
- Check file exists: `ls -la .env.production`
- Check permissions: `chmod 600 .env.production`
- Make sure Docker Compose mounts the file correctly

---

## 📚 Related Documentation

- [PRODUCTION-ENV-SETUP.md](./PRODUCTION-ENV-SETUP.md)
- [DEPLOYMENT-STEPS.md](./DEPLOYMENT-STEPS.md)
- [SETUP-DOMAIN-BRODOFOOTWEAR.md](./SETUP-DOMAIN-BRODOFOOTWEAR.md)

---

**Created:** 2025-01-16  
**Last Updated:** 2025-01-16  
**Author:** Brodo CMS Team
