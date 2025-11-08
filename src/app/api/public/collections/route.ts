import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { productCollections } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/collections
 * Fetch all product collections for public display
 */
export async function GET() {
  try {
    const collections = await db
      .select({
        id: productCollections.id,
        name: productCollections.name,
        description: productCollections.description,
        imageUrl: productCollections.imageUrl,
        slug: productCollections.slug,
        order: productCollections.order,
      })
      .from(productCollections)
      .where(eq(productCollections.isActive, true))
      .orderBy(productCollections.order);

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch collections',
      },
      { status: 500 },
    );
  }
}
