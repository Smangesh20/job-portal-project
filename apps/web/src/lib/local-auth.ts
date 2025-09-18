// Local authentication system with persistent storage
// This ensures account data persists without requiring a server

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Add name field for compatibility
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface PasswordResetToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

class LocalAuthService {
  private users: Map<string, User & { passwordHash: string }> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: string }> = new Map();
  private resetTokens: Map<string, PasswordResetToken> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined') return;

      // Load users
      const storedUsers = localStorage.getItem('askyacham_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        users.forEach((user: User & { passwordHash: string }) => {
          this.users.set(user.id, user);
        });
        console.log(`Loaded ${users.length} users from localStorage`);
      }

      // Load sessions
      const storedSessions = localStorage.getItem('askyacham_sessions');
      if (storedSessions) {
        const sessions = JSON.parse(storedSessions);
        sessions.forEach((session: { id: string; userId: string; expiresAt: string }) => {
          this.sessions.set(session.id, { userId: session.userId, expiresAt: session.expiresAt });
        });
      }

      // Load reset tokens
      const storedResetTokens = localStorage.getItem('askyacham_reset_tokens');
      if (storedResetTokens) {
        const resetTokens = JSON.parse(storedResetTokens);
        resetTokens.forEach((token: PasswordResetToken) => {
          this.resetTokens.set(token.token, token);
        });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined') return;

      // Save users
      const users = Array.from(this.users.values());
      localStorage.setItem('askyacham_users', JSON.stringify(users));

      // Save sessions
      const sessions = Array.from(this.sessions.entries()).map(([id, session]) => ({
        id,
        ...session
      }));
      localStorage.setItem('askyacham_sessions', JSON.stringify(sessions));

      // Save reset tokens
      const resetTokens = Array.from(this.resetTokens.values());
      localStorage.setItem('askyacham_reset_tokens', JSON.stringify(resetTokens));

      console.log(`Saved ${users.length} users, ${sessions.length} sessions, and ${resetTokens.length} reset tokens to localStorage`);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private generateId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 16);
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 32);
  }

  private hashPassword(password: string): string {
    // Simple hash for demo purposes - in production use bcrypt
    return 'hashed_' + btoa(password);
  }

  private verifyPassword(password: string, hash: string): boolean {
    return hash === this.hashPassword(password);
  }

  private createSession(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateToken();
    const refreshToken = this.generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    this.sessions.set(accessToken, { userId, expiresAt });
    this.saveToStorage();

    return { accessToken, refreshToken };
  }

  private validateToken(token: string): User | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(token);
      this.saveToStorage();
      return null;
    }

    const user = this.users.get(session.userId);
    return user ? { ...user, passwordHash: undefined } as User : null;
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<AuthResponse> {
    try {
      // Validate input
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email, password, first name, and last name are required'
          }
        };
      }

      // Check if user already exists
      for (const user of this.users.values()) {
        if (user.email === data.email) {
          return {
            success: false,
            error: {
              code: 'USER_EXISTS',
              message: 'User with this email already exists'
            }
          };
        }
      }

      // Create user
      const userId = this.generateId();
      const user: User & { passwordHash: string } = {
        id: userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role?.toUpperCase() as any) || 'CANDIDATE',
        isVerified: false,
        isActive: true,
        passwordHash: this.hashPassword(data.password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null
      };

      this.users.set(userId, user);
      this.saveToStorage();

      // Create session
      const { accessToken, refreshToken } = this.createSession(userId);

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.users.set(userId, user);
      this.saveToStorage();

      console.log('User registered successfully:', user.id, user.email);

      return {
        success: true,
        data: {
          user: { 
            ...user, 
            passwordHash: undefined,
            name: `${user.firstName} ${user.lastName}` // Add name field for compatibility
          } as User,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to register user'
        }
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email and password are required'
          }
        };
      }

      // Find user
      let user: (User & { passwordHash: string }) | null = null;
      for (const u of this.users.values()) {
        if (u.email === email) {
          user = u;
          break;
        }
      }

      if (!user) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'Account is deactivated'
          }
        };
      }

      // Verify password
      if (!this.verifyPassword(password, user.passwordHash)) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password'
          }
        };
      }

      // Create session
      const { accessToken, refreshToken } = this.createSession(user.id);

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.users.set(user.id, user);
      this.saveToStorage();

      console.log('User logged in successfully:', user.id, user.email);

      return {
        success: true,
        data: {
          user: { 
            ...user, 
            passwordHash: undefined,
            name: `${user.firstName} ${user.lastName}` // Add name field for compatibility
          } as User,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Failed to login'
        }
      };
    }
  }

  async getCurrentUser(token: string): Promise<AuthResponse> {
    try {
      const user = this.validateToken(token);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token'
          }
        };
      }

      return {
        success: true,
        data: {
          user: {
            ...user,
            name: `${user.firstName} ${user.lastName}` // Add name field for compatibility
          },
          accessToken: token,
          refreshToken: token // For simplicity, using same token
        }
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: 'Failed to get current user'
        }
      };
    }
  }

  async logout(token: string): Promise<AuthResponse> {
    try {
      this.sessions.delete(token);
      this.saveToStorage();

      return {
        success: true,
        data: {
          user: null as any,
          accessToken: '',
          refreshToken: ''
        }
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Failed to logout'
        }
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // For simplicity, we'll just validate the current token
      const user = this.validateToken(refreshToken);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired refresh token'
          }
        };
      }

      // Create new session
      const { accessToken, refreshToken: newRefreshToken } = this.createSession(user.id);

      return {
        success: true,
        data: {
          user: {
            ...user,
            name: `${user.firstName} ${user.lastName}` // Add name field for compatibility
          },
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: 'Failed to refresh token'
        }
      };
    }
  }

  // Get all users (for testing)
  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(user => ({ 
      ...user, 
      passwordHash: undefined,
      name: `${user.firstName} ${user.lastName}` // Add name field for compatibility
    } as User));
  }

  // Forgot password - generate reset token
  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      // Find user by email
      let user: (User & { passwordHash: string }) | null = null;
      for (const u of this.users.values()) {
        if (u.email === email) {
          user = u;
          break;
        }
      }

      if (!user) {
        // For security, don't reveal if email exists or not
        return {
          success: true,
          data: {
            user: null as any,
            accessToken: '',
            refreshToken: ''
          }
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: {
            code: 'ACCOUNT_DEACTIVATED',
            message: 'Account is deactivated'
          }
        };
      }

      // Generate reset token
      const resetToken = this.generateToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

      // Store reset token
      const resetTokenData: PasswordResetToken = {
        token: resetToken,
        userId: user.id,
        email: user.email,
        expiresAt,
        used: false,
        createdAt: new Date().toISOString()
      };

      this.resetTokens.set(resetToken, resetTokenData);
      this.saveToStorage();

      // Send reset email
      const { emailService } = await import('./email-service');
      await emailService.sendPasswordResetEmail(user.email, `${user.firstName} ${user.lastName}`, resetToken);

      console.log('Password reset token generated:', user.id, user.email);

      return {
        success: true,
        data: {
          user: { ...user, passwordHash: undefined } as User,
          accessToken: '',
          refreshToken: ''
        }
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_FAILED',
          message: 'Failed to process password reset request'
        }
      };
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      // Validate token
      const resetTokenData = this.resetTokens.get(token);
      if (!resetTokenData) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token'
          }
        };
      }

      // Check if token is expired
      if (new Date(resetTokenData.expiresAt) < new Date()) {
        this.resetTokens.delete(token);
        this.saveToStorage();
        return {
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Reset token has expired'
          }
        };
      }

      // Check if token is already used
      if (resetTokenData.used) {
        return {
          success: false,
          error: {
            code: 'TOKEN_USED',
            message: 'Reset token has already been used'
          }
        };
      }

      // Get user
      const user = this.users.get(resetTokenData.userId);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        };
      }

      // Validate new password
      if (!newPassword || newPassword.length < 8) {
        return {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 8 characters long'
          }
        };
      }

      // Check if new password is different from current
      if (this.verifyPassword(newPassword, user.passwordHash)) {
        return {
          success: false,
          error: {
            code: 'SAME_PASSWORD',
            message: 'New password must be different from current password'
          }
        };
      }

      // Update password
      user.passwordHash = this.hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();
      this.users.set(user.id, user);

      // Mark token as used
      resetTokenData.used = true;
      this.resetTokens.set(token, resetTokenData);

      // Invalidate all user sessions
      for (const [sessionToken, session] of this.sessions.entries()) {
        if (session.userId === user.id) {
          this.sessions.delete(sessionToken);
        }
      }

      this.saveToStorage();

      // Send confirmation email
      const { emailService } = await import('./email-service');
      await emailService.sendPasswordChangeConfirmationEmail(user.email, `${user.firstName} ${user.lastName}`);

      console.log('Password reset successfully:', user.id, user.email);

      return {
        success: true,
        data: {
          user: { ...user, passwordHash: undefined } as User,
          accessToken: '',
          refreshToken: ''
        }
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: {
          code: 'RESET_PASSWORD_FAILED',
          message: 'Failed to reset password'
        }
      };
    }
  }

  // Validate reset token
  async validateResetToken(token: string): Promise<AuthResponse> {
    try {
      console.log('🔍 validateResetToken called with token:', token);
      console.log('🔍 Available reset tokens:', Array.from(this.resetTokens.keys()));
      
      const resetTokenData = this.resetTokens.get(token);
      console.log('🔍 Found reset token data:', resetTokenData);
      
      if (!resetTokenData) {
        console.log('❌ Token not found in resetTokens map');
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid reset token'
          }
        };
      }

      const now = new Date();
      const expiresAt = new Date(resetTokenData.expiresAt);
      console.log('🔍 Token expiry check:', { now: now.toISOString(), expiresAt: expiresAt.toISOString(), isExpired: now > expiresAt });
      
      if (now > expiresAt) {
        console.log('❌ Token has expired');
        this.resetTokens.delete(token);
        this.saveToStorage();
        return {
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Reset token has expired'
          }
        };
      }

      console.log('🔍 Token used check:', { used: resetTokenData.used });
      if (resetTokenData.used) {
        console.log('❌ Token has already been used');
        return {
          success: false,
          error: {
            code: 'TOKEN_USED',
            message: 'Reset token has already been used'
          }
        };
      }

      return {
        success: true,
        data: {
          user: null as any,
          accessToken: '',
          refreshToken: ''
        }
      };
    } catch (error) {
      console.error('Validate reset token error:', error);
      return {
        success: false,
        error: {
          code: 'VALIDATE_TOKEN_FAILED',
          message: 'Failed to validate reset token'
        }
      };
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.users.clear();
    this.sessions.clear();
    this.resetTokens.clear();
    this.saveToStorage();
  }
}

// Create singleton instance
export const localAuthService = new LocalAuthService();

// Export types
export type { User, AuthResponse };
