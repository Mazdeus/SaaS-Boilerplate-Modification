import { NextRequest } from 'next/server';
import { db } from '@/db';
import { images } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

/**
 * GET /api/images/[id]
 * Public endpoint - Get single image
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.id, id));

    if (!image) {
      return errorResponse('Image not found', 404);
    }

    return successResponse(image);
  } catch (error) {
    console.error('Get image error:', error);
    return errorResponse('Failed to fetch image', 500);
  }
}

/**
 * PUT /api/images/[id]
 * Protected endpoint - Update image metadata (CMS only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    const body = await request.json();
    
    const [updated] = await db
      .update(images)
      .set(body)
      .where(eq(images.id, id))
      .returning();

    if (!updated) {
      return errorResponse('Image not found', 404);
    }

    return successResponse(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update image error:', error);
    return errorResponse('Failed to update image', 500);
  }
}

/**
 * DELETE /api/images/[id]
 * Protected endpoint - Delete image (CMS only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    
    await db
      .delete(images)
      .where(eq(images.id, id));

    return successResponse({ message: 'Image deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete image error:', error);
    return errorResponse('Failed to delete image', 500);
  }
}
