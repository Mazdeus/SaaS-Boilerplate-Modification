import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { heroSection } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/hero
 * Fetch all hero sections for public display
 */
export async function GET() {
  try {
    const heroes = await db
      .select()
      .from(heroSection)
      .where(eq(heroSection.isActive, true))
      .orderBy(heroSection.order);

    return NextResponse.json({
      success: true,
      data: heroes,
    });
  } catch (error) {
    console.error('Hero API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch hero sections' 
      },
      { status: 500 }
    );
  }
}
