import { NextRequest } from 'next/server';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse,
  notFoundResponse 
} from '@/lib/api-response';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/contact-messages/[id]
 * Protected endpoint - Update message status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    const body = await request.json();
    const { isRead } = body;

    if (typeof isRead !== 'boolean') {
      return errorResponse('Invalid isRead value', 400);
    }

    // Update message
    const [updated] = await db
      .update(contactMessages)
      .set({ 
        isRead: isRead,
        readAt: isRead ? new Date() : null,
      })
      .where(eq(contactMessages.id, id))
      .returning();

    if (!updated) {
      return notFoundResponse('Message not found');
    }

    return successResponse(updated, 'Message status updated successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Update message error:', error);
    return errorResponse('Failed to update message', 500);
  }
}

/**
 * DELETE /api/contact-messages/[id]
 * Protected endpoint - Delete message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    // Delete message
    await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));

    return successResponse(null, 'Message deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Delete message error:', error);
    return errorResponse('Failed to delete message', 500);
  }
}
