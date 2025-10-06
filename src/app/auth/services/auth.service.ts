import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
  provider: 'google' | 'email';
  created_at: string;
  last_login: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly API_BASE_URL = 'https://www.askyacham.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check for existing session on app initialization
    const userSession = this.getUserSession();
    if (userSession) {
      this.currentUserSubject.next(userSession);
    }
  }

  // Google Authentication
  async signInWithGoogle(): Promise<void> {
    try {
      // Redirect to Google OAuth for signin
      window.location.href = `${this.API_BASE_URL}/google/signin`;
    } catch (error) {
      console.error('Google signin error:', error);
      this.showError('Failed to sign in with Google');
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      // Clear any existing Google cache
      this.clearGoogleCache();
      
      // Use Google Identity Services for signup with consent
      this.initializeGoogleSignup();
    } catch (error) {
      console.error('Google signup error:', error);
      this.showError('Failed to sign up with Google');
    }
  }

  private initializeGoogleSignup(): void {
    // Load Google Identity Services if not already loaded
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => this.renderSignupButton();
      document.head.appendChild(script);
    } else {
      this.renderSignupButton();
    }
  }

  private renderSignupButton(): void {
    (window as any).google.accounts.id.initialize({
      client_id: '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com',
      callback: this.handleGoogleSignupResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Force consent screen for signup
    (window as any).google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: redirect to Google OAuth
        const params = new URLSearchParams({
          client_id: '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com',
          redirect_uri: window.location.origin + '/auth/google/callback',
          response_type: 'code',
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline'
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }
    });
  }

  private handleGoogleSignupResponse(response: any): void {
    console.log('Google signup response:', response);
    // Handle the response here
  }

  // Email Authentication with OTP
  async sendOtp(email: string, action: 'signin' | 'signup'): Promise<AuthResponse> {
    try {
      const response = await this.http.post<AuthResponse>(`${this.API_BASE_URL}/send-otp`, {
        email,
        action
      }).toPromise();

      if (response?.success) {
        this.showSuccess(`Verification code sent to ${email}`);
      }

      return response || { success: false, error: 'Failed to send OTP' };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      this.showError('Failed to send verification code');
      return { success: false, error: error.message || 'Network error' };
    }
  }

  async verifyOtp(email: string, otp: string, action: 'signin' | 'signup'): Promise<AuthResponse> {
    try {
      const response = await this.http.post<AuthResponse>(`${this.API_BASE_URL}/verify-otp`, {
        email,
        otp,
        action
      }).toPromise();

      if (response?.success && response.user) {
        this.setUserSession(response.user);
        this.currentUserSubject.next(response.user);
        this.showSuccess(action === 'signin' ? 'Welcome back!' : 'Account created successfully!');
        this.router.navigate(['/dashboard']);
      }

      return response || { success: false, error: 'Failed to verify OTP' };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      this.showError('Invalid verification code');
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // Session Management
  private setUserSession(user: User): void {
    const sessionData = {
      ...user,
      session_token: this.generateSessionToken(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    localStorage.setItem('user_session', JSON.stringify(sessionData));
  }

  private getUserSession(): User | null {
    try {
      const sessionData = localStorage.getItem('user_session');
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading user session:', error);
      this.logout();
      return null;
    }
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Logout
  logout(): void {
    this.clearGoogleCache();
    localStorage.removeItem('user_session');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/signin']);
    this.showSuccess('Signed out successfully');
  }

  // Google Cache Clearing
  private clearGoogleCache(): void {
    try {
      // Clear localStorage
      localStorage.removeItem('gapi');
      localStorage.removeItem('google_auth');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear Google OAuth cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Clear Google Identity Services cache
      if ((window as any).google?.accounts) {
        (window as any).google.accounts.id.disableAutoSelect();
        (window as any).google.accounts.id.cancel();
      }
      
      // Clear legacy GAPI cache
      if ((window as any).gapi?.auth2) {
        (window as any).gapi.auth2.getAuthInstance()?.signOut();
      }
    } catch (error) {
      console.warn('Error clearing Google cache:', error);
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['google-success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['google-error-snackbar']
    });
  }
}
