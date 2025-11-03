# 🎯 SETUP NEON DATABASE - LENGKAP!

## Step 1: Daftar & Setup Neon

### 1.1 Buka Website Neon
- URL: https://neon.tech
- Click **"Sign Up"** atau **"Get Started"**

### 1.2 Sign Up dengan GitHub
- Click **"Continue with GitHub"**
- Login ke GitHub kamu
- Authorize Neon
- **ATAU** pakai email jika prefer

### 1.3 Verify Email
- Check email inbox
- Click link verification
- Back to Neon dashboard

---

## Step 2: Create Database Project

### 2.1 Create New Project
Di dashboard Neon:
- Click **"Create a project"** atau **"New Project"**

### 2.2 Konfigurasi Project
- **Project name:** `brodo-company-profile`
- **PostgreSQL version:** 16 (latest) - biarkan default
- **Region:** `AWS / Singapore (ap-southeast-1)` ← **PILIH INI!** (terdekat)
- **Compute size:** Biarkan default (0.25 CU)

### 2.3 Create Project
- Click **"Create Project"**
- Wait 10-20 detik (auto-provision database)

---

## Step 3: Get Connection String

### 3.1 Setelah Project Dibuat
Kamu akan lihat dashboard project dengan section **"Connection Details"**

### 3.2 Copy Connection String
Di section **"Connection string"**, pilih:
- **Database:** `neondb` (default)
- **Role:** `neondb_owner` (default)
- **Connection type:** Pilih **"Pooled connection"** (recommended)

**Format connection string akan seperti:**
```
postgresql://neondb_owner:xxxxx@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 3.3 Copy ke Clipboard
- Click **icon Copy** di sebelah connection string
- **PENTING:** Connection string ini sudah include password!

---

## Step 4: Update .env.local

### 4.1 Buka File .env.local
Di VS Code, buka: `.env.local`

### 4.2 Paste Connection String
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3dlZXBpbmctdGVhbC01OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_EdgEDWb5XVAVtGNz1Xiz7k1v26NIsDgjXFtLyYP6Uu

# Database Configuration - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD_HERE@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Replace dengan connection string dari Neon!**

### 4.3 Save File
- Ctrl+S atau File → Save

---

## Step 5: Restart Server & Migration

### 5.1 Stop Current Server
Di terminal yang running `npm run dev`:
```bash
Ctrl + C
```

### 5.2 Clear Cache
```powershell
Remove-Item -Recurse -Force .next
```

### 5.3 Start Server
```bash
npm run dev
```

**Wait for:**
```
✓ Compiled /instrumentation in XXXXms
✓ Ready in X.Xs
```

**Migration akan AUTO-RUN saat server start!**

---

## Step 6: Verify Migration Success

### 6.1 Check Terminal Output
Setelah server ready, terminal should NOT show error.

**Good sign:**
```
✓ Ready in 4.7s
```

**Bad sign:**
```
Error: Connection failed
Error: Migration failed
```

### 6.2 Check Migration di Neon Dashboard

**Option A: Neon Console**
1. Back to Neon dashboard
2. Click **"Tables"** di sidebar
3. Should see: `contact_submission`, `organization`, `todo`
4. **If tables muncul = SUCCESS!** ✅

**Option B: SQL Editor**
1. Di Neon dashboard, click **"SQL Editor"**
2. Run query:
```sql
SELECT * FROM contact_submission;
```
3. If no error = Table exists! ✅

---

## Step 7: Test Contact Form!

### 7.1 Buka Browser
```
http://localhost:3000/company-profile
```

### 7.2 Scroll ke Contact Form

### 7.3 Isi & Submit
- Name: `Test User`
- Email: `test@example.com`
- Subject: `Testing Neon Database`
- Message: `This is a test to verify Neon PostgreSQL connection works!`

### 7.4 Expected Result
```
✅ Terima Kasih!
Thank you for contacting us! We will get back to you soon.
```

---

## Step 8: Verify Data di Neon Dashboard

### 8.1 Back to Neon Dashboard
- Refresh page jika perlu

### 8.2 Open SQL Editor
- Click **"SQL Editor"** di sidebar

### 8.3 Query Data
```sql
SELECT * FROM contact_submission ORDER BY created_at DESC;
```

### 8.4 See Your Data!
Table will show:
- id: 1
- name: Test User
- email: test@example.com
- subject: Testing Neon Database
- message: This is a test...
- status: new
- created_at: timestamp

**DATA TERSIMPAN PERMANENT!** 🎉

---

## 🎯 SUMMARY COMMANDS:

```bash
# 1. Get Neon connection string from dashboard

# 2. Update .env.local with connection string

# 3. Restart server
npm run dev

# 4. Test form at http://localhost:3000/company-profile

# 5. Verify data in Neon SQL Editor
```

---

## 🐛 TROUBLESHOOTING:

### Error: "Connection failed" / "ETIMEDOUT"

**Cause:** Firewall atau internet issue

**Fix:**
1. Check internet connection
2. Try different network (mobile hotspot)
3. Disable VPN if any
4. Check antivirus firewall

---

### Error: "Password authentication failed"

**Cause:** Wrong connection string

**Fix:**
1. Go back to Neon dashboard
2. Click **"Connection Details"**
3. Click **"Reset password"** (generate new)
4. Copy NEW connection string
5. Update .env.local
6. Restart server

---

### Error: "SSL connection required"

**Cause:** Missing `?sslmode=require` di connection string

**Fix:**
Make sure connection string ends with:
```
...neon.tech/neondb?sslmode=require
```

---

### Tables tidak dibuat otomatis

**Fix:**
```bash
# Manual run migration
npm run db:generate

# Restart server
npm run dev
```

---

## ✅ SUCCESS INDICATORS:

- [ ] Neon project created
- [ ] Connection string copied
- [ ] .env.local updated
- [ ] Server starts without error
- [ ] `✓ Ready in X.Xs` appears
- [ ] Contact form submits successfully
- [ ] Green success message shows
- [ ] Data appears in Neon SQL Editor

---

## 📊 BENEFITS OF NEON:

✅ **Persistent Data** - Data tidak hilang saat restart
✅ **Free Tier** - 0.5GB storage gratis
✅ **Cloud Access** - Bisa diakses dari mana saja
✅ **Auto Backup** - Data aman
✅ **Production Ready** - Bisa untuk deployment
✅ **Fast** - AWS Singapore (low latency)

---

## 🎓 WHAT YOU'RE DOING:

```
Local App (Next.js)
      ↓
API Route (/api/contact)
      ↓
Drizzle ORM
      ↓
Internet
      ↓
Neon Cloud (AWS Singapore)
      ↓
PostgreSQL Database
      ↓
Table: contact_submission
```

---

**Created:** November 2, 2025  
**Estimated Time:** 10-15 menit total  
**Success Rate:** 95%+ dengan internet bagus

**MARI KITA COBA! 🚀**
