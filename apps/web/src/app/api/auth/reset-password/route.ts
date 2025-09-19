import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_FIELDS', 
            message: 'Token and new password are required' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'WEAK_PASSWORD', 
            message: 'Password must be at least 8 characters long' 
          } 
        },
        { status: 400 }
      );
    }

    // Proxy request to backend API
    const backendUrl = 'https://ask-ya-cham-api.onrender.com/api/auth/reset-password';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: data.message || 'Your password has been reset successfully. Please log in with your new password.'
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.error?.code || 'RESET_FAILED',
            message: data.error?.message || 'An error occurred while resetting your password. Please try again.'
          }
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Reset password proxy error:', error);
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
