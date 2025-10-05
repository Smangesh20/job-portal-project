import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Auth Components
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

// Auth Services
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailAuthService } from './services/email-auth.service';

// Auth Routes
import { authRoutes } from './auth.routes';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    OtpVerificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRoutes),
    
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    GoogleAuthService,
    EmailAuthService
  ]
})
export class AuthModule { }
