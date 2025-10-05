import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OtpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailAuthService {
  private readonly API_BASE_URL = 'https://www.askyacham.com/api/auth';
  
  private otpSentSubject = new BehaviorSubject<boolean>(false);
  public otpSent$ = this.otpSentSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  // Send OTP for Email Authentication
  async sendOtp(email: string, action: 'signin' | 'signup'): Promise<OtpResponse> {
    try {
      const response = await this.http.post<OtpResponse>(`${this.API_BASE_URL}/send-otp`, {
        email: email.toLowerCase().trim(),
        action
      }).toPromise();

      if (response?.success) {
        this.otpSentSubject.next(true);
        this.showSuccess(`Verification code sent to ${email}`);
      } else {
        this.showError(response?.error || 'Failed to send verification code');
      }

      return response || { success: false, error: 'Network error' };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      this.showError('Failed to send verification code');
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string, action: 'signin' | 'signup'): Promise<any> {
    try {
      const response = await this.http.post(`${this.API_BASE_URL}/verify-otp`, {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
        action
      }).toPromise();

      if (response && (response as any).success) {
        this.otpSentSubject.next(false);
        this.showSuccess(action === 'signin' ? 'Welcome back!' : 'Account created successfully!');
      } else {
        this.showError('Invalid verification code');
      }

      return response;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      this.showError('Invalid verification code');
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // Resend OTP
  async resendOtp(email: string, action: 'signin' | 'signup'): Promise<OtpResponse> {
    try {
      const response = await this.http.post<OtpResponse>(`${this.API_BASE_URL}/resend-otp`, {
        email: email.toLowerCase().trim(),
        action
      }).toPromise();

      if (response?.success) {
        this.showSuccess('Verification code resent');
      } else {
        this.showError(response?.error || 'Failed to resend verification code');
      }

      return response || { success: false, error: 'Network error' };
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      this.showError('Failed to resend verification code');
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // Validate Email Format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate OTP Format
  isValidOtp(otp: string): boolean {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }

  // Reset OTP State
  resetOtpState(): void {
    this.otpSentSubject.next(false);
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
