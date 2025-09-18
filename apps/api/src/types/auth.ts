import { Request } from 'express'
import { User } from '@prisma/client'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    role: string
    isAdmin: boolean
    isVerified: boolean
  }
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: 'candidate' | 'employer'
  agreeToTerms: boolean
}

export interface ResetPasswordRequest {
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
}

export interface TwoFactorSetupRequest {
  secret: string
  token: string
}

export interface TwoFactorVerifyRequest {
  token: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: Partial<User>
    token: string
    refreshToken?: string
    expiresIn: number
  }
  message?: string
  error?: string
}

export interface SessionData {
  userId: string
  email: string
  role: string
  loginTime: Date
  lastActivity: Date
  ipAddress: string
  userAgent: string
  isActive: boolean
}
