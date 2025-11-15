import { NextRequest } from 'next/server';
import { db } from '@/db';
import { images } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, asc, like } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/images
 * Public endpoint - Get all images (optionally filter by category)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = db.select().from(images);

    if (category) {
      query = query.where(eq(images.category, category)) as any;
    }

    const allImages = await query.orderBy(asc(images.uploadedAt));

    return successResponse(allImages);
  } catch (error) {
    console.error('Get images error:', error);
    return errorResponse('Failed to fetch images', 500);
  }
}

/**
 * POST /api/images
 * Protected endpoint - Add new image to library (CMS only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const [newImage] = await db
      .insert(images)
      .values(body)
      .returning();

    return successResponse(newImage);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create image error:', error);
    return errorResponse('Failed to create image', 500);
  }
}
