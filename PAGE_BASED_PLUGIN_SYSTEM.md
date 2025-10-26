# Page-Based Plugin Management System

## Problem Statement

Sebelumnya, semua plugin yang terdaftar di `PluginRegistry` akan muncul di semua halaman yang menggunakan layout yang sama. Ini menyebabkan:

- Plugin tidak relevan muncul di halaman yang salah
- Company profile menampilkan plugin demo
- Demo pages menampilkan plugin company
- Sidebar menjadi terlalu penuh dengan widget yang tidak relevan

## Solution Overview

Implementasi sistem **Page-Based Plugin Management** yang memungkinkan:

1. **Plugin Configuration per Page** - Definisi plugin mana yang boleh muncul di halaman tertentu
2. **Automatic Plugin Registration** - Plugin otomatis terdaftar berdasarkan konfigurasi halaman
3. **Clean Separation** - Setiap halaman hanya menampilkan plugin yang relevan

## Core Components

### 1. PagePluginConfig (`src/core/PagePluginConfig.ts`)

```typescript
export const pagePluginConfig: PagePluginConfig = {
  '/company-profile': {
    allowedPlugins: [
      'company-info-widget',
      'company-team-widget', 
      'company-values-widget',
      'company-slideshow'
    ],
    defaultPlugins: [
      {
        pluginId: 'company-slideshow',
        area: AREAS.HERO,
        priority: 10
      },
      // ...
    ]
  },
  
  '/demo-home': {
    allowedPlugins: [
      'demo-slideshow',
      'demo-user-stats',
      'demo-quick-actions',
      'demo-recent-posts'
    ],
    // ...
  }
};
```

### 2. usePagePlugins Hook (`src/hooks/usePagePlugins.ts`)

```typescript
// Define plugins for your page
const companyPagePlugins = {
  'company-slideshow': {
    component: CompanySlideshowPlugin,
    area: AREAS.HERO,
    priority: 10,
  },
  // ...
};

// Use in component
export default function CompanyProfilePage() {
  usePagePlugins(companyPagePlugins);
  // Page will automatically load only relevant plugins
}
```

### 3. Enhanced AreaManager Methods

```typescript
// Register component with page-based filtering
areaManager.registerForPage(area, component, pathname);

// Initialize all components for a specific page
areaManager.initializeForPage(pathname, components);
```

## Page Configurations

### Company Profile Page (`/company-profile`)

**Relevant Plugins:**
- ✅ `company-slideshow` - Hero area slideshow
- ✅ `company-info-widget` - Left sidebar company info
- ✅ `company-values-widget` - Left sidebar company values  
- ✅ `company-team-widget` - Right sidebar team info

**Excluded:**
- ❌ Demo plugins (user-stats, recent-posts, etc.)
- ❌ Generic plugins tidak relevan untuk company profile

### Demo Home Page (`/demo-home`)

**Relevant Plugins:**
- ✅ `demo-slideshow` - Hero area demo
- ✅ `demo-user-stats` - Left sidebar user statistics
- ✅ `demo-quick-actions` - Left sidebar quick actions
- ✅ `demo-recent-posts` - Right sidebar recent posts

**Excluded:**
- ❌ Company-specific plugins
- ❌ Plugin management tools

### Plugin Demo Pages (`/demo/plugins`, `/dashboard/plugins`)

**Configuration:**
- ✅ `allowedPlugins: ['*']` - Allow all plugins for demonstration

## Implementation Guide

### Step 1: Define Page Plugin Mapping

```typescript
// In your page component
const pagePlugins = {
  'plugin-id': {
    component: PluginComponent,
    area: AREAS.SIDEBAR_LEFT,
    priority: 10,
  },
};
```

### Step 2: Add Page Configuration

```typescript
// In PagePluginConfig.ts
'/your-page': {
  allowedPlugins: ['plugin-id', 'another-plugin'],
  defaultPlugins: [
    {
      pluginId: 'plugin-id',
      area: AREAS.SIDEBAR_LEFT,
      priority: 10
    }
  ]
}
```

### Step 3: Use Page Plugin Hook

```typescript
export default function YourPage() {
  // Auto cleanup + register relevant plugins
  usePagePlugins(pagePlugins);
  
  return <YourPageContent />;
}
```

## Benefits

### ✅ Clean Separation
- Company profile hanya menampilkan plugin company
- Demo pages hanya menampilkan plugin demo
- Tidak ada plugin yang tidak relevan

### ✅ Automatic Management
- Plugin otomatis terdaftar berdasarkan halaman
- Automatic cleanup saat pindah halaman
- Tidak perlu manual registration di setiap halaman

### ✅ Flexible Configuration
- Easy to add/remove plugins per page
- Configurable priority dan area placement
- Support wildcard (`*`) untuk halaman demo

### ✅ Better Performance
- Hanya load plugin yang diperlukan
- Mengurangi memory usage
- Faster page transitions

## Migration from Old System

### Before:
```typescript
// Manual registration di setiap halaman
useEffect(() => {
  registerComponent(AREAS.SIDEBAR_LEFT, {
    id: 'some-plugin',
    component: SomePlugin,
    // ...
  });
}, []);
```

### After:
```typescript
// Configuration-based
const pagePlugins = {
  'some-plugin': {
    component: SomePlugin,
    area: AREAS.SIDEBAR_LEFT,
    priority: 10,
  }
};

usePagePlugins(pagePlugins);
```

## Testing

Test scenario untuk memverifikasi sistem bekerja:

1. **Visit `/company-profile`**
   - ✅ Hanya company plugins yang muncul
   - ✅ Company slideshow di hero
   - ✅ Company info, values di left sidebar
   - ✅ Company team di right sidebar

2. **Visit `/demo-home`** 
   - ✅ Hanya demo plugins yang muncul
   - ✅ Demo slideshow di hero
   - ✅ User stats, quick actions di left sidebar
   - ✅ Recent posts di right sidebar

3. **Switch between pages**
   - ✅ Plugin otomatis berganti sesuai halaman
   - ✅ Tidak ada duplikasi
   - ✅ Tidak ada plugin dari halaman sebelumnya

Sistem page-based plugin management memberikan kontrol penuh atas plugin mana yang muncul di halaman mana, menciptakan pengalaman pengguna yang lebih bersih dan relevan! 🎉
