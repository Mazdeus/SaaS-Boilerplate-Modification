# 📱 Collapsible Sidebar Documentation
## Part of Layout & Partial System - Templating Praktikum

---

## 🎯 Overview

**Collapsible Sidebar** adalah implementasi sidebar yang dapat dibuka/ditutup secara dinamis menggunakan burger menu button. Fitur ini merupakan bagian integral dari **Layout & Partial System** dalam konsep templating.

### Why Collapsible Sidebar?

1. ✅ **Better UX** - User control kapan sidebar muncul/hilang
2. ✅ **Responsive** - Adaptif untuk mobile & desktop
3. ✅ **Space Efficient** - Maksimalkan ruang konten saat sidebar ditutup
4. ✅ **Modern Pattern** - Sesuai dengan best practice modern web apps
5. ✅ **Demonstrates Templating** - Menunjukkan dynamic area rendering

---

## 🏗️ Architecture

### Component Structure

```
CollapsibleSidebar System
├── useSidebar.ts              # State management hook
├── CollapsibleSidebar.tsx     # Main sidebar component
├── SidebarToggleButton.tsx    # Burger menu button
├── MainLayout.tsx             # Layout integration
└── Header.tsx                 # Burger buttons in header
```

### Data Flow

```
User clicks burger → useSidebar hook → State update → CollapsibleSidebar re-render
                                                    ↓
                                              Show/Hide with animation
```

---

## 📁 File Details

### 1. `useSidebar.ts` - State Management Hook

**Location:** `src/hooks/useSidebar.ts`

**Purpose:** Manage sidebar open/close state untuk left & right sidebars

**Features:**
- ✅ Track sidebar state (open/close) untuk left & right
- ✅ Detect mobile/desktop mode
- ✅ Provide toggle, open, close functions
- ✅ Responsive to window resize

**API:**

```typescript
const {
  sidebarState,           // { left: boolean, right: boolean }
  isMobile,               // boolean - is screen < 1024px?
  toggleSidebar,          // (position: 'left' | 'right') => void
  openSidebar,            // (position: 'left' | 'right') => void
  closeSidebar,           // (position: 'left' | 'right') => void
  closeAllSidebars,       // () => void
  isSidebarOpen,          // (position: 'left' | 'right') => boolean
} = useSidebar();
```

**Example Usage:**

```typescript
import { useSidebar } from '@/hooks/useSidebar';

function MyComponent() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  
  return (
    <button onClick={() => toggleSidebar('left')}>
      {isSidebarOpen('left') ? 'Close' : 'Open'} Sidebar
    </button>
  );
}
```

---

### 2. `CollapsibleSidebar.tsx` - Main Sidebar Component

**Location:** `src/components/CollapsibleSidebar.tsx`

**Purpose:** Render collapsible sidebar dengan smooth animations

**Props:**

```typescript
type CollapsibleSidebarProps = {
  area: AreaType;              // Area untuk render widgets
  position: 'left' | 'right';  // Position sidebar
  isOpen: boolean;             // Is sidebar open?
  onClose: () => void;         // Close callback
  isMobile: boolean;           // Is mobile view?
  fallback?: React.ReactNode;  // Fallback jika area kosong
}
```

**Behavior:**

**Mobile Mode (< 1024px):**
- Sidebar sebagai **overlay** (fixed position)
- Slide in dari left/right
- **Backdrop** (dark overlay) untuk click-to-close
- **Body scroll disabled** saat sidebar open
- Press **ESC** to close

**Desktop Mode (≥ 1024px):**
- Sidebar **inline** dengan konten
- Smooth width transition (collapse/expand)
- No backdrop
- Content reflows saat sidebar toggle

**Features:**
- ✅ Smooth CSS transitions
- ✅ Accessible (keyboard support - ESC to close)
- ✅ Click backdrop to close (mobile)
- ✅ Prevent body scroll (mobile)
- ✅ Sticky close button

**Example:**

```tsx
<CollapsibleSidebar
  area={AREAS.SIDEBAR_LEFT}
  position="left"
  isOpen={isOpen}
  onClose={handleClose}
  isMobile={isMobile}
  fallback={<p>No widgets</p>}
/>
```

---

### 3. `SidebarToggleButton.tsx` - Burger Menu Button

**Location:** `src/components/SidebarToggleButton.tsx`

**Purpose:** Burger icon button untuk toggle sidebar

**Props:**

```typescript
type SidebarToggleButtonProps = {
  onClick: () => void;         // Click handler
  position: 'left' | 'right';  // Button position context
  className?: string;          // Additional classes
  ariaLabel?: string;          // Accessibility label
}
```

**Features:**
- ✅ Hamburger icon (☰)
- ✅ Hover effects
- ✅ Focus ring (accessibility)
- ✅ Active state highlight (when sidebar open)
- ✅ Responsive sizing

**Example:**

```tsx
<SidebarToggleButton
  onClick={() => toggleSidebar('left')}
  position="left"
  ariaLabel="Toggle left sidebar"
  className={isOpen ? 'bg-blue-50 text-blue-600' : ''}
/>
```

---

### 4. `MainLayout.tsx` - Layout Integration

**Location:** `src/themes/default/layouts/MainLayout.tsx`

**Changes:**
- Added `'use client'` directive (for hooks)
- Import `useSidebar` hook
- Pass sidebar controls to `Header`
- Replace static `<aside>` with `<CollapsibleSidebar>`

**Key Code:**

```tsx
export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarState, isMobile, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div>
      <Header
        onToggleLeftSidebar={() => toggleSidebar('left')}
        onToggleRightSidebar={() => toggleSidebar('right')}
        leftSidebarOpen={sidebarState.left}
        rightSidebarOpen={sidebarState.right}
      />
      
      <main>
        <CollapsibleSidebar
          area={AREAS.SIDEBAR_LEFT}
          position="left"
          isOpen={sidebarState.left}
          onClose={() => closeSidebar('left')}
          isMobile={isMobile}
        />
        
        {children}
        
        <CollapsibleSidebar
          area={AREAS.SIDEBAR_RIGHT}
          position="right"
          isOpen={sidebarState.right}
          onClose={() => closeSidebar('right')}
          isMobile={isMobile}
        />
      </main>
    </div>
  );
}
```

---

### 5. `Header.tsx` - Burger Buttons in Header

**Location:** `src/themes/default/partials/Header.tsx`

**Changes:**
- Accept sidebar control props
- Render `SidebarToggleButton` components
- Highlight button when sidebar is open

**Props Added:**

```typescript
type HeaderProps = {
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
}
```

**Key Code:**

```tsx
<header>
  {/* Left burger button */}
  {onToggleLeftSidebar && (
    <SidebarToggleButton
      onClick={onToggleLeftSidebar}
      position="left"
      className={leftSidebarOpen ? 'bg-blue-50 text-blue-600' : ''}
    />
  )}
  
  {/* Logo & Nav */}
  
  {/* Right burger button */}
  {onToggleRightSidebar && (
    <SidebarToggleButton
      onClick={onToggleRightSidebar}
      position="right"
      className={rightSidebarOpen ? 'bg-blue-50 text-blue-600' : ''}
    />
  )}
</header>
```

---

## 🎨 Visual Behavior

### Desktop (≥ 1024px)

```
┌───────────────────────────────────────────┐
│ [☰] Logo    Nav Items    Theme [☰]        │  ← Header
├───────────────────────────────────────────┤
│         │                      │           │
│ Sidebar │   Main Content       │  Sidebar  │
│  Left   │                      │   Right   │
│         │                      │           │
│ [Stats] │   Your page          │  [Posts]  │
│ [Actions│   content here       │           │
│         │                      │           │
└─────────┴──────────────────────┴───────────┘

Click [☰] left  → Left sidebar collapses (width: 0)
Click [☰] right → Right sidebar collapses (width: 0)
```

### Mobile (< 1024px)

```
Default State:
┌───────────────────────────────┐
│ [☰] Logo  Theme [☰]           │  ← Header
├───────────────────────────────┤
│                               │
│     Main Content              │
│     (Full Width)              │
│                               │
└───────────────────────────────┘

After Click [☰] left:
┌───────────────────────────────┐
│ [☰] Logo  Theme [☰]           │
├──────┬────────────────────────┤
│[X]   │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │ ← Dark backdrop
│Stats │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│Actions▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│      │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└──────┴────────────────────────┘
  ↑
Sidebar slides in from left (w-80)
Click backdrop or [X] to close
```

---

## 🧪 Testing Guide

### Test on http://localhost:3000/demo-home

#### Desktop Testing (≥ 1024px)

1. **Open page** - Sidebars should be closed by default
2. **Click left burger (☰)** - Left sidebar expands smoothly
3. **Check widgets** - User Stats & Quick Actions widgets appear
4. **Click left burger again** - Left sidebar collapses
5. **Click right burger (☰)** - Right sidebar expands
6. **Check widgets** - Recent Posts widget appears
7. **Click right burger again** - Right sidebar collapses
8. **Toggle both** - Both sidebars can be open simultaneously

**Expected Behavior:**
- ✅ Smooth width transition (300ms)
- ✅ Content reflows properly
- ✅ Burger buttons highlight when sidebar open
- ✅ No layout shift or jump

#### Mobile Testing (< 1024px)

1. **Resize browser** to < 1024px or use DevTools mobile view
2. **Click left burger** - Sidebar slides in from left as overlay
3. **Check backdrop** - Dark backdrop appears behind sidebar
4. **Click backdrop** - Sidebar closes
5. **Click left burger again** - Sidebar opens
6. **Press ESC key** - Sidebar closes
7. **Click [X] button** - Sidebar closes
8. **Test right sidebar** - Same behavior from right side

**Expected Behavior:**
- ✅ Sidebar slides in smoothly (transform transition)
- ✅ Backdrop appears with opacity transition
- ✅ Body scroll disabled when sidebar open
- ✅ Close via backdrop click, ESC key, or [X] button
- ✅ No content shift (overlay mode)

#### Edge Cases

1. **Rapid toggling** - Should handle fast clicks gracefully
2. **Window resize** - Should adapt from desktop to mobile mode
3. **No widgets** - Should show fallback message
4. **Multiple toggle** - Left & right independently (desktop)

---

## 🔗 Integration with Templating Concepts

### 1. Layout & Partial System

**Collapsible Sidebar adalah Partial Component:**

```
MainLayout (Layout)
├── Header (Partial)
│   └── SidebarToggleButton (Sub-component)
├── CollapsibleSidebar (Partial - Left)
├── {children} (Content)
├── CollapsibleSidebar (Partial - Right)
└── Footer (Partial)
```

**Reusability:**
- `CollapsibleSidebar` dapat digunakan di berbagai layouts
- Configurable via props (area, position, fallback)
- Tidak tied to specific content

### 2. Area/Region System

**Sidebar menggunakan AreaRenderer:**

```tsx
<CollapsibleSidebar area={AREAS.SIDEBAR_LEFT}>
  {/* Internally uses: */}
  <AreaRenderer area={AREAS.SIDEBAR_LEFT} />
</CollapsibleSidebar>
```

**Dynamic Content:**
- Widgets di-register ke areas via `AreaManager`
- Plugins automatically appear in sidebar
- Enable/disable via Plugin Manager
- Priority-based ordering

### 3. State Management

**React Hooks Pattern:**
- `useSidebar` - Custom hook for sidebar state
- Clean separation of concerns
- Reusable logic across components
- No prop drilling

### 4. Responsive Design

**Adaptive Layout:**
- Mobile: Overlay sidebar (fixed position)
- Desktop: Inline sidebar (layout flow)
- Breakpoint: 1024px (lg in Tailwind)
- CSS transitions for smooth animations

---

## 📊 Benefits for Praktikum

### 1. **Demonstrates Advanced Templating**

✅ **Dynamic Partials** - Sidebar is conditional partial
✅ **Component Composition** - Multiple components working together
✅ **State-driven Rendering** - UI responds to state changes
✅ **Reusable Patterns** - Can be applied to other layouts

### 2. **Shows Modern Web Practices**

✅ **Responsive Design** - Adaptive for all screen sizes
✅ **Accessibility** - Keyboard support, ARIA labels
✅ **Performance** - CSS transitions, no janky animations
✅ **UX Best Practices** - Backdrop, ESC key, visual feedback

### 3. **Interactive Demo**

✅ **Visual Impact** - Burger menu is recognizable pattern
✅ **User Control** - User can toggle to see effect
✅ **Clear Functionality** - Obvious what each button does
✅ **Professional Look** - Modern, polished UI

### 4. **Code Quality**

✅ **Type Safety** - Full TypeScript types
✅ **Clean Code** - Well-organized, documented
✅ **Separation of Concerns** - Hook, component, layout separate
✅ **Maintainable** - Easy to understand and modify

---

## 🎓 Explanation for Presentation

### For Dosen/Reviewer:

> **"Collapsible Sidebar mendemonstrasikan konsep Layout & Partial dalam templating:**
> 
> 1. **Sidebar adalah Partial Component** yang dapat digunakan ulang di berbagai layout
> 2. **Integration dengan Area System** - Sidebar render widgets dari Area Manager
> 3. **State Management** menggunakan custom React hook (useSidebar)
> 4. **Responsive Behavior** - Adaptif untuk mobile (overlay) dan desktop (inline)
> 5. **User Interaction** - Burger menu memberikan control kepada user
> 
> Ini menunjukkan bahwa templating bukan hanya tentang static layouts, tapi juga **dynamic, interactive partials** yang respond to user actions."

### Key Points:

1. ✅ **Part of Templating System** - Bukan feature terpisah
2. ✅ **Reusable Partial** - Dapat dipakai di MainLayout, DashboardLayout, dll
3. ✅ **Integrated with Areas** - Menggunakan AreaRenderer untuk dynamic content
4. ✅ **Modern UX Pattern** - Sesuai dengan aplikasi web modern
5. ✅ **Production-Ready** - Code quality tinggi, fully functional

---

## 📝 Summary

### Files Created:
- ✅ `src/hooks/useSidebar.ts` (67 lines)
- ✅ `src/components/CollapsibleSidebar.tsx` (122 lines)
- ✅ `src/components/SidebarToggleButton.tsx` (75 lines)

### Files Modified:
- ✅ `src/themes/default/layouts/MainLayout.tsx` (Updated to use collapsible)
- ✅ `src/themes/default/partials/Header.tsx` (Added burger buttons)
- ✅ `src/app/[locale]/(unauth)/demo-home/page.tsx` (Added demo info)

### Total Lines Added: ~350+ lines

### Features Delivered:
1. ✅ Collapsible sidebar with smooth animations
2. ✅ Burger menu buttons in header
3. ✅ Responsive behavior (mobile overlay, desktop inline)
4. ✅ Keyboard support (ESC to close)
5. ✅ Visual feedback (button highlight, backdrop)
6. ✅ Integration with Area/Region system
7. ✅ Fully typed with TypeScript
8. ✅ Zero linter errors
9. ✅ Production-ready code quality

---

## 🚀 Quick Start

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000/demo-home
   ```

3. **Test sidebar:**
   - Click burger icons (☰) in header
   - Try on desktop and mobile views
   - Toggle left and right sidebars
   - Check responsive behavior

4. **Expected result:**
   - ✅ Sidebars toggle smoothly
   - ✅ Widgets appear in sidebars
   - ✅ Responsive on all screen sizes
   - ✅ No errors in console

---

**Praktikum Week 8 - Collapsible Sidebar Implementation**  
Part of Layout & Partial System  
© 2024

