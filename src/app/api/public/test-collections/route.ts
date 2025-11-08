import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Public test route called');
    
    // Test database connection
    const { db } = await import('@/libs/DB');
    const { collectionItem } = await import('@/models/SchemaCMS');
    
    const allCollections = await db.select().from(collectionItem);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database test successful',
      collectionsCount: allCollections.length,
      collections: allCollections
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
