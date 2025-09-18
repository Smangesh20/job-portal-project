import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { getRedisService } from '../utils/redis';
import crypto from 'crypto';

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number;
  suspiciousActivityThreshold: number;
  rateLimitWindow: number;
  maxRequestsPerWindow: number;
  enableIPWhitelist: boolean;
  enableDeviceFingerprinting: boolean;
  enableGeolocationTracking: boolean;
}

const defaultSecurityConfig: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  suspiciousActivityThreshold: 10,
  rateLimitWindow: 15,
  maxRequestsPerWindow: 100,
  enableIPWhitelist: false,
  enableDeviceFingerprinting: true,
  enableGeolocationTracking: true
};

export class SecurityService {
  private redis: any;
  private config: SecurityConfig;

  constructor() {
    this.redis = getRedisService();
    this.config = { ...defaultSecurityConfig };
  }

  /**
   * Check for suspicious activity
   */
  async checkSuspiciousActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientIP = req.ip || '';
      const userAgent = req.get('User-Agent') || '';
      const userId = req.user?.id;

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /sql.*injection/i,
        /<script.*>/i,
        /union.*select/i,
        /drop.*table/i,
        /exec.*\(/i,
        /eval.*\(/i,
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i
      ];

      const requestBody = JSON.stringify(req.body || {});
      const requestQuery = JSON.stringify(req.query || {});
      const requestParams = JSON.stringify(req.params || {});
      const fullRequest = `${requestBody}${requestQuery}${requestParams}`;

      const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(fullRequest) || pattern.test(userAgent)
      );

      if (isSuspicious) {
        await this.logSecurityEvent({
          type: 'SUSPICIOUS_ACTIVITY_DETECTED',
          severity: 'HIGH',
          description: 'Suspicious activity pattern detected',
          ipAddress: clientIP,
          userAgent,
          userId,
          metadata: {
            patterns: suspiciousPatterns.filter(pattern => 
              pattern.test(fullRequest) || pattern.test(userAgent)
            ),
            requestBody: req.body,
            requestQuery: req.query,
            requestParams: req.params
          }
        });

        res.status(403).json({
      success: false,
          error: {
            code: 'SUSPICIOUS_ACTIVITY',
            message: 'Suspicious activity detected. Request blocked for security reasons.'
          }
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Security check error:', error);
      next();
    }
  }

  /**
   * Check for brute force attacks
   */
  async checkBruteForce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientIP = req.ip || '';
      const userId = req.user?.id;
      const endpoint = req.path;

      const key = `brute_force:${clientIP}:${endpoint}:${userId || 'anonymous'}`;
      const attempts = await this.redis.get(key) || 0;
      const attemptCount = parseInt(attempts.toString());

      if (attemptCount >= this.config.suspiciousActivityThreshold) {
        await this.logSecurityEvent({
          type: 'BRUTE_FORCE_ATTEMPT',
          severity: 'HIGH',
          description: 'Brute force attack detected',
          ipAddress: clientIP,
          userAgent: req.get('User-Agent') || '',
          userId,
          metadata: {
            endpoint,
            attemptCount,
            threshold: this.config.suspiciousActivityThreshold
          }
        });

        res.status(429).json({
        success: false,
          error: {
            code: 'TOO_MANY_ATTEMPTS',
            message: 'Too many attempts. Please try again later.',
            retryAfter: this.config.lockoutDuration * 60
          }
        });
        return;
      }

      await this.redis.set(key, attemptCount + 1, this.config.lockoutDuration * 60);
      next();
    } catch (error) {
      logger.error('Brute force check error:', error);
      next();
    }
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(req: Request): string {
    const components = [
      req.get('User-Agent') || '',
      req.get('Accept-Language') || '',
      req.get('Accept-Encoding') || '',
      req.get('Accept') || '',
      req.get('Connection') || '',
      req.get('Upgrade-Insecure-Requests') || '',
      req.get('Sec-Fetch-Dest') || '',
      req.get('Sec-Fetch-Mode') || '',
      req.get('Sec-Fetch-Site') || '',
      req.get('Sec-Fetch-User') || '',
      req.get('Sec-Ch-Ua') || '',
      req.get('Sec-Ch-Ua-Mobile') || '',
      req.get('Sec-Ch-Ua-Platform') || ''
    ];

    const fingerprint = crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex');

    return fingerprint;
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(event: any): Promise<void> {
    try {
      logger.warn('Security event:', event);
      const eventKey = `security_event:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      await this.redis.set(eventKey, JSON.stringify(event), 24 * 60 * 60);
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  }
}

export const securityService = new SecurityService();

// Middleware functions
export const checkSuspiciousActivity = securityService.checkSuspiciousActivity.bind(securityService);
export const checkBruteForce = securityService.checkBruteForce.bind(securityService);