import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { companyInfo } from '@/models/SchemaCMS';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/public/company-info
 * Fetch company information for public display
 */
export async function GET() {
  try {
    console.log('[Company Info API] Fetching company info...');
    
    // Get the first (and should be only) company info record
    const result = await db
      .select({
        name: companyInfo.name,
        tagline: companyInfo.tagline,
        description: companyInfo.description,
        foundedYear: companyInfo.foundedYear,
        location: companyInfo.location,
        industry: companyInfo.industry,
        email: companyInfo.email,
        phone: companyInfo.phone,
        address: companyInfo.address,
        logoUrl: companyInfo.logoUrl,
        employees: companyInfo.employees,
      })
      .from(companyInfo)
      .where(eq(companyInfo.isActive, true))
      .limit(1);

    console.log('[Company Info API] Result:', result);

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company information not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('[Company Info API] Error fetching company info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company information',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
