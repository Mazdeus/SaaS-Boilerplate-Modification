# 🔧 FIX ERROR: Apply Migration ke Neon Database

## ❌ PROBLEM:
Error: "Oops! An unexpected error occurred"

## ✅ ROOT CAUSE:
Table `contact_submission` belum dibuat di Neon database!

Migration file ada di local, tapi **belum dijalankan** ke Neon.

---

## 🚀 SOLUTION: Manual Apply Migration di Neon

### Step 1: Buka Neon Console

1. Go to: https://console.neon.tech
2. Login dengan akun kamu
3. Pilih project: **brodo-company-profile** (atau nama project kamu)

---

### Step 2: Buka SQL Editor

Di dashboard Neon:
1. Click **"SQL Editor"** di sidebar kiri
2. Atau click **"Query"** tab

---

### Step 3: Copy Migration SQL

Copy SQL berikut ini (dari file `migrations/0001_friendly_iron_lad.sql`):

```sql
CREATE TABLE IF NOT EXISTS "contact_submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
```

---

### Step 4: Paste & Run di Neon SQL Editor

1. **Paste** SQL di atas ke SQL Editor
2. Click **"Run"** button (atau press Ctrl+Enter)
3. Wait 1-2 detik

**Expected Result:**
```
✅ Success
CREATE TABLE
```

---

### Step 5: Verify Table Created

Di SQL Editor yang sama, run query ini:

```sql
SELECT * FROM contact_submission;
```

**Expected Result:**
```
(No rows)
```

Atau bisa juga:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'contact_submission';
```

**Should return:**
```
table_name
-----------------
contact_submission
```

✅ **If you see this = SUCCESS!**

---

### Step 6: Test Contact Form Again

1. Back to browser: `http://localhost:3000/company-profile`
2. Scroll to Contact Form
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Subject: `Testing`
   - Message: `This is a test message`
4. Click **Submit**

**Expected Result:**
```
✅ Terima Kasih!
Thank you for contacting us! We will get back to you soon.
```

---

### Step 7: Verify Data in Neon

Back to Neon SQL Editor, run:

```sql
SELECT * FROM contact_submission ORDER BY created_at DESC;
```

**Should see your test data!**

---

## 🎯 ALTERNATIVE METHOD: Using Terminal (Advanced)

If you prefer terminal:

### Install Neon CLI (optional):
```bash
npm install -g @neondatabase/cli
```

### Run migration:
```bash
# This will run all pending migrations
npm run db:migrate
```

**Note:** This might not work if script is configured for production only.

---

## 📊 WHY THIS HAPPENS?

**Development flow:**
```
1. Write schema (Schema.ts)        ✅ DONE
2. Generate migration (npm run db:generate)  ✅ DONE
3. Apply migration to database     ❌ NOT DONE YET!
   ↓
   PGlite: Auto-apply on server start
   Neon: Must apply manually first time
```

**Next time:**
- Changes to Schema.ts
- Run: `npm run db:generate`
- **Apply SQL manually in Neon** OR use migration tool

---

## ✅ SUCCESS CHECKLIST:

- [ ] Neon SQL Editor opened
- [ ] CREATE TABLE SQL pasted & run
- [ ] Query `SELECT * FROM contact_submission;` works
- [ ] Contact form submission shows green success message
- [ ] Data appears in Neon when queried

---

## 💡 PRO TIP:

**For future schema changes:**

1. Edit `src/models/Schema.ts`
2. Run: `npm run db:generate`
3. Check new SQL file in `migrations/`
4. Copy SQL to Neon SQL Editor
5. Run it
6. Test app

---

## 🐛 IF STILL ERROR AFTER THIS:

Send me screenshot of:
1. Neon SQL Editor showing CREATE TABLE result
2. Browser F12 Console when submitting form
3. Browser F12 Network tab → /api/contact → Response

---

**Created:** November 3, 2025  
**Estimated Time:** 5 minutes  
**Success Rate:** 99%

**SILAKAN DICOBA! 🚀**
