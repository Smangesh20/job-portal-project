import { NextRequest, NextResponse } from 'next/server';
import { LocalAuthService } from '@/lib/local-auth';

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

    console.log('🔐 GOOGLE-STYLE: Registration attempt for:', email, 'Name:', firstName, lastName);
    
    // Use the actual authentication service to register the user
    const authService = LocalAuthService.getInstance();
    const registerResult = await authService.register({
      email,
      password,
      firstName,
      lastName
    });
    
    if (registerResult.success && registerResult.data) {
      console.log('🔐 GOOGLE-STYLE: Registration successful for:', email, 'User:', registerResult.data.user);
      
      // ENSURE USER DATA IS COMPLETE
      const userData = {
        ...registerResult.data.user,
        firstName: registerResult.data.user.firstName || firstName,
        lastName: registerResult.data.user.lastName || lastName,
        email: registerResult.data.user.email || email,
        name: `${registerResult.data.user.firstName || firstName} ${registerResult.data.user.lastName || lastName}`
      }
      
      console.log('🔐 GOOGLE-STYLE: Complete user data:', userData);
      
      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        data: {
          user: userData,
          accessToken: registerResult.data.accessToken,
          refreshToken: registerResult.data.refreshToken
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'REGISTRATION_FAILED', 
            message: registerResult.error?.message || 'Registration failed' 
          } 
        },
        { status: 400 }
      );
    }

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
