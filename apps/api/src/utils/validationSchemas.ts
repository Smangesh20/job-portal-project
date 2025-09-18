import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format').max(255);
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');

export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be less than 20 characters');

export const urlSchema = z.string().url('Invalid URL format').optional();

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'RECRUITER']).default('CANDIDATE'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
});

// User profile validation schemas
export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.object({
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional()
  }).optional(),
  skills: z.array(z.string().max(100)).max(20, 'Maximum 20 skills allowed').optional(),
  experience: z.array(z.object({
    title: z.string().max(100),
    company: z.string().max(100),
    location: z.string().max(100).optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    description: z.string().max(1000).optional()
  })).max(10, 'Maximum 10 work experiences allowed').optional(),
  education: z.array(z.object({
    degree: z.string().max(100),
    field: z.string().max(100),
    institution: z.string().max(200),
    location: z.string().max(100).optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    gpa: z.number().min(0).max(4).optional()
  })).max(5, 'Maximum 5 education entries allowed').optional(),
  certifications: z.array(z.object({
    name: z.string().max(100),
    issuer: z.string().max(100),
    date: z.date(),
    expiryDate: z.date().optional(),
    credentialId: z.string().max(100).optional()
  })).max(10, 'Maximum 10 certifications allowed').optional(),
  socialLinks: z.object({
    linkedin: urlSchema,
    github: urlSchema,
    portfolio: urlSchema,
    twitter: urlSchema
  }).optional(),
  preferences: z.object({
    notifications: z.boolean().optional(),
    emailMarketing: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
    jobAlerts: z.boolean().optional(),
    salaryRange: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional()
    }).optional(),
    jobTypes: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'])).optional(),
    remoteWork: z.boolean().optional(),
    travel: z.enum(['NONE', 'LIGHT', 'MODERATE', 'HEAVY']).optional()
  }).optional()
});

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
  description: z.string().min(10, 'Job description must be at least 10 characters').max(5000, 'Job description must be less than 5000 characters'),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  location: z.object({
    city: z.string().max(100),
    state: z.string().max(100),
    country: z.string().max(100),
    postalCode: z.string().max(20).optional(),
    remote: z.boolean().default(false)
  }),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().length(3).default('USD'),
    period: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('YEARLY')
  }).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY']),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']),
  requiredSkills: z.array(z.string().max(100)).min(1, 'At least one skill is required').max(20, 'Maximum 20 skills allowed'),
  preferredSkills: z.array(z.string().max(100)).max(20, 'Maximum 20 preferred skills allowed').optional(),
  benefits: z.array(z.string().max(200)).max(10, 'Maximum 10 benefits allowed').optional(),
  requirements: z.array(z.string().max(500)).max(10, 'Maximum 10 requirements allowed').optional(),
  responsibilities: z.array(z.string().max(500)).max(15, 'Maximum 15 responsibilities allowed').optional(),
  applicationDeadline: z.date().optional(),
  startDate: z.date().optional(),
  department: z.string().max(100).optional(),
  reportingTo: z.string().max(100).optional(),
  travel: z.enum(['NONE', 'LIGHT', 'MODERATE', 'HEAVY']).optional(),
  visaSponsorship: z.boolean().optional(),
  relocationAssistance: z.boolean().optional(),
  diversityStatement: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags allowed').optional()
});

export const updateJobSchema = createJobSchema.partial();

export const jobSearchSchema = z.object({
  query: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY']).optional(),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE']).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  remote: z.boolean().optional(),
  skills: z.array(z.string().max(100)).optional(),
  company: z.string().max(100).optional(),
  postedWithin: z.enum(['1_DAY', '3_DAYS', '1_WEEK', '2_WEEKS', '1_MONTH']).optional(),
  sortBy: z.enum(['RELEVANCE', 'DATE', 'SALARY', 'COMPANY']).default('RELEVANCE'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// Application validation schemas
export const createApplicationSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  coverLetter: z.string().max(2000, 'Cover letter must be less than 2000 characters').optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
  portfolioUrl: urlSchema,
  linkedinUrl: urlSchema,
  githubUrl: urlSchema,
  expectedSalary: z.number().min(0).optional(),
  availabilityDate: z.date().optional(),
  noticePeriod: z.number().min(0).max(365).optional(),
  visaStatus: z.string().max(100).optional(),
  relocation: z.boolean().optional(),
  references: z.array(z.object({
    name: z.string().max(100),
    title: z.string().max(100),
    company: z.string().max(100),
    email: emailSchema,
    phone: phoneSchema.optional()
  })).max(3, 'Maximum 3 references allowed').optional(),
  additionalInfo: z.string().max(1000).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

export const updateApplicationSchema = z.object({
  coverLetter: z.string().max(2000).optional(),
  portfolioUrl: urlSchema,
  linkedinUrl: urlSchema,
  githubUrl: urlSchema,
  expectedSalary: z.number().min(0).optional(),
  availabilityDate: z.date().optional(),
  additionalInfo: z.string().max(1000).optional()
});

// Chat validation schemas
export const sendMessageSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message must be less than 2000 characters'),
  messageType: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
  replyTo: z.string().uuid().optional()
});

export const createConversationSchema = z.object({
  participantId: z.string().uuid('Invalid participant ID'),
  jobId: z.string().uuid('Invalid job ID').optional(),
  initialMessage: z.string().min(1).max(2000).optional()
});

// Notification validation schemas
export const updateNotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  jobAlerts: z.boolean().optional(),
  applicationUpdates: z.boolean().optional(),
  interviewReminders: z.boolean().optional(),
  newMessages: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  frequency: z.enum(['IMMEDIATE', 'DAILY', 'WEEKLY']).optional()
});

// Admin validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'RECRUITER', 'ADMIN']),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const updateUserSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'RECRUITER', 'ADMIN']).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export const moderateContentSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'FLAG', 'DELETE']),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional()
});

// Analytics validation schemas
export const analyticsQuerySchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  granularity: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('DAILY'),
  metrics: z.array(z.enum([
    'REGISTRATIONS',
    'JOB_POSTINGS',
    'APPLICATIONS',
    'MATCHES',
    'INTERVIEWS',
    'HIRES',
    'REVENUE',
    'USER_ACTIVITY'
  ])).min(1, 'At least one metric is required'),
  filters: z.object({
    userRole: z.enum(['CANDIDATE', 'EMPLOYER', 'RECRUITER']).optional(),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY']).optional(),
    location: z.string().max(100).optional(),
    company: z.string().max(100).optional()
  }).optional()
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  fileType: z.enum(['RESUME', 'COVER_LETTER', 'PORTFOLIO', 'CERTIFICATE', 'AVATAR']),
  maxSize: z.number().max(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).optional()
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC')
});

// Search validation schema
export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  filters: z.record(z.any()).optional(),
  pagination: paginationSchema.optional()
});

// Rate limiting validation schema
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000).max(3600000), // 1 second to 1 hour
  maxRequests: z.number().min(1).max(10000),
  skipSuccessfulRequests: z.boolean().default(false),
  skipFailedRequests: z.boolean().default(false)
});

// Health check validation schema
export const healthCheckSchema = z.object({
  service: z.string().max(50).optional(),
  includeDetails: z.boolean().default(false)
});

// Webhook validation schema
export const webhookSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.enum([
    'USER_REGISTERED',
    'JOB_POSTED',
    'APPLICATION_SUBMITTED',
    'INTERVIEW_SCHEDULED',
    'HIRE_MADE'
  ])).min(1, 'At least one event is required'),
  secret: z.string().min(32, 'Webhook secret must be at least 32 characters'),
  active: z.boolean().default(true)
});

export default {
  // Auth schemas
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  
  // User schemas
  updateProfileSchema,
  
  // Job schemas
  createJobSchema,
  updateJobSchema,
  jobSearchSchema,
  
  // Application schemas
  createApplicationSchema,
  updateApplicationSchema,
  
  // Chat schemas
  sendMessageSchema,
  createConversationSchema,
  
  // Notification schemas
  updateNotificationPreferencesSchema,
  
  // Admin schemas
  createUserSchema,
  updateUserSchema,
  moderateContentSchema,
  
  // Analytics schemas
  analyticsQuerySchema,
  
  // Utility schemas
  fileUploadSchema,
  paginationSchema,
  searchSchema,
  rateLimitSchema,
  healthCheckSchema,
  webhookSchema
};
