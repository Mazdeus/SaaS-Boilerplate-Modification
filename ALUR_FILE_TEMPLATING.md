# 🗂️ Alur File Sistem Templating
## Penjelasan dengan File yang Dipanggil/Digunakan

---

## 📋 **DAFTAR FILE PENTING**

### **Core System Files:**
```
src/core/
├── types.ts              # Type definitions (AREAS, interfaces)
├── TemplateEngine.ts     # Template engine singleton
├── AreaManager.ts        # Area/region manager
└── ThemeManager.ts       # Theme manager

src/contexts/
├── ThemeContext.tsx      # Theme provider & hooks
└── AreaContext.tsx       # Area provider & hooks

src/providers/
└── TemplateProviders.tsx # Root provider wrapper
```

### **Theme Files:**
```
src/themes/
├── default/
│   ├── theme.config.ts   # Default theme config
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── DashboardLayout.tsx
│   └── partials/
│       ├── Header.tsx
│       └── Footer.tsx
├── modern/
│   └── theme.config.ts
└── dark/
    └── theme.config.ts
```

### **Plugin Files:**
```
src/plugins/
├── index.ts                    # Export semua plugins
├── PluginRegistry.ts           # Plugin registry
├── slideshow/
│   └── SlideshowPlugin.tsx
├── user-stats/
│   └── UserStatsWidget.tsx
├── recent-posts/
│   └── RecentPostsWidget.tsx
└── quick-actions/
    └── QuickActionsWidget.tsx
```

### **Component Files:**
```
src/components/
├── AreaRenderer.tsx      # Render area components
└── ThemeSwitcher.tsx     # Theme selector UI
```

### **Page Files:**
```
src/app/[locale]/
├── layout.tsx                              # Root layout
├── (unauth)/
│   ├── demo-home/page.tsx                 # Demo home page
│   └── demo/
│       ├── theme-switcher/page.tsx        # Theme demo
│       └── areas/page.tsx                 # Area demo
└── (auth)/
    └── dashboard/
        ├── plugins/page.tsx               # Plugin manager
        └── export-demo/page.tsx           # Export demo
```

---

## 🚀 **ALUR LENGKAP: APPLICATION STARTUP**

### **Step 1: Next.js Load Root Layout**

```
FILE: src/app/[locale]/layout.tsx
═══════════════════════════════════════════

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TemplateProviders>    ← Import dari providers
          {children}
        </TemplateProviders>
      </body>
    </html>
  )
}

FILE YANG DIPANGGIL:
→ src/providers/TemplateProviders.tsx
  FUNGSI: Root provider yang wrap semua context (Theme & Area)
  PERAN: Initialize seluruh templating system saat app start
  OUTPUT: Menyediakan akses ke theme & area system untuk seluruh app
```

---

### **Step 2: Template Providers Initialize**

```
FILE: src/providers/TemplateProviders.tsx
═══════════════════════════════════════════

'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'    ← Import
import { AreaProvider } from '@/contexts/AreaContext'      ← Import

export function TemplateProviders({ children }) {
  return (
    <ThemeProvider>          ← Initialize theme system
      <AreaProvider>         ← Initialize area system
        {children}
      </AreaProvider>
    </ThemeProvider>
  )
}

FILE YANG DIPANGGIL:
→ src/contexts/ThemeContext.tsx
  FUNGSI: React Context provider untuk theme system
  PERAN: Bridge antara ThemeManager dan React components
  OUTPUT: Provide currentTheme, setTheme, availableThemes ke components

→ src/contexts/AreaContext.tsx
  FUNGSI: React Context provider untuk area system
  PERAN: Bridge antara AreaManager dan React components
  OUTPUT: Provide registerComponent, getComponents, toggleComponent
```

---

### **Step 3: Theme Provider Initialize**

```
FILE: src/contexts/ThemeContext.tsx
═══════════════════════════════════════════

import { ThemeManager } from '@/core/ThemeManager'           ← Import
import { defaultTheme } from '@/themes/default/theme.config' ← Import
import { modernTheme } from '@/themes/modern/theme.config'   ← Import
import { darkTheme } from '@/themes/dark/theme.config'       ← Import

const themeManager = ThemeManager.getInstance()  ← Singleton

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  const [availableThemes, setAvailableThemes] = useState([])

  useEffect(() => {
    // STEP 3.1: Register themes
    themeManager.registerTheme(defaultTheme)   ← Daftar default
    themeManager.registerTheme(modernTheme)    ← Daftar modern
    themeManager.registerTheme(darkTheme)      ← Daftar dark
    
    // STEP 3.2: Initialize (load dari localStorage)
    themeManager.initialize()
    
    // STEP 3.3: Get current theme
    const theme = themeManager.getCurrentTheme()
    if (theme) setCurrentTheme(theme)
    
    // STEP 3.4: Get all themes
    setAvailableThemes(Array.from(themeManager.getAllThemes()))
  }, [])

  const handleSetTheme = (themeId: string) => {
    themeManager.setTheme(themeId)
    const theme = themeManager.getCurrentTheme()
    if (theme) setCurrentTheme(theme)
  }

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme: handleSetTheme, 
      availableThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

FILE YANG DIPANGGIL:
→ src/core/ThemeManager.ts
  FUNGSI: Singleton class untuk manage theme system
  PERAN: Register themes, apply CSS variables, save preferences
  OUTPUT: Theme configuration & CSS variables ke DOM

→ src/themes/default/theme.config.ts
  FUNGSI: Konfigurasi Default theme (Blue, Professional)
  PERAN: Data source untuk warna, font, style default theme
  OUTPUT: ThemeConfig object dengan primary: #3b82f6

→ src/themes/modern/theme.config.ts
  FUNGSI: Konfigurasi Modern theme (Pink, Colorful)
  PERAN: Data source untuk warna, font, style modern theme
  OUTPUT: ThemeConfig object dengan primary: #ec4899

→ src/themes/dark/theme.config.ts
  FUNGSI: Konfigurasi Dark theme (Dark Mode)
  PERAN: Data source untuk warna, font, style dark theme
  OUTPUT: ThemeConfig object dengan background gelap
```

---

### **Step 4: Theme Manager Processing**

```
FILE: src/core/ThemeManager.ts
═══════════════════════════════════════════

import type { ThemeConfig } from './types'  ← Import types

export class ThemeManager {
  private static instance: ThemeManager
  private themes: Map<string, ThemeConfig> = new Map()
  private currentThemeId: string = 'default'

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme)
    console.log(`Theme "${theme.name}" registered`)
  }

  initialize(): void {
    // STEP 4.1: Load dari localStorage
    const savedThemeId = localStorage.getItem('current-theme')
    
    if (savedThemeId && this.themes.has(savedThemeId)) {
      this.setTheme(savedThemeId)
    } else {
      this.setTheme('default')
    }
  }

  setTheme(themeId: string): boolean {
    if (!this.themes.has(themeId)) return false
    
    this.currentThemeId = themeId
    this.applyTheme()        ← Apply CSS variables
    this.savePreference()    ← Save to localStorage
    
    return true
  }

  private applyTheme(): void {
    const theme = this.getCurrentTheme()
    if (!theme) return

    const root = document.documentElement

    // STEP 4.2: Apply colors as CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // STEP 4.3: Apply fonts
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value)
    })

    // STEP 4.4: Apply styles
    Object.entries(theme.styles).forEach(([key, value]) => {
      root.style.setProperty(`--style-${key}`, value)
    })

    // STEP 4.5: Add theme class to body
    document.body.className = `theme-${theme.id}`
  }

  private savePreference(): void {
    localStorage.setItem('current-theme', this.currentThemeId)
  }

  getCurrentTheme(): ThemeConfig | undefined {
    return this.themes.get(this.currentThemeId)
  }

  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values())
  }
}

FILE YANG DIPANGGIL:
→ src/core/types.ts
  FUNGSI: TypeScript type definitions & constants
  PERAN: Definisi ThemeConfig, AreaType, Plugin interfaces & AREAS constant
  OUTPUT: Type safety untuk seluruh aplikasi
```

---

### **Step 5: Area Provider Initialize**

```
FILE: src/contexts/AreaContext.tsx
═══════════════════════════════════════════

import { AreaManager } from '@/core/AreaManager'     ← Import
import { AREAS } from '@/core/types'                 ← Import
import { pluginRegistry } from '@/plugins'           ← Import

const areaManager = AreaManager.getInstance()  ← Singleton

export function AreaProvider({ children }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    // STEP 5.1: Initialize plugins
    initializePlugins()
    
    // STEP 5.2: Subscribe to changes
    areaManager.subscribe(() => forceUpdate())
  }, [])

  const initializePlugins = () => {
    // Get all plugins from registry
    const plugins = pluginRegistry.getAllPlugins()
    
    // Register each plugin to its areas
    plugins.forEach(plugin => {
      if (plugin.enabled) {
        plugin.areas.forEach(area => {
          areaManager.register(area, {
            id: plugin.id,
            component: plugin.component,
            priority: plugin.priority || 50,
            enabled: plugin.enabled,
            areaId: area,
            props: plugin.config || {}
          })
        })
      }
    })
  }

  const registerComponent = (area: AreaType, component: AreaComponent) => {
    areaManager.register(area, component)
  }

  const getComponents = (area: AreaType): AreaComponent[] => {
    return areaManager.getComponents(area)
  }

  const toggleComponent = (area: AreaType, componentId: string) => {
    areaManager.toggleComponent(area, componentId)
  }

  return (
    <AreaContext.Provider value={{ 
      registerComponent, 
      getComponents, 
      toggleComponent 
    }}>
      {children}
    </AreaContext.Provider>
  )
}

FILE YANG DIPANGGIL:
→ src/core/AreaManager.ts
  FUNGSI: Singleton class untuk manage area/region system
  PERAN: Register components ke areas, sort by priority, toggle enable/disable
  OUTPUT: Daftar components untuk setiap area

→ src/core/types.ts
  FUNGSI: Type definitions & AREAS constant
  PERAN: Define AREAS (hero, sidebar-left, dll) & interfaces
  OUTPUT: AreaType, AreaComponent interfaces

→ src/plugins/index.ts
  FUNGSI: Central file untuk register semua plugins
  PERAN: Initialize PluginRegistry & register 4 plugins
  OUTPUT: pluginRegistry singleton instance
```

---

### **Step 6: Plugin Registry Loading**

```
FILE: src/plugins/index.ts
═══════════════════════════════════════════

import { PluginRegistry } from './PluginRegistry'              ← Import
import { SlideshowPlugin } from './slideshow/SlideshowPlugin'  ← Import
import { UserStatsWidget } from './user-stats/UserStatsWidget' ← Import
import { RecentPostsWidget } from './recent-posts/RecentPostsWidget'
import { QuickActionsWidget } from './quick-actions/QuickActionsWidget'
import { AREAS } from '@/core/types'

export const pluginRegistry = new PluginRegistry()

// STEP 6.1: Register Slideshow Plugin
pluginRegistry.register({
  id: 'slideshow-plugin',
  name: 'Slideshow',
  version: '1.0.0',
  description: 'Image carousel for hero area',
  areas: [AREAS.HERO],
  component: SlideshowPlugin,
  priority: 10,
  enabled: true,
  icon: '🖼️'
})

// STEP 6.2: Register User Stats Widget
pluginRegistry.register({
  id: 'user-stats-widget',
  name: 'User Statistics',
  version: '1.0.0',
  description: 'Display user statistics',
  areas: [AREAS.SIDEBAR_LEFT],
  component: UserStatsWidget,
  priority: 10,
  enabled: true,
  icon: '📊'
})

// STEP 6.3: Register Recent Posts Widget
pluginRegistry.register({
  id: 'recent-posts-widget',
  name: 'Recent Posts',
  version: '1.0.0',
  description: 'Show recent blog posts',
  areas: [AREAS.SIDEBAR_RIGHT],
  component: RecentPostsWidget,
  priority: 10,
  enabled: true,
  icon: '📝'
})

// STEP 6.4: Register Quick Actions Widget
pluginRegistry.register({
  id: 'quick-actions-widget',
  name: 'Quick Actions',
  version: '1.0.0',
  description: 'Quick action buttons',
  areas: [AREAS.SIDEBAR_LEFT],
  component: QuickActionsWidget,
  priority: 20,
  enabled: true,
  icon: '⚡'
})

FILE YANG DIPANGGIL:
→ src/plugins/PluginRegistry.ts
  FUNGSI: Registry class untuk store & manage plugin metadata
  PERAN: Register plugins, toggle ON/OFF, save/load dari localStorage
  OUTPUT: Plugin management system

→ src/plugins/slideshow/SlideshowPlugin.tsx
  FUNGSI: Image carousel/slideshow component
  PERAN: Display slideshow di hero area (banner)
  OUTPUT: Auto-play image slider UI

→ src/plugins/user-stats/UserStatsWidget.tsx
  FUNGSI: User statistics widget
  PERAN: Display total users, active, inactive metrics
  OUTPUT: Stats card di sidebar-left

→ src/plugins/recent-posts/RecentPostsWidget.tsx
  FUNGSI: Recent blog posts widget
  PERAN: Show list of recent posts dengan title & date
  OUTPUT: Post list di sidebar-right

→ src/plugins/quick-actions/QuickActionsWidget.tsx
  FUNGSI: Quick action buttons widget
  PERAN: Provide shortcuts untuk New Post, Settings, Analytics
  OUTPUT: Action buttons di sidebar-left

→ src/core/types.ts
  FUNGSI: Type definitions
  PERAN: Provide Plugin, AreaType interfaces & AREAS constant
  OUTPUT: Type safety untuk plugin system
```

---

## 🌐 **ALUR: USER BUKA HALAMAN /demo-home**

### **Step 1: Next.js Routing**

```
URL: http://localhost:3000/demo-home
↓
Next.js mencari file: src/app/[locale]/(unauth)/demo-home/page.tsx
```

---

### **Step 2: Page Component Load**

```
FILE: src/app/[locale]/(unauth)/demo-home/page.tsx
═══════════════════════════════════════════════════

import { MainLayout } from '@/themes/default/layouts/MainLayout'  ← Import

export default function DemoHomePage() {
  return (
    <MainLayout>
      <div className="py-12">
        <h1 className="text-4xl font-bold">Welcome to Demo Home</h1>
        <p>This page demonstrates the templating system.</p>
      </div>
    </MainLayout>
  )
}

FILE YANG DIPANGGIL:
→ src/themes/default/layouts/MainLayout.tsx
  FUNGSI: Layout utama untuk halaman public (unauth)
  PERAN: Structure: Header → Hero → Sidebar+Content → Footer
  OUTPUT: Kerangka halaman dengan multiple areas
```

---

### **Step 3: Main Layout Rendering**

```
FILE: src/themes/default/layouts/MainLayout.tsx
═══════════════════════════════════════════════════

import { Header } from '../partials/Header'           ← Import Header
import { Footer } from '../partials/Footer'           ← Import Footer
import { AreaRenderer } from '@/components/AreaRenderer'  ← Import
import { AREAS } from '@/core/types'                  ← Import

export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* STEP 3.1: Render Header Partial */}
      <Header />
      
      {/* STEP 3.2: Render Hero Area */}
      <AreaRenderer area={AREAS.HERO} />
      
      {/* STEP 3.3: Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            
            {/* STEP 3.4: Left Sidebar Area */}
            <aside className="w-64 flex-shrink-0">
              <AreaRenderer area={AREAS.SIDEBAR_LEFT} />
            </aside>
            
            {/* STEP 3.5: Main Content */}
            <div className="flex-1">
              <AreaRenderer area={AREAS.CONTENT_BEFORE} />
              {children}  {/* ← Konten dari page.tsx */}
              <AreaRenderer area={AREAS.CONTENT_AFTER} />
            </div>
            
            {/* STEP 3.6: Right Sidebar Area */}
            <aside className="w-64 flex-shrink-0">
              <AreaRenderer area={AREAS.SIDEBAR_RIGHT} />
            </aside>
            
          </div>
        </div>
      </main>
      
      {/* STEP 3.7: Render Footer Partial */}
      <Footer />
      
    </div>
  )
}

FILE YANG DIPANGGIL:
→ src/themes/default/partials/Header.tsx
  FUNGSI: Header/navbar partial component
  PERAN: Display logo, navigation, theme switcher, auth buttons
  OUTPUT: Consistent header di semua public pages

→ src/themes/default/partials/Footer.tsx
  FUNGSI: Footer partial component
  PERAN: Display footer links (4 columns) & copyright
  OUTPUT: Consistent footer di semua public pages

→ src/components/AreaRenderer.tsx (dipanggil 5x untuk berbeda area)
  FUNGSI: Component renderer untuk dynamic areas
  PERAN: Get & render semua components di area tertentu
  OUTPUT: Rendered widgets/components sesuai area & priority

→ src/core/types.ts
  FUNGSI: Type definitions & AREAS constant
  PERAN: Provide AREAS constant (hero, sidebar-left, dll)
  OUTPUT: Area names untuk AreaRenderer
```

---

### **Step 4: Header Partial Rendering**

```
FILE: src/themes/default/partials/Header.tsx
═══════════════════════════════════════════════════

import Link from 'next/link'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'  ← Import
import { Logo } from '@/templates/Logo'                     ← Import

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* STEP 4.1: Logo */}
          <Link href="/">
            <Logo />
          </Link>
          
          {/* STEP 4.2: Navigation */}
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/demo/theme-switcher">Themes</Link>
            <Link href="/demo/areas">Areas</Link>
          </nav>
          
          {/* STEP 4.3: Theme Switcher */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/sign-in">Sign In</Link>
          </div>
          
        </div>
      </div>
    </header>
  )
}

FILE YANG DIPANGGIL:
→ src/components/ThemeSwitcher.tsx
  FUNGSI: Theme selector UI component
  PERAN: Dropdown untuk select & change theme
  OUTPUT: Interactive theme switcher di navbar

→ src/templates/Logo.tsx
  FUNGSI: Logo component
  PERAN: Display brand logo/name
  OUTPUT: Clickable logo link to home
```

---

### **Step 5: Area Renderer Working**

```
FILE: src/components/AreaRenderer.tsx
═══════════════════════════════════════════════════

import { useArea } from '@/contexts/AreaContext'  ← Import hook
import type { AreaType } from '@/core/types'

export function AreaRenderer({ area, fallback }: AreaRendererProps) {
  
  // STEP 5.1: Get area context
  const { getComponents } = useArea()
  
  // STEP 5.2: Get all components for this area
  const components = getComponents(area)
  
  // STEP 5.3: If no components, show fallback
  if (components.length === 0) {
    return <>{fallback || null}</>
  }
  
  // STEP 5.4: Render all components
  return (
    <div className={`area-${area}`} data-area={area}>
      {components.map((areaComponent) => {
        const Component = areaComponent.component
        
        return (
          <div 
            key={areaComponent.id} 
            data-component-id={areaComponent.id}
            className="mb-4"
          >
            <Component {...(areaComponent.props || {})} />
          </div>
        )
      })}
    </div>
  )
}

CONTOH: AreaRenderer untuk SIDEBAR_LEFT
═════════════════════════════════════════

1. getComponents(AREAS.SIDEBAR_LEFT) dipanggil
   ↓
2. AreaManager return:
   [
     { id: 'user-stats-widget', component: UserStatsWidget, priority: 10 },
     { id: 'quick-actions-widget', component: QuickActionsWidget, priority: 20 }
   ]
   ↓
3. Render:
   <UserStatsWidget />       ← Priority 10 (render first)
   <QuickActionsWidget />    ← Priority 20 (render second)

FILE YANG DIPANGGIL:
→ src/contexts/AreaContext.tsx (useArea hook)
  FUNGSI: React hook untuk akses area context
  PERAN: Provide getComponents, registerComponent, toggleComponent
  OUTPUT: Area management functions

→ src/plugins/user-stats/UserStatsWidget.tsx
  FUNGSI: User stats widget component
  PERAN: Render user statistics (total, active, inactive)
  OUTPUT: Stats card dengan icons & numbers

→ src/plugins/quick-actions/QuickActionsWidget.tsx
  FUNGSI: Quick actions widget component
  PERAN: Render action buttons (New Post, Settings, Analytics)
  OUTPUT: Button group dengan icons
```

---

### **Step 6: Footer Partial Rendering**

```
FILE: src/themes/default/partials/Footer.tsx
═══════════════════════════════════════════════════

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* STEP 6.1: Footer Links */}
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          
          {/* ... 2 kolom lagi ... */}
        </div>
        
        {/* STEP 6.2: Copyright */}
        <div className="border-t pt-8 text-center text-gray-600">
          <p>© 2024 SaaS Template - Praktikum Week 8</p>
        </div>
        
      </div>
    </footer>
  )
}

FILE YANG DIPANGGIL:
→ (Tidak ada, hanya Next.js Link component)
  CATATAN: Footer hanya menggunakan Next.js built-in Link component
  PERAN: Render static footer links & copyright text
  OUTPUT: Footer UI tanpa dynamic dependencies
```

---

## 🎨 **ALUR: USER GANTI THEME**

### **Step 1: User Interaction**

```
User klik dropdown di ThemeSwitcher → pilih "Modern"
↓
onChange event triggered
```

---

### **Step 2: Theme Switcher Component**

```
FILE: src/components/ThemeSwitcher.tsx
═══════════════════════════════════════════════════

import { useTheme } from '@/contexts/ThemeContext'  ← Import hook

export function ThemeSwitcher() {
  
  // STEP 2.1: Get theme context
  const { currentTheme, availableThemes, setTheme } = useTheme()
  
  // STEP 2.2: Handle change
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value)  ← Call setTheme dari context
  }
  
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Theme:</label>
      <select
        value={currentTheme.id}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        {availableThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}

FLOW:
User pilih "Modern" → handleChange('modern') → setTheme('modern')

FILE YANG DIPANGGIL:
→ src/contexts/ThemeContext.tsx (useTheme hook & setTheme function)
  FUNGSI: React hook useTheme & setTheme function
  PERAN: Provide currentTheme state & setTheme function ke components
  OUTPUT: Theme data & change theme functionality
```

---

### **Step 3: Theme Context Processing**

```
FILE: src/contexts/ThemeContext.tsx
═══════════════════════════════════════════════════

const handleSetTheme = (themeId: string) => {
  // STEP 3.1: Call ThemeManager
  themeManager.setTheme(themeId)  ← Call manager
  
  // STEP 3.2: Update state
  const theme = themeManager.getCurrentTheme()
  if (theme) {
    setCurrentTheme(theme)  ← Trigger re-render
  }
}

FILE YANG DIPANGGIL:
→ src/core/ThemeManager.ts (setTheme & getCurrentTheme)
  FUNGSI: ThemeManager methods untuk set & get theme
  PERAN: Apply theme ke DOM & return current theme data
  OUTPUT: Updated CSS variables & theme state
```

---

### **Step 4: Theme Manager Apply Theme**

```
FILE: src/core/ThemeManager.ts
═══════════════════════════════════════════════════

setTheme(themeId: string): boolean {
  if (!this.themes.has(themeId)) return false
  
  // STEP 4.1: Update current theme ID
  this.currentThemeId = themeId  // 'modern'
  
  // STEP 4.2: Apply theme to DOM
  this.applyTheme()
  
  // STEP 4.3: Save to localStorage
  this.savePreference()
  
  return true
}

private applyTheme(): void {
  // STEP 4.4: Get theme config
  const theme = this.themes.get('modern')
  
  // theme = {
  //   id: 'modern',
  //   name: 'Modern',
  //   colors: {
  //     primary: '#ec4899',    // Pink
  //     secondary: '#f59e0b',  // Amber
  //     ...
  //   }
  // }
  
  const root = document.documentElement  // <html> element
  
  // STEP 4.5: Apply CSS variables
  root.style.setProperty('--theme-primary', '#ec4899')
  root.style.setProperty('--theme-secondary', '#f59e0b')
  root.style.setProperty('--theme-background', '#fafafa')
  // ... dst untuk semua colors, fonts, styles
  
  // STEP 4.6: Update body class
  document.body.className = 'theme-modern'
}

private savePreference(): void {
  localStorage.setItem('current-theme', 'modern')
  localStorage.setItem('theme-updated-at', Date.now().toString())
}

FILE YANG DIPANGGIL:
→ src/themes/modern/theme.config.ts
  FUNGSI: Modern theme configuration data
  PERAN: Provide colors, fonts, styles untuk Modern theme
  OUTPUT: ThemeConfig object dengan primary: #ec4899 (Pink)
```

---

### **Step 5: Browser Re-paint**

```
CSS Variables berubah:
═══════════════════════

BEFORE:
<html style="--theme-primary: #3b82f6;">  (Blue)

AFTER:
<html style="--theme-primary: #ec4899;">  (Pink)

Semua element yang menggunakan var(--theme-primary) 
otomatis berubah warna!

HASIL:
• Buttons: Biru → Pink
• Links: Biru → Pink
• Borders: Biru → Pink
• Background: Putih → Abu muda
• ... semua yang pakai CSS variables berubah!
```

---

## 🔌 **ALUR: USER TOGGLE PLUGIN**

### **Step 1: User ke Plugin Manager Page**

```
URL: http://localhost:3000/dashboard/plugins
↓
FILE: src/app/[locale]/(auth)/dashboard/plugins/page.tsx
═══════════════════════════════════════════════════════════

import { DashboardLayout } from '@/themes/default/layouts/DashboardLayout'
import { pluginRegistry } from '@/plugins'  ← Import registry
import { useArea } from '@/contexts/AreaContext'  ← Import hook

export default function PluginsPage() {
  const { toggleComponent } = useArea()
  const plugins = pluginRegistry.getAllPlugins()
  
  // STEP 1.1: Handle toggle
  const handleToggle = (pluginId: string) => {
    // Toggle di registry
    pluginRegistry.togglePlugin(pluginId)
    
    // Toggle di area manager
    const plugin = pluginRegistry.getPlugin(pluginId)
    if (plugin) {
      plugin.areas.forEach(area => {
        toggleComponent(area, pluginId)
      })
    }
  }
  
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Plugin Manager</h1>
        
        <div className="grid gap-4">
          {plugins.map(plugin => (
            <div key={plugin.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{plugin.name}</h3>
                  <p className="text-sm text-gray-600">{plugin.description}</p>
                </div>
                
                <button
                  onClick={() => handleToggle(plugin.id)}
                  className={plugin.enabled ? 'bg-green-500' : 'bg-gray-300'}
                >
                  {plugin.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

FILE YANG DIPANGGIL:
→ src/themes/default/layouts/DashboardLayout.tsx
  FUNGSI: Dashboard layout component
  PERAN: Structure: Sidebar navigation + Main content area
  OUTPUT: Dashboard page layout

→ src/plugins/index.ts (pluginRegistry)
  FUNGSI: Plugin registry singleton
  PERAN: Provide getAllPlugins(), getPlugin(), togglePlugin() methods
  OUTPUT: Plugin data & management functions

→ src/contexts/AreaContext.tsx (useArea hook)
  FUNGSI: React hook untuk area context
  PERAN: Provide toggleComponent function
  OUTPUT: Toggle plugin di area functionality
```

---

### **Step 2: Plugin Registry Toggle**

```
FILE: src/plugins/PluginRegistry.ts
═══════════════════════════════════════════════════

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map()
  
  togglePlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    
    if (!plugin) return false
    
    // STEP 2.1: Toggle enabled status
    plugin.enabled = !plugin.enabled
    
    // STEP 2.2: Save to localStorage
    this.saveToStorage()
    
    // STEP 2.3: Notify listeners (untuk re-render)
    this.notifyListeners()
    
    return true
  }
  
  private saveToStorage(): void {
    const pluginsData = Array.from(this.plugins.values()).map(p => ({
      id: p.id,
      enabled: p.enabled
    }))
    
    localStorage.setItem('plugins-config', JSON.stringify(pluginsData))
  }
}

FILE YANG DIPANGGIL:
→ (Internal methods only)
```

---

### **Step 3: Area Manager Toggle**

```
FILE: src/core/AreaManager.ts
═══════════════════════════════════════════════════

export class AreaManager {
  private areas: Map<AreaType, AreaComponent[]> = new Map()
  
  toggleComponent(area: AreaType, componentId: string): void {
    // STEP 3.1: Get components in area
    const components = this.areas.get(area)
    
    if (!components) return
    
    // STEP 3.2: Find component
    const component = components.find(c => c.id === componentId)
    
    if (!component) return
    
    // STEP 3.3: Toggle enabled
    component.enabled = !component.enabled
    
    // STEP 3.4: Notify listeners (trigger re-render)
    this.notifyListeners()
  }
  
  getComponents(area: AreaType): AreaComponent[] {
    const components = this.areas.get(area) || []
    
    // STEP 3.5: Filter only enabled
    return components
      .filter(c => c.enabled)
      .sort((a, b) => a.priority - b.priority)
  }
  
  private notifyListeners(): void {
    // Trigger re-render semua component yang subscribe
    this.listeners.forEach(listener => listener())
  }
}

FILE YANG DIPANGGIL:
→ (Internal methods only)
```

---

### **Step 4: Component Re-render**

```
AreaRenderer di-subscribe ke AreaManager
↓
AreaManager.notifyListeners() dipanggil
↓
AreaRenderer re-render dengan getComponents() baru
↓
getComponents() return array tanpa component yang disabled
↓
Component hilang dari UI!

EXAMPLE:
═════════

BEFORE TOGGLE:
AreaRenderer(SIDEBAR_LEFT) renders:
  - UserStatsWidget (enabled: true) ✅
  - QuickActionsWidget (enabled: true) ✅

USER CLICKS: Toggle "UserStatsWidget"
↓
toggleComponent('sidebar-left', 'user-stats-widget')
↓
component.enabled = false
↓
notifyListeners()
↓
AreaRenderer re-render
↓

AFTER TOGGLE:
AreaRenderer(SIDEBAR_LEFT) renders:
  - UserStatsWidget (enabled: false) ❌ [FILTERED OUT]
  - QuickActionsWidget (enabled: true) ✅
```

---

## 📊 **DIAGRAM FLOW LENGKAP**

### **Application Startup Flow:**

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION START                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/app/[locale]/layout.tsx                       │
│ → Load TemplateProviders                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/providers/TemplateProviders.tsx               │
│ → Wrap dengan ThemeProvider & AreaProvider              │
└────────────────┬────────────────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ ThemeProvider│    │ AreaProvider │
└──────┬───────┘    └──────┬───────┘
       │                   │
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ ThemeManager │    │ AreaManager  │
│              │    │              │
│ • Register   │    │ • Register   │
│   themes     │    │   plugins    │
│ • Load saved │    │   to areas   │
│ • Apply CSS  │    │ • Sort by    │
│   variables  │    │   priority   │
└──────────────┘    └──────────────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              APPLICATION READY                          │
│   • Theme applied                                       │
│   • Plugins registered to areas                         │
│   • Ready to render pages                               │
└─────────────────────────────────────────────────────────┘
```

---

### **Page Rendering Flow:**

```
┌─────────────────────────────────────────────────────────┐
│           USER ACCESS: /demo-home                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/app/[locale]/(unauth)/demo-home/page.tsx     │
│ → Use MainLayout                                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/themes/default/layouts/MainLayout.tsx        │
│ → Render layout structure                               │
└────────────────┬────────────────────────────────────────┘
                 │
       ┌─────────┼─────────┬─────────┬─────────┐
       │         │         │         │         │
       ▼         ▼         ▼         ▼         ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
   │Header│ │ Hero │ │Sidebar│ │Content│ │Footer│
   │      │ │ Area │ │ Left │ │       │ │      │
   └──┬───┘ └──┬───┘ └──┬───┘ └───────┘ └──┬───┘
      │        │        │                    │
      ▼        ▼        ▼                    ▼
   ┌──────┐ ┌──────┐ ┌──────┐            ┌──────┐
   │Header│ │Area  │ │Area  │            │Footer│
   │.tsx  │ │Render│ │Render│            │.tsx  │
   └──────┘ └──┬───┘ └──┬───┘            └──────┘
               │        │
               ▼        ▼
          ┌────────┐ ┌────────┐
          │Slideshow│ │UserStats│
          │Plugin  │ │Widget  │
          └────────┘ └────────┘
                     ┌────────┐
                     │QuickAct│
                     │Widget  │
                     └────────┘
```

---

### **Theme Change Flow:**

```
┌─────────────────────────────────────────────────────────┐
│       USER: Click ThemeSwitcher → Select "Modern"       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/components/ThemeSwitcher.tsx                  │
│ → onChange triggered → setTheme('modern')               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/contexts/ThemeContext.tsx                     │
│ → Call themeManager.setTheme('modern')                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/core/ThemeManager.ts                          │
│ → Get modern theme config                               │
│ → Apply CSS variables to <html>                         │
│ → Save to localStorage                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ FILE: src/themes/modern/theme.config.ts                 │
│ → Return theme data (colors, fonts, styles)             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│         BROWSER DOM UPDATE                              │
│ → CSS Variables changed                                 │
│ → Browser re-paint                                      │
│ → UI updated (Blue → Pink)                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 **SUMMARY: FILE DEPENDENCIES**

### **Core Files (Singleton Classes):**
```
src/core/ThemeManager.ts
├── Used by: ThemeContext.tsx
├── Uses: themes/*/theme.config.ts
└── Output: CSS variables to DOM

src/core/AreaManager.ts
├── Used by: AreaContext.tsx
├── Uses: plugins/* (components)
└── Output: Component list for AreaRenderer

src/core/TemplateEngine.ts
├── Used by: (Future extensibility)
├── Uses: layouts/*, partials/*
└── Output: Component registry
```

### **Context Files (Providers):**
```
src/contexts/ThemeContext.tsx
├── Uses: ThemeManager.ts, theme.config.ts files
├── Provides: currentTheme, setTheme, availableThemes
└── Used by: ThemeSwitcher.tsx, any component

src/contexts/AreaContext.tsx
├── Uses: AreaManager.ts, plugins/*
├── Provides: registerComponent, getComponents, toggleComponent
└── Used by: AreaRenderer.tsx, plugin pages

src/providers/TemplateProviders.tsx
├── Uses: ThemeContext.tsx, AreaContext.tsx
├── Wraps: All app content
└── Loaded by: layout.tsx
```

### **Component Files:**
```
src/components/AreaRenderer.tsx
├── Uses: AreaContext.tsx
├── Receives: area prop (string)
└── Renders: All components in that area

src/components/ThemeSwitcher.tsx
├── Uses: ThemeContext.tsx
├── Receives: (none, self-contained)
└── Renders: Theme selector dropdown
```

### **Layout Files:**
```
src/themes/default/layouts/MainLayout.tsx
├── Uses: Header.tsx, Footer.tsx, AreaRenderer.tsx
├── Receives: children (page content)
└── Structure: Header → Areas → Content → Footer

src/themes/default/layouts/DashboardLayout.tsx
├── Uses: Different structure
├── Receives: children (page content)
└── Structure: Sidebar → Main content area
```

### **Plugin Files:**
```
src/plugins/index.ts
├── Uses: PluginRegistry.ts, all plugin components
├── Registers: All plugins with their configs
└── Exports: pluginRegistry singleton

src/plugins/*/[PluginName].tsx
├── Used by: AreaRenderer (via AreaManager)
├── Receives: props (optional)
└── Renders: Plugin UI
```

---

## 🎯 **UNTUK PRESENTASI**

### **Poin-poin Penting:**

1. **Initialization (Saat App Start):**
   - `layout.tsx` load `TemplateProviders.tsx`
   - `TemplateProviders` initialize `ThemeProvider` & `AreaProvider`
   - Providers setup `ThemeManager` & `AreaManager`
   - Plugins di-register ke areas
   - Theme di-load dari localStorage (jika ada)

2. **Page Rendering:**
   - User akses URL → Next.js route ke `page.tsx`
   - `page.tsx` wrap content dengan Layout
   - Layout render Partials (Header, Footer)
   - Layout render Areas dengan `AreaRenderer`
   - `AreaRenderer` get components dari `AreaManager`
   - Components di-render sesuai priority

3. **Theme Change:**
   - User klik `ThemeSwitcher` → pilih theme
   - `ThemeSwitcher` call `setTheme()` dari context
   - Context call `ThemeManager.setTheme()`
   - Manager apply CSS variables ke DOM
   - Browser auto re-paint dengan warna baru
   - Theme disimpan ke localStorage

4. **Plugin Toggle:**
   - User buka plugin manager page
   - Click toggle button
   - Call `pluginRegistry.togglePlugin()`
   - Call `areaManager.toggleComponent()`
   - Manager update enabled status
   - Notify listeners → re-render
   - `AreaRenderer` filter out disabled component

---

## ✨ **KESIMPULAN**

### **Flow Sederhana:**
```
1. App Start
   → Load Providers
   → Setup Managers
   → Register Themes & Plugins

2. User Buka Page
   → Load Layout
   → Render Partials
   → Render Areas
   → Display Plugins

3. User Interact
   → Change Theme / Toggle Plugin
   → Manager Update State
   → Components Re-render
   → UI Updated
```

### **File Dependencies:**
```
Pages → Layouts → Partials + Areas
Areas → AreaRenderer → AreaManager → Plugins
Themes → ThemeContext → ThemeManager → theme.config.ts
```

---

**Praktikum Week 8 - Templating System**  
**File Flow Documentation**  
© 2024

