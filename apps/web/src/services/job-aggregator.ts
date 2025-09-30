/**
 * Enterprise Job Portal Aggregator
 * Searches multiple job portals and aggregates results for intelligent matching
 */

export interface JobPortal {
  name: string;
  baseUrl: string;
  apiEndpoint: string;
  apiKey?: string;
  rateLimit: number;
  searchEndpoint: string;
  jobDetailsEndpoint: string;
  applyEndpoint: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange?: SalaryRange;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  industry: string;
  department: string;
  skills: string[];
  postedDate: Date;
  expiryDate?: Date;
  source: JobPortal;
  applyUrl: string;
  companyLogo?: string;
  remoteOption: boolean;
  matchScore?: number;
  matchReasons?: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface SearchCriteria {
  keywords: string[];
  location?: string;
  salaryRange?: SalaryRange;
  jobTypes?: string[];
  experienceLevels?: string[];
  industries?: string[];
  skills?: string[];
  remote?: boolean;
  postedDate?: Date;
  companySize?: string;
}

export interface SearchResults {
  jobs: JobListing[];
  totalResults: number;
  exactMatches: number;
  partialMatches: number;
  searchTime: number;
  portalsSearched: string[];
  statistics: SearchStatistics;
}

export interface SearchStatistics {
  averageSalary: number;
  topCompanies: { name: string; count: number }[];
  topSkills: { skill: string; count: number }[];
  topLocations: { location: string; count: number }[];
  experienceDistribution: { level: string; count: number }[];
  industryDistribution: { industry: string; count: number }[];
}

export class JobAggregator {
  private portals: JobPortal[];
  private cache: Map<string, JobListing[]>;
  private rateLimiters: Map<string, number>;

  constructor() {
    this.portals = this.initializeJobPortals();
    this.cache = new Map();
    this.rateLimiters = new Map();
  }

  /**
   * Search jobs across multiple portals
   */
  async searchJobs(criteria: SearchCriteria): Promise<SearchResults> {
    const startTime = Date.now();
    const searchPromises: Promise<JobListing[]>[] = [];
    const portalsSearched: string[] = [];

    // Search each portal
    for (const portal of this.portals) {
      if (this.canSearchPortal(portal)) {
        searchPromises.push(this.searchPortal(portal, criteria));
        portalsSearched.push(portal.name);
      }
    }

    // Wait for all searches to complete
    const results = await Promise.allSettled(searchPromises);
    
    // Aggregate results
    const allJobs: JobListing[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value);
      } else {
        console.error(`Failed to search ${portalsSearched[index]}:`, result.reason);
      }
    });

    // Remove duplicates and rank results
    const uniqueJobs = this.removeDuplicates(allJobs);
    const rankedJobs = await this.rankJobs(uniqueJobs, criteria);
    
    // Calculate statistics
    const statistics = this.calculateStatistics(rankedJobs);
    
    // Categorize matches
    const exactMatches = rankedJobs.filter(job => (job.matchScore || 0) >= 90).length;
    const partialMatches = rankedJobs.filter(job => (job.matchScore || 0) >= 60 && (job.matchScore || 0) < 90).length;

    return {
      jobs: rankedJobs,
      totalResults: rankedJobs.length,
      exactMatches,
      partialMatches,
      searchTime: Date.now() - startTime,
      portalsSearched,
      statistics
    };
  }

  /**
   * Search a specific job portal
   */
  private async searchPortal(portal: JobPortal, criteria: SearchCriteria): Promise<JobListing[]> {
    try {
      // Check rate limits
      if (!this.canSearchPortal(portal)) {
        throw new Error(`Rate limit exceeded for ${portal.name}`);
      }

      // Build search query
      const searchQuery = this.buildSearchQuery(portal, criteria);
      
      // Make API request
      const response = await this.makeApiRequest(portal, searchQuery);
      
      // Parse response
      const jobs = this.parsePortalResponse(portal, response);
      
      // Update rate limiter
      this.updateRateLimiter(portal);
      
      // Cache results
      this.cacheResults(portal.name, criteria, jobs);
      
      return jobs;
    } catch (error) {
      console.error(`Error searching ${portal.name}:`, error);
      return [];
    }
  }

  /**
   * Build search query for specific portal
   */
  private buildSearchQuery(portal: JobPortal, criteria: SearchCriteria): any {
    // Portal-specific query building
    switch (portal.name.toLowerCase()) {
      case 'indeed':
        return this.buildIndeedQuery(criteria);
      case 'linkedin':
        return this.buildLinkedInQuery(criteria);
      case 'glassdoor':
        return this.buildGlassdoorQuery(criteria);
      case 'naukri':
        return this.buildNaukriQuery(criteria);
      case 'monster':
        return this.buildMonsterQuery(criteria);
      default:
        return this.buildGenericQuery(criteria);
    }
  }

  /**
   * Make API request to job portal
   */
  private async makeApiRequest(portal: JobPortal, query: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AskYaCham-JobAggregator/1.0'
    };

    if (portal.apiKey) {
      headers['Authorization'] = `Bearer ${portal.apiKey}`;
    }

    const response = await fetch(portal.searchEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Parse portal-specific response format
   */
  private parsePortalResponse(portal: JobPortal, response: any): JobListing[] {
    switch (portal.name.toLowerCase()) {
      case 'indeed':
        return this.parseIndeedResponse(response);
      case 'linkedin':
        return this.parseLinkedInResponse(response);
      case 'glassdoor':
        return this.parseGlassdoorResponse(response);
      case 'naukri':
        return this.parseNaukriResponse(response);
      case 'monster':
        return this.parseMonsterResponse(response);
      default:
        return this.parseGenericResponse(response);
    }
  }

  /**
   * Remove duplicate job listings
   */
  private removeDuplicates(jobs: JobListing[]): JobListing[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}-${job.location}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Rank jobs based on match criteria
   */
  private async rankJobs(jobs: JobListing[], criteria: SearchCriteria): Promise<JobListing[]> {
    return jobs.map(job => {
      const matchScore = this.calculateMatchScore(job, criteria);
      const matchReasons = this.getMatchReasons(job, criteria);
      
      return {
        ...job,
        matchScore,
        matchReasons
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  /**
   * Calculate match score for a job
   */
  private calculateMatchScore(job: JobListing, criteria: SearchCriteria): number {
    let score = 0;
    let totalWeight = 0;

    // Title match (30% weight)
    const titleMatch = this.calculateKeywordMatch(job.title, criteria.keywords);
    score += titleMatch * 0.3;
    totalWeight += 0.3;

    // Skills match (25% weight)
    const skillsMatch = this.calculateSkillsMatch(job.skills, criteria.skills || []);
    score += skillsMatch * 0.25;
    totalWeight += 0.25;

    // Location match (15% weight)
    const locationMatch = this.calculateLocationMatch(job.location, criteria.location);
    score += locationMatch * 0.15;
    totalWeight += 0.15;

    // Experience level match (15% weight)
    const experienceMatch = this.calculateExperienceMatch(job.experienceLevel, criteria.experienceLevels || []);
    score += experienceMatch * 0.15;
    totalWeight += 0.15;

    // Job type match (10% weight)
    const jobTypeMatch = this.calculateJobTypeMatch(job.jobType, criteria.jobTypes || []);
    score += jobTypeMatch * 0.1;
    totalWeight += 0.1;

    // Industry match (5% weight)
    const industryMatch = this.calculateIndustryMatch(job.industry, criteria.industries || []);
    score += industryMatch * 0.05;
    totalWeight += 0.05;

    return Math.round((score / totalWeight) * 100);
  }

  /**
   * Get match reasons for a job
   */
  private getMatchReasons(job: JobListing, criteria: SearchCriteria): string[] {
    const reasons: string[] = [];

    // Check title match
    const titleKeywords = criteria.keywords.filter(keyword => 
      job.title.toLowerCase().includes(keyword.toLowerCase())
    );
    if (titleKeywords.length > 0) {
      reasons.push(`Title contains: ${titleKeywords.join(', ')}`);
    }

    // Check skills match
    const matchingSkills = job.skills.filter(skill => 
      criteria.skills?.some(criteriaSkill => 
        skill.toLowerCase().includes(criteriaSkill.toLowerCase())
      )
    );
    if (matchingSkills.length > 0) {
      reasons.push(`Skills match: ${matchingSkills.join(', ')}`);
    }

    // Check location match
    if (criteria.location && job.location.toLowerCase().includes(criteria.location.toLowerCase())) {
      reasons.push(`Location match: ${criteria.location}`);
    }

    // Check experience match
    if (criteria.experienceLevels?.includes(job.experienceLevel)) {
      reasons.push(`Experience level match: ${job.experienceLevel}`);
    }

    return reasons;
  }

  /**
   * Calculate statistics from job results
   */
  private calculateStatistics(jobs: JobListing[]): SearchStatistics {
    const salaries = jobs.filter(job => job.salaryRange).map(job => 
      (job.salaryRange!.min + job.salaryRange!.max) / 2
    );
    
    const averageSalary = salaries.length > 0 
      ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length 
      : 0;

    const companyCounts = new Map<string, number>();
    const skillCounts = new Map<string, number>();
    const locationCounts = new Map<string, number>();
    const experienceCounts = new Map<string, number>();
    const industryCounts = new Map<string, number>();

    jobs.forEach(job => {
      // Count companies
      companyCounts.set(job.company, (companyCounts.get(job.company) || 0) + 1);
      
      // Count skills
      job.skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
      
      // Count locations
      locationCounts.set(job.location, (locationCounts.get(job.location) || 0) + 1);
      
      // Count experience levels
      experienceCounts.set(job.experienceLevel, (experienceCounts.get(job.experienceLevel) || 0) + 1);
      
      // Count industries
      industryCounts.set(job.industry, (industryCounts.get(job.industry) || 0) + 1);
    });

    return {
      averageSalary,
      topCompanies: Array.from(companyCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
      topSkills: Array.from(skillCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([skill, count]) => ({ skill, count })),
      topLocations: Array.from(locationCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([location, count]) => ({ location, count })),
      experienceDistribution: Array.from(experienceCounts.entries())
        .map(([level, count]) => ({ level, count })),
      industryDistribution: Array.from(industryCounts.entries())
        .map(([industry, count]) => ({ industry, count }))
    };
  }

  /**
   * Initialize job portals configuration
   */
  private initializeJobPortals(): JobPortal[] {
    return [
      {
        name: 'Indeed',
        baseUrl: 'https://indeed.com',
        apiEndpoint: 'https://api.indeed.com',
        searchEndpoint: 'https://api.indeed.com/v1/jobs',
        jobDetailsEndpoint: 'https://api.indeed.com/v1/jobs/{id}',
        applyEndpoint: 'https://indeed.com/viewjob?jk={id}',
        rateLimit: 100 // requests per hour
      },
      {
        name: 'LinkedIn',
        baseUrl: 'https://linkedin.com',
        apiEndpoint: 'https://api.linkedin.com',
        searchEndpoint: 'https://api.linkedin.com/v2/jobSearch',
        jobDetailsEndpoint: 'https://api.linkedin.com/v2/jobs/{id}',
        applyEndpoint: 'https://linkedin.com/jobs/view/{id}',
        rateLimit: 50
      },
      {
        name: 'Glassdoor',
        baseUrl: 'https://glassdoor.com',
        apiEndpoint: 'https://api.glassdoor.com',
        searchEndpoint: 'https://api.glassdoor.com/api/api.htm',
        jobDetailsEndpoint: 'https://api.glassdoor.com/api/api.htm',
        applyEndpoint: 'https://glassdoor.com/job-listing/{id}',
        rateLimit: 75
      },
      {
        name: 'Naukri',
        baseUrl: 'https://naukri.com',
        apiEndpoint: 'https://api.naukri.com',
        searchEndpoint: 'https://api.naukri.com/v1/jobs',
        jobDetailsEndpoint: 'https://api.naukri.com/v1/jobs/{id}',
        applyEndpoint: 'https://naukri.com/job-listings/{id}',
        rateLimit: 60
      },
      {
        name: 'Monster',
        baseUrl: 'https://monster.com',
        apiEndpoint: 'https://api.monster.com',
        searchEndpoint: 'https://api.monster.com/v1/jobs',
        jobDetailsEndpoint: 'https://api.monster.com/v1/jobs/{id}',
        applyEndpoint: 'https://monster.com/jobs/{id}',
        rateLimit: 80
      }
    ];
  }

  /**
   * Check if portal can be searched (rate limiting)
   */
  private canSearchPortal(portal: JobPortal): boolean {
    const lastSearch = this.rateLimiters.get(portal.name) || 0;
    const timeSinceLastSearch = Date.now() - lastSearch;
    const minInterval = (60 * 60 * 1000) / portal.rateLimit; // Convert to milliseconds
    
    return timeSinceLastSearch >= minInterval;
  }

  /**
   * Update rate limiter for portal
   */
  private updateRateLimiter(portal: JobPortal): void {
    this.rateLimiters.set(portal.name, Date.now());
  }

  /**
   * Cache search results
   */
  private cacheResults(portalName: string, criteria: SearchCriteria, jobs: JobListing[]): void {
    const cacheKey = `${portalName}-${JSON.stringify(criteria)}`;
    this.cache.set(cacheKey, jobs);
  }

  // Portal-specific query builders
  private buildIndeedQuery(criteria: SearchCriteria): any {
    return {
      q: criteria.keywords.join(' '),
      l: criteria.location,
      radius: 25,
      sort: 'date',
      limit: 50
    };
  }

  private buildLinkedInQuery(criteria: SearchCriteria): any {
    return {
      keywords: criteria.keywords,
      location: criteria.location,
      experience: criteria.experienceLevels,
      jobType: criteria.jobTypes,
      count: 50
    };
  }

  private buildGlassdoorQuery(criteria: SearchCriteria): any {
    return {
      action: 'jobs',
      q: criteria.keywords.join(' '),
      l: criteria.location,
      limit: 50
    };
  }

  private buildNaukriQuery(criteria: SearchCriteria): any {
    return {
      keyword: criteria.keywords.join(' '),
      location: criteria.location,
      experience: criteria.experienceLevels,
      limit: 50
    };
  }

  private buildMonsterQuery(criteria: SearchCriteria): any {
    return {
      q: criteria.keywords.join(' '),
      where: criteria.location,
      limit: 50
    };
  }

  private buildGenericQuery(criteria: SearchCriteria): any {
    return {
      keywords: criteria.keywords,
      location: criteria.location,
      salary: criteria.salaryRange,
      jobType: criteria.jobTypes,
      experience: criteria.experienceLevels,
      industry: criteria.industries,
      skills: criteria.skills,
      remote: criteria.remote
    };
  }

  // Portal-specific response parsers
  private parseIndeedResponse(response: any): JobListing[] {
    // Parse Indeed API response format
    return [];
  }

  private parseLinkedInResponse(response: any): JobListing[] {
    // Parse LinkedIn API response format
    return [];
  }

  private parseGlassdoorResponse(response: any): JobListing[] {
    // Parse Glassdoor API response format
    return [];
  }

  private parseNaukriResponse(response: any): JobListing[] {
    // Parse Naukri API response format
    return [];
  }

  private parseMonsterResponse(response: any): JobListing[] {
    // Parse Monster API response format
    return [];
  }

  private parseGenericResponse(response: any): JobListing[] {
    // Parse generic response format
    return [];
  }

  // Match calculation helpers
  private calculateKeywordMatch(text: string, keywords: string[]): number {
    const textLower = text.toLowerCase();
    const matches = keywords.filter(keyword => textLower.includes(keyword.toLowerCase()));
    return matches.length / keywords.length;
  }

  private calculateSkillsMatch(jobSkills: string[], criteriaSkills: string[]): number {
    if (criteriaSkills.length === 0) return 1;
    const matches = jobSkills.filter(skill => 
      criteriaSkills.some(criteriaSkill => 
        skill.toLowerCase().includes(criteriaSkill.toLowerCase())
      )
    );
    return matches.length / criteriaSkills.length;
  }

  private calculateLocationMatch(jobLocation: string, criteriaLocation?: string): number {
    if (!criteriaLocation) return 1;
    return jobLocation.toLowerCase().includes(criteriaLocation.toLowerCase()) ? 1 : 0;
  }

  private calculateExperienceMatch(jobExperience: string, criteriaExperience: string[]): number {
    if (criteriaExperience.length === 0) return 1;
    return criteriaExperience.includes(jobExperience) ? 1 : 0;
  }

  private calculateJobTypeMatch(jobType: string, criteriaJobTypes: string[]): number {
    if (criteriaJobTypes.length === 0) return 1;
    return criteriaJobTypes.includes(jobType) ? 1 : 0;
  }

  private calculateIndustryMatch(jobIndustry: string, criteriaIndustries: string[]): number {
    if (criteriaIndustries.length === 0) return 1;
    return criteriaIndustries.includes(jobIndustry) ? 1 : 0;
  }
}

export const jobAggregator = new JobAggregator();
















