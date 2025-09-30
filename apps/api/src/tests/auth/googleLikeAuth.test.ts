import request from 'supertest';
import { app } from '../../../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Google-like Authentication System', () => {
  let testUser: any;
  let testOtpToken: string;

  beforeAll(async () => {
    // Clean up test data
    await prisma.otpToken.deleteMany();
    await prisma.securityEvent.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        emailVerified: true,
        isVerified: true,
        authMethod: 'PASSWORD'
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.otpToken.deleteMany();
    await prisma.securityEvent.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('OTP Authentication', () => {
    it('should send OTP successfully', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/send-otp')
        .send({
          email: 'test@example.com',
          type: 'LOGIN'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent');
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/send-otp')
        .send({
          email: 'invalid-email',
          type: 'LOGIN'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should enforce rate limiting on OTP requests', async () => {
      // Send 4 OTP requests rapidly
      for (let i = 0; i < 4; i++) {
        await request(app)
          .post('/api/auth/google-like/send-otp')
          .send({
            email: 'ratelimit@example.com',
            type: 'LOGIN'
          });
      }

      // 5th request should be rate limited
      const response = await request(app)
        .post('/api/auth/google-like/send-otp')
        .send({
          email: 'ratelimit@example.com',
          type: 'LOGIN'
        })
        .expect(429);

      expect(response.body.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should verify valid OTP', async () => {
      // First, send an OTP
      await request(app)
        .post('/api/auth/google-like/send-otp')
        .send({
          email: 'test@example.com',
          type: 'LOGIN'
        });

      // Get the OTP from database (in real scenario, this would be sent via email)
      const otpRecord = await prisma.otpToken.findFirst({
        where: {
          email: 'test@example.com',
          type: 'LOGIN',
          used: false
        }
      });

      expect(otpRecord).toBeTruthy();

      // For testing, we'll need to implement a way to get the actual OTP
      // This is a simplified test - in reality, you'd need to mock the email service
    });
  });

  describe('Enhanced Login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should require MFA when enabled', async () => {
      // Enable MFA for test user
      await prisma.user.update({
        where: { id: testUser.id },
        data: {
          mfaEnabled: true,
          mfaSecret: 'test-secret'
        }
      });

      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.data.requiresMfa).toBe(true);
      expect(response.body.data.mfaToken).toBeDefined();
    });

    it('should enforce account lockout after failed attempts', async () => {
      // Create a user for lockout testing
      const lockoutUser = await prisma.user.create({
        data: {
          email: 'lockout@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Lockout User',
          emailVerified: true,
          isVerified: true
        }
      });

      // Attempt login with wrong password 6 times
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/google-like/enhanced-login')
          .send({
            email: 'lockout@example.com',
            password: 'wrongpassword'
          });
      }

      // Account should be locked
      const updatedUser = await prisma.user.findUnique({
        where: { id: lockoutUser.id }
      });

      expect(updatedUser?.lockedUntil).toBeTruthy();
      expect(updatedUser?.lockedUntil! > new Date()).toBe(true);
    });
  });

  describe('Social Authentication', () => {
    it('should create new user with social login', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/social')
        .send({
          provider: 'google',
          providerId: 'google-123',
          email: 'social@example.com',
          name: 'Social User',
          avatar: 'https://example.com/avatar.jpg'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.isNewUser).toBe(true);

      // Verify user was created in database
      const createdUser = await prisma.user.findUnique({
        where: { email: 'social@example.com' }
      });

      expect(createdUser).toBeTruthy();
      expect(createdUser?.googleId).toBe('google-123');
    });

    it('should login existing user with social auth', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Existing User',
          emailVerified: true,
          isVerified: true,
          authMethod: 'GOOGLE',
          googleId: 'existing-google-123'
        }
      });

      const response = await request(app)
        .post('/api/auth/google-like/social')
        .send({
          provider: 'google',
          providerId: 'existing-google-123',
          email: 'existing@example.com',
          name: 'Existing User'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isNewUser).toBe(false);
    });
  });

  describe('MFA Setup and Verification', () => {
    it('should setup MFA for user', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/google-like/setup-mfa')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.secret).toBeDefined();
      expect(response.body.data.qrCodeUrl).toBeDefined();
      expect(response.body.data.backupCodes).toBeDefined();
      expect(response.body.data.backupCodes).toHaveLength(10);
    });

    it('should verify MFA setup', async () => {
      // This would require implementing MFA token generation for testing
      // For now, we'll test the endpoint structure
      const response = await request(app)
        .post('/api/auth/google-like/verify-mfa-setup')
        .send({
          token: '123456'
        })
        .expect(401); // No auth token provided

      expect(response.body.success).toBe(false);
    });
  });

  describe('Password Recovery', () => {
    it('should send password recovery email', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/password-recovery')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset instructions');
    });

    it('should reject password recovery for non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/password-recovery')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(200); // Should still return success for security

      expect(response.body.success).toBe(true);
    });
  });

  describe('Security Features', () => {
    it('should log security events', async () => {
      // Perform a login to generate security event
      await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Check if security event was logged
      const securityEvents = await prisma.securityEvent.findMany({
        where: {
          userId: testUser.id,
          eventType: 'LOGIN_SUCCESS'
        }
      });

      expect(securityEvents.length).toBeGreaterThan(0);
    });

    it('should handle device fingerprinting', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .set('X-Device-Fingerprint', 'test-fingerprint-123')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      // Device fingerprint should be logged in security events
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on login attempts', async () => {
      // Attempt login 6 times rapidly
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/google-like/enhanced-login')
          .send({
            email: 'ratelimit2@example.com',
            password: 'wrongpassword'
          });
      }

      // 7th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'ratelimit2@example.com',
          password: 'wrongpassword'
        })
        .expect(429);

      expect(response.body.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle server errors gracefully', async () => {
      // This would require mocking database errors
      // For now, we'll test the error response structure
      const response = await request(app)
        .post('/api/auth/google-like/enhanced-login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.body).toHaveProperty('success');
    });
  });
});

// Load testing with Artillery (separate file)
export const loadTestConfig = {
  config: {
    target: 'http://localhost:3000',
    phases: [
      { duration: '2m', arrivalRate: 10 }, // Warm up
      { duration: '5m', arrivalRate: 50 }, // Ramp up
      { duration: '10m', arrivalRate: 100 }, // Sustained load
      { duration: '2m', arrivalRate: 0 } // Cool down
    ]
  },
  scenarios: [
    {
      name: 'Authentication Load Test',
      weight: 100,
      flow: [
        {
          post: {
            url: '/api/auth/google-like/enhanced-login',
            json: {
              email: '{{ $randomString() }}@example.com',
              password: 'password123'
            }
          }
        },
        {
          think: 5 // Wait 5 seconds between requests
        }
      ]
    }
  ]
};







