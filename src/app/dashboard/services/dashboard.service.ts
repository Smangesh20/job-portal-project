import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_BASE_URL = 'https://www.askyacham.com/api/dashboard';

  constructor(private http: HttpClient) {}

  // Get dashboard statistics
  async getDashboardStats(): Promise<any> {
    // In production, this would make an HTTP GET request
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalJobs: 1247,
          savedJobs: 23,
          applications: 8,
          interviews: 2,
          profileViews: 45,
          profileCompleteness: 85
        });
      }, 500);
    });
  }

  // Get recent activity
  async getRecentActivity(): Promise<any[]> {
    // In production, this would make an HTTP GET request
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            type: 'application',
            title: 'Applied to Senior Software Engineer at Google',
            timestamp: '2023-12-01T10:30:00Z',
            icon: 'send'
          },
          {
            id: '2',
            type: 'profile_view',
            title: 'Your profile was viewed by Microsoft',
            timestamp: '2023-12-01T09:15:00Z',
            icon: 'visibility'
          },
          {
            id: '3',
            type: 'job_match',
            title: 'New job match: Frontend Developer at Amazon',
            timestamp: '2023-11-30T16:45:00Z',
            icon: 'work'
          },
          {
            id: '4',
            type: 'interview',
            title: 'Interview scheduled with Apple for UX Designer role',
            timestamp: '2023-11-30T14:20:00Z',
            icon: 'calendar_today'
          }
        ]);
      }, 300);
    });
  }

  // Get recommended jobs
  async getRecommendedJobs(): Promise<any[]> {
    // In production, this would make an HTTP GET request
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'Netflix',
            location: 'Los Gatos, CA',
            type: 'full-time',
            salary: '$160,000 - $200,000',
            matchScore: 95,
            postedDate: '2023-12-01'
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'Spotify',
            location: 'New York, NY',
            type: 'remote',
            salary: '$140,000 - $180,000',
            matchScore: 88,
            postedDate: '2023-11-30'
          },
          {
            id: '3',
            title: 'React Developer',
            company: 'Airbnb',
            location: 'San Francisco, CA',
            type: 'full-time',
            salary: '$130,000 - $170,000',
            matchScore: 82,
            postedDate: '2023-11-29'
          }
        ]);
      }, 400);
    });
  }

  // Get profile insights
  async getProfileInsights(): Promise<any> {
    // In production, this would make an HTTP GET request
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          completenessScore: 85,
          missingFields: [
            'Professional summary',
            'Work experience',
            'Skills'
          ],
          suggestions: [
            'Add a professional summary to increase profile views by 40%',
            'Include 3-5 relevant work experiences',
            'Add at least 10 technical skills'
          ],
          strengths: [
            'Strong technical background',
            'Good education credentials',
            'Complete contact information'
          ]
        });
      }, 600);
    });
  }
}
