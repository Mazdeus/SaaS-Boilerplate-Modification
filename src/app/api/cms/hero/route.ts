import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/utils/auth-server';
import { db } from '@/libs/DB';
import { heroSection } from '@/models/SchemaCMS';
import { heroSectionSchema } from '@/utils/cmsValidation';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// GET - List all hero sections
export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const heroes = await db
      .select()
      .from(heroSection)
      .orderBy(desc(heroSection.order));

    return NextResponse.json({
      success: true,
      data: heroes,
    });
  }
  catch (error) {
    console.error('Error fetching hero sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero sections' },
      { status: 500 },
    );
  }
}

// POST - Create new hero section
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = heroSectionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // Insert into database
    const result = await db
      .insert(heroSection)
      .values(validationResult.data)
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Hero section created successfully',
        data: result[0],
      },
      { status: 201 },
    );
  }
  catch (error) {
    console.error('Error creating hero section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hero section' },
      { status: 500 },
    );
  }
}

// DELETE - Delete hero section by ID
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 },
      );
    }

    await db
      .delete(heroSection)
      .where(eq(heroSection.id, Number.parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Hero section deleted successfully',
    });
  }
  catch (error) {
    console.error('Error deleting hero section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero section' },
      { status: 500 },
    );
  }
}

// PUT - Update hero section
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 },
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = heroSectionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // Update database
    const result = await db
      .update(heroSection)
      .set({ ...validationResult.data, updatedAt: new Date() })
      .where(eq(heroSection.id, Number.parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hero section not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully',
      data: result[0],
    });
  }
  catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hero section' },
      { status: 500 },
    );
  }
}
