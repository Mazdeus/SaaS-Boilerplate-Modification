# Hero Duplication Fix Documentation

## Problem Description

Masalah terjadi ketika berpindah halaman antara `/company-profile` dan `/demo/areas`. Hero component mengalami duplikasi karena:

1. `AreaManager` menggunakan localStorage untuk persist state
2. Komponen yang diregistrasi di halaman sebelumnya tidak otomatis dibersihkan
3. Saat pindah halaman, komponen baru ditambahkan tanpa menghapus yang lama

## Root Cause Analysis

```typescript
// company-profile page
registerComponent(AREAS.HERO, {
  id: 'company-slideshow',
  component: CompanySlideshowPlugin,
  // ...
});

// demo/areas page  
registerComponent(AREAS.HERO, {
  id: 'slideshow-demo', 
  component: SlideshowPlugin,
  // ...
});

// Result: AREAS.HERO contains both components!
```

## Solutions Implemented

### 1. Route-Based Cleanup Hook

Created `useRouteCleanup` hook to automatically clean areas when route changes:

```typescript
// hooks/useRouteCleanup.ts
export function useRouteCleanup(config: RouteCleanupConfig = {}) {
  const pathname = usePathname();
  // Automatically clear specified areas when route changes
}
```

### 2. Enhanced AreaManager Methods

Added new methods to AreaManager:

```typescript
// Clear specific areas silently
clearAreaSilent(area: AreaType): void

// Clear multiple areas at once  
clearAreas(areas: AreaType[]): void

// Clear by component pattern/prefix
clearComponentsByPattern(pattern: string): void
```

### 3. Improved Component Registration

Enhanced registration logic to prevent unnecessary duplicates:

```typescript
// AreaContext.tsx - Check before registering
const registerComponent = useCallback((area: AreaType, component: AreaComponent) => {
  const existing = areaManager.getComponent(area, component.id);
  if (existing && existing.component === component.component) {
    return; // Skip if same component already registered
  }
  areaManager.register(area, component);
}, []);
```

### 4. Page-Level Cleanup

Each page now cleans its areas before registering:

```typescript
// company-profile/page.tsx
export default function CompanyProfilePage() {
  useRouteCleanup({ areas: [AREAS.HERO] }); // Auto cleanup on route change
  
  useEffect(() => {
    import('@/core/AreaManager').then(({ areaManager }) => {
      areaManager.clearArea(AREAS.HERO); // Manual cleanup before register
      registerComponent(AREAS.HERO, { /* ... */ });
    });
  }, []);
}
```

## Usage Guidelines

### For New Pages

1. **Always use cleanup hook:**
```typescript
// Clean specific areas
useRouteCleanup({ areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT] });

// Or clean by pattern
useRouteCleanup({ pattern: 'company-' });

// Or clean all (use carefully!)
useRouteCleanup({ clearAll: true });
```

2. **Manual cleanup before registration:**
```typescript
useEffect(() => {
  import('@/core/AreaManager').then(({ areaManager }) => {
    // Clear before registering to prevent conflicts
    areaManager.clearArea(AREAS.HERO);
    
    registerComponent(AREAS.HERO, {
      id: 'unique-component-id',
      component: YourComponent,
      // ...
    });
  });
}, []);
```

### Component ID Naming Convention

Use descriptive, page-specific IDs to avoid conflicts:

```typescript
// Good ✅
id: 'company-profile-hero-slideshow'
id: 'demo-areas-slideshow'
id: 'landing-page-hero'

// Bad ❌  
id: 'slideshow'
id: 'hero'
id: 'component'
```

## Testing

Run the test to verify fix:

```typescript
import { testHeroDuplication } from '@/utils/testHeroDuplication';
testHeroDuplication(); // Check console for results
```

## Benefits

1. **No More Duplicates**: Hero components no longer duplicate when switching pages
2. **Better Performance**: Unused components are cleaned up automatically
3. **Predictable Behavior**: Each page controls its own area components
4. **Easy Debugging**: Clear logging shows what components are registered/cleared

## Migration Notes

Existing pages should be updated to include:
1. `useRouteCleanup` hook for automatic cleanup
2. Manual cleanup before component registration
3. Unique component IDs following naming convention

This fix ensures that each page has complete control over its area components without interference from other pages.
