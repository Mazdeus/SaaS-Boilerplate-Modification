import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();
    
    console.log('[Auth Me] Verification result:', {
      authenticated: !!user,
      userId: user?.userId,
      email: user?.email,
    });
    
    if (!user) {
      console.log('[Auth Me] No valid token found');
      return unauthorizedResponse();
    }

    return successResponse({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Me] Error:', error);
    return unauthorizedResponse();
  }
}
