# 🔐 Authentication Guide

## Overview

Aplikasi Brodo CMS menggunakan **Custom JWT (JSON Web Token)** authentication, **BUKAN NextAuth.js**.

## Technology Stack

- **Library**: `jsonwebtoken` package
- **Implementation**: Custom JWT di `src/lib/auth.ts`
- **Storage**: HTTP-only cookies
- **Secret**: `JWT_SECRET` environment variable

## Environment Variable

### JWT_SECRET

**Lokasi**: `.env` atau `.env.production`

```env
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
```

### Generate JWT_SECRET

**Menggunakan OpenSSL (Linux/Mac/Git Bash):**
```bash
openssl rand -base64 32
```

**Menggunakan Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Menggunakan PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Manual (minimum 32 characters):**
```
my-very-long-and-secure-jwt-secret-key-2024
```

## How It Works

### 1. User Login (`/api/auth/login`)

```typescript
// User credentials dikirim
POST /api/auth/login
{
  "email": "admin@brodo.com",
  "password": "password123"
}

// Server verifikasi dan generate JWT token
const token = generateToken({
  userId: user.id,
  email: user.email,
  name: user.name,
  role: user.role
});

// Token disimpan di HTTP-only cookie
response.cookies.set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 days
});
```

### 2. Protected Routes

Setiap request ke protected endpoint:

```typescript
// Token diambil dari cookies
const token = await getTokenFromCookies();

// Token diverifikasi
const user = verifyToken(token);

if (!user) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

// Request dilanjutkan dengan user data
```

### 3. User Logout (`/api/auth/logout`)

```typescript
// Cookie dihapus
response.cookies.delete('auth_token');
```

## File Structure

```
src/
├── lib/
│   └── auth.ts                    # JWT utilities
├── app/
    └── api/
        └── auth/
            ├── login/route.ts     # Login endpoint
            ├── logout/route.ts    # Logout endpoint
            ├── register/route.ts  # Register endpoint
            └── me/route.ts        # Get current user
```

## API Endpoints

### POST /api/auth/login
Login user dan generate JWT token

**Request:**
```json
{
  "email": "admin@brodo.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@brodo.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

### POST /api/auth/logout
Logout user (hapus cookie)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
Get current authenticated user

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@brodo.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

### POST /api/auth/register
Register new user (admin only)

**Request:**
```json
{
  "email": "newuser@brodo.com",
  "password": "password123",
  "name": "New User",
  "role": "editor"
}
```

## Security Features

✅ **HTTP-only cookies** - JavaScript tidak bisa akses token
✅ **Secure flag** - Token hanya dikirim via HTTPS di production
✅ **SameSite** - Protection dari CSRF attacks
✅ **Token expiration** - Token expire setelah 7 hari
✅ **Password hashing** - Menggunakan bcryptjs
✅ **Strong JWT_SECRET** - Minimum 32 characters

## Default Users

Setelah seeding database, user default:

```
Email: admin@brodo.com
Password: admin123
Role: admin
```

## Common Issues

### Issue: "Unauthorized" error
**Solution**: 
- Pastikan `JWT_SECRET` sama di semua environment
- Clear browser cookies
- Login ulang

### Issue: Token expired
**Solution**:
- Login ulang
- Token expire setelah 7 hari (bisa diubah di `src/lib/auth.ts`)

### Issue: CORS error di development
**Solution**:
- Pastikan frontend dan backend di domain/port yang sama
- Next.js menghandle ini otomatis

## Best Practices

1. **Jangan commit JWT_SECRET** ke Git
2. **Gunakan environment variables** untuk semua secrets
3. **Rotate JWT_SECRET** secara berkala (setiap 3-6 bulan)
4. **Monitor failed login attempts**
5. **Implement rate limiting** untuk login endpoint (future improvement)

## Migration dari NextAuth (if needed)

Jika Anda menemukan referensi ke NextAuth di dokumentasi lama:

❌ **SALAH:**
```env
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="..."
```

✅ **BENAR:**
```env
JWT_SECRET="..."
```

## Support

Untuk pertanyaan atau issues terkait authentication:
1. Check `src/lib/auth.ts` untuk implementation details
2. Check `src/app/api/auth/*/route.ts` untuk endpoint logic
3. Lihat console browser untuk error messages
