import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_FIELDS', 
            message: 'All fields are required' 
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

    // For now, return success for testing
    // TODO: Integrate with actual authentication system
    console.log('🔐 GOOGLE-STYLE: Registration attempt for:', email);
    
    // Simulate successful registration
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: 'CANDIDATE',
          isVerified: true,
          isActive: true
        },
        accessToken: 'access_token_' + Math.random().toString(36).substr(2, 9),
        refreshToken: 'refresh_token_' + Math.random().toString(36).substr(2, 9)
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
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
