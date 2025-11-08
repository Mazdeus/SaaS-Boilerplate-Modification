import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { companyInfoTable } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const info = await db.select().from(companyInfoTable);
    return NextResponse.json({ success: true, data: info });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, tagline, description, foundedYear, location, industry, employees, email, phone, address, logoUrl, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    const [newInfo] = await db
      .insert(companyInfoTable)
      .values({
        name,
        tagline: tagline || null,
        description: description || null,
        foundedYear: foundedYear || null,
        location: location || null,
        industry: industry || null,
        employees: employees || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        logoUrl: logoUrl || null,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newInfo }, { status: 201 });
  } catch (error) {
    console.error('Error creating company info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company info' },
      { status: 500 }
    );
  }
}
