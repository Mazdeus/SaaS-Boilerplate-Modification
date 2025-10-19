# Hasil Praktikum Week 8 - Templating System

**Mata Kuliah:** Pengembangan Web  
**Topik:** Implementasi Konsep Templating

---

## Deskripsi Praktikum

Praktikum ini bertujuan untuk mengimplementasikan konsep **Templating** dalam pengembangan web modern menggunakan framework **Next.js** dengan **TypeScript** dan **React**. 

Templating adalah konsep yang menekankan pada pemisahan antara logika pemrosesan data dan tampilan antarmuka pengguna, sehingga proses pengembangan menjadi lebih terorganisir, mudah dipelihara, dan tampilan dapat disesuaikan tanpa mengubah logika program di backend.

---

## Konsep yang Diimplementasikan

Praktikum ini mengimplementasikan **4 konsep utama** templating:

### 1. Template Engine Abstraction ✅
### 2. Layout & Partial ✅
### 3. Area / Region ✅
### 4. Theme System ✅

---

## 1. Template Engine Abstraction

### Definisi
Template Engine Abstraction adalah lapisan abstraksi antara kode aplikasi dan mekanisme rendering template. Ini memungkinkan pemisahan logika bisnis dari presentasi tampilan.

### Implementasi

**File:** `src/core/TemplateEngine.ts`

```typescript
class TemplateEngine {
  private registry: ComponentRegistry;

  // Registrasi komponen
  registerLayout(name: string, component: ComponentType<LayoutProps>): void
  registerPartial(name: string, component: ComponentType<PartialProps>): void
  registerComponent(name: string, component: ComponentType<any>): void

  // Retrieval komponen
  getLayout(name: string): ComponentType<LayoutProps>
  getPartial(name: string): ComponentType<PartialProps>
  getComponent(name: string): ComponentType<any>
}
```

### Fitur
- **Component Registry**: Sistem pendaftaran komponen terpusat
- **Dynamic Rendering**: Render komponen secara dinamis berdasarkan name/id
- **Configuration Management**: Manajemen konfigurasi template engine
- **Persistent Storage**: Simpan konfigurasi ke localStorage

### Cara Kerja

```typescript
// 1. Register component
templateEngine.registerLayout('main', MainLayout);
templateEngine.registerPartial('header', Header);

// 2. Retrieve dan gunakan
const Layout = templateEngine.getLayout('main');
const HeaderComponent = templateEngine.getPartial('header');

// 3. Render
<Layout>
  <HeaderComponent />
  <Content />
</Layout>
```

### Lokasi File
```
src/core/
├── TemplateEngine.ts     # Core template engine
├── types.ts              # Type definitions
└── AreaManager.ts        # Area management
```

---

## 2. Layout & Partial

### Definisi
Layout adalah kerangka utama halaman yang berisi struktur umum (header, footer, sidebar). Partial adalah komponen kecil yang dapat di-include berulang kali di berbagai tempat.

### Implementasi

#### A. Layouts

**MainLayout** - Layout untuk halaman publik

**File:** `src/themes/default/layouts/MainLayout.tsx`

```typescript
export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Partials */}
      <Header />
      
      {/* Areas */}
      <AreaRenderer area={AREAS.HERO} />
      
      <main className="flex-1">
        <div className="container mx-auto">
          <div className="flex gap-8">
            {/* Sidebar Areas */}
            <aside>
              <AreaRenderer area={AREAS.SIDEBAR_LEFT} />
            </aside>
            
            {/* Main Content */}
            <div className="flex-1">
              <AreaRenderer area={AREAS.CONTENT_BEFORE} />
              {children}
              <AreaRenderer area={AREAS.CONTENT_AFTER} />
            </div>
            
            <aside>
              <AreaRenderer area={AREAS.SIDEBAR_RIGHT} />
            </aside>
          </div>
        </div>
      </main>
      
      {/* Partials */}
      <Footer />
    </div>
  );
}
```

**DashboardLayout** - Layout untuk halaman dashboard

**File:** `src/themes/default/layouts/DashboardLayout.tsx`

```typescript
export function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-gray-50">
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/plugins">Plugins</Link>
          <Link href="/dashboard/export-demo">Export Data</Link>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1">
        <header>Dashboard Header</header>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

#### B. Partials

**Header** - Komponen header yang reusable

**File:** `src/themes/default/partials/Header.tsx`

```typescript
export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">SaaS Template</Link>
        
        <nav>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/demo/theme-switcher">Themes</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/sign-in">Sign In</Link>
        </div>
      </div>
    </header>
  );
}
```

**Footer** - Komponen footer yang reusable

**File:** `src/themes/default/partials/Footer.tsx`

```typescript
export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3>Product</h3>
            <ul>
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
            </ul>
          </div>
          {/* More columns... */}
        </div>
        
        <div className="text-center">
          <p>© 2024 SaaS Template. Praktikum Templating - Week 8.</p>
        </div>
      </div>
    </footer>
  );
}
```

### Keuntungan Layout & Partial

1. **DRY Principle** - Tidak ada duplikasi kode
2. **Easy Maintenance** - Update 1 file, semua halaman berubah
3. **Consistency** - Tampilan konsisten di seluruh aplikasi
4. **Reusability** - Komponen dapat dipakai berulang-ulang

### Struktur Folder
```
src/themes/default/
├── layouts/
│   ├── MainLayout.tsx         # Layout utama
│   └── DashboardLayout.tsx    # Layout dashboard
└── partials/
    ├── Header.tsx             # Partial header
    └── Footer.tsx             # Partial footer
```

---

## 3. Area / Region System

### Definisi
Area/Region adalah zona yang telah didefinisikan di dalam layout dimana komponen/widget dapat ditempatkan secara dinamis. Sistem ini memungkinkan penambahan dan pengaturan komponen tanpa mengubah struktur layout.

### Implementasi

#### A. Area Manager

**File:** `src/core/AreaManager.ts`

```typescript
class AreaManager {
  private areas: Map<AreaType, AreaComponent[]>;

  // Register component to area
  register(area: AreaType, component: AreaComponent): void {
    // Add component to specified area
    // Sort by priority
  }

  // Get all components in area
  getComponents(area: AreaType): AreaComponent[] {
    return this.areas.get(area)?.filter(c => c.enabled) || [];
  }

  // Toggle component enable/disable
  toggleComponent(area: AreaType, componentId: string): void {
    // Enable or disable component in area
  }
}
```

#### B. Predefined Areas

**File:** `src/core/types.ts`

```typescript
export const AREAS = {
  HERO: 'hero',                      // Hero section (banner/slideshow)
  SIDEBAR_LEFT: 'sidebar-left',      // Left sidebar
  SIDEBAR_RIGHT: 'sidebar-right',    // Right sidebar
  CONTENT_BEFORE: 'content-before',  // Before main content
  CONTENT_AFTER: 'content-after',    // After main content
  FOOTER_WIDGETS: 'footer-widgets',  // Footer widget area
  DASHBOARD_WIDGETS: 'dashboard-widgets', // Dashboard widgets
  HEADER_EXTRA: 'header-extra',      // Extra header content
} as const;
```

#### C. Area Renderer Component

**File:** `src/components/AreaRenderer.tsx`

```typescript
export function AreaRenderer({ area, fallback }: AreaRendererProps) {
  const { getComponents } = useArea();
  const components = getComponents(area);

  if (components.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <div className={`area-${area}`} data-area={area}>
      {components.map((areaComponent) => {
        const Component = areaComponent.component;
        return (
          <div key={areaComponent.id} data-component-id={areaComponent.id}>
            <Component {...(areaComponent.props || {})} />
          </div>
        );
      })}
    </div>
  );
}
```

### Cara Menggunakan Area System

#### 1. Register Component ke Area

```typescript
import { useArea } from '@/contexts/AreaContext';
import { AREAS } from '@/core/types';

// Di dalam component
const { registerComponent } = useArea();

registerComponent(AREAS.SIDEBAR_LEFT, {
  id: 'user-stats-widget',
  component: UserStatsWidget,
  priority: 10,           // Lower = higher priority
  enabled: true,
  areaId: AREAS.SIDEBAR_LEFT
});
```

#### 2. Render Area di Layout

```typescript
import { AreaRenderer } from '@/components/AreaRenderer';
import { AREAS } from '@/core/types';

// Di dalam layout
<aside className="sidebar-left">
  <AreaRenderer 
    area={AREAS.SIDEBAR_LEFT}
    fallback={<p>No widgets in sidebar</p>}
  />
</aside>
```

### Visual Area System

```
┌─────────────────────────────────────┐
│ AREA: HEADER_EXTRA                  │
├─────────────────────────────────────┤
│ AREA: HERO                          │
│ └─ Slideshow Plugin                 │
├─────────┬───────────────────┬───────┤
│ AREA:   │ AREA:             │ AREA: │
│ SIDEBAR │ CONTENT_BEFORE    │ RIGHT │
│ LEFT    │                   │       │
│         │ Main Content      │       │
│ ├─ User │                   │ ├─Post│
│ │  Stats│ AREA:             │ │ List│
│ ├─ Quick│ CONTENT_AFTER     │       │
│ │ Action│                   │       │
├─────────┴───────────────────┴───────┤
│ AREA: FOOTER_WIDGETS                │
└─────────────────────────────────────┘
```

### Keuntungan Area System

1. **Dynamic Placement** - Tempatkan komponen tanpa edit layout
2. **Priority-based Ordering** - Atur urutan komponen dengan priority
3. **Enable/Disable** - Aktifkan/nonaktifkan komponen secara runtime
4. **Modular** - Tambah/hapus komponen tanpa affect yang lain

### Struktur Folder
```
src/
├── core/
│   ├── AreaManager.ts           # Area manager logic
│   └── types.ts                 # Area definitions
├── components/
│   └── AreaRenderer.tsx         # Area renderer component
└── contexts/
    └── AreaContext.tsx          # Area context provider
```

---

## 4. Theme System

### Definisi
Theme System adalah sistem yang memungkinkan penggunaan multiple themes (tema) yang dapat diganti secara dinamis. Setiap theme memiliki konfigurasi warna, font, dan styling sendiri.

### Implementasi

#### A. Theme Manager

**File:** `src/core/ThemeManager.ts`

```typescript
class ThemeManager {
  private themes: Map<string, ThemeConfig>;
  private currentThemeId: string;

  // Register theme
  registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);
  }

  // Set active theme
  setTheme(themeId: string): boolean {
    this.currentThemeId = themeId;
    this.applyTheme();  // Apply CSS variables
    this.savePreference();  // Save to localStorage
  }

  // Get current theme
  getCurrentTheme(): ThemeConfig {
    return this.themes.get(this.currentThemeId);
  }

  // Apply theme to document
  private applyTheme(): void {
    const theme = this.getCurrentTheme();
    const root = document.documentElement;
    
    // Apply colors as CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }
}
```

#### B. Theme Configurations

**Theme 1: Default Theme** (Clean, Minimal, Professional)

**File:** `src/themes/default/theme.config.ts`

```typescript
export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'Clean and minimal professional design',
  colors: {
    primary: '#3b82f6',      // Blue
    secondary: '#64748b',    // Slate
    background: '#ffffff',
    foreground: '#0f172a',
    accent: '#8b5cf6',       // Purple
  },
  fonts: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },
  styles: {
    borderRadius: '0.5rem',
    spacing: '1rem',
  },
};
```

**Theme 2: Modern Theme** (Bold, Colorful, Contemporary)

**File:** `src/themes/modern/theme.config.ts`

```typescript
export const modernTheme: ThemeConfig = {
  id: 'modern',
  name: 'Modern',
  description: 'Bold and colorful contemporary design',
  colors: {
    primary: '#ec4899',      // Pink
    secondary: '#f59e0b',    // Amber
    background: '#fafafa',
    foreground: '#18181b',
    accent: '#a855f7',       // Purple
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
  },
  styles: {
    borderRadius: '1rem',
    spacing: '1.5rem',
  },
};
```

**Theme 3: Dark Theme** (Elegant Dark Mode)

**File:** `src/themes/dark/theme.config.ts`

```typescript
export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  description: 'Elegant dark mode design',
  colors: {
    primary: '#60a5fa',      // Light Blue
    secondary: '#94a3b8',    // Light Slate
    background: '#0f172a',
    foreground: '#f1f5f9',
    accent: '#c084fc',       // Light Purple
  },
  fonts: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
  },
  styles: {
    borderRadius: '0.75rem',
    spacing: '1.25rem',
  },
};
```

#### C. Theme Context Provider

**File:** `src/contexts/ThemeContext.tsx`

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    // Register all themes
    themeManager.registerTheme(defaultTheme);
    themeManager.registerTheme(modernTheme);
    themeManager.registerTheme(darkTheme);
    
    // Initialize
    themeManager.initialize();
    
    // Load saved theme
    const theme = themeManager.getCurrentTheme();
    if (theme) setCurrentTheme(theme);
  }, []);

  const setTheme = (themeId: string) => {
    themeManager.setTheme(themeId);
    const theme = themeManager.getCurrentTheme();
    if (theme) setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

#### D. Theme Switcher Component

**File:** `src/components/ThemeSwitcher.tsx`

```typescript
export function ThemeSwitcher() {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <select
      value={currentTheme.id}
      onChange={(e) => setTheme(e.target.value)}
    >
      {availableThemes.map(theme => (
        <option key={theme.id} value={theme.id}>
          {theme.name}
        </option>
      ))}
    </select>
  );
}
```

### Cara Menggunakan Theme System

#### 1. Switch Theme (User)

```
1. Klik dropdown "Theme" di navbar
2. Pilih theme (Default / Modern / Dark)
3. Tampilan berubah real-time
4. Theme tersimpan di localStorage
5. Refresh page → theme tetap aktif
```

#### 2. Menambah Theme Baru (Developer)

```typescript
// 1. Buat theme config
const christmasTheme: ThemeConfig = {
  id: 'christmas',
  name: 'Christmas',
  description: 'Festive Christmas theme',
  colors: {
    primary: '#C41E3A',    // Red
    secondary: '#0C6340',  // Green
    accent: '#FFD700',     // Gold
    background: '#ffffff',
    foreground: '#2d2d2d',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'Arial, sans-serif',
  },
  styles: {
    borderRadius: '0.75rem',
    spacing: '1.25rem',
  },
};

// 2. Register theme
themeManager.registerTheme(christmasTheme);

// 3. Done! Theme muncul di dropdown
```

### Keuntungan Theme System

1. **Dynamic Switching** - Ganti theme tanpa reload
2. **Persistent** - Theme tersimpan di localStorage
3. **CSS Variables** - Efficient styling dengan CSS custom properties
4. **Easy Extension** - Tambah theme baru hanya dengan config
5. **No Rebuild** - User bisa ganti theme tanpa deploy ulang

### Struktur Folder
```
src/
├── core/
│   └── ThemeManager.ts              # Theme manager
├── themes/
│   ├── default/
│   │   ├── theme.config.ts         # Default theme config
│   │   ├── layouts/                # Theme-specific layouts
│   │   └── partials/               # Theme-specific partials
│   ├── modern/
│   │   └── theme.config.ts         # Modern theme config
│   └── dark/
│       └── theme.config.ts         # Dark theme config
├── contexts/
│   └── ThemeContext.tsx            # Theme context provider
└── components/
    └── ThemeSwitcher.tsx           # Theme switcher UI
```

---

## Struktur Folder Lengkap

```
SaaS-Boilerplate-Modification/
├── src/
│   ├── core/                        # Core templating system
│   │   ├── TemplateEngine.ts       # Template engine abstraction
│   │   ├── AreaManager.ts          # Area/region manager
│   │   ├── ThemeManager.ts         # Theme manager
│   │   └── types.ts                # TypeScript type definitions
│   │
│   ├── themes/                      # Theme configurations
│   │   ├── default/
│   │   │   ├── theme.config.ts
│   │   │   ├── layouts/
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── partials/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── modern/
│   │   │   └── theme.config.ts
│   │   └── dark/
│   │       └── theme.config.ts
│   │
│   ├── plugins/                     # Plugin system
│   │   ├── PluginRegistry.ts
│   │   ├── slideshow/
│   │   │   └── SlideshowPlugin.tsx
│   │   ├── user-stats/
│   │   │   └── UserStatsWidget.tsx
│   │   ├── recent-posts/
│   │   │   └── RecentPostsWidget.tsx
│   │   └── quick-actions/
│   │       └── QuickActionsWidget.tsx
│   │
│   ├── contexts/                    # React contexts
│   │   ├── ThemeContext.tsx
│   │   └── AreaContext.tsx
│   │
│   ├── components/                  # Reusable components
│   │   ├── ThemeSwitcher.tsx
│   │   └── AreaRenderer.tsx
│   │
│   ├── helpers/                     # Helper functions
│   │   ├── exportHelper.ts
│   │   └── formatHelper.ts
│   │
│   ├── providers/
│   │   └── TemplateProviders.tsx   # Combined providers
│   │
│   └── app/[locale]/               # Next.js pages
│       ├── (unauth)/
│       │   ├── demo-home/
│       │   │   └── page.tsx
│       │   └── demo/
│       │       ├── theme-switcher/
│       │       │   └── page.tsx
│       │       └── areas/
│       │           └── page.tsx
│       └── (auth)/
│           └── dashboard/
│               ├── plugins/
│               │   └── page.tsx
│               └── export-demo/
│                   └── page.tsx
│
├── TEMPLATING_IMPLEMENTATION.md     # Dokumentasi implementasi
├── PENJELASAN_TEMPLATING.md        # Penjelasan konsep
├── QUICK_START.md                   # Quick start guide
└── README_PRAKTIKUM.md             # Dokumentasi praktikum (file ini)
```

---

## Cara Menjalankan Aplikasi

### Prerequisites
- Node.js 20+
- npm atau yarn

### Installation

```bash
# 1. Clone repository (jika belum)
git clone <repository-url>

# 2. Masuk ke direktori project
cd SaaS-Boilerplate-Modification

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev

# 5. Buka browser
http://localhost:3000/demo-home
```

### Demo Pages

| URL | Deskripsi |
|-----|-----------|
| `/demo-home` | Landing page dengan overview semua fitur |
| `/demo/theme-switcher` | Demo theme switching dengan preview |
| `/demo/areas` | Visualisasi area system dengan statistics |
| `/dashboard/plugins` | Plugin manager untuk enable/disable plugins |
| `/dashboard/export-demo` | Demo export data (CSV, Excel, JSON) |

---

## Testing Konsep Templating

### 1. Test Template Engine Abstraction

**Browser Console:**
```javascript
// Check template engine stats
templateEngine.getStats()
// Output: { layouts: 2, partials: 2, components: 4 }

// Check registered layouts
templateEngine.getAllLayouts()
// Output: Map dengan MainLayout, DashboardLayout
```

### 2. Test Layout & Partial

**Langkah:**
```
1. Buka halaman /demo-home
2. Lihat Header → sama di semua halaman
3. Buka /dashboard → Header berubah ke Dashboard Header
4. Kembali ke /demo-home → Header kembali ke default
```

**Verifikasi:**
- Header dan Footer konsisten di semua halaman publik
- Dashboard menggunakan DashboardLayout yang berbeda
- Partial components dapat digunakan berulang

### 3. Test Area / Region System

**Langkah:**
```
1. Buka /demo/areas
2. Lihat statistics area (berapa area aktif)
3. Lihat sidebar kiri → ada widget User Stats & Quick Actions
4. Lihat sidebar kanan → ada widget Recent Posts
5. Lihat hero area → ada Slideshow
```

**Verifikasi:**
- Widgets muncul di area yang tepat
- Priority dipatuhi (urutan widget sesuai priority)
- Area renderer berfungsi dengan baik

### 4. Test Theme System

**Langkah:**
```
1. Buka /demo/theme-switcher
2. Theme aktif: Default
3. Klik theme "Modern"
4. Lihat perubahan warna (biru → pink)
5. Refresh page
6. Theme masih "Modern" (persistent)
7. Buka tab baru → theme tetap "Modern"
```

**Verifikasi:**
- Theme switching real-time tanpa reload
- Theme tersimpan di localStorage
- Semua komponen ikut berubah style
- CSS variables terupdate

---

## Hasil Implementasi

### Checklist Konsep

- ✅ **Template Engine Abstraction**
  - Component registry system
  - Dynamic component rendering
  - Configuration management
  - Persistent storage

- ✅ **Layout & Partial**
  - 2 Layouts (MainLayout, DashboardLayout)
  - 2+ Partials (Header, Footer)
  - Reusable components
  - DRY principle

- ✅ **Area / Region**
  - 8 Predefined areas
  - Dynamic component placement
  - Priority-based ordering
  - Enable/disable functionality

- ✅ **Theme System**
  - 3 Themes (Default, Modern, Dark)
  - Dynamic switching
  - localStorage persistence
  - CSS variables injection

### Statistics

- **Total Files Created:** 40+ files
- **Core Systems:** 4 (TemplateEngine, AreaManager, ThemeManager, PluginRegistry)
- **Themes:** 3 themes dengan berbagai color schemes
- **Plugins:** 4 plugins (Slideshow, UserStats, RecentPosts, QuickActions)
- **Layouts:** 2 layouts dengan struktur berbeda
- **Partials:** 2+ reusable partials
- **Demo Pages:** 5 demo pages untuk showcase
- **Helper Functions:** 15+ utility functions
- **Documentation:** 4 comprehensive markdown files

---

## Teknologi yang Digunakan

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Storage:** localStorage (browser)
- **Build Tool:** Webpack (via Next.js)
- **Package Manager:** npm

---

## Konsep yang Dipelajari

### 1. Separation of Concerns
- Pemisahan logic dan presentation
- Component-based architecture
- Modular code structure

### 2. Design Patterns
- **Singleton Pattern** (Manager classes)
- **Registry Pattern** (Component & Plugin registry)
- **Observer Pattern** (Context API)
- **Factory Pattern** (Component creation)

### 3. Best Practices
- DRY (Don't Repeat Yourself)
- SOLID principles
- Component reusability
- Type safety dengan TypeScript
- Clean code architecture

### 4. Web Development Concepts
- Template engines
- Dynamic rendering
- CSS variables
- Browser storage (localStorage)
- React hooks & context
- Next.js App Router

---

## Kesimpulan

Praktikum ini berhasil mengimplementasikan konsep **Templating** dalam pengembangan web modern dengan mengadaptasi konsep tradisional (EJS-based) ke dalam ekosistem **React/Next.js**.

### Pencapaian:

1. ✅ Implementasi **Template Engine Abstraction** dengan component registry
2. ✅ Implementasi **Layout & Partial** system dengan 2 layouts dan multiple partials
3. ✅ Implementasi **Area/Region** system dengan 8 predefined areas
4. ✅ Implementasi **Theme System** dengan 3 themes dan dynamic switching

### Value Praktikum:

- Memahami konsep templating dalam konteks modern web development
- Implementasi design patterns (Singleton, Registry, Observer)
- Separation of concerns antara logic dan presentation
- Modular dan extensible architecture
- Production-ready code structure

### Aplikasi Real-World:

Sistem ini dapat digunakan untuk:
- Building CMS (Content Management System)
- Multi-tenant SaaS applications
- White-label products
- Enterprise applications dengan berbagai themes
- Plugin-based architectures

---

## Dokumentasi Tambahan

- **TEMPLATING_IMPLEMENTATION.md** - Detail implementasi teknis setiap konsep
- **PENJELASAN_TEMPLATING.md** - Penjelasan lengkap tentang templating system
- **QUICK_START.md** - Quick start guide dan testing checklist

---

## Referensi

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org/docs
- Templating Engine Concepts: https://en.wikipedia.org/wiki/Template_engine
- Design Patterns: "Gang of Four" Design Patterns

---

**Praktikum Week 8 - Templating System**  
Pengembangan Web  
© 2024

