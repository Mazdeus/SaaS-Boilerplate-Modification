import { NextResponse } from 'next/server';

/**
 * Health check endpoint for container monitoring
 * Used by Azure Container Apps health probes and uptime monitoring
 */
export async function GET() {
  try {
    // Basic health check - can be extended with database checks, etc.
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
}
