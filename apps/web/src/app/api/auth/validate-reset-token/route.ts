import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_TOKEN', 
            message: 'Token is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Proxy request to backend API
    const backendUrl = 'https://ask-ya-cham-api.onrender.com/api/auth/validate-reset-token';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: {
          user: data.data?.user || { email: 'user@example.com' },
          accessToken: '',
          refreshToken: ''
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.error?.code || 'INVALID_TOKEN',
            message: data.error?.message || 'Invalid or expired reset token'
          }
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Validate token proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your request. Please try again.'
        }
      },
      { status: 500 }
    );
  }
}
