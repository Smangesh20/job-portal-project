// Utility functions for API endpoints
import { VercelRequest, VercelResponse } from '@vercel/node';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
  provider: 'google' | 'email';
  created_at: string;
  last_login: string;
}

// In-memory storage (replace with database in production)
// For demo purposes, we'll use a Map
export const usersDB = new Map<string, User>();
export const otpStorage = new Map<string, { otp: string; expires: number; action: string }>();

// Generate random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// CORS headers
export function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Handle OPTIONS request
export function handleOptions(req: VercelRequest, res: VercelResponse): void {
  setCorsHeaders(res);
  res.status(200).end();
}

// Send OTP via email (mock for now - integrate with email service)
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    console.log(`📧 Sending OTP to ${email}: ${otp}`);
    
    // For development, we'll just log it
    // In production, use a service like SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: 'noreply@askyacham.com',
      subject: 'Your AskYaCham Verification Code',
      text: `Your verification code is: ${otp}`,
      html: `<strong>Your verification code is: ${otp}</strong>`
    };
    
    await sgMail.send(msg);
    */
    
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

// Create or update user
export function createOrUpdateUser(userData: Partial<User>): User {
  const userId = userData.id || generateUserId(userData.email!);
  
  const existingUser = usersDB.get(userId);
  
  const user: User = {
    id: userId,
    email: userData.email || existingUser?.email || '',
    name: userData.name || existingUser?.name || '',
    picture: userData.picture || existingUser?.picture,
    verified_email: userData.verified_email ?? existingUser?.verified_email ?? true,
    provider: userData.provider || existingUser?.provider || 'email',
    created_at: existingUser?.created_at || new Date().toISOString(),
    last_login: new Date().toISOString()
  };
  
  usersDB.set(userId, user);
  return user;
}

// Generate user ID from email
export function generateUserId(email: string): string {
  return Buffer.from(email.toLowerCase()).toString('base64').replace(/=/g, '');
}

// Get user by email
export function getUserByEmail(email: string): User | undefined {
  const userId = generateUserId(email);
  return usersDB.get(userId);
}

// Store OTP
export function storeOTP(email: string, otp: string, action: string): void {
  const expires = Date.now() + (10 * 60 * 1000); // 10 minutes
  otpStorage.set(email.toLowerCase(), { otp, expires, action });
}

// Verify OTP
export function verifyOTP(email: string, otp: string, action: string): boolean {
  const stored = otpStorage.get(email.toLowerCase());
  
  if (!stored) {
    return false;
  }
  
  if (Date.now() > stored.expires) {
    otpStorage.delete(email.toLowerCase());
    return false;
  }
  
  if (stored.otp !== otp || stored.action !== action) {
    return false;
  }
  
  // OTP is valid, remove it
  otpStorage.delete(email.toLowerCase());
  return true;
}

// Error response
export function errorResponse(res: VercelResponse, message: string, statusCode: number = 400): void {
  setCorsHeaders(res);
  res.status(statusCode).json({
    success: false,
    error: message
  });
}

// Success response
export function successResponse(res: VercelResponse, data: any, statusCode: number = 200): void {
  setCorsHeaders(res);
  res.status(statusCode).json({
    success: true,
    ...data
  });
}

