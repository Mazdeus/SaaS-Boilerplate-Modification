# 📚 Templating System Implementation
## Praktikum Minggu ke-8 - Pengembangan Web

---

## 🎯 Konsep yang Diimplementasikan

### 1. **Template Engine Abstraction** ✅
Sistem abstraksi untuk rendering React components secara dinamis.

**Lokasi:** `src/core/TemplateEngine.ts`

**Fitur:**
- Component registry (layouts, partials, components)
- Dynamic component rendering
- Configuration management
- Persistent storage (localStorage)

**Contoh Penggunaan:**
```typescript
import { templateEngine } from '@/core/TemplateEngine';

// Register layout
templateEngine.registerLayout('main', MainLayout);

// Register partial
templateEngine.registerPartial('header', Header);

// Get component
const Layout = templateEngine.getLayout('main');
```

---

### 2. **Layout & Partial System** ✅
Sistem layout dengan komponen reusable (partials).

**Lokasi:**
- Layouts: `src/themes/default/layouts/`
- Partials: `src/themes/default/partials/`

**Komponen:**
- **MainLayout**: Layout utama untuk halaman publik
- **DashboardLayout**: Layout untuk dashboard
- **Header**: Navbar dengan navigasi dan theme switcher
- **Footer**: Footer dengan links

**Contoh Penggunaan:**
```tsx
import { MainLayout } from '@/themes/default/layouts/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      <h1>Welcome</h1>
    </MainLayout>
  );
}
```

---

### 3. **Area/Region System** ✅
Sistem untuk menempatkan komponen secara dinamis di area tertentu.

**Lokasi:** `src/core/AreaManager.ts`

**Areas Yang Tersedia:**
- `hero` - Untuk banner/slideshow
- `sidebar-left` - Sidebar kiri
- `sidebar-right` - Sidebar kanan
- `content-before` - Sebelum konten utama
- `content-after` - Setelah konten utama
- `footer-widgets` - Widget footer
- `dashboard-widgets` - Widget dashboard
- `header-extra` - Extra header content

**Contoh Penggunaan:**
```tsx
// Register component to area
import { useArea } from '@/contexts/AreaContext';

const { registerComponent } = useArea();

registerComponent('sidebar-left', {
  id: 'user-stats',
  component: UserStatsWidget,
  priority: 10,
  enabled: true,
  areaId: 'sidebar-left'
});

// Render area
import { AreaRenderer } from '@/components/AreaRenderer';

<AreaRenderer area="sidebar-left" />
```

---

### 4. **Theme System** ✅
Sistem untuk mengganti tema secara dinamis.

**Lokasi:** 
- Theme Manager: `src/core/ThemeManager.ts`
- Theme Configs: `src/themes/*/theme.config.ts`

**Themes Tersedia:**
1. **Default** - Clean minimal professional
2. **Modern** - Bold colorful contemporary
3. **Dark** - Elegant dark mode

**Contoh Penggunaan:**
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const { currentTheme, setTheme, availableThemes } = useTheme();

// Switch theme
setTheme('modern');

// Get current theme
console.log(currentTheme.name);
```

---

### 5. **Plugin/Module System** ✅
Sistem plugin untuk menambah fitur secara modular.

**Lokasi:** `src/plugins/`

**Plugins Tersedia:**
1. **Slideshow** - Image carousel
2. **User Stats** - Statistics widget
3. **Recent Posts** - Blog posts widget
4. **Quick Actions** - Quick action buttons

**Contoh Penggunaan:**
```typescript
import { pluginRegistry } from '@/plugins';

// Register plugin
pluginRegistry.register({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'Description',
  areas: ['sidebar-left'],
  component: MyComponent,
  enabled: true
});

// Toggle plugin
pluginRegistry.togglePlugin('my-plugin');
```

---

### 6. **Template Helpers** ✅
Fungsi helper untuk export data dan formatting.

**Lokasi:** `src/helpers/`

**Export Helpers:**
```typescript
import { downloadCSV, downloadExcel, downloadJSON } from '@/helpers';

// Export to CSV
downloadCSV(data, 'filename.csv');

// Export to Excel
downloadExcel(data, 'filename.xlsx');

// Export to JSON
downloadJSON(data, 'filename.json');
```

**Format Helpers:**
```typescript
import { formatDate, formatCurrency, formatBytes } from '@/helpers';

formatDate(new Date()); // "October 19, 2024"
formatCurrency(1000); // "$1,000.00"
formatBytes(1024); // "1 KB"
```

---

## 🗂️ Struktur Folder

```
src/
├── core/                          # Core templating system
│   ├── types.ts                   # Type definitions
│   ├── TemplateEngine.ts          # Template engine
│   ├── AreaManager.ts             # Area manager
│   └── ThemeManager.ts            # Theme manager
│
├── themes/                        # Multi-theme support
│   ├── default/
│   │   ├── theme.config.ts
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   └── partials/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── modern/
│   │   └── theme.config.ts
│   └── dark/
│       └── theme.config.ts
│
├── plugins/                       # Plugin system
│   ├── PluginRegistry.ts
│   ├── slideshow/
│   ├── user-stats/
│   ├── recent-posts/
│   ├── quick-actions/
│   └── index.ts
│
├── helpers/                       # Template helpers
│   ├── exportHelper.ts
│   ├── formatHelper.ts
│   └── index.ts
│
├── contexts/                      # React contexts
│   ├── ThemeContext.tsx
│   └── AreaContext.tsx
│
├── providers/
│   └── TemplateProviders.tsx
│
└── components/
    ├── ThemeSwitcher.tsx
    └── AreaRenderer.tsx
```

---

## 📄 Demo Pages

### 1. Demo Home (`/demo-home`)
Landing page dengan overview semua fitur

### 2. Theme Switcher (`/demo/theme-switcher`)
Demo theme switching dengan preview

### 3. Areas Demo (`/demo/areas`)
Visualisasi area system dengan statistics

### 4. Plugin Manager (`/dashboard/plugins`)
Manage plugins (enable/disable)

### 5. Export Demo (`/dashboard/export-demo`)
Demo export data ke CSV, Excel, JSON

---

## 🎨 Cara Menggunakan

### Setup Awal

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Buka browser:**
```
http://localhost:3000/demo-home
```

---

### Menggunakan Theme System

1. Klik "Theme Switcher" di navbar atau kunjungi `/demo/theme-switcher`
2. Pilih salah satu theme (Default, Modern, Dark)
3. Theme akan berubah secara real-time
4. Preference tersimpan di localStorage

---

### Menggunakan Plugin System

1. Pergi ke `/dashboard/plugins`
2. Toggle plugin dengan button "Enable/Disable"
3. Plugin akan langsung aktif/nonaktif
4. Check sidebar untuk melihat perubahan

---

### Menggunakan Export Helper

1. Pergi ke `/dashboard/export-demo`
2. Klik salah satu button export (CSV, Excel, JSON)
3. File akan otomatis terdownload
4. Buka file untuk verifikasi data

---

### Membuat Plugin Baru

```tsx
// 1. Buat component plugin
export function MyCustomPlugin() {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3>My Custom Plugin</h3>
      <p>Plugin content here...</p>
    </div>
  );
}

// 2. Register plugin
import { pluginRegistry } from '@/plugins';
import { AREAS } from '@/core/types';

pluginRegistry.register({
  id: 'my-custom-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  description: 'Description of my plugin',
  areas: [AREAS.SIDEBAR_LEFT],
  component: MyCustomPlugin,
  enabled: true,
  icon: '🎯'
});

// 3. Register to area
import { useArea } from '@/contexts/AreaContext';

const { registerComponent } = useArea();

registerComponent(AREAS.SIDEBAR_LEFT, {
  id: 'my-custom-plugin-instance',
  component: MyCustomPlugin,
  priority: 10,
  enabled: true,
  areaId: AREAS.SIDEBAR_LEFT
});
```

---

### Membuat Theme Baru

```typescript
// 1. Buat theme config
// src/themes/custom/theme.config.ts

import type { ThemeConfig } from '@/core/types';

export const customTheme: ThemeConfig = {
  id: 'custom',
  name: 'Custom Theme',
  description: 'My custom theme',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: '#ffffff',
    foreground: '#2d3436',
    accent: '#a29bfe',
  },
  fonts: {
    heading: 'Arial, sans-serif',
    body: 'Arial, sans-serif',
  },
  styles: {
    borderRadius: '0.5rem',
    spacing: '1rem',
  },
};

// 2. Register theme
// src/contexts/ThemeContext.tsx

import { customTheme } from '@/themes/custom/theme.config';

themeManager.registerTheme(customTheme);
```

---

## 🧪 Testing

### Manual Testing

1. **Theme Switching:**
   - Buka `/demo/theme-switcher`
   - Ganti theme dan lihat perubahan visual
   - Refresh page, theme harus persist

2. **Area System:**
   - Buka `/demo/areas`
   - Lihat komponen di sidebar
   - Check statistics area

3. **Plugin System:**
   - Buka `/dashboard/plugins`
   - Enable/disable plugin
   - Lihat perubahan di sidebar

4. **Export Functionality:**
   - Buka `/dashboard/export-demo`
   - Export ke CSV, Excel, JSON
   - Verifikasi file terdownload

---

## 📊 Hasil Implementasi

### ✅ Checklist Konsep

- [x] Template Engine Abstraction
- [x] Layout & Partial System
- [x] Area/Region System
- [x] Theme System (3 themes)
- [x] Plugin/Module System (4 plugins)
- [x] Template Helpers (Export & Format)
- [x] Demo Pages (5 pages)
- [x] Documentation

### 📈 Statistics

- **Total Files Created:** 40+
- **Core Systems:** 4 (TemplateEngine, AreaManager, ThemeManager, PluginRegistry)
- **Themes:** 3 (Default, Modern, Dark)
- **Plugins:** 4 (Slideshow, UserStats, RecentPosts, QuickActions)
- **Layouts:** 2 (MainLayout, DashboardLayout)
- **Demo Pages:** 5
- **Helper Functions:** 15+

---

## 🎓 Konsep Praktikum Terpenuhi

### 1. Template Engine Abstraction ✅
- Component registry system
- Dynamic rendering
- Configuration management

### 2. Layout & Partial ✅
- Multiple layouts (Main, Dashboard)
- Reusable partials (Header, Footer)
- Layout inheritance pattern

### 3. Area/Region ✅
- 8 predefined areas
- Dynamic component placement
- Priority-based ordering

### 4. Theme System ✅
- Multiple themes
- Dynamic switching
- Persistent storage
- CSS variables injection

### 5. Plugin/Module System ✅
- Plugin registry
- Enable/disable functionality
- Area-based placement
- Configuration support

### 6. Template Helpers ✅
- Export helpers (CSV, Excel, JSON)
- Format helpers (Date, Currency, Bytes)
- Utility functions

---

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Buka browser
http://localhost:3000/demo-home

# 4. Explore demo pages:
# - http://localhost:3000/demo-home
# - http://localhost:3000/demo/theme-switcher
# - http://localhost:3000/demo/areas
# - http://localhost:3000/dashboard/plugins
# - http://localhost:3000/dashboard/export-demo
```

---

## 📝 Catatan

- Implementasi menggunakan **React/Next.js** (modern approach)
- Semua konsep EJS-based template diadaptasi ke React patterns
- localStorage digunakan untuk persistence (tidak perlu database)
- TypeScript untuk type safety
- Tailwind CSS untuk styling
- Modular dan scalable architecture

---

## 👨‍💻 Developer

**Praktikum Minggu ke-8 - Templating**
Pengembangan Web

---

## 📚 References

- Next.js Documentation
- React Context API
- TypeScript Best Practices
- Template Engine Concepts
- Plugin Architecture Patterns

---

**Happy Coding! 🚀**

