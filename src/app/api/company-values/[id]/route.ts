import { NextRequest } from 'next/server';
import { db } from '@/db';
import { companyValues } from '@/db/schema';
import { companyValueSchema } from '@/lib/validations';
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
 * GET /api/company-values/[id]
 * Public endpoint - Get single company value
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }
    
    const [value] = await db
      .select()
      .from(companyValues)
      .where(eq(companyValues.id, id));

    if (!value) {
      return notFoundResponse('Company value not found');
    }

    return successResponse(value);
  } catch (error) {
    console.error('Get company value error:', error);
    return errorResponse('Failed to fetch company value', 500);
  }
}

/**
 * PATCH /api/company-values/[id]
 * Protected endpoint - Update company value (CMS only)
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
    const validation = companyValueSchema.partial().safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Check if exists
    const [existing] = await db
      .select()
      .from(companyValues)
      .where(eq(companyValues.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Company value not found');
    }

    // Update
    const [updated] = await db
      .update(companyValues)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(companyValues.id, id))
      .returning();

    return successResponse(updated, 'Company value updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update company value error:', error);
    return errorResponse('Failed to update company value', 500);
  }
}

/**
 * DELETE /api/company-values/[id]
 * Protected endpoint - Delete company value (CMS only)
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

    // Check if exists
    const [existing] = await db
      .select()
      .from(companyValues)
      .where(eq(companyValues.id, id))
      .limit(1);

    if (!existing) {
      return notFoundResponse('Company value not found');
    }
    
    await db
      .delete(companyValues)
      .where(eq(companyValues.id, id));

    return successResponse(null, 'Company value deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete company value error:', error);
    return errorResponse('Failed to delete company value', 500);
  }
}
