import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-container">
      <!-- Settings Header -->
      <div class="settings-header">
        <h2 class="section-title">Settings</h2>
        <p class="section-subtitle">Manage your account preferences and privacy</p>
      </div>

      <!-- Settings Tabs -->
      <mat-tab-group class="settings-tabs">
        <!-- Account Settings -->
        <mat-tab label="Account">
          <ng-template matTabContent>
            <mat-card class="settings-card">
              <mat-card-header>
                <mat-card-title>Account Information</mat-card-title>
                <mat-card-subtitle>Manage your account details</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <form [formGroup]="accountForm" (ngSubmit)="updateAccount()">
                  <div class="form-section">
                    <h3>Basic Information</h3>
                    <div class="form-row">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Full Name</mat-label>
                        <input matInput formControlName="fullName">
                        <mat-icon matSuffix>person</mat-icon>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline" class="email-field">
                        <mat-label>Email Address</mat-label>
                        <input matInput type="email" formControlName="email" readonly>
                        <mat-icon matSuffix>email</mat-icon>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="phone-field">
                        <mat-label>Phone Number</mat-label>
                        <input matInput type="tel" formControlName="phone">
                        <mat-icon matSuffix>phone</mat-icon>
                      </mat-form-field>
                    </div>
                  </div>

                  <div class="form-section">
                    <h3>Password & Security</h3>
                    <div class="security-info">
                      <mat-icon>security</mat-icon>
                      <div class="security-text">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <button mat-raised-button class="setup-2fa-button">
                        Setup 2FA
                      </button>
                    </div>

                    <div class="password-section">
                      <button mat-button class="change-password-button">
                        <mat-icon>lock</mat-icon>
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button type="submit" class="save-button" [disabled]="!accountForm.valid">
                      <mat-icon>save</mat-icon>
                      Save Changes
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </mat-tab>

        <!-- Privacy Settings -->
        <mat-tab label="Privacy">
          <ng-template matTabContent>
            <mat-card class="settings-card">
              <mat-card-header>
                <mat-card-title>Privacy &amp; Data</mat-card-title>
                <mat-card-subtitle>Control how your data is used</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="privacy-section">
                  <h3>Profile Visibility</h3>
                  <div class="privacy-option">
                    <div class="option-info">
                      <h4>Public Profile</h4>
                      <p>Make your profile visible to employers and recruiters</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="privacySettings.publicProfile"></mat-slide-toggle>
                  </div>

                  <div class="privacy-option">
                    <div class="option-info">
                      <h4>Show Contact Information</h4>
                      <p>Display your email and phone number on your profile</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="privacySettings.showContact"></mat-slide-toggle>
                  </div>
                </div>

                <div class="privacy-section">
                  <h3>Job Recommendations</h3>
                  <div class="privacy-option">
                    <div class="option-info">
                      <h4>Email Notifications</h4>
                      <p>Receive job recommendations via email</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="privacySettings.emailNotifications"></mat-slide-toggle>
                  </div>

                  <div class="privacy-option">
                    <div class="option-info">
                      <h4>Push Notifications</h4>
                      <p>Get notified about new job matches</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="privacySettings.pushNotifications"></mat-slide-toggle>
                  </div>
                </div>

                <div class="privacy-section">
                  <h3>Data & Analytics</h3>
                  <div class="privacy-option">
                    <div class="option-info">
                      <h4>Analytics Tracking</h4>
                      <p>Help us improve our service by sharing anonymous usage data</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="privacySettings.analyticsTracking"></mat-slide-toggle>
                  </div>
                </div>

                <div class="form-actions">
                  <button mat-raised-button class="save-button" (click)="updatePrivacySettings()">
                    <mat-icon>save</mat-icon>
                    Save Privacy Settings
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </mat-tab>

        <!-- Notifications -->
        <mat-tab label="Notifications">
          <ng-template matTabContent>
            <mat-card class="settings-card">
              <mat-card-header>
                <mat-card-title>Notification Preferences</mat-card-title>
                <mat-card-subtitle>Choose what notifications you want to receive</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="notification-section">
                  <h3>Email Notifications</h3>
                  <div class="notification-option">
                    <div class="option-info">
                      <h4>Job Matches</h4>
                      <p>Get notified when we find jobs that match your profile</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="notificationSettings.jobMatches"></mat-slide-toggle>
                  </div>

                  <div class="notification-option">
                    <div class="option-info">
                      <h4>Application Updates</h4>
                      <p>Receive updates about your job applications</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="notificationSettings.applicationUpdates"></mat-slide-toggle>
                  </div>

                  <div class="notification-option">
                    <div class="option-info">
                      <h4>Company Updates</h4>
                      <p>Stay informed about companies you're interested in</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="notificationSettings.companyUpdates"></mat-slide-toggle>
                  </div>

                  <div class="notification-option">
                    <div class="option-info">
                      <h4>Newsletter</h4>
                      <p>Receive our weekly job market insights and tips</p>
                    </div>
                    <mat-slide-toggle [(ngModel)]="notificationSettings.newsletter"></mat-slide-toggle>
                  </div>
                </div>

                <div class="notification-section">
                  <h3>Frequency</h3>
                  <div class="frequency-options">
                    <mat-form-field appearance="outline">
                      <mat-label>Email Frequency</mat-label>
                      <mat-select [(value)]="notificationSettings.frequency">
                        <mat-option value="immediate">Immediate</mat-option>
                        <mat-option value="daily">Daily Digest</mat-option>
                        <mat-option value="weekly">Weekly Summary</mat-option>
                        <mat-option value="never">Never</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-actions">
                  <button mat-raised-button class="save-button" (click)="updateNotificationSettings()">
                    <mat-icon>save</mat-icon>
                    Save Notification Settings
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </mat-tab>

        <!-- Danger Zone -->
        <mat-tab label="Danger Zone">
          <ng-template matTabContent>
            <mat-card class="settings-card danger-card">
              <mat-card-header>
                <mat-card-title class="danger-title">Danger Zone</mat-card-title>
                <mat-card-subtitle>Irreversible and destructive actions</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="danger-section">
                  <div class="danger-option">
                    <div class="option-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button mat-raised-button color="warn" class="delete-account-button">
                      <mat-icon>delete_forever</mat-icon>
                      Delete Account
                    </button>
                  </div>

                  <div class="danger-option">
                    <div class="option-info">
                      <h4>Export Data</h4>
                      <p>Download a copy of all your data before deleting your account</p>
                    </div>
                    <button mat-raised-button class="export-data-button">
                      <mat-icon>download</mat-icon>
                      Export Data
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }

    .settings-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .section-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 32px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 16px;
      color: #5f6368;
      margin: 0;
    }

    .settings-tabs {
      margin-bottom: 32px;
    }

    .settings-card {
      margin-bottom: 24px;
    }

    .danger-card {
      border: 1px solid #ea4335;
    }

    .danger-title {
      color: #ea4335;
    }

    .form-section {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e8eaed;
    }

    .form-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .form-section h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 16px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
    }

    .email-field {
      flex: 1;
    }

    .phone-field {
      flex: 1;
    }

    .security-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .security-info mat-icon {
      color: #1a73e8;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .security-text {
      flex: 1;
    }

    .security-text h4 {
      font-family: 'Google Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 4px 0;
    }

    .security-text p {
      font-size: 14px;
      color: #5f6368;
      margin: 0;
    }

    .setup-2fa-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .setup-2fa-button:hover {
      background-color: #1557b0;
    }

    .password-section {
      margin-bottom: 16px;
    }

    .change-password-button {
      color: #1a73e8;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .privacy-section,
    .notification-section {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e8eaed;
    }

    .privacy-section:last-child,
    .notification-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .privacy-section h3,
    .notification-section h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 16px 0;
    }

    .privacy-option,
    .notification-option,
    .danger-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .privacy-option:last-child,
    .notification-option:last-child,
    .danger-option:last-child {
      border-bottom: none;
    }

    .option-info {
      flex: 1;
    }

    .option-info h4 {
      font-family: 'Google Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 4px 0;
    }

    .option-info p {
      font-size: 14px;
      color: #5f6368;
      margin: 0;
    }

    .frequency-options {
      margin-top: 16px;
    }

    .frequency-options mat-form-field {
      width: 200px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e8eaed;
    }

    .save-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .save-button:hover {
      background-color: #1557b0;
    }

    .delete-account-button {
      background-color: #ea4335;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .delete-account-button:hover {
      background-color: #d33b2c;
    }

    .export-data-button {
      background-color: #34a853;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .export-data-button:hover {
      background-color: #2e7d32;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 12px;
      }

      .email-field,
      .phone-field {
        width: 100%;
      }

      .security-info {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .privacy-option,
      .notification-option,
      .danger-option {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .frequency-options mat-form-field {
        width: 100%;
      }

      .form-actions {
        flex-direction: column;
      }

      .save-button,
      .delete-account-button,
      .export-data-button {
        width: 100%;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  accountForm: FormGroup;
  currentUser: any;

  privacySettings = {
    publicProfile: true,
    showContact: false,
    emailNotifications: true,
    pushNotifications: true,
    analyticsTracking: true
  };

  notificationSettings = {
    jobMatches: true,
    applicationUpdates: true,
    companyUpdates: false,
    newsletter: true,
    frequency: 'daily'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.accountForm.patchValue({
        fullName: this.currentUser.name,
        email: this.currentUser.email,
        phone: ''
      });
    }
  }

  async updateAccount(): Promise<void> {
    if (this.accountForm.valid) {
      try {
        const accountData = this.accountForm.value;
        console.log('Account updated:', accountData);
        this.snackBar.open('Account updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      } catch (error) {
        console.error('Error updating account:', error);
        this.snackBar.open('Failed to update account', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    }
  }

  updatePrivacySettings(): void {
    console.log('Privacy settings updated:', this.privacySettings);
    this.snackBar.open('Privacy settings saved', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  updateNotificationSettings(): void {
    console.log('Notification settings updated:', this.notificationSettings);
    this.snackBar.open('Notification settings saved', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}