import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { cmsUser } from '@/models/SchemaCMS';

export async function GET() {
  try {
    // Check if admin user exists
    const users = await db.select().from(cmsUser);
    
    return NextResponse.json({ 
      success: true, 
      message: 'CMS users query successful',
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'CMS users query failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
