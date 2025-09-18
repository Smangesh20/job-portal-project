import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { MatchingController } from '@/controllers/matchingController';
import { validateRequest } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const matchingController = new MatchingController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation schemas
const matchSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  jobId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  status: z.enum(['pending', 'accepted', 'rejected', 'expired']).optional()
});

/**
 * @route GET /api/matching
 * @desc Get job matches for authenticated user
 * @access Private
 */
router.get(
  '/',
  validateRequest(matchSearchSchema),
  asyncHandler(matchingController.getMatches)
);

/**
 * @route GET /api/matching/jobs/:jobId
 * @desc Get matches for a specific job
 * @access Private (Job Owner/Admin)
 */
router.get(
  '/jobs/:jobId',
  validateRequest(matchSearchSchema),
  asyncHandler(matchingController.getJobMatches)
);

/**
 * @route GET /api/matching/users/:userId
 * @desc Get matches for a specific user
 * @access Private (User Owner/Admin)
 */
router.get(
  '/users/:userId',
  validateRequest(matchSearchSchema),
  asyncHandler(matchingController.getUserMatches)
);

/**
 * @route POST /api/matching/:matchId/accept
 * @desc Accept a job match
 * @access Private
 */
router.post(
  '/:matchId/accept',
  asyncHandler(matchingController.acceptMatch)
);

/**
 * @route POST /api/matching/:matchId/reject
 * @desc Reject a job match
 * @access Private
 */
router.post(
  '/:matchId/reject',
  asyncHandler(matchingController.rejectMatch)
);

/**
 * @route GET /api/matching/stats
 * @desc Get matching statistics
 * @access Private
 */
router.get(
  '/stats',
  asyncHandler(matchingController.getMatchStats)
);

export { router as matchingRoutes };
