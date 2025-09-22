/**
 * Enterprise Jobs Service
 * Google-style real-time job data management with world data integration
 */

import { worldDataService, WorldJob, WorldCompany } from './world-data-service';

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
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  filters: JobFilters;
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}

class JobsService {
  private jobs: Job[] = [];
  private worldJobs: WorldJob[] = [];
  private isLoading = false;
  private currentPage = 1;
  private filters: JobFilters = {};
  private subscribers: ((jobs: Job[]) => void)[] = [];

  constructor() {
    this.initializeData();
    this.initializeWorldData();
  }

  private initializeData() {
    // Initialize with Google-style real-time job data
    this.jobs = this.generateRealTimeJobs();
    console.log('🚀 GOOGLE-STYLE: Jobs service initialized with', this.jobs.length, 'jobs');
  }

  private initializeWorldData() {
    // Initialize with world data including Indian companies
    this.worldJobs = worldDataService.getWorldJobs();
    console.log('🌍 GOOGLE-STYLE: World data initialized with', this.worldJobs.length, 'jobs from', worldDataService.getStats().countries, 'countries');
  }

  private convertWorldJobToJob(worldJob: WorldJob): Job {
    return {
      id: worldJob.id,
      title: worldJob.title,
      company: worldJob.company,
      location: worldJob.location,
      type: worldJob.type,
      salary: worldJob.salary,
      salaryMin: worldJob.salaryMin,
      salaryMax: worldJob.salaryMax,
      posted: worldJob.posted,
      description: worldJob.description,
      requirements: worldJob.requirements,
      tags: worldJob.tags,
      rating: worldJob.rating,
      logo: worldJob.logo,
      isRemote: worldJob.isRemote,
      isUrgent: worldJob.isUrgent,
      isNew: worldJob.isNew,
      isUpdated: worldJob.isUpdated,
      companySize: worldJob.companySize,
      industry: worldJob.industry,
      experienceLevel: worldJob.experienceLevel,
      benefits: worldJob.benefits,
      applicationUrl: worldJob.applicationUrl,
      applicationDeadline: worldJob.applicationDeadline,
      views: worldJob.views,
      applications: worldJob.applications,
      saved: worldJob.saved,
      applied: worldJob.applied
    };
  }

  private generateRealTimeJobs(): Job[] {
    const jobTitles = [
      'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
      'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
      'UX Designer', 'UI Designer', 'Mobile Developer', 'Cloud Architect', 'Security Engineer',
      'QA Engineer', 'Technical Lead', 'Engineering Manager', 'Data Analyst', 'Business Analyst',
      'Marketing Manager', 'Sales Manager', 'Customer Success Manager', 'Operations Manager'
    ];

    const companies = [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb',
      'Tesla', 'SpaceX', 'OpenAI', 'Anthropic', 'Stripe', 'Square', 'PayPal', 'Zoom',
      'Slack', 'Discord', 'Spotify', 'Pinterest', 'LinkedIn', 'Twitter', 'TikTok',
      'Quantum Tech Solutions', 'AI Innovations Inc', 'Cloud Computing Corp', 'Data Dynamics',
      'Future Systems', 'NextGen Technologies', 'Innovation Labs', 'Tech Pioneers'
    ];

    const locations = [
      'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
      'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Remote', 'London, UK',
      'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia', 'Singapore',
      'Amsterdam, Netherlands', 'Dublin, Ireland', 'Zurich, Switzerland'
    ];

    const industries = [
      'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment',
      'Automotive', 'Aerospace', 'Energy', 'Retail', 'Manufacturing', 'Consulting'
    ];

    const types: Job['type'][] = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
    const experienceLevels: Job['experienceLevel'][] = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

    return Array.from({ length: 50 }, (_, i) => {
      const isNew = Math.random() < 0.2;
      const isUrgent = Math.random() < 0.1;
      const isUpdated = Math.random() < 0.15;
      const isRemote = Math.random() < 0.4;
      const salaryMin = Math.floor(Math.random() * 80000) + 50000;
      const salaryMax = salaryMin + Math.floor(Math.random() * 100000) + 20000;
      
      return {
        id: `job-${i + 1}`,
        title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        type: types[Math.floor(Math.random() * types.length)],
        salary: `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`,
        salaryMin,
        salaryMax,
        posted: this.getRandomPostedTime(),
        description: this.generateJobDescription(),
        requirements: this.generateRequirements(),
        tags: this.generateJobTags(),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        logo: `/logos/${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s+/g, '-')}.png`,
        isRemote,
        isUrgent,
        isNew,
        isUpdated,
        companySize: this.getRandomCompanySize(),
        industry: industries[Math.floor(Math.random() * industries.length)],
        experienceLevel: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
        benefits: this.generateBenefits(),
        applicationUrl: `https://company.com/apply/${i + 1}`,
        applicationDeadline: this.getRandomDeadline(),
        views: Math.floor(Math.random() * 1000) + 50,
        applications: Math.floor(Math.random() * 200) + 10,
        saved: Math.random() < 0.1,
        applied: Math.random() < 0.05
      };
    });
  }

  private getRandomPostedTime(): string {
    const times = ['1 hour ago', '2 hours ago', '3 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago', '2 weeks ago'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private generateJobDescription(): string {
    const descriptions = [
      'Join our innovative team to build cutting-edge solutions that will shape the future of technology.',
      'We are looking for a passionate developer to help us create amazing user experiences.',
      'Be part of a dynamic team working on next-generation products and services.',
      'Help us solve complex problems and build scalable systems that serve millions of users.',
      'Work with the latest technologies and contribute to open-source projects.',
      'Join a fast-growing startup and make a real impact on our product and culture.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateRequirements(): string[] {
    const allRequirements = [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of software development experience',
      'Proficiency in JavaScript, Python, or Java',
      'Experience with modern web frameworks',
      'Knowledge of database systems',
      'Understanding of software development best practices',
      'Strong problem-solving skills',
      'Excellent communication skills',
      'Experience with version control systems',
      'Knowledge of cloud platforms (AWS, Azure, GCP)',
      'Experience with containerization technologies',
      'Understanding of microservices architecture'
    ];
    
    const numRequirements = Math.floor(Math.random() * 4) + 3;
    return allRequirements.sort(() => 0.5 - Math.random()).slice(0, numRequirements);
  }

  private generateJobTags(): string[] {
    const allTags = [
      'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Azure', 'Docker',
      'Kubernetes', 'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'Web3',
      'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native', 'Vue.js',
      'Angular', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails',
      'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'GraphQL', 'REST API',
      'Microservices', 'DevOps', 'CI/CD', 'Terraform', 'Jenkins', 'GitLab', 'GitHub'
    ];
    
    const numTags = Math.floor(Math.random() * 5) + 3;
    return allTags.sort(() => 0.5 - Math.random()).slice(0, numTags);
  }

  private getRandomCompanySize(): string {
    const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  private generateBenefits(): string[] {
    const allBenefits = [
      'Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k) Matching',
      'Flexible Work Hours', 'Remote Work', 'Unlimited PTO', 'Stock Options',
      'Professional Development', 'Gym Membership', 'Free Meals', 'Transportation',
      'Childcare', 'Maternity/Paternity Leave', 'Sabbatical', 'Wellness Program'
    ];
    
    const numBenefits = Math.floor(Math.random() * 6) + 4;
    return allBenefits.sort(() => 0.5 - Math.random()).slice(0, numBenefits);
  }

  private getRandomDeadline(): string {
    const days = Math.floor(Math.random() * 30) + 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Public methods
  async searchJobs(filters: JobFilters): Promise<JobSearchResult> {
    console.log('🌍 GOOGLE-STYLE: Searching world jobs with filters:', filters);
    
    // Use world data for comprehensive results including Indian companies
    let filteredJobs = [...this.worldJobs.map(this.convertWorldJobToJob)];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply location filter
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
        (filters.location!.toLowerCase() === 'remote' && job.isRemote)
      );
    }

    // Apply type filter
    if (filters.type && filters.type.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.type!.includes(job.type));
    }

    // Apply salary filter
    if (filters.salaryMin) {
      filteredJobs = filteredJobs.filter(job => job.salaryMin && job.salaryMin >= filters.salaryMin!);
    }
    if (filters.salaryMax) {
      filteredJobs = filteredJobs.filter(job => job.salaryMax && job.salaryMax <= filters.salaryMax!);
    }

    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.experienceLevel!.includes(job.experienceLevel));
    }

    // Apply company filter
    if (filters.company) {
      filteredJobs = filteredJobs.filter(job => 
        job.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    // Apply industry filter
    if (filters.industry && filters.industry.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.industry!.includes(job.industry));
    }

    // Apply remote filter
    if (filters.isRemote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.isRemote === filters.isRemote);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        filters.tags!.some(tag => job.tags.includes(tag))
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const result = {
      jobs: paginatedJobs,
      filters: filters,
      hasMore: endIndex < filteredJobs.length,
      total: filteredJobs.length,
      page,
      limit
    };

    console.log('🚀 GOOGLE-STYLE: Search result:', result);
    return result;
  }

  async loadJobs(filters: JobFilters = {}): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.searchJobs(filters);
      this.jobs = result.jobs;
      this.filters = filters;
      this.currentPage = result.page;
      this.notifySubscribers();
    } catch (error) {
      console.error('🚀 GOOGLE-STYLE: Failed to load jobs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreJobs(): Promise<JobSearchResult> {
    if (this.isLoading) return this.getCurrentResult();
    
    this.isLoading = true;
    try {
      const nextPage = this.currentPage + 1;
      const result = await this.searchJobs({
        ...this.filters,
        page: nextPage
      });
      
      this.jobs = [...this.jobs, ...result.jobs];
      this.currentPage = nextPage;
      this.notifySubscribers();
      
      return this.getCurrentResult();
    } catch (error) {
      console.error('🚀 GOOGLE-STYLE: Failed to load more jobs:', error);
      return this.getCurrentResult();
    } finally {
      this.isLoading = false;
    }
  }

  private getCurrentResult(): JobSearchResult {
    return {
      jobs: this.jobs,
      filters: this.filters,
      hasMore: this.jobs.length < 100, // Simple check for demo
      total: this.jobs.length,
      page: this.currentPage,
      limit: 20
    };
  }

  async applyForJob(jobId: string): Promise<boolean> {
    console.log('🚀 GOOGLE-STYLE: Applying for job:', jobId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update job status
    const jobIndex = this.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].applied = true;
      this.jobs[jobIndex].applications += 1;
      this.notifySubscribers();
    }
    
    return true;
  }

  async saveJob(jobId: string): Promise<boolean> {
    console.log('🚀 GOOGLE-STYLE: Saving job:', jobId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update job status
    const jobIndex = this.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].saved = !this.jobs[jobIndex].saved;
      this.notifySubscribers();
    }
    
    return true;
  }

  getLocations(): string[] {
    const locations = new Set(this.jobs.map(job => job.location));
    return Array.from(locations).sort();
  }

  getCompanies(): string[] {
    const companies = new Set(this.jobs.map(job => job.company));
    return Array.from(companies).sort();
  }

  getIndustries(): string[] {
    const industries = new Set(this.jobs.map(job => job.industry));
    return Array.from(industries).sort();
  }

  getTags(): string[] {
    const tags = new Set(this.jobs.flatMap(job => job.tags));
    return Array.from(tags).sort();
  }

  subscribe(callback: (jobs: Job[]) => void): { unsubscribe: () => void } {
    this.subscribers.push(callback);
    
    return {
      unsubscribe: () => {
        const index = this.subscribers.indexOf(callback);
        if (index > -1) {
          this.subscribers.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.jobs));
  }

  getJobs(): Job[] {
    return this.jobs;
  }

  getJobById(jobId: string): Job | undefined {
    return this.jobs.find(job => job.id === jobId);
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  getSavedJobs(): Job[] {
    return this.jobs.filter(job => job.saved);
  }

  getAppliedJobs(): Job[] {
    return this.jobs.filter(job => job.applied);
  }

  getRecommendedJobs(): Job[] {
    // Return jobs that are new, urgent, or have high ratings
    return this.jobs
      .filter(job => job.isNew || job.isUrgent || job.rating > 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  // World data methods
  getWorldStats() {
    return worldDataService.getStats();
  }

  getJobsByCountry(country: string): Job[] {
    return worldDataService.getJobsByCountry(country).map(this.convertWorldJobToJob);
  }

  getJobsByCity(city: string): Job[] {
    return worldDataService.getJobsByCity(city).map(this.convertWorldJobToJob);
  }

  getIndianJobs(): Job[] {
    return this.getJobsByCountry('India');
  }

  getGlobalJobs(): Job[] {
    const indianJobs = this.getJobsByCountry('India');
    const allJobs = this.worldJobs.map(this.convertWorldJobToJob);
    return allJobs.filter(job => !indianJobs.some(indianJob => indianJob.id === job.id));
  }

  getWorldCompanies() {
    return worldDataService.getWorldCompanies();
  }

  getIndianCompanies() {
    return worldDataService.getWorldCompanies({ country: 'India' });
  }
}

// Export singleton instance
export const jobsService = new JobsService();