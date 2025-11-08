import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { companyBranch } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activeBranches = await db
      .select({
        id: companyBranch.id,
        name: companyBranch.name,
        address: companyBranch.address,
        city: companyBranch.city,
        province: companyBranch.province,
        postalCode: companyBranch.postalCode,
        phone: companyBranch.phone,
        email: companyBranch.email,
        operatingHours: companyBranch.operatingHours,
        mapUrl: companyBranch.mapUrl,
        imageUrl: companyBranch.imageUrl,
        instagramUsername: companyBranch.instagramUsername,
        order: companyBranch.order,
      })
      .from(companyBranch)
      .where(eq(companyBranch.isActive, true))
      .orderBy(desc(companyBranch.order));

    return NextResponse.json({
      success: true,
      data: activeBranches,
    });
  } catch (error) {
    console.error('Error fetching company branches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company branches' },
      { status: 500 }
    );
  }
}
