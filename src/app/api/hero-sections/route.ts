import { NextRequest } from 'next/server';
import { db } from '@/db';
import { heroSections } from '@/db/schema';
import { heroSectionSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { eq, desc } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/hero-sections
 * Get hero sections - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let sections;
    if (isCMS) {
      // CMS: Return all hero sections (active + inactive)
      sections = await db
        .select()
        .from(heroSections)
        .orderBy(heroSections.displayOrder, desc(heroSections.createdAt));
    } else {
      // Public: Return only active hero sections
      sections = await db
        .select()
        .from(heroSections)
        .where(eq(heroSections.isActive, true))
        .orderBy(heroSections.displayOrder);
    }

    return successResponse(sections);
  } catch (error) {
    console.error('Get hero sections error:', error);
    return errorResponse('Failed to fetch hero sections', 500);
  }
}

/**
 * POST /api/hero-sections
 * Protected endpoint - Create new hero section (CMS only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    const body = await request.json();
    
    // Validate input
    const validation = heroSectionSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Create hero section
    const [newSection] = await db
      .insert(heroSections)
      .values(validation.data)
      .returning();

    return successResponse(newSection, 'Hero section created successfully', 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create hero section error:', error);
    return errorResponse('Failed to create hero section', 500);
  }
}
