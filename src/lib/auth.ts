import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
}

/**
 * Generate JWT token for authenticated user
 * Token expires in 10 minutes for security
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '10m', // Token expires in 10 minutes
  });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from cookies (server-side)
 */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

/**
 * Verify user authentication from request cookies
 */
export async function verifyAuth(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Check if user is authenticated (throws error if not)
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await verifyAuth();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
