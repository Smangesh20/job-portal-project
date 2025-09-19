import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_EMAIL', 
            message: 'Email is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_EMAIL', 
            message: 'Please enter a valid email address' 
          } 
        },
        { status: 400 }
      );
    }

    // Proxy request to backend API
    const backendUrl = 'https://ask-ya-cham-api.onrender.com/api/auth/forgot-password';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: data.message || 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.'
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.error?.code || 'API_ERROR',
            message: data.error?.message || 'Failed to send password reset email. Please try again.'
          }
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Forgot password proxy error:', error);
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
