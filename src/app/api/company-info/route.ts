import { NextRequest } from 'next/server';
import { db } from '@/db';
import { companyInfo } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { companyInfoSchema } from '@/lib/validations';

/**
 * GET /api/company-info
 * Public endpoint - Get company information
 */
export async function GET() {
  try {
    const [info] = await db.select().from(companyInfo).limit(1);

    if (!info) {
      return errorResponse('Company information not found', 404);
    }

    return successResponse(info);
  } catch (error) {
    console.error('Get company info error:', error);
    return errorResponse('Failed to fetch company information', 500);
  }
}

/**
 * POST /api/company-info
 * Protected endpoint - Create or update company information (upsert)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = companyInfoSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Check if company info already exists
    const [existingInfo] = await db.select().from(companyInfo).limit(1);

    let result;
    if (existingInfo) {
      // Update existing
      [result] = await db
        .update(companyInfo)
        .set({
          ...validation.data,
          updatedAt: new Date(),
        })
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(companyInfo)
        .values(validation.data)
        .returning();
    }

    return successResponse(
      result, 
      existingInfo ? 'Company information updated successfully' : 'Company information created successfully',
      existingInfo ? 200 : 201
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Save company info error:', error);
    return errorResponse('Failed to save company information', 500);
  }
}
