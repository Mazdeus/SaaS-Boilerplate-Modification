import { NextRequest } from 'next/server';
import { db } from '@/db';
import { seoSettings } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { seoSettingSchema } from '@/lib/validations';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/seo-settings
 * Public endpoint - Get SEO settings
 */
export async function GET() {
  try {
    const [settings] = await db.select().from(seoSettings).limit(1);

    if (!settings) {
      return errorResponse('SEO settings not found', 404);
    }

    return successResponse(settings);
  } catch (error) {
    console.error('Get SEO settings error:', error);
    return errorResponse('Failed to fetch SEO settings', 500);
  }
}

/**
 * POST /api/seo-settings
 * Protected endpoint - Create or update SEO settings (upsert)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = seoSettingSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Check if SEO settings already exist
    const [existingSettings] = await db.select().from(seoSettings).limit(1);

    let result;
    if (existingSettings) {
      // Update existing
      [result] = await db
        .update(seoSettings)
        .set({
          ...validation.data,
          updatedAt: new Date(),
        })
        .returning();
    } else {
      // Create new
      [result] = await db
        .insert(seoSettings)
        .values(validation.data)
        .returning();
    }

    return successResponse(
      result, 
      existingSettings ? 'SEO settings updated successfully' : 'SEO settings created successfully',
      existingSettings ? 200 : 201
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Save SEO settings error:', error);
    return errorResponse('Failed to save SEO settings', 500);
  }
}
