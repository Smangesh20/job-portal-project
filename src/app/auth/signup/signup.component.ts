import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GoogleAuthService } from '../services/google-auth.service';
import { EmailAuthService } from '../services/email-auth.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <div class="signup-header">
          <h1 class="google-heading">Create your account</h1>
          <p class="google-subtitle">Join AskYaCham and start your journey</p>
        </div>

        <div class="signup-content">
          <!-- Google Sign-Up Button -->
          <div class="google-signup-section">
            <button 
              mat-raised-button 
              class="google-signup-button"
              (click)="handleGoogleSignup()"
              [disabled]="isLoading">
              <img src="assets/google-logo.svg" alt="Google" class="google-logo">
              Sign up with Google
            </button>
          </div>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <!-- Email Sign-Up Form -->
          <form [formGroup]="signupForm" (ngSubmit)="handleEmailSignup()" class="email-signup-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email address</mat-label>
              <input 
                matInput 
                type="email" 
                formControlName="email"
                placeholder="Enter your email"
                autocomplete="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              type="submit"
              class="google-button full-width"
              [disabled]="!signupForm.valid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Create account with OTP</span>
            </button>
          </form>

          <!-- Sign In Link -->
          <div class="signin-link">
            <p>Already have an account? 
              <a routerLink="/auth/signin" class="link">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .signup-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      padding: 40px;
    }

    .signup-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .signup-header h1 {
      font-size: 24px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .signup-header p {
      font-size: 16px;
      color: #5f6368;
      margin: 0;
    }

    .google-signup-section {
      margin-bottom: 24px;
    }

    .google-signup-button {
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

    .google-signup-button:hover {
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

    .email-signup-form {
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

    .signin-link {
      text-align: center;
    }

    .signin-link p {
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
      .signup-card {
        padding: 24px;
        margin: 16px;
      }
    }
  `]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private emailAuthService: EmailAuthService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Initialize Google Identity Services
    this.googleAuthService.initializeGoogleIdentity();
  }

  // Google Sign-Up - Forces Consent Screen
  async handleGoogleSignup(): Promise<void> {
    this.isLoading = true;
    try {
      // Clear Google cache to force consent screen
      this.googleAuthService.clearGoogleCache();
      
      // Small delay to ensure cache is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await this.authService.signUpWithGoogle();
    } catch (error) {
      console.error('Google signup error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Email Sign-Up with OTP
  async handleEmailSignup(): Promise<void> {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const email = this.signupForm.get('email')?.value;

      try {
        const response = await this.emailAuthService.sendOtp(email, 'signup');
        
        if (response.success) {
          // Navigate to OTP verification with email
          this.router.navigate(['/auth/otp-verification'], {
            queryParams: { email, action: 'signup' }
          });
        }
      } catch (error) {
        console.error('Email signup error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
