import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { collectionItem } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id, 10);
    const body = await request.json();
    const { name, slug, description, imageUrl, productLink } = body;

    // Generate slug if not provided
    const finalSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [updatedCollection] = await db
      .update(collectionItem)
      .set({
        name,
        slug: finalSlug,
        description,
        imageUrl,
        productLink,
        updatedAt: new Date(),
      })
      .where(eq(collectionItem.id, id))
      .returning();

    if (!updatedCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCollection });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id, 10);

    const [deletedCollection] = await db
      .delete(collectionItem)
      .where(eq(collectionItem.id, id))
      .returning();

    if (!deletedCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedCollection });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
