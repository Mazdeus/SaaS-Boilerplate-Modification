import { NextRequest } from 'next/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { testimonialSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/testimonials/[id]
 * Protected endpoint - Update testimonial
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid testimonial ID', 400);
    }

    const body = await request.json();
    
    const validation = testimonialSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [updatedTestimonial] = await db
      .update(testimonials)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!updatedTestimonial) {
      return errorResponse('Testimonial not found', 404);
    }

    // Normalize display order if it was updated
    if (validation.data.displayOrder !== undefined) {
      await normalizeDisplayOrder('testimonials');
    }

    return successResponse(updatedTestimonial, 'Testimonial updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update testimonial error:', error);
    return errorResponse('Failed to update testimonial', 500);
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Protected endpoint - Delete testimonial (hard delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid testimonial ID', 400);
    }

    // Hard delete the testimonial
    const [deletedTestimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();

    if (!deletedTestimonial) {
      return errorResponse('Testimonial not found', 404);
    }

    // Normalize display order after deletion to fill gaps
    await normalizeDisplayOrder('testimonials');

    return successResponse(null, 'Testimonial deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete testimonial error:', error);
    return errorResponse('Failed to delete testimonial', 500);
  }
}
