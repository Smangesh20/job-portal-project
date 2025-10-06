import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from './auth.service';

export interface GoogleAuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private readonly GOOGLE_CLIENT_ID = '656381536461-b7alo137q7uk9q6qgar13c882pp4hqva.apps.googleusercontent.com';
  private readonly API_BASE_URL = 'https://www.askyacham.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  // Initialize Google Identity Services
  initializeGoogleIdentity(): void {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: this.handleGoogleResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
    }
  }

  // Handle Google Identity Services Response
  private async handleGoogleResponse(response: any): Promise<void> {
    try {
      console.log('Google Identity Services response:', response);
      
      // Decode JWT token
      const payload = this.decodeJwtPayload(response.credential);
      console.log('Decoded JWT payload:', payload);

      // Create user object
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

      // Set user session
      this.authService['setUserSession'](user);
      this.authService['currentUserSubject'].next(user);

      this.showSuccess('Welcome! Signed in successfully');
      this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error('Error handling Google response:', error);
      this.showError('Failed to sign in with Google');
    }
  }

  // Decode JWT payload
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

  // Render Google Sign-In Button
  renderGoogleSignInButton(elementId: string, action: 'signin' | 'signup'): void {
    if (typeof window !== 'undefined' && (window as any).google) {
      const buttonConfig = {
        theme: 'outline',
        size: 'large',
        text: action === 'signin' ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%'
      };

      (window as any).google.accounts.id.renderButton(
        document.getElementById(elementId),
        buttonConfig
      );
    }
  }

  // Handle OAuth callback (for server-side OAuth flow)
  async handleOAuthCallback(code: string, state: string): Promise<void> {
    try {
      const action = state.includes('signup') ? 'signup' : 'signin';
      const callbackUrl = `${this.API_BASE_URL}/google/${action}/callback`;

      // Exchange code for tokens
      const response = await this.http.post<GoogleAuthResponse>(callbackUrl, {
        code,
        state
      }).toPromise();

      if (response?.success && response.user) {
        this.authService['setUserSession'](response.user);
        this.authService['currentUserSubject'].next(response.user);
        
        this.showSuccess(action === 'signup' ? 'Account created successfully!' : 'Welcome back!');
        this.router.navigate(['/dashboard']);
      } else {
        this.showError(response?.error || 'Authentication failed');
      }

    } catch (error: any) {
      console.error('OAuth callback error:', error);
      this.showError('Authentication failed');
    }
  }

  // Clear Google Cache (for signup to force consent)
  clearGoogleCache(): void {
    try {
      // Clear Google Identity Services
      if ((window as any).google?.accounts) {
        (window as any).google.accounts.id.disableAutoSelect();
        (window as any).google.accounts.id.cancel();
        (window as any).google.accounts.id.prompt();
      }

      // Clear legacy GAPI
      if ((window as any).gapi?.auth2) {
        (window as any).gapi.auth2.getAuthInstance()?.signOut();
      }

      // Clear all storage aggressively
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear specific Google-related storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('google') || key.includes('gapi') || key.includes('oauth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear cookies more aggressively
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name.includes('google') || name.includes('oauth') || name.includes('gapi')) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.google.com";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.accounts.google.com";
        }
      }

      // Clear IndexedDB
      if ('indexedDB' in window) {
        indexedDB.deleteDatabase('google-oauth-cache');
        indexedDB.deleteDatabase('gapi-cache');
      }

      console.log('🔥 Aggressively cleared Google cache for signup');

    } catch (error) {
      console.warn('Error clearing Google cache:', error);
    }
  }

  // Utility Methods
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
