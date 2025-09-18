export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Keep for backward compatibility
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'user' | 'employer' | 'admin';
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  name?: string; // Keep for backward compatibility
  email: string;
  password: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'user' | 'employer';
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
