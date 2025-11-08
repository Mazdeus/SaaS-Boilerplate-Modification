import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { companyInfoTable } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';
import { requireAdminAuth } from '@/utils/auth-server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);
    const body = await request.json();
    const { name, tagline, description, foundedYear, location, industry, employees, email, phone, address, logoUrl, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    const [updatedInfo] = await db
      .update(companyInfoTable)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(companyInfoTable.id, id))
      .returning();

    if (!updatedInfo) {
      return NextResponse.json(
        { success: false, error: 'Company info not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedInfo });
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company info' },
      { status: 500 }
    );
  }
}
