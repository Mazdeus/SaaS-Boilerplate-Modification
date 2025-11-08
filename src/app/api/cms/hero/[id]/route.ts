import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { requireAdminAuth } from '@/utils/auth-server';
import { db } from '@/libs/DB';
import { heroSection } from '@/models/SchemaCMS';

/**
 * GET /api/cms/hero/[id]
 * Fetch single hero section
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const [hero] = await db
      .select()
      .from(heroSection)
      .where(eq(heroSection.id, parseInt(params.id, 10)));

    if (!hero) {
      return NextResponse.json(
        { success: false, error: 'Hero not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hero,
    });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cms/hero/[id]
 * Update hero section
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    
    const [updatedHero] = await db
      .update(heroSection)
      .set({
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        imageUrl: body.imageUrl,
        order: body.order,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(heroSection.id, parseInt(params.id, 10)))
      .returning();

    if (!updatedHero) {
      return NextResponse.json(
        { success: false, error: 'Hero not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedHero,
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hero' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cms/hero/[id]
 * Delete hero section
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const [deletedHero] = await db
      .delete(heroSection)
      .where(eq(heroSection.id, parseInt(params.id, 10)))
      .returning();

    if (!deletedHero) {
      return NextResponse.json(
        { success: false, error: 'Hero not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedHero,
    });
  } catch (error) {
    console.error('Error deleting hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero' },
      { status: 500 }
    );
  }
}
