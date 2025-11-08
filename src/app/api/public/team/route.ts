import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { teamMembers } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/team
 * Fetch all team members for public display
 */
export async function GET() {
  try {
    const members = await db
      .select({
        id: teamMembers.id,
        name: teamMembers.name,
        position: teamMembers.position,
        bio: teamMembers.bio,
        imageUrl: teamMembers.photoUrl,
        order: teamMembers.order,
      })
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(teamMembers.order);

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch team members',
      },
      { status: 500 },
    );
  }
}
