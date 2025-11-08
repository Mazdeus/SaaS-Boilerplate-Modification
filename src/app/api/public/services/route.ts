import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { services } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/services
 * Fetch all services for public display
 */
export async function GET() {
  try {
    const result = await db
      .select({
        id: services.id,
        title: services.title,
        subtitle: services.subtitle,
        description: services.description,
        icon: services.icon,
        order: services.order,
      })
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.order);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
      },
      { status: 500 },
    );
  }
}
