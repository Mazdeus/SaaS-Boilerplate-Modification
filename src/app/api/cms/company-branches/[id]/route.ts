import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { companyBranch } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);
    const [branch] = await db
      .select()
      .from(companyBranch)
      .where(eq(companyBranch.id, id));

    if (!branch) {
      return NextResponse.json(
        { success: false, error: 'Company branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: branch });
  } catch (error) {
    console.error('Error fetching company branch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company branch' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);
    const body = await request.json();
    const { 
      name, 
      address, 
      city, 
      province, 
      postalCode, 
      phone, 
      email, 
      operatingHours, 
      mapUrl, 
      imageUrl,
      instagramUsername,
      isActive,
      order 
    } = body;

    const [updatedBranch] = await db
      .update(companyBranch)
      .set({
        name,
        address,
        city,
        province,
        postalCode,
        phone,
        email,
        operatingHours,
        mapUrl,
        imageUrl,
        instagramUsername,
        isActive,
        order,
        updatedAt: new Date(),
      })
      .where(eq(companyBranch.id, id))
      .returning();

    if (!updatedBranch) {
      return NextResponse.json(
        { success: false, error: 'Company branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBranch });
  } catch (error) {
    console.error('Error updating company branch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company branch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);
    const [deletedBranch] = await db
      .delete(companyBranch)
      .where(eq(companyBranch.id, id))
      .returning();

    if (!deletedBranch) {
      return NextResponse.json(
        { success: false, error: 'Company branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedBranch });
  } catch (error) {
    console.error('Error deleting company branch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete company branch' },
      { status: 500 }
    );
  }
}
