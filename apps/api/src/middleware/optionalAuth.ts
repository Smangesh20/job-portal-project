import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { CacheService } from '@/utils/redis';
import { logger } from '@/utils/logger';
import { AuthenticationError } from '@ask-ya-cham/types';

const prisma = new PrismaClient();
const cacheService = new CacheService();

/**
 * Optional authentication middleware
 * Adds user info to request if token is valid, but doesn't require authentication
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      return next();
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      // Empty token, continue without user info
      return next();
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (!decoded.userId) {
        return next();
      }

      // Check cache for user data
      const cacheKey = `user:${decoded.userId}`;
      let user = await cacheService.get(cacheKey);

      if (!user) {
        // Fetch user from database
        const dbUser = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true,
            avatarUrl: true
          }
        });

        if (!dbUser || !dbUser.isActive) {
          return next();
        }

        user = JSON.stringify(dbUser);
        // Cache user data for 1 hour
        await cacheService.set(cacheKey, user, 3600);
      }

      // Add user info to request
      req.user = JSON.parse(user);
      req.isAuthenticated = true;

      next();
    } catch (jwtError) {
      // Invalid token, continue without user info
      logger.warn('Invalid JWT token in optional auth:', jwtError);
      return next();
    }
  } catch (error) {
    logger.error('Error in optional auth middleware:', error);
    // Continue without user info on error
    next();
  }
};

export default optionalAuth;
