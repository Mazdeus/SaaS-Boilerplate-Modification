import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { testimonials } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/testimonials
 * Fetch all testimonials for public display
 */
export async function GET() {
  try {
    const result = await db
      .select({
        id: testimonials.id,
        customerName: testimonials.name,
        customerPosition: testimonials.position,
        company: testimonials.company,
        content: testimonials.message,
        rating: testimonials.rating,
        isActive: testimonials.isActive,
      })
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .limit(10);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testimonials',
      },
      { status: 500 },
    );
  }
}
