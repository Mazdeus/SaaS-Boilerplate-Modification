import { NextRequest } from 'next/server';
import { db } from '@/db';
import { cmsUsers } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { desc } from 'drizzle-orm';

/**
 * GET /api/cms-users
 * Protected endpoint - Get all CMS users
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const users = await db
      .select({
        id: cmsUsers.id,
        email: cmsUsers.email,
        name: cmsUsers.fullName,
        role: cmsUsers.role,
        is_active: cmsUsers.isActive,
        created_at: cmsUsers.createdAt,
      })
      .from(cmsUsers)
      .orderBy(desc(cmsUsers.createdAt));

    return successResponse(users);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Get CMS users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
}
