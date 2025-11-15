import { NextRequest } from 'next/server';
import { db } from '@/db';
import { heroSections } from '@/db/schema';
import { heroSectionSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse,
  notFoundResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/hero-sections/[id]
 * Protected endpoint - Update hero section
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    const body = await request.json();
    
    // Validate input
    const validation = heroSectionSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Check if section exists
    const [existing] = await db
      .select()
      .from(heroSections)
      .where(eq(heroSections.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Hero section not found');
    }

    // Update section
    const [updated] = await db
      .update(heroSections)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(heroSections.id, id))
      .returning();

    return successResponse(updated, 'Hero section updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update hero section error:', error);
    return errorResponse('Failed to update hero section', 500);
  }
}

/**
 * DELETE /api/hero-sections/[id]
 * Protected endpoint - Delete hero section
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    // Check if section exists
    const [existing] = await db
      .select()
      .from(heroSections)
      .where(eq(heroSections.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Hero section not found');
    }

    // Delete section
    await db
      .delete(heroSections)
      .where(eq(heroSections.id, id));

    return successResponse(null, 'Hero section deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete hero section error:', error);
    return errorResponse('Failed to delete hero section', 500);
  }
}
