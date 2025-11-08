import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { companyBranch } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const allBranches = await db
      .select()
      .from(companyBranch)
      .orderBy(desc(companyBranch.order), desc(companyBranch.createdAt));

    return NextResponse.json({ success: true, data: allBranches });
  } catch (error) {
    console.error('Error fetching company branches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company branches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    const [newBranch] = await db
      .insert(companyBranch)
      .values({
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
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: newBranch }, { status: 201 });
  } catch (error) {
    console.error('Error creating company branch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company branch' },
      { status: 500 }
    );
  }
}
