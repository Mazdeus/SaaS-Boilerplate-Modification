import { NextRequest } from 'next/server';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { storeSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

/**
 * PATCH /api/stores/[id]
 * Protected endpoint - Update store
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid store ID', 400);
    }

    const body = await request.json();
    
    const validation = storeSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [updatedStore] = await db
      .update(stores)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, id))
      .returning();

    if (!updatedStore) {
      return errorResponse('Store not found', 404);
    }

    // Normalize display order if it was updated
    if (validation.data.displayOrder !== undefined) {
      await normalizeDisplayOrder('stores');
    }

    return successResponse(updatedStore, 'Store updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update store error:', error);
    return errorResponse('Failed to update store', 500);
  }
}

/**
 * DELETE /api/stores/[id]
 * Protected endpoint - Delete store (hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid store ID', 400);
    }

    // Hard delete the store
    const [deletedStore] = await db
      .delete(stores)
      .where(eq(stores.id, id))
      .returning();

    if (!deletedStore) {
      return errorResponse('Store not found', 404);
    }

    // Normalize display order after deletion to fill gaps
    await normalizeDisplayOrder('stores');

    return successResponse(null, 'Store deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete store error:', error);
    return errorResponse('Failed to delete store', 500);
  }
}
