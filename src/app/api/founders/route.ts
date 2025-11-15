import { NextRequest } from 'next/server';
import { db } from '@/db';
import { founders } from '@/db/schema';
import { founderSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/founders
 * Get founders - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let foundersList;
    if (isCMS) {
      // CMS: Return all founders (active + inactive)
      foundersList = await db
        .select()
        .from(founders)
        .orderBy(founders.displayOrder, desc(founders.createdAt));
    } else {
      // Public: Return only active founders
      foundersList = await db
        .select()
        .from(founders)
        .where(eq(founders.isActive, true))
        .orderBy(founders.displayOrder, desc(founders.createdAt));
    }

    return successResponse(foundersList);
  } catch (error) {
    console.error('Get founders error:', error);
    return errorResponse('Failed to fetch founders', 500);
  }
}

/**
 * POST /api/founders
 * Protected endpoint - Create new founder
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = founderSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [newFounder] = await db
      .insert(founders)
      .values(validation.data)
      .returning();

    return successResponse(newFounder, 'Founder created successfully', 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create founder error:', error);
    return errorResponse('Failed to create founder', 500);
  }
}
