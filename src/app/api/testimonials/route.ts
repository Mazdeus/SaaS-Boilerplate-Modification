import { NextRequest } from 'next/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { testimonialSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, desc } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

/**
 * GET /api/testimonials
 * Get testimonials - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let testimonialsList;
    if (isCMS) {
      // CMS: Return all testimonials (active + inactive)
      testimonialsList = await db
        .select()
        .from(testimonials)
        .orderBy(testimonials.displayOrder, desc(testimonials.createdAt));
    } else {
      // Public: Return only active testimonials
      testimonialsList = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .orderBy(testimonials.displayOrder, desc(testimonials.createdAt));
    }

    return successResponse(testimonialsList);
  } catch (error) {
    console.error('Get testimonials error:', error);
    return errorResponse('Failed to fetch testimonials', 500);
  }
}

/**
 * POST /api/testimonials
 * Protected endpoint - Create new testimonial
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = testimonialSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const [newTestimonial] = await db
      .insert(testimonials)
      .values(validation.data)
      .returning();

    // Normalize display order to ensure sequential ordering
    await normalizeDisplayOrder('testimonials');

    return successResponse(newTestimonial, 'Testimonial created successfully', 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create testimonial error:', error);
    return errorResponse('Failed to create testimonial', 500);
  }
}
