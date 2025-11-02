# Sistem Templating SaaS Boilerplate - Company Profile

## 📖 Deskripsi

Proyek ini mendemonstrasikan implementasi komprehensif sistem templating modern untuk aplikasi web SaaS, dengan fokus khusus pada halaman **Company Profile**. Sistem ini menggabungkan berbagai konsep templating advanced seperti Layout & Partial System, Area/Region System, Plugin Architecture, dan Theme Management.

## 🏗️ Arsitektur Sistem Templating

### 1. Layout & Partial System

#### **MainLayout** (`src/themes/default/layouts/MainLayout.tsx`)
Layout utama yang menyediakan struktur dasar halaman dengan fitur:
- **Header dinamis** dengan kontrol sidebar
- **Area rendering system** untuk konten yang dapat dikustomisasi
- **Collapsible sidebars** (kiri dan kanan)
- **Footer** yang konsisten di seluruh aplikasi

```tsx
// Struktur Layout
<div className="flex min-h-screen flex-col">
  <Header />                          // Partial Header
  <AreaRenderer area={HERO} />        // Area Hero dinamis
  
  <main className="flex flex-1">
    <CollapsibleSidebar position="left" />   // Sidebar kiri
    <div className="flex-1">
      {children}                      // Konten halaman
    </div>
    <CollapsibleSidebar position="right" />  // Sidebar kanan
  </main>
  
  <Footer />                          // Partial Footer
</div>
```

#### **Partial Components**

##### Header (`src/themes/default/partials/Header.tsx`)
Komponen header yang dapat digunakan kembali dengan fitur:
- **Logo dan branding** perusahaan ("Wengdev Company")
- **Navigation menu** responsif dengan link ke:
  - Home (`/`)
  - Company Profile (`/company-profile`)
  - Demo (`/demo-home`)
  - Themes (`/demo/theme-switcher`)
- **Sidebar toggle buttons** untuk kontrol sidebar kiri dan kanan
- **Theme switcher** untuk mengganti tema
- **Responsive design** dengan menu tersembunyi di mobile

##### Footer (`src/themes/default/partials/Footer.tsx`)
Komponen footer yang konsisten dengan:
- **4 kolom informasi** yang terorganisir:
  - **Product**: Features, Pricing, FAQ
  - **Company**: About, Blog, Careers
  - **Resources**: Documentation, Help Center, Community
  - **Legal**: Privacy, Terms
- **Copyright notice** dengan branding
- **Styling yang konsisten** dengan theme system

### 2. Area/Region System

Sistem area memungkinkan registrasi komponen dinamis ke lokasi tertentu di halaman:

#### **Available Areas** (`src/core/types.ts`)
```typescript
export const AREAS = {
  HEADER_EXTRA: 'header-extra',    // Area tambahan di header
  HERO: 'hero',                    // Area hero untuk banner/slideshow
  SIDEBAR_LEFT: 'sidebar-left',    // Sidebar kiri
  SIDEBAR_RIGHT: 'sidebar-right',  // Sidebar kanan
  CONTENT_BEFORE: 'content-before', // Sebelum konten utama
  CONTENT_AFTER: 'content-after',  // Setelah konten utama
  FOOTER_WIDGETS: 'footer-widgets' // Widget di atas footer
};
```

#### **Area Context** (`src/contexts/AreaContext.tsx`)
Mengelola registrasi dan rendering komponen di area tertentu:
- **registerComponent()**: Mendaftarkan komponen ke area
- **unregisterComponent()**: Menghapus komponen dari area
- **getAreaComponents()**: Mengambil komponen dari area tertentu

### 3. Plugin System

#### **Plugin Architecture**

Setiap plugin adalah komponen independen yang dapat didaftarkan ke area tertentu dengan prioritas:

```typescript
const companyPagePlugins = {
  'company-slideshow': {
    component: CompanySlideshowPlugin,
    area: AREAS.HERO,
    priority: 10,
  },
  'company-info-widget': {
    component: CompanyInfoWidget,
    area: AREAS.SIDEBAR_LEFT,
    priority: 5,
  },
  // ... plugin lainnya
};
```

#### **Plugin Components untuk Company Profile**

##### 1. **Company Slideshow Plugin** (`src/plugins/company-slideshow/CompanySlideshowPlugin.tsx`)
**Lokasi**: HERO Area
**Fungsi**: Slideshow dinamis dengan 4 slide yang menampilkan:
- **Slide 1**: "Welcome to SaaS Template" - Intro perusahaan
- **Slide 2**: "Innovation & Excellence" - Fokus pada transformasi digital
- **Slide 3**: "Trusted by 500+ Companies" - Social proof dan testimoni
- **Slide 4**: "Ready to Transform?" - Call-to-action untuk kontak

**Fitur**:
- Auto-play setiap 5 detik
- Navigation dots indicator
- Gradient backgrounds yang berbeda per slide
- CTA buttons yang mengarah ke section terkait

##### 2. **Company Info Widget** (`src/plugins/company-info/CompanyInfoWidget.tsx`)
**Lokasi**: SIDEBAR_LEFT
**Konten**:
- **Logo perusahaan** dengan initial "ST" (SaaS Template)
- **Informasi dasar**:
  - Location: Bandung, Indonesia
  - Team Size: 50+ Employees
  - Established: 2020
  - Industry: Technology
- **Contact info**:
  - Email: info@saastemplate.com
  - Phone: +62 812-3456-7890
  - Website: www.saastemplate.com
- **Social media links**: LinkedIn, Twitter, GitHub, Instagram

##### 3. **Company Values Widget** (`src/plugins/company-values/CompanyValuesWidget.tsx`)
**Lokasi**: SIDEBAR_LEFT
**Konten**: 4 nilai utama perusahaan:
- **Innovation** 🚀: Constantly pushing boundaries
- **Quality** ⭐: Delivering excellence in every project
- **Collaboration** 🤝: Working together towards success
- **Growth** 📈: Continuous learning and improvement

##### 4. **Company Team Widget** (`src/plugins/company-team/CompanyTeamWidget.tsx`)
**Lokasi**: SIDEBAR_RIGHT
**Konten**: Leadership team dengan:
- **John Doe** - CEO & Founder 👨‍💼
- **Jane Smith** - CTO 👩‍💻
- **Bob Johnson** - Lead Developer 👨‍💻
- **Alice Brown** - Product Manager 👩‍💼

Dilengkapi tombol "View Full Team" untuk ekspansi.

### 4. Reusable Components

#### **Company About** (`src/components/company/CompanyAbout.tsx`)
Section yang menampilkan:
- **Image grid** dengan foto tim dan workspace
- **"Who are we"** - Deskripsi perusahaan sebagai marketing dan creative team
- **"What we do"** - Fokus pada user experience dan research
- **Statistics**:
  - 500+ Clients
  - 50+ Team Members  
  - 100+ Projects
  - 4+ Years experience

#### **Company Services** (`src/components/company/CompanyServices.tsx`)
Section layanan dengan 4 kategori utama:

1. **Web Development** 💻
   - React & Next.js
   - TypeScript
   - Responsive Design
   - API Integration

2. **Mobile Apps** 📱
   - iOS & Android
   - React Native
   - Flutter
   - App Store Deployment

3. **Cloud Solutions** ☁️
   - AWS & Azure
   - DevOps
   - CI/CD
   - Auto-scaling

4. **Security** 🔒
   - SSL/TLS
   - Authentication
   - Data Encryption
   - Security Audits

### 5. Page-Based Plugin System

#### **usePagePlugins Hook** (`src/hooks/usePagePlugins.ts`)
Hook yang secara otomatis mendaftarkan plugin berdasarkan konfigurasi halaman:

```typescript
const companyPagePlugins = {
  'plugin-id': {
    component: PluginComponent,
    area: AREAS.SIDEBAR_LEFT,
    priority: 5,
  }
};

usePagePlugins(companyPagePlugins);
```

#### **Route Cleanup** (`src/hooks/useRouteCleanup.ts`)
Membersihkan area dari plugin sebelumnya saat navigasi untuk mencegah duplikasi.

## 🎨 Theme System

### **Theme Switcher** (`src/components/ThemeSwitcher.tsx`)
Memungkinkan pengguna beralih antar tema:
- **Default Theme**: Tema standar dengan warna biru
- **Dark Theme**: Tema gelap untuk pengalaman malam
- **Modern Theme**: Tema dengan desain lebih kontemporer

### **Theme Structure** (`src/themes/`)
```
themes/
├── default/
│   ├── layouts/
│   │   └── MainLayout.tsx
│   └── partials/
│       ├── Header.tsx
│       └── Footer.tsx
├── dark/
└── modern/
```

## 🔧 Implementation Details

### **Company Profile Page** (`src/app/[locale]/(unauth)/company-profile/page.tsx`)

Halaman company profile mendemonstrasikan semua konsep templating:

```typescript
export default function CompanyProfilePage() {
  // 1. Route cleanup untuk mencegah duplikasi
  useRouteCleanup({ 
    areas: [AREAS.HERO, AREAS.SIDEBAR_LEFT, AREAS.SIDEBAR_RIGHT] 
  });

  // 2. Registrasi plugin menggunakan page-based system
  usePagePlugins(companyPagePlugins);

  return (
    <MainLayout>
      {/* 3. Hero area dirender oleh slideshow plugin */}
      
      {/* 4. Reusable components */}
      <CompanyAbout />
      <CompanyServices />
      
      {/* 5. Static sections */}
      <TestimonialsSection />
      <ContactCTASection />
      
      {/* 6. Educational banner */}
      <TemplatingConceptsBanner />
    </MainLayout>
  );
}
```

### **Sidebar Management** (`src/hooks/useSidebar.ts`)
- **State management** untuk sidebar kiri dan kanan
- **Mobile detection** untuk responsive behavior
- **Toggle functionality** dengan kontrol terpisah

### **Mobile Responsiveness**
- Sidebar otomatis menjadi overlay di mobile
- Navigation menu collapse di header
- Grid responsif untuk semua komponen
- Touch-friendly interaction

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### **Mobile Adaptations**
- Sidebar menjadi overlay dengan backdrop
- Header navigation tersembunyi dengan hamburger menu
- Grid components menjadi single column
- Touch-optimized button sizes

## 🚀 Key Features

### **1. Modular Architecture**
- Komponen dapat digunakan kembali di halaman lain
- Plugin dapat didaftarkan ke area mana saja
- Theme dapat diganti tanpa mengubah logic

### **2. Dynamic Content**
- Area system memungkinkan konten dinamis
- Plugin dapat ditambah/dihapus tanpa mengubah layout
- Theme switching real-time

### **3. Performance Optimized**
- Client-side rendering untuk interaktivitas
- Lazy loading untuk komponen besar
- Efficient re-rendering dengan React hooks

### **4. Developer Friendly**
- TypeScript untuk type safety
- Consistent naming conventions
- Comprehensive documentation
- Easy plugin development

## 🎯 Educational Value

Proyek ini mendemonstrasikan konsep templating advanced yang penting dalam pengembangan web modern:

- **Separation of Concerns**: Layout, content, dan styling terpisah
- **Reusability**: Komponen dapat digunakan di multiple pages
- **Extensibility**: Plugin system memungkinkan easy customization
- **Maintainability**: Struktur yang jelas dan konsisten
- **Scalability**: Mudah menambah fitur baru tanpa mengubah existing code

## 📋 Conclusion

Sistem templating ini memberikan foundation yang solid untuk aplikasi SaaS dengan:
- **Flexibility** dalam customization
- **Consistency** dalam user experience  
- **Scalability** untuk pertumbuhan fitur
- **Maintainability** untuk long-term development

Perfect untuk praktikum templating yang mendemonstrasikan real-world application development dengan best practices modern.
