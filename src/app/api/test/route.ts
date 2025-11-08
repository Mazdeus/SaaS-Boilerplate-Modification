import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Test route handler called');
    return NextResponse.json({ 
      success: true, 
      message: 'Test route working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { success: false, error: 'Test route failed' },
      { status: 500 }
    );
  }
}
