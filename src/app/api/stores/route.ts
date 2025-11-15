import { NextRequest } from 'next/server';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { storeSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, desc } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

/**
 * GET /api/stores
 * Get stores - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let storesList;
    if (isCMS) {
      // CMS: Return all stores (active + inactive)
      storesList = await db
        .select()
        .from(stores)
        .orderBy(stores.displayOrder, desc(stores.createdAt));
    } else {
      // Public: Return only active stores
      storesList = await db
        .select()
        .from(stores)
        .where(eq(stores.isActive, true))
        .orderBy(stores.displayOrder, desc(stores.createdAt));
    }

    return successResponse(storesList);
  } catch (error) {
    console.error('Get stores error:', error);
    return errorResponse('Failed to fetch stores', 500);
  }
}

/**
 * POST /api/stores
 * Protected endpoint - Create new store
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = storeSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [newStore] = await db
      .insert(stores)
      .values(validation.data)
      .returning();

    // Normalize display order to ensure sequential ordering
    await normalizeDisplayOrder('stores');

    return successResponse(newStore, 'Store created successfully', 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create store error:', error);
    return errorResponse('Failed to create store', 500);
  }
}
