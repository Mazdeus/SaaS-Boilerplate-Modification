import { NextRequest } from 'next/server';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { contactMessageSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { 
  successResponse, 
  errorResponse, 
  validationErrorResponse, 
  unauthorizedResponse 
} from '@/lib/api-response';
import { desc, eq } from 'drizzle-orm';

/**
 * GET /api/contact-messages
 * Protected endpoint - Get all contact messages (CMS only)
 */
export async function GET() {
  try {
    await requireAuth();

    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    return successResponse(messages);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Get contact messages error:', error);
    return errorResponse('Failed to fetch contact messages', 500);
  }
}

/**
 * POST /api/contact-messages
 * Public endpoint - Submit contact form
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = contactMessageSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    // Create contact message
    const [newMessage] = await db
      .insert(contactMessages)
      .values({
        ...validation.data,
      })
      .returning();

    return successResponse(
      { id: newMessage.id },
      'Message sent successfully. We will contact you soon.',
      201
    );
  } catch (error) {
    console.error('Create contact message error:', error);
    return errorResponse('Failed to send message', 500);
  }
}
