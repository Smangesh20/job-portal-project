import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'Configured ✅' : 'Missing ❌',
      FROM_EMAIL: process.env.FROM_EMAIL || 'Not set',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    };

    console.log('🔍 Environment Variables Check:');
    console.log(envCheck);

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      data: envCheck
    });

  } catch (error) {
    console.error('❌ Environment check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ENV_CHECK_ERROR',
          message: 'Error checking environment variables',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}





