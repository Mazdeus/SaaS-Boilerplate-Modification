import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { products } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/products
 * Fetch all products for public display
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        imageUrl: products.imageUrl,
        isFeatured: products.isFeatured,
        slug: products.slug,
        productLink: products.productLink,
      })
      .from(products);

    let result;
    if (featured === 'true') {
      result = await baseQuery.where(and(eq(products.isFeatured, true), eq(products.isActive, true)));
    } else {
      result = await baseQuery.where(eq(products.isActive, true));
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 },
    );
  }
}
