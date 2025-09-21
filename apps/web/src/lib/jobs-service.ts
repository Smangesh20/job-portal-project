/**
 * Enterprise Jobs Service
 * Google-style real-time job data management
 */

import { enterpriseAPIClient } from './enterprise-api-client';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  posted: string;
  description: string;
  requirements: string[];
  tags: string[];
  rating: number;
  logo?: string;
  isRemote: boolean;
  isUrgent: boolean;
  isNew: boolean;
  isUpdated: boolean;
  companySize: string;
  industry: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  benefits: string[];
  applicationUrl?: string;
  applicationDeadline?: string;
  views: number;
  applications: number;
  saved: boolean;
  applied: boolean;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string[];
  company?: string;
  industry?: string[];
  isRemote?: boolean;
  postedWithin?: number; // days
  tags?: string[];
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  hasMore: boolean;
  filters: JobFilters;
}

class EnterpriseJobsService {
  private static instance: EnterpriseJobsService;
  private jobs: Job[] = [];
  private filters: JobFilters = {};
  private currentPage = 1;
  private isLoading = false;
  private subscribers: Set<(jobs: Job[]) => void> = new Set();

  private constructor() {
    this.initializeRealTimeData();
  }

  public static getInstance(): EnterpriseJobsService {
    if (!EnterpriseJobsService.instance) {
      EnterpriseJobsService.instance = new EnterpriseJobsService();
    }
    return EnterpriseJobsService.instance;
  }

  // Initialize with real-time data
  private async initializeRealTimeData() {
    try {
      // Load initial jobs from API
      await this.loadJobs();
      
      // Set up real-time updates
      this.setupRealTimeUpdates();
    } catch (error) {
      console.error('🚀 ENTERPRISE: Failed to initialize jobs service:', error);
      // Fallback to sample data
      this.loadSampleJobs();
    }
  }

  // Load jobs from API
  private async loadJobs(page = 1, filters: JobFilters = {}) {
    this.isLoading = true;
    try {
      const response = await enterpriseAPIClient.getJobs({
        page,
        limit: 20,
        ...filters
      });

      if (response.success && response.data) {
        const newJobs = response.data || [];
        if (page === 1) {
          this.jobs = newJobs;
        } else {
          this.jobs = [...this.jobs, ...newJobs];
        }
        this.currentPage = page;
        this.filters = filters;
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('🚀 ENTERPRISE: Failed to load jobs:', error);
      // Fallback to sample data
      this.loadSampleJobs();
    } finally {
      this.isLoading = false;
    }
  }

  // Load sample jobs as fallback
  private loadSampleJobs() {
    this.jobs = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Quantum Tech Solutions',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $180k',
        salaryMin: 120000,
        salaryMax: 180000,
        posted: '2 days ago',
        description: 'Join our quantum computing team to build next-generation applications that will revolutionize the industry.',
        requirements: ['5+ years React experience', 'Node.js proficiency', 'Quantum computing knowledge'],
        tags: ['React', 'Node.js', 'Quantum Computing', 'Remote'],
        rating: 4.8,
        logo: '/logos/quantum-tech.png',
        isRemote: true,
        isUrgent: false,
        isNew: true,
        isUpdated: false,
        companySize: '51-200',
        industry: 'Technology',
        experienceLevel: 'Senior',
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours'],
        applicationUrl: 'https://quantumtech.com/careers/senior-software-engineer',
        views: 1247,
        applications: 23,
        saved: false,
        applied: false
      },
      {
        id: '2',
        title: 'AI Research Scientist',
        company: 'AI Innovations Inc',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$150k - $200k',
        salaryMin: 150000,
        salaryMax: 200000,
        posted: '1 day ago',
        description: 'Lead cutting-edge AI research in machine learning and neural networks to solve complex problems.',
        requirements: ['PhD in AI/ML', '5+ years research experience', 'Python expertise'],
        tags: ['Python', 'TensorFlow', 'Research', 'PhD'],
        rating: 4.6,
        logo: '/logos/ai-innovations.png',
        isRemote: false,
        isUrgent: true,
        isNew: true,
        isUpdated: false,
        companySize: '201-500',
        industry: 'Artificial Intelligence',
        experienceLevel: 'Senior',
        benefits: ['Health Insurance', '401k', 'Research Budget', 'Conference Travel'],
        applicationUrl: 'https://aiinnovations.com/careers/ai-research-scientist',
        views: 892,
        applications: 15,
        saved: false,
        applied: false
      },
      {
        id: '3',
        title: 'Frontend Developer',
        company: 'Future Finance Corp',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90k - $130k',
        salaryMin: 90000,
        salaryMax: 130000,
        posted: '3 days ago',
        description: 'Build beautiful user interfaces for our financial technology platform using modern web technologies.',
        requirements: ['3+ years React experience', 'TypeScript proficiency', 'UI/UX design skills'],
        tags: ['React', 'TypeScript', 'UI/UX', 'Finance'],
        rating: 4.7,
        logo: '/logos/future-finance.png',
        isRemote: true,
        isUrgent: false,
        isNew: false,
        isUpdated: true,
        companySize: '501-1000',
        industry: 'Financial Services',
        experienceLevel: 'Mid',
        benefits: ['Health Insurance', '401k', 'Performance Bonus', 'Learning Budget'],
        applicationUrl: 'https://futurefinance.com/careers/frontend-developer',
        views: 1563,
        applications: 31,
        saved: false,
        applied: false
      },
      {
        id: '4',
        title: 'Data Scientist',
        company: 'Green Energy Systems',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$100k - $140k',
        salaryMin: 100000,
        salaryMax: 140000,
        posted: '4 days ago',
        description: 'Analyze energy data to optimize sustainable solutions and drive environmental impact.',
        requirements: ['Masters in Data Science', 'Python/R expertise', 'Energy sector experience'],
        tags: ['Python', 'Machine Learning', 'Data Analysis', 'Energy'],
        rating: 4.9,
        logo: '/logos/green-energy.png',
        isRemote: true,
        isUrgent: false,
        isNew: false,
        isUpdated: false,
        companySize: '101-200',
        industry: 'Clean Energy',
        experienceLevel: 'Mid',
        benefits: ['Health Insurance', '401k', 'Environmental Impact', 'Remote Work'],
        applicationUrl: 'https://greenenergy.com/careers/data-scientist',
        views: 987,
        applications: 18,
        saved: false,
        applied: false
      },
      {
        id: '5',
        title: 'DevOps Engineer',
        company: 'CloudScale Technologies',
        location: 'Remote',
        type: 'Full-time',
        salary: '$110k - $160k',
        salaryMin: 110000,
        salaryMax: 160000,
        posted: '5 days ago',
        description: 'Manage cloud infrastructure and deployment pipelines for our scalable platform.',
        requirements: ['AWS/Azure expertise', 'Docker/Kubernetes', 'CI/CD experience'],
        tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        rating: 4.5,
        logo: '/logos/cloudscale.png',
        isRemote: true,
        isUrgent: false,
        isNew: false,
        isUpdated: false,
        companySize: '51-200',
        industry: 'Cloud Computing',
        experienceLevel: 'Mid',
        benefits: ['Health Insurance', '401k', 'Cloud Certifications', 'Flexible Schedule'],
        applicationUrl: 'https://cloudscale.com/careers/devops-engineer',
        views: 743,
        applications: 12,
        saved: false,
        applied: false
      }
    ];
    this.notifySubscribers();
  }

  // Set up real-time updates
  private setupRealTimeUpdates() {
    // Subscribe to real-time job updates
    if (typeof window !== 'undefined') {
      // This would connect to your real-time service
      // For now, we'll simulate real-time updates
      setInterval(() => {
        this.simulateRealTimeUpdate();
      }, 30000); // Update every 30 seconds
    }
  }

  // Simulate real-time updates
  private simulateRealTimeUpdate() {
    if (this.jobs.length > 0) {
      const randomJob = this.jobs[Math.floor(Math.random() * this.jobs.length)];
      randomJob.views += Math.floor(Math.random() * 5);
      randomJob.applications += Math.floor(Math.random() * 2);
      this.notifySubscribers();
    }
  }

  // Subscribe to job updates
  public subscribe(callback: (jobs: Job[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Notify subscribers
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.jobs]));
  }

  // Search jobs
  public async searchJobs(filters: JobFilters): Promise<JobSearchResult> {
    this.filters = filters;
    await this.loadJobs(1, filters);
    
    return {
      jobs: this.jobs,
      total: this.jobs.length,
      page: 1,
      hasMore: this.jobs.length >= 20,
      filters
    };
  }

  // Load more jobs
  public async loadMoreJobs(): Promise<JobSearchResult> {
    if (this.isLoading) return this.getCurrentResult();
    
    await this.loadJobs(this.currentPage + 1, this.filters);
    
    return this.getCurrentResult();
  }

  // Get current result
  private getCurrentResult(): JobSearchResult {
    return {
      jobs: this.jobs,
      total: this.jobs.length,
      page: this.currentPage,
      hasMore: this.jobs.length >= 20,
      filters: this.filters
    };
  }

  // Apply for job
  public async applyForJob(jobId: string): Promise<boolean> {
    try {
      const response = await enterpriseAPIClient.request({
        method: 'POST',
        url: `/api/jobs/${jobId}/apply`
      });
      
      if (response.success) {
        // Update local state
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
          job.applied = true;
          job.applications += 1;
          this.notifySubscribers();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚀 ENTERPRISE: Failed to apply for job:', error);
      return false;
    }
  }

  // Save job
  public async saveJob(jobId: string): Promise<boolean> {
    try {
      const response = await enterpriseAPIClient.request({
        method: 'POST',
        url: `/api/jobs/${jobId}/save`
      });
      
      if (response.success) {
        // Update local state
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
          job.saved = !job.saved;
          this.notifySubscribers();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('🚀 ENTERPRISE: Failed to save job:', error);
      return false;
    }
  }

  // Get job by ID
  public getJobById(id: string): Job | undefined {
    return this.jobs.find(job => job.id === id);
  }

  // Get all jobs
  public getAllJobs(): Job[] {
    return [...this.jobs];
  }

  // Get saved jobs
  public getSavedJobs(): Job[] {
    return this.jobs.filter(job => job.saved);
  }

  // Get applied jobs
  public getAppliedJobs(): Job[] {
    return this.jobs.filter(job => job.applied);
  }

  // Get recommended jobs
  public getRecommendedJobs(): Job[] {
    // Simple recommendation logic - in real app, this would use ML
    return this.jobs
      .filter(job => job.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  // Get locations
  public getLocations(): string[] {
    const locations = new Set(this.jobs.map(job => job.location));
    return Array.from(locations).sort();
  }

  // Get companies
  public getCompanies(): string[] {
    const companies = new Set(this.jobs.map(job => job.company));
    return Array.from(companies).sort();
  }

  // Get industries
  public getIndustries(): string[] {
    const industries = new Set(this.jobs.map(job => job.industry));
    return Array.from(industries).sort();
  }

  // Get tags
  public getTags(): string[] {
    const tags = new Set(this.jobs.flatMap(job => job.tags));
    return Array.from(tags).sort();
  }
}

export const jobsService = EnterpriseJobsService.getInstance();
