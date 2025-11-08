import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { requireAdminAuth } from '@/utils/auth-server';
import {
  collectionItem,
  heroSection,
  images,
  productItem,
  teamMember,
  testimonial,
} from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    console.log('[Stats API] Fetching stats from database...');
    
    // Get counts from database
    const [heroCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(heroSection);

    const [testimonialCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testimonial);

    const [productCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productItem);

    const [collectionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(collectionItem);

    const [teamCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(teamMember);

    const [imageCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(images);

    const result = {
      success: true,
      data: {
        heroes: Number(heroCount?.count || 0),
        testimonials: Number(testimonialCount?.count || 0),
        products: Number(productCount?.count || 0),
        collections: Number(collectionCount?.count || 0),
        teamMembers: Number(teamCount?.count || 0),
        images: Number(imageCount?.count || 0),
      },
    };

    console.log('[Stats API] Success:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Stats API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 },
    );
  }
}
