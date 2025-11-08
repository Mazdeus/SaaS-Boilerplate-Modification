import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { serviceItem } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const allServices = await db.select().from(serviceItem).orderBy(serviceItem.order);
    return NextResponse.json({ success: true, data: allServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
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
    const { title, subtitle, description, icon, iconUrl, order, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const [newService] = await db
      .insert(serviceItem)
      .values({
        title,
        subtitle: subtitle || null,
        description: description || null,
        icon: icon || null,
        iconUrl: iconUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
