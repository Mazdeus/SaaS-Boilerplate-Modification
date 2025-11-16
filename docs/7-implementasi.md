# BAB VII - IMPLEMENTASI SISTEM

## 7.1 Implementasi Database

### 7.1.1 Database Schema Design

**Total Tables:** 14 tables

**Schema Categories:**

```
1. Authentication & Users
   └── cms_users

2. Homepage Content
   └── hero_sections

3. About Page Content
   ├── about_section
   ├── company_values
   └── founders

4. Collections & Images
   ├── collections
   ├── images
   └── collection_images (junction table)

5. Store Locations
   └── stores

6. Customer Feedback
   └── testimonials

7. Contact & Communication
   └── contact_messages

8. Global Settings
   ├── company_info
   ├── social_media
   └── seo_settings
```

---

### 7.1.2 Table Schemas (Detailed)

#### **1. cms_users - User Authentication**

```typescript
// src/db/schema/cms-users.ts
import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const cmsUsers = pgTable('cms_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull().default('editor'),
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

**Purpose:** Store CMS user accounts dengan authentication credentials
**Key Fields:**
- `passwordHash` - bcrypt hashed password
- `role` - admin, editor, super_admin
- `isActive` - untuk soft delete/deactivation

---

#### **2. hero_sections - Homepage Hero Carousel**

```typescript
// src/db/schema/hero-sections.ts
export const heroSections = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  description: text('description'),
  buttonText: varchar('button_text', { length: 100 }),
  buttonLink: text('button_link'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

**Purpose:** Hero carousel slides di homepage
**Features:**
- Display order untuk sorting
- Active/inactive toggle
- CTA button configuration

---

#### **3. collections - Product Collections**

```typescript
// src/db/schema/collections.ts
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  featuredImageUrl: text('featured_image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

**Purpose:** Product collections dengan multiple images
**Relationship:** One-to-many dengan `collection_images`

---

#### **4. images - Image Library**

```typescript
// src/db/schema/images.ts
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  caption: text('caption'),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
```

**Purpose:** Central image repository
**Usage:** Referenced by collection_images junction table

---

#### **5. collection_images - Junction Table**

```typescript
// src/db/schema/collection-images.ts
export const collectionImages = pgTable('collection_images', {
  id: serial('id').primaryKey(),
  collectionId: integer('collection_id').notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
  imageId: integer('image_id').notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

**Purpose:** Many-to-many relationship antara collections dan images
**Features:**
- Cascade delete (when collection or image deleted)
- Display order per collection

---

### 7.1.3 Database Migrations

**Migration Tool:** Drizzle Kit

**Migration Process:**
```bash
# 1. Generate migration
npm run db:generate

# 2. Apply migration
npm run db:push

# Or migrate to production
npm run db:migrate
```

**Migration Files:**
```
drizzle/
├── 0000_shocking_leader.sql       # Initial schema
├── 0001_funny_silk_fever.sql      # Add company values
├── 0002_same_jack_power.sql       # Update images nullable
├── 0003_noisy_justin_hammer.sql   # Add collection images
└── meta/
    ├── _journal.json               # Migration history
    └── 0000_snapshot.json          # Schema snapshots
```

**Migration Example (0000_shocking_leader.sql):**
```sql
CREATE TABLE IF NOT EXISTS "cms_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" varchar(255),
	"role" varchar(50) DEFAULT 'editor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cms_users_username_unique" UNIQUE("username"),
	CONSTRAINT "cms_users_email_unique" UNIQUE("email")
);

-- More table creations...
```

---

### 7.1.4 Database Seeding

**Seed Script:** `scripts/seed-new.ts`

**Seeding Process:**
```bash
npm run db:seed
```

**Seed Data Implementation:**

```typescript
import { db } from '@/db';
import { cmsUsers, heroSections, collections, /* ... */ } from '@/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create admin user
  console.log('Creating admin user...');
  const [adminUser] = await db.insert(cmsUsers).values({
    username: 'admin',
    email: 'admin@brodo.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    fullName: 'Admin Brodo',
    role: 'super_admin',
    isActive: true,
  }).returning();

  // 2. Seed hero sections
  console.log('Seeding hero sections...');
  await db.insert(heroSections).values([
    {
      imageUrl: '/assets/sneakers.webp',
      title: 'Discover Authentic Indonesian Footwear',
      subtitle: 'Premium Quality, Local Pride',
      description: 'Experience the perfect blend of tradition and modern design',
      buttonText: 'View Collections',
      buttonLink: '/collections',
      displayOrder: 1,
      isActive: true,
    },
    {
      imageUrl: '/assets/essentials.webp',
      title: 'Crafted with Care',
      subtitle: 'Every Pair Tells a Story',
      description: 'Handmade excellence meets contemporary style',
      buttonText: 'Learn More',
      buttonLink: '/about',
      displayOrder: 2,
      isActive: true,
    },
    {
      imageUrl: '/assets/sandals.webp',
      title: 'Sustainable Fashion',
      subtitle: 'Comfort Meets Responsibility',
      description: 'Eco-friendly materials, timeless design',
      buttonText: 'Explore',
      buttonLink: '/stores',
      displayOrder: 3,
      isActive: true,
    },
  ]);

  // 3. Seed collections
  console.log('Seeding collections...');
  const collectionsData = await db.insert(collections).values([
    {
      name: 'Sneakers',
      category: 'Footwear',
      slug: 'sneakers',
      shortDescription: 'Urban style meets comfort',
      fullDescription: 'Our sneaker collection combines contemporary design...',
      featuredImageUrl: '/assets/sneakers.webp',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Essentials',
      category: 'Footwear',
      slug: 'essentials',
      shortDescription: 'Everyday versatile footwear',
      fullDescription: 'The essentials collection features...',
      featuredImageUrl: '/assets/essentials.webp',
      displayOrder: 2,
      isActive: true,
    },
    // ... more collections
  ]).returning();

  // 4. Seed company values
  // 5. Seed founders
  // 6. Seed stores
  // 7. Seed testimonials
  // 8. Seed company info & settings

  console.log('✅ Database seeding completed!');
}

seed().catch(console.error);
```

**Seeded Data Summary:**
- ✅ 1 super admin user
- ✅ 3 hero sections
- ✅ 4 collections (Sneakers, Essentials, Sandals, Accessories)
- ✅ 6 company values
- ✅ 2 founders
- ✅ 5 stores
- ✅ 3 testimonials
- ✅ Company info, social media, SEO settings

---

## 7.2 Implementasi Backend

### 7.2.1 API Routes Structure

**RESTful Design Pattern:**

```
GET    /api/[resource]        - List all (with filters)
POST   /api/[resource]        - Create new
GET    /api/[resource]/[id]   - Get by ID
PATCH  /api/[resource]/[id]   - Update
DELETE /api/[resource]/[id]   - Delete
```

---

### 7.2.2 API Implementation Examples

#### **Example 1: Hero Sections API**

**File:** `src/app/api/hero-sections/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { heroSections } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { heroSectionSchema } from '@/lib/validations';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/hero-sections
export async function GET(request: NextRequest) {
  try {
    // Check if authenticated (CMS request)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let sections;
    if (isCMS) {
      // Return all (active + inactive)
      sections = await db.select().from(heroSections)
        .orderBy(heroSections.displayOrder, desc(heroSections.createdAt));
    } else {
      // Return only active
      sections = await db.select().from(heroSections)
        .where(eq(heroSections.isActive, true))
        .orderBy(heroSections.displayOrder);
    }

    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero sections' },
      { status: 500 }
    );
  }
}

// POST /api/hero-sections (Protected)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    const body = await request.json();
    
    // Validate with Zod
    const validation = heroSectionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 422 }
      );
    }

    // Insert to database
    const [newSection] = await db.insert(heroSections)
      .values(validation.data)
      .returning();

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create hero section' },
      { status: 500 }
    );
  }
}
```

**File:** `src/app/api/hero-sections/[id]/route.ts`

```typescript
// PATCH /api/hero-sections/[id] (Protected)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validation = heroSectionSchema.partial().safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 422 }
      );
    }

    const [updated] = await db.update(heroSections)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(heroSections.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}

// DELETE /api/hero-sections/[id] (Protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    const [deleted] = await db.delete(heroSections)
      .where(eq(heroSections.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete hero section' },
      { status: 500 }
    );
  }
}
```

---

#### **Example 2: Collections API with Images**

```typescript
// GET /api/collections
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let allCollections;
    if (isCMS) {
      allCollections = await db.select().from(collections)
        .orderBy(collections.displayOrder);
    } else {
      allCollections = await db.select().from(collections)
        .where(eq(collections.isActive, true))
        .orderBy(collections.displayOrder);
    }

    // Fetch images for each collection
    const collectionsWithImages = await Promise.all(
      allCollections.map(async (collection) => {
        const images = await db.select()
          .from(collectionImages)
          .where(eq(collectionImages.collectionId, collection.id))
          .orderBy(collectionImages.displayOrder);

        return { ...collection, images };
      })
    );

    return NextResponse.json(collectionsWithImages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
```

---

### 7.2.3 Authentication Implementation

**JWT Token Generation:**

```typescript
// src/lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '10m', // 10 minutes
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
```

**Middleware Protection:**

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /cms/* routes
  if (pathname.startsWith('/cms')) {
    // Allow login page
    if (pathname === '/cms/login') {
      return NextResponse.next();
    }

    // Check auth token
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/cms/:path*',
};
```

**Login API:**

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const [user] = await db.select().from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.fullName || user.username,
      role: user.role,
    });

    // Set HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 600, // 10 minutes
    });

    // Update last login
    await db.update(cmsUsers)
      .set({ lastLogin: new Date() })
      .where(eq(cmsUsers.id, user.id));

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

---

### 7.2.4 Validation Implementation

**Zod Schemas:**

```typescript
// src/lib/validations.ts
import { z } from 'zod';

export const heroSectionSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().min(1, 'Subtitle is required').max(255),
  description: z.string().optional(),
  buttonText: z.string().max(100).optional(),
  buttonLink: z.string().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  category: z.string().min(1, 'Category is required'),
  slug: z.string().min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  featuredImageUrl: z.string().url().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email').max(255),
  subject: z.string().min(1, 'Subject is required').max(500),
  message: z.string().min(1, 'Message is required').max(5000),
});
```

**Usage in API:**

```typescript
const validation = heroSectionSchema.safeParse(body);

if (!validation.success) {
  return NextResponse.json(
    { 
      error: 'Validation failed', 
      details: validation.error.errors 
    },
    { status: 422 }
  );
}

// Use validated data
const validData = validation.data;
```

---

## 7.3 Implementasi Frontend

### 7.3.1 Server Components (SSR)

**Homepage Implementation:**

```typescript
// src/app/page.tsx
import { db } from '@/db';
import { heroSections, collections, testimonials } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHeroSections() {
  return await db.select().from(heroSections)
    .where(eq(heroSections.isActive, true))
    .orderBy(heroSections.displayOrder);
}

async function getFeaturedCollections() {
  return await db.select().from(collections)
    .where(eq(collections.isActive, true))
    .orderBy(collections.displayOrder)
    .limit(3);
}

export default async function HomePage() {
  // Fetch data on server
  const heroSections = await getHeroSections();
  const featuredCollections = await getFeaturedCollections();
  const testimonialsList = await getTestimonials();

  return (
    <main>
      <HeroCarousel slides={heroSections} />
      
      <section className="about-preview">
        {/* About preview content */}
      </section>

      <section className="collections">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="testimonials">
        {/* Testimonials content */}
      </section>
    </main>
  );
}
```

---

### 7.3.2 Client Components (Interactive)

**Hero Carousel:**

```typescript
// src/components/HeroCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="hero-carousel relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-2xl mb-6">{slide.subtitle}</p>
              {slide.description && (
                <p className="text-lg mb-8">{slide.description}</p>
              )}
              {slide.buttonText && slide.buttonLink && (
                <Link href={slide.buttonLink} className="btn-primary">
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 btn-icon"
      >
        ←
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 btn-icon"
      >
        →
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### 7.3.3 CMS Form Implementation

**Collection Form (React Hook Form + Zod):**

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collectionSchema } from '@/lib/validations';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CollectionForm({ collection, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection || {
      displayOrder: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (collection) {
        // Update
        await axios.patch(`/api/collections/${collection.id}`, data);
        toast.success('Collection updated successfully');
      } else {
        // Create
        await axios.post('/api/collections', data);
        toast.success('Collection created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Collection Name *</label>
        <input
          type="text"
          {...register('name')}
          className="form-input"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label>Category *</label>
        <select {...register('category')} className="form-select">
          <option value="">Select category</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label>Short Description</label>
        <textarea {...register('shortDescription')} className="form-textarea" />
      </div>

      <div>
        <label>Full Description</label>
        <textarea 
          {...register('fullDescription')} 
          className="form-textarea"
          rows={5}
        />
      </div>

      <div>
        <label>Featured Image URL</label>
        <input
          type="url"
          {...register('featuredImageUrl')}
          className="form-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Display Order</label>
          <input
            type="number"
            {...register('displayOrder', { valueAsNumber: true })}
            className="form-input"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isActive')}
              className="form-checkbox"
            />
            Active
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : 'Save Collection'}
        </button>
      </div>
    </form>
  );
}
```

---

### 7.3.4 Data Table Component

```typescript
// src/components/cms/DataTable.tsx
'use client';

export default function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(row)}
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 7.4 Kesimpulan Implementasi

### 7.4.1 Implementation Stack Summary

**Database Layer:**
- ✅ 14 PostgreSQL tables
- ✅ Drizzle ORM with type safety
- ✅ Migration system
- ✅ Seeding scripts

**Backend Layer:**
- ✅ 40+ RESTful API endpoints
- ✅ JWT authentication
- ✅ Zod validation
- ✅ Role-based access control

**Frontend Layer:**
- ✅ Server-side rendering (SSR)
- ✅ Client components (interactive)
- ✅ React Hook Form integration
- ✅ Toast notifications
- ✅ Responsive design

### 7.4.2 Code Quality Metrics

- ✅ **Type Safety:** 100% TypeScript
- ✅ **Validation:** Zod schemas untuk semua inputs
- ✅ **Error Handling:** Comprehensive try-catch blocks
- ✅ **Security:** JWT + bcrypt + middleware protection
- ✅ **Performance:** Optimized queries, image lazy loading
- ✅ **Maintainability:** Modular structure, reusable components

---

**📌 Catatan:**
Implementasi mengikuti **best practices** dengan fokus pada type safety, security, performance, dan maintainability.
