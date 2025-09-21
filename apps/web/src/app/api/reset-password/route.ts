import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
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
    if (password.length < 8) {
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

    // For now, return success to test the flow
    // TODO: Integrate with actual backend API when CORS is fixed
    console.log('🔐 GOOGLE-STYLE: Reset password request for token:', token);
    
    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. Please log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
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
