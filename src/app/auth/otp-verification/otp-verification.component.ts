import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmailAuthService } from '../services/email-auth.service';

@Component({
  selector: 'app-otp-verification',
  template: `
    <div class="otp-container">
      <div class="otp-card">
        <div class="otp-header">
          <h1 class="google-heading">Verify your email</h1>
          <p class="google-subtitle">
            We sent a 6-digit code to <strong>{{ email }}</strong>
          </p>
        </div>

        <div class="otp-content">
          <!-- OTP Form -->
          <form [formGroup]="otpForm" (ngSubmit)="handleOtpVerification()" class="otp-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Verification code</mat-label>
              <input 
                matInput 
                type="text" 
                formControlName="otp"
                placeholder="000000"
                maxlength="6"
                class="otp-input"
                (input)="onOtpInput($event)">
              <mat-icon matSuffix>security</mat-icon>
              <mat-error *ngIf="otpForm.get('otp')?.hasError('required')">
                Verification code is required
              </mat-error>
              <mat-error *ngIf="otpForm.get('otp')?.hasError('pattern')">
                Please enter a valid 6-digit code
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              type="submit"
              class="google-button full-width"
              [disabled]="!otpForm.valid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">
                {{ action === 'signup' ? 'Create account' : 'Sign in' }}
              </span>
            </button>
          </form>

          <!-- Resend OTP -->
          <div class="resend-section">
            <p class="resend-text">Didn't receive the code?</p>
            <button 
              mat-button 
              class="resend-button"
              (click)="resendOtp()"
              [disabled]="isResending || resendCooldown > 0">
              <span *ngIf="resendCooldown > 0">
                Resend code in {{ resendCooldown }}s
              </span>
              <span *ngIf="resendCooldown === 0">
                {{ isResending ? 'Sending...' : 'Resend code' }}
              </span>
            </button>
          </div>

          <!-- Back Button -->
          <div class="back-section">
            <button 
              mat-button 
              class="back-button"
              (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back to {{ action === 'signup' ? 'sign up' : 'sign in' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .otp-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .otp-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      padding: 40px;
    }

    .otp-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .otp-header h1 {
      font-size: 24px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .otp-header p {
      font-size: 16px;
      color: #5f6368;
      margin: 0;
    }

    .otp-form {
      margin-bottom: 32px;
    }

    .full-width {
      width: 100%;
    }

    .otp-input {
      font-size: 24px;
      text-align: center;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }

    .google-button {
      background-color: #1a73e8;
      color: white;
      height: 48px;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
      margin-top: 24px;
    }

    .google-button:hover {
      background-color: #1557b0;
    }

    .google-button:disabled {
      background-color: #dadce0;
      color: #5f6368;
    }

    .resend-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .resend-text {
      color: #5f6368;
      font-size: 14px;
      margin: 0 0 8px 0;
    }

    .resend-button {
      color: #1a73e8;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .resend-button:disabled {
      color: #5f6368;
    }

    .back-section {
      text-align: center;
    }

    .back-button {
      color: #5f6368;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .back-button:hover {
      color: #1a73e8;
      background-color: rgba(26, 115, 232, 0.04);
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      .otp-card {
        padding: 24px;
        margin: 16px;
      }
    }
  `]
})
export class OtpVerificationComponent implements OnInit {
  otpForm: FormGroup;
  email: string = '';
  action: 'signin' | 'signup' = 'signin';
  isLoading = false;
  isResending = false;
  resendCooldown = 0;
  private cooldownInterval: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private emailAuthService: EmailAuthService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    // Get email and action from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.action = params['action'] || 'signin';
      
      if (!this.email) {
        // Redirect back if no email provided
        this.router.navigate([`/auth/${this.action}`]);
      }
    });

    // Start resend cooldown
    this.startResendCooldown();
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  // Handle OTP Input - Auto-format
  onOtpInput(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    this.otpForm.patchValue({ otp: value });
  }

  // Verify OTP
  async handleOtpVerification(): Promise<void> {
    if (this.otpForm.valid) {
      this.isLoading = true;
      const otp = this.otpForm.get('otp')?.value;

      try {
        const response = await this.emailAuthService.verifyOtp(this.email, otp, this.action);
        
        if (response && (response as any).success) {
          // Success - user will be redirected by auth service
          // The auth service handles setting the session and navigation
        } else {
          // Error - show error message (handled by service)
          this.otpForm.patchValue({ otp: '' });
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        this.otpForm.patchValue({ otp: '' });
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Resend OTP
  async resendOtp(): Promise<void> {
    if (this.resendCooldown > 0) return;

    this.isResending = true;
    try {
      const response = await this.emailAuthService.resendOtp(this.email, this.action);
      
      if (response.success) {
        this.startResendCooldown();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      this.isResending = false;
    }
  }

  // Start resend cooldown timer
  private startResendCooldown(): void {
    this.resendCooldown = 60; // 60 seconds
    
    this.cooldownInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownInterval);
        this.cooldownInterval = null;
      }
    }, 1000);
  }

  // Go back to previous page
  goBack(): void {
    this.router.navigate([`/auth/${this.action}`]);
  }
}
