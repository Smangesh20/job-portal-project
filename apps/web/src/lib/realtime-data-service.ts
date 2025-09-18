// Real-Time Data Integration Service
// Provides live job market data from multiple sources with intelligent caching and deduplication

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  postedDate: string;
  applicationDeadline?: string;
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'github' | 'stackoverflow' | 'company';
  sourceUrl: string;
  companyLogo?: string;
  isRemote: boolean;
  isUrgent: boolean;
  isFeatured: boolean;
  applicationCount?: number;
  views?: number;
}

interface CompanyData {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  employees: number;
  revenue?: string;
  rating?: number;
  reviews?: number;
  benefits: string[];
  culture: string[];
  technologies: string[];
  jobCount: number;
  recentHires: number;
  growthRate: number;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface MarketTrend {
  id: string;
  skill: string;
  demand: number;
  supply: number;
  averageSalary: number;
  growthRate: number;
  trend: 'rising' | 'stable' | 'declining';
  topCompanies: string[];
  topLocations: string[];
  lastUpdated: string;
}

interface SalaryInsight {
  id: string;
  position: string;
  location: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  factors: {
    education: { [key: string]: number };
    skills: { [key: string]: number };
    companySize: { [key: string]: number };
  };
  lastUpdated: string;
}

interface TrendingSkill {
  id: string;
  name: string;
  category: string;
  growthRate: number;
  jobCount: number;
  averageSalary: number;
  learningResources: {
    courses: string[];
    tutorials: string[];
    certifications: string[];
  };
  relatedSkills: string[];
  lastUpdated: string;
}

interface SearchFilters {
  query?: string;
  location?: string;
  type?: string[];
  salaryMin?: number;
  salaryMax?: number;
  experience?: string[];
  skills?: string[];
  company?: string[];
  remote?: boolean;
  postedWithin?: number; // days
  sortBy?: 'relevance' | 'date' | 'salary' | 'company';
  page?: number;
  limit?: number;
}

interface SearchResult {
  jobs: JobListing[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: SearchFilters;
  suggestions: string[];
  relatedSearches: string[];
}

class RealtimeDataService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = {
    jobs: 5 * 60 * 1000, // 5 minutes
    companies: 30 * 60 * 1000, // 30 minutes
    trends: 60 * 60 * 1000, // 1 hour
    salaries: 24 * 60 * 60 * 1000, // 24 hours
  };

  // Search jobs with real-time data
  async searchJobs(filters: SearchFilters = {}): Promise<SearchResult> {
    const cacheKey = `jobs_${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Simulate real-time data from multiple sources
      const jobs = await this.fetchJobsFromMultipleSources(filters);
      const result: SearchResult = {
        jobs,
        total: jobs.length,
        page: filters.page || 1,
        limit: filters.limit || 20,
        hasMore: jobs.length >= (filters.limit || 20),
        filters,
        suggestions: this.generateSuggestions(filters.query || ''),
        relatedSearches: this.generateRelatedSearches(filters.query || '')
      };

      this.setCache(cacheKey, result, this.CACHE_TTL.jobs);
      return result;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  // Get job details
  async getJobDetails(jobId: string): Promise<JobListing | null> {
    const cacheKey = `job_${jobId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const job = await this.fetchJobDetails(jobId);
      if (job) {
        this.setCache(cacheKey, job, this.CACHE_TTL.jobs);
      }
      return job;
    } catch (error) {
      console.error('Error getting job details:', error);
      return null;
    }
  }

  // Get company data
  async getCompanyData(companyId: string): Promise<CompanyData | null> {
    const cacheKey = `company_${companyId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const company = await this.fetchCompanyData(companyId);
      if (company) {
        this.setCache(cacheKey, company, this.CACHE_TTL.companies);
      }
      return company;
    } catch (error) {
      console.error('Error getting company data:', error);
      return null;
    }
  }

  // Get market trends
  async getMarketTrends(): Promise<MarketTrend[]> {
    const cacheKey = 'market_trends';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const trends = await this.fetchMarketTrends();
      this.setCache(cacheKey, trends, this.CACHE_TTL.trends);
      return trends;
    } catch (error) {
      console.error('Error getting market trends:', error);
      return [];
    }
  }

  // Get salary insights
  async getSalaryInsights(position: string, location: string): Promise<SalaryInsight[]> {
    const cacheKey = `salaries_${position}_${location}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const insights = await this.fetchSalaryInsights(position, location);
      this.setCache(cacheKey, insights, this.CACHE_TTL.salaries);
      return insights;
    } catch (error) {
      console.error('Error getting salary insights:', error);
      return [];
    }
  }

  // Get trending skills
  async getTrendingSkills(): Promise<TrendingSkill[]> {
    const cacheKey = 'trending_skills';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const skills = await this.fetchTrendingSkills();
      this.setCache(cacheKey, skills, this.CACHE_TTL.trends);
      return skills;
    } catch (error) {
      console.error('Error getting trending skills:', error);
      return [];
    }
  }

  // Simulate fetching jobs from multiple sources
  private async fetchJobsFromMultipleSources(filters: SearchFilters): Promise<JobListing[]> {
    // Simulate API calls to multiple job sources
    const sources = ['linkedin', 'indeed', 'glassdoor', 'github', 'stackoverflow'];
    const allJobs: JobListing[] = [];

    for (const source of sources) {
      const jobs = await this.simulateJobFetch(source, filters);
      allJobs.push(...jobs);
    }

    // Deduplicate jobs based on title, company, and location
    const uniqueJobs = this.deduplicateJobs(allJobs);
    
    // Apply filters
    return this.applyFilters(uniqueJobs, filters);
  }

  private async simulateJobFetch(source: string, filters: SearchFilters): Promise<JobListing[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    const sampleJobs: JobListing[] = [
      {
        id: `${source}_${Date.now()}_1`,
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        type: 'full-time',
        salary: {
          min: 120000,
          max: 180000,
          currency: 'USD',
          period: 'yearly'
        },
        description: 'We are looking for a senior software engineer to join our team...',
        requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js'],
        benefits: ['Health insurance', '401k', 'Flexible hours'],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        experience: '5+ years',
        education: 'Bachelor\'s degree',
        postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: source as any,
        sourceUrl: `https://${source}.com/jobs/123`,
        isRemote: Math.random() > 0.5,
        isUrgent: Math.random() > 0.8,
        isFeatured: Math.random() > 0.7,
        applicationCount: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000)
      },
      {
        id: `${source}_${Date.now()}_2`,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        type: 'full-time',
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD',
          period: 'yearly'
        },
        description: 'Join our fast-growing startup as a frontend developer...',
        requirements: ['3+ years experience', 'React', 'Vue.js', 'CSS'],
        benefits: ['Equity', 'Health insurance', 'Remote work'],
        skills: ['React', 'Vue.js', 'CSS', 'HTML'],
        experience: '3+ years',
        education: 'Bachelor\'s degree preferred',
        postedDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        source: source as any,
        sourceUrl: `https://${source}.com/jobs/456`,
        isRemote: true,
        isUrgent: false,
        isFeatured: false,
        applicationCount: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 500)
      }
    ];

    return sampleJobs.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private deduplicateJobs(jobs: JobListing[]): JobListing[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}_${job.location.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private applyFilters(jobs: JobListing[], filters: SearchFilters): JobListing[] {
    let filtered = [...jobs];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location) ||
        (filters.remote && job.isRemote)
      );
    }

    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(job => filters.type!.includes(job.type));
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job => job.salary && job.salary.min >= filters.salaryMin!);
    }

    if (filters.salaryMax) {
      filtered = filtered.filter(job => job.salary && job.salary.max <= filters.salaryMax!);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills!.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.postedWithin) {
      const cutoffDate = new Date(Date.now() - filters.postedWithin * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(job => new Date(job.postedDate) >= cutoffDate);
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'date':
          filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
          break;
        case 'salary':
          filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
          break;
        case 'company':
          filtered.sort((a, b) => a.company.localeCompare(b.company));
          break;
        default: // relevance
          filtered.sort((a, b) => {
            const aScore = (a.isFeatured ? 10 : 0) + (a.isUrgent ? 5 : 0) + (a.views || 0) / 100;
            const bScore = (b.isFeatured ? 10 : 0) + (b.isUrgent ? 5 : 0) + (b.views || 0) / 100;
            return bScore - aScore;
          });
      }
    }

    return filtered;
  }

  private async fetchJobDetails(jobId: string): Promise<JobListing | null> {
    // Simulate fetching job details
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a sample job (in real implementation, this would fetch from API)
    return {
      id: jobId,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: {
        min: 120000,
        max: 180000,
        currency: 'USD',
        period: 'yearly'
      },
      description: 'We are looking for a senior software engineer to join our team. You will be responsible for developing and maintaining our core platform...',
      requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
      benefits: ['Health insurance', '401k', 'Flexible hours', 'Stock options'],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      experience: '5+ years',
      education: 'Bachelor\'s degree in Computer Science or related field',
      postedDate: new Date().toISOString(),
      source: 'linkedin',
      sourceUrl: 'https://linkedin.com/jobs/123',
      isRemote: false,
      isUrgent: false,
      isFeatured: true,
      applicationCount: 45,
      views: 234
    };
  }

  private async fetchCompanyData(companyId: string): Promise<CompanyData | null> {
    // Simulate fetching company data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: companyId,
      name: 'Tech Corp',
      logo: 'https://via.placeholder.com/100x100',
      website: 'https://techcorp.com',
      description: 'A leading technology company focused on innovation and growth.',
      industry: 'Technology',
      size: '1001-5000 employees',
      founded: 2010,
      headquarters: 'San Francisco, CA',
      employees: 2500,
      revenue: '$500M',
      rating: 4.2,
      reviews: 1250,
      benefits: ['Health insurance', '401k', 'Flexible hours', 'Stock options'],
      culture: ['Innovative', 'Collaborative', 'Fast-paced'],
      technologies: ['JavaScript', 'React', 'Node.js', 'AWS', 'Docker'],
      jobCount: 45,
      recentHires: 12,
      growthRate: 15,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp'
      }
    };
  }

  private async fetchMarketTrends(): Promise<MarketTrend[]> {
    // Simulate fetching market trends
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'trend_1',
        skill: 'JavaScript',
        demand: 85,
        supply: 70,
        averageSalary: 95000,
        growthRate: 12,
        trend: 'rising',
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Facebook'],
        topLocations: ['San Francisco', 'New York', 'Seattle', 'Austin'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'trend_2',
        skill: 'Python',
        demand: 78,
        supply: 65,
        averageSalary: 105000,
        growthRate: 15,
        trend: 'rising',
        topCompanies: ['Google', 'Netflix', 'Uber', 'Airbnb'],
        topLocations: ['San Francisco', 'Seattle', 'Boston', 'Denver'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'trend_3',
        skill: 'React',
        demand: 72,
        supply: 60,
        averageSalary: 88000,
        growthRate: 18,
        trend: 'rising',
        topCompanies: ['Facebook', 'Netflix', 'Airbnb', 'Uber'],
        topLocations: ['San Francisco', 'New York', 'Seattle', 'Los Angeles'],
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private async fetchSalaryInsights(position: string, location: string): Promise<SalaryInsight[]> {
    // Simulate fetching salary insights
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'salary_1',
        position: position,
        location: location,
        experience: '3-5 years',
        minSalary: 80000,
        maxSalary: 120000,
        averageSalary: 95000,
        currency: 'USD',
        period: 'yearly',
        percentiles: {
          p25: 75000,
          p50: 95000,
          p75: 115000,
          p90: 135000
        },
        factors: {
          education: {
            'Bachelor\'s': 95000,
            'Master\'s': 110000,
            'PhD': 125000
          },
          skills: {
            'JavaScript': 100000,
            'Python': 105000,
            'React': 98000,
            'Node.js': 102000
          },
          companySize: {
            'Startup': 85000,
            'Mid-size': 95000,
            'Enterprise': 110000
          }
        },
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private async fetchTrendingSkills(): Promise<TrendingSkill[]> {
    // Simulate fetching trending skills
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: 'skill_1',
        name: 'Machine Learning',
        category: 'AI/ML',
        growthRate: 25,
        jobCount: 1250,
        averageSalary: 120000,
        learningResources: {
          courses: ['Coursera ML Course', 'Udacity AI Nanodegree'],
          tutorials: ['TensorFlow Tutorials', 'PyTorch Guide'],
          certifications: ['Google ML Certificate', 'AWS ML Specialty']
        },
        relatedSkills: ['Python', 'TensorFlow', 'PyTorch', 'Statistics'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'skill_2',
        name: 'Cloud Computing',
        category: 'Infrastructure',
        growthRate: 20,
        jobCount: 2100,
        averageSalary: 110000,
        learningResources: {
          courses: ['AWS Cloud Practitioner', 'Azure Fundamentals'],
          tutorials: ['AWS Tutorials', 'Docker Guide'],
          certifications: ['AWS Solutions Architect', 'Azure Administrator']
        },
        relatedSkills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  private generateSuggestions(query: string): string[] {
    const suggestions = [
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
      'DevOps Engineer',
      'Machine Learning Engineer',
      'Cloud Architect'
    ];
    
    if (!query) return suggestions.slice(0, 5);
    
    return suggestions
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  private generateRelatedSearches(query: string): string[] {
    const related = {
      'software': ['software engineer', 'software developer', 'programmer'],
      'frontend': ['frontend developer', 'ui developer', 'web developer'],
      'backend': ['backend developer', 'api developer', 'server developer'],
      'data': ['data scientist', 'data analyst', 'data engineer'],
      'design': ['ux designer', 'ui designer', 'product designer']
    };
    
    for (const [key, values] of Object.entries(related)) {
      if (query.toLowerCase().includes(key)) {
        return values;
      }
    }
    
    return ['software engineer', 'frontend developer', 'data scientist'];
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const realtimeDataService = new RealtimeDataService();

// Export types
export type {
  JobListing,
  CompanyData,
  MarketTrend,
  SalaryInsight,
  TrendingSkill,
  SearchFilters,
  SearchResult
};
