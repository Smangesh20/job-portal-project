/**
 * Enterprise Security System
 * Google-style comprehensive security implementation
 */

import crypto from 'crypto';

// Security configuration
export interface SecurityConfig {
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  jwtSecret: string;
  encryptionKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Failed login attempts store
const failedLoginStore = new Map<string, { attempts: number; lockoutUntil: number }>();

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss: ws:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .replace(/[()]/g, '') // Remove parentheses
    .trim();
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[';]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove double dashes
    .replace(/union/gi, '') // Remove UNION
    .replace(/select/gi, '') // Remove SELECT
    .replace(/insert/gi, '') // Remove INSERT
    .replace(/update/gi, '') // Remove UPDATE
    .replace(/delete/gi, '') // Remove DELETE
    .replace(/drop/gi, '') // Remove DROP
    .replace(/create/gi, '') // Remove CREATE
    .replace(/alter/gi, '') // Remove ALTER
    .trim();
}

// XSS prevention
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Rate limiting
export function checkRateLimit(identifier: string, config: SecurityConfig): boolean {
  const now = Date.now();
  const windowStart = now - config.rateLimitWindowMs;
  
  const current = rateLimitStore.get(identifier);
  
  if (!current || current.resetTime < windowStart) {
    // Reset or create new entry
    rateLimitStore.set(identifier, { count: 1, resetTime: now });
    return true;
  }
  
  if (current.count >= config.rateLimitMaxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(identifier, current);
  return true;
}

// Failed login tracking
export function trackFailedLogin(identifier: string, config: SecurityConfig): boolean {
  const now = Date.now();
  const current = failedLoginStore.get(identifier);
  
  if (!current) {
    failedLoginStore.set(identifier, { attempts: 1, lockoutUntil: 0 });
    return true; // First attempt
  }
  
  // Check if still locked out
  if (current.lockoutUntil > now) {
    return false; // Still locked out
  }
  
  // Increment attempts
  current.attempts++;
  
  if (current.attempts >= config.maxLoginAttempts) {
    // Lock out user
    current.lockoutUntil = now + config.lockoutDuration;
    failedLoginStore.set(identifier, current);
    return false; // Locked out
  }
  
  failedLoginStore.set(identifier, current);
  return true; // Allowed
}

// Reset failed login attempts
export function resetFailedLogins(identifier: string) {
  failedLoginStore.delete(identifier);
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  if (password.length >= 12) {
    score += 1;
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Hash password with salt
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

// Verify password
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return computedHash === hash;
}

// JWT token validation
export function validateJWT(token: string, secret: string): { isValid: boolean; payload?: any; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid token format' };
    }
    
    const [header, payload, signature] = parts;
    
    // Verify signature (simplified - in production use proper JWT library)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return { isValid: false, error: 'Invalid signature' };
    }
    
    // Decode payload
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      return { isValid: false, error: 'Token expired' };
    }
    
    return { isValid: true, payload: decodedPayload };
  } catch (error) {
    return { isValid: false, error: 'Token validation failed' };
  }
}

// CSRF token generation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// CSRF token validation
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// IP address validation
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// URL validation
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Clean up expired entries
export function cleanupExpiredEntries() {
  const now = Date.now();
  
  // Clean rate limit store
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now - 3600000) { // 1 hour
      rateLimitStore.delete(key);
    }
  }
  
  // Clean failed login store
  for (const [key, value] of failedLoginStore.entries()) {
    if (value.lockoutUntil < now) {
      failedLoginStore.delete(key);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredEntries, 3600000);

// Security middleware
export function createSecurityMiddleware(config: SecurityConfig) {
  return {
    headers: securityHeaders,
    rateLimit: (identifier: string) => checkRateLimit(identifier, config),
    trackFailedLogin: (identifier: string) => trackFailedLogin(identifier, config),
    resetFailedLogins: (identifier: string) => resetFailedLogins(identifier),
    sanitizeInput,
    sanitizeSQL,
    sanitizeHTML,
    validatePasswordStrength,
    validateJWT: (token: string) => validateJWT(token, config.jwtSecret),
    generateCSRFToken,
    validateCSRFToken,
    isValidIP,
    isValidEmail,
    isValidURL
  };
}
