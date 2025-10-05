import { Component, OnInit } from '@angular/core';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
}

@Component({
  selector: 'app-applications',
  template: `
    <div class="applications-container">
      <!-- Applications Header -->
      <div class="applications-header">
        <h2 class="section-title">My Applications</h2>
        <p class="section-subtitle">Track your job application progress</p>
      </div>

      <!-- Applications Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon pending">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ getApplicationsByStatus('pending').length }}</h3>
              <p>Pending</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon reviewed">
              <mat-icon>visibility</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ getApplicationsByStatus('reviewed').length }}</h3>
              <p>Reviewed</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon interview">
              <mat-icon>calendar_today</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ getApplicationsByStatus('interview').length }}</h3>
              <p>Interview</p>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon accepted">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ getApplicationsByStatus('accepted').length }}</h3>
              <p>Accepted</p>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Applications List -->
      <div class="applications-list">
        <div class="list-header">
          <h3>All Applications ({{ applications.length }})</h3>
          <div class="filter-options">
            <mat-form-field appearance="outline">
              <mat-label>Filter by status</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="filterApplications()">
                <mat-option value="">All Status</mat-option>
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="reviewed">Reviewed</mat-option>
                <mat-option value="interview">Interview</mat-option>
                <mat-option value="rejected">Rejected</mat-option>
                <mat-option value="accepted">Accepted</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Applications Cards -->
        <div class="applications-cards">
          <mat-card *ngFor="let application of filteredApplications" class="application-card">
            <div class="application-content">
              <div class="application-header">
                <div class="job-info">
                  <h4 class="job-title">{{ application.jobTitle }}</h4>
                  <p class="company-name">{{ application.company }}</p>
                  <p class="applied-date">
                    <mat-icon>schedule</mat-icon>
                    Applied on {{ application.appliedDate }}
                  </p>
                </div>
                <div class="status-badge">
                  <mat-chip [class]="'status-' + application.status">
                    {{ application.status | titlecase }}
                  </mat-chip>
                </div>
              </div>

              <div class="application-notes" *ngIf="application.notes">
                <h5>Notes:</h5>
                <p>{{ application.notes }}</p>
              </div>

              <div class="application-actions">
                <button mat-button class="view-job-button">
                  <mat-icon>visibility</mat-icon>
                  View Job
                </button>
                <button mat-button class="edit-application-button">
                  <mat-icon>edit</mat-icon>
                  Edit Application
                </button>
                <button mat-button class="withdraw-button" *ngIf="application.status === 'pending'">
                  <mat-icon>cancel</mat-icon>
                  Withdraw
                </button>
              </div>
            </div>
          </mat-card>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredApplications.length === 0">
            <mat-icon class="empty-icon">work_off</mat-icon>
            <h3>No Applications Found</h3>
            <p>{{ selectedStatus ? 'No applications with this status.' : 'You haven\'t applied to any jobs yet.' }}</p>
            <button mat-raised-button class="find-jobs-button" routerLink="/dashboard/jobs">
              <mat-icon>search</mat-icon>
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
    }

    .applications-header {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.pending {
      background-color: #fbbc04;
    }

    .stat-icon.reviewed {
      background-color: #1a73e8;
    }

    .stat-icon.interview {
      background-color: #ea4335;
    }

    .stat-icon.accepted {
      background-color: #34a853;
    }

    .stat-info h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 24px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 4px 0;
    }

    .stat-info p {
      font-size: 14px;
      color: #5f6368;
      margin: 0;
    }

    .applications-list {
      margin-bottom: 32px;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .list-header h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 20px;
      font-weight: 400;
      color: #202124;
      margin: 0;
    }

    .filter-options mat-form-field {
      width: 200px;
    }

    .applications-cards {
      display: grid;
      gap: 16px;
    }

    .application-card {
      transition: all 0.2s ease;
    }

    .application-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .application-content {
      padding: 0;
    }

    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .job-info {
      flex: 1;
    }

    .job-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 4px 0;
    }

    .company-name {
      font-size: 14px;
      color: #1a73e8;
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .applied-date {
      font-size: 14px;
      color: #5f6368;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-pending {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-reviewed {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-interview {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-rejected {
      background-color: #fafafa;
      color: #616161;
    }

    .status-accepted {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .application-notes {
      margin-bottom: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .application-notes h5 {
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .application-notes p {
      font-size: 14px;
      color: #5f6368;
      line-height: 1.5;
      margin: 0;
    }

    .application-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .view-job-button,
    .edit-application-button,
    .withdraw-button {
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .view-job-button {
      color: #1a73e8;
    }

    .edit-application-button {
      color: #5f6368;
    }

    .withdraw-button {
      color: #ea4335;
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #dadce0;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 24px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 16px;
      color: #5f6368;
      margin: 0 0 24px 0;
    }

    .find-jobs-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .find-jobs-button:hover {
      background-color: #1557b0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .list-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .filter-options mat-form-field {
        width: 100%;
      }

      .application-header {
        flex-direction: column;
        gap: 12px;
      }

      .application-actions {
        flex-direction: column;
      }

      .view-job-button,
      .edit-application-button,
      .withdraw-button {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  selectedStatus = '';

  constructor() {}

  ngOnInit(): void {
    this.loadApplications();
  }

  private loadApplications(): void {
    // Mock data - in production, this would come from a service
    this.applications = [
      {
        id: '1',
        jobId: 'job-1',
        jobTitle: 'Senior Software Engineer',
        company: 'Google',
        appliedDate: '2023-12-01',
        status: 'pending',
        notes: 'Applied through company website'
      },
      {
        id: '2',
        jobId: 'job-2',
        jobTitle: 'Frontend Developer',
        company: 'Microsoft',
        appliedDate: '2023-11-28',
        status: 'reviewed',
        notes: 'HR contacted for initial screening'
      },
      {
        id: '3',
        jobId: 'job-3',
        jobTitle: 'Full Stack Developer',
        company: 'Amazon',
        appliedDate: '2023-11-25',
        status: 'interview',
        notes: 'Technical interview scheduled for next week'
      },
      {
        id: '4',
        jobId: 'job-4',
        jobTitle: 'UX Designer',
        company: 'Apple',
        appliedDate: '2023-11-20',
        status: 'rejected',
        notes: 'Position filled internally'
      }
    ];

    this.filteredApplications = [...this.applications];
  }

  getApplicationsByStatus(status: string): JobApplication[] {
    return this.applications.filter(app => app.status === status);
  }

  filterApplications(): void {
    if (this.selectedStatus) {
      this.filteredApplications = this.applications.filter(app => app.status === this.selectedStatus);
    } else {
      this.filteredApplications = [...this.applications];
    }
  }
}
