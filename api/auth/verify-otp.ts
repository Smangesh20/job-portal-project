import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  setCorsHeaders,
  handleOptions,
  isValidEmail,
  verifyOTP,
  createOrUpdateUser,
  getUserByEmail,
  errorResponse,
  successResponse
} from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405);
  }

  try {
    const { email, otp, action } = req.body;

    // Validate inputs
    if (!email || !otp || !action) {
      return errorResponse(res, 'Email, OTP, and action are required');
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format');
    }

    if (!['signin', 'signup'].includes(action)) {
      return errorResponse(res, 'Invalid action. Must be signin or signup');
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp, action);

    if (!isValid) {
      return errorResponse(res, 'Invalid or expired verification code', 401);
    }

    // Handle signup vs signin
    if (action === 'signup') {
      // Create new user
      const user = createOrUpdateUser({
        email: email.toLowerCase().trim(),
        name: email.split('@')[0], // Use email prefix as default name
        provider: 'email',
        verified_email: true
      });

      return successResponse(res, {
        message: 'Account created successfully',
        user,
        token: generateToken(user.id)
      });

    } else {
      // Sign in - check if user exists
      const user = getUserByEmail(email);

      if (!user) {
        return errorResponse(res, 'User not found. Please sign up first.', 404);
      }

      // Update last login
      user.last_login = new Date().toISOString();

      return successResponse(res, {
        message: 'Signed in successfully',
        user,
        token: generateToken(user.id)
      });
    }

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

// Simple token generation (use JWT in production)
function generateToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

