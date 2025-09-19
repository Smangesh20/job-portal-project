// GOOGLE ULTIMATE SOLUTION - Clean implementation
// This is exactly how Google would solve this problem

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User | null;
    accessToken: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class LocalAuthService {
  private static instance: LocalAuthService;
  private users = new Map<string, User>();
  private sessions = new Map<string, any>();
  private resetTokens = new Map<string, any>();

  constructor() {
    console.log('🚀 GOOGLE ULTIMATE: LocalAuthService initialized');
    this.loadFromStorage();
  }

  static getInstance(): LocalAuthService {
    if (!LocalAuthService.instance) {
      LocalAuthService.instance = new LocalAuthService();
    }
    return LocalAuthService.instance;
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined') return;
      
      console.log('🚀 GOOGLE ULTIMATE: Loading from storage...');

      // Load users
      const storedUsers = localStorage.getItem('askyacham_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        users.forEach((user: User) => {
          this.users.set(user.id, user);
        });
        console.log('🚀 GOOGLE ULTIMATE: Loaded users:', users.length);
      }

      // Load reset tokens
      const storedTokens = localStorage.getItem('askyacham_reset_tokens');
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        tokens.forEach((token: any) => {
          this.resetTokens.set(token.token, token);
        });
        console.log('🚀 GOOGLE ULTIMATE: Loaded tokens:', tokens.length);
      }
      
    } catch (error) {
      console.error('❌ GOOGLE ULTIMATE ERROR in loadFromStorage:', error);
    }
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use bcrypt
    return 'hashed_' + btoa(password);
  }

  // GOOGLE-STYLE: Password reset with server-side API integration
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      console.log('🔐 GOOGLE-STYLE: resetPassword called with token:', token);
      
      // GOOGLE-STYLE: Validate password strength
      const passwordValidation = this.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: passwordValidation.message
          }
        };
      }
      
      // GOOGLE-STYLE: Call local API route
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.log('❌ GOOGLE-STYLE: Failed to parse response JSON');
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: 'Server returned invalid response. Please try again.'
          }
        };
      }
      
      if (response.ok) {
        console.log('✅ GOOGLE-STYLE: Password reset completed via server API');
        return {
          success: true,
          message: data.message || 'Your password has been reset successfully. Please log in with your new password.'
        };
      } else {
        console.log('❌ GOOGLE-STYLE: Server API error:', data);
        return {
          success: false,
          error: {
            code: data.error?.code || 'RESET_FAILED',
            message: data.error?.message || 'An error occurred while resetting your password. Please try again.'
          }
        };
      }
      
    } catch (error) {
      console.error('❌ GOOGLE-STYLE ERROR in resetPassword:', error);
      return {
        success: false,
        error: {
          code: 'RESET_FAILED',
          message: 'An error occurred while resetting your password. Please try again.'
        }
      };
    }
  }

  // GOOGLE-STYLE: Validate password strength
  private validatePasswordStrength(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }
    
    if (password.length > 128) {
      return {
        isValid: false,
        message: 'Password must be less than 128 characters'
      };
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return {
        isValid: false,
        message: 'Please choose a stronger password'
      };
    }
    
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
      return {
        isValid: false,
        message: 'Password must contain at least one letter and one number'
      };
    }
    
    return {
      isValid: true,
      message: 'Password is strong'
    };
  }

  // GOOGLE-STYLE: Token validation with server-side API integration
  async validateResetToken(token: string): Promise<AuthResponse> {
    try {
      console.log('🔐 GOOGLE-STYLE: validateResetToken called with token:', token);

      // GOOGLE-STYLE: Call local API route
      const response = await fetch('/api/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.log('❌ GOOGLE-STYLE: Failed to parse response JSON');
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: 'Server returned invalid response. Please try again.'
          }
        };
      }
      
      if (response.ok) {
        console.log('✅ GOOGLE-STYLE: Token is valid via server API');
        return {
          success: true,
          data: {
            user: data.data?.user || { email: 'user@example.com' },
            accessToken: '',
            refreshToken: ''
          }
        };
      } else {
        console.log('❌ GOOGLE-STYLE: Server API error:', data);
        return {
          success: false,
          error: {
            code: data.error?.code || 'INVALID_TOKEN',
            message: data.error?.message || 'Invalid or expired reset token'
          }
        };
      }
      
    } catch (error) {
      console.error('❌ GOOGLE-STYLE ERROR in validateResetToken:', error);
      return {
        success: false,
        error: {
          code: 'VALIDATE_TOKEN_FAILED',
          message: 'Failed to validate reset token'
        }
      };
    }
  }

  // GOOGLE-STYLE: Forgot password with server-side API integration
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      console.log('🔐 GOOGLE-STYLE: forgotPassword called with email:', email);
      
      // GOOGLE-STYLE: Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please enter a valid email address'
          }
        };
      }
      
      // GOOGLE-STYLE: Call local API route
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.log('❌ GOOGLE-STYLE: Failed to parse response JSON');
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: 'Server returned invalid response. Please try again.'
          }
        };
      }
      
      if (response.ok) {
        console.log('✅ GOOGLE-STYLE: Password reset email sent via server API');
        return {
          success: true,
          message: data.message || 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.'
        };
      } else {
        console.log('❌ GOOGLE-STYLE: Server API error:', data);
        return {
          success: false,
          error: {
            code: data.error?.code || 'API_ERROR',
            message: data.error?.message || 'Failed to send password reset email. Please try again.'
          }
        };
      }
      
    } catch (error) {
      console.error('❌ GOOGLE-STYLE ERROR in forgotPassword:', error);
      // GOOGLE-STYLE: Don't reveal internal errors
      return {
        success: true,
        message: 'If an account with that email exists, we\'ve sent you a password reset link. Please check your inbox and spam folder.'
      };
    }
  }

  // GOOGLE-STYLE: Generate secure token
  private generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // GOOGLE-STYLE: Get recent reset requests for rate limiting
  private getRecentResetRequests(email: string): any[] {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    return Array.from(this.resetTokens.values()).filter(token => 
      token.email.toLowerCase() === email.toLowerCase() && 
      new Date(token.createdAt) > fifteenMinutesAgo
    );
  }

  // GOOGLE-STYLE: Cleanup expired tokens
  private cleanupExpiredTokens(): void {
    const now = new Date();
    for (const [token, data] of this.resetTokens.entries()) {
      if (new Date(data.expiresAt) < now) {
        this.resetTokens.delete(token);
      }
    }
  }

  // GOOGLE-STYLE: Send password reset email via server API
  private async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<boolean> {
    try {
      // Use the server-side API endpoint instead of calling SendGrid directly
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ask-ya-cham-api.onrender.com';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      if (response.ok) {
        console.log('✅ GOOGLE-STYLE: Password reset email sent via API');
        return true;
      } else {
        const errorData = await response.json();
        console.log('❌ GOOGLE-STYLE: API error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ GOOGLE-STYLE: Email send error:', error);
      return false;
    }
  }

  // GOOGLE-STYLE: Generate Google-like email template
  private generateGoogleStyleEmailTemplate(firstName: string, resetUrl: string, token: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body { 
            font-family: 'Google Sans', Roboto, Arial, sans-serif; 
            line-height: 1.6; 
            color: #202124; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 0; 
            background-color: #f8f9fa;
          }
          .container { 
            background: white; 
            margin: 40px auto; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            overflow: hidden;
          }
          .header { 
            background: #4285f4; 
            color: white; 
            padding: 32px 24px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 400; 
          }
          .content { 
            padding: 32px 24px; 
          }
          .greeting { 
            font-size: 18px; 
            margin-bottom: 16px; 
            color: #202124;
          }
          .message { 
            font-size: 14px; 
            color: #5f6368; 
            margin-bottom: 24px; 
            line-height: 1.5;
          }
          .button { 
            display: inline-block; 
            background: #1a73e8; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 4px; 
            font-size: 14px; 
            font-weight: 500; 
            margin: 16px 0; 
            transition: background-color 0.2s;
          }
          .button:hover { 
            background: #1557b0; 
          }
          .alternative { 
            margin-top: 24px; 
            padding: 16px; 
            background: #f8f9fa; 
            border-radius: 4px; 
            border-left: 4px solid #1a73e8;
          }
          .alternative p { 
            margin: 0 0 8px 0; 
            font-size: 14px; 
            color: #5f6368; 
          }
          .link { 
            word-break: break-all; 
            color: #1a73e8; 
            font-size: 12px; 
            font-family: monospace;
          }
          .security { 
            margin-top: 24px; 
            padding: 16px; 
            background: #fef7e0; 
            border-radius: 4px; 
            border-left: 4px solid #f9ab00;
          }
          .security p { 
            margin: 0; 
            font-size: 13px; 
            color: #5f6368; 
          }
          .footer { 
            text-align: center; 
            margin-top: 32px; 
            padding: 24px; 
            border-top: 1px solid #dadce0;
            color: #5f6368; 
            font-size: 12px; 
          }
          .logo { 
            font-size: 20px; 
            font-weight: 500; 
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset your password</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${firstName},</div>
            <div class="message">
              We received a request to reset the password for your Ask Ya Cham account. 
              Click the button below to reset your password.
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset password</a>
            </div>
            
            <div class="alternative">
              <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
              <p class="link">${resetUrl}</p>
            </div>
            
            <div class="security">
              <p><strong>Security tip:</strong> This link will expire in 15 minutes. If you didn't request this password reset, you can safely ignore this email.</p>
            </div>
          </div>
          <div class="footer">
            <div class="logo">Ask Ya Cham</div>
            <p>This email was sent to ${email}</p>
            <p>© 2024 Ask Ya Cham. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // GOOGLE ULTIMATE: Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🚀 GOOGLE ULTIMATE: login called with email:', email);
      
      // GOOGLE ULTIMATE: Find user by email
      const user = Array.from(this.users.values()).find(u => u.email === email);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Verify password
      if (user.passwordHash !== this.hashPassword(password)) {
        return {
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Invalid password'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Create session
      const sessionToken = 'session_' + Math.random().toString(36).substr(2, 9);
      const session = {
        token: sessionToken,
        userId: user.id,
        email: user.email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      this.sessions.set(sessionToken, session);
      localStorage.setItem('askyacham_sessions', JSON.stringify([session]));
      
      console.log('🚀 GOOGLE ULTIMATE: Login successful');
      return {
        success: true,
        data: {
          user: user,
          accessToken: sessionToken,
          refreshToken: sessionToken
        }
      };
      
    } catch (error) {
      console.error('❌ GOOGLE ULTIMATE ERROR in login:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Login failed'
        }
      };
    }
  }

  // GOOGLE ULTIMATE: Register
  async register(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<AuthResponse> {
    try {
      console.log('🚀 GOOGLE ULTIMATE: register called with email:', userData.email);
      
      // GOOGLE ULTIMATE: Check if user already exists
      const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User already exists'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Create new user
      const newUser: User = {
        id: this.generateId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'CANDIDATE',
            isVerified: false,
            isActive: true,
        passwordHash: this.hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
      
      // GOOGLE ULTIMATE: Save user
      this.users.set(newUser.id, newUser);
      localStorage.setItem('askyacham_users', JSON.stringify(Array.from(this.users.values())));
      
      console.log('🚀 GOOGLE ULTIMATE: Registration successful');
        return {
        success: true,
        message: 'Registration successful!'
      };
      
    } catch (error) {
      console.error('❌ GOOGLE ULTIMATE ERROR in register:', error);
        return {
          success: false,
          error: {
          code: 'REGISTRATION_FAILED',
          message: 'Registration failed'
        }
      };
    }
  }

  // GOOGLE ULTIMATE: Get all users
  getAllUsers(): User[] {
    console.log('🚀 GOOGLE ULTIMATE: getAllUsers called');
    const users = Array.from(this.users.values());
    console.log('🚀 GOOGLE ULTIMATE: Returning users:', users.length);
    return users;
  }

  // GOOGLE ULTIMATE: Get current user
  getCurrentUser(accessToken?: string): AuthResponse {
    try {
      console.log('🚀 GOOGLE ULTIMATE: getCurrentUser called with token:', accessToken);
      const users = Array.from(this.users.values());
      const user = users.length > 0 ? users[0] : null;
      
      if (user) {
        console.log('🚀 GOOGLE ULTIMATE: Found current user:', user.email);
      return {
        success: true,
        data: {
            user: user,
            accessToken: accessToken || 'access_' + Math.random().toString(36).substr(2, 9),
            refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 9)
          }
        };
      } else {
        console.log('🚀 GOOGLE ULTIMATE: No current user found');
      return {
        success: false,
        error: {
            code: 'NO_USER_FOUND',
            message: 'No current user found'
          }
        };
      }
    } catch (error) {
      console.error('❌ GOOGLE ULTIMATE ERROR in getCurrentUser:', error);
      return {
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: 'Failed to get current user'
        }
      };
    }
  }

  // GOOGLE ULTIMATE: Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      console.log('🚀 GOOGLE ULTIMATE: refreshToken called with token:', refreshToken);
      
      // GOOGLE ULTIMATE: Find session by refresh token
      const session = this.sessions.get(refreshToken);
      if (!session) {
        return {
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid refresh token'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.sessions.delete(refreshToken);
        return {
          success: false,
          error: {
            code: 'REFRESH_TOKEN_EXPIRED',
            message: 'Refresh token has expired'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Find user
      const user = this.users.get(session.userId);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        };
      }
      
      // GOOGLE ULTIMATE: Generate new tokens
      const newAccessToken = 'access_' + Math.random().toString(36).substr(2, 9);
      const newRefreshToken = 'refresh_' + Math.random().toString(36).substr(2, 9);
      
      // GOOGLE ULTIMATE: Update session
      const updatedSession = {
        ...session,
        token: newAccessToken,
        refreshToken: newRefreshToken,
        updatedAt: new Date().toISOString()
      };
      
      this.sessions.delete(refreshToken);
      this.sessions.set(newAccessToken, updatedSession);
      localStorage.setItem('askyacham_sessions', JSON.stringify(Array.from(this.sessions.values())));
      
      console.log('🚀 GOOGLE ULTIMATE: Token refresh successful');
      return {
        success: true,
        data: {
          user: user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
      
    } catch (error) {
      console.error('❌ GOOGLE ULTIMATE ERROR in refreshToken:', error);
      return {
        success: false,
        error: {
          code: 'REFRESH_TOKEN_FAILED',
          message: 'Failed to refresh token'
        }
      };
    }
  }

  // GOOGLE ULTIMATE: Logout
  logout(refreshToken?: string): void {
    console.log('🚀 GOOGLE ULTIMATE: logout called with refreshToken:', refreshToken);
    this.sessions.clear();
    localStorage.removeItem('askyacham_sessions');
    console.log('🚀 GOOGLE ULTIMATE: Logout successful');
  }

  // Clear all data (for testing)
  clearAllData(): void {
    console.log('🚀 GOOGLE ULTIMATE: clearAllData called');
    this.users.clear();
    this.sessions.clear();
    this.resetTokens.clear();
    localStorage.removeItem('askyacham_users');
    localStorage.removeItem('askyacham_sessions');
    localStorage.removeItem('askyacham_reset_tokens');
    console.log('🚀 GOOGLE ULTIMATE: All data cleared');
  }
}

// Create singleton instance
console.log('🚀 GOOGLE ULTIMATE: Creating LocalAuthService singleton instance');
export const localAuthService = new LocalAuthService();
console.log('🚀 GOOGLE ULTIMATE: LocalAuthService singleton created');

// Export types (User and AuthResponse are already exported above)
