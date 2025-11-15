import { NextRequest } from 'next/server';
import { db } from '@/db';
import { aboutSection } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

/**
 * GET /api/about-section
 * Public endpoint - Get about section (single row)
 */
export async function GET() {
  try {
    const [section] = await db
      .select()
      .from(aboutSection)
      .limit(1);

    if (!section) {
      return errorResponse('About section not found', 404);
    }

    return successResponse(section);
  } catch (error) {
    console.error('Get about section error:', error);
    return errorResponse('Failed to fetch about section', 500);
  }
}

/**
 * PUT /api/about-section
 * Protected endpoint - Update about section (CMS only)
 */
export async function PUT(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    // Get existing section
    const [existing] = await db
      .select()
      .from(aboutSection)
      .limit(1);

    let updated;
    if (existing) {
      // Update existing
      [updated] = await db
        .update(aboutSection)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(aboutSection.id, existing.id))
        .returning();
    } else {
      // Create new if not exists
      [updated] = await db
        .insert(aboutSection)
        .values(body)
        .returning();
    }

    return successResponse(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update about section error:', error);
    return errorResponse('Failed to update about section', 500);
  }
}
