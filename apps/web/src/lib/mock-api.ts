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
        success: false,
        message: 'No account found with this email address.'
      }
    }

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.'
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

  // Job search methods
  async searchJobs(params: any): Promise<any> {
    await this.delay(500)
    
    // 🚀 EXPANDED JOB CATEGORIES - NOT JUST IT
    const allJobs = [
      // IT Jobs
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        match: 95,
        description: 'We are looking for a senior software engineer...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Technology'
      },
      {
        id: 2,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$80,000 - $100,000',
        match: 88,
        description: 'Join our growing team as a frontend developer...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Technology'
      },
      // Medical Jobs
      {
        id: 3,
        title: 'Medical Representative',
        company: 'PharmaCorp',
        location: 'New York, NY',
        salary: '$60,000 - $80,000',
        match: 92,
        description: 'Join our medical sales team...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Healthcare'
      },
      {
        id: 4,
        title: 'Registered Nurse',
        company: 'City Hospital',
        location: 'Chicago, IL',
        salary: '$70,000 - $90,000',
        match: 89,
        description: 'Provide patient care in our hospital...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Healthcare'
      },
      // Finance Jobs
      {
        id: 5,
        title: 'Financial Analyst',
        company: 'Investment Bank',
        location: 'New York, NY',
        salary: '$90,000 - $120,000',
        match: 87,
        description: 'Analyze financial data and market trends...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Finance'
      },
      {
        id: 6,
        title: 'Accountant',
        company: 'Accounting Firm',
        location: 'Los Angeles, CA',
        salary: '$55,000 - $75,000',
        match: 85,
        description: 'Handle financial records and tax preparation...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Finance'
      },
      // Marketing Jobs
      {
        id: 7,
        title: 'Marketing Manager',
        company: 'Marketing Agency',
        location: 'Miami, FL',
        salary: '$65,000 - $85,000',
        match: 83,
        description: 'Lead marketing campaigns and strategies...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Marketing'
      },
      {
        id: 8,
        title: 'Digital Marketing Specialist',
        company: 'E-commerce Company',
        location: 'Seattle, WA',
        salary: '$50,000 - $70,000',
        match: 81,
        description: 'Manage digital marketing campaigns...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Marketing'
      },
      // Education Jobs
      {
        id: 9,
        title: 'High School Teacher',
        company: 'Public School District',
        location: 'Austin, TX',
        salary: '$45,000 - $65,000',
        match: 79,
        description: 'Teach high school students...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Education'
      },
      {
        id: 10,
        title: 'University Professor',
        company: 'State University',
        location: 'Boston, MA',
        salary: '$80,000 - $120,000',
        match: 77,
        description: 'Teach and conduct research...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        category: 'Education'
      }
    ]
    
    // Filter jobs based on search query
    let filteredJobs = allJobs
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query)
      )
    }
    
    return {
      success: true,
      data: {
        results: filteredJobs,
        total: filteredJobs.length,
        query: params.query || '',
        filters: params.filters || {}
      }
    }
  }

  async getJobDetails(jobId: number): Promise<any> {
    await this.delay(300)
    return {
      success: true,
      data: {
        id: jobId,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        match: 95,
        description: 'We are looking for a senior software engineer...',
        postedAt: new Date().toISOString(),
        type: 'Full-time',
        requirements: ['5+ years experience', 'React/Node.js', 'Team leadership'],
        benefits: ['Health insurance', '401k', 'Flexible hours'],
        experience: '5+ years',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript']
      }
    }
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: any): Promise<T> {
    await this.delay(200)
    return {
      success: true,
      data: { message: 'Mock GET response' }
    } as T
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    await this.delay(300)
    return {
      success: true,
      data: { message: 'Mock POST response' }
    } as T
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    await this.delay(300)
    return {
      success: true,
      data: { message: 'Mock PUT response' }
    } as T
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    await this.delay(200)
    return {
      success: true,
      data: { message: 'Mock DELETE response' }
    } as T
  }
}

export const mockAPI = new MockAPI()
