import { Router } from 'express';
import { GoogleAuthController } from '@/controllers/googleAuthController';
import { rateLimiter } from '@/middleware/rateLimiter';
import { validateRequest } from '@/middleware/validation';
import { body } from 'express-validator';

const router = Router();
const googleAuthController = new GoogleAuthController();

/**
 * @route POST /api/auth/google/send-otp
 * @desc Send OTP for passwordless login
 * @access Public
 */
router.post('/send-otp', 
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 attempts per 15 minutes
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('type')
      .optional()
      .isIn(['login', 'password_reset', 'verification'])
      .withMessage('Invalid OTP type')
  ],
  validateRequest,
  googleAuthController.sendOTP
);

/**
 * @route POST /api/auth/google/verify-otp
 * @desc Verify OTP and authenticate user
 * @access Public
 */
router.post('/verify-otp',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), // 10 attempts per 15 minutes
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6-digit number'),
    body('type')
      .optional()
      .isIn(['login', 'password_reset', 'verification'])
      .withMessage('Invalid OTP type')
  ],
  validateRequest,
  googleAuthController.verifyOTP
);

/**
 * @route POST /api/auth/google/login
 * @desc Google Social Login
 * @access Public
 */
router.post('/login',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), // 10 attempts per 15 minutes
  [
    body('googleUser.email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('googleUser.firstName')
      .notEmpty()
      .withMessage('First name is required'),
    body('googleUser.lastName')
      .notEmpty()
      .withMessage('Last name is required')
  ],
  validateRequest,
  googleAuthController.googleLogin
);

/**
 * @route POST /api/auth/google/password-reset
 * @desc Enhanced password reset
 * @access Public
 */
router.post('/password-reset',
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }), // 5 attempts per hour
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],
  validateRequest,
  googleAuthController.enhancedPasswordReset
);

/**
 * @route POST /api/auth/google/setup-mfa
 * @desc Setup Multi-Factor Authentication
 * @access Private
 */
router.post('/setup-mfa',
  // Add authentication middleware here
  googleAuthController.setupMFA
);

/**
 * @route POST /api/auth/google/verify-mfa
 * @desc Verify MFA code
 * @access Private
 */
router.post('/verify-mfa',
  // Add authentication middleware here
  [
    body('code')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('MFA code must be a 6-digit number')
  ],
  validateRequest,
  googleAuthController.verifyMFA
);

/**
 * @route POST /api/auth/google/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout',
  // Add authentication middleware here
  googleAuthController.logout
);

export default router;

















