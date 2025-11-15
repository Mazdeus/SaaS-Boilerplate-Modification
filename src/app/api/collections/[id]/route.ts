import { NextRequest } from 'next/server';
import { db } from '@/db';
import { collections, collectionImages } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { collectionSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/collections/[id]
 * Protected endpoint - Update collection
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid collection ID', 400);
    }

    const body = await request.json();
    
    const validation = collectionSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Update collection
    const [updatedCollection] = await db
      .update(collections)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id))
      .returning();

    if (!updatedCollection) {
      return errorResponse('Collection not found', 404);
    }

    // Update images if provided in separate field
    if (body.images !== undefined) {
      // Delete existing images
      await db
        .delete(collectionImages)
        .where(eq(collectionImages.collectionId, id));

      // Insert new images
      if (Array.isArray(body.images) && body.images.length > 0) {
        await db
          .insert(collectionImages)
          .values(
            body.images.map((img: any, index: number) => ({
              collectionId: id,
              imageUrl: img.imageUrl,
              caption: img.caption || null,
              displayOrder: img.displayOrder ?? index,
            }))
          );
      }
    }

    // Fetch updated collection with images
    const imagesData = await db
      .select()
      .from(collectionImages)
      .where(eq(collectionImages.collectionId, id))
      .orderBy(collectionImages.displayOrder);

    // Normalize display order if it was updated
    if (validation.data.displayOrder !== undefined) {
      await normalizeDisplayOrder('collections');
    }

    return successResponse(
      {
        ...updatedCollection,
        images: imagesData,
      },
      'Collection updated successfully'
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update collection error:', error);
    return errorResponse('Failed to update collection', 500);
  }
}

/**
 * DELETE /api/collections/[id]
 * Protected endpoint - Delete collection (hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid collection ID', 400);
    }

    // First delete associated images
    await db
      .delete(collectionImages)
      .where(eq(collectionImages.collectionId, id));

    // Then hard delete the collection
    const [deletedCollection] = await db
      .delete(collections)
      .where(eq(collections.id, id))
      .returning();

    if (!deletedCollection) {
      return errorResponse('Collection not found', 404);
    }

    // Normalize display order after deletion to fill gaps
    await normalizeDisplayOrder('collections');

    return successResponse(null, 'Collection deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete collection error:', error);
    return errorResponse('Failed to delete collection', 500);
  }
}
