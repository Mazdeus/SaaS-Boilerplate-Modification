# BAB III - FITUR SISTEM

## 3.1 Fitur Utama

### 3.1.1 Public Website Features

#### **1. Homepage (Landing Page)**

**URL:** `http://localhost:3000`

**Fitur:**
- ✅ **Hero Carousel** - Slideshow dengan gambar dan CTA dinamis
  - Auto-play dengan interval 5 detik
  - Manual navigation (prev/next buttons)
  - Indicator dots untuk tracking
  - Smooth transitions
  - Responsive images
  - Call-to-action buttons

- ✅ **About Preview Section**
  - Company introduction
  - Brand story snippet
  - Link ke About page
  - Featured image

- ✅ **Featured Collections**
  - Showcase 3 koleksi utama
  - Grid layout responsif
  - Collection images
  - Short descriptions
  - Link ke detail pages

- ✅ **Company Values Preview**
  - Icon-based value cards
  - Core values highlight
  - Visual appeal

- ✅ **Testimonials Showcase**
  - Customer reviews carousel
  - Star ratings
  - Customer photos
  - Rotating testimonials

- ✅ **Call-to-Action Sections**
  - Navigate to collections
  - Store locator
  - Contact form

**Technical Details:**
- Server-side rendering untuk SEO
- Dynamic data dari database
- Revalidation untuk fresh content
- Image optimization
- Scroll animations

---

#### **2. About Us Page**

**URL:** `http://localhost:3000/about`

**Fitur:**
- ✅ **Company Story**
  - Brand narrative
  - Rich text content
  - Hero image
  - Formatted text dengan headings

- ✅ **Mission & Vision**
  - Clear mission statement
  - Vision for the future
  - Company philosophy

- ✅ **Company Values**
  - Grid layout (3 columns)
  - Icon untuk setiap value
  - Value title dan description
  - Visual hierarchy

- ✅ **Founders/Team Section**
  - Founder profiles
  - Profile photos
  - Roles/positions
  - Short bios
  - Grid layout responsif

- ✅ **Company Timeline** (optional)
  - Milestones
  - Key achievements
  - Growth story

**Technical Details:**
- SSR untuk content SEO
- Responsive grid layouts
- Image optimization
- Scroll animations
- Typography hierarchy

---

#### **3. Collections Page**

**URL:** `http://localhost:3000/collections`

**Fitur:**
- ✅ **Collections Listing**
  - Grid view semua koleksi aktif
  - Collection card dengan:
    - Featured image
    - Collection name
    - Short description
    - "View Details" button
  - Responsive grid (1/2/3/4 columns)
  - Hover effects

- ✅ **Collection Detail Page**
  - URL: `/collections/[slug]`
  - Full description
  - Image gallery
  - Multiple product images
  - Image carousel/grid
  - Lightbox functionality
  - Social sharing buttons
  - Back to collections link

**Data Displayed:**
- Collection name
- Category
- Description (rich text)
- Multiple images
- Status (active/inactive)

**Technical Details:**
- Dynamic routing `[slug]`
- SEO-friendly URLs
- Image galleries
- Lazy loading images
- Breadcrumb navigation

---

#### **4. Stores/Locations Page**

**URL:** `http://localhost:3000/stores`

**Fitur:**
- ✅ **Store Listing**
  - Grid/list view semua toko
  - Store cards dengan:
    - Store image
    - Store name
    - Address lengkap
    - Phone number
    - Email (optional)
    - Operating hours
    - "Get Directions" button

- ✅ **Google Maps Integration**
  - Interactive map
  - Store markers
  - Click untuk info
  - Directions link
  - Street view (future)

- ✅ **Store Information**
  - Opening hours
  - Contact details
  - Facilities info
  - Store photos

- ✅ **Location Search** (future)
  - Search by city
  - Filter by features
  - Nearest store finder

**Technical Details:**
- Google Maps API integration
- Geocoding untuk addresses
- Responsive cards
- Mobile-friendly
- Click-to-call functionality

---

#### **5. Instagram Feed / Aktivitas Terbaru**

**URL:** `http://localhost:3000/instagram`

**Fitur:**
- ✅ **Instagram Integration**
  - Embedded Juicer.io feed
  - Latest Instagram posts
  - Grid layout
  - Real-time updates
  - Post thumbnails
  - Link ke Instagram

- ✅ **Navigation Access**
  - Link di Navbar
  - Link di Footer
  - Direct access dari homepage

- ✅ **Social Engagement**
  - Follow button
  - Post interactions
  - Brand storytelling
  - User-generated content

**Technical Details:**
- Juicer.io embed code
- Responsive iframe
- Fast loading
- Fallback for errors

---

#### **6. Contact Page**

**URL:** `http://localhost:3000/contact`

**Fitur:**
- ✅ **Contact Form**
  - Name field (required)
  - Email field (required, validated)
  - Subject field (required)
  - Message textarea (required)
  - Submit button
  - Form validation
  - Success/error messages
  - Loading state

- ✅ **Contact Information**
  - Office address
  - Phone number
  - Email address
  - Business hours
  - Social media links

- ✅ **Location Map**
  - Google Maps embed
  - Office location marker
  - Get directions link

- ✅ **Form Submission**
  - Data saved ke database
  - Validation dengan Zod
  - Toast notifications
  - Auto-clear form on success

**Technical Details:**
- Client-side validation
- Server-side validation
- React Hook Form
- Zod schema validation
- API POST endpoint
- Error handling

---

### 3.1.2 Navigation & Layout

#### **Navbar (Header)**

**Fitur:**
- ✅ **Brand Logo**
  - Link ke homepage
  - Brodo logo image
  - Responsive sizing

- ✅ **Navigation Menu**
  - Home
  - About Us
  - Collections
  - Stores
  - Aktivitas Terbaru (Instagram)
  - Contact

- ✅ **Mobile Menu**
  - Hamburger icon
  - Slide-in menu
  - Touch-friendly
  - Close button

- ✅ **Active State**
  - Current page highlight
  - Visual feedback

- ✅ **Sticky Header** (optional)
  - Fixed position on scroll
  - Always accessible

**Technical Details:**
- Responsive design
- Mobile-first approach
- z-index management
- Smooth transitions

---

#### **Footer**

**Fitur:**
- ✅ **Brand Section**
  - Logo
  - Tagline
  - Short description

- ✅ **Quick Links**
  - Navigation links
  - Important pages
  - Sitemap access

- ✅ **Contact Info**
  - Address
  - Phone
  - Email
  - Business hours

- ✅ **Social Media**
  - Instagram link
  - Facebook link
  - WhatsApp link
  - Other platforms

- ✅ **Copyright**
  - Copyright notice
  - Year auto-update
  - Legal links

**Technical Details:**
- Responsive grid
- Icon library
- Link management
- SEO-friendly

---

### 3.1.3 Performance Features

#### **1. Image Optimization**
- ✅ Next.js Image component
- ✅ Automatic format selection (WebP)
- ✅ Responsive images
- ✅ Lazy loading
- ✅ Blur placeholder

#### **2. SEO Optimization**
- ✅ Meta tags management
- ✅ Open Graph tags
- ✅ Structured data
- ✅ Semantic HTML
- ✅ Alt text untuk images

#### **3. Performance**
- ✅ Server-side rendering
- ✅ Code splitting
- ✅ Minification
- ✅ Compression
- ✅ Caching strategy

---

## 3.2 Fitur CMS (Content Management System)

### 3.2.1 Authentication & Access

#### **Login System**

**URL:** `http://localhost:3000/cms/login`

**Fitur:**
- ✅ **Login Form**
  - Email input (validated)
  - Password input (masked)
  - Remember me checkbox
  - Login button
  - Error messages
  - Loading state

- ✅ **Authentication**
  - JWT token generation
  - HttpOnly cookie storage
  - 10-minute token expiry
  - Auto-redirect ke dashboard
  - Invalid credentials handling

- ✅ **Security**
  - bcrypt password verification
  - SQL injection prevention
  - Rate limiting (future)
  - Secure cookie flags

**Default Credentials:**
```
Email: admin@brodo.com
Password: admin123
```

**Technical Details:**
- POST `/api/auth/login`
- JWT dengan jose library
- Cookie-based sessions
- Protected routes

---

#### **Access Control**

**Fitur:**
- ✅ **Middleware Protection**
  - All `/cms/*` routes protected
  - Auto-redirect jika tidak authenticated
  - Token verification
  - Refresh token handling

- ✅ **Role-Based Access**
  - Admin role - full access
  - Editor role - limited access
  - Super admin - user management

- ✅ **Session Management**
  - Active session tracking
  - Last login timestamp
  - Concurrent sessions
  - Automatic logout on expire

---

### 3.2.2 CMS Dashboard

**URL:** `http://localhost:3000/cms/dashboard`

**Fitur:**
- ✅ **Overview Statistics**
  - Total hero sections
  - Total collections
  - Total stores
  - Total testimonials
  - Total messages (unread)
  - Active users

- ✅ **Quick Actions**
  - Add new hero section
  - Create collection
  - Add store
  - Add testimonial
  - View messages

- ✅ **Recent Activities** (future)
  - Latest content updates
  - Recent messages
  - System logs

- ✅ **Navigation Sidebar**
  - Menu dengan icons
  - Active page highlight
  - Collapsible menu
  - User info
  - Logout button

**Technical Details:**
- Real-time data fetching
- Loading states
- Error handling
- Responsive layout

---

### 3.2.3 Hero Sections Management

**URL:** `http://localhost:3000/cms/hero`

**Fitur:**

#### **List View**
- ✅ **Data Table**
  - Hero image thumbnail
  - Title
  - Subtitle
  - Button text
  - Display order
  - Active status
  - Actions (Edit/Delete)

- ✅ **Table Features**
  - Sortable columns
  - Display order drag-drop (future)
  - Bulk actions (future)
  - Pagination (jika banyak data)

#### **Create/Edit Form**
- ✅ **Form Fields**
  - Image URL input
  - Title input (required)
  - Subtitle input (required)
  - Description textarea
  - Button text input
  - Button link input
  - Display order number
  - Active/inactive toggle

- ✅ **Validation**
  - Required field checking
  - URL validation
  - Max length validation
  - Unique display order
  - Real-time error messages

- ✅ **Actions**
  - Save hero section
  - Cancel and return
  - Preview (future)
  - Duplicate (future)

#### **Delete Functionality**
- ✅ Confirmation modal
- ✅ Soft delete (mark inactive)
- ✅ Success notification

**API Endpoints:**
- GET `/api/hero-sections` - List all
- POST `/api/hero-sections` - Create new
- PATCH `/api/hero-sections/[id]` - Update
- DELETE `/api/hero-sections/[id]` - Delete

---

### 3.2.4 About Us Management

**URL:** `http://localhost:3000/cms/about`

**Fitur:**
- ✅ **Company Info Editor**
  - Title input
  - Description textarea (rich text future)
  - Mission textarea
  - Vision textarea
  - Hero image URL
  - Save button

- ✅ **Real-time Preview** (future)
  - See changes instantly
  - Desktop/mobile preview
  - Before/after comparison

**API Endpoint:**
- GET `/api/about` - Fetch content
- POST `/api/about` - Update content

---

### 3.2.5 Company Values Management

**URL:** `http://localhost:3000/cms/values`

**Fitur:**

#### **List View**
- ✅ **Value Cards**
  - Icon/emoji
  - Title
  - Description
  - Display order
  - Active status
  - Edit/Delete actions

#### **Create/Edit Form**
- ✅ **Form Fields**
  - Icon input (emoji/text)
  - Title input (required)
  - Description textarea (required)
  - Display order
  - Active toggle

- ✅ **Validation**
  - Required fields
  - Max length
  - Unique order

**API Endpoints:**
- GET `/api/company-values`
- POST `/api/company-values`
- PATCH `/api/company-values/[id]`
- DELETE `/api/company-values/[id]`

---

### 3.2.6 Founders/Team Management

**URL:** `http://localhost:3000/cms/founders`

**Fitur:**

#### **List View**
- ✅ **Founder Cards**
  - Profile photo
  - Full name
  - Position/role
  - Bio excerpt
  - Display order
  - Actions

#### **Create/Edit Form**
- ✅ **Form Fields**
  - Full name (required)
  - Position (required)
  - Bio textarea (required)
  - Photo URL
  - Email (optional)
  - LinkedIn URL (optional)
  - Display order
  - Active toggle

- ✅ **Photo Upload**
  - Image URL input
  - Preview image
  - Aspect ratio guide

**API Endpoints:**
- GET `/api/founders`
- POST `/api/founders`
- PATCH `/api/founders/[id]`
- DELETE `/api/founders/[id]`

---

### 3.2.7 Collections Management

**URL:** `http://localhost:3000/cms/collections`

**Fitur:**

#### **List View**
- ✅ **Collections Table**
  - Featured image
  - Collection name
  - Category
  - Slug (URL)
  - Display order
  - Active status
  - Actions (Edit/Delete/Manage Images)

#### **Create/Edit Form**
- ✅ **Basic Info**
  - Collection name (required)
  - Category dropdown
  - Short description
  - Full description (textarea)
  - Featured image URL
  - Active toggle
  - Display order

- ✅ **SEO Settings**
  - Custom slug (auto-generated)
  - Meta title
  - Meta description

#### **Image Gallery Management**
- ✅ **Manage Collection Images**
  - Upload multiple images
  - Image preview
  - Caption untuk setiap image
  - Display order
  - Delete images
  - Set featured image

- ✅ **Image Features**
  - Drag-drop ordering (future)
  - Bulk upload (future)
  - Image optimization
  - Alt text

**API Endpoints:**
- GET `/api/collections`
- POST `/api/collections`
- PATCH `/api/collections/[id]`
- DELETE `/api/collections/[id]` - Hard delete
- GET `/api/images?collectionId=[id]` - Get collection images
- POST `/api/images` - Upload image
- DELETE `/api/images/[id]` - Delete image

**⭐ Special Feature: Hard Delete**
- Collections are permanently deleted (not soft delete)
- Associated images also deleted
- Confirmation modal required

---

### 3.2.8 Stores Management

**URL:** `http://localhost:3000/cms/stores`

**Fitur:**

#### **List View**
- ✅ **Store Cards/Table**
  - Store image
  - Store name
  - City
  - Address
  - Phone
  - Active status
  - Actions

#### **Create/Edit Form**
- ✅ **Store Information**
  - Store name (required)
  - Address (required)
  - City (required)
  - Phone number
  - Email
  - Store image URL

- ✅ **Operating Hours**
  - Opening time
  - Closing time
  - Days of operation

- ✅ **Location**
  - Google Maps URL
  - Latitude/Longitude (future)
  - Directions link

- ✅ **Settings**
  - Display order
  - Active toggle

**API Endpoints:**
- GET `/api/stores`
- POST `/api/stores`
- PATCH `/api/stores/[id]`
- DELETE `/api/stores/[id]` - Hard delete

**⭐ Special Feature: Hard Delete**
- Stores permanently deleted from database
- Confirmation required

---

### 3.2.9 Testimonials Management

**URL:** `http://localhost:3000/cms/testimonials`

**Fitur:**

#### **List View**
- ✅ **Testimonial Cards**
  - Customer photo
  - Customer name
  - Rating (stars)
  - Testimonial excerpt
  - Date
  - Active status
  - Actions

#### **Create/Edit Form**
- ✅ **Customer Info**
  - Customer name (required)
  - Customer photo URL
  - Location/city
  - Purchase date

- ✅ **Testimonial Content**
  - Rating (1-5 stars) (required)
  - Testimonial text (required)
  - Product/collection reference

- ✅ **Settings**
  - Display order
  - Active toggle
  - Featured testimonial

**⭐ Special Feature:**
- Customer photos now displayed on public page
- Hard delete implementation
- Star rating visualization

**API Endpoints:**
- GET `/api/testimonials`
- POST `/api/testimonials`
- PATCH `/api/testimonials/[id]`
- DELETE `/api/testimonials/[id]` - Hard delete

---

### 3.2.10 Messages Inbox

**URL:** `http://localhost:3000/cms/messages`

**Fitur:**

#### **Inbox View**
- ✅ **Messages List**
  - Sender name
  - Email
  - Subject
  - Message preview
  - Date received
  - Read/unread status
  - Actions (View/Delete)

- ✅ **Filter & Search**
  - Filter by read/unread
  - Search by name/email
  - Sort by date
  - Pagination

#### **Message Detail**
- ✅ **Full Message View**
  - Sender info
  - Subject
  - Full message content
  - Timestamp
  - Mark as read/unread
  - Reply (email client)
  - Delete

- ✅ **Actions**
  - Mark as read
  - Mark as unread
  - Delete message
  - Reply via email (opens email client)

**API Endpoints:**
- GET `/api/contact-messages`
- PATCH `/api/contact-messages/[id]` - Mark read
- DELETE `/api/contact-messages/[id]`

---

### 3.2.11 Settings Management

**URL:** `http://localhost:3000/cms/settings`

**Fitur:**

#### **Company Information**
- ✅ **Business Details**
  - Company name
  - Tagline
  - Description
  - Logo URL
  - Favicon URL

- ✅ **Contact Details**
  - Address
  - Phone
  - Email
  - Business hours

#### **Social Media Links**
- ✅ **Social Profiles**
  - Instagram URL
  - Facebook URL
  - Twitter URL
  - WhatsApp number
  - LinkedIn URL
  - TikTok URL

#### **SEO Settings**
- ✅ **Meta Information**
  - Default meta title
  - Default meta description
  - Keywords
  - OG image URL

- ✅ **Analytics** (future)
  - Google Analytics ID
  - Facebook Pixel ID
  - Tracking codes

**API Endpoints:**
- GET `/api/company-info`
- POST `/api/company-info`
- GET `/api/social-media`
- POST `/api/social-media`
- GET `/api/seo-settings`
- POST `/api/seo-settings`

---

### 3.2.12 User Management

**URL:** `http://localhost:3000/cms/users`

**Fitur:**

#### **Users List**
- ✅ **User Table**
  - Username
  - Email
  - Full name
  - Role (admin/editor)
  - Active status
  - Last login
  - Actions

#### **Create/Edit User**
- ✅ **User Form**
  - Username (required, unique)
  - Email (required, unique)
  - Full name
  - Password (create only)
  - Role dropdown
  - Active toggle

- ✅ **Role Options**
  - Admin - Full access
  - Editor - Limited access
  - Super Admin - User management

#### **User Actions**
- ✅ Edit user
- ✅ Deactivate user
- ✅ Reset password (future)
- ✅ Delete user

**⚠️ Access Control:**
- Only super_admin can access user management
- Regular admins cannot see this page

**API Endpoints:**
- GET `/api/users`
- POST `/api/users`
- PATCH `/api/users/[id]`
- DELETE `/api/users/[id]`

---

## 3.3 Fitur Tambahan

### 3.3.1 Display Order System

**Fitur:**
- ✅ **Automatic Normalization**
  - Script: `npm run normalize-orders`
  - Ensures sequential ordering (1, 2, 3, ...)
  - No gaps in display order
  - Applies to all entities dengan display order

- ✅ **Drag-Drop Ordering** (future)
  - Visual reordering
  - Instant feedback
  - Auto-save

**Entities with Display Order:**
- Hero sections
- Collections
- Stores
- Testimonials
- Company values
- Founders

---

### 3.3.2 Search & Filter

**Fitur:**
- ✅ **CMS Search**
  - Search collections by name
  - Filter stores by city
  - Search messages
  - Quick find

- ✅ **Public Search** (future)
  - Search collections
  - Filter by category
  - Search stores by location

---

### 3.3.3 Responsive Design

**Fitur:**
- ✅ **Mobile Responsive**
  - All pages mobile-friendly
  - Touch-friendly buttons
  - Mobile navigation
  - Responsive tables

- ✅ **CMS Mobile Support**
  - ⭐ **NEW:** Fixed header overlap on mobile
  - Responsive sidebar
  - Mobile-optimized forms
  - Touch interactions

- ✅ **Breakpoints**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

---

### 3.3.4 Toast Notifications

**Fitur:**
- ✅ **User Feedback**
  - Success messages
  - Error messages
  - Warning messages
  - Loading states

- ✅ **Toast Types**
  - Success (green)
  - Error (red)
  - Info (blue)
  - Loading (spinner)

**Library:** React Hot Toast

---

### 3.3.5 Form Validation

**Fitur:**
- ✅ **Client-Side Validation**
  - Real-time error messages
  - Field-level validation
  - Form-level validation
  - Custom error messages

- ✅ **Server-Side Validation**
  - Zod schema validation
  - Type checking
  - Sanitization
  - Security validation

**Technologies:**
- React Hook Form
- Zod validation
- Custom validators

---

### 3.3.6 Image Handling

**Fitur:**
- ✅ **SafeImage Component**
  - Error boundary
  - Fallback images
  - Loading states
  - Alt text

- ✅ **Image Optimization**
  - Next.js Image component
  - WebP format
  - Lazy loading
  - Responsive images
  - Blur placeholder

**Best Practices:**
- See `IMAGE-HANDLING-GUIDE.md`

---

### 3.3.7 Database Management

**Fitur:**
- ✅ **Migration System**
  - Drizzle migrations
  - Schema versioning
  - Rollback capability
  - Migration history

- ✅ **Seeding**
  - Initial data seeding
  - Test data generation
  - Demo content
  - `npm run db:seed`

- ✅ **Database Studio**
  - Drizzle Studio UI
  - Visual database browser
  - Query editor
  - `npm run db:studio`

---

### 3.3.8 Monitoring & Health Checks

**Fitur:**
- ✅ **Health Check Endpoint**
  - `/api/health`
  - Database connectivity
  - System status
  - Uptime monitoring

- ✅ **Docker Health Checks**
  - Container health monitoring
  - Auto-restart on failure
  - Health check script

---

### 3.3.9 Security Features

**Fitur:**
- ✅ **Authentication**
  - JWT tokens
  - HttpOnly cookies
  - Token expiration
  - Secure sessions

- ✅ **Authorization**
  - Role-based access
  - Protected routes
  - API route protection
  - Middleware guards

- ✅ **Data Protection**
  - Input validation
  - SQL injection prevention
  - XSS protection
  - CSRF protection

- ✅ **Headers Security**
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - (configured in `next.config.mjs`)

---

## 3.4 Ringkasan Fitur

### 3.4.1 Public Website (7 Pages)

| # | Page | URL | Status |
|---|------|-----|--------|
| 1 | Homepage | `/` | ✅ Complete |
| 2 | About Us | `/about` | ✅ Complete |
| 3 | Collections | `/collections` | ✅ Complete |
| 4 | Collection Detail | `/collections/[slug]` | ✅ Complete |
| 5 | Stores | `/stores` | ✅ Complete |
| 6 | Instagram Feed | `/instagram` | ✅ Complete |
| 7 | Contact | `/contact` | ✅ Complete |

### 3.4.2 CMS Admin Panel (11+ Pages)

| # | Page | URL | Status |
|---|------|-----|--------|
| 1 | Login | `/cms/login` | ✅ Complete |
| 2 | Dashboard | `/cms/dashboard` | ✅ Complete |
| 3 | Hero Sections | `/cms/hero` | ✅ Complete |
| 4 | About Us | `/cms/about` | ✅ Complete |
| 5 | Company Values | `/cms/values` | ✅ Complete |
| 6 | Team/Founders | `/cms/founders` | ✅ Complete |
| 7 | Collections | `/cms/collections` | ✅ Complete |
| 8 | Stores | `/cms/stores` | ✅ Complete |
| 9 | Testimonials | `/cms/testimonials` | ✅ Complete |
| 10 | Messages | `/cms/messages` | ✅ Complete |
| 11 | Settings | `/cms/settings` | ✅ Complete |
| 12 | Users | `/cms/users` | ✅ Complete |

### 3.4.3 API Endpoints (40+ Endpoints)

**Categories:**
- Authentication (2)
- Hero Sections (3)
- About (2)
- Company Values (4)
- Founders (4)
- Collections (4)
- Images (4)
- Stores (4)
- Testimonials (4)
- Messages (3)
- Settings (6)
- Users (4)

**Total:** ~44 API endpoints

---

**📌 Catatan:**
Sistem ini adalah **full-featured CMS** dengan complete CRUD operations untuk semua entities, authentication system, dan modern UX/UI.
