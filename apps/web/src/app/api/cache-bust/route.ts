import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    build: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    message: 'Cache bust endpoint - forces refresh'
  })
}
