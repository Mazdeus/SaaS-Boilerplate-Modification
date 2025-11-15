# Authentication Issues in Production - Troubleshooting Guide

## Problem: Cannot Login to CMS in Production

### Symptoms
- Login shows "Login successful!" toast
- But doesn't redirect to dashboard
- Accessing `/cms/dashboard` redirects back to login
- No errors in console
- Works fine in development but not in production

### Root Cause
The issue is related to **HTTP vs HTTPS cookie security settings**.

When `secure: true` is set in cookie options, browsers will ONLY send cookies over HTTPS connections. Since the Azure VM is accessed via HTTP (http://40.81.26.137:3000), the cookie is never set.

### Solution Applied

Changed cookie settings in `src/app/api/auth/login/route.ts`:

**Before:**
```typescript
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ❌ Forces HTTPS in production
  sameSite: 'lax',
  maxAge: 60 * 10,
  path: '/',
});
```

**After:**
```typescript
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: false, // ✅ Allows HTTP connections
  sameSite: 'lax',
  maxAge: 60 * 10,
  path: '/',
});
```

### When to Use `secure: true`

Only set `secure: true` when:
- ✅ You have HTTPS enabled (SSL/TLS certificate)
- ✅ Using a domain with Let's Encrypt or commercial SSL
- ✅ Using HTTPS reverse proxy (Nginx with SSL)

Keep `secure: false` when:
- ✅ Accessing via IP address with HTTP (like 40.81.26.137:3000)
- ✅ Local development
- ✅ No SSL certificate

### Debugging Steps

1. **Check if cookie is being set:**
   - Open browser DevTools → Application → Cookies
   - Look for `auth_token` cookie
   - If missing, check `secure` flag

2. **Check Docker logs:**
   ```bash
   docker-compose logs -f | grep Login
   docker-compose logs -f | grep Auth
   ```

3. **Check browser console:**
   - Login should log: `[Login] Success response`
   - Should log: `[Login] Token stored in localStorage`
   - Should log: `[Login] Auth check successful`

4. **Test API directly:**
   ```bash
   # Login
   curl -X POST http://40.81.26.137:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@brodo.com","password":"your-password"}' \
     -c cookies.txt
   
   # Check if logged in
   curl http://40.81.26.137:3000/api/auth/me \
     -b cookies.txt
   ```

### Environment-Specific Settings

For better environment handling, you can use:

```typescript
const isHttpsEnabled = process.env.NEXT_PUBLIC_API_URL?.startsWith('https://');

response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: isHttpsEnabled, // Auto-detect based on API URL
  sameSite: 'lax',
  maxAge: 60 * 10,
  path: '/',
});
```

### Migration to HTTPS (Recommended for Production)

To enable HTTPS on Azure VM:

1. **Get a domain name** (e.g., brodo-cms.yourdomain.com)

2. **Install Nginx as reverse proxy:**
   ```bash
   sudo apt install nginx
   ```

3. **Install SSL certificate with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d brodo-cms.yourdomain.com
   ```

4. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name brodo-cms.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name brodo-cms.yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/brodo-cms.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/brodo-cms.yourdomain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Update `.env.production`:**
   ```bash
   NEXT_PUBLIC_API_URL="https://brodo-cms.yourdomain.com"
   ```

6. **Change `secure` back to `true`:**
   ```typescript
   response.cookies.set('auth_token', token, {
     httpOnly: true,
     secure: true, // Now safe to use with HTTPS
     sameSite: 'lax',
     maxAge: 60 * 10,
     path: '/',
   });
   ```

### Security Considerations

**Current Setup (HTTP with secure: false):**
- ⚠️ Cookies can be intercepted in transit
- ⚠️ Man-in-the-middle attacks possible
- ⚠️ Not recommended for production with sensitive data
- ✅ OK for internal tools or development

**Recommended Setup (HTTPS with secure: true):**
- ✅ Cookies encrypted in transit
- ✅ Protected from interception
- ✅ Industry standard for production
- ✅ Required for payment/sensitive data

### Testing After Fix

1. **Clear browser cookies:**
   - DevTools → Application → Cookies → Delete all

2. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   ```

3. **Hard refresh:**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

4. **Try login again**

5. **Check cookie is set:**
   - DevTools → Application → Cookies
   - Should see `auth_token` with value

6. **Verify dashboard access:**
   - Should redirect to `/cms/dashboard`
   - Should show welcome message with username

### Quick Fix Checklist

- [x] Changed `secure: false` in login route
- [x] Added console logging for debugging
- [x] Added auth check before redirect
- [x] Updated documentation
- [ ] Clear cookies in browser
- [ ] Test login
- [ ] Verify dashboard access
- [ ] Check Docker logs for "[Login]" messages

### If Still Not Working

1. **Restart Docker containers:**
   ```bash
   docker-compose restart
   ```

2. **Check if changes deployed:**
   ```bash
   git pull
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Verify environment variables:**
   ```bash
   cat .env.production
   # JWT_SECRET should be set
   ```

4. **Check database connection:**
   ```bash
   docker-compose logs | grep "database"
   ```

5. **Enable verbose logging:**
   Add to `.env.production`:
   ```bash
   DEBUG=true
   NODE_ENV=production
   ```

### Contact & Support

If issue persists, collect:
- Browser console logs (screenshot)
- Docker logs: `docker-compose logs --tail=100`
- Network tab screenshot (DevTools)
- Cookie settings screenshot

Then check:
- GitHub Issues
- Documentation
- Stack Overflow
