import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { productItem } from '@/models/SchemaCMS';
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
    const { name, slug, description, price, imageUrl, productLink, collectionId, isFeatured, isActive } = body;

    // If setting this product as featured, unfeature all others first
    if (isFeatured) {
      await db
        .update(productItem)
        .set({ isFeatured: false })
        .where(eq(productItem.isFeatured, true));
    }

    const [updatedProduct] = await db
      .update(productItem)
      .set({
        name,
        slug,
        description,
        price,
        imageUrl,
        productLink,
        collectionId: collectionId || null,
        isFeatured,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(productItem.id, id))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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

    const [deletedProduct] = await db
      .delete(productItem)
      .where(eq(productItem.id, id))
      .returning();

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
