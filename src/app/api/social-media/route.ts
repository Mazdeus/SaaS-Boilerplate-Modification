import { NextRequest } from 'next/server';
import { db } from '@/db';
import { socialMedia } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, asc } from 'drizzle-orm';

/**
 * GET /api/social-media
 * Public endpoint - Get all active social media links
 */
export async function GET() {
  try {
    const links = await db
      .select()
      .from(socialMedia)
      .where(eq(socialMedia.isActive, true))
      .orderBy(asc(socialMedia.displayOrder));

    return successResponse(links);
  } catch (error) {
    console.error('Get social media error:', error);
    return errorResponse('Failed to fetch social media links', 500);
  }
}

/**
 * POST /api/social-media
 * Protected endpoint - Create new social media link (CMS only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const [newLink] = await db
      .insert(socialMedia)
      .values(body)
      .returning();

    return successResponse(newLink);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create social media error:', error);
    return errorResponse('Failed to create social media link', 500);
  }
}
