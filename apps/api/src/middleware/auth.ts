import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { getDatabaseClient } from '@/database';
import { 
  AuthenticationError, 
  AuthorizationError, 
  TokenExpiredError, 
  InvalidTokenError,
  AccountLockedError,
  EmailNotVerifiedError,
  TwoFactorRequiredError,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity
} from '@ask-ya-cham/types';

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      session?: any;
    }
  }
}

// JWT token generation
export const generateTokens = (user: AuthUser): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      permissions: user.permissions 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// JWT token verification
export const verifyToken = (token: string, isRefresh: boolean = false): any => {
  try {
    const secret = isRefresh ? config.jwt.refreshSecret : config.jwt.secret;
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
};

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config.security.bcryptRounds;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    // Get user from database
    const db = getDatabaseClient();
    if (!db) {
      throw new AuthenticationError('Database not available');
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        profileImage: true,
        lastLoginAt: true,
      }
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    if (!user.isVerified) {
      throw new EmailNotVerifiedError('Email not verified');
    }

    // Check for account lockout
    const lockoutCheck = await checkAccountLockout(user.id);
    if (lockoutCheck.isLocked) {
      throw new AccountLockedError('Account is locked due to suspicious activity');
    }

    // Log security event
    await logSecurityEvent({
      userId: user.id,
      type: SecurityEventType.LOGIN_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      description: 'User authenticated successfully',
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || '',
    });

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      profileImage: user.profileImage,
      permissions: await getUserPermissions(user.id, user.role),
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware
export const authorize = (requiredPermissions: string[] = [], requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Check role if specified
    if (requiredRole && req.user.role !== requiredRole) {
      throw new AuthorizationError('Insufficient role permissions');
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission => 
        req.user!.permissions.includes(permission)
      );

      if (!hasPermission) {
        throw new AuthorizationError('Insufficient permissions');
      }
    }

    next();
  };
};

// Optional authentication middleware (doesn't throw if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      const db = getDatabaseClient();
      if (db) {
        const user = await db.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
            isActive: true,
            profileImage: true,
          }
        });

        if (user && user.isActive && user.isVerified) {
          req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
            profileImage: user.profileImage,
            permissions: await getUserPermissions(user.id, user.role),
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
};

// Rate limiting for authentication endpoints
export const authRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  // This would typically use Redis for distributed rate limiting
  // For now, we'll implement a simple check
  const ip = req.ip || req.connection.remoteAddress || '';
  const key = `auth_attempts:${ip}`;
  
  // In a real implementation, this would check Redis
  // For now, we'll just pass through
  next();
};

// Account lockout check
export const checkAccountLockout = async (userId: string): Promise<{ isLocked: boolean; unlockAt?: Date }> => {
  const db = getDatabaseClient();
  if (!db) {
    return { isLocked: false };
  }

  try {
    const lockoutRecord = await db.accountLockout.findFirst({
      where: { 
        userId,
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });

    if (lockoutRecord) {
      return { isLocked: true, unlockAt: lockoutRecord.expiresAt };
    }

    return { isLocked: false };
  } catch (error) {
    logger.error('Error checking account lockout:', error);
    return { isLocked: false };
  }
};

// Get user permissions
export const getUserPermissions = async (userId: string, role: string): Promise<string[]> => {
  const db = getDatabaseClient();
  if (!db) {
    return [];
  }

  try {
    // Get role-based permissions
    const rolePermissions = await db.role.findUnique({
      where: { name: role },
      include: { permissions: true }
    });

    const permissions = rolePermissions?.permissions.map(p => p.name) || [];

    // Get user-specific permissions
    const userPermissions = await db.userPermission.findMany({
      where: { userId }
    });

    const userPermissionNames = userPermissions.map(p => p.permission);

    return [...new Set([...permissions, ...userPermissionNames])];
  } catch (error) {
    logger.error('Error getting user permissions:', error);
    return [];
  }
};

// Log security event
export const logSecurityEvent = async (event: Omit<SecurityEvent, 'id' | 'createdAt'>): Promise<void> => {
  const db = getDatabaseClient();
  if (!db) {
    return;
  }

  try {
    await db.securityEvent.create({
      data: {
        userId: event.userId,
        type: event.type,
        severity: event.severity,
        description: event.description,
        metadata: event.metadata,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        location: event.location,
      }
    });
  } catch (error) {
    logger.error('Error logging security event:', error);
  }
};

// Two-factor authentication middleware
export const requireTwoFactor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const db = getDatabaseClient();
  if (!db) {
    throw new AuthenticationError('Database not available');
  }

  const twoFactorSetup = await db.twoFactorSetup.findUnique({
    where: { userId: req.user.id }
  });

  if (!twoFactorSetup || !twoFactorSetup.isEnabled) {
    throw new TwoFactorRequiredError('Two-factor authentication is required');
  }

  // Check if 2FA was recently verified (within session)
  const session = req.session;
  if (!session || !session.twoFactorVerified || session.twoFactorVerified < new Date(Date.now() - 30 * 60 * 1000)) {
    throw new TwoFactorRequiredError('Two-factor authentication verification required');
  }

  next();
};

// Device verification middleware
export const verifyDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const deviceFingerprint = req.fingerprint;
  const db = getDatabaseClient();
  
  if (!db || !deviceFingerprint) {
    next();
    return;
  }

  try {
    const device = await db.device.findFirst({
      where: {
        userId: req.user.id,
        fingerprint: JSON.stringify(deviceFingerprint)
      }
    });

    if (!device) {
      // New device - log security event
      await logSecurityEvent({
        userId: req.user.id,
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        severity: SecurityEventSeverity.MEDIUM,
        description: 'Login from new device',
        ipAddress: req.ip || '',
        userAgent: req.get('User-Agent') || '',
        metadata: { deviceFingerprint }
      });
    }
  } catch (error) {
    logger.error('Error verifying device:', error);
  }

  next();
};

// Session management
export const createSession = async (userId: string, deviceInfo: any): Promise<string> => {
  const db = getDatabaseClient();
  if (!db) {
    throw new Error('Database not available');
  }

  const session = await db.session.create({
    data: {
      userId,
      deviceId: deviceInfo.deviceId,
      deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
  });

  return session.id;
};

// Cleanup expired sessions
export const cleanupExpiredSessions = async (): Promise<void> => {
  const db = getDatabaseClient();
  if (!db) {
    return;
  }

  try {
    await db.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
  } catch (error) {
    logger.error('Error cleaning up expired sessions:', error);
  }
};
