import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  );
}

/**
 * Create error response
 */
export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  );
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized access') {
  return errorResponse(message, 401);
}

/**
 * Create not found response
 */
export function notFoundResponse(message: string = 'Resource not found') {
  return errorResponse(message, 404);
}

/**
 * Create validation error response
 */
export function validationErrorResponse(errors: any) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 422 }
  );
}
