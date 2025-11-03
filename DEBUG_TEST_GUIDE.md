# 🔍 DEBUG GUIDE - STEP BY STEP

## Server sudah running dengan logging enabled!

### ✅ LANGKAH TESTING:

---

## 1️⃣ Buka Browser DevTools

1. Buka: **http://localhost:3000/company-profile**
2. Press **F12** untuk buka DevTools
3. Go to **Console** tab
4. **PENTING:** Keep Console tab open!

---

## 2️⃣ Submit Form

1. Scroll ke bagian **Contact Form**
2. Isi form dengan data:
   ```
   Nama: Test User
   Email: test@example.com
   Phone: 081234567890
   Subject: Testing Contact Form
   Message: This is a test message to verify the contact form
   ```
3. Click **Submit** button
4. **TUNGGU!** Jangan close browser

---

## 3️⃣ Check Browser Console

Di **Console tab**, kamu harus lihat log seperti ini:

### ✅ JIKA SUKSES:
```
🔵 Submitting form data: {name: "Test User", email: "test@example.com", ...}
🔵 Response status: 201 Created
🔵 Response data: {success: true, message: "Thank you...", data: {...}}
```

### ❌ JIKA ERROR:
```
🔵 Submitting form data: {name: "Test User", ...}
❌ Error: Failed to fetch
```
atau
```
🔵 Submitting form data: {name: "Test User", ...}
🔵 Response status: 500 Internal Server Error
🔵 Response data: {success: false, message: "..."}
```

---

## 4️⃣ Check Network Tab

1. Di DevTools, go to **Network** tab
2. Find request: **contact** (POST method)
3. Click it
4. Check **Response** tab

### ✅ JIKA SUKSES (Status 201):
```json
{
  "success": true,
  "message": "Thank you for contacting us!",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
}
```

### ❌ JIKA ERROR (Status 500):
```json
{
  "success": false,
  "message": "Failed to submit contact form"
}
```

---

## 5️⃣ Check Terminal Output

Di terminal yang running `npm run dev`, kamu harus lihat:

### ✅ JIKA SUKSES:
```
🟢 [API] POST /api/contact - Request received
🟢 [API] Request body: {name: "Test User", ...}
🟢 [API] Validation passed
🟢 [API] Attempting database insert...
🟢 [API] Database insert successful: {id: 1, ...}
 POST /api/contact 201 in 234ms
```

### ❌ JIKA ERROR (Validation):
```
🟢 [API] POST /api/contact - Request received
🟢 [API] Request body: {name: "T", ...}
🔴 [API] Error occurred: ZodError: ...
 POST /api/contact 400 in 123ms
```

### ❌ JIKA ERROR (Database):
```
🟢 [API] POST /api/contact - Request received
🟢 [API] Request body: {name: "Test User", ...}
🟢 [API] Validation passed
🟢 [API] Attempting database insert...
🔴 [API] Error occurred: Error: relation "contact_submission" does not exist
 POST /api/contact 500 in 456ms
```

---

## 🎯 WHAT TO SEND ME:

Take **screenshot** of:

1. **Browser Console** (F12 → Console tab) - Show the 🔵 logs
2. **Browser Network** (F12 → Network tab → contact request → Response)
3. **Terminal output** - Show the 🟢/🔴 logs after submit

Send me these 3 screenshots!

---

## 🐛 COMMON ERRORS & FIXES:

### Error: "relation 'contact_submission' does not exist"
**Fix:**
- Table belum dibuat di Neon
- Follow: `FIX_NEON_MIGRATION.md`
- Run SQL di Neon Console

### Error: "Failed to fetch" di browser
**Fix:**
- API route tidak compiled
- Restart server: `npm run dev`
- Check URL is correct: `/api/contact`

### Error: "Validation error"
**Fix:**
- Check form data meets requirements:
  - Name: min 2 chars
  - Email: valid format
  - Subject: min 3 chars
  - Message: min 10 chars

### Error: Nothing in terminal
**Fix:**
- Request tidak sampai ke server
- Check browser Network tab
- Look for CORS or network errors

---

## ✅ EXPECTED FLOW:

```
1. User clicks Submit
   ↓
2. Browser Console: "🔵 Submitting form data..."
   ↓
3. HTTP POST request sent
   ↓
4. Terminal: "🟢 [API] POST /api/contact - Request received"
   ↓
5. Terminal: "🟢 [API] Validation passed"
   ↓
6. Terminal: "🟢 [API] Attempting database insert..."
   ↓
7. Terminal: "🟢 [API] Database insert successful"
   ↓
8. Browser Console: "🔵 Response status: 201"
   ↓
9. Browser Console: "🔵 Response data: {success: true}"
   ↓
10. UI shows: "✅ Terima Kasih!"
```

---

**Server is ready at: http://localhost:3000**

**GO TEST NOW! 🚀**

Setelah test, kirim ke saya:
1. Screenshot browser console
2. Screenshot network response
3. Copy terminal output
