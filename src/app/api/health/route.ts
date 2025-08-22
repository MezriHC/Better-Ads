import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Simple health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Better Ads API'
  });
}