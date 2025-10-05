import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- Google-style Header -->
      <mat-toolbar class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <img src="assets/askyacham-logo.svg" alt="AskYaCham" class="logo">
            <span class="brand-name">AskYaCham</span>
          </div>
          
          <div class="header-center">
            <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedIndexChange)="onTabChange($event)">
              <mat-tab label="Jobs">
                <ng-template mat-tab-content>
                  <div class="tab-content">
                    <app-job-search></app-job-search>
                  </div>
                </ng-template>
              </mat-tab>
              <mat-tab label="Applications">
                <ng-template mat-tab-content>
                  <div class="tab-content">
                    <app-applications></app-applications>
                  </div>
                </ng-template>
              </mat-tab>
              <mat-tab label="Profile">
                <ng-template mat-tab-content>
                  <div class="tab-content">
                    <app-profile></app-profile>
                  </div>
                </ng-template>
              </mat-tab>
            </mat-tab-group>
          </div>
          
          <div class="header-right">
            <!-- User Menu -->
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
              <img [src]="currentUser?.picture || 'assets/default-avatar.svg'" 
                   [alt]="currentUser?.name" 
                   class="user-avatar">
            </button>
            
            <mat-menu #userMenu="matMenu" class="user-menu">
              <div class="user-menu-header">
                <div class="user-info">
                  <div class="user-name">{{ currentUser?.name }}</div>
                  <div class="user-email">{{ currentUser?.email }}</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="navigateToProfile()">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item (click)="navigateToSettings()">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Sign out</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="dashboard-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f8f9fa;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e8eaed;
      padding: 0;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
      z-index: 1000;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      height: 32px;
      width: 32px;
    }

    .brand-name {
      font-family: 'Google Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #202124;
    }

    .header-center {
      flex: 1;
      max-width: 600px;
      margin: 0 32px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-menu-button {
      padding: 4px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #e8eaed;
    }

    .user-menu {
      min-width: 280px;
    }

    .user-menu-header {
      padding: 16px;
      background: #f8f9fa;
    }

    .user-info {
      text-align: center;
    }

    .user-name {
      font-family: 'Google Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      margin-bottom: 4px;
    }

    .user-email {
      font-size: 14px;
      color: #5f6368;
    }

    .dashboard-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .tab-content {
      padding: 0;
    }

    /* Google-style tabs */
    ::ng-deep .mat-mdc-tab-group {
      border-bottom: none;
    }

    ::ng-deep .mat-mdc-tab-header {
      border-bottom: 1px solid #e8eaed;
    }

    ::ng-deep .mat-mdc-tab {
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #5f6368;
      text-transform: none;
      letter-spacing: 0.25px;
      min-width: 120px;
    }

    ::ng-deep .mat-mdc-tab.mdc-tab--active {
      color: #1a73e8;
    }

    ::ng-deep .mat-mdc-tab .mdc-tab__indicator {
      background-color: #1a73e8;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        padding: 0 12px;
      }

      .header-center {
        margin: 0 16px;
      }

      .brand-name {
        display: none;
      }

      ::ng-deep .mat-mdc-tab {
        min-width: 80px;
        font-size: 12px;
      }

      .dashboard-content {
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .header-left .brand-name {
        display: none;
      }

      .header-center {
        margin: 0 8px;
      }

      ::ng-deep .mat-mdc-tab {
        min-width: 60px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  selectedTabIndex = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/signin']);
      return;
    }

    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/auth/signin']);
      }
    });

    // Check for OAuth callback parameters
    this.route.queryParams.subscribe(params => {
      if (params['google_success'] === 'true') {
        this.handleGoogleCallback(params);
      }
    });
  }

  private handleGoogleCallback(params: any): void {
    const action = params['action'];
    const userEmail = params['user_email'];
    const userName = params['user_name'];

    if (action === 'signup') {
      this.snackBar.open(`Welcome to AskYaCham, ${userName || userEmail}!`, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['google-success-snackbar']
      });
    } else if (action === 'signin') {
      this.snackBar.open(`Welcome back, ${userName || userEmail}!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['google-success-snackbar']
      });
    }

    // Clear URL parameters
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    
    // Navigate based on tab
    switch (index) {
      case 0:
        this.router.navigate(['/dashboard/jobs']);
        break;
      case 1:
        this.router.navigate(['/dashboard/applications']);
        break;
      case 2:
        this.router.navigate(['/dashboard/profile']);
        break;
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  navigateToSettings(): void {
    this.router.navigate(['/dashboard/settings']);
  }

  logout(): void {
    this.authService.logout();
  }
}
