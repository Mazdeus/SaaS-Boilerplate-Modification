import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { serviceItem } from '@/models/SchemaCMS';
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
    const { title, subtitle, description, icon, iconUrl, order, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const [updatedService] = await db
      .update(serviceItem)
      .set({
        title,
        subtitle: subtitle || null,
        description: description || null,
        icon: icon || null,
        iconUrl: iconUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(serviceItem.id, id))
      .returning();

    if (!updatedService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = Number.parseInt(params.id, 10);

    const [deletedService] = await db
      .delete(serviceItem)
      .where(eq(serviceItem.id, id))
      .returning();

    if (!deletedService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedService });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
