# 🚀 Quick Start Guide
## Templating System - Praktikum Week 8

---

## ⚡ Super Fast Start

```bash
# 1. Run development server
npm run dev

# 2. Open browser
http://localhost:3000/demo-home

# 3. Done! 🎉
```

---

## 📍 Demo Pages

| Page | URL | Description |
|------|-----|-------------|
| **Demo Home** | `/demo-home` | Overview semua fitur |
| **Theme Switcher** | `/demo/theme-switcher` | Ganti tema (Default, Modern, Dark) |
| **Areas Demo** | `/demo/areas` | Lihat area system in action |
| **Plugin Manager** | `/dashboard/plugins` | Enable/disable plugins |
| **Export Demo** | `/dashboard/export-demo` | Export data (CSV, Excel, JSON) |

---

## 🎯 Test Checklist

### 1. Theme System (2 menit)
- [ ] Buka `/demo/theme-switcher`
- [ ] Klik theme "Modern"
- [ ] Lihat perubahan warna/style
- [ ] Refresh page
- [ ] Theme masih "Modern" ✅

### 2. Plugin System (2 menit)
- [ ] Buka `/dashboard/plugins`
- [ ] Disable plugin "User Statistics"
- [ ] Lihat sidebar kiri (widget hilang)
- [ ] Enable lagi
- [ ] Widget muncul kembali ✅

### 3. Area System (1 menit)
- [ ] Buka `/demo/areas`
- [ ] Lihat statistics (berapa area aktif)
- [ ] Scroll down lihat live rendering
- [ ] Sidebar menampilkan widgets ✅

### 4. Export Functionality (2 menit)
- [ ] Buka `/dashboard/export-demo`
- [ ] Klik "Export to CSV"
- [ ] File `users-export.csv` terdownload
- [ ] Buka file, data tampil dengan benar ✅
- [ ] Test juga Excel dan JSON

### 5. Layout & Partial (1 menit)
- [ ] Navigasi ke halaman manapun
- [ ] Header dan Footer sama di semua halaman
- [ ] Theme switcher di header berfungsi ✅

---

## 🎨 Features Quick Demo

### Theme Switching
```
1. Klik dropdown "Theme" di navbar
2. Pilih "Modern"
3. Boom! Instant theme change
```

### Plugin Enable/Disable
```
1. Go to /dashboard/plugins
2. Click "Disable" on any plugin
3. Widget hilang dari sidebar
4. Click "Enable"
5. Widget muncul lagi
```

### Export Data
```
1. Go to /dashboard/export-demo
2. Click "Export to Excel"
3. File terdownload otomatis
```

---

## 🔍 Verify Implementation

### Check 1: Core Files Exist
```bash
# Check core systems
ls src/core/
# Should see: TemplateEngine.ts, AreaManager.ts, ThemeManager.ts, types.ts

# Check themes
ls src/themes/
# Should see: default/, modern/, dark/

# Check plugins
ls src/plugins/
# Should see: slideshow/, user-stats/, recent-posts/, quick-actions/
```

### Check 2: Demo Pages Work
- Visit `/demo-home` → Should load without errors
- Visit `/demo/theme-switcher` → Should show theme options
- Visit `/demo/areas` → Should show area statistics
- Visit `/dashboard/plugins` → Should show plugin list
- Visit `/dashboard/export-demo` → Should show data table

### Check 3: Console Messages
Open browser console (`F12`), you should see:
```
[ThemeManager] Theme registered: Default
[ThemeManager] Theme registered: Modern
[ThemeManager] Theme registered: Dark
[AreaProvider] Initialized
[ThemeProvider] Initialized with theme: Default
```

---

## ❌ Troubleshooting

### Issue: Page tidak muncul
**Solution:**
```bash
# Clear .next cache
rm -rf .next
npm run dev
```

### Issue: Theme tidak berubah
**Solution:**
```bash
# Clear localStorage
# Di browser console:
localStorage.clear()
# Refresh page
```

### Issue: Plugin tidak muncul di sidebar
**Solution:**
- Buka `/dashboard/plugins`
- Pastikan plugin di-enable
- Check console untuk error

### Issue: Export tidak jalan
**Solution:**
- Check browser console untuk errors
- Pastikan popup blocker tidak aktif
- Try different browser

---

## 📊 Expected Results

### After Full Testing:
- ✅ 3 themes working (Default, Modern, Dark)
- ✅ 4 plugins working (Slideshow, Stats, Posts, Actions)
- ✅ 8 areas defined and functional
- ✅ Export to CSV, Excel, JSON working
- ✅ All demo pages accessible
- ✅ No console errors

---

## 🎓 For Presentation

### Demo Flow (5-7 minutes):

**1. Introduction (30 sec)**
- "Saya implementasi sistem templating dengan 6 konsep utama..."

**2. Theme System (1 min)**
- Show `/demo/theme-switcher`
- Switch between themes live
- Explain: "Theme tersimpan di localStorage"

**3. Area/Region System (1 min)**
- Show `/demo/areas`
- Point to sidebar widgets
- Explain: "Components dapat ditempatkan di area dinamis"

**4. Plugin System (1.5 min)**
- Show `/dashboard/plugins`
- Disable plugin, show sidebar change
- Enable plugin, show it reappear
- Explain: "Plugin dapat diaktifkan/dinonaktifkan runtime"

**5. Export Functionality (1 min)**
- Show `/dashboard/export-demo`
- Export to CSV
- Open downloaded file
- Explain: "Support CSV, Excel, JSON export"

**6. Architecture Overview (1 min)**
- Show folder structure
- Explain: Core, Themes, Plugins, Helpers
- Mention: TypeScript, React, Next.js

**7. Conclusion (30 sec)**
- All 6 concepts implemented ✅
- Production-ready code
- Modular and scalable
- Q&A

---

## 🎯 Key Points to Mention

1. **Template Engine Abstraction** - Component registry system
2. **Layout & Partial** - Reusable components (Header, Footer)
3. **Area/Region** - 8 predefined areas for dynamic placement
4. **Theme System** - 3 themes with localStorage persistence
5. **Plugin System** - Enable/disable plugins runtime
6. **Helpers** - Export (CSV, Excel, JSON) and Format functions

---

## 📸 Screenshots to Prepare

1. Demo home page overview
2. Theme switcher with different themes
3. Areas demo with statistics
4. Plugin manager interface
5. Export demo with downloaded files
6. Code structure (VS Code screenshot)

---

## ✅ Final Checklist

Before Presentation:
- [ ] `npm run dev` running
- [ ] Browser open to `/demo-home`
- [ ] No console errors
- [ ] All demo pages tested
- [ ] localStorage cleared (fresh state)
- [ ] Presentation notes ready
- [ ] Backup screenshots prepared
- [ ] Understanding of each concept clear

---

**Ready to Present! 🎉**

Questions? Check `TEMPLATING_IMPLEMENTATION.md` for detailed documentation.

