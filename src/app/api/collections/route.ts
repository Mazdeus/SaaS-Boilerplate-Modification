import { NextRequest } from 'next/server';
import { db } from '@/db';
import { collections, collectionImages } from '@/db/schema';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { collectionSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';
import { normalizeDisplayOrder } from '@/lib/display-order';

/**
 * GET /api/collections
 * Get collections - returns all for CMS (authenticated), active only for public
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a CMS request (with auth)
    const authHeader = request.headers.get('authorization');
    const isCMS = !!authHeader;

    let allCollections;
    if (isCMS) {
      // CMS: Return all collections (active + inactive)
      allCollections = await db
        .select()
        .from(collections)
        .orderBy(collections.displayOrder);
    } else {
      // Public: Return only active collections
      allCollections = await db
        .select()
        .from(collections)
        .where(eq(collections.isActive, true))
        .orderBy(collections.displayOrder);
    }

    // Fetch images for each collection
    const collectionsWithImages = await Promise.all(
      allCollections.map(async (collection) => {
        const images = await db
          .select()
          .from(collectionImages)
          .where(eq(collectionImages.collectionId, collection.id))
          .orderBy(collectionImages.displayOrder);

        return {
          ...collection,
          images,
        };
      })
    );

    return successResponse(collectionsWithImages);
  } catch (error) {
    console.error('Get collections error:', error);
    return errorResponse('Failed to fetch collections', 500);
  }
}

/**
 * POST /api/collections
 * Protected endpoint - Create new collection
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    
    const validation = collectionSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Insert collection
    const [newCollection] = await db
      .insert(collections)
      .values(validation.data)
      .returning();

    // Insert images if provided in separate field (not validated by schema)
    const collectionImagesData: any[] = [];
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      const insertedImages = await db
        .insert(collectionImages)
        .values(
          body.images.map((img: any, index: number) => ({
            collectionId: newCollection.id,
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            displayOrder: img.displayOrder ?? index,
          }))
        )
        .returning();
      collectionImagesData.push(...insertedImages);
    }

    // Normalize display order to ensure sequential ordering
    await normalizeDisplayOrder('collections');

    return successResponse(
      {
        ...newCollection,
        images: collectionImagesData,
      },
      'Collection created successfully',
      201
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Create collection error:', error);
    return errorResponse('Failed to create collection', 500);
  }
}
