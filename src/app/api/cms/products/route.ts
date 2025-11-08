import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { productItem } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    const session = await requireAdminAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const allProducts = await db.select().from(productItem);
    return NextResponse.json({ success: true, data: allProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
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
    const { name, slug, description, price, imageUrl, productLink, collectionId, isFeatured, isActive } = body;

    // If setting this product as featured, unfeature all others first
    if (isFeatured) {
      await db
        .update(productItem)
        .set({ isFeatured: false })
        .where(eq(productItem.isFeatured, true));
    }

    const [newProduct] = await db
      .insert(productItem)
      .values({
        name,
        slug,
        description,
        price,
        imageUrl,
        productLink,
        collectionId: collectionId || null,
        isFeatured: isFeatured || false,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
