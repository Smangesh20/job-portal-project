import axios from 'axios';
import { logger } from '../utils/logger';
import { getRedisService } from '../utils/redis';

export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  type: string;
  experience: string;
  skills: string[];
  postedAt: string;
  source: string;
  url: string;
  match?: number;
}

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  size: string;
  industry: string;
  location: string;
  founded?: number;
  employees?: number;
  rating?: number;
  reviews?: number;
}

export interface MarketData {
  totalJobs: number;
  averageSalary: number;
  topSkills: string[];
  trendingCompanies: string[];
  marketTrends: {
    remoteWork: number;
    fullTime: number;
    contract: number;
    partTime: number;
  };
  lastUpdated: string;
}

export class RealtimeDataService {
  private redis: any;
  private apiKeys: {
    linkedin: string;
    indeed: string;
    glassdoor: string;
    github: string;
    stackoverflow: string;
  };

  constructor() {
    this.redis = getRedisService();
    this.apiKeys = {
      linkedin: process.env.LINKEDIN_API_KEY || '',
      indeed: process.env.INDEED_API_KEY || '',
      glassdoor: process.env.GLASSDOOR_API_KEY || '',
      github: process.env.GITHUB_API_KEY || '',
      stackoverflow: process.env.STACKOVERFLOW_API_KEY || ''
    };
  }

  /**
   * Search jobs from multiple real-time sources
   */
  async searchJobs(query: string, filters: any = {}): Promise<JobData[]> {
    try {
      const cacheKey = `jobs:${query}:${JSON.stringify(filters)}`;
      
      // Check cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const jobs: JobData[] = [];
      
      // Search from multiple sources in parallel
      const searchPromises = [
        this.searchLinkedInJobs(query, filters),
        this.searchIndeedJobs(query, filters),
        this.searchGlassdoorJobs(query, filters),
        this.searchGitHubJobs(query, filters),
        this.searchStackOverflowJobs(query, filters)
      ];

      const results = await Promise.allSettled(searchPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          jobs.push(...result.value);
        } else {
          logger.error('Job search source failed:', result.reason);
        }
      });

      // Remove duplicates and sort by relevance
      const uniqueJobs = this.deduplicateJobs(jobs);
      const sortedJobs = this.sortJobsByRelevance(uniqueJobs, query);

      // Cache results for 15 minutes
      await this.redis.set(cacheKey, JSON.stringify(sortedJobs), 900);

      return sortedJobs;
    } catch (error) {
      logger.error('Error searching jobs:', error);
      throw error;
    }
  }

  /**
   * Get job details from real-time sources
   */
  async getJobDetails(jobId: string, source: string): Promise<JobData | null> {
    try {
      const cacheKey = `job:${jobId}:${source}`;
      
      // Check cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      let jobDetails: JobData | null = null;

      switch (source) {
        case 'linkedin':
          jobDetails = await this.getLinkedInJobDetails(jobId);
          break;
        case 'indeed':
          jobDetails = await this.getIndeedJobDetails(jobId);
          break;
        case 'glassdoor':
          jobDetails = await this.getGlassdoorJobDetails(jobId);
          break;
        case 'github':
          jobDetails = await this.getGitHubJobDetails(jobId);
          break;
        case 'stackoverflow':
          jobDetails = await this.getStackOverflowJobDetails(jobId);
          break;
        default:
          throw new Error(`Unsupported job source: ${source}`);
      }

      if (jobDetails) {
        // Cache for 1 hour
        await this.redis.set(cacheKey, JSON.stringify(jobDetails), 3600);
      }

      return jobDetails;
    } catch (error) {
      logger.error('Error getting job details:', error);
      throw error;
    }
  }

  /**
   * Get company information from real-time sources
   */
  async getCompanyData(companyName: string): Promise<CompanyData | null> {
    try {
      const cacheKey = `company:${companyName}`;
      
      // Check cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const companyData = await this.fetchCompanyData(companyName);

      if (companyData) {
        // Cache for 24 hours
        await this.redis.set(cacheKey, JSON.stringify(companyData), 86400);
      }

      return companyData;
    } catch (error) {
      logger.error('Error getting company data:', error);
      throw error;
    }
  }

  /**
   * Get real-time market data
   */
  async getMarketData(): Promise<MarketData> {
    try {
      const cacheKey = 'market:data';
      
      // Check cache first
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const marketData = await this.fetchMarketData();

      // Cache for 1 hour
      await this.redis.set(cacheKey, JSON.stringify(marketData), 3600);

      return marketData;
    } catch (error) {
      logger.error('Error getting market data:', error);
      throw error;
    }
  }

  /**
   * Search LinkedIn jobs
   */
  private async searchLinkedInJobs(query: string, filters: any): Promise<JobData[]> {
    try {
      if (!this.apiKeys.linkedin) {
        return [];
      }

      const response = await axios.get('https://api.linkedin.com/v2/jobSearch', {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.linkedin}`,
          'Content-Type': 'application/json'
        },
        params: {
          keywords: query,
          location: filters.location || '',
          experienceLevel: filters.experience || '',
          jobType: filters.type || '',
          count: 50
        }
      });

      return this.transformLinkedInJobs(response.data.elements || []);
    } catch (error) {
      logger.error('LinkedIn job search failed:', error);
      return [];
    }
  }

  /**
   * Search Indeed jobs
   */
  private async searchIndeedJobs(query: string, filters: any): Promise<JobData[]> {
    try {
      if (!this.apiKeys.indeed) {
        return [];
      }

      const response = await axios.get('https://api.indeed.com/ads/apisearch', {
        params: {
          publisher: this.apiKeys.indeed,
          q: query,
          l: filters.location || '',
          sort: 'date',
          radius: filters.radius || '25',
          st: 'jobsite',
          jt: filters.type || '',
          start: 0,
          limit: 50,
          format: 'json'
        }
      });

      return this.transformIndeedJobs(response.data.results || []);
    } catch (error) {
      logger.error('Indeed job search failed:', error);
      return [];
    }
  }

  /**
   * Search Glassdoor jobs
   */
  private async searchGlassdoorJobs(query: string, filters: any): Promise<JobData[]> {
    try {
      if (!this.apiKeys.glassdoor) {
        return [];
      }

      const response = await axios.get('https://api.glassdoor.com/api/api.htm', {
        params: {
          't.p': this.apiKeys.glassdoor,
          't.k': process.env.GLASSDOOR_PARTNER_ID || '',
          userip: '0.0.0.0',
          useragent: 'Mozilla/5.0',
          format: 'json',
          v: '1',
          action: 'jobs-prog',
          jt: query,
          l: filters.location || '',
          ps: 50
        }
      });

      return this.transformGlassdoorJobs(response.data.response.jobs || []);
    } catch (error) {
      logger.error('Glassdoor job search failed:', error);
      return [];
    }
  }

  /**
   * Search GitHub jobs
   */
  private async searchGitHubJobs(query: string, filters: any): Promise<JobData[]> {
    try {
      if (!this.apiKeys.github) {
        return [];
      }

      const response = await axios.get('https://jobs.github.com/positions.json', {
        params: {
          description: query,
          location: filters.location || '',
          type: filters.type || '',
          page: 0
        }
      });

      return this.transformGitHubJobs(response.data || []);
    } catch (error) {
      logger.error('GitHub job search failed:', error);
      return [];
    }
  }

  /**
   * Search Stack Overflow jobs
   */
  private async searchStackOverflowJobs(query: string, filters: any): Promise<JobData[]> {
    try {
      if (!this.apiKeys.stackoverflow) {
        return [];
      }

      const response = await axios.get('https://api.stackexchange.com/2.3/jobs', {
        params: {
          key: this.apiKeys.stackoverflow,
          site: 'stackoverflow',
          tagged: query,
          location: filters.location || '',
          pagesize: 50
        }
      });

      return this.transformStackOverflowJobs(response.data.items || []);
    } catch (error) {
      logger.error('Stack Overflow job search failed:', error);
      return [];
    }
  }

  /**
   * Transform LinkedIn jobs to standard format
   */
  private transformLinkedInJobs(jobs: any[]): JobData[] {
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      salary: job.salaryRange ? {
        min: job.salaryRange.min,
        max: job.salaryRange.max,
        currency: job.salaryRange.currency || 'USD'
      } : undefined,
      description: job.description,
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      type: job.jobType || 'Full-time',
      experience: job.experienceLevel || 'Mid-level',
      skills: job.skills || [],
      postedAt: job.postedAt,
      source: 'linkedin',
      url: job.url
    }));
  }

  /**
   * Transform Indeed jobs to standard format
   */
  private transformIndeedJobs(jobs: any[]): JobData[] {
    return jobs.map(job => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      salary: job.salary ? {
        min: job.salary.min,
        max: job.salary.max,
        currency: 'USD'
      } : undefined,
      description: job.snippet,
      requirements: [],
      benefits: [],
      type: job.jobType || 'Full-time',
      experience: 'Mid-level',
      skills: [],
      postedAt: job.date,
      source: 'indeed',
      url: job.url
    }));
  }

  /**
   * Transform Glassdoor jobs to standard format
   */
  private transformGlassdoorJobs(jobs: any[]): JobData[] {
    return jobs.map(job => ({
      id: job.jobId,
      title: job.jobTitle,
      company: job.employerName,
      location: job.location,
      salary: job.salary ? {
        min: job.salary.min,
        max: job.salary.max,
        currency: 'USD'
      } : undefined,
      description: job.jobDescription,
      requirements: [],
      benefits: job.benefits || [],
      type: job.jobType || 'Full-time',
      experience: 'Mid-level',
      skills: [],
      postedAt: job.postedDate,
      source: 'glassdoor',
      url: job.jobUrl
    }));
  }

  /**
   * Transform GitHub jobs to standard format
   */
  private transformGitHubJobs(jobs: any[]): JobData[] {
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: undefined,
      description: job.description,
      requirements: [],
      benefits: [],
      type: job.type || 'Full-time',
      experience: 'Mid-level',
      skills: [],
      postedAt: job.created_at,
      source: 'github',
      url: job.url
    }));
  }

  /**
   * Transform Stack Overflow jobs to standard format
   */
  private transformStackOverflowJobs(jobs: any[]): JobData[] {
    return jobs.map(job => ({
      id: job.job_id.toString(),
      title: job.title,
      company: job.company_name,
      location: job.location,
      salary: undefined,
      description: job.description,
      requirements: [],
      benefits: [],
      type: 'Full-time',
      experience: 'Mid-level',
      skills: [],
      postedAt: new Date(job.creation_date * 1000).toISOString(),
      source: 'stackoverflow',
      url: job.url
    }));
  }

  /**
   * Get LinkedIn job details
   */
  private async getLinkedInJobDetails(jobId: string): Promise<JobData | null> {
    try {
      const response = await axios.get(`https://api.linkedin.com/v2/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.linkedin}`,
          'Content-Type': 'application/json'
        }
      });

      return this.transformLinkedInJobs([response.data])[0] || null;
    } catch (error) {
      logger.error('LinkedIn job details failed:', error);
      return null;
    }
  }

  /**
   * Get Indeed job details
   */
  private async getIndeedJobDetails(jobId: string): Promise<JobData | null> {
    try {
      const response = await axios.get(`https://api.indeed.com/ads/apigetjob`, {
        params: {
          publisher: this.apiKeys.indeed,
          jobkey: jobId,
          format: 'json'
        }
      });

      return this.transformIndeedJobs([response.data])[0] || null;
    } catch (error) {
      logger.error('Indeed job details failed:', error);
      return null;
    }
  }

  /**
   * Get Glassdoor job details
   */
  private async getGlassdoorJobDetails(jobId: string): Promise<JobData | null> {
    try {
      const response = await axios.get(`https://api.glassdoor.com/api/api.htm`, {
        params: {
          't.p': this.apiKeys.glassdoor,
          't.k': process.env.GLASSDOOR_PARTNER_ID || '',
          userip: '0.0.0.0',
          useragent: 'Mozilla/5.0',
          format: 'json',
          v: '1',
          action: 'job-prog',
          jobId: jobId
        }
      });

      return this.transformGlassdoorJobs([response.data.response.job])[0] || null;
    } catch (error) {
      logger.error('Glassdoor job details failed:', error);
      return null;
    }
  }

  /**
   * Get GitHub job details
   */
  private async getGitHubJobDetails(jobId: string): Promise<JobData | null> {
    try {
      const response = await axios.get(`https://jobs.github.com/positions/${jobId}.json`);

      return this.transformGitHubJobs([response.data])[0] || null;
    } catch (error) {
      logger.error('GitHub job details failed:', error);
      return null;
    }
  }

  /**
   * Get Stack Overflow job details
   */
  private async getStackOverflowJobDetails(jobId: string): Promise<JobData | null> {
    try {
      const response = await axios.get(`https://api.stackexchange.com/2.3/jobs/${jobId}`, {
        params: {
          key: this.apiKeys.stackoverflow,
          site: 'stackoverflow'
        }
      });

      return this.transformStackOverflowJobs(response.data.items || [])[0] || null;
    } catch (error) {
      logger.error('Stack Overflow job details failed:', error);
      return null;
    }
  }

  /**
   * Fetch company data from multiple sources
   */
  private async fetchCompanyData(companyName: string): Promise<CompanyData | null> {
    try {
      // Try multiple sources
      const sources = [
        this.getCompanyFromLinkedIn(companyName),
        this.getCompanyFromGlassdoor(companyName),
        this.getCompanyFromCrunchbase(companyName)
      ];

      const results = await Promise.allSettled(sources);
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
      }

      return null;
    } catch (error) {
      logger.error('Error fetching company data:', error);
      return null;
    }
  }

  /**
   * Get company from LinkedIn
   */
  private async getCompanyFromLinkedIn(companyName: string): Promise<CompanyData | null> {
    try {
      if (!this.apiKeys.linkedin) return null;

      const response = await axios.get('https://api.linkedin.com/v2/companies', {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.linkedin}`,
          'Content-Type': 'application/json'
        },
        params: {
          q: 'universalName',
          universalName: companyName
        }
      });

      const company = response.data.elements?.[0];
      if (!company) return null;

      return {
        id: company.id,
        name: company.name,
        description: company.description,
        website: company.websiteUrl,
        logo: company.logoV2?.original,
        size: company.companySize,
        industry: company.industry,
        location: company.headquarters?.city,
        founded: company.foundedOn?.year,
        employees: company.staffCount,
        rating: 0,
        reviews: 0
      };
    } catch (error) {
      logger.error('LinkedIn company search failed:', error);
      return null;
    }
  }

  /**
   * Get company from Glassdoor
   */
  private async getCompanyFromGlassdoor(companyName: string): Promise<CompanyData | null> {
    try {
      if (!this.apiKeys.glassdoor) return null;

      const response = await axios.get('https://api.glassdoor.com/api/api.htm', {
        params: {
          't.p': this.apiKeys.glassdoor,
          't.k': process.env.GLASSDOOR_PARTNER_ID || '',
          userip: '0.0.0.0',
          useragent: 'Mozilla/5.0',
          format: 'json',
          v: '1',
          action: 'employers',
          q: companyName
        }
      });

      const company = response.data.response.employers?.[0];
      if (!company) return null;

      return {
        id: company.id,
        name: company.name,
        description: company.description,
        website: company.website,
        logo: company.squareLogo,
        size: company.numberOfRatings,
        industry: company.industry,
        location: company.headquarters,
        founded: company.foundedYear,
        employees: company.numberOfRatings,
        rating: company.overallRating,
        reviews: company.numberOfRatings
      };
    } catch (error) {
      logger.error('Glassdoor company search failed:', error);
      return null;
    }
  }

  /**
   * Get company from Crunchbase
   */
  private async getCompanyFromCrunchbase(companyName: string): Promise<CompanyData | null> {
    try {
      const response = await axios.get(`https://api.crunchbase.com/v4/entities/organizations`, {
        headers: {
          'X-cb-user-key': process.env.CRUNCHBASE_API_KEY || ''
        },
        params: {
          name: companyName,
          field_ids: 'name,short_description,website,logo,rank_org,location_identifiers,founded_on,employee_count'
        }
      });

      const company = response.data.entities?.[0];
      if (!company) return null;

      return {
        id: company.uuid,
        name: company.properties.name,
        description: company.properties.short_description,
        website: company.properties.website,
        logo: company.properties.logo,
        size: company.properties.employee_count,
        industry: company.properties.rank_org,
        location: company.properties.location_identifiers?.[0]?.name,
        founded: company.properties.founded_on?.year,
        employees: company.properties.employee_count,
        rating: 0,
        reviews: 0
      };
    } catch (error) {
      logger.error('Crunchbase company search failed:', error);
      return null;
    }
  }

  /**
   * Fetch market data from multiple sources
   */
  private async fetchMarketData(): Promise<MarketData> {
    try {
      // This would typically aggregate data from multiple sources
      // For now, we'll return a mock structure that could be populated with real data
      return {
        totalJobs: 0,
        averageSalary: 0,
        topSkills: [],
        trendingCompanies: [],
        marketTrends: {
          remoteWork: 0,
          fullTime: 0,
          contract: 0,
          partTime: 0
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error fetching market data:', error);
      throw error;
    }
  }

  /**
   * Remove duplicate jobs based on title and company
   */
  private deduplicateJobs(jobs: JobData[]): JobData[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Sort jobs by relevance to query
   */
  private sortJobsByRelevance(jobs: JobData[], query: string): JobData[] {
    const queryLower = query.toLowerCase();
    
    return jobs.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryLower);
      const bScore = this.calculateRelevanceScore(b, queryLower);
      return bScore - aScore;
    });
  }

  /**
   * Calculate relevance score for a job
   */
  private calculateRelevanceScore(job: JobData, query: string): number {
    let score = 0;
    
    // Title match
    if (job.title.toLowerCase().includes(query)) {
      score += 10;
    }
    
    // Company match
    if (job.company.toLowerCase().includes(query)) {
      score += 5;
    }
    
    // Description match
    if (job.description.toLowerCase().includes(query)) {
      score += 3;
    }
    
    // Skills match
    const skillMatches = job.skills.filter(skill => 
      skill.toLowerCase().includes(query)
    ).length;
    score += skillMatches * 2;
    
    // Requirements match
    const reqMatches = job.requirements.filter(req => 
      req.toLowerCase().includes(query)
    ).length;
    score += reqMatches;
    
    return score;
  }
}

export const realtimeDataService = new RealtimeDataService();
