import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { contactSubmissionSchema } from '@/models/Schema';

// Validation schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

/**
 * POST /api/contact
 * Public endpoint - No authentication required
 * Accepts contact form submissions and stores them in the database
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validatedData = contactFormSchema.parse(body);

    // Insert into database using Drizzle ORM
    const result = await db.insert(contactSubmissionSchema).values({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      subject: validatedData.subject,
      message: validatedData.message,
      status: 'new',
      createdAt: new Date(),
    }).returning();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: result[0],
      },
      { status: 201 },
    );
  }
  catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Handle other errors
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact form. Please try again later.',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/contact
 * Optional: Get all contact submissions (could be admin-only later)
 */
export async function GET() {
  try {
    const submissions = await db.select().from(contactSubmissionSchema);

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  }
  catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch submissions',
      },
      { status: 500 },
    );
  }
}
