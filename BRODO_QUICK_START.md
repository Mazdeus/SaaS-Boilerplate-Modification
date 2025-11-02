# 🚀 BRODO Company Profile - Quick Start Guide

> **Panduan cepat untuk memahami dan menjalankan BRODO Company Profile**

---

## 📖 Apa Ini?

Ini adalah implementasi **real company profile** untuk **BRODO** - brand sepatu lokal Indonesia dari Bandung, yang mendemonstrasikan konsep templating modern dengan data authentic.

---

## 🎯 Fitur Utama

✅ **Single-page profile** dengan smooth scroll  
✅ **4 Slides hero** auto-play dengan konten BRODO  
✅ **Dynamic sidebars** dengan company info & team  
✅ **Product showcase** untuk 4 kategori produk  
✅ **Values & philosophy** section  
✅ **Working links** ke situs resmi BRODO  
✅ **Responsive design** (mobile, tablet, desktop)  
✅ **Theme system** compatible

---

## 🏃 Quick Start

### 1. Jalankan Development Server

```bash
npm run dev
```

### 2. Buka di Browser

```
http://localhost:3000/company-profile
```

### 3. Explore!

Scroll halaman atau klik navigation di header untuk jump ke section tertentu.

---

## 📂 Struktur File Penting

```
src/
├── app/[locale]/(unauth)/company-profile/
│   └── page.tsx                          ← Main page
│
├── themes/default/partials/
│   ├── Header.tsx                        ← Navigation header
│   └── Footer.tsx                        ← Footer dengan 4 kolom
│
├── components/company/
│   ├── BrodoAbout.tsx                    ← About section (NEW)
│   ├── BrodoProducts.tsx                 ← Products section (NEW)
│   └── BrodoValues.tsx                   ← Values section (NEW)
│
└── plugins/
    ├── company-slideshow/
    │   └── CompanySlideshowPlugin.tsx    ← Hero slideshow
    ├── company-info/
    │   └── CompanyInfoWidget.tsx         ← Sidebar info
    ├── company-values/
    │   └── CompanyValuesWidget.tsx       ← Sidebar values
    └── company-team/
        └── CompanyTeamWidget.tsx         ← Sidebar team
```

---

## 🗺️ Navigation Map

```
BRODO Header Navigation:
├─ Tentang Kami     → Scroll to #about
├─ Produk Kami      → Scroll to #products
├─ Nilai & Filosofi → Scroll to #values
├─ Tim & Cerita     → Sidebar right (#team)
└─ Kontak           → Scroll to #contact

[Belanja Sekarang] → Opens bro.do in new tab
```

---

## 📋 Section Breakdown

### 1. Hero (Slideshow) 🎬
4 slides auto-play:
- Slide 1: Welcome to BRODO
- Slide 2: History & Innovation
- Slide 3: Quality Craftsmanship
- Slide 4: Join the Movement

### 2. About Section 📖
- Company story
- Mission & Vision
- Statistics
- Founders profile

### 3. Products Section 🛍️
- 4 Categories: Sneakers, Boots, Sandals, Accessories
- Features per category
- Featured product highlight
- Shop CTA

### 4. Values Section ✨
- 4 Core values dengan quotes
- Philosophy statement
- Craftsmanship highlights

### 5. Testimonials 💬
- 3 Indonesian user testimonials

### 6. Contact Section 📞
- Email, Phone, Visit Store CTAs
- Company address

---

## 🎨 Templating Concepts

### Layout & Partial ✅
- Reusable Header & Footer
- MainLayout wrapper
- Content sections

### Area/Region System ✅
- HERO: Slideshow
- SIDEBAR_LEFT: Info + Values
- SIDEBAR_RIGHT: Team

### Plugin Architecture ✅
- 4 plugins registered
- Priority-based rendering
- Dynamic component loading

### Component Composition ✅
- Modular design
- TypeScript type safety
- Reusable components

---

## 🔗 Important Links

### Documentation:
- 📘 **Main README**: `BRODO_README.md` - Detailed documentation
- 📋 **Implementation**: `BRODO_IMPLEMENTATION_SUMMARY.md`
- 🔧 **System Guide**: `TEMPLATING_SYSTEM_README.md`
- 📝 **Changes Log**: `BRODO_FILE_CHANGES_LOG.md`

### External:
- 🏪 **BRODO Website**: https://bro.do
- 📷 **Instagram**: https://www.instagram.com/brodo.footwear/
- ▶️ **YouTube**: https://www.youtube.com/@BrodoFootwear

---

## 💡 Tips

### Testing Responsive:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test pada: Mobile (375px), Tablet (768px), Desktop (1920px)

### Testing Sidebars:
1. Click burger icon (☰) untuk toggle left sidebar
2. Click hamburger icon di kanan untuk toggle right sidebar
3. Di mobile, sidebars menjadi overlay

### Testing Slideshow:
1. Watch auto-play (5 seconds per slide)
2. Click dots untuk navigate manual
3. Each slide has different CTA

### Testing Navigation:
1. Click nav items di header
2. Should smooth scroll ke section
3. Header stays sticky at top

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### TypeScript Errors?
```bash
# Check types
npm run check-types

# If errors persist, restart TS server:
# In VSCode: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Styling Issues?
```bash
# Rebuild Tailwind
npm run build:css
```

---

## ✅ Checklist Review

Untuk memastikan everything working:

- [ ] Development server running
- [ ] Page loads at `/company-profile`
- [ ] Navigation smooth scroll works
- [ ] Slideshow auto-plays
- [ ] Sidebars toggle correctly
- [ ] All CTA buttons work
- [ ] External links open in new tab
- [ ] Responsive on mobile
- [ ] No console errors

---

## 📚 Learn More

### Concepts Covered:
1. **Template Engine**: Dynamic content rendering
2. **Plugin System**: Extensible architecture
3. **Layout System**: Reusable partials  
4. **Area System**: Flexible content areas
5. **Component Architecture**: Modular design
6. **Responsive Design**: Mobile-first approach

### Tech Stack:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Context API

---

## 🎓 Educational Value

This project demonstrates:
- ✅ Real-world application of templating concepts
- ✅ Industry-standard code organization
- ✅ TypeScript best practices
- ✅ Responsive design patterns
- ✅ Component composition
- ✅ State management
- ✅ External API integration (links)

---

## 🚀 Next Steps

After exploring, you can:

1. **Modify Content**: Edit BRODO data in components
2. **Add Features**: Form, gallery, animations
3. **Customize Theme**: Change colors in Tailwind config
4. **Add Plugins**: Create new widgets
5. **Extend Functionality**: Add CMS integration

---

## 📞 Need Help?

Review these files in order:
1. `BRODO_README.md` - Complete documentation
2. `TEMPLATING_SYSTEM_README.md` - System architecture
3. `BRODO_IMPLEMENTATION_SUMMARY.md` - Technical details
4. `BRODO_FILE_CHANGES_LOG.md` - What changed

---

**Happy Coding! 🎉**

---

**Status**: Production Ready ✅  
**Brand**: BRODO Indonesia 🇮🇩  
**Project**: Company Profile with Modern Templating System  
**Date**: November 2, 2025
