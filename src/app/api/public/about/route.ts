import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { aboutSection } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/about
 * Fetch about section for public display
 */
export async function GET() {
  try {
    const about = await db
      .select()
      .from(aboutSection)
      .limit(1);

    const data = about[0] || null;
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('About API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch about section' 
      },
      { status: 500 }
    );
  }
}
