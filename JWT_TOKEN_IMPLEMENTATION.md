# 🔐 JWT Token Implementation - BRODO CMS

**Dokumentasi Lengkap Implementasi JWT Authentication**

---

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Apa itu JWT?](#apa-itu-jwt)
3. [Implementasi JWT di Project](#implementasi-jwt-di-project)
4. [File-File Penting](#file-file-penting)
5. [Cara Kerja JWT di Aplikasi](#cara-kerja-jwt-di-aplikasi)
6. [Cara Cek JWT di Website](#cara-cek-jwt-di-website)
7. [Fungsi JWT dalam Aplikasi](#fungsi-jwt-dalam-aplikasi)
8. [Security Best Practices](#security-best-practices)

---

## 🎯 Overview

Project BRODO menggunakan **NextAuth.js v5** dengan strategi **JWT (JSON Web Token)** untuk autentikasi CMS. JWT digunakan untuk:

- ✅ Login admin/editor CMS
- ✅ Proteksi API routes
- ✅ Session management
- ✅ Role-based access control

### Tech Stack:
- **NextAuth.js v5** - Authentication framework
- **JWT Strategy** - Token-based authentication
- **HTTP-only Cookies** - Secure token storage
- **Role-based Access** - Admin & Editor roles

---

## 📘 Apa itu JWT?

### Definisi:
**JWT (JSON Web Token)** adalah standar terbuka (RFC 7519) untuk transmisi informasi secara aman antara pihak-pihak sebagai objek JSON.

### Struktur JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

JWT terdiri dari 3 bagian yang dipisahkan oleh titik (`.`):

```
[HEADER].[PAYLOAD].[SIGNATURE]
```

#### 1. Header (Red):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload (Purple):
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@brodo.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

#### 3. Signature (Blue):
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Keuntungan JWT:
- ✅ **Stateless** - Server tidak perlu menyimpan session
- ✅ **Scalable** - Mudah di-scale horizontal
- ✅ **Secure** - Signed dengan secret key
- ✅ **Self-contained** - Semua info ada di token
- ✅ **Cross-domain** - Bisa digunakan di multi domain

---

## 🛠️ Implementasi JWT di Project

### Arsitektur Overview:

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                             │
│                                                             │
│  1. User Login → POST /api/auth/callback/credentials       │
│  2. Receive JWT in HTTP-only Cookie                        │
│  3. Auto-attach cookie to every request                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE                             │
│                   (middleware.ts)                           │
│                                                             │
│  • Check if route is protected                             │
│  • Bypass NextAuth routes (/api/auth/*)                   │
│  • Bypass CMS API routes (handle auth internally)         │
│  • Allow CMS routes to use NextAuth                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     AUTH LIBRARY                            │
│                    (libs/auth.ts)                           │
│                                                             │
│  • NextAuth Configuration                                  │
│  • JWT Strategy (30 days expiry)                          │
│  • Credentials Provider                                    │
│  • JWT & Session Callbacks                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API PROTECTION                           │
│                (utils/auth-server.ts)                       │
│                                                             │
│  • requireAuth() - Check if logged in                      │
│  • requireAdminAuth() - Check role (admin/editor)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTES                             │
│                 (app/api/cms/*)                             │
│                                                             │
│  • Protected CMS endpoints                                 │
│  • CRUD operations (Hero, Products, etc.)                 │
│  • Auto return 401/403 if unauthorized                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File-File Penting

### 1. **NextAuth Configuration** (`src/libs/auth.ts`)

**Lokasi:** `src/libs/auth.ts`

**Fungsi:** Konfigurasi utama NextAuth dengan JWT strategy

```tsx
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/libs/DB';
import { cmsUser } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/utils/auth';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@brodo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        try {
          // 1️⃣ Find user by email
          const users = await db
            .select()
            .from(cmsUser)
            .where(eq(cmsUser.email, email))
            .limit(1);

          const user = users[0];

          if (!user) {
            return null; // User not found
          }

          // 2️⃣ Check if user is active
          if (!user.isActive) {
            return null; // User disabled
          }

          // 3️⃣ Verify password (bcrypt)
          const isPasswordValid = await verifyPassword(
            password,
            user.passwordHash,
          );

          if (!isPasswordValid) {
            return null; // Wrong password
          }

          // 4️⃣ Update last login
          await db
            .update(cmsUser)
            .set({ lastLogin: new Date() })
            .where(eq(cmsUser.id, user.id));

          // 5️⃣ Return user object (will be stored in JWT)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            role: user.role || 'editor',
          };
        }
        catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/en/cms/login', // Custom login page
    error: '/en/cms/login',
  },
  session: {
    strategy: 'jwt', // ✅ JWT Strategy
    maxAge: 30 * 24 * 60 * 60, // ✅ 30 days expiry
  },
  callbacks: {
    // 🔑 JWT Callback - Add user info to token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    
    // 👤 Session Callback - Add token info to session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    
    // 🔀 Redirect Callback - Handle post-login redirect
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/en/cms/dashboard`; // Default redirect
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Secret key for signing
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export { authConfig as authOptions };
```

**Key Points:**
- ✅ JWT Strategy dengan expiry 30 hari
- ✅ Custom authorize logic (check DB, verify password)
- ✅ JWT callback menambahkan `id` dan `role` ke token
- ✅ Session callback menambahkan info dari token ke session
- ✅ Signed dengan `NEXTAUTH_SECRET` dari environment

---

### 2. **API Route Handler** (`src/app/api/auth/[...nextauth]/route.ts`)

**Lokasi:** `src/app/api/auth/[...nextauth]/route.ts`

**Fungsi:** Expose NextAuth handlers sebagai API routes

```tsx
import { handlers } from '@/libs/auth';

// NextAuth handlers untuk GET & POST requests
export const { GET, POST } = handlers;
```

**Endpoints yang ter-generate:**
- `POST /api/auth/callback/credentials` - Login endpoint
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout endpoint
- `GET /api/auth/csrf` - CSRF token
- `GET /api/auth/providers` - Available providers

---

### 3. **Auth Utilities** (`src/utils/auth-server.ts`)

**Lokasi:** `src/utils/auth-server.ts`

**Fungsi:** Helper functions untuk protect API routes

```tsx
import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

// 🔒 Require Authentication (any logged-in user)
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 } // 401 Unauthorized
    );
  }
  
  return session;
}

// 🔐 Require Admin/Editor Role
export async function requireAdminAuth() {
  const session = await auth();
  
  if (!session?.user) {
    console.log('No session found in requireAdminAuth');
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 } // 401 Unauthorized
    );
  }
  
  const userRole = (session.user as any).role;
  console.log('Session found:', { userId: session.user.id, role: userRole });
  
  // Check if role is admin or editor
  if (userRole !== 'admin' && userRole !== 'editor') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 } // 403 Forbidden
    );
  }
  
  return session;
}
```

**Usage di API Routes:**

```tsx
// Example: src/app/api/cms/hero/route.ts
import { requireAdminAuth } from '@/utils/auth-server';
import { NextResponse } from 'next/server';

export async function GET() {
  // ✅ Check authentication & role
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) {
    return authResult; // Return 401/403 error
  }

  // User is authenticated and has admin/editor role
  const session = authResult;
  
  // ... proceed with API logic
  return NextResponse.json({ success: true, data: [] });
}
```

---

### 4. **Login Page** (`src/app/[locale]/(admin)/cms/login/page.tsx`)

**Lokasi:** `src/app/[locale]/(admin)/cms/login/page.tsx`

**Fungsi:** UI untuk login CMS

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🔑 Call NextAuth signIn
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, // Handle redirect manually
        callbackUrl: '/en/cms/dashboard',
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // ✅ Success! JWT stored in HTTP-only cookie
        router.push('/en/cms/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="admin@brodo.com"
          required
        />
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
```

---

### 5. **Client-Side Auth Guard** (`src/components/cms/AuthGuard.tsx`)

**Lokasi:** `src/components/cms/AuthGuard.tsx`

**Fungsi:** Protect CMS pages di client-side

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname.includes('/cms/login')) {
      setIsLoading(false);
      return;
    }

    if (status === 'loading') {
      return; // Still loading session
    }

    if (status === 'unauthenticated' || !session) {
      // ❌ Not authenticated, redirect to login
      const currentPath = pathname;
      const loginUrl = `/cms/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
      return;
    }

    if (status === 'authenticated' && session) {
      // ✅ Authenticated, allow access
      setIsLoading(false);
      return;
    }
  }, [session, status, router, pathname]);

  // Show loading spinner while checking auth
  if (isLoading || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  // If authenticated, show protected content
  if (session) {
    return <>{children}</>;
  }

  return null;
}
```

---

### 6. **Middleware** (`src/middleware.ts`)

**Lokasi:** `src/middleware.ts`

**Fungsi:** Route protection di edge (server-side)

```tsx
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createRouteMatcher } from '@clerk/nextjs/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
});

// NextAuth API routes - must bypass all middleware
const isNextAuthRoute = createRouteMatcher([
  '/api/auth(.*)', // ✅ Allow NextAuth to handle
]);

// CMS routes (use NextAuth instead of Clerk)
const isCmsRoute = createRouteMatcher([
  '/cms(.*)',
  '/:locale/cms(.*)',
]);

// CMS API routes (let them handle auth internally)
const isCmsApiRoute = createRouteMatcher([
  '/api/cms(.*)', // ✅ Protected by requireAdminAuth()
]);

export default function middleware(request: NextRequest) {
  // 1. Allow NextAuth API routes to bypass ALL middleware
  if (isNextAuthRoute(request)) {
    return NextResponse.next();
  }

  // 2. Allow CMS API routes to bypass middleware (they handle auth internally)
  if (isCmsApiRoute(request)) {
    return NextResponse.next();
  }

  // 3. Allow CMS routes to bypass Clerk middleware - use NextAuth instead
  if (isCmsRoute(request)) {
    return intlMiddleware(request);
  }

  // ... other routes use Clerk
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
```

---

## ⚙️ Cara Kerja JWT di Aplikasi

### Flow Lengkap:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

1. User membuka: http://localhost:3000/en/cms/login
   
2. User mengisi form:
   • Email: admin@brodo.com
   • Password: admin123
   
3. User klik "Sign In"
   ↓
4. Browser kirim POST ke: /api/auth/callback/credentials
   Body: { email: "admin@brodo.com", password: "admin123" }
   ↓
5. NextAuth memproses di libs/auth.ts:
   • Query database untuk cari user by email
   • Verify password dengan bcrypt
   • Check if user.isActive === true
   • Update lastLogin timestamp
   ↓
6. NextAuth generate JWT token:
   {
     "id": "1",
     "email": "admin@brodo.com",
     "name": "Admin User",
     "role": "admin",
     "iat": 1234567890,
     "exp": 1237159890  // 30 days later
   }
   ↓
7. NextAuth set HTTP-only cookie:
   Set-Cookie: next-auth.session-token=eyJhbGci...; HttpOnly; Secure; SameSite=Lax
   ↓
8. Browser store cookie automatically
   ↓
9. Redirect to: /en/cms/dashboard
   ✅ User logged in!

┌─────────────────────────────────────────────────────────────────────┐
│                     API REQUEST FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

1. Browser request: GET /api/cms/hero
   Headers:
   • Cookie: next-auth.session-token=eyJhbGci...
   (Auto-attached by browser!)
   ↓
2. Middleware allows request (isCmsApiRoute)
   ↓
3. API route handler runs:
   const authResult = await requireAdminAuth();
   ↓
4. requireAdminAuth() checks:
   • Decode JWT from cookie
   • Verify signature with NEXTAUTH_SECRET
   • Check expiry (exp)
   • Check role (admin or editor)
   ↓
5a. IF valid:
    • Return session object
    • Continue with API logic
    • Return 200 OK with data
    
5b. IF invalid:
    • Return 401 Unauthorized (not logged in)
    • OR 403 Forbidden (wrong role)
   ↓
6. Browser receives response

┌─────────────────────────────────────────────────────────────────────┐
│                       LOGOUT FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

1. User klik "Sign Out"
   ↓
2. Call: signOut({ callbackUrl: '/en/cms/login' })
   ↓
3. NextAuth clear cookie:
   Set-Cookie: next-auth.session-token=; Max-Age=0
   ↓
4. Browser deletes cookie
   ↓
5. Redirect to login page
   ✅ User logged out!
```

---

## 🔍 Cara Cek JWT di Website

### Method 1: Chrome DevTools - Application Tab

**Step-by-step:**

1. **Buka website:**
   ```
   http://localhost:3000/en/cms/login
   ```

2. **Login dengan credentials:**
   - Email: `admin@brodo.com`
   - Password: `admin123` (atau password yang ada di database)

3. **Buka Chrome DevTools:**
   - Tekan `F12` atau `Ctrl+Shift+I` (Windows)
   - Atau `Cmd+Option+I` (Mac)

4. **Ke tab "Application":**
   ```
   DevTools → Application (tab paling kanan)
   ```

5. **Expand "Cookies" di sidebar:**
   ```
   Application
   ├── Storage
   │   ├── Cookies
   │   │   └── http://localhost:3000  ← Klik ini
   ```

6. **Lihat JWT Cookie:**
   ```
   Name: next-auth.session-token
   Value: eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0...(very long string)
   Domain: localhost
   Path: /
   Expires: 30 days from now
   Size: ~500-1000 bytes
   HttpOnly: ✅ Yes
   Secure: ✅ Yes (production)
   SameSite: Lax
   ```

**Screenshot placeholders:**
```
┌──────────────────────────────────────────────────────┐
│ Chrome DevTools - Application Tab                   │
├──────────────────────────────────────────────────────┤
│ Application   Console   Sources   Network   >>      │
├──────────────────────────────────────────────────────┤
│ ◢ Application                                        │
│   ◢ Storage                                          │
│     ◢ Cookies                                        │
│       ▼ http://localhost:3000                        │
│                                                      │
│ Name                    Value                Domain  │
│ ─────────────────────────────────────────────────── │
│ next-auth.session-token eyJhbGciOiJkaXI...  localhost│
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Method 2: Chrome DevTools - Network Tab

**Step-by-step:**

1. **Buka DevTools → Network tab:**
   ```
   F12 → Network
   ```

2. **Login dan watch requests:**
   - Saat login, akan ada request ke `/api/auth/callback/credentials`

3. **Inspect Login Request:**
   ```
   Network → callback/credentials → Preview
   ```
   
   Response:
   ```json
   {
     "url": "http://localhost:3000/en/cms/dashboard"
   }
   ```

4. **Inspect Response Headers:**
   ```
   Network → callback/credentials → Headers → Response Headers
   ```
   
   Lihat:
   ```
   Set-Cookie: next-auth.session-token=eyJhbGci...; Path=/; HttpOnly; Secure; SameSite=Lax
   ```

5. **Inspect API Request dengan JWT:**
   - Buka dashboard CMS
   - Watch request ke `/api/cms/hero` (atau endpoint lain)
   
   ```
   Network → hero → Headers → Request Headers
   ```
   
   Lihat cookie auto-attached:
   ```
   Cookie: next-auth.session-token=eyJhbGci...
   ```

**Screenshot placeholders:**
```
┌──────────────────────────────────────────────────────┐
│ Chrome DevTools - Network Tab                       │
├──────────────────────────────────────────────────────┤
│ Network   Console   Sources   >>                    │
├──────────────────────────────────────────────────────┤
│ Name              Status  Type    Size    Time      │
│ ─────────────────────────────────────────────────── │
│ callback/credentials 200   xhr     245B    156ms   │
│ ↳ Request Headers                                   │
│   Content-Type: application/json                    │
│                                                      │
│ ↳ Response Headers                                  │
│   Set-Cookie: next-auth.session-token=eyJhbGci...  │
│   ─────────────────────────────────────────────────│
│ hero              200   xhr     1.2kB   45ms       │
│ ↳ Request Headers                                   │
│   Cookie: next-auth.session-token=eyJhbGci...      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Method 3: Decode JWT Token (Manual)

**Step-by-step:**

1. **Copy JWT token dari cookie:**
   - DevTools → Application → Cookies
   - Klik `next-auth.session-token`
   - Copy value (long string)

2. **Buka JWT Decoder:**
   - Website: https://jwt.io/
   - Atau install browser extension: "JWT Debugger"

3. **Paste token di "Encoded" section:**
   ```
   Paste: eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0...
   ```

4. **Lihat Decoded payload:**
   ```json
   {
     "name": "Admin User",
     "email": "admin@brodo.com",
     "sub": "1",
     "id": "1",
     "role": "admin",
     "iat": 1234567890,
     "exp": 1237159890,
     "jti": "abc123"
   }
   ```

**⚠️ CATATAN:**
NextAuth v5 menggunakan **encrypted JWT (JWE)**, bukan plain JWT. Token di-encrypt dengan `NEXTAUTH_SECRET`, jadi tidak bisa di-decode di jwt.io tanpa secret key.

---

### Method 4: Console Inspection (Session)

**Step-by-step:**

1. **Buka Console:**
   ```
   F12 → Console
   ```

2. **Get session di client:**
   ```javascript
   // Di CMS pages (yang pakai SessionProvider)
   import { useSession } from 'next-auth/react';
   
   const { data: session } = useSession();
   console.log('Session:', session);
   ```

   Output:
   ```javascript
   {
     user: {
       id: "1",
       name: "Admin User",
       email: "admin@brodo.com",
       role: "admin"
     },
     expires: "2025-02-11T12:34:56.789Z"
   }
   ```

3. **Get session di server:**
   ```typescript
   import { auth } from '@/libs/auth';
   
   const session = await auth();
   console.log('Server session:', session);
   ```

---

### Method 5: API Testing dengan Postman/Thunder Client

**Setup:**

1. **Login dulu via browser** untuk get cookie

2. **Copy cookie dari DevTools:**
   ```
   next-auth.session-token=eyJhbGci...
   ```

3. **Test API dengan Postman:**

   **Request:**
   ```
   GET http://localhost:3000/api/cms/hero
   
   Headers:
   Cookie: next-auth.session-token=eyJhbGci...
   ```

   **Response (✅ Authenticated):**
   ```json
   {
     "success": true,
     "data": [
       {
         "id": 1,
         "title": "Welcome to BRODO",
         "description": "Crafted leather goods"
       }
     ]
   }
   ```

   **Response (❌ No cookie):**
   ```json
   {
     "success": false,
     "error": "Authentication required"
   }
   ```
   Status: 401 Unauthorized

   **Response (❌ Wrong role):**
   ```json
   {
     "success": false,
     "error": "Admin access required"
   }
   ```
   Status: 403 Forbidden

---

## 🎯 Fungsi JWT dalam Aplikasi

### 1. **Authentication (Autentikasi)**

**Fungsi:** Memverifikasi identitas user

**Implementasi:**
```tsx
// User login → JWT generated → Stored in cookie
const result = await signIn('credentials', {
  email: 'admin@brodo.com',
  password: 'admin123'
});

// ✅ JWT contains user identity:
{
  "id": "1",
  "email": "admin@brodo.com",
  "name": "Admin User"
}
```

**Keuntungan:**
- ✅ Tidak perlu query database setiap request
- ✅ Stateless (server tidak store session)
- ✅ Fast verification (just verify signature)

---

### 2. **Authorization (Otorisasi)**

**Fungsi:** Menentukan apa yang boleh dilakukan user

**Implementasi:**
```tsx
// JWT contains role
{
  "role": "admin" // or "editor"
}

// Check role di API:
const session = await requireAdminAuth();
const userRole = session.user.role;

if (userRole !== 'admin') {
  return 403; // Forbidden
}

// ✅ Admin can create/edit/delete
// ✅ Editor can only edit
```

**Role Matrix:**

| Action | Admin | Editor | Public |
|--------|-------|--------|--------|
| View CMS Dashboard | ✅ | ✅ | ❌ |
| Create Hero Section | ✅ | ✅ | ❌ |
| Edit Products | ✅ | ✅ | ❌ |
| Delete Content | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Company Profile | ✅ | ✅ | ✅ |

---

### 3. **Session Management**

**Fungsi:** Menjaga user tetap logged in

**Implementasi:**
```tsx
// JWT expiry: 30 days
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 2,592,000 seconds
}

// Auto-refresh jika expired
// NextAuth handle automatically
```

**Timeline:**
```
Day 0:  Login → JWT created (exp: Day 30)
Day 1:  Still valid ✅
Day 15: Still valid ✅
Day 29: Still valid ✅
Day 30: Expired ❌ → Redirect to login
```

---

### 4. **API Protection**

**Fungsi:** Melindungi sensitive endpoints

**Protected Endpoints:**
```
✅ Protected (require JWT):
├── GET    /api/cms/hero
├── POST   /api/cms/hero
├── PUT    /api/cms/hero/[id]
├── DELETE /api/cms/hero/[id]
├── GET    /api/cms/products
├── POST   /api/cms/products
├── ...    (all /api/cms/* routes)

❌ Public (no JWT needed):
├── GET    /api/public/hero
├── GET    /api/public/products
├── POST   /api/contact
└── GET    /company-profile
```

**Implementation:**
```tsx
// Every protected API route:
export async function POST(request: NextRequest) {
  // 🔒 Check JWT first
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) {
    return authResult; // 401 or 403
  }

  // ✅ Authenticated - proceed
  const body = await request.json();
  // ... API logic
}
```

---

### 5. **Security**

**Fungsi:** Mencegah unauthorized access & attacks

**Security Features:**

#### a. HTTP-only Cookie
```
Set-Cookie: next-auth.session-token=...; HttpOnly
```
- ✅ JavaScript tidak bisa akses cookie
- ✅ Protected from XSS attacks

#### b. Secure Flag (Production)
```
Set-Cookie: ...; Secure
```
- ✅ Only sent over HTTPS
- ✅ Protected from MITM attacks

#### c. SameSite
```
Set-Cookie: ...; SameSite=Lax
```
- ✅ Protected from CSRF attacks

#### d. Signature Verification
```typescript
// Every request, NextAuth verifies:
const isValid = verifyJWT(token, process.env.NEXTAUTH_SECRET);
if (!isValid) {
  return 401; // Tampered token
}
```

#### e. Expiry Check
```typescript
// Auto-check expiry
if (Date.now() > token.exp * 1000) {
  return 401; // Expired token
}
```

---

### 6. **Audit Trail**

**Fungsi:** Track user activities

**Implementation:**
```tsx
// When login, update lastLogin
await db
  .update(cmsUser)
  .set({ lastLogin: new Date() })
  .where(eq(cmsUser.id, user.id));

// In API, log actions
console.log('User action:', {
  userId: session.user.id,
  email: session.user.email,
  role: session.user.role,
  action: 'DELETE_HERO',
  timestamp: new Date(),
});
```

**Benefits:**
- ✅ Know who did what
- ✅ Security auditing
- ✅ Debugging user issues

---

## 🔐 Security Best Practices

### ✅ Do's:

1. **Use strong NEXTAUTH_SECRET:**
   ```bash
   # Generate dengan:
   openssl rand -base64 32
   
   # .env.local
   NEXTAUTH_SECRET=your-very-long-random-secret-here
   ```

2. **Enable HTTPS in production:**
   ```typescript
   // NextAuth auto-enable Secure flag di production
   cookies: {
     sessionToken: {
       name: `next-auth.session-token`,
       options: {
         httpOnly: true,
         sameSite: 'lax',
         path: '/',
         secure: process.env.NODE_ENV === 'production', // ✅
       },
     },
   }
   ```

3. **Validate inputs:**
   ```typescript
   // Use Zod for validation
   const validationResult = heroSectionSchema.safeParse(body);
   if (!validationResult.success) {
     return 400; // Bad Request
   }
   ```

4. **Hash passwords:**
   ```typescript
   import bcrypt from 'bcryptjs';
   
   // On register:
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // On login:
   const isValid = await bcrypt.compare(password, user.passwordHash);
   ```

5. **Rate limit login attempts:**
   ```typescript
   // TODO: Implement rate limiting
   // Max 5 failed attempts per 15 minutes
   ```

---

### ❌ Don'ts:

1. **NEVER store JWT in localStorage:**
   ```javascript
   // ❌ BAD - Vulnerable to XSS
   localStorage.setItem('token', jwt);
   
   // ✅ GOOD - Use HTTP-only cookie (default di NextAuth)
   ```

2. **NEVER expose NEXTAUTH_SECRET:**
   ```typescript
   // ❌ BAD
   const secret = 'my-secret-123';
   
   // ✅ GOOD
   const secret = process.env.NEXTAUTH_SECRET;
   ```

3. **NEVER send JWT in URL:**
   ```
   // ❌ BAD
   GET /api/cms/hero?token=eyJhbGci...
   
   // ✅ GOOD - In cookie (automatic)
   GET /api/cms/hero
   Cookie: next-auth.session-token=eyJhbGci...
   ```

4. **NEVER trust client data:**
   ```typescript
   // ❌ BAD
   const userId = request.body.userId; // User can fake this!
   
   // ✅ GOOD
   const session = await auth();
   const userId = session.user.id; // From verified JWT
   ```

5. **NEVER log JWT tokens:**
   ```typescript
   // ❌ BAD
   console.log('Token:', token);
   
   // ✅ GOOD
   console.log('User logged in:', session.user.email);
   ```

---

## 📊 JWT vs Session Comparison

| Feature | JWT (Project ini) | Traditional Session |
|---------|-------------------|---------------------|
| **Storage** | Cookie (encrypted) | Server memory/Redis |
| **Stateless** | ✅ Yes | ❌ No (server stores) |
| **Scalability** | ✅ Excellent | ⚠️ Need sticky sessions |
| **Speed** | ✅ Fast (no DB query) | ⚠️ Slower (DB lookup) |
| **Security** | ✅ Signed & encrypted | ✅ Server-controlled |
| **Logout** | ⚠️ Can't revoke until expiry | ✅ Instant revoke |
| **Size** | ⚠️ ~500-1000 bytes | ✅ Small session ID |
| **Use Case** | ✅ Microservices, APIs | ✅ Monolithic apps |

---

## 🧪 Testing JWT

### Test 1: Login Success

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
http://localhost:3000/en/cms/login

# 3. Login
Email: admin@brodo.com
Password: admin123

# 4. Check cookie di DevTools
Application → Cookies → next-auth.session-token

# ✅ Expected: Cookie exists with long token
```

---

### Test 2: API with Valid JWT

```bash
# 1. Login via browser (get cookie)

# 2. Copy cookie from DevTools

# 3. Test API with Postman
GET http://localhost:3000/api/cms/hero
Cookie: next-auth.session-token=YOUR_COOKIE_HERE

# ✅ Expected: 200 OK with data
```

---

### Test 3: API without JWT

```bash
# Test API without cookie
GET http://localhost:3000/api/cms/hero
# (no Cookie header)

# ✅ Expected: 401 Unauthorized
{
  "success": false,
  "error": "Authentication required"
}
```

---

### Test 4: Wrong Role

```bash
# Login as editor (bukan admin)
# Try to delete content (admin-only action)

DELETE http://localhost:3000/api/cms/hero/1

# ✅ Expected: 403 Forbidden (if implemented)
{
  "success": false,
  "error": "Admin access required"
}
```

---

### Test 5: Logout

```bash
# 1. Login via browser

# 2. Click "Sign Out" di dashboard

# 3. Check cookie di DevTools
Application → Cookies

# ✅ Expected: next-auth.session-token deleted or expired

# 4. Try to access dashboard
http://localhost:3000/en/cms/dashboard

# ✅ Expected: Redirect to /cms/login
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Authentication required" meskipun sudah login

**Cause:** Cookie tidak ter-set atau sudah expired

**Solution:**
```bash
# 1. Clear cookies
DevTools → Application → Cookies → Right-click → Clear

# 2. Check NEXTAUTH_SECRET di .env.local
cat .env.local | grep NEXTAUTH_SECRET

# 3. Re-login

# 4. Verify cookie exists
DevTools → Application → Cookies → next-auth.session-token
```

---

### Issue 2: JWT expired terlalu cepat

**Cause:** MaxAge terlalu pendek

**Solution:**
```typescript
// src/libs/auth.ts
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // ✅ 30 days (check ini)
}
```

---

### Issue 3: CORS error saat hit API

**Cause:** NextAuth cookie not sent cross-origin

**Solution:**
```typescript
// Use credentials for cross-origin
fetch('/api/cms/hero', {
  credentials: 'include', // ✅ Send cookies
});
```

---

### Issue 4: "NEXTAUTH_SECRET" missing

**Cause:** Environment variable tidak diload

**Solution:**
```bash
# 1. Create .env.local
touch .env.local

# 2. Add secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local

# 3. Restart dev server
npm run dev
```

---

## 📚 Resources

### Documentation:
- [NextAuth.js v5 Docs](https://authjs.dev/getting-started)
- [JWT.io](https://jwt.io/) - JWT Debugger
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT Specification

### Tools:
- [JWT Debugger Chrome Extension](https://chrome.google.com/webstore/detail/jwt-debugger)
- [Postman](https://www.postman.com/) - API Testing
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension

### Security:
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [JWT Best Practices](https://curity.io/resources/learn/jwt-best-practices/)

---

## ✅ Summary

### What is JWT?
**JSON Web Token** - Token berbasis JSON untuk autentikasi & authorization

### Where is it implemented?
- `src/libs/auth.ts` - NextAuth config dengan JWT strategy
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `src/utils/auth-server.ts` - Helper untuk protect API routes
- `src/middleware.ts` - Route protection di edge
- `src/components/cms/AuthGuard.tsx` - Client-side protection

### How to check JWT?
1. **DevTools → Application → Cookies** - Lihat `next-auth.session-token`
2. **DevTools → Network** - Lihat request/response headers
3. **jwt.io** - Decode token (jika tidak encrypted)
4. **Console** - `console.log(session)`
5. **Postman** - Test API dengan cookie

### What is it used for?
1. ✅ **Authentication** - Verify user identity
2. ✅ **Authorization** - Check user role (admin/editor)
3. ✅ **Session Management** - Keep user logged in (30 days)
4. ✅ **API Protection** - Secure CMS endpoints
5. ✅ **Security** - Prevent unauthorized access
6. ✅ **Audit Trail** - Track user actions

---

**🎉 JWT Implementation Complete!**

**Dokumentasi ini menjelaskan:**
- ✅ Apa itu JWT
- ✅ Di mana diimplementasikan (dengan code snippets)
- ✅ Cara cek di website (5 methods)
- ✅ Fungsi JWT dalam aplikasi
- ✅ Security best practices

---

**📝 Made for Pertemuan 13 - BRODO CMS Project**  
**🔐 JWT-based Authentication dengan NextAuth.js v5**

