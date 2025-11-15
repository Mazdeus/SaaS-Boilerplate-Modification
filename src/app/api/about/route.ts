import { NextRequest } from 'next/server';
import { db } from '@/db';
import { aboutSection } from '@/db/schema';
import { aboutSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

/**
 * GET /api/about
 * Public endpoint - Get about information
 */
export async function GET() {
  try {
    // Get the first (and should be only) about record
    const [aboutData] = await db
      .select()
      .from(aboutSection)
      .limit(1);

    return successResponse(aboutData || null);
  } catch (error) {
    console.error('Get about error:', error);
    return errorResponse('Failed to fetch about information', 500);
  }
}

/**
 * POST /api/about
 * Protected endpoint - Create or update about information
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    // Validate input
    const validation = aboutSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Check if about already exists
    const [existing] = await db
      .select()
      .from(aboutSection)
      .limit(1);

    let result;
    if (existing) {
      // Update existing
      [result] = await db
        .update(aboutSection)
        .set({ ...validation.data, updatedAt: new Date() })
        .where(eq(aboutSection.id, existing.id))
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(aboutSection)
        .values(validation.data)
        .returning();
    }

    return successResponse(result, 'About information saved successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Save about error:', error);
    return errorResponse('Failed to save about information', 500);
  }
}
