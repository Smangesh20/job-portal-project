/**
 * Mock API for development and testing
 * Provides realistic responses without requiring backend
 */

export interface MockUser {
  id: string
  email: string
  name: string
  role: 'user' | 'employer' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface MockAuthResponse {
  success: boolean
  data: {
    user: MockUser
    accessToken: string
    refreshToken: string
  }
  message: string
}

export interface MockErrorResponse {
  success: false
  error: string
  message: string
  code?: string
}

class MockAPI {
  private users: MockUser[] = [
    // Add some default users for testing
    {
      id: 'user_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_2',
      email: 'demo@askyacham.com',
      name: 'Demo User',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_yej3pvwqgdf',
      email: 'pullareddypullareddy20@gmail.com',
      name: 'Pullareddy',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<MockAuthResponse | MockErrorResponse> {
    await this.delay(1000) // Simulate network delay

    // Check if user already exists (case-insensitive)
    const existingUser = this.users.find(user => user.email.toLowerCase() === data.email.toLowerCase())
    
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists',
        message: `An account with this email address (${data.email}) already exists. Please use a different email address or sign in to your existing account.`,
        code: 'EMAIL_EXISTS'
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format',
        message: 'Please enter a valid email address (e.g., john@example.com).',
        code: 'INVALID_EMAIL'
      }
    }

    // Validate password strength
    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Weak password',
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
        code: 'WEAK_PASSWORD'
      }
    }

    // Create new user
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.users.push(newUser)
    return {
      success: true,
      data: {
        user: newUser,
        accessToken: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`
      },
      message: 'Account created successfully!'
    }
  }

  async login(email: string, password: string): Promise<MockAuthResponse | MockErrorResponse> {
    await this.delay(800) // Simulate network delay

    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        message: 'No account found with this email address. Please check your email or create a new account.',
        code: 'USER_NOT_FOUND'
      }
    }

    // In a real app, you'd verify the password hash
    // For mock, we'll accept any password
    return {
      success: true,
      data: {
        user,
        accessToken: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`
      },
      message: 'Login successful!'
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    await this.delay(500)
    
    const user = this.users.find(u => u.email === email)
    if (!user) {
      return {
        success: true, // Always return success for security (don't reveal if email exists)
        message: 'If an account with that email exists, we have sent a password reset link.'
      }
    }

    // Simulate sending email
    console.log(`📧 Mock: Password reset email sent to ${email}`)
    console.log(`🔗 Mock: Reset link would be: https://www.askyacham.com/auth/reset-password?token=mock_token_${Date.now()}`)

    return {
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    }
  }

  async getCurrentUser(): Promise<MockUser | null> {
    await this.delay(300)
    
    // Return the first user as current user (for demo purposes)
    return this.users[0] || null
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    await this.delay(200)
    return {
      success: true,
      message: 'Logged out successfully'
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    await this.delay(400)
    return {
      accessToken: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`
    }
  }
}

export const mockAPI = new MockAPI()
