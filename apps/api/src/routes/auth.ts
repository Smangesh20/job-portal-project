import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authRateLimit } from '@/middleware/auth';
import { AuthController } from '@/controllers/authController';
import { validateRequest } from '@/middleware/validation';
import { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema
} from '@/utils/validationSchemas';

const router = Router();
const authController = new AuthController();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler(authController.register)
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post(
  '/logout',
  asyncHandler(authController.logout)
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh',
  asyncHandler(authController.refreshToken)
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post(
  '/change-password',
  validateRequest(changePasswordSchema),
  asyncHandler(authController.changePassword)
);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user email
 * @access Public
 */
router.post(
  '/verify-email',
  validateRequest(verifyEmailSchema),
  asyncHandler(authController.verifyEmail)
);

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification
 * @access Private
 */
router.post(
  '/resend-verification',
  asyncHandler(authController.resendVerification)
);

/**
 * @route POST /api/auth/google
 * @desc Google OAuth login
 * @access Public
 */
router.post(
  '/google',
  asyncHandler(authController.googleAuth)
);

/**
 * @route POST /api/auth/linkedin
 * @desc LinkedIn OAuth login
 * @access Public
 */
router.post(
  '/linkedin',
  asyncHandler(authController.linkedinAuth)
);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get(
  '/me',
  asyncHandler(authController.getCurrentUser)
);

/**
 * @route POST /api/auth/two-factor/setup
 * @desc Setup two-factor authentication
 * @access Private
 */
router.post(
  '/two-factor/setup',
  asyncHandler(authController.setupTwoFactor)
);

/**
 * @route POST /api/auth/two-factor/verify
 * @desc Verify two-factor authentication
 * @access Private
 */
router.post(
  '/two-factor/verify',
  asyncHandler(authController.verifyTwoFactor)
);

/**
 * @route DELETE /api/auth/two-factor/disable
 * @desc Disable two-factor authentication
 * @access Private
 */
router.delete(
  '/two-factor/disable',
  asyncHandler(authController.disableTwoFactor)
);

export { router as authRoutes };
