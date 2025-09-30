import { Router } from 'express';
import { GoogleLikeAuthController } from '@/controllers/googleLikeAuthController';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { rateLimit } from 'express-rate-limit';

const router = Router();
const authController = new GoogleLikeAuthController();

// Rate limiting for different endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 OTP requests per window
  message: {
    success: false,
    error: 'Too many OTP requests. Please wait before trying again.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const mfaRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // 10 MFA attempts per window
  message: {
    success: false,
    error: 'Too many MFA attempts. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST /api/auth/google-like/send-otp
 * @desc Send OTP for passwordless authentication
 * @access Public
 */
router.post('/send-otp', 
  otpRateLimit,
  asyncHandler(authController.sendOtp)
);

/**
 * @route POST /api/auth/google-like/verify-otp
 * @desc Verify OTP for passwordless authentication
 * @access Public
 */
router.post('/verify-otp',
  authRateLimit,
  asyncHandler(authController.verifyOtp)
);

/**
 * @route POST /api/auth/google-like/social
 * @desc Social authentication (Google, Microsoft, etc.)
 * @access Public
 */
router.post('/social',
  authRateLimit,
  asyncHandler(authController.socialAuth)
);

/**
 * @route POST /api/auth/google-like/enhanced-login
 * @desc Enhanced login with MFA support
 * @access Public
 */
router.post('/enhanced-login',
  authRateLimit,
  asyncHandler(authController.enhancedLogin)
);

/**
 * @route POST /api/auth/google-like/setup-mfa
 * @desc Setup MFA for user
 * @access Private
 */
router.post('/setup-mfa',
  authenticate,
  asyncHandler(authController.setupMfa)
);

/**
 * @route POST /api/auth/google-like/verify-mfa-setup
 * @desc Verify MFA setup
 * @access Private
 */
router.post('/verify-mfa-setup',
  authenticate,
  mfaRateLimit,
  asyncHandler(authController.verifyMfaSetup)
);

/**
 * @route POST /api/auth/google-like/verify-mfa
 * @desc Verify MFA during login
 * @access Public
 */
router.post('/verify-mfa',
  mfaRateLimit,
  asyncHandler(authController.verifyMfa)
);

/**
 * @route POST /api/auth/google-like/trust-device
 * @desc Trust current device
 * @access Private
 */
router.post('/trust-device',
  authenticate,
  asyncHandler(authController.trustDevice)
);

/**
 * @route POST /api/auth/google-like/password-recovery
 * @desc Enhanced password recovery with OTP
 * @access Public
 */
router.post('/password-recovery',
  otpRateLimit,
  asyncHandler(authController.enhancedPasswordRecovery)
);

/**
 * @route POST /api/auth/google-like/reset-password
 * @desc Reset password with OTP verification
 * @access Public
 */
router.post('/reset-password',
  authRateLimit,
  asyncHandler(authController.resetPasswordWithOtp)
);

/**
 * @route GET /api/auth/google-like/security-status
 * @desc Get user security status
 * @access Private
 */
router.get('/security-status',
  authenticate,
  asyncHandler(authController.getSecurityStatus)
);

export default router;







