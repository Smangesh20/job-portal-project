import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

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

  private readonly API_BASE_URL = `${environment.apiUrl}/auth`;

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
      // Use Google Identity Services for signin
      this.initializeGoogleSignin();
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

  private initializeGoogleSignin(): void {
    // Load Google Identity Services if not already loaded
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => this.renderSigninButton();
      document.head.appendChild(script);
    } else {
      this.renderSigninButton();
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
      client_id: environment.googleClientId,
      callback: this.handleGoogleSignupResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Force consent screen for signup
    (window as any).google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: redirect to Google OAuth
        const params = new URLSearchParams({
          client_id: environment.googleClientId,
          redirect_uri: environment.appUrl + '/api/auth/google/signup/callback',
          response_type: 'code',
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline'
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }
    });
  }

  private renderSigninButton(): void {
    (window as any).google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleSigninResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Show account selection for signin
    (window as any).google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: redirect to Google OAuth
        const params = new URLSearchParams({
          client_id: environment.googleClientId,
          redirect_uri: environment.appUrl + '/api/auth/google/signin/callback',
          response_type: 'code',
          scope: 'openid email profile',
          prompt: 'select_account',
          access_type: 'offline'
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      }
    });
  }

  private handleGoogleSigninResponse(response: any): void {
    console.log('Google signin response:', response);
    // Decode JWT token and handle signin
    try {
      const payload = this.decodeJwtPayload(response.credential);
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        verified_email: payload.email_verified,
        provider: 'google',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      this.setUserSession(user);
      this.currentUserSubject.next(user);
      this.showSuccess('Welcome back!');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error handling Google signin response:', error);
      this.showError('Failed to sign in with Google');
    }
  }

  private handleGoogleSignupResponse(response: any): void {
    console.log('Google signup response:', response);
    // Decode JWT token and handle signup
    try {
      const payload = this.decodeJwtPayload(response.credential);
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        verified_email: payload.email_verified,
        provider: 'google',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      this.setUserSession(user);
      this.currentUserSubject.next(user);
      this.showSuccess('Account created successfully!');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error handling Google signup response:', error);
      this.showError('Failed to sign up with Google');
    }
  }

  private decodeJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
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
