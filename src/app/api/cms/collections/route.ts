import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { collectionItem } from '@/models/SchemaCMS';
import { requireAdminAuth } from '@/utils/auth-server';

export async function GET() {
  try {
    // Check authentication
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if not authenticated
    }

    const allCollections = await db.select().from(collectionItem);
    return NextResponse.json({ success: true, data: allCollections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authResult = await requireAdminAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if not authenticated
    }

    const body = await request.json();
    const { name, slug, description, imageUrl, productLink } = body;

    // Generate slug if not provided
    const finalSlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    const [newCollection] = await db
      .insert(collectionItem)
      .values({
        name,
        slug: finalSlug,
        description,
        imageUrl,
        productLink,
      })
      .returning();

    return NextResponse.json({ success: true, data: newCollection }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
