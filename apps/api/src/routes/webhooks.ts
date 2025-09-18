import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { WebhookController } from '@/controllers/webhookController';
import { validateRequest } from '@/middleware/validation';
import { z } from 'zod';

const router = Router();
const webhookController = new WebhookController();

// Validation schemas
const webhookPayloadSchema = z.object({
  event: z.string(),
  data: z.object({}).passthrough(),
  timestamp: z.string().datetime(),
  signature: z.string().optional()
});

/**
 * @route POST /api/webhooks/payment
 * @desc Handle payment webhook events
 * @access Public (with signature verification)
 */
router.post(
  '/payment',
  asyncHandler(webhookController.handlePaymentWebhook)
);

/**
 * @route POST /api/webhooks/email
 * @desc Handle email service webhook events
 * @access Public (with signature verification)
 */
router.post(
  '/email',
  asyncHandler(webhookController.handleEmailWebhook)
);

/**
 * @route POST /api/webhooks/linkedin
 * @desc Handle LinkedIn webhook events
 * @access Public (with signature verification)
 */
router.post(
  '/linkedin',
  asyncHandler(webhookController.handleLinkedInWebhook)
);

/**
 * @route POST /api/webhooks/analytics
 * @desc Handle analytics webhook events
 * @access Public (with signature verification)
 */
router.post(
  '/analytics',
  asyncHandler(webhookController.handleAnalyticsWebhook)
);

/**
 * @route POST /api/webhooks/security
 * @desc Handle security webhook events
 * @access Public (with signature verification)
 */
router.post(
  '/security',
  asyncHandler(webhookController.handleSecurityWebhook)
);

/**
 * @route GET /api/webhooks/health
 * @desc Webhook health check
 * @access Public
 */
router.get(
  '/health',
  asyncHandler(webhookController.healthCheck)
);

export { router as webhookRoutes };
