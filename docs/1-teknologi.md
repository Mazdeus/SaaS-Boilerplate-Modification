# BAB I - TEKNOLOGI YANG DIGUNAKAN

## 1.1 Deskripsi Umum Teknologi

### 1.1.1 Stack Teknologi Utama

Project **Brodo Company Profile & CMS** dibangun menggunakan stack teknologi modern yang mengikuti best practices dalam pengembangan web full-stack. Berikut adalah teknologi inti yang digunakan:

#### **Framework & Runtime**
- **Next.js 14.2.0** - Framework React full-stack dengan App Router
  - Menggunakan App Router (bukan Pages Router) untuk routing modern
  - Server-Side Rendering (SSR) dan Static Site Generation (SSG)
  - API Routes terintegrasi untuk backend
  - Automatic code splitting dan optimisasi performa

- **React 18.2.0** - Library UI untuk membangun antarmuka pengguna
  - Komponen berbasis hooks (useState, useEffect, dll)
  - Server Components dan Client Components
  - Reactive state management

- **TypeScript 5.4.5** - Superset JavaScript dengan type safety
  - Strict type checking untuk mengurangi bug
  - IntelliSense yang lebih baik
  - Interface dan type definitions untuk semua entitas

#### **Database & ORM**
- **PostgreSQL** - Relational database management system
  - Hosted di **Neon.tech** (serverless PostgreSQL)
  - Connection pooling untuk performa optimal
  - SSL/TLS encryption untuk keamanan data

- **Drizzle ORM 0.33.0** - TypeScript ORM modern
  - Type-safe database queries
  - Migration management dengan drizzle-kit
  - Automatic schema generation
  - Support untuk complex queries dan joins

#### **Styling & UI**
- **Tailwind CSS 3.4.3** - Utility-first CSS framework
  - Custom design system dengan warna brand Brodo
  - Responsive design dengan mobile-first approach
  - Dark mode support (jika diperlukan)
  - Custom components dengan @apply directives

- **PostCSS 8.4.38** - CSS preprocessor
  - Autoprefixer untuk cross-browser compatibility
  - CSS optimization dan minification

#### **Authentication & Security**
- **JWT (JSON Web Tokens)** via `jose` library
  - Token-based authentication
  - Stateless session management
  - Token expiration (10 menit untuk keamanan)

- **bcryptjs 2.4.3** - Password hashing
  - Salt rounds untuk enkripsi password
  - One-way hashing yang aman

#### **Form Handling & Validation**
- **React Hook Form 7.51.0** - Form state management
  - Uncontrolled components untuk performa
  - Built-in validation
  - Easy integration dengan Zod

- **Zod 3.23.0** - Schema validation
  - Runtime type checking
  - API request/response validation
  - Form data validation

#### **State Management**
- **Zustand 4.5.2** - Lightweight state management
  - Simple API tanpa boilerplate
  - React hooks integration
  - Persistent state (localStorage)

#### **HTTP Client**
- **Axios 1.6.8** - Promise-based HTTP client
  - Interceptors untuk request/response
  - Automatic JSON transformation
  - Error handling yang lebih baik

#### **UI Libraries**
- **React Hot Toast 2.4.1** - Notification system
  - Toast notifications untuk user feedback
  - Customizable styling
  - Promise-based notifications

#### **Date Handling**
- **date-fns 3.6.0** - Modern date utility library
  - Lightweight alternative untuk moment.js
  - Immutable & pure functions
  - Timezone support

### 1.1.2 Development Tools

- **ESLint** - Linting untuk code quality
- **TypeScript Compiler** - Type checking
- **Drizzle Kit** - Database migration tools
- **TSX** - TypeScript execute untuk scripts

### 1.1.3 Deployment & DevOps

- **Docker** - Containerization
  - Multi-stage build untuk optimisasi
  - Node 18 Alpine image (lightweight)
  - Non-root user untuk security

- **Docker Compose** - Container orchestration
  - Service management
  - Environment variables
  - Health checks

- **Nginx** - Reverse proxy (production)
  - SSL/TLS termination
  - Static file serving
  - Load balancing

---

## 1.2 Alasan Pemilihan Teknologi

### 1.2.1 Next.js 14 (App Router)

**Alasan Dipilih:**
1. **Full-Stack Framework** - Backend dan frontend dalam satu codebase
2. **Performance Optimal** - Automatic optimization, code splitting, image optimization
3. **SEO Friendly** - Server-side rendering untuk better SEO
4. **Developer Experience** - Hot reload, TypeScript support, file-based routing
5. **Production Ready** - Battle-tested oleh perusahaan besar (Vercel, Netflix, dll)
6. **App Router** - Arsitektur modern dengan Server Components

**Use Case dalam Project:**
- Rendering halaman public (homepage, about, collections, dll) dengan SSR
- API routes untuk CMS backend
- Static optimization untuk performa
- Image optimization otomatis

### 1.2.2 TypeScript

**Alasan Dipilih:**
1. **Type Safety** - Mengurangi runtime errors
2. **Better IDE Support** - Autocomplete dan IntelliSense
3. **Self-Documenting Code** - Interface sebagai dokumentasi
4. **Refactoring Aman** - Compiler menangkap breaking changes
5. **Team Collaboration** - Code lebih mudah dipahami

**Use Case dalam Project:**
- Type definitions untuk database schema
- API request/response types
- Component props validation
- State management types

### 1.2.3 PostgreSQL + Neon

**Alasan Dipilih:**
1. **Relational Database** - Cocok untuk struktur data CMS yang relasional
2. **ACID Compliance** - Data integrity terjamin
3. **Advanced Features** - JSON support, full-text search, transactions
4. **Neon Serverless** - Auto-scaling, branching, point-in-time recovery
5. **Cost Effective** - Pay-per-use model

**Use Case dalam Project:**
- Menyimpan data CMS (hero sections, collections, stores, dll)
- Relasi antar tabel (collections ↔ images)
- User authentication data
- Contact messages

### 1.2.4 Drizzle ORM

**Alasan Dipilih:**
1. **Type-Safe Queries** - Full TypeScript support
2. **Lightweight** - Minimal overhead dibanding Prisma
3. **SQL-Like Syntax** - Mudah dipelajari bagi yang familiar SQL
4. **Migration System** - Drizzle-kit untuk schema evolution
5. **Performance** - Query optimization yang baik

**Contoh Penggunaan:**
```typescript
// Type-safe query
const activeHero = await db
  .select()
  .from(heroSections)
  .where(eq(heroSections.isActive, true))
  .orderBy(heroSections.displayOrder);
```

### 1.2.5 Tailwind CSS

**Alasan Dipilih:**
1. **Rapid Development** - Utility classes untuk cepat styling
2. **Consistency** - Design system yang konsisten
3. **Responsive** - Mobile-first approach bawaan
4. **Small Bundle Size** - PurgeCSS menghapus unused styles
5. **Customizable** - Easy theming dan customization

**Use Case dalam Project:**
- Responsive design untuk semua screen sizes
- Custom color palette Brodo brand
- Reusable component styles
- Animation utilities

### 1.2.6 JWT Authentication

**Alasan Dipilih:**
1. **Stateless** - No server-side session storage
2. **Scalable** - Cocok untuk distributed systems
3. **Cross-Domain** - Support untuk multiple domains
4. **Industry Standard** - Widely adopted
5. **Flexible** - Custom claims untuk role-based access

**Security Implementation:**
- Token expires dalam 10 menit
- HttpOnly cookies untuk storage
- bcrypt untuk password hashing
- Middleware untuk route protection

---

## 1.3 Kelebihan dan Keterbatasan

### 1.3.1 Kelebihan Teknologi

#### **Next.js + React**
✅ **Kelebihan:**
- **Full-Stack Solution** - Backend dan frontend terintegrasi
- **SEO Optimization** - SSR untuk better search engine ranking
- **Performance** - Automatic optimization (code splitting, image optimization)
- **Developer Experience** - Fast Refresh, TypeScript support
- **Ecosystem Besar** - Banyak library dan resources
- **Production Ready** - Deploy mudah ke Vercel, Netlify, dll

⚠️ **Keterbatasan:**
- **Learning Curve** - App Router memerlukan waktu adaptasi
- **Build Time** - Large project bisa lambat saat build
- **Server Costs** - SSR memerlukan server (tidak bisa pure static)
- **Complexity** - Lebih kompleks dibanding SPA sederhana

#### **TypeScript**
✅ **Kelebihan:**
- **Type Safety** - Catch errors sebelum runtime
- **Better Tooling** - Autocomplete dan refactoring
- **Code Documentation** - Types sebagai dokumentasi
- **Maintainability** - Easier untuk maintain large codebase

⚠️ **Keterbatasan:**
- **Initial Setup** - Memerlukan konfigurasi tambahan
- **Learning Curve** - Developers perlu belajar type system
- **Build Time** - Type checking menambah waktu compile
- **Verbose** - Kadang memerlukan lebih banyak kode

#### **PostgreSQL + Neon**
✅ **Kelebihan:**
- **Reliability** - ACID compliance, data integrity
- **Feature Rich** - JSON, full-text search, triggers, procedures
- **Scalability** - Neon auto-scaling
- **Serverless** - Tidak perlu manage server
- **Branching** - Database branching untuk development

⚠️ **Keterbatasan:**
- **Cost** - Neon paid tier untuk production workloads
- **Complexity** - Relational model lebih kompleks
- **Migration** - Schema changes memerlukan careful planning
- **Vendor Lock-in** - Terikat dengan Neon infrastructure

#### **Drizzle ORM**
✅ **Kelebihan:**
- **Type Safety** - Full TypeScript integration
- **Performance** - Lightweight, minimal overhead
- **SQL Control** - Direct SQL access jika diperlukan
- **Migration Tools** - Drizzle-kit untuk schema management

⚠️ **Keterbatasan:**
- **Ecosystem** - Lebih kecil dibanding Prisma
- **Documentation** - Masih berkembang
- **Community** - Smaller community support
- **Features** - Beberapa features belum selengkap Prisma

#### **Tailwind CSS**
✅ **Kelebihan:**
- **Rapid Development** - Fast prototyping
- **Consistency** - Uniform design system
- **Performance** - Small bundle size dengan PurgeCSS
- **Responsive** - Mobile-first utilities
- **Customizable** - Easy theming

⚠️ **Keterbatasan:**
- **HTML Clutter** - Banyak class names di markup
- **Learning Curve** - Perlu hafal utility classes
- **Debugging** - Sulit debug inline styles
- **Team Preference** - Tidak semua developer suka utility-first

#### **JWT Authentication**
✅ **Kelebihan:**
- **Stateless** - Scalable untuk distributed systems
- **Cross-Domain** - Support multiple domains
- **Performance** - No database lookup untuk setiap request
- **Flexible** - Custom claims dan roles

⚠️ **Keterbatasan:**
- **Token Revocation** - Sulit revoke token sebelum expire
- **Token Size** - Payload size bisa besar
- **Security** - Vulnerable jika secret key leaked
- **Storage** - Perlu careful storage (HttpOnly cookies)

### 1.3.2 Trade-offs yang Diambil

#### **1. Next.js App Router vs Pages Router**
**Dipilih:** App Router
- ✅ Future-proof, modern architecture
- ✅ Better streaming dan suspense
- ⚠️ Breaking changes dari Pages Router
- ⚠️ Ecosystem belum sepenuhnya migrate

#### **2. Drizzle ORM vs Prisma**
**Dipilih:** Drizzle
- ✅ Lightweight, faster runtime
- ✅ More SQL-like, easier migration
- ⚠️ Smaller ecosystem
- ⚠️ Less features (no auto-migration)

#### **3. JWT vs Session-based Auth**
**Dipilih:** JWT
- ✅ Stateless, scalable
- ✅ Cross-domain support
- ⚠️ Token revocation challenges
- ⚠️ Security concerns dengan storage

#### **4. Tailwind CSS vs CSS Modules/Styled Components**
**Dipilih:** Tailwind
- ✅ Rapid development
- ✅ Consistency
- ⚠️ HTML clutter
- ⚠️ Learning curve

### 1.3.3 Kesimpulan

Stack teknologi yang dipilih merupakan **kombinasi optimal** untuk membangun CMS modern dengan prioritas:

1. ✅ **Performance** - Fast loading, optimal UX
2. ✅ **Developer Experience** - Produktif dan maintainable
3. ✅ **Type Safety** - Mengurangi bugs
4. ✅ **Scalability** - Ready untuk growth
5. ✅ **Security** - Industry-standard practices

Trade-offs yang diambil **seimbang** antara modern best practices dan practical needs untuk project Company Profile & CMS.

---

**📌 Catatan:**
Semua teknologi dipilih berdasarkan pertimbangan:
- Maturity dan stability
- Community support
- Documentation quality
- Performance requirements
- Team capability
- Budget constraints
