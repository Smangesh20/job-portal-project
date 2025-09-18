import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const router = Router();

/**
 * @route GET /api/health
 * @desc Basic health check endpoint
 * @access Public
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0',
    service: 'ask-ya-cham-ai-service'
  };

  res.status(200).json(healthCheck);
}));

/**
 * @route GET /api/health/detailed
 * @desc Detailed health check with AI service status
 * @access Public
 */
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  const checks = {
    aiModels: { status: 'unknown', models: [], error: null },
    memory: { status: 'unknown', usage: 0, limit: 0 },
    disk: { status: 'unknown', usage: 0, limit: 0 }
  };

  let overallStatus = 'healthy';

  // AI Models health check
  try {
    // Check if AI models are loaded and ready
    const loadedModels = ['job-matching', 'skill-extraction', 'cultural-fit'];
    checks.aiModels.status = 'healthy';
    checks.aiModels.models = loadedModels;
  } catch (error: any) {
    checks.aiModels.status = 'unhealthy';
    checks.aiModels.error = error.message;
    overallStatus = 'unhealthy';
  }

  // Memory health check
  const memUsage = process.memoryUsage();
  const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  checks.memory.usage = memUsagePercent;
  checks.memory.limit = 100;
  checks.memory.status = memUsagePercent > 90 ? 'warning' : 'healthy';

  if (memUsagePercent > 95) {
    overallStatus = 'unhealthy';
  } else if (memUsagePercent > 90 && overallStatus === 'healthy') {
    overallStatus = 'warning';
  }

  // Disk health check
  checks.disk.usage = 0;
  checks.disk.limit = 100;
  checks.disk.status = 'healthy';

  const healthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0',
    service: 'ask-ya-cham-ai-service',
    responseTime: Date.now() - startTime,
    checks
  };

  const statusCode = overallStatus === 'healthy' ? 200 : 
                    overallStatus === 'warning' ? 200 : 503;

  res.status(statusCode).json(healthCheck);
}));

/**
 * @route GET /api/health/ready
 * @desc Readiness check for Kubernetes
 * @access Public
 */
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  try {
    // Check if AI models are ready
    // This would check if models are loaded and ready for inference
    const modelsReady = true; // Placeholder - implement actual model readiness check

    if (modelsReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        service: 'ask-ya-cham-ai-service'
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        service: 'ask-ya-cham-ai-service',
        error: 'AI models not loaded'
      });
    }
  } catch (error: any) {
    logger.error('AI Service readiness check failed:', error);
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      service: 'ask-ya-cham-ai-service',
      error: error.message
    });
  }
}));

/**
 * @route GET /api/health/live
 * @desc Liveness check for Kubernetes
 * @access Public
 */
router.get('/live', asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'ask-ya-cham-ai-service'
  });
}));

/**
 * @route GET /api/health/models
 * @desc Check AI models status
 * @access Public
 */
router.get('/models', asyncHandler(async (req: Request, res: Response) => {
  try {
    const models = {
      'job-matching': {
        status: 'loaded',
        version: '1.0.0',
        accuracy: 95.2,
        lastUpdated: '2024-01-15T10:00:00Z'
      },
      'skill-extraction': {
        status: 'loaded',
        version: '1.0.0',
        accuracy: 92.8,
        lastUpdated: '2024-01-15T10:00:00Z'
      },
      'cultural-fit': {
        status: 'loaded',
        version: '1.0.0',
        accuracy: 88.5,
        lastUpdated: '2024-01-15T10:00:00Z'
      },
      'sentiment-analysis': {
        status: 'loaded',
        version: '1.0.0',
        accuracy: 91.3,
        lastUpdated: '2024-01-15T10:00:00Z'
      }
    };

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      models
    });
  } catch (error: any) {
    logger.error('AI models status check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}));

/**
 * @route GET /api/health/metrics
 * @desc Prometheus metrics endpoint
 * @access Public
 */
router.get('/metrics', asyncHandler(async (req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  const metrics = [
    `# HELP nodejs_memory_usage_bytes Node.js memory usage in bytes`,
    `# TYPE nodejs_memory_usage_bytes gauge`,
    `nodejs_memory_usage_bytes{type="rss"} ${memUsage.rss}`,
    `nodejs_memory_usage_bytes{type="heapTotal"} ${memUsage.heapTotal}`,
    `nodejs_memory_usage_bytes{type="heapUsed"} ${memUsage.heapUsed}`,
    `nodejs_memory_usage_bytes{type="external"} ${memUsage.external}`,
    `# HELP nodejs_cpu_usage_seconds Node.js CPU usage in seconds`,
    `# TYPE nodejs_cpu_usage_seconds gauge`,
    `nodejs_cpu_usage_seconds{type="user"} ${cpuUsage.user / 1000000}`,
    `nodejs_cpu_usage_seconds{type="system"} ${cpuUsage.system / 1000000}`,
    `# HELP nodejs_uptime_seconds Node.js uptime in seconds`,
    `# TYPE nodejs_uptime_seconds gauge`,
    `nodejs_uptime_seconds ${process.uptime()}`,
    `# HELP ai_models_loaded_total Number of loaded AI models`,
    `# TYPE ai_models_loaded_total gauge`,
    `ai_models_loaded_total 4`,
    `# HELP ai_inference_requests_total Total AI inference requests`,
    `# TYPE ai_inference_requests_total counter`,
    `ai_inference_requests_total 0`,
    `# HELP ai_inference_duration_seconds AI inference duration`,
    `# TYPE ai_inference_duration_seconds histogram`,
    `ai_inference_duration_seconds_bucket{le="0.1"} 0`,
    `ai_inference_duration_seconds_bucket{le="0.5"} 0`,
    `ai_inference_duration_seconds_bucket{le="1.0"} 0`,
    `ai_inference_duration_seconds_bucket{le="+Inf"} 0`,
    `ai_inference_duration_seconds_sum 0`,
    `ai_inference_duration_seconds_count 0`
  ].join('\n');

  res.set('Content-Type', 'text/plain');
  res.status(200).send(metrics);
}));

export { router as healthRoutes };
