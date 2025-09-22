import { NextRequest, NextResponse } from 'next/server';
import { LocalAuthService } from '@/lib/local-auth';

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

    console.log('🔐 GOOGLE-STYLE: Login attempt for:', email);
    
    // Use the actual authentication service
    const authService = LocalAuthService.getInstance();
    const authResult = await authService.login(email, password);
    
    if (authResult.success && authResult.data) {
      console.log('🔐 GOOGLE-STYLE: Login successful for:', email, 'User:', authResult.data.user);
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        data: {
          user: authResult.data.user,
          accessToken: authResult.data.accessToken,
          refreshToken: authResult.data.refreshToken
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_CREDENTIALS', 
            message: 'Invalid email or password' 
          } 
        },
        { status: 401 }
      );
    }

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
