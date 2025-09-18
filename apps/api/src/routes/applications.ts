import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { ApplicationController } from '@/controllers/applicationController';
import { validateRequest } from '@/middleware/validation';
import { 
  createApplicationSchema,
  updateApplicationSchema
} from '@/utils/validationSchemas';

const router = Router();
const applicationController = new ApplicationController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/applications
 * @desc Get user's applications with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  asyncHandler(applicationController.getApplications)
);

/**
 * @route POST /api/applications
 * @desc Create a new job application
 * @access Private
 */
router.post(
  '/',
  validateRequest(createApplicationSchema),
  asyncHandler(applicationController.createApplication)
);

/**
 * @route GET /api/applications/:id
 * @desc Get specific application details
 * @access Private (Application Owner/Job Owner/Admin)
 */
router.get(
  '/:id',
  asyncHandler(applicationController.getApplicationById)
);

/**
 * @route PUT /api/applications/:id
 * @desc Update application details
 * @access Private (Application Owner)
 */
router.put(
  '/:id',
  validateRequest(updateApplicationSchema),
  asyncHandler(applicationController.updateApplication)
);

/**
 * @route POST /api/applications/:id/withdraw
 * @desc Withdraw application
 * @access Private (Application Owner)
 */
router.post(
  '/:id/withdraw',
  asyncHandler(applicationController.withdrawApplication)
);

/**
 * @route POST /api/applications/:id/status
 * @desc Update application status (for job owners)
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/status',
  asyncHandler(applicationController.updateApplicationStatus)
);

/**
 * @route POST /api/applications/:id/notes
 * @desc Add notes to application (for job owners)
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/notes',
  asyncHandler(applicationController.addApplicationNotes)
);

/**
 * @route GET /api/applications/:id/notes
 * @desc Get application notes
 * @access Private (Job Owner/Admin)
 */
router.get(
  '/:id/notes',
  asyncHandler(applicationController.getApplicationNotes)
);

/**
 * @route POST /api/applications/:id/interview
 * @desc Schedule interview for application
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/interview',
  asyncHandler(applicationController.scheduleInterview)
);

/**
 * @route PUT /api/applications/:id/interview/:interviewId
 * @desc Update interview details
 * @access Private (Job Owner/Admin)
 */
router.put(
  '/:id/interview/:interviewId',
  asyncHandler(applicationController.updateInterview)
);

/**
 * @route DELETE /api/applications/:id/interview/:interviewId
 * @desc Cancel interview
 * @access Private (Job Owner/Admin)
 */
router.delete(
  '/:id/interview/:interviewId',
  asyncHandler(applicationController.cancelInterview)
);

/**
 * @route POST /api/applications/:id/feedback
 * @desc Add feedback to application
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/feedback',
  asyncHandler(applicationController.addApplicationFeedback)
);

/**
 * @route GET /api/applications/:id/feedback
 * @desc Get application feedback
 * @access Private (Application Owner/Job Owner/Admin)
 */
router.get(
  '/:id/feedback',
  asyncHandler(applicationController.getApplicationFeedback)
);

/**
 * @route POST /api/applications/:id/rating
 * @desc Rate application (for job owners)
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/rating',
  asyncHandler(applicationController.rateApplication)
);

/**
 * @route GET /api/applications/:id/analytics
 * @desc Get application analytics
 * @access Private (Application Owner/Job Owner/Admin)
 */
router.get(
  '/:id/analytics',
  asyncHandler(applicationController.getApplicationAnalytics)
);

/**
 * @route POST /api/applications/:id/share
 * @desc Share application with team members
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/share',
  asyncHandler(applicationController.shareApplication)
);

/**
 * @route POST /api/applications/:id/archive
 * @desc Archive application
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/archive',
  asyncHandler(applicationController.archiveApplication)
);

/**
 * @route POST /api/applications/:id/unarchive
 * @desc Unarchive application
 * @access Private (Job Owner/Admin)
 */
router.post(
  '/:id/unarchive',
  asyncHandler(applicationController.unarchiveApplication)
);

/**
 * @route GET /api/applications/job/:jobId
 * @desc Get all applications for a specific job
 * @access Private (Job Owner/Admin)
 */
router.get(
  '/job/:jobId',
  asyncHandler(applicationController.getApplicationsByJob)
);

/**
 * @route GET /api/applications/user/:userId
 * @desc Get all applications for a specific user (admin only)
 * @access Private (Admin)
 */
router.get(
  '/user/:userId',
  asyncHandler(applicationController.getApplicationsByUser)
);

/**
 * @route GET /api/applications/stats
 * @desc Get application statistics
 * @access Private
 */
router.get(
  '/stats',
  asyncHandler(applicationController.getApplicationStats)
);

/**
 * @route POST /api/applications/:id/duplicate
 * @desc Duplicate application for another job
 * @access Private (Application Owner)
 */
router.post(
  '/:id/duplicate',
  asyncHandler(applicationController.duplicateApplication)
);

/**
 * @route GET /api/applications/:id/timeline
 * @desc Get application timeline/activity log
 * @access Private (Application Owner/Job Owner/Admin)
 */
router.get(
  '/:id/timeline',
  asyncHandler(applicationController.getApplicationTimeline)
);

export { router as applicationRoutes };
