import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { UserController } from '@/controllers/userController';
import { validateRequest } from '@/middleware/validation';
import { 
  updateProfileSchema,
  fileUploadSchema
} from '@/utils/validationSchemas';
import { upload } from '@/middleware/upload';

const router = Router();
const userController = new UserController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get(
  '/me',
  asyncHandler(userController.getCurrentUser)
);

/**
 * @route PUT /api/users/me
 * @desc Update current user profile
 * @access Private
 */
router.put(
  '/me',
  validateRequest(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);

/**
 * @route GET /api/users/:id
 * @desc Get user profile by ID
 * @access Private
 */
router.get(
  '/:id',
  asyncHandler(userController.getUserById)
);

/**
 * @route PUT /api/users/:id
 * @desc Update user profile by ID (admin only)
 * @access Private (Admin)
 */
router.put(
  '/:id',
  validateRequest(updateProfileSchema),
  asyncHandler(userController.updateUserById)
);

/**
 * @route POST /api/users/:id/avatar
 * @desc Upload user avatar
 * @access Private
 */
router.post(
  '/:id/avatar',
  upload.single('avatar'),
  asyncHandler(userController.uploadAvatar)
);

/**
 * @route DELETE /api/users/:id/avatar
 * @desc Delete user avatar
 * @access Private
 */
router.delete(
  '/:id/avatar',
  asyncHandler(userController.deleteAvatar)
);

/**
 * @route POST /api/users/:id/resume
 * @desc Upload user resume
 * @access Private
 */
router.post(
  '/:id/resume',
  upload.single('resume'),
  asyncHandler(userController.uploadResume)
);

/**
 * @route GET /api/users/:id/resume
 * @desc Get user resume
 * @access Private
 */
router.get(
  '/:id/resume',
  asyncHandler(userController.getResume)
);

/**
 * @route DELETE /api/users/:id/resume
 * @desc Delete user resume
 * @access Private
 */
router.delete(
  '/:id/resume',
  asyncHandler(userController.deleteResume)
);

/**
 * @route GET /api/users/:id/applications
 * @desc Get user's applications
 * @access Private
 */
router.get(
  '/:id/applications',
  asyncHandler(userController.getUserApplications)
);

/**
 * @route GET /api/users/:id/jobs
 * @desc Get user's job postings (for employers)
 * @access Private
 */
router.get(
  '/:id/jobs',
  asyncHandler(userController.getUserJobs)
);

/**
 * @route GET /api/users/:id/matches
 * @desc Get user's job matches
 * @access Private
 */
router.get(
  '/:id/matches',
  asyncHandler(userController.getUserMatches)
);

/**
 * @route GET /api/users/:id/notifications
 * @desc Get user's notifications
 * @access Private
 */
router.get(
  '/:id/notifications',
  asyncHandler(userController.getUserNotifications)
);

/**
 * @route PUT /api/users/:id/notifications/preferences
 * @desc Update user's notification preferences
 * @access Private
 */
router.put(
  '/:id/notifications/preferences',
  asyncHandler(userController.updateNotificationPreferences)
);

/**
 * @route GET /api/users/:id/analytics
 * @desc Get user analytics
 * @access Private
 */
router.get(
  '/:id/analytics',
  asyncHandler(userController.getUserAnalytics)
);

/**
 * @route POST /api/users/:id/deactivate
 * @desc Deactivate user account
 * @access Private
 */
router.post(
  '/:id/deactivate',
  asyncHandler(userController.deactivateAccount)
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user account (admin only)
 * @access Private (Admin)
 */
router.delete(
  '/:id',
  asyncHandler(userController.deleteUser)
);

export { router as userRoutes };
