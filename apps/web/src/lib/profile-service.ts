// Enterprise-level Profile and Settings Management Service
// Provides comprehensive user profile management with security and validation

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isVerified: boolean;
  isActive: boolean;
  preferences: UserPreferences;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastProfileUpdate?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  jobAlerts: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  profileVisibility: 'public' | 'private' | 'connections';
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  description: string;
  achievements: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
}

interface Language {
  id: string;
  language: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  certifications?: string[];
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username?: string;
  verified: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showConnections: boolean;
  allowMessages: 'everyone' | 'connections' | 'none';
  showOnlineStatus: boolean;
  dataSharing: boolean;
  analyticsTracking: boolean;
}

interface NotificationSettings {
  email: {
    jobMatches: boolean;
    messages: boolean;
    connections: boolean;
    security: boolean;
    marketing: boolean;
    weeklyDigest: boolean;
  };
  push: {
    jobMatches: boolean;
    messages: boolean;
    connections: boolean;
    security: boolean;
  };
  sms: {
    security: boolean;
    important: boolean;
  };
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  preferences?: Partial<UserPreferences>;
  privacySettings?: Partial<PrivacySettings>;
  notificationSettings?: Partial<NotificationSettings>;
}

interface ProfileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class ProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined') return;

      const storedProfiles = localStorage.getItem('askyacham_profiles');
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        profiles.forEach((profile: UserProfile) => {
          this.profiles.set(profile.id, profile);
        });
        console.log(`Loaded ${profiles.length} profiles from localStorage`);
      }
    } catch (error) {
      console.error('Error loading profiles from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined') return;

      const profiles = Array.from(this.profiles.values());
      localStorage.setItem('askyacham_profiles', JSON.stringify(profiles));
      console.log(`Saved ${profiles.length} profiles to localStorage`);
    } catch (error) {
      console.error('Error saving profiles to localStorage:', error);
    }
  }

  // Create or update user profile
  async createOrUpdateProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const existingProfile = this.profiles.get(userId);
      const now = new Date().toISOString();

      const profile: UserProfile = {
        id: userId,
        email: profileData.email || existingProfile?.email || '',
        firstName: profileData.firstName || existingProfile?.firstName || '',
        lastName: profileData.lastName || existingProfile?.lastName || '',
        name: `${profileData.firstName || existingProfile?.firstName || ''} ${profileData.lastName || existingProfile?.lastName || ''}`.trim(),
        role: profileData.role || existingProfile?.role || 'CANDIDATE',
        avatar: profileData.avatar || existingProfile?.avatar,
        bio: profileData.bio || existingProfile?.bio,
        location: profileData.location || existingProfile?.location,
        phone: profileData.phone || existingProfile?.phone,
        website: profileData.website || existingProfile?.website,
        linkedin: profileData.linkedin || existingProfile?.linkedin,
        github: profileData.github || existingProfile?.github,
        twitter: profileData.twitter || existingProfile?.twitter,
        isVerified: profileData.isVerified ?? existingProfile?.isVerified ?? false,
        isActive: profileData.isActive ?? existingProfile?.isActive ?? true,
        preferences: profileData.preferences || existingProfile?.preferences || this.getDefaultPreferences(),
        skills: profileData.skills || existingProfile?.skills || [],
        experience: profileData.experience || existingProfile?.experience || [],
        education: profileData.education || existingProfile?.education || [],
        certifications: profileData.certifications || existingProfile?.certifications || [],
        languages: profileData.languages || existingProfile?.languages || [],
        socialLinks: profileData.socialLinks || existingProfile?.socialLinks || [],
        privacySettings: profileData.privacySettings || existingProfile?.privacySettings || this.getDefaultPrivacySettings(),
        notificationSettings: profileData.notificationSettings || existingProfile?.notificationSettings || this.getDefaultNotificationSettings(),
        createdAt: existingProfile?.createdAt || now,
        updatedAt: now,
        lastLoginAt: existingProfile?.lastLoginAt,
        lastProfileUpdate: now
      };

      // Validate profile data
      const validation = this.validateProfile(profile);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Profile validation failed: ${validation.errors.join(', ')}`
        };
      }

      this.profiles.set(userId, profile);
      this.saveToStorage();

      console.log('Profile created/updated:', userId);
      return { success: true, profile };
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      return {
        success: false,
        error: 'Failed to create/update profile'
      };
    }
  }

  // Get user profile
  async getProfile(userId: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const profile = this.profiles.get(userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return { success: true, profile };
    } catch (error) {
      console.error('Error getting profile:', error);
      return {
        success: false,
        error: 'Failed to get profile'
      };
    }
  }

  // Update profile fields
  async updateProfile(userId: string, updateData: ProfileUpdateData): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    try {
      const existingProfile = this.profiles.get(userId);
      if (!existingProfile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      // Create updated profile
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updateData,
        name: updateData.firstName || updateData.lastName 
          ? `${updateData.firstName || existingProfile.firstName} ${updateData.lastName || existingProfile.lastName}`.trim()
          : existingProfile.name,
        preferences: updateData.preferences ? { ...existingProfile.preferences, ...updateData.preferences } : existingProfile.preferences,
        privacySettings: updateData.privacySettings ? { ...existingProfile.privacySettings, ...updateData.privacySettings } : existingProfile.privacySettings,
        notificationSettings: updateData.notificationSettings ? { ...existingProfile.notificationSettings, ...updateData.notificationSettings } : existingProfile.notificationSettings,
        updatedAt: new Date().toISOString(),
        lastProfileUpdate: new Date().toISOString()
      };

      // Validate updated profile
      const validation = this.validateProfile(updatedProfile);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Profile validation failed: ${validation.errors.join(', ')}`
        };
      }

      this.profiles.set(userId, updatedProfile);
      this.saveToStorage();

      console.log('Profile updated:', userId);
      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Add work experience
  async addWorkExperience(userId: string, experience: Omit<WorkExperience, 'id'>): Promise<{ success: boolean; experience?: WorkExperience; error?: string }> {
    try {
      const profile = this.profiles.get(userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const newExperience: WorkExperience = {
        ...experience,
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedProfile = {
        ...profile,
        experience: [...profile.experience, newExperience],
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(userId, updatedProfile);
      this.saveToStorage();

      return { success: true, experience: newExperience };
    } catch (error) {
      console.error('Error adding work experience:', error);
      return {
        success: false,
        error: 'Failed to add work experience'
      };
    }
  }

  // Add education
  async addEducation(userId: string, education: Omit<Education, 'id'>): Promise<{ success: boolean; education?: Education; error?: string }> {
    try {
      const profile = this.profiles.get(userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const newEducation: Education = {
        ...education,
        id: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedProfile = {
        ...profile,
        education: [...profile.education, newEducation],
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(userId, updatedProfile);
      this.saveToStorage();

      return { success: true, education: newEducation };
    } catch (error) {
      console.error('Error adding education:', error);
      return {
        success: false,
        error: 'Failed to add education'
      };
    }
  }

  // Add certification
  async addCertification(userId: string, certification: Omit<Certification, 'id'>): Promise<{ success: boolean; certification?: Certification; error?: string }> {
    try {
      const profile = this.profiles.get(userId);
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const newCertification: Certification = {
        ...certification,
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedProfile = {
        ...profile,
        certifications: [...profile.certifications, newCertification],
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(userId, updatedProfile);
      this.saveToStorage();

      return { success: true, certification: newCertification };
    } catch (error) {
      console.error('Error adding certification:', error);
      return {
        success: false,
        error: 'Failed to add certification'
      };
    }
  }

  // Validate profile data
  private validateProfile(profile: UserProfile): ProfileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!profile.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!profile.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!profile.email?.trim()) {
      errors.push('Email is required');
    }

    // Email format validation
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation
    if (profile.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profile.phone.replace(/[\s\-\(\)]/g, ''))) {
      warnings.push('Phone number format may be invalid');
    }

    // URL validation
    const urlFields = ['website', 'linkedin', 'github', 'twitter'];
    urlFields.forEach(field => {
      const value = profile[field as keyof UserProfile] as string;
      if (value && !this.isValidUrl(value)) {
        warnings.push(`${field} URL format may be invalid`);
      }
    });

    // Skills validation
    if (profile.skills.length > 50) {
      warnings.push('Too many skills (max 50 recommended)');
    }

    // Bio length validation
    if (profile.bio && profile.bio.length > 2000) {
      warnings.push('Bio is too long (max 2000 characters recommended)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      emailFrequency: 'daily',
      jobAlerts: true,
      marketingEmails: false,
      securityAlerts: true,
      profileVisibility: 'public'
    };
  }

  private getDefaultPrivacySettings(): PrivacySettings {
    return {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showConnections: true,
      allowMessages: 'everyone',
      showOnlineStatus: true,
      dataSharing: false,
      analyticsTracking: true
    };
  }

  private getDefaultNotificationSettings(): NotificationSettings {
    return {
      email: {
        jobMatches: true,
        messages: true,
        connections: true,
        security: true,
        marketing: false,
        weeklyDigest: true
      },
      push: {
        jobMatches: true,
        messages: true,
        connections: true,
        security: true
      },
      sms: {
        security: true,
        important: false
      }
    };
  }

  // Get all profiles (for admin purposes)
  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  // Clear all profiles (for testing)
  clearAllProfiles(): void {
    this.profiles.clear();
    this.saveToStorage();
  }
}

// Create singleton instance
export const profileService = new ProfileService();

// Export types
export type {
  UserProfile,
  UserPreferences,
  WorkExperience,
  Education,
  Certification,
  Language,
  SocialLink,
  PrivacySettings,
  NotificationSettings,
  ProfileUpdateData,
  ProfileValidationResult
};
