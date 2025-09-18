import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { jobRoutes } from './jobs';
import { applicationRoutes } from './applications';
import { matchingRoutes } from './matching';
import { analyticsRoutes } from './analytics';
import { chatRoutes } from './chat';
import { notificationRoutes } from './notifications';
import { adminRoutes } from './admin';
import { webhookRoutes } from './webhooks';
import { companyRoutes } from './companies';
import healthRoutes from './health';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/matching', matchingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/companies', companyRoutes);
router.use('/', healthRoutes);

export { router as apiRoutes };
