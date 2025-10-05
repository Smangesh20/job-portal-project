import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

export interface JobSearchParams {
  keywords?: string;
  location?: string;
  jobType?: string;
  experience?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly API_BASE_URL = 'https://www.askyacham.com/api/jobs';

  // Mock data for demonstration
  private mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'full-time',
      salary: '$150,000 - $200,000',
      description: 'We are looking for a Senior Software Engineer to join our team and help build the next generation of web applications.',
      requirements: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', '5+ years experience'],
      posted_date: '2 days ago',
      company_logo: 'assets/google-logo.svg'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      type: 'full-time',
      salary: '$120,000 - $160,000',
      description: 'Join our frontend team to create beautiful and intuitive user interfaces for our enterprise applications.',
      requirements: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', '3+ years experience'],
      posted_date: '1 week ago',
      company_logo: 'assets/microsoft-logo.svg'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Amazon',
      location: 'Austin, TX',
      type: 'remote',
      salary: '$130,000 - $170,000',
      description: 'Work on cutting-edge e-commerce solutions and cloud services as a Full Stack Developer.',
      requirements: ['Python', 'JavaScript', 'React', 'Django', 'AWS', '4+ years experience'],
      posted_date: '3 days ago',
      company_logo: 'assets/amazon-logo.svg'
    },
    {
      id: '4',
      title: 'UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'full-time',
      salary: '$140,000 - $180,000',
      description: 'Design intuitive and beautiful user experiences for our consumer products and services.',
      requirements: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', '5+ years experience'],
      posted_date: '5 days ago',
      company_logo: 'assets/apple-logo.svg'
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'contract',
      salary: '$160,000 - $200,000',
      description: 'Help scale our infrastructure and deployment pipelines to serve millions of users worldwide.',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Python', '6+ years experience'],
      posted_date: '1 week ago',
      company_logo: 'assets/netflix-logo.svg'
    },
    {
      id: '6',
      title: 'Product Manager',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'full-time',
      salary: '$170,000 - $220,000',
      description: 'Lead product development for our social media platforms and drive user engagement.',
      requirements: ['Product Strategy', 'Data Analysis', 'Agile', 'User Research', '7+ years experience'],
      posted_date: '4 days ago',
      company_logo: 'assets/meta-logo.svg'
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all jobs
  async getJobs(): Promise<Job[]> {
    // In production, this would make an HTTP request
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockJobs]);
      }, 500);
    });
  }

  // Search jobs
  async searchJobs(params: JobSearchParams): Promise<Job[]> {
    // In production, this would make an HTTP request with search parameters
    // For now, filter mock data based on search parameters
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredJobs = [...this.mockJobs];

        if (params.keywords) {
          const keywords = params.keywords.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(keywords) ||
            job.company.toLowerCase().includes(keywords) ||
            job.description.toLowerCase().includes(keywords) ||
            job.requirements.some(req => req.toLowerCase().includes(keywords))
          );
        }

        if (params.location) {
          const location = params.location.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(location)
          );
        }

        if (params.jobType) {
          filteredJobs = filteredJobs.filter(job => 
            job.type === params.jobType
          );
        }

        if (params.experience) {
          // Simple experience filtering based on requirements
          filteredJobs = filteredJobs.filter(job => {
            const experienceReq = job.requirements.find(req => req.includes('years'));
            if (params.experience === 'entry' && experienceReq) {
              return !experienceReq.includes('3+') && !experienceReq.includes('4+') && 
                     !experienceReq.includes('5+') && !experienceReq.includes('6+') && 
                     !experienceReq.includes('7+');
            }
            return true;
          });
        }

        resolve(filteredJobs);
      }, 300);
    });
  }

  // Load more jobs (pagination)
  async loadMoreJobs(): Promise<Job[]> {
    // In production, this would make an HTTP request with pagination
    // For now, return empty array to simulate no more jobs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }

  // Get job by ID
  async getJobById(id: string): Promise<Job | null> {
    // In production, this would make an HTTP request
    // For now, find in mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = this.mockJobs.find(j => j.id === id) || null;
        resolve(job);
      }, 200);
    });
  }

  // Apply for job
  async applyForJob(jobId: string, applicationData: any): Promise<boolean> {
    // In production, this would make an HTTP POST request
    // For now, simulate successful application
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Application submitted for job:', jobId, applicationData);
        resolve(true);
      }, 1000);
    });
  }

  // Save job
  async saveJob(jobId: string): Promise<boolean> {
    // In production, this would make an HTTP POST request
    // For now, simulate successful save
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Job saved:', jobId);
        resolve(true);
      }, 500);
    });
  }

  // Get saved jobs
  async getSavedJobs(): Promise<Job[]> {
    // In production, this would make an HTTP request
    // For now, return empty array
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 300);
    });
  }

  // Get job applications
  async getJobApplications(): Promise<any[]> {
    // In production, this would make an HTTP request
    // For now, return empty array
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 300);
    });
  }
}
