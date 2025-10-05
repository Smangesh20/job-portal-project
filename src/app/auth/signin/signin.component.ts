import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { EmailAuthService } from '../services/email-auth.service';

@Component({
  selector: 'app-signin',
  template: `
    <div class="signin-container">
      <div class="signin-card">
        <div class="signin-header">
          <h1 class="google-heading">Welcome back</h1>
          <p class="google-subtitle">Sign in to your AskYaCham account</p>
        </div>

        <div class="signin-content">
          <!-- Google Sign-In Button -->
          <div class="google-signin-section">
            <button 
              mat-raised-button 
              class="google-signin-button"
              (click)="handleGoogleSignin()"
              [disabled]="isLoading">
              <img src="assets/google-logo.svg" alt="Google" class="google-logo">
              Continue with Google
            </button>
          </div>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <!-- Email Sign-In Form -->
          <form [formGroup]="signinForm" (ngSubmit)="handleEmailSignin()" class="email-signin-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email address</mat-label>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="signinForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="signinForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              type="submit"
              class="google-button full-width"
              [disabled]="!signinForm.valid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Send verification code</span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <div class="signup-link">
            <p>Don't have an account? 
              <a routerLink="/auth/signup" class="link">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signin-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .signin-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      padding: 40px;
    }

    .signin-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .signin-header h1 {
      font-size: 24px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .signin-header p {
      font-size: 16px;
      color: #5f6368;
      margin: 0;
    }

    .google-signin-section {
      margin-bottom: 24px;
    }

    .google-signin-button {
      width: 100%;
      height: 48px;
      background: white;
      color: #3c4043;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.2s ease;
    }

    .google-signin-button:hover {
      background: #f8f9fa;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    }

    .google-logo {
      width: 20px;
      height: 20px;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #dadce0;
    }

    .divider-text {
      padding: 0 16px;
      color: #5f6368;
      font-size: 14px;
    }

    .email-signin-form {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
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
      margin-top: 16px;
    }

    .google-button:hover {
      background-color: #1557b0;
    }

    .google-button:disabled {
      background-color: #dadce0;
      color: #5f6368;
    }

    .signup-link {
      text-align: center;
    }

    .signup-link p {
      color: #5f6368;
      font-size: 14px;
      margin: 0;
    }

    .link {
      color: #1a73e8;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      .signin-card {
        padding: 24px;
        margin: 16px;
      }
    }
  `]
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private emailAuthService: EmailAuthService
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Initialize Google Identity Services
    this.googleAuthService.initializeGoogleIdentity();
  }

  // Google Sign-In
  async handleGoogleSignin(): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Google signin error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Email Sign-In with OTP
  async handleEmailSignin(): Promise<void> {
    if (this.signinForm.valid) {
      this.isLoading = true;
      const email = this.signinForm.get('email')?.value;

      try {
        const response = await this.emailAuthService.sendOtp(email, 'signin');
        
        if (response.success) {
          // Navigate to OTP verification with email
          this.router.navigate(['/auth/otp-verification'], {
            queryParams: { email, action: 'signin' }
          });
        }
      } catch (error) {
        console.error('Email signin error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
