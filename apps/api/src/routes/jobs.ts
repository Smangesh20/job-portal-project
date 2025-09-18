import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { JobController } from '@/controllers/jobController';
import { validateRequest } from '@/middleware/validation';
import { 
  createJobSchema,
  updateJobSchema,
  jobSearchSchema
} from '@/utils/validationSchemas';

const router = Router();
const jobController = new JobController();

/**
 * @route GET /api/jobs
 * @desc Get list of jobs with filtering and pagination
 * @access Private
 */
router.get(
  '/',
  authMiddleware,
  validateRequest(jobSearchSchema),
  asyncHandler(jobController.getJobs)
);

/**
 * @route GET /api/jobs/search
 * @desc Advanced job search with AI matching
 * @access Private
 */
router.post(
  '/search',
  authMiddleware,
  asyncHandler(jobController.searchJobs)
);

/**
 * @route GET /api/jobs/recommended
 * @desc Get recommended jobs for authenticated user
 * @access Private
 */
router.get(
  '/recommended',
  authMiddleware,
  asyncHandler(jobController.getRecommendedJobs)
);

/**
 * @route GET /api/jobs/saved
 * @desc Get user's saved jobs
 * @access Private
 */
router.get(
  '/saved',
  authMiddleware,
  asyncHandler(jobController.getSavedJobs)
);

/**
 * @route GET /api/jobs/:id
 * @desc Get specific job details
 * @access Private
 */
router.get(
  '/:id',
  authMiddleware,
  asyncHandler(jobController.getJobById)
);

/**
 * @route POST /api/jobs
 * @desc Create a new job posting
 * @access Private (Employer/Recruiter)
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(createJobSchema),
  asyncHandler(jobController.createJob)
);

/**
 * @route PUT /api/jobs/:id
 * @desc Update job posting
 * @access Private (Job Owner/Admin)
 */
router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateJobSchema),
  asyncHandler(jobController.updateJob)
);

/**
 * @route DELETE /api/jobs/:id
 * @desc Delete job posting
 * @access Private (Job Owner/Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(jobController.deleteJob)
);

/**
 * @route POST /api/jobs/:id/save
 * @desc Save job for later
 * @access Private
 */
router.post(
  '/:id/save',
  authMiddleware,
  asyncHandler(jobController.saveJob)
);

/**
 * @route DELETE /api/jobs/:id/save
 * @desc Remove saved job
 * @access Private
 */
router.delete(
  '/:id/save',
  authMiddleware,
  asyncHandler(jobController.unsaveJob)
);

/**
 * @route POST /api/jobs/:id/apply
 * @desc Apply to job (creates application)
 * @access Private
 */
router.post(
  '/:id/apply',
  authMiddleware,
  asyncHandler(jobController.applyToJob)
);

/**
 * @route GET /api/jobs/:id/applications
 * @desc Get job applications (for job owner)
 * @access Private (Job Owner/Admin)
 */
router.get(
  '/:id/applications',
  authMiddleware,
  asyncHandler(jobController.getJobApplications)
);

/**
 * @route GET /api/jobs/:id/analytics
 * @desc Get job analytics (for job owner)
 * @access Private (Job Owner/Admin)
 */
router.get(
  '/:id/analytics',
  authMiddleware,
  asyncHandler(jobController.getJobAnalytics)
);

/**
 * @route POST /api/jobs/:id/share
 * @desc Share job posting
 * @access Public
 */
router.post(
  '/:id/share',
  asyncHandler(jobController.shareJob)
);

/**
 * @route POST /api/jobs/:id/flag
 * @desc Flag inappropriate job posting
 * @access Private
 */
router.post(
  '/:id/flag',
  authMiddleware,
  asyncHandler(jobController.flagJob)
);

/**
 * @route GET /api/jobs/company/:companyId
 * @desc Get jobs by company
 * @access Public
 */
router.get(
  '/company/:companyId',
  asyncHandler(jobController.getJobsByCompany)
);

/**
 * @route GET /api/jobs/category/:category
 * @desc Get jobs by category
 * @access Public
 */
router.get(
  '/category/:category',
  asyncHandler(jobController.getJobsByCategory)
);

/**
 * @route GET /api/jobs/trending
 * @desc Get trending jobs
 * @access Public
 */
router.get(
  '/trending',
  asyncHandler(jobController.getTrendingJobs)
);

/**
 * @route GET /api/jobs/recent
 * @desc Get recently posted jobs
 * @access Public
 */
router.get(
  '/recent',
  asyncHandler(jobController.getRecentJobs)
);

export { router as jobRoutes };
