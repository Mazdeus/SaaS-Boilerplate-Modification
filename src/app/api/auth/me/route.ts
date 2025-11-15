import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth();
    
    if (!user) {
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
    console.error('Me error:', error);
    return unauthorizedResponse();
  }
}
