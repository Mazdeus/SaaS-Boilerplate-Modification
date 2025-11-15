import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { cmsUsers } from '@/db/schema';
import { loginSchema } from '@/lib/validations';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors);
    }

    const { email, password } = validation.data;

    // Find user by email
    const [user] = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.email, email))
      .limit(1);

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse('Account is disabled', 403);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.fullName || user.username,
      role: user.role,
    });

    console.log('[Login] User authenticated:', {
      userId: user.id,
      email: user.email,
      name: user.fullName || user.username,
      tokenGenerated: !!token,
    });

    // Set cookie
    const response = successResponse(
      {
        user: {
          id: user.id,
          name: user.fullName || user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      'Login successful'
    );

    // Set cookie with appropriate settings
    // Note: secure is set to false for HTTP deployments (like Azure VM with IP)
    // If you use HTTPS with a domain, change secure to true
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false, // Set to true only when using HTTPS
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes (600 seconds)
      path: '/',
    });

    console.log('[Login] Cookie set successfully');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('An error occurred during login', 500);
  }
}
