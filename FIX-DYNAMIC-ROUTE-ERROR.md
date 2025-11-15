# Fix: Dynamic Server Usage Error in Next.js API Routes

## Problem
During build, you might see errors like:
```
Error: Dynamic server usage: Route /api/... couldn't be rendered statically because it used `cookies`.
```

## Solution
Add `export const dynamic = 'force-dynamic';` to any API route that uses:
- `cookies()`
- `requireAuth()`
- `verifyAuth()`

## Quick Fix - Add This Line

In every `/src/app/api/**/route.ts` file that uses authentication or cookies, add this AFTER the imports and BEFORE the first export function:

```typescript
// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
```

## Example

### Before:
```typescript
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  await requireAuth();
  // ...
}
```

### After:
```typescript
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  await requireAuth();
  // ...
}
```

## Files That Need This

Based on the error logs, add `export const dynamic = 'force-dynamic';` to:

### Already Fixed ✅
- [x] `/api/auth/me/route.ts`
- [x] `/api/auth/login/route.ts`
- [x] `/api/cms-users/route.ts`

### Need to Fix 📝
Add to ALL route.ts files under `/api` that use authentication:

- [ ] `/api/about-section/route.ts`
- [ ] `/api/collections/route.ts`
- [ ] `/api/collections/[id]/route.ts`
- [ ] `/api/company-values/route.ts`
- [ ] `/api/company-values/[id]/route.ts`
- [ ] `/api/contact-messages/route.ts`
- [ ] `/api/contact-messages/[id]/route.ts`
- [ ] `/api/founders/route.ts`
- [ ] `/api/founders/[id]/route.ts`
- [ ] `/api/hero-sections/route.ts`
- [ ] `/api/hero-sections/[id]/route.ts`
- [ ] `/api/images/route.ts`
- [ ] `/api/images/[id]/route.ts`
- [ ] `/api/seo-settings/route.ts`
- [ ] `/api/social-media/route.ts`
- [ ] `/api/stores/route.ts`
- [ ] `/api/stores/[id]/route.ts`
- [ ] `/api/testimonials/route.ts`
- [ ] `/api/testimonials/[id]/route.ts`

## Automated Fix (Alternative)

Instead of manual editing, you can use find & replace in VS Code:

1. Press `Ctrl + Shift + H` (Find and Replace in Files)
2. **Find:** `^(import.*\n)+\n(export async function)`
3. **Replace:** `$1\n// Force dynamic rendering for this route\nexport const dynamic = 'force-dynamic';\n\n$2`
4. **Files to include:** `src/app/api/**/route.ts`
5. Click "Replace All"

## Verify Fix

After adding, build should succeed without "couldn't be rendered statically" errors:

```bash
npm run build
```

## Why This Happens

Next.js 14+ tries to statically render API routes at build time for performance. However, routes that use:
- `cookies()` - require runtime context
- `headers()` - require runtime context  
- Authentication - require runtime cookies/headers

...cannot be statically rendered and must be forced to dynamic mode.

## Reference

- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)
- [Dynamic Server Usage Error](https://nextjs.org/docs/messages/dynamic-server-error)
