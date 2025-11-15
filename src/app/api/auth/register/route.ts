import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { cmsUsers } from '@/db/schema';
import { registerSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-response';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Only super_admin can create new users
    const currentUser = await requireAuth();
    if (currentUser.role !== 'super_admin') {
      return unauthorizedResponse('Only super admin can create users');
    }

    const body = await request.json();
    
    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const { name, email, password, role } = validation.data;

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .limit(1);

    if (existingUser) {
      return errorResponse('Email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(cmsUsers)
      .values({
        username: email.split('@')[0], // Use email prefix as username
        fullName: name,
        email,
        passwordHash: hashedPassword,
        role,
        isActive: true,
      })
      .returning();

    return successResponse(
      {
        user: {
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
        },
      },
      'User created successfully',
      201
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    console.error('Register error:', error);
    return errorResponse('An error occurred during registration', 500);
  }
}
