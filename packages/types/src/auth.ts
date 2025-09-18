// Authentication and Authorization Types

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  profileImage?: string;
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  marketingEmails?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface RegisterResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  verificationRequired: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LogoutRequest {
  refreshToken: string;
  deviceId?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  resetTokenExpiry: Date;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface EmailVerificationResponse {
  verified: boolean;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface TwoFactorSetupRequest {
  method: TwoFactorMethod;
  phoneNumber?: string;
}

export interface TwoFactorSetupResponse {
  qrCode?: string;
  backupCodes: string[];
  secret?: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
  method: TwoFactorMethod;
  backupCode?: boolean;
}

export interface TwoFactorVerifyResponse {
  verified: boolean;
  backupCodesRemaining?: number;
}

export enum TwoFactorMethod {
  SMS = 'sms',
  EMAIL = 'email',
  AUTHENTICATOR = 'authenticator',
  BACKUP_CODE = 'backup_code'
}

export interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  deviceId: string;
  deviceType: DeviceType;
  os: string;
  browser: string;
  location?: {
    country: string;
    city: string;
  };
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}

export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceInfo: DeviceInfo;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface SocialAuthRequest {
  provider: SocialProvider;
  token: string;
  deviceInfo?: DeviceInfo;
}

export interface SocialAuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  isNewUser: boolean;
  profileData?: SocialProfileData;
}

export enum SocialProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
  MICROSOFT = 'microsoft',
  GITHUB = 'github'
}

export interface SocialProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  provider: SocialProvider;
  rawData?: any;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: string;
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Security Types
export interface SecurityEvent {
  id: string;
  userId: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  description: string;
  metadata?: any;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
  };
  createdAt: Date;
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  EMAIL_VERIFIED = 'email_verified',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  SESSION_EXPIRED = 'session_expired',
  UNAUTHORIZED_ACCESS = 'unauthorized_access'
}

export enum SecurityEventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  requireEmailVerification: boolean;
  requireTwoFactor: boolean;
  allowedIpRanges?: string[];
  blockedIpRanges?: string[];
}
