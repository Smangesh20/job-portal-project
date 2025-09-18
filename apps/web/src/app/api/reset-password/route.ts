import { NextRequest, NextResponse } from 'next/server';
import { mockAPI } from '@/lib/mock-api';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: { message: 'Token, new password, and confirm password are required.' } },
        { status: 400 }
      );
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: { message: 'Passwords do not match.' } },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: { message: 'Password must be at least 8 characters long.' } },
        { status: 400 }
      );
    }

    console.log(`🔄 Password reset attempted for token: ${token}`);
    console.log(`🔒 New password received (length: ${newPassword.length})`);

    // Use mock API to actually reset the password
    const result = await mockAPI.resetPassword(token, newPassword);

    if (result.success) {
      console.log(`✅ Password reset successful via mock API`);
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          instructions: 'Your password has been updated successfully.',
          nextSteps: 'You can now login with your new password.',
          securityNote: 'For security reasons, please log out of all other devices if you suspect unauthorized access.'
        }
      });
    } else {
      console.log(`❌ Password reset failed: ${result.error}`);
      return NextResponse.json(
        { 
          success: false, 
          error: { message: result.message || 'Failed to reset password' } 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error in reset-password API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: 'An error occurred while resetting your password' } 
      },
      { status: 500 }
    );
  }
}
