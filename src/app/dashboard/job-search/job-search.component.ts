import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobService } from '../services/job.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  posted_date: string;
  application_deadline?: string;
  company_logo?: string;
}

@Component({
  selector: 'app-job-search',
  template: `
    <div class="job-search-container">
      <!-- Search Header -->
      <div class="search-header">
        <h2 class="section-title">Find Your Dream Job</h2>
        <p class="section-subtitle">Discover opportunities that match your skills and aspirations</p>
      </div>

      <!-- Search Filters -->
      <mat-card class="search-filters">
        <form [formGroup]="searchForm" (ngSubmit)="searchJobs()">
          <div class="filter-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Job title or keywords</mat-label>
              <input matInput formControlName="keywords" placeholder="e.g. Software Engineer">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="location-field">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="e.g. San Francisco, CA">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>

            <button mat-raised-button type="submit" class="search-button">
              Search Jobs
            </button>
          </div>

          <div class="filter-row">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Job Type</mat-label>
              <mat-select formControlName="jobType">
                <mat-option value="">All Types</mat-option>
                <mat-option value="full-time">Full Time</mat-option>
                <mat-option value="part-time">Part Time</mat-option>
                <mat-option value="contract">Contract</mat-option>
                <mat-option value="remote">Remote</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Experience Level</mat-label>
              <mat-select formControlName="experience">
                <mat-option value="">All Levels</mat-option>
                <mat-option value="entry">Entry Level</mat-option>
                <mat-option value="mid">Mid Level</mat-option>
                <mat-option value="senior">Senior Level</mat-option>
                <mat-option value="executive">Executive</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </form>
      </mat-card>

      <!-- Job Results -->
      <div class="job-results">
        <div class="results-header">
          <h3>{{ jobs.length }} Jobs Found</h3>
          <div class="sort-options">
            <mat-form-field appearance="outline">
              <mat-label>Sort by</mat-label>
              <mat-select [(value)]="sortBy">
                <mat-option value="relevance">Relevance</mat-option>
                <mat-option value="date">Date Posted</mat-option>
                <mat-option value="salary">Salary</mat-option>
                <mat-option value="company">Company</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Job Cards -->
        <div class="job-cards">
          <mat-card *ngFor="let job of jobs" class="job-card">
            <div class="job-card-content">
              <div class="job-header">
                <div class="company-logo">
                  <img [src]="job.company_logo || 'assets/default-company.svg'" 
                       [alt]="job.company" 
                       class="logo">
                </div>
                <div class="job-info">
                  <h4 class="job-title">{{ job.title }}</h4>
                  <p class="company-name">{{ job.company }}</p>
                  <p class="job-location">
                    <mat-icon>location_on</mat-icon>
                    {{ job.location }}
                  </p>
                </div>
                <div class="job-meta">
                  <mat-chip-set>
                    <mat-chip [class]="'job-type-' + job.type">
                      {{ job.type | titlecase }}
                    </mat-chip>
                  </mat-chip-set>
                  <p class="posted-date">{{ job.posted_date }}</p>
                </div>
              </div>

              <div class="job-description">
                <p>{{ job.description | slice:0:200 }}...</p>
              </div>

              <div class="job-requirements">
                <h5>Requirements:</h5>
                <mat-chip-set>
                  <mat-chip *ngFor="let req of job.requirements.slice(0, 3)">
                    {{ req }}
                  </mat-chip>
                  <mat-chip *ngIf="job.requirements.length > 3" class="more-requirements">
                    +{{ job.requirements.length - 3 }} more
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="job-actions">
                <button mat-button class="view-details-button">
                  <mat-icon>visibility</mat-icon>
                  View Details
                </button>
                <button mat-raised-button class="apply-button">
                  <mat-icon>send</mat-icon>
                  Apply Now
                </button>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Load More -->
        <div class="load-more" *ngIf="hasMoreJobs">
          <button mat-button class="load-more-button" (click)="loadMoreJobs()">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-search-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
    }

    .search-header {
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

    .search-filters {
      margin-bottom: 32px;
      padding: 24px;
    }

    .filter-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-end;
    }

    .filter-row:last-child {
      margin-bottom: 0;
    }

    .search-field {
      flex: 2;
    }

    .location-field {
      flex: 1;
    }

    .filter-field {
      flex: 1;
    }

    .search-button {
      background-color: #1a73e8;
      color: white;
      height: 56px;
      min-width: 140px;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .search-button:hover {
      background-color: #1557b0;
    }

    .job-results {
      margin-bottom: 32px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .results-header h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 20px;
      font-weight: 400;
      color: #202124;
      margin: 0;
    }

    .sort-options mat-form-field {
      width: 160px;
    }

    .job-cards {
      display: grid;
      gap: 16px;
    }

    .job-card {
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .job-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .job-card-content {
      padding: 0;
    }

    .job-header {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .company-logo {
      flex-shrink: 0;
    }

    .logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
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
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .job-location {
      font-size: 14px;
      color: #5f6368;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .job-meta {
      text-align: right;
    }

    .job-type-full-time {
      background-color: #e8f5e8;
      color: #137333;
    }

    .job-type-part-time {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .job-type-contract {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .job-type-remote {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .posted-date {
      font-size: 12px;
      color: #5f6368;
      margin: 8px 0 0 0;
    }

    .job-description {
      margin-bottom: 16px;
    }

    .job-description p {
      font-size: 14px;
      color: #5f6368;
      line-height: 1.5;
      margin: 0;
    }

    .job-requirements {
      margin-bottom: 16px;
    }

    .job-requirements h5 {
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .more-requirements {
      background-color: #f8f9fa;
      color: #5f6368;
    }

    .job-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .view-details-button {
      color: #1a73e8;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .apply-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .apply-button:hover {
      background-color: #1557b0;
    }

    .load-more {
      text-align: center;
      margin-top: 32px;
    }

    .load-more-button {
      color: #1a73e8;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
      padding: 12px 24px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .filter-row {
        flex-direction: column;
        gap: 12px;
      }

      .search-field,
      .location-field,
      .filter-field {
        width: 100%;
      }

      .search-button {
        width: 100%;
        height: 48px;
      }

      .results-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .sort-options mat-form-field {
        width: 100%;
      }

      .job-header {
        flex-direction: column;
        gap: 12px;
      }

      .job-meta {
        text-align: left;
      }

      .job-actions {
        flex-direction: column;
        gap: 12px;
      }

      .view-details-button,
      .apply-button {
        width: 100%;
      }
    }
  `]
})
export class JobSearchComponent implements OnInit {
  searchForm: FormGroup;
  jobs: Job[] = [];
  sortBy = 'relevance';
  hasMoreJobs = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService
  ) {
    this.searchForm = this.fb.group({
      keywords: [''],
      location: [''],
      jobType: [''],
      experience: ['']
    });
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  async loadJobs(): Promise<void> {
    this.isLoading = true;
    try {
      const jobs = await this.jobService.getJobs();
      this.jobs = jobs;
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async searchJobs(): Promise<void> {
    if (this.searchForm.valid) {
      this.isLoading = true;
      try {
        const searchParams = this.searchForm.value;
        const jobs = await this.jobService.searchJobs(searchParams);
        this.jobs = jobs;
      } catch (error) {
        console.error('Error searching jobs:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async loadMoreJobs(): Promise<void> {
    this.isLoading = true;
    try {
      const moreJobs = await this.jobService.loadMoreJobs();
      this.jobs = [...this.jobs, ...moreJobs];
      this.hasMoreJobs = moreJobs.length > 0;
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }
}