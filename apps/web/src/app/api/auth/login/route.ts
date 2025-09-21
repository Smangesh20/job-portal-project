import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_CREDENTIALS', 
            message: 'Email and password are required' 
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

    // For now, return success for testing
    // TODO: Integrate with actual authentication system
    console.log('🔐 GOOGLE-STYLE: Login attempt for:', email);
    
    // Simulate successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 'user_123',
          email: email,
          firstName: 'User',
          lastName: 'Account',
          role: 'CANDIDATE',
          isVerified: true,
          isActive: true
        },
        accessToken: 'access_token_' + Math.random().toString(36).substr(2, 9),
        refreshToken: 'refresh_token_' + Math.random().toString(36).substr(2, 9)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
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
