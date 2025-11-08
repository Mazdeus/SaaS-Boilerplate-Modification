import { auth } from '@/libs/auth';
import { NextResponse } from 'next/server';

export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return session;
}

export async function requireAdminAuth() {
  const session = await auth();
  
  if (!session?.user) {
    console.log('No session found in requireAdminAuth');
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const userRole = (session.user as any).role;
  console.log('Session found:', { userId: session.user.id, role: userRole });
  
  if (userRole !== 'admin' && userRole !== 'editor') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  return session;
}
