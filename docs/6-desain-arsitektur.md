# BAB VI - DESAIN ARSITEKTUR DAN TAMPILAN

## 6.1 Desain Arsitektur Sistem

### 6.1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BRODO CMS ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    Client    │
│   Browser    │
└──────┬───────┘
       │
       │ HTTPS
       │
┌──────▼────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 (App Router)                   │  │
│  │  ┌──────────────────┐  ┌──────────────────┐           │  │
│  │  │  Public Pages    │  │   CMS Pages      │           │  │
│  │  │  - Homepage      │  │  - Dashboard     │           │  │
│  │  │  - About         │  │  - Hero Mgmt     │           │  │
│  │  │  - Collections   │  │  - Collections   │           │  │
│  │  │  - Stores        │  │  - Settings      │           │  │
│  │  │  - Contact       │  │  - etc.          │           │  │
│  │  └──────────────────┘  └──────────────────┘           │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │           Shared Components                      │ │  │
│  │  │  - Navbar, Footer, SafeImage, etc.              │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ Client-Side API Calls (Axios)
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      APPLICATION LAYER                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                        │  │
│  │  ┌──────────────────┐  ┌──────────────────┐           │  │
│  │  │ Public APIs      │  │  Protected APIs  │           │  │
│  │  │  - Collections   │  │  - CRUD Ops      │           │  │
│  │  │  - Stores        │  │  - Auth Required │           │  │
│  │  │  - Contact       │  │  - Role Check    │           │  │
│  │  └──────────────────┘  └──────────────────┘           │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │         Middleware & Auth Layer                  │ │  │
│  │  │  - JWT Verification                              │ │  │
│  │  │  - Route Protection                              │ │  │
│  │  │  - Role-Based Access Control                     │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ Drizzle ORM Queries
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                       DATA ACCESS LAYER                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Drizzle ORM                          │  │
│  │  - Type-safe queries                                   │  │
│  │  - Schema definitions                                  │  │
│  │  - Migration management                                │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │ SQL Queries (SSL/TLS)
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                      DATABASE LAYER                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          PostgreSQL (Neon - Serverless)                │  │
│  │  14 Tables:                                            │  │
│  │  - cms_users, hero_sections, collections              │  │
│  │  - stores, testimonials, about_section                │  │
│  │  - company_values, founders, images                   │  │
│  │  - contact_messages, company_info                     │  │
│  │  - social_media, seo_settings, etc.                   │  │
│  └────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

### 6.1.2 Application Architecture Pattern

**Architecture:** **Monolithic Full-Stack with Layered Architecture**

#### **Layer Breakdown:**

**1. Presentation Layer (Frontend)**
- Next.js React Components
- Server Components & Client Components
- Server-Side Rendering (SSR)
- Static Site Generation (SSG) where applicable
- Client-side routing

**2. Application Layer (Backend)**
- Next.js API Routes
- Business logic
- Authentication & authorization
- Input validation
- Error handling

**3. Data Access Layer**
- Drizzle ORM
- Database queries
- Data transformations
- Type-safe operations

**4. Database Layer**
- PostgreSQL (Neon)
- Relational data storage
- ACID transactions
- Connection pooling

---

### 6.1.3 Authentication Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATION ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────┘

User Login Flow:
┌──────────┐
│  Client  │
│ (Browser)│
└────┬─────┘
     │
     │ 1. POST /api/auth/login
     │    { email, password }
     ▼
┌────────────────┐
│  Login API     │
│  Route Handler │
└────┬───────────┘
     │
     │ 2. Query database
     ▼
┌──────────────┐         ┌─────────────┐
│   Drizzle    │────────▶│ PostgreSQL  │
│     ORM      │◀────────│   (Neon)    │
└──────┬───────┘         └─────────────┘
       │
       │ 3. User found
       │
       ▼
┌──────────────────┐
│  bcrypt.compare  │
│  Verify password │
└──────┬───────────┘
       │
       │ 4. Password valid
       │
       ▼
┌──────────────────┐
│  Generate JWT    │
│  Token (jose)    │
│  Payload:        │
│  - userId        │
│  - email         │
│  - role          │
│  - exp: 10min    │
└──────┬───────────┘
       │
       │ 5. Set HttpOnly Cookie
       │    auth_token = JWT
       │
       ▼
┌────────────────┐
│  Return 200    │
│  { success }   │
└────┬───────────┘
     │
     ▼
┌──────────┐
│  Client  │
│  Redirect│──▶ /cms/dashboard
│  to CMS  │
└──────────┘

Protected Route Access:
┌──────────┐
│  Client  │
│  Request │──▶ GET /cms/hero
└────┬─────┘
     │
     ▼
┌────────────────┐
│   Middleware   │
│   (Next.js)    │
└────┬───────────┘
     │
     │ 1. Extract cookie
     │    auth_token
     │
     ▼
┌────────────────┐
│  JWT Verify    │
│  (jose)        │
└────┬───────────┘
     │
     ├──▶ Valid? ────▶ Allow Access ──▶ Render Page
     │
     └──▶ Invalid? ──▶ Redirect ──▶ /cms/login
```

---

### 6.1.4 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────┘

Public Page Rendering (SSR):
┌──────────┐
│   User   │
│ Requests │──▶ GET /collections
│   Page   │
└────┬─────┘
     │
     ▼
┌────────────────────────────────────┐
│  Next.js Server Component          │
│  (collections/page.tsx)            │
│                                    │
│  export default async function() { │
│    const collections = await       │
│      getCollections();             │
│    return <CollectionsPage />      │
│  }                                 │
└────┬───────────────────────────────┘
     │
     │ Database Query
     ▼
┌────────────────┐         ┌─────────────┐
│   Drizzle ORM  │────────▶│ PostgreSQL  │
│   db.select()  │◀────────│   (Neon)    │
└────┬───────────┘         └─────────────┘
     │
     │ Data returned
     │
     ▼
┌────────────────────────────┐
│  React Component           │
│  Renders with data         │
│  - Collections mapped      │
│  - Images optimized        │
│  - SEO meta tags           │
└────┬───────────────────────┘
     │
     │ HTML Response
     │
     ▼
┌──────────┐
│  Browser │
│  Renders │
│   Page   │
└──────────┘

CMS CRUD Operation (Client-Side):
┌──────────┐
│  Admin   │
│  Creates │──▶ Fill Form (React Hook Form)
│  Hero    │
└────┬─────┘
     │
     │ Submit
     ▼
┌────────────────────────────┐
│  Client-Side Validation    │
│  (Zod Schema)              │
└────┬───────────────────────┘
     │
     │ POST /api/hero-sections
     │ { imageUrl, title, ... }
     │
     ▼
┌────────────────────────────┐
│  API Route Handler         │
│  (/api/hero-sections)      │
└────┬───────────────────────┘
     │
     │ 1. Verify JWT
     │
     ▼
┌────────────────┐
│  requireAuth() │
└────┬───────────┘
     │
     │ 2. Validate Data
     │
     ▼
┌────────────────────┐
│  Zod Validation    │
│  heroSchema.parse()│
└────┬───────────────┘
     │
     │ 3. Insert to DB
     │
     ▼
┌────────────────┐         ┌─────────────┐
│  Drizzle ORM   │────────▶│ PostgreSQL  │
│  db.insert()   │◀────────│   (Neon)    │
└────┬───────────┘         └─────────────┘
     │
     │ 4. Return created record
     │
     ▼
┌────────────────────┐
│  API Response      │
│  201 Created       │
│  { id, ... }       │
└────┬───────────────┘
     │
     │ 5. Client handles response
     │
     ▼
┌────────────────────┐
│  Success Toast     │
│  Refresh data      │
│  Close modal       │
└────────────────────┘
```

---

## 6.2 Struktur Folder & Modularitas

### 6.2.1 Project Structure

```
Mission-2.1/
│
├── src/                              # Source code
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── hero-sections/
│   │   │   │   ├── route.ts          # GET, POST
│   │   │   │   └── [id]/route.ts     # PATCH, DELETE
│   │   │   ├── collections/
│   │   │   ├── stores/
│   │   │   ├── testimonials/
│   │   │   ├── founders/
│   │   │   ├── company-values/
│   │   │   ├── about/
│   │   │   ├── contact-messages/
│   │   │   ├── images/
│   │   │   ├── company-info/
│   │   │   ├── social-media/
│   │   │   ├── seo-settings/
│   │   │   └── users/
│   │   │
│   │   ├── cms/                      # CMS Pages
│   │   │   ├── layout.tsx            # CMS layout
│   │   │   ├── page.tsx              # Redirect to dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── hero/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   ├── values/
│   │   │   ├── founders/
│   │   │   ├── collections/
│   │   │   ├── stores/
│   │   │   ├── testimonials/
│   │   │   ├── messages/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   │
│   │   ├── about/                    # Public pages
│   │   │   └── page.tsx
│   │   ├── collections/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── stores/
│   │   │   └── page.tsx
│   │   ├── instagram/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── components/                   # React Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── SafeImage.tsx
│   │   ├── ScrollAnimation.tsx
│   │   ├── PageTransition.tsx
│   │   └── cms/                      # CMS-specific components
│   │       ├── CMSSidebar.tsx
│   │       ├── DataTable.tsx
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       └── FormInput.tsx
│   │
│   ├── db/                           # Database
│   │   ├── index.ts                  # DB connection
│   │   └── schema/                   # Table schemas
│   │       ├── index.ts              # Export all schemas
│   │       ├── cms-users.ts
│   │       ├── hero-sections.ts
│   │       ├── about-section.ts
│   │       ├── company-values.ts
│   │       ├── founders.ts
│   │       ├── collections.ts
│   │       ├── images.ts
│   │       ├── collection-images.ts
│   │       ├── stores.ts
│   │       ├── testimonials.ts
│   │       ├── contact-messages.ts
│   │       ├── company-info.ts
│   │       ├── social-media.ts
│   │       └── seo-settings.ts
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── auth.ts                   # Auth helpers
│   │   ├── collection-urls.ts        # URL generators
│   │   └── utils.ts                  # General utilities
│   │
│   └── middleware.ts                 # Route protection
│
├── public/                           # Static files
│   ├── logo.png
│   └── assets/                       # Images
│       ├── brodo-logo-horizontal.png
│       ├── sneakers.webp
│       ├── essentials.webp
│       └── ...
│
├── scripts/                          # Utility scripts
│   ├── seed-new.ts                   # Database seeding
│   ├── normalize-display-orders.ts   # Display order fix
│   └── pre-deploy-check.ts
│
├── drizzle/                          # Drizzle migrations
│   ├── 0000_shocking_leader.sql
│   ├── 0001_funny_silk_fever.sql
│   └── meta/
│
├── .env.local                        # Local environment
├── .env.production                   # Production environment
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind config
├── next.config.mjs                   # Next.js config
├── drizzle.config.ts                 # Drizzle config
├── Dockerfile                        # Docker config
├── docker-compose.yml                # Docker Compose
└── README.md                         # Documentation
```

---

### 6.2.2 Modular Design Principles

#### **1. Separation of Concerns**

**Database Layer (src/db/):**
- Pure data schema definitions
- No business logic
- Type-safe with Drizzle
- Reusable across app

**API Layer (src/app/api/):**
- RESTful endpoint design
- One responsibility per route
- Validation at entry point
- Error handling centralized

**Component Layer (src/components/):**
- Reusable UI components
- Props-driven
- Presentational vs Container
- Shared across pages

#### **2. DRY (Don't Repeat Yourself)**

**Reusable Components:**
```typescript
// DataTable.tsx - Used in multiple CMS pages
export default function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}) {
  // Reusable table logic
}

// Used in:
// - /cms/hero
// - /cms/collections
// - /cms/stores
// - /cms/testimonials
```

**Shared Utilities:**
```typescript
// lib/auth.ts - Auth functions used everywhere
export async function requireAuth() {
  // JWT verification
}

// Used in all protected API routes
```

#### **3. Single Responsibility Principle**

Each file has one clear purpose:
- `hero-sections/route.ts` - Only handles hero CRUD
- `CMSSidebar.tsx` - Only renders sidebar navigation
- `auth.ts` - Only authentication utilities

#### **4. Type Safety Throughout**

```typescript
// Schema defines types
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  // ...
});

// Auto-generated types
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

// Used in API
async function getCollections(): Promise<Collection[]> {
  return await db.select().from(collections);
}

// Used in components
interface Props {
  collections: Collection[];
}
```

---

## 6.3 Desain Tampilan CMS

### 6.3.1 CMS Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CMS LAYOUT                           │
└─────────────────────────────────────────────────────────────┘

Desktop Layout (> 1024px):
┌────────────────────────────────────────────────────────────┐
│  CMS Header (Fixed Top)                                    │
│  ┌─────────┐                                    ┌────────┐ │
│  │  Logo   │     BRODO CMS                      │ Logout │ │
│  └─────────┘                                    └────────┘ │
├────────────────────────────────────────────────────────────┤
│         │                                                  │
│  Side-  │              Main Content Area                  │
│  bar    │  ┌──────────────────────────────────────────┐  │
│         │  │  Page Title                              │  │
│  📊 Dash│  ├──────────────────────────────────────────┤  │
│  🎯 Hero│  │                                          │  │
│  📖 About│  │  Content (Table, Form, Cards, etc.)     │  │
│  ⭐ Values│  │                                          │  │
│  👥 Team│  │                                          │  │
│  👟 Coll│  │                                          │  │
│  🏪 Store│  │                                          │  │
│  💬 Test│  └──────────────────────────────────────────┘  │
│  ✉️ Msgs│                                                  │
│  ⚙️ Set │                                                  │
│  👤 Users│                                                  │
│         │                                                  │
│  [Logout]│                                                  │
│         │                                                  │
└─────────┴──────────────────────────────────────────────────┘
  250px      Flexible (calc(100% - 250px))

Mobile Layout (< 1024px):
┌────────────────────────────────────────────────────────────┐
│  ☰  BRODO CMS                                   [Logout]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                 Main Content Area                          │
│  ┌──────────────────────────────────────────┐             │
│  │  Page Title                              │             │
│  ├──────────────────────────────────────────┤             │
│  │                                          │             │
│  │  Content (optimized for mobile)         │             │
│  │                                          │             │
│  │  - Responsive tables                    │             │
│  │  - Touch-friendly buttons               │             │
│  │  - Stacked cards                        │             │
│  │                                          │             │
│  └──────────────────────────────────────────┘             │
│                                                            │
└────────────────────────────────────────────────────────────┘

Mobile Menu (when hamburger clicked):
┌────────────────────────────────┐
│  BRODO CMS            [×]      │
├────────────────────────────────┤
│  📊 Dashboard                  │
│  🎯 Hero Sections              │
│  📖 About Us                   │
│  ⭐ Company Values             │
│  👥 Team Members               │
│  👟 Collections                │
│  🏪 Stores                     │
│  💬 Testimonials               │
│  ✉️ Messages                   │
│  ⚙️ Settings                   │
│  👤 Users                      │
├────────────────────────────────┤
│  [Logout]                      │
└────────────────────────────────┘
```

---

### 6.3.2 CMS Page Designs

#### **Dashboard Design**

```
┌────────────────────────────────────────────────────────────┐
│  Dashboard                                                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Statistics Cards (Grid 2x2)                              │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  📊 Hero        │  │  👟 Collections │                │
│  │  3 sections     │  │  4 collections  │                │
│  └─────────────────┘  └─────────────────┘                │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  🏪 Stores      │  │  💬 Testimonials│                │
│  │  5 locations    │  │  3 reviews      │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                            │
│  Quick Actions                                            │
│  ┌───────────────────────────────────────────┐            │
│  │  + Add Hero  │  + Add Collection          │            │
│  │  + Add Store │  + Add Testimonial         │            │
│  └───────────────────────────────────────────┘            │
│                                                            │
│  Recent Messages (if any)                                 │
│  ┌───────────────────────────────────────────┐            │
│  │  ✉️ New message from John Doe             │            │
│  │  📧 Contact form: Product Inquiry         │            │
│  └───────────────────────────────────────────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### **List/Table Page Design (e.g., Collections)**

```
┌────────────────────────────────────────────────────────────┐
│  Collections                          [+ Add Collection]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Data Table                                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Img │ Name      │ Category  │ Order │ Active │ Action││
│  ├─────┼───────────┼───────────┼───────┼────────┼───────┤│
│  │ 🖼️  │ Sneakers  │ Footwear  │   1   │  ✅   │ ✏️ 🗑️ ││
│  │ 🖼️  │ Essentials│ Footwear  │   2   │  ✅   │ ✏️ 🗑️ ││
│  │ 🖼️  │ Sandals   │ Footwear  │   3   │  ✅   │ ✏️ 🗑️ ││
│  │ 🖼️  │ Accessory │ Other     │   4   │  ❌   │ ✏️ 🗑️ ││
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Pagination (if many items)                               │
│  [Prev] Page 1 of 2 [Next]                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### **Form Page Design (Create/Edit)**

```
┌────────────────────────────────────────────────────────────┐
│  ← Back to Collections                                     │
│  Add New Collection                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Form Fields (2-column on desktop, 1-column on mobile)    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Collection Name *                                   │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Sneakers                                       │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Category *                                          │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ [Select Category ▼]                            │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Short Description                                   │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Brief description for cards...                 │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Full Description *                                  │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Detailed description...                        │  │ │
│  │  │                                                │  │ │
│  │  │                                                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Featured Image URL *                                │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ https://example.com/image.webp                 │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                      │ │
│  │  Display Order         Active                        │ │
│  │  ┌────────┐            ┌──────┐                      │ │
│  │  │   1    │            │ [x]  │                      │ │
│  │  └────────┘            └──────┘                      │ │
│  │                                                      │ │
│  │  [Cancel]                        [Save Collection]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### 6.3.3 CMS Color Scheme & Typography

**Color Palette:**
```css
/* Primary Colors */
--primary: #1a1a1a;        /* Dark charcoal */
--primary-hover: #2d2d2d;  /* Slightly lighter */

--secondary: #f5f5f5;      /* Light gray background */
--accent: #3b82f6;         /* Blue for actions */

/* Status Colors */
--success: #10b981;        /* Green */
--error: #ef4444;          /* Red */
--warning: #f59e0b;        /* Orange */
--info: #3b82f6;           /* Blue */

/* Neutral Colors */
--text-primary: #1f2937;   /* Dark gray text */
--text-secondary: #6b7280; /* Medium gray text */
--border: #e5e7eb;         /* Light gray border */
--background: #ffffff;     /* White */
```

**Typography:**
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Headings */
h1: text-3xl, font-bold
h2: text-2xl, font-semibold
h3: text-xl, font-semibold
```

---

## 6.4 Desain Tampilan Company Profile

### 6.4.1 Public Website Layout

```
┌────────────────────────────────────────────────────────────┐
│                    PUBLIC WEBSITE LAYOUT                   │
└────────────────────────────────────────────────────────────┘

Homepage Layout:
┌────────────────────────────────────────────────────────────┐
│  Navbar (Sticky)                                           │
│  [Logo] Home | About | Collections | Stores | Contact     │
└────────────────────────────────────────────────────────────┘
│                                                            │
│  Hero Carousel (Full-width, 600px height)                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │        🖼️ Hero Image                                 │ │
│  │                                                      │ │
│  │        DISCOVER AUTHENTIC                            │ │
│  │        INDONESIAN FOOTWEAR                           │ │
│  │                                                      │ │
│  │        [View Collections →]                          │ │
│  │                                                      │ │
│  │        ● ○ ○  (Indicators)                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  About Preview Section (Padding Y: 80px)                  │
│  ┌───────────────────┬────────────────────────────────┐  │
│  │                   │                                │  │
│  │  TENTANG BRODO    │        🖼️                      │  │
│  │                   │      Image                     │  │
│  │  Description...   │                                │  │
│  │                   │                                │  │
│  │  [Baca Selengkap] │                                │  │
│  │                   │                                │  │
│  └───────────────────┴────────────────────────────────┘  │
│                                                            │
│  Featured Collections (3-column grid)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  🖼️       │  │  🖼️       │  │  🖼️       │              │
│  │ Sneakers │  │Essentials│  │ Sandals  │              │
│  │          │  │          │  │          │              │
│  │ [View →] │  │ [View →] │  │ [View →] │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                            │
│  Company Values (4-column grid)                           │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │ 🎯   │  │ 💎   │  │ 🌱   │  │ 🤝   │                │
│  │Value1│  │Value2│  │Value3│  │Value4│                │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│                                                            │
│  Customer Testimonials (Carousel)                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  "Amazing quality and comfort!"                      │ │
│  │  ⭐⭐⭐⭐⭐                                             │ │
│  │  - John Doe, Jakarta                                 │ │
│  │                                                      │ │
│  │  [← →]                                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Footer                                                   │
│  ┌───────────┬──────────────┬──────────────────┐         │
│  │ About     │ Quick Links  │ Contact Info     │         │
│  │ Brodo     │ - Home       │ 📍 Address       │         │
│  │ Logo      │ - About      │ 📞 Phone         │         │
│  │           │ - Collections│ 📧 Email         │         │
│  │           │ - Stores     │ 📱 Social Media  │         │
│  └───────────┴──────────────┴──────────────────┘         │
│  Copyright © 2024 Brodo                                   │
└────────────────────────────────────────────────────────────┘
```

---

### 6.4.2 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones, < 640px) */
@media (max-width: 639px) {
  - Single column layouts
  - Hamburger menu
  - Stacked cards
  - Full-width images
  - Touch-friendly buttons (min 44px)
}

/* Medium devices (tablets, 640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  - 2-column grids
  - Collapsible menu
  - Card grids 2x2
}

/* Large devices (desktops, ≥ 1024px) */
@media (min-width: 1024px) {
  - 3-4 column grids
  - Full navigation menu
  - Sidebar layouts
  - Hover effects
}

/* Extra large (≥ 1280px) */
@media (min-width: 1280px) {
  - Container max-width: 1280px
  - Larger font sizes
  - More whitespace
}
```

---

### 6.4.3 Component Design System

**Button Styles:**
```css
/* Primary Button */
.btn-primary {
  background: #1a1a1a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s;
}
.btn-primary:hover {
  background: #2d2d2d;
  transform: translateY(-2px);
}

/* Secondary Button */
.btn-secondary {
  background: #f5f5f5;
  color: #1a1a1a;
  border: 1px solid #e5e7eb;
}

/* Icon Button */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Card Styles:**
```css
.card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

**Animation System:**
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Usage */
.animate-on-scroll {
  animation: slideUp 0.6s ease-out;
}
```

---

## 6.5 Kesimpulan Desain

### 6.5.1 Design Principles Applied

1. ✅ **Consistency** - Unified color scheme, typography, spacing
2. ✅ **Simplicity** - Clean, minimal interface
3. ✅ **Responsiveness** - Mobile-first approach
4. ✅ **Accessibility** - ARIA labels, semantic HTML
5. ✅ **Performance** - Optimized images, lazy loading
6. ✅ **Usability** - Intuitive navigation, clear CTAs

### 6.5.2 Architecture Benefits

1. ✅ **Modularity** - Reusable components
2. ✅ **Maintainability** - Clear structure
3. ✅ **Scalability** - Easy to extend
4. ✅ **Type Safety** - TypeScript throughout
5. ✅ **Performance** - Optimized rendering
6. ✅ **Security** - Layered protection

---

**📌 Catatan:**
Desain arsitektur dan tampilan mengikuti **modern best practices** dengan fokus pada user experience, performance, dan maintainability.
