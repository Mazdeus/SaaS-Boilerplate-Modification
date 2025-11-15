import { NextRequest } from 'next/server';
import { db } from '@/db';
import { founders } from '@/db/schema';
import { founderSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse,
  notFoundResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/founders/[id]
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
    const validation = founderSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [existing] = await db
      .select()
      .from(founders)
      .where(eq(founders.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Founder not found');
    }

    const [updated] = await db
      .update(founders)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(founders.id, id))
      .returning();

    return successResponse(updated, 'Founder updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update founder error:', error);
    return errorResponse('Failed to update founder', 500);
  }
}

/**
 * DELETE /api/founders/[id]
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

    const [existing] = await db
      .select()
      .from(founders)
      .where(eq(founders.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Founder not found');
    }

    await db.delete(founders).where(eq(founders.id, id));

    return successResponse(null, 'Founder deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete founder error:', error);
    return errorResponse('Failed to delete founder', 500);
  }
}
