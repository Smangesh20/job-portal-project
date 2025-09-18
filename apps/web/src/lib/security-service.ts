// Comprehensive Security Service
// Provides enterprise-level security measures and threat protection

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'password_reset' | 'suspicious_activity' | 'brute_force' | 'data_access' | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  details: Record<string, any>;
  timestamp: string;
  resolved: boolean;
}

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  suspiciousActivityThreshold: number;
  bruteForceThreshold: number;
  sessionTimeout: number; // minutes
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
  };
  rateLimiting: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  ipWhitelist: string[];
  ipBlacklist: string[];
  geolocationRestrictions: string[]; // country codes
}

interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
  plugins: string[];
  fonts: string[];
  canvas: string;
  webgl: string;
  audio: string;
  createdAt: string;
  lastSeen: string;
  isTrusted: boolean;
}

interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  blockedIPs: number;
  suspiciousActivities: number;
  bruteForceAttempts: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

class SecurityService {
  private events: SecurityEvent[] = [];
  private deviceFingerprints: Map<string, DeviceFingerprint> = new Map();
  private loginAttempts: Map<string, { count: number; lastAttempt: number; locked: boolean }> = new Map();
  private rateLimits: Map<string, { requests: number; windowStart: number }> = new Map();
  private config: SecurityConfig;

  constructor() {
    this.config = this.getDefaultConfig();
    this.loadFromStorage();
    this.startSecurityMonitoring();
  }

  private getDefaultConfig(): SecurityConfig {
    return {
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      suspiciousActivityThreshold: 3,
      bruteForceThreshold: 10,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90
      },
      rateLimiting: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      ipWhitelist: [],
      ipBlacklist: [],
      geolocationRestrictions: []
    };
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined') return;

      const storedEvents = localStorage.getItem('askyacham_security_events');
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      }

      const storedFingerprints = localStorage.getItem('askyacham_device_fingerprints');
      if (storedFingerprints) {
        const fingerprints = JSON.parse(storedFingerprints);
        fingerprints.forEach((fp: DeviceFingerprint) => {
          this.deviceFingerprints.set(fp.id, fp);
        });
      }

      const storedConfig = localStorage.getItem('askyacham_security_config');
      if (storedConfig) {
        this.config = { ...this.config, ...JSON.parse(storedConfig) };
      }
    } catch (error) {
      console.error('Error loading security data from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      if (typeof window === 'undefined') return;

      localStorage.setItem('askyacham_security_events', JSON.stringify(this.events));
      localStorage.setItem('askyacham_device_fingerprints', JSON.stringify(Array.from(this.deviceFingerprints.values())));
      localStorage.setItem('askyacham_security_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving security data to localStorage:', error);
    }
  }

  // Generate device fingerprint
  generateDeviceFingerprint(): DeviceFingerprint {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 2, 2);
    
    const fingerprint: DeviceFingerprint = {
      id: this.generateFingerprintId(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      plugins: Array.from(navigator.plugins).map(p => p.name),
      fonts: this.getAvailableFonts(),
      canvas: canvas.toDataURL(),
      webgl: this.getWebGLFingerprint(),
      audio: this.getAudioFingerprint(),
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isTrusted: false
    };

    this.deviceFingerprints.set(fingerprint.id, fingerprint);
    this.saveToStorage();
    return fingerprint;
  }

  // Validate device fingerprint
  validateDeviceFingerprint(fingerprint: DeviceFingerprint): { isValid: boolean; riskScore: number; reasons: string[] } {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check if device is known
    const knownDevice = Array.from(this.deviceFingerprints.values())
      .find(d => d.id === fingerprint.id);

    if (!knownDevice) {
      riskScore += 30;
      reasons.push('Unknown device');
    } else {
      // Check for significant changes
      if (knownDevice.userAgent !== fingerprint.userAgent) {
        riskScore += 20;
        reasons.push('User agent changed');
      }
      if (knownDevice.screenResolution !== fingerprint.screenResolution) {
        riskScore += 15;
        reasons.push('Screen resolution changed');
      }
      if (knownDevice.timezone !== fingerprint.timezone) {
        riskScore += 25;
        reasons.push('Timezone changed');
      }
    }

    // Check for suspicious patterns
    if (fingerprint.doNotTrack) {
      riskScore += 10;
      reasons.push('Do Not Track enabled');
    }

    if (fingerprint.plugins.length === 0) {
      riskScore += 15;
      reasons.push('No plugins detected');
    }

    return {
      isValid: riskScore < 50,
      riskScore,
      reasons
    };
  }

  // Rate limiting
  checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = this.config.rateLimiting.requestsPerMinute;

    const current = this.rateLimits.get(identifier);
    
    if (!current || now - current.windowStart > windowMs) {
      // New window
      this.rateLimits.set(identifier, {
        requests: 1,
        windowStart: now
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }

    if (current.requests >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.windowStart + windowMs
      };
    }

    current.requests++;
    this.rateLimits.set(identifier, current);

    return {
      allowed: true,
      remaining: limit - current.requests,
      resetTime: current.windowStart + windowMs
    };
  }

  // Login attempt tracking
  trackLoginAttempt(email: string, success: boolean, ip: string, userAgent: string): { allowed: boolean; lockoutTime?: number } {
    const key = `${email}_${ip}`;
    const now = Date.now();
    const lockoutMs = this.config.lockoutDuration * 60 * 1000;

    let attempt = this.loginAttempts.get(key);
    
    if (!attempt) {
      attempt = { count: 0, lastAttempt: now, locked: false };
    }

    // Check if still locked
    if (attempt.locked && now - attempt.lastAttempt < lockoutMs) {
      this.logSecurityEvent({
        type: 'brute_force',
        severity: 'high',
        userId: email,
        ip,
        userAgent,
        details: { reason: 'Account locked due to too many failed attempts' }
      });
      
      return {
        allowed: false,
        lockoutTime: attempt.lastAttempt + lockoutMs
      };
    }

    // Reset if lockout period has passed
    if (attempt.locked && now - attempt.lastAttempt >= lockoutMs) {
      attempt.locked = false;
      attempt.count = 0;
    }

    if (success) {
      // Reset on successful login
      attempt.count = 0;
      attempt.locked = false;
      this.loginAttempts.set(key, attempt);
      return { allowed: true };
    } else {
      // Increment failed attempts
      attempt.count++;
      attempt.lastAttempt = now;

      if (attempt.count >= this.config.maxLoginAttempts) {
        attempt.locked = true;
        this.logSecurityEvent({
          type: 'brute_force',
          severity: 'critical',
          userId: email,
          ip,
          userAgent,
          details: { 
            reason: 'Account locked due to too many failed attempts',
            attempts: attempt.count
          }
        });
      } else {
        this.logSecurityEvent({
          type: 'login_attempt',
          severity: 'medium',
          userId: email,
          ip,
          userAgent,
          details: { 
            reason: 'Failed login attempt',
            attempts: attempt.count,
            maxAttempts: this.config.maxLoginAttempts
          }
        });
      }

      this.loginAttempts.set(key, attempt);
      
      return {
        allowed: !attempt.locked,
        lockoutTime: attempt.locked ? now + lockoutMs : undefined
      };
    }
  }

  // Password strength validation
  validatePasswordStrength(password: string): { isValid: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < this.config.passwordPolicy.minLength) {
      feedback.push(`Password must be at least ${this.config.passwordPolicy.minLength} characters long`);
    } else {
      score += 20;
    }

    if (this.config.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else if (this.config.passwordPolicy.requireUppercase) {
      score += 20;
    }

    if (this.config.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else if (this.config.passwordPolicy.requireLowercase) {
      score += 20;
    }

    if (this.config.passwordPolicy.requireNumbers && !/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else if (this.config.passwordPolicy.requireNumbers) {
      score += 20;
    }

    if (this.config.passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain at least one special character');
    } else if (this.config.passwordPolicy.requireSpecialChars) {
      score += 20;
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Password should not contain repeated characters');
      score -= 10;
    }

    if (/123|abc|qwe/i.test(password)) {
      feedback.push('Password should not contain common sequences');
      score -= 10;
    }

    return {
      isValid: feedback.length === 0,
      score: Math.max(0, Math.min(100, score)),
      feedback
    };
  }

  // Log security event
  logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    this.events.push(securityEvent);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    this.saveToStorage();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', securityEvent);
    }

    // In production, this would send to security monitoring service
    this.sendToSecurityMonitoring(securityEvent);
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const last7Days = now - (7 * 24 * 60 * 60 * 1000);
    const last30Days = now - (30 * 24 * 60 * 60 * 1000);

    const events24h = this.events.filter(e => new Date(e.timestamp).getTime() > last24Hours);
    const events7d = this.events.filter(e => new Date(e.timestamp).getTime() > last7Days);
    const events30d = this.events.filter(e => new Date(e.timestamp).getTime() > last30Days);

    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      blockedIPs: this.config.ipBlacklist.length,
      suspiciousActivities: this.events.filter(e => e.type === 'suspicious_activity').length,
      bruteForceAttempts: this.events.filter(e => e.type === 'brute_force').length,
      last24Hours: events24h.length,
      last7Days: events7d.length,
      last30Days: events30d.length
    };
  }

  // Get recent security events
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Clear security data (for testing)
  clearSecurityData(): void {
    this.events = [];
    this.deviceFingerprints.clear();
    this.loginAttempts.clear();
    this.rateLimits.clear();
    this.saveToStorage();
  }

  // Private helper methods
  private generateFingerprintId(): string {
    return `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAvailableFonts(): string[] {
    if (typeof window === 'undefined') return [];
    
    const fonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact'
    ];
    
    return fonts.filter(font => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      ctx.font = `12px ${font}`;
      return ctx.measureText('test').width !== ctx.measureText('test').width;
    });
  }

  private getWebGLFingerprint(): string {
    if (typeof window === 'undefined') return 'no-window';
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch {
      return 'error';
    }
  }

  private getAudioFingerprint(): string {
    if (typeof window === 'undefined') return 'no-window';
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.start();
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      oscillator.stop();
      audioContext.close();
      
      return Array.from(dataArray).slice(0, 10).join(',');
    } catch {
      return 'error';
    }
  }

  private startSecurityMonitoring(): void {
    // Monitor for suspicious activities
    setInterval(() => {
      this.detectSuspiciousActivity();
    }, 60000); // Check every minute

    // Clean up old data
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }

  private detectSuspiciousActivity(): void {
    const now = Date.now();
    const recentEvents = this.events.filter(e => 
      new Date(e.timestamp).getTime() > now - (60 * 60 * 1000) // Last hour
    );

    // Check for multiple failed logins from same IP
    const failedLogins = recentEvents.filter(e => 
      e.type === 'login_attempt' && e.severity === 'medium'
    );

    const ipCounts = failedLogins.reduce((acc, event) => {
      acc[event.ip] = (acc[event.ip] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(ipCounts).forEach(([ip, count]) => {
      if (count >= this.config.suspiciousActivityThreshold) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          ip,
          userAgent: 'Unknown',
          details: { 
            reason: 'Multiple failed login attempts from same IP',
            count,
            threshold: this.config.suspiciousActivityThreshold
          }
        });
      }
    });
  }

  private cleanupOldData(): void {
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days
    
    this.events = this.events.filter(e => 
      new Date(e.timestamp).getTime() > cutoff
    );

    // Clean up old login attempts
    for (const [key, attempt] of this.loginAttempts.entries()) {
      if (Date.now() - attempt.lastAttempt > cutoff) {
        this.loginAttempts.delete(key);
      }
    }

    // Clean up old rate limits
    for (const [key, limit] of this.rateLimits.entries()) {
      if (Date.now() - limit.windowStart > 24 * 60 * 60 * 1000) { // 24 hours
        this.rateLimits.delete(key);
      }
    }

    this.saveToStorage();
  }

  private sendToSecurityMonitoring(event: SecurityEvent): void {
    // In production, this would send to a security monitoring service
    // For now, we'll just log it
    console.log('Security monitoring alert:', event);
  }
}

// Create singleton instance
export const securityService = new SecurityService();

// Export types
export type {
  SecurityEvent,
  SecurityConfig,
  DeviceFingerprint,
  SecurityMetrics
};
