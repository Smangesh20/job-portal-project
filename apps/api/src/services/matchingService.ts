import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';
import { CacheService } from '@/utils/redis';
import { NotFoundError, ValidationError } from '@ask-ya-cham/types';

export class MatchingService {
  private prisma: PrismaClient;
  private cacheService: CacheService;

  constructor() {
    this.prisma = new PrismaClient();
    this.cacheService = new CacheService();
  }

  /**
   * Get recommended jobs for user using AI matching
   */
  async getRecommendedJobs(userId: string, limit: number = 10): Promise<any> {
    try {
      // Check cache first
      const cacheKey = `recommendations:${userId}:${limit}`;
      const cachedRecommendations = await this.cacheService.get(cacheKey);
      
      if (cachedRecommendations) {
        return JSON.parse(cachedRecommendations);
      }

      // Get user profile and preferences
      const user = await this.getUserProfile(userId);
      if (!user) {
        throw new NotFoundError('User profile not found');
      }

      // Get user's application history for learning
      const applicationHistory = await this.getUserApplicationHistory(userId);

      // Get jobs that match user criteria
      const matchingJobs = await this.findMatchingJobs(user, limit * 2); // Get more to filter

      // Calculate match scores using AI algorithms
      const jobsWithScores = await this.calculateMatchScores(matchingJobs, user, applicationHistory);

      // Sort by match score and take top results
      const recommendations = jobsWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      // Store recommendations in cache for 1 hour
      await this.cacheService.set(cacheKey, JSON.stringify(recommendations), 3600);

      // Store match results in database for analytics
      await this.storeMatchResults(userId, recommendations);

      return recommendations;
    } catch (error) {
      logger.error('Error getting recommended jobs:', error);
      throw error;
    }
  }

  /**
   * Search jobs with AI matching
   */
  async searchJobsWithAI(userId: string, query: string, filters: any, limit: number): Promise<any> {
    try {
      // Get user profile
      const user = await this.getUserProfile(userId);
      if (!user) {
        throw new NotFoundError('User profile not found');
      }

      // Perform semantic search on job descriptions
      const searchResults = await this.semanticJobSearch(query, filters, limit * 2);

      // Calculate AI match scores
      const jobsWithScores = await this.calculateMatchScores(searchResults, user);

      // Sort by relevance and match score
      const sortedJobs = jobsWithScores.sort((a, b) => {
        const relevanceScore = (b.relevanceScore || 0) + (b.matchScore || 0);
        const aRelevanceScore = (a.relevanceScore || 0) + (a.matchScore || 0);
        return relevanceScore - aRelevanceScore;
      });

      return sortedJobs.slice(0, limit);
    } catch (error) {
      logger.error('Error searching jobs with AI:', error);
      throw error;
    }
  }

  /**
   * Calculate match score between user and job
   */
  async calculateMatchScores(jobs: any[], user: any, applicationHistory?: any[]): Promise<any[]> {
    try {
      const jobsWithScores = await Promise.all(
        jobs.map(async (job) => {
          const scores = await this.calculateDetailedMatchScore(job, user, applicationHistory);
          
          return {
            ...job,
            matchScore: scores.overall,
            skillMatch: scores.skillMatch,
            experienceMatch: scores.experienceMatch,
            locationMatch: scores.locationMatch,
            salaryMatch: scores.salaryMatch,
            culturalFit: scores.culturalFit,
            matchBreakdown: scores.breakdown
          };
        })
      );

      return jobsWithScores;
    } catch (error) {
      logger.error('Error calculating match scores:', error);
      throw error;
    }
  }

  /**
   * Calculate detailed match score with breakdown
   */
  private async calculateDetailedMatchScore(job: any, user: any, applicationHistory?: any[]): Promise<any> {
    try {
      const scores = {
        skillMatch: 0,
        experienceMatch: 0,
        locationMatch: 0,
        salaryMatch: 0,
        culturalFit: 0,
        overall: 0,
        breakdown: {}
      };

      // Skill matching (40% weight)
      scores.skillMatch = this.calculateSkillMatch(job.requiredSkills || [], user.skills || []);
      scores.breakdown.skills = {
        score: scores.skillMatch,
        weight: 0.4,
        details: this.getSkillMatchDetails(job.requiredSkills || [], user.skills || [])
      };

      // Experience matching (25% weight)
      scores.experienceMatch = this.calculateExperienceMatch(job.experienceLevel, user.experience);
      scores.breakdown.experience = {
        score: scores.experienceMatch,
        weight: 0.25,
        details: this.getExperienceMatchDetails(job.experienceLevel, user.experience)
      };

      // Location matching (15% weight)
      scores.locationMatch = this.calculateLocationMatch(job.location, job.isRemote, user.preferredLocation, user.isRemotePreferred);
      scores.breakdown.location = {
        score: scores.locationMatch,
        weight: 0.15,
        details: this.getLocationMatchDetails(job.location, job.isRemote, user.preferredLocation, user.isRemotePreferred)
      };

      // Salary matching (10% weight)
      scores.salaryMatch = this.calculateSalaryMatch(job.salary, user.expectedSalary);
      scores.breakdown.salary = {
        score: scores.salaryMatch,
        weight: 0.1,
        details: this.getSalaryMatchDetails(job.salary, user.expectedSalary)
      };

      // Cultural fit (10% weight)
      scores.culturalFit = await this.calculateCulturalFit(job, user, applicationHistory);
      scores.breakdown.culturalFit = {
        score: scores.culturalFit,
        weight: 0.1,
        details: this.getCulturalFitDetails(job, user)
      };

      // Calculate overall weighted score
      scores.overall = 
        (scores.skillMatch * 0.4) +
        (scores.experienceMatch * 0.25) +
        (scores.locationMatch * 0.15) +
        (scores.salaryMatch * 0.1) +
        (scores.culturalFit * 0.1);

      return scores;
    } catch (error) {
      logger.error('Error calculating detailed match score:', error);
      return {
        skillMatch: 0,
        experienceMatch: 0,
        locationMatch: 0,
        salaryMatch: 0,
        culturalFit: 0,
        overall: 0,
        breakdown: {}
      };
    }
  }

  /**
   * Calculate skill match score
   */
  private calculateSkillMatch(requiredSkills: string[], userSkills: string[]): number {
    if (!requiredSkills.length) return 100;
    if (!userSkills.length) return 0;

    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    const requiredSkillsLower = requiredSkills.map(skill => skill.toLowerCase());

    // Exact matches
    const exactMatches = requiredSkillsLower.filter(skill => 
      userSkillsLower.includes(skill)
    ).length;

    // Partial matches (semantic similarity)
    const partialMatches = requiredSkillsLower.filter(requiredSkill => 
      userSkillsLower.some(userSkill => 
        this.calculateSemanticSimilarity(requiredSkill, userSkill) > 0.7
      )
    ).length;

    const totalMatches = exactMatches + (partialMatches * 0.5);
    return Math.round((totalMatches / requiredSkills.length) * 100);
  }

  /**
   * Calculate experience match score
   */
  private calculateExperienceMatch(jobExperienceLevel: string, userExperience: number): number {
    const experienceMapping = {
      'ENTRY': { min: 0, max: 2 },
      'JUNIOR': { min: 1, max: 4 },
      'MID': { min: 3, max: 7 },
      'SENIOR': { min: 5, max: 10 },
      'LEAD': { min: 7, max: 15 },
      'EXECUTIVE': { min: 10, max: 20 }
    };

    const jobLevel = experienceMapping[jobExperienceLevel as keyof typeof experienceMapping];
    if (!jobLevel) return 50;

    if (userExperience >= jobLevel.min && userExperience <= jobLevel.max) {
      return 100;
    } else if (userExperience < jobLevel.min) {
      const shortage = jobLevel.min - userExperience;
      return Math.max(0, 100 - (shortage * 20));
    } else {
      const excess = userExperience - jobLevel.max;
      return Math.max(50, 100 - (excess * 10));
    }
  }

  /**
   * Calculate location match score
   */
  private calculateLocationMatch(jobLocation: string, jobIsRemote: boolean, userPreferredLocation?: string, userPrefersRemote?: boolean): number {
    // Remote work preference
    if (jobIsRemote && userPrefersRemote) return 100;
    if (!jobIsRemote && !userPrefersRemote) return 80;

    // Location matching
    if (!userPreferredLocation || !jobLocation) return 50;

    const jobLocationLower = jobLocation.toLowerCase();
    const userLocationLower = userPreferredLocation.toLowerCase();

    // Exact city match
    if (jobLocationLower.includes(userLocationLower) || userLocationLower.includes(jobLocationLower)) {
      return 100;
    }

    // Same country/region match
    const jobCountry = this.extractCountry(jobLocationLower);
    const userCountry = this.extractCountry(userLocationLower);
    
    if (jobCountry && userCountry && jobCountry === userCountry) {
      return 70;
    }

    return 30;
  }

  /**
   * Calculate salary match score
   */
  private calculateSalaryMatch(jobSalary: number, userExpectedSalary?: number): number {
    if (!jobSalary || !userExpectedSalary) return 50;

    const salaryRatio = userExpectedSalary / jobSalary;

    if (salaryRatio >= 0.9 && salaryRatio <= 1.1) {
      return 100; // Perfect match
    } else if (salaryRatio >= 0.8 && salaryRatio <= 1.2) {
      return 80; // Good match
    } else if (salaryRatio >= 0.7 && salaryRatio <= 1.3) {
      return 60; // Acceptable match
    } else {
      return Math.max(0, 100 - Math.abs(salaryRatio - 1) * 50);
    }
  }

  /**
   * Calculate cultural fit score
   */
  private async calculateCulturalFit(job: any, user: any, applicationHistory?: any[]): Promise<number> {
    try {
      // This would integrate with NLP services for cultural analysis
      // For now, we'll use a simplified approach based on job type and user preferences
      
      let culturalScore = 50; // Base score

      // Job type preference matching
      if (user.preferredJobTypes && user.preferredJobTypes.includes(job.jobType)) {
        culturalScore += 20;
      }

      // Company size preference
      if (user.preferredCompanySize && this.matchesCompanySize(job.companySize, user.preferredCompanySize)) {
        culturalScore += 15;
      }

      // Industry preference
      if (user.preferredIndustries && user.preferredIndustries.includes(job.industry)) {
        culturalScore += 15;
      }

      return Math.min(100, culturalScore);
    } catch (error) {
      logger.error('Error calculating cultural fit:', error);
      return 50;
    }
  }

  /**
   * Semantic job search using NLP
   */
  private async semanticJobSearch(query: string, filters: any, limit: number): Promise<any[]> {
    try {
      // This would integrate with semantic search services
      // For now, we'll use traditional search with enhanced scoring
      
      const where: any = {
        status: 'ACTIVE',
        isDeleted: false
      };

      // Add filters
      if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
      if (filters.jobType) where.jobType = filters.jobType;
      if (filters.experienceLevel) where.experienceLevel = filters.experienceLevel;
      if (filters.category) where.category = filters.category;

      const jobs = await this.prisma.job.findMany({
        where,
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          },
          _count: {
            select: {
              applications: true,
              savedJobs: true
            }
          }
        },
        take: limit * 2
      });

      // Calculate relevance scores based on semantic similarity
      const jobsWithRelevance = jobs.map(job => ({
        ...job,
        relevanceScore: this.calculateRelevanceScore(job, query)
      }));

      return jobsWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      logger.error('Error in semantic job search:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score for search query
   */
  private calculateRelevanceScore(job: any, query: string): number {
    const queryLower = query.toLowerCase();
    const jobText = `${job.title} ${job.description} ${job.company} ${job.requiredSkills?.join(' ')}`.toLowerCase();

    let score = 0;

    // Title matches (highest weight)
    if (job.title.toLowerCase().includes(queryLower)) score += 40;
    
    // Company matches
    if (job.company.toLowerCase().includes(queryLower)) score += 20;
    
    // Description matches
    const descriptionMatches = (job.description.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
    score += descriptionMatches * 5;

    // Skills matches
    if (job.requiredSkills) {
      const skillMatches = job.requiredSkills.filter((skill: string) => 
        skill.toLowerCase().includes(queryLower)
      ).length;
      score += skillMatches * 10;
    }

    return Math.min(100, score);
  }

  /**
   * Get user profile for matching
   */
  private async getUserProfile(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          preferences: true
        }
      });

      return user;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Get user's application history for learning
   */
  private async getUserApplicationHistory(userId: string): Promise<any[]> {
    try {
      const applications = await this.prisma.application.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              category: true,
              jobType: true,
              requiredSkills: true,
              salary: true,
              company: true
            }
          }
        },
        orderBy: { appliedAt: 'desc' },
        take: 20
      });

      return applications;
    } catch (error) {
      logger.error('Error getting user application history:', error);
      return [];
    }
  }

  /**
   * Find jobs that match user criteria
   */
  private async findMatchingJobs(user: any, limit: number): Promise<any[]> {
    try {
      const where: any = {
        status: 'ACTIVE',
        isDeleted: false
      };

      // Add user preferences to search criteria
      if (user.preferences?.preferredLocation) {
        where.OR = [
          { location: { contains: user.preferences.preferredLocation, mode: 'insensitive' } },
          { isRemote: true }
        ];
      }

      if (user.preferences?.preferredJobTypes?.length) {
        where.jobType = { in: user.preferences.preferredJobTypes };
      }

      if (user.preferences?.minSalary) {
        where.salary = { gte: user.preferences.minSalary };
      }

      const jobs = await this.prisma.job.findMany({
        where,
        include: {
          employer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              company: true
            }
          },
          _count: {
            select: {
              applications: true,
              savedJobs: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return jobs;
    } catch (error) {
      logger.error('Error finding matching jobs:', error);
      return [];
    }
  }

  /**
   * Store match results for analytics
   */
  private async storeMatchResults(userId: string, recommendations: any[]): Promise<void> {
    try {
      const matchRecords = recommendations.map(job => ({
        userId,
        jobId: job.id,
        matchScore: job.matchScore,
        skillMatch: job.skillMatch,
        experienceMatch: job.experienceMatch,
        locationMatch: job.locationMatch,
        salaryMatch: job.salaryMatch,
        culturalFit: job.culturalFit
      }));

      await this.prisma.jobMatch.createMany({
        data: matchRecords,
        skipDuplicates: true
      });
    } catch (error) {
      logger.error('Error storing match results:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Helper methods for match calculations
   */
  private calculateSemanticSimilarity(text1: string, text2: string): number {
    // Simplified semantic similarity calculation
    // In production, this would use NLP services like OpenAI embeddings
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  private extractCountry(location: string): string | null {
    const countries = ['usa', 'united states', 'canada', 'uk', 'united kingdom', 'germany', 'france', 'australia'];
    for (const country of countries) {
      if (location.includes(country)) {
        return country;
      }
    }
    return null;
  }

  private matchesCompanySize(jobCompanySize: string, userPreferredSize: string): boolean {
    const sizeMapping = {
      'STARTUP': ['STARTUP', 'SMALL'],
      'SMALL': ['STARTUP', 'SMALL', 'MEDIUM'],
      'MEDIUM': ['SMALL', 'MEDIUM', 'LARGE'],
      'LARGE': ['MEDIUM', 'LARGE', 'ENTERPRISE'],
      'ENTERPRISE': ['LARGE', 'ENTERPRISE']
    };

    return sizeMapping[jobCompanySize as keyof typeof sizeMapping]?.includes(userPreferredSize) || false;
  }

  private getSkillMatchDetails(requiredSkills: string[], userSkills: string[]): any {
    const matched = requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const missing = requiredSkills.filter(skill => !matched.includes(skill));
    const extra = userSkills.filter(skill => 
      !requiredSkills.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );

    return { matched, missing, extra };
  }

  private getExperienceMatchDetails(jobExperienceLevel: string, userExperience: number): any {
    return {
      jobLevel: jobExperienceLevel,
      userExperience,
      match: this.calculateExperienceMatch(jobExperienceLevel, userExperience)
    };
  }

  private getLocationMatchDetails(jobLocation: string, jobIsRemote: boolean, userPreferredLocation?: string, userPrefersRemote?: boolean): any {
    return {
      jobLocation,
      jobIsRemote,
      userPreferredLocation,
      userPrefersRemote,
      match: this.calculateLocationMatch(jobLocation, jobIsRemote, userPreferredLocation, userPrefersRemote)
    };
  }

  private getSalaryMatchDetails(jobSalary: number, userExpectedSalary?: number): any {
    return {
      jobSalary,
      userExpectedSalary,
      match: this.calculateSalaryMatch(jobSalary, userExpectedSalary)
    };
  }

  private getCulturalFitDetails(job: any, user: any): any {
    return {
      jobType: job.jobType,
      userPreferredJobTypes: user.preferredJobTypes,
      companySize: job.companySize,
      userPreferredCompanySize: user.preferredCompanySize
    };
  }
}
