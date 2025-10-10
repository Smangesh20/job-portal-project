import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  setCorsHeaders,
  handleOptions,
  isValidEmail,
  generateOTP,
  storeOTP,
  sendOTPEmail,
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
    const { email, action } = req.body;

    // Validate inputs
    if (!email || !action) {
      return errorResponse(res, 'Email and action are required');
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format');
    }

    if (!['signin', 'signup'].includes(action)) {
      return errorResponse(res, 'Invalid action. Must be signin or signup');
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP
    storeOTP(email, otp, action);

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return errorResponse(res, 'Failed to send verification code', 500);
    }

    // For development, include OTP in response (REMOVE IN PRODUCTION)
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.VERCEL_ENV;
    
    return successResponse(res, {
      message: `Verification code sent to ${email}`,
      ...(isDevelopment ? { otp } : {}) // Include OTP only in development
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
}

