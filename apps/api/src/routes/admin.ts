import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware, authorize } from '@/middleware/auth';
import { AdminController } from '@/controllers/adminController';
import { validateRequest } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const adminController = new AdminController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Apply admin authorization to all routes
router.use(authorize([], 'ADMIN'));

// Validation schemas
const userManagementSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'RECRUITER', 'ADMIN']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  registrationEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  maxFileSize: z.number().positive().optional(),
  sessionTimeout: z.number().positive().optional()
});

/**
 * @route GET /api/admin/dashboard
 * @desc Get admin dashboard data
 * @access Private (Admin)
 */
router.get(
  '/dashboard',
  asyncHandler(adminController.getDashboard)
);

/**
 * @route GET /api/admin/users
 * @desc Get all users with filtering
 * @access Private (Admin)
 */
router.get(
  '/users',
  validateRequest(userManagementSchema),
  asyncHandler(adminController.getUsers)
);

/**
 * @route GET /api/admin/users/:userId
 * @desc Get specific user details
 * @access Private (Admin)
 */
router.get(
  '/users/:userId',
  asyncHandler(adminController.getUser)
);

/**
 * @route PUT /api/admin/users/:userId
 * @desc Update user details
 * @access Private (Admin)
 */
router.put(
  '/users/:userId',
  asyncHandler(adminController.updateUser)
);

/**
 * @route DELETE /api/admin/users/:userId
 * @desc Delete user
 * @access Private (Admin)
 */
router.delete(
  '/users/:userId',
  asyncHandler(adminController.deleteUser)
);

/**
 * @route POST /api/admin/users/:userId/suspend
 * @desc Suspend user account
 * @access Private (Admin)
 */
router.post(
  '/users/:userId/suspend',
  asyncHandler(adminController.suspendUser)
);

/**
 * @route POST /api/admin/users/:userId/activate
 * @desc Activate user account
 * @access Private (Admin)
 */
router.post(
  '/users/:userId/activate',
  asyncHandler(adminController.activateUser)
);

/**
 * @route GET /api/admin/jobs
 * @desc Get all jobs for admin review
 * @access Private (Admin)
 */
router.get(
  '/jobs',
  asyncHandler(adminController.getJobs)
);

/**
 * @route POST /api/admin/jobs/:jobId/approve
 * @desc Approve job posting
 * @access Private (Admin)
 */
router.post(
  '/jobs/:jobId/approve',
  asyncHandler(adminController.approveJob)
);

/**
 * @route POST /api/admin/jobs/:jobId/reject
 * @desc Reject job posting
 * @access Private (Admin)
 */
router.post(
  '/jobs/:jobId/reject',
  asyncHandler(adminController.rejectJob)
);

/**
 * @route GET /api/admin/settings
 * @desc Get system settings
 * @access Private (Admin)
 */
router.get(
  '/settings',
  asyncHandler(adminController.getSettings)
);

/**
 * @route PUT /api/admin/settings
 * @desc Update system settings
 * @access Private (Admin)
 */
router.put(
  '/settings',
  validateRequest(systemSettingsSchema),
  asyncHandler(adminController.updateSettings)
);

/**
 * @route GET /api/admin/logs
 * @desc Get system logs
 * @access Private (Admin)
 */
router.get(
  '/logs',
  asyncHandler(adminController.getLogs)
);

/**
 * @route GET /api/admin/analytics
 * @desc Get admin analytics
 * @access Private (Admin)
 */
router.get(
  '/analytics',
  asyncHandler(adminController.getAnalytics)
);

export { router as adminRoutes };
