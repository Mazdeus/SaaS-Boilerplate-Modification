import { NextRequest } from 'next/server';
import { db } from '@/db';
import { companyValues } from '@/db/schema';
import { companyValueSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, asc } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/company-values
 * Get company values - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let values;
    if (isCMS) {
      // CMS: Return all company values (active + inactive)
      values = await db
        .select()
        .from(companyValues)
        .orderBy(asc(companyValues.displayOrder));
    } else {
      // Public: Return only active company values
      values = await db
        .select()
        .from(companyValues)
        .where(eq(companyValues.isActive, true))
        .orderBy(asc(companyValues.displayOrder));
    }

    return successResponse(values);
  } catch (error) {
    console.error('Get company values error:', error);
    return errorResponse('Failed to fetch company values', 500);
  }
}

/**
 * POST /api/company-values
 * Protected endpoint - Create new company value (CMS only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    // Validate input
    const validation = companyValueSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [newValue] = await db
      .insert(companyValues)
      .values(validation.data)
      .returning();

    return successResponse(newValue, 'Company value created successfully', 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create company value error:', error);
    return errorResponse('Failed to create company value', 500);
  }
}
