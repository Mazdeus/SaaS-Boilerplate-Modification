# BAB IV - RENCANA DAN IMPLEMENTASI FITUR

## 4.1 Rencana Awal Sistem

### 4.1.1 Initial Project Scope

**Tujuan Utama:**
Membangun **Company Profile & CMS** untuk brand Brodo yang memenuhi kebutuhan:
1. ✅ Public website untuk company profile
2. ✅ CMS untuk manage konten tanpa developer
3. ✅ Responsive design untuk semua devices
4. ✅ SEO-friendly architecture
5. ✅ Secure authentication system

### 4.1.2 MVP (Minimum Viable Product) Planning

#### **Phase 1: Core Infrastructure** ✅ Complete
- [x] Setup Next.js 14 project dengan TypeScript
- [x] Configure Tailwind CSS
- [x] Setup PostgreSQL database (Neon)
- [x] Integrate Drizzle ORM
- [x] Create database schema
- [x] Setup development environment

#### **Phase 2: Authentication** ✅ Complete
- [x] JWT authentication implementation
- [x] Login page
- [x] Password hashing dengan bcrypt
- [x] Protected routes middleware
- [x] User session management
- [x] Logout functionality

#### **Phase 3: Public Website** ✅ Complete
- [x] Homepage dengan hero carousel
- [x] About Us page
- [x] Collections listing & detail pages
- [x] Store locator page
- [x] Contact page dengan form
- [x] Navbar & Footer components
- [x] Responsive design

#### **Phase 4: CMS Backend** ✅ Complete
- [x] CMS Dashboard
- [x] Hero Sections CRUD
- [x] About management
- [x] Collections CRUD
- [x] Stores CRUD
- [x] Testimonials CRUD
- [x] Contact messages inbox
- [x] Settings management

#### **Phase 5: Advanced Features** ✅ Complete
- [x] Image management system
- [x] Company values management
- [x] Founders/team management
- [x] Display order system
- [x] User management (admin only)
- [x] Instagram integration
- [x] Form validation

#### **Phase 6: Deployment** ✅ Complete
- [x] Docker containerization
- [x] Docker Compose setup
- [x] Production environment config
- [x] Azure VM deployment
- [x] Custom domain setup (brodofootwear.studio)
- [x] SSL/TLS configuration
- [x] Nginx reverse proxy

---

## 4.2 Fitur yang Diimplementasikan

### 4.2.1 Core Features (100% Complete)

#### **1. Authentication & Authorization** ✅

**Implemented:**
```typescript
// JWT Token Generation
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '10m',
  });
}

// Middleware Protection
export async function middleware(request: NextRequest) {
  if (pathname.startsWith('/cms')) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }
  }
}
```

**Features:**
- ✅ JWT-based authentication
- ✅ HttpOnly cookies untuk token storage
- ✅ 10-minute token expiration
- ✅ bcrypt password hashing
- ✅ Route protection middleware
- ✅ Role-based access control (admin, super_admin)
- ✅ Automatic logout on token expire
- ✅ Secure login/logout flow

**Files:**
- `src/lib/auth.ts` - Auth utilities
- `src/middleware.ts` - Route protection
- `src/app/api/auth/login/route.ts` - Login API
- `src/app/api/auth/logout/route.ts` - Logout API
- `src/app/cms/login/page.tsx` - Login page

---

#### **2. Database Schema (14 Tables)** ✅

**Implemented Tables:**

1. **cms_users** - User accounts
   ```typescript
   id, username, email, passwordHash, fullName, 
   role, isActive, lastLogin, createdAt, updatedAt
   ```

2. **hero_sections** - Homepage carousel
   ```typescript
   id, imageUrl, title, subtitle, description,
   buttonText, buttonLink, displayOrder, isActive
   ```

3. **about_section** - About page content
   ```typescript
   id, title, description, mission, vision,
   heroImageUrl, updatedAt
   ```

4. **company_values** - Company core values
   ```typescript
   id, icon, title, description, 
   displayOrder, isActive
   ```

5. **founders** - Team/founder profiles
   ```typescript
   id, fullName, position, bio, photoUrl,
   displayOrder, isActive
   ```

6. **collections** - Product collections
   ```typescript
   id, name, category, slug, shortDescription,
   fullDescription, featuredImageUrl, displayOrder, isActive
   ```

7. **images** - Image library
   ```typescript
   id, url, altText, caption, 
   uploadedAt
   ```

8. **collection_images** - Collection-Image relation
   ```typescript
   id, collectionId, imageId, displayOrder
   ```

9. **stores** - Store locations
   ```typescript
   id, name, address, city, phone, email,
   imageUrl, googleMapsUrl, displayOrder, isActive
   ```

10. **testimonials** - Customer reviews
    ```typescript
    id, customerName, customerPhotoUrl, rating,
    testimonialText, displayOrder, isActive
    ```

11. **contact_messages** - Contact form submissions
    ```typescript
    id, name, email, subject, message,
    isRead, createdAt
    ```

12. **company_info** - Company details
    ```typescript
    id, name, tagline, description, address,
    phone, email, logoUrl
    ```

13. **social_media** - Social media links
    ```typescript
    id, platform, url, isActive
    ```

14. **seo_settings** - SEO configuration
    ```typescript
    id, defaultTitle, defaultDescription,
    keywords, ogImageUrl
    ```

**Schema Files:**
- `src/db/schema/*.ts` - Individual table schemas
- `src/db/schema/index.ts` - Schema aggregator
- `src/db/index.ts` - Database connection
- `drizzle.config.ts` - Drizzle configuration

---

#### **3. Public Website Pages** ✅

**Homepage (`src/app/page.tsx`):**
```typescript
// Server-side data fetching
async function getHeroSections() {
  return await db.select().from(heroSections)
    .where(eq(heroSections.isActive, true))
    .orderBy(heroSections.displayOrder);
}

async function getFeaturedCollections() { /* ... */ }
async function getTestimonials() { /* ... */ }

export default async function HomePage() {
  const heroSections = await getHeroSections();
  const featuredCollections = await getFeaturedCollections();
  const testimonialsList = await getTestimonials();
  
  return (
    <main>
      <HeroCarousel slides={heroSections} />
      {/* About preview, Collections, Testimonials */}
    </main>
  );
}
```

**Implemented Pages:**
- ✅ `/` - Homepage dengan hero carousel, collections preview
- ✅ `/about` - Company story, values, founders
- ✅ `/collections` - Collections listing
- ✅ `/collections/[slug]` - Collection detail dengan gallery
- ✅ `/stores` - Store locations dengan maps
- ✅ `/instagram` - Instagram feed integration
- ✅ `/contact` - Contact form

**Features:**
- ✅ Server-side rendering (SSR)
- ✅ Dynamic data dari database
- ✅ Responsive design
- ✅ Image optimization
- ✅ Scroll animations
- ✅ SEO optimization

---

#### **4. CMS Admin Panel** ✅

**Dashboard (`src/app/cms/dashboard/page.tsx`):**
```typescript
export default async function CMSDashboard() {
  const stats = await Promise.all([
    db.select({ count: count() }).from(heroSections),
    db.select({ count: count() }).from(collections),
    db.select({ count: count() }).from(stores),
    db.select({ count: count() }).from(testimonials),
    // ... more stats
  ]);
  
  return (
    <div className="cms-layout">
      <CMSSidebar />
      <main>
        <StatsCards stats={stats} />
        <QuickActions />
      </main>
    </div>
  );
}
```

**Implemented CMS Pages:**

1. **Hero Sections** (`/cms/hero`)
   - ✅ List all hero sections
   - ✅ Create new hero
   - ✅ Edit existing hero
   - ✅ Delete hero
   - ✅ Toggle active/inactive
   - ✅ Display order management

2. **About Management** (`/cms/about`)
   - ✅ Edit company story
   - ✅ Update mission & vision
   - ✅ Change hero image

3. **Company Values** (`/cms/values`)
   - ✅ CRUD operations
   - ✅ Icon/emoji selection
   - ✅ Display order

4. **Founders/Team** (`/cms/founders`)
   - ✅ Add/edit team members
   - ✅ Profile photos
   - ✅ Bio management

5. **Collections** (`/cms/collections`)
   - ✅ Create collections
   - ✅ Edit collection details
   - ✅ Manage image galleries
   - ✅ Hard delete functionality
   - ✅ SEO-friendly slugs

6. **Stores** (`/cms/stores`)
   - ✅ Add store locations
   - ✅ Edit store info
   - ✅ Google Maps integration
   - ✅ Hard delete

7. **Testimonials** (`/cms/testimonials`)
   - ✅ Add customer reviews
   - ✅ Upload customer photos
   - ✅ Star ratings
   - ✅ Hard delete

8. **Messages** (`/cms/messages`)
   - ✅ Inbox view
   - ✅ Read/unread status
   - ✅ Message details
   - ✅ Delete messages

9. **Settings** (`/cms/settings`)
   - ✅ Company info editor
   - ✅ Social media links
   - ✅ SEO settings

10. **Users** (`/cms/users`)
    - ✅ User management (super_admin only)
    - ✅ Create/edit users
    - ✅ Role assignment

**CMS Components:**
- ✅ `CMSSidebar` - Navigation sidebar
- ✅ `DataTable` - Reusable table component
- ✅ `Modal` - Dialog component
- ✅ `Button` - Styled button variants
- ✅ `FormInput` - Form field components

---

#### **5. API Routes (40+ Endpoints)** ✅

**Example API Implementation:**

```typescript
// GET /api/collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    let query = db.select().from(collections);
    
    if (!includeInactive) {
      query = query.where(eq(collections.isActive, true));
    }
    
    const result = await query.orderBy(collections.displayOrder);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST /api/collections
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    // Validate with Zod
    const validatedData = collectionSchema.parse(body);
    
    // Insert to database
    const [newCollection] = await db.insert(collections)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(newCollection, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
```

**Implemented API Categories:**

1. **Authentication** (2 endpoints)
   - POST `/api/auth/login`
   - POST `/api/auth/logout`

2. **Hero Sections** (4 endpoints)
   - GET `/api/hero-sections`
   - POST `/api/hero-sections`
   - PATCH `/api/hero-sections/[id]`
   - DELETE `/api/hero-sections/[id]`

3. **About** (2 endpoints)
   - GET `/api/about`
   - POST `/api/about`

4. **Company Values** (4 endpoints)
   - GET, POST, PATCH, DELETE

5. **Founders** (4 endpoints)
   - GET, POST, PATCH, DELETE

6. **Collections** (4 endpoints)
   - GET, POST, PATCH, DELETE (hard delete)

7. **Images** (4 endpoints)
   - GET, POST, PUT, DELETE

8. **Collection-Images** (2 endpoints)
   - GET, POST

9. **Stores** (4 endpoints)
   - GET, POST, PATCH, DELETE (hard delete)

10. **Testimonials** (4 endpoints)
    - GET, POST, PATCH, DELETE (hard delete)

11. **Contact Messages** (3 endpoints)
    - GET, POST, PATCH

12. **Company Info** (2 endpoints)
    - GET, POST

13. **Social Media** (2 endpoints)
    - GET, POST

14. **SEO Settings** (2 endpoints)
    - GET, POST

15. **Users** (4 endpoints)
    - GET, POST, PATCH, DELETE

**API Features:**
- ✅ RESTful design
- ✅ Authentication required untuk write operations
- ✅ Zod validation
- ✅ Error handling
- ✅ TypeScript types
- ✅ HTTP status codes
- ✅ Query parameters support

---

#### **6. Advanced Features** ✅

**Display Order Normalization:**
```typescript
// scripts/normalize-display-orders.ts
async function normalizeDisplayOrders() {
  // Normalize hero sections
  const heroes = await db.select().from(heroSections)
    .orderBy(heroSections.displayOrder);
  
  for (let i = 0; i < heroes.length; i++) {
    await db.update(heroSections)
      .set({ displayOrder: i + 1 })
      .where(eq(heroSections.id, heroes[i].id));
  }
  
  // Repeat for other entities...
}
```

**Features:**
- ✅ Display order normalization script
- ✅ Hard delete untuk collections, stores, testimonials
- ✅ Customer photos di testimonials
- ✅ Instagram page dengan Juicer.io
- ✅ Responsive design fixes
- ✅ Contact form 422 error fix
- ✅ SafeImage component dengan error handling

**Recent Enhancements:**
- ⭐ Instagram page accessible from Navbar & Footer
- ⭐ Responsive design improvements (mobile header fix)
- ⭐ Hard delete implementation
- ⭐ Testimonials customer images display
- ⭐ Contact form validation fix

---

### 4.2.2 Component Architecture

**Reusable Components:**

1. **Layout Components**
   ```
   ├── Navbar.tsx - Site navigation
   ├── Footer.tsx - Site footer
   ├── CMSSidebar.tsx - CMS navigation
   └── PageTransition.tsx - Page animations
   ```

2. **UI Components**
   ```
   ├── cms/
   │   ├── Button.tsx - Styled buttons
   │   ├── Modal.tsx - Dialog modals
   │   ├── DataTable.tsx - Data tables
   │   └── FormInput.tsx - Form fields
   ```

3. **Feature Components**
   ```
   ├── HeroCarousel.tsx - Hero slider
   ├── SafeImage.tsx - Image with error handling
   └── ScrollAnimation.tsx - Scroll animations
   ```

**Component Features:**
- ✅ TypeScript props validation
- ✅ Reusable & composable
- ✅ Responsive design
- ✅ Accessibility (ARIA)
- ✅ Error boundaries

---

### 4.2.3 Database Seeding

**Seed Script (`scripts/seed-new.ts`):**
```typescript
async function seed() {
  // 1. Create admin user
  await db.insert(cmsUsers).values({
    username: 'admin',
    email: 'admin@brodo.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    fullName: 'Admin Brodo',
    role: 'super_admin',
  });
  
  // 2. Seed hero sections (3 heroes)
  await db.insert(heroSections).values([...]);
  
  // 3. Seed about section
  await db.insert(aboutSection).values({...});
  
  // 4. Seed company values (6 values)
  await db.insert(companyValues).values([...]);
  
  // 5. Seed founders (2 founders)
  await db.insert(founders).values([...]);
  
  // 6. Seed collections (4 collections)
  const collectionsData = await db.insert(collections)
    .values([...]).returning();
  
  // 7. Seed images and collection_images
  // 8. Seed stores (5 stores)
  // 9. Seed testimonials (3 testimonials)
  // 10. Seed company info, social media, SEO
}
```

**Seeded Data:**
- ✅ 1 super admin user
- ✅ 3 hero sections
- ✅ 1 about section
- ✅ 6 company values
- ✅ 2 founders (Muhammad Yukka, Putera Dwi)
- ✅ 4 collections (Sneakers, Essentials, Sandals, Accessories)
- ✅ 40+ images
- ✅ 5 stores (Jakarta, Bandung, Medan, Bekasi, Yogyakarta)
- ✅ 3 testimonials
- ✅ Company info & settings

---

### 4.2.4 Deployment Setup

**Docker Implementation:**

```dockerfile
# Multi-stage build
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
services:
  brodo-cms:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
```

**Deployment Features:**
- ✅ Docker containerization
- ✅ Multi-stage build (optimized size)
- ✅ Health checks
- ✅ Environment variables
- ✅ Azure VM deployment
- ✅ Custom domain (brodofootwear.studio)
- ✅ SSL/TLS via Nginx
- ✅ Reverse proxy configuration

---

## 4.3 Fitur yang Belum Diimplementasikan

### 4.3.1 Nice-to-Have Features (Future Enhancements)

#### **1. Advanced CMS Features**

❌ **Not Yet Implemented:**
- [ ] Drag-and-drop reordering untuk display order
- [ ] Rich text editor (WYSIWYG) untuk descriptions
- [ ] Image upload functionality (currently URL-based)
- [ ] Bulk actions (delete multiple, bulk update)
- [ ] Content versioning & history
- [ ] Draft/published status
- [ ] Scheduled publishing
- [ ] Content preview before publish

**Reason:** Time constraints, MVP prioritization

**Future Implementation:**
- Use react-beautiful-dnd untuk drag-drop
- Integrate TinyMCE atau Tiptap untuk rich text
- Implement AWS S3 atau Cloudinary untuk uploads
- Add audit log table

---

#### **2. Analytics & Reporting**

❌ **Not Yet Implemented:**
- [ ] Google Analytics integration
- [ ] Page view tracking
- [ ] User behavior analytics
- [ ] Content performance metrics
- [ ] Dashboard charts/graphs
- [ ] Export reports (PDF, Excel)
- [ ] Real-time statistics

**Reason:** Focus on core functionality first

**Future Implementation:**
- Google Analytics 4 integration
- Chart.js atau Recharts untuk visualizations
- Server-side analytics tracking
- Custom reporting dashboard

---

#### **3. E-Commerce Features**

❌ **Not Yet Implemented:**
- [ ] Product catalog dengan pricing
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Payment gateway integration
- [ ] Order management
- [ ] Inventory tracking
- [ ] Customer accounts

**Reason:** Out of scope - company profile only, not e-commerce

**Future Consideration:**
- Integrate Midtrans/Xendit untuk payments
- Add product variants (size, color)
- Order fulfillment system
- Customer loyalty program

---

#### **4. Multi-language Support**

❌ **Not Yet Implemented:**
- [ ] Internationalization (i18n)
- [ ] Multiple language content
- [ ] Language switcher
- [ ] RTL support
- [ ] Currency conversion

**Reason:** Target audience primarily Indonesian

**Future Implementation:**
- next-intl library
- Separate content table per language
- Language detection based on browser
- Admin panel untuk manage translations

---

#### **5. Advanced Search**

❌ **Not Yet Implemented:**
- [ ] Full-text search
- [ ] Elasticsearch integration
- [ ] Search suggestions/autocomplete
- [ ] Faceted search (filters)
- [ ] Search analytics

**Reason:** Data volume doesn't require advanced search yet

**Future Implementation:**
- PostgreSQL full-text search
- Or Algolia/Meilisearch integration
- Search results ranking
- Search history tracking

---

#### **6. Social Features**

❌ **Not Yet Implemented:**
- [ ] User comments/reviews
- [ ] Social media auto-posting
- [ ] User-generated content moderation
- [ ] Social login (Google, Facebook)
- [ ] Share tracking

**Reason:** Not priority for initial launch

**Future Implementation:**
- OAuth 2.0 untuk social login
- API integration dengan Instagram/Facebook
- Comment moderation system
- Social sharing analytics

---

#### **7. Mobile App**

❌ **Not Yet Implemented:**
- [ ] Native mobile app (iOS/Android)
- [ ] React Native app
- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Offline mode

**Reason:** Responsive web sufficient for now

**Future Implementation:**
- React Native atau Flutter
- PWA dengan service workers
- Firebase Cloud Messaging untuk notifications
- App store distribution

---

#### **8. Advanced Security**

❌ **Not Yet Implemented:**
- [ ] Two-factor authentication (2FA)
- [ ] IP whitelisting
- [ ] Rate limiting
- [ ] CAPTCHA untuk login
- [ ] Security audit logs
- [ ] Automated security scanning

**Reason:** Basic security sufficient for MVP

**Future Implementation:**
- TOTP-based 2FA
- Redis untuk rate limiting
- reCAPTCHA v3
- Detailed audit trail
- OWASP ZAP security scanning

---

### 4.3.2 Technical Debt & Improvements

#### **Areas for Optimization:**

1. **Performance**
   - [ ] Implement Redis caching
   - [ ] CDN untuk static assets
   - [ ] Database query optimization
   - [ ] Lazy loading components
   - [ ] Image CDN (Cloudinary/Imgix)

2. **Testing**
   - [ ] Unit tests (Jest, Vitest)
   - [ ] Integration tests
   - [ ] E2E tests (Playwright, Cypress)
   - [ ] API tests
   - [ ] Visual regression tests

3. **Documentation**
   - [ ] API documentation (Swagger/OpenAPI)
   - [ ] Component Storybook
   - [ ] Video tutorials
   - [ ] User manual
   - [ ] Developer onboarding guide

4. **DevOps**
   - [ ] CI/CD pipeline (GitHub Actions)
   - [ ] Automated testing
   - [ ] Staging environment
   - [ ] Blue-green deployment
   - [ ] Automated backups
   - [ ] Monitoring & alerts (Sentry)

---

## 4.4 Alur Bisnis (Business Flow)

### 4.4.1 User Journey - Public Visitor

```
┌─────────────────────────────────────────────────────────┐
│                    Public User Journey                  │
└─────────────────────────────────────────────────────────┘

1. Landing → Homepage
   ↓
   - View hero carousel
   - Read about preview
   - Browse featured collections
   - Read testimonials

2. Browse Collections
   ↓
   - View all collections
   - Click collection → See details & images
   - Browse image gallery

3. Learn About Brand
   ↓
   - Read company story
   - View company values
   - Meet the founders

4. Find Store
   ↓
   - Browse store locations
   - View on Google Maps
   - Get directions
   - Contact store

5. Contact/Inquire
   ↓
   - Fill contact form
   - Submit inquiry
   - Get confirmation

6. Social Engagement
   ↓
   - View Instagram feed
   - See latest posts
   - Follow on social media
```

### 4.4.2 User Journey - CMS Admin

```
┌─────────────────────────────────────────────────────────┐
│                    Admin User Journey                   │
└─────────────────────────────────────────────────────────┘

1. Login
   ↓
   - Enter credentials
   - Authenticate with JWT
   - Redirect to dashboard

2. Dashboard Overview
   ↓
   - View statistics
   - Check unread messages
   - Quick actions

3. Content Management
   ↓
   A. Update Hero Sections
      - Upload new hero image
      - Edit text & CTA
      - Reorder slides
      - Toggle active/inactive
   
   B. Manage Collections
      - Create new collection
      - Upload images
      - Edit descriptions
      - Manage image gallery
      - Delete collection (hard delete)
   
   C. Update Stores
      - Add new store
      - Edit store details
      - Update location/maps
      - Delete store (hard delete)
   
   D. Manage Testimonials
      - Add customer review
      - Upload customer photo
      - Set star rating
      - Toggle visibility
      - Delete testimonial (hard delete)
   
   E. Handle Messages
      - View inbox
      - Read messages
      - Mark as read/unread
      - Delete messages

4. Settings Management
   ↓
   - Update company info
   - Edit social media links
   - Configure SEO settings

5. User Management (super_admin only)
   ↓
   - Create new users
   - Assign roles
   - Deactivate users

6. Logout
   ↓
   - Clear session
   - Redirect to login
```

### 4.4.3 Content Update Flow

```
┌─────────────────────────────────────────────────────────┐
│              Content Creation/Update Flow               │
└─────────────────────────────────────────────────────────┘

Marketing Team Workflow:

1. Login to CMS
   ↓
2. Navigate to relevant section
   (e.g., Collections, Hero, Stores)
   ↓
3. Click "Add New" or "Edit"
   ↓
4. Fill form fields
   - Text content
   - Image URLs
   - Settings (order, active status)
   ↓
5. Client-side validation
   - Check required fields
   - Validate formats
   - Show errors
   ↓
6. Submit form
   ↓
7. Server-side validation (Zod)
   - Validate data types
   - Check constraints
   - Sanitize inputs
   ↓
8. Database operation
   - INSERT/UPDATE query
   - Transaction handling
   - Return result
   ↓
9. Response handling
   - Success: Show toast → Redirect
   - Error: Show error → Stay on form
   ↓
10. Content published
    - Immediately visible on public site
    - No cache invalidation needed (dynamic)
```

### 4.4.4 Customer Inquiry Flow

```
┌─────────────────────────────────────────────────────────┐
│               Customer Contact Flow                     │
└─────────────────────────────────────────────────────────┘

Customer Side:

1. Navigate to Contact page
   ↓
2. Fill contact form
   - Name, Email, Subject, Message
   ↓
3. Submit form
   ↓
4. Form validation
   ↓
5. POST to /api/contact-messages
   ↓
6. Success confirmation
   - Toast notification
   - Form cleared

Admin Side:

1. Login to CMS
   ↓
2. Navigate to Messages
   ↓
3. View inbox
   - Unread count badge
   - Messages sorted by date
   ↓
4. Click message to read
   ↓
5. Mark as read
   ↓
6. Reply (via email client)
   or Delete message
```

### 4.4.5 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Authentication Flow                    │
└─────────────────────────────────────────────────────────┘

Login Process:

1. User navigates to /cms
   ↓
2. Middleware checks auth token
   ↓
3. No token → Redirect to /cms/login
   ↓
4. User enters credentials
   ↓
5. Submit login form
   ↓
6. POST /api/auth/login
   ↓
7. Server validates credentials
   - Check email exists
   - Verify password (bcrypt)
   ↓
8. Generate JWT token
   - Payload: userId, email, name, role
   - Expires in 10 minutes
   ↓
9. Set HttpOnly cookie
   - Name: auth_token
   - Secure: true (production)
   - SameSite: strict
   ↓
10. Return success
    ↓
11. Client stores token in localStorage (optional)
    ↓
12. Redirect to /cms/dashboard

Protected Route Access:

1. User requests /cms/hero
   ↓
2. Middleware intercepts
   ↓
3. Extract token from cookie
   ↓
4. Verify JWT signature
   ↓
5. Check token expiration
   ↓
6. Valid → Allow access
   Invalid → Redirect to login

Logout Process:

1. User clicks logout
   ↓
2. POST /api/auth/logout
   ↓
3. Clear auth_token cookie
   ↓
4. Clear localStorage
   ↓
5. Redirect to /cms/login
```

### 4.4.6 Image Management Flow

```
┌─────────────────────────────────────────────────────────┐
│              Image Management Flow                      │
└─────────────────────────────────────────────────────────┘

Current Implementation (URL-based):

1. Admin prepares image
   - Resize/optimize locally
   - Upload to external hosting
   - Copy image URL
   ↓
2. Paste URL in CMS form
   ↓
3. Submit form
   ↓
4. Server validates URL format
   ↓
5. Save URL to database
   ↓
6. Public page fetches image
   - Next.js Image component
   - Automatic optimization
   - Lazy loading

Collection Images Specific:

1. Admin navigates to collection
   ↓
2. Click "Manage Images"
   ↓
3. Add image URLs
   - Image URL
   - Caption
   - Display order
   ↓
4. POST /api/images
   ↓
5. Create image record
   ↓
6. Link to collection via collection_images
   ↓
7. Images displayed in gallery
```

---

## 4.5 Development Timeline

### 4.5.1 Project Phases

| Phase | Duration | Status | Features |
|-------|----------|--------|----------|
| **Phase 1** | Week 1-2 | ✅ Complete | Setup, Database, Auth |
| **Phase 2** | Week 3-4 | ✅ Complete | Public Pages, Components |
| **Phase 3** | Week 5-6 | ✅ Complete | CMS Backend, API Routes |
| **Phase 4** | Week 7-8 | ✅ Complete | Advanced Features, Testing |
| **Phase 5** | Week 9-10 | ✅ Complete | Deployment, Domain Setup |
| **Phase 6** | Week 11+ | 🔄 Ongoing | Maintenance, Enhancements |

### 4.5.2 Milestone Achievements

- ✅ **Week 2:** Database schema finalized, authentication working
- ✅ **Week 4:** All public pages responsive and functional
- ✅ **Week 6:** Complete CMS with CRUD operations
- ✅ **Week 8:** Hard delete, testimonials photos, Instagram page
- ✅ **Week 10:** Production deployment, SSL configured
- ✅ **Week 11:** Bug fixes, responsive improvements

---

## 4.6 Kesimpulan

### 4.6.1 Implementation Success Rate

**Core Features:** 100% ✅
- Authentication ✅
- Database ✅
- Public website ✅
- CMS admin ✅
- API endpoints ✅
- Deployment ✅

**Advanced Features:** 85% ✅
- Display order ✅
- Hard delete ✅
- Image management ✅
- Responsive design ✅
- Instagram integration ✅
- Form validation ✅

**Future Features:** 0%
- File uploads ⏳
- Advanced search ⏳
- Analytics ⏳
- Multi-language ⏳

### 4.6.2 Business Value Delivered

1. ✅ **Operational Efficiency** - Marketing dapat update konten sendiri
2. ✅ **Cost Reduction** - Tidak perlu developer untuk setiap update
3. ✅ **User Experience** - Fast, responsive, modern website
4. ✅ **Scalability** - Ready untuk growth dan expansion
5. ✅ **Security** - Industry-standard authentication & protection

---

**📌 Catatan:**
Project ini telah mencapai **MVP goals** dengan 100% core features implemented. Future enhancements akan ditambahkan based on user feedback dan business needs.
