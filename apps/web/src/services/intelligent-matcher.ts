/**
 * Intelligent Job Matching Engine
 * Advanced AI-powered matching between resume data and job listings
 */

import { ResumeData, Skill, WorkExperience } from './resume-parser';
import { JobListing, SearchCriteria, SearchResults } from './job-aggregator';

export interface MatchResult {
  job: JobListing;
  overallScore: number;
  breakdown: MatchBreakdown;
  reasoning: string[];
  recommendations: string[];
  riskFactors: string[];
  growthPotential: number;
  culturalFit: number;
  salaryMatch: number;
  locationMatch: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  projectMatch: number;
  certificationMatch: number;
}

export interface MatchBreakdown {
  skills: {
    score: number;
    matched: string[];
    missing: string[];
    extra: string[];
  };
  experience: {
    score: number;
    yearsMatch: boolean;
    levelMatch: boolean;
    industryMatch: boolean;
    roleMatch: boolean;
  };
  education: {
    score: number;
    degreeMatch: boolean;
    fieldMatch: boolean;
    institutionMatch: boolean;
  };
  location: {
    score: number;
    exactMatch: boolean;
    remoteMatch: boolean;
    commuteScore: number;
  };
  salary: {
    score: number;
    expectationMatch: boolean;
    marketRate: boolean;
    negotiationRoom: number;
  };
  culture: {
    score: number;
    workStyleMatch: boolean;
    valuesMatch: boolean;
    teamSizeMatch: boolean;
  };
}

export interface MatchingWeights {
  skills: number;
  experience: number;
  education: number;
  location: number;
  salary: number;
  culture: number;
  projects: number;
  certifications: number;
}

export interface MatchingConfig {
  weights: MatchingWeights;
  thresholds: {
    exactMatch: number;
    goodMatch: number;
    partialMatch: number;
  };
  boostFactors: {
    exactSkillMatch: number;
    industryExperience: number;
    educationMatch: number;
    locationMatch: number;
  };
}

export class IntelligentMatcher {
  private config: MatchingConfig;
  private skillSimilarityMap: Map<string, string[]>;
  private industryMapping: Map<string, string[]>;
  private roleMapping: Map<string, string[]>;

  constructor() {
    this.config = this.getDefaultConfig();
    this.initializeSkillSimilarityMap();
    this.initializeIndustryMapping();
    this.initializeRoleMapping();
  }

  /**
   * Match resume data against job listings
   */
  async matchResumeToJobs(resumeData: ResumeData, searchResults: SearchResults): Promise<MatchResult[]> {
    const matchResults: MatchResult[] = [];

    for (const job of searchResults.jobs) {
      const matchResult = await this.calculateMatch(resumeData, job);
      matchResults.push(matchResult);
    }

    // Sort by overall score
    return matchResults.sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Calculate detailed match between resume and job
   */
  private async calculateMatch(resumeData: ResumeData, job: JobListing): Promise<MatchResult> {
    const breakdown = this.calculateMatchBreakdown(resumeData, job);
    const overallScore = this.calculateOverallScore(breakdown);
    const reasoning = this.generateReasoning(resumeData, job, breakdown);
    const recommendations = this.generateRecommendations(resumeData, job, breakdown);
    const riskFactors = this.identifyRiskFactors(resumeData, job, breakdown);

    return {
      job,
      overallScore,
      breakdown,
      reasoning,
      recommendations,
      riskFactors,
      growthPotential: this.calculateGrowthPotential(resumeData, job),
      culturalFit: breakdown.culture.score,
      salaryMatch: breakdown.salary.score,
      locationMatch: breakdown.location.score,
      skillMatch: breakdown.skills.score,
      experienceMatch: breakdown.experience.score,
      educationMatch: breakdown.education.score,
      projectMatch: this.calculateProjectMatch(resumeData, job),
      certificationMatch: this.calculateCertificationMatch(resumeData, job)
    };
  }

  /**
   * Calculate detailed match breakdown
   */
  private calculateMatchBreakdown(resumeData: ResumeData, job: JobListing): MatchBreakdown {
    return {
      skills: this.calculateSkillsMatch(resumeData.skills, job.skills),
      experience: this.calculateExperienceMatch(resumeData.experience, job),
      education: this.calculateEducationMatch(resumeData.education, job),
      location: this.calculateLocationMatch(resumeData.personalInfo.location, job),
      salary: this.calculateSalaryMatch(resumeData.salaryExpectation, job.salaryRange),
      culture: this.calculateCultureMatch(resumeData, job)
    };
  }

  /**
   * Calculate skills match with advanced similarity
   */
  private calculateSkillsMatch(resumeSkills: Skill[], jobSkills: string[]): MatchBreakdown['skills'] {
    const resumeSkillNames = resumeSkills.map(s => s.name.toLowerCase());
    const jobSkillNames = jobSkills.map(s => s.toLowerCase());

    const exactMatches: string[] = [];
    const similarMatches: string[] = [];
    const missingSkills: string[] = [];
    const extraSkills: string[] = [];

    // Find exact matches
    jobSkillNames.forEach(jobSkill => {
      if (resumeSkillNames.includes(jobSkill)) {
        exactMatches.push(jobSkill);
      } else {
        // Check for similar skills
        const similarSkill = this.findSimilarSkill(jobSkill, resumeSkillNames);
        if (similarSkill) {
          similarMatches.push(jobSkill);
        } else {
          missingSkills.push(jobSkill);
        }
      }
    });

    // Find extra skills in resume
    resumeSkillNames.forEach(resumeSkill => {
      if (!jobSkillNames.includes(resumeSkill) && 
          !jobSkillNames.some(jobSkill => this.findSimilarSkill(resumeSkill, [jobSkill]))) {
        extraSkills.push(resumeSkill);
      }
    });

    const exactScore = exactMatches.length / jobSkillNames.length;
    const similarScore = similarMatches.length / jobSkillNames.length * 0.7;
    const totalScore = Math.min(exactScore + similarScore, 1);

    return {
      score: totalScore,
      matched: [...exactMatches, ...similarMatches],
      missing: missingSkills,
      extra: extraSkills
    };
  }

  /**
   * Calculate experience match
   */
  private calculateExperienceMatch(resumeExperience: WorkExperience[], job: JobListing): MatchBreakdown['experience'] {
    const totalYears = resumeExperience.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);

    // Experience level mapping
    const experienceLevels = {
      'entry': { min: 0, max: 2 },
      'junior': { min: 1, max: 3 },
      'mid': { min: 3, max: 7 },
      'senior': { min: 5, max: 10 },
      'lead': { min: 8, max: 15 },
      'executive': { min: 10, max: 20 }
    };

    const jobLevel = experienceLevels[job.experienceLevel as keyof typeof experienceLevels];
    const yearsMatch = jobLevel ? totalYears >= jobLevel.min && totalYears <= jobLevel.max : false;
    const levelMatch = this.calculateExperienceLevelMatch(resumeExperience, job.experienceLevel);
    const industryMatch = this.calculateIndustryMatch(resumeExperience, job.industry);
    const roleMatch = this.calculateRoleMatch(resumeExperience, job.title);

    const score = (
      (yearsMatch ? 0.3 : 0) +
      (levelMatch ? 0.3 : 0) +
      (industryMatch ? 0.2 : 0) +
      (roleMatch ? 0.2 : 0)
    );

    return {
      score,
      yearsMatch,
      levelMatch,
      industryMatch,
      roleMatch
    };
  }

  /**
   * Calculate education match
   */
  private calculateEducationMatch(resumeEducation: any[], job: JobListing): MatchBreakdown['education'] {
    if (resumeEducation.length === 0) {
      return {
        score: 0.5, // Neutral score if no education data
        degreeMatch: false,
        fieldMatch: false,
        institutionMatch: false
      };
    }

    const highestEducation = resumeEducation[0]; // Assuming sorted by importance
    const degreeMatch = this.calculateDegreeMatch(highestEducation, job);
    const fieldMatch = this.calculateFieldMatch(highestEducation, job);
    const institutionMatch = this.calculateInstitutionMatch(highestEducation, job);

    const score = (
      (degreeMatch ? 0.4 : 0) +
      (fieldMatch ? 0.4 : 0) +
      (institutionMatch ? 0.2 : 0)
    );

    return {
      score,
      degreeMatch,
      fieldMatch,
      institutionMatch
    };
  }

  /**
   * Calculate location match
   */
  private calculateLocationMatch(resumeLocation: string, job: JobListing): MatchBreakdown['location'] {
    const resumeLocationLower = resumeLocation.toLowerCase();
    const jobLocationLower = job.location.toLowerCase();

    const exactMatch = resumeLocationLower === jobLocationLower ||
                      resumeLocationLower.includes(jobLocationLower) ||
                      jobLocationLower.includes(resumeLocationLower);

    const remoteMatch = job.remoteOption && this.isRemoteFriendly(resumeLocation);

    const commuteScore = this.calculateCommuteScore(resumeLocation, job.location);

    const score = exactMatch ? 1 : (remoteMatch ? 0.8 : commuteScore);

    return {
      score,
      exactMatch,
      remoteMatch,
      commuteScore
    };
  }

  /**
   * Calculate salary match
   */
  private calculateSalaryMatch(resumeSalary?: any, jobSalary?: any): MatchBreakdown['salary'] {
    if (!resumeSalary || !jobSalary) {
      return {
        score: 0.5, // Neutral score if no salary data
        expectationMatch: false,
        marketRate: false,
        negotiationRoom: 0
      };
    }

    const resumeMid = (resumeSalary.min + resumeSalary.max) / 2;
    const jobMid = (jobSalary.min + jobSalary.max) / 2;

    const expectationMatch = resumeMid >= jobSalary.min && resumeMid <= jobSalary.max;
    const marketRate = this.isMarketRate(jobMid, resumeSalary);
    const negotiationRoom = this.calculateNegotiationRoom(resumeSalary, jobSalary);

    const score = expectationMatch ? 1 : (marketRate ? 0.7 : 0.3);

    return {
      score,
      expectationMatch,
      marketRate,
      negotiationRoom
    };
  }

  /**
   * Calculate culture match
   */
  private calculateCultureMatch(resumeData: ResumeData, job: JobListing): MatchBreakdown['culture'] {
    const workStyleMatch = this.calculateWorkStyleMatch(resumeData, job);
    const valuesMatch = this.calculateValuesMatch(resumeData, job);
    const teamSizeMatch = this.calculateTeamSizeMatch(resumeData, job);

    const score = (
      (workStyleMatch ? 0.4 : 0) +
      (valuesMatch ? 0.4 : 0) +
      (teamSizeMatch ? 0.2 : 0)
    );

    return {
      score,
      workStyleMatch,
      valuesMatch,
      teamSizeMatch
    };
  }

  /**
   * Calculate overall match score
   */
  private calculateOverallScore(breakdown: MatchBreakdown): number {
    const weights = this.config.weights;
    
    return Math.round((
      breakdown.skills.score * weights.skills +
      breakdown.experience.score * weights.experience +
      breakdown.education.score * weights.education +
      breakdown.location.score * weights.location +
      breakdown.salary.score * weights.salary +
      breakdown.culture.score * weights.culture
    ) * 100);
  }

  /**
   * Generate reasoning for match
   */
  private generateReasoning(resumeData: ResumeData, job: JobListing, breakdown: MatchBreakdown): string[] {
    const reasoning: string[] = [];

    // Skills reasoning
    if (breakdown.skills.score > 0.8) {
      reasoning.push(`Excellent skills match: ${breakdown.skills.matched.length} out of ${job.skills.length} required skills`);
    } else if (breakdown.skills.score > 0.5) {
      reasoning.push(`Good skills match: ${breakdown.skills.matched.length} out of ${job.skills.length} required skills`);
    } else {
      reasoning.push(`Limited skills match: ${breakdown.skills.matched.length} out of ${job.skills.length} required skills`);
    }

    // Experience reasoning
    if (breakdown.experience.score > 0.8) {
      reasoning.push('Strong experience alignment with role requirements');
    } else if (breakdown.experience.score > 0.5) {
      reasoning.push('Moderate experience alignment with some gaps');
    } else {
      reasoning.push('Limited experience alignment - may require additional training');
    }

    // Location reasoning
    if (breakdown.location.exactMatch) {
      reasoning.push('Perfect location match');
    } else if (breakdown.location.remoteMatch) {
      reasoning.push('Remote work option available');
    } else {
      reasoning.push('Location may require relocation or long commute');
    }

    // Salary reasoning
    if (breakdown.salary.expectationMatch) {
      reasoning.push('Salary expectations align well');
    } else if (breakdown.salary.marketRate) {
      reasoning.push('Salary is within market range');
    } else {
      reasoning.push('Salary expectations may need adjustment');
    }

    return reasoning;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(resumeData: ResumeData, job: JobListing, breakdown: MatchBreakdown): string[] {
    const recommendations: string[] = [];

    // Skills recommendations
    if (breakdown.skills.missing.length > 0) {
      recommendations.push(`Consider learning: ${breakdown.skills.missing.slice(0, 3).join(', ')}`);
    }

    // Experience recommendations
    if (!breakdown.experience.levelMatch) {
      recommendations.push('Highlight relevant experience that matches the required level');
    }

    // Education recommendations
    if (!breakdown.education.degreeMatch) {
      recommendations.push('Emphasize relevant coursework or certifications');
    }

    // Project recommendations
    if (breakdown.skills.score < 0.7) {
      recommendations.push('Create projects demonstrating required skills');
    }

    return recommendations;
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(resumeData: ResumeData, job: JobListing, breakdown: MatchBreakdown): string[] {
    const risks: string[] = [];

    if (breakdown.skills.score < 0.5) {
      risks.push('Significant skills gap may require extensive training');
    }

    if (breakdown.experience.score < 0.4) {
      risks.push('Limited relevant experience for the role');
    }

    if (breakdown.location.score < 0.3) {
      risks.push('Location mismatch may affect work-life balance');
    }

    if (breakdown.salary.score < 0.3) {
      risks.push('Salary expectations may not align');
    }

    return risks;
  }

  /**
   * Calculate growth potential
   */
  private calculateGrowthPotential(resumeData: ResumeData, job: JobListing): number {
    // Analyze career progression potential
    const skillGrowth = this.analyzeSkillGrowth(resumeData.skills, job.skills);
    const roleGrowth = this.analyzeRoleGrowth(resumeData.experience, job);
    const industryGrowth = this.analyzeIndustryGrowth(resumeData.industry, job.industry);

    return Math.round((skillGrowth + roleGrowth + industryGrowth) / 3);
  }

  /**
   * Calculate project match
   */
  private calculateProjectMatch(resumeData: ResumeData, job: JobListing): number {
    if (resumeData.projects.length === 0) return 0;

    const projectSkills = resumeData.projects.flatMap(p => p.technologies);
    const jobSkills = job.skills.map(s => s.toLowerCase());
    
    const matches = projectSkills.filter(skill => 
      jobSkills.some(jobSkill => skill.toLowerCase().includes(jobSkill))
    );

    return Math.round((matches.length / jobSkills.length) * 100);
  }

  /**
   * Calculate certification match
   */
  private calculateCertificationMatch(resumeData: ResumeData, job: JobListing): number {
    if (resumeData.certifications.length === 0) return 0;

    const certNames = resumeData.certifications.map(c => c.name.toLowerCase());
    const jobDescription = job.description.toLowerCase();
    
    const matches = certNames.filter(cert => jobDescription.includes(cert));
    
    return Math.round((matches.length / resumeData.certifications.length) * 100);
  }

  // Helper methods
  private findSimilarSkill(targetSkill: string, resumeSkills: string[]): string | null {
    const similarSkills = this.skillSimilarityMap.get(targetSkill) || [];
    return resumeSkills.find(skill => similarSkills.includes(skill)) || null;
  }

  private calculateExperienceLevelMatch(experience: WorkExperience[], requiredLevel: string): boolean {
    // Implementation for experience level matching
    return true; // Simplified
  }

  private calculateIndustryMatch(experience: WorkExperience[], jobIndustry: string): boolean {
    return experience.some(exp => exp.industry.toLowerCase() === jobIndustry.toLowerCase());
  }

  private calculateRoleMatch(experience: WorkExperience[], jobTitle: string): boolean {
    return experience.some(exp => 
      exp.position.toLowerCase().includes(jobTitle.toLowerCase()) ||
      jobTitle.toLowerCase().includes(exp.position.toLowerCase())
    );
  }

  private calculateDegreeMatch(education: any, job: JobListing): boolean {
    // Implementation for degree matching
    return true; // Simplified
  }

  private calculateFieldMatch(education: any, job: JobListing): boolean {
    // Implementation for field matching
    return true; // Simplified
  }

  private calculateInstitutionMatch(education: any, job: JobListing): boolean {
    // Implementation for institution matching
    return true; // Simplified
  }

  private isRemoteFriendly(location: string): boolean {
    // Check if location is remote-friendly
    return true; // Simplified
  }

  private calculateCommuteScore(resumeLocation: string, jobLocation: string): number {
    // Calculate commute score based on distance
    return 0.5; // Simplified
  }

  private isMarketRate(jobSalary: number, resumeSalary: any): boolean {
    // Check if job salary is market rate
    return true; // Simplified
  }

  private calculateNegotiationRoom(resumeSalary: any, jobSalary: any): number {
    // Calculate negotiation room
    return 0.1; // Simplified
  }

  private calculateWorkStyleMatch(resumeData: ResumeData, job: JobListing): boolean {
    // Implementation for work style matching
    return true; // Simplified
  }

  private calculateValuesMatch(resumeData: ResumeData, job: JobListing): boolean {
    // Implementation for values matching
    return true; // Simplified
  }

  private calculateTeamSizeMatch(resumeData: ResumeData, job: JobListing): boolean {
    // Implementation for team size matching
    return true; // Simplified
  }

  private analyzeSkillGrowth(resumeSkills: Skill[], jobSkills: string[]): number {
    // Analyze skill growth potential
    return 75; // Simplified
  }

  private analyzeRoleGrowth(experience: WorkExperience[], job: JobListing): number {
    // Analyze role growth potential
    return 80; // Simplified
  }

  private analyzeIndustryGrowth(resumeIndustry: string, jobIndustry: string): number {
    // Analyze industry growth potential
    return 70; // Simplified
  }

  private getDefaultConfig(): MatchingConfig {
    return {
      weights: {
        skills: 0.3,
        experience: 0.25,
        education: 0.15,
        location: 0.1,
        salary: 0.1,
        culture: 0.05,
        projects: 0.03,
        certifications: 0.02
      },
      thresholds: {
        exactMatch: 90,
        goodMatch: 75,
        partialMatch: 60
      },
      boostFactors: {
        exactSkillMatch: 1.2,
        industryExperience: 1.15,
        educationMatch: 1.1,
        locationMatch: 1.05
      }
    };
  }

  private initializeSkillSimilarityMap(): void {
    this.skillSimilarityMap = new Map([
      ['javascript', ['js', 'ecmascript', 'nodejs', 'react', 'vue', 'angular']],
      ['python', ['py', 'django', 'flask', 'fastapi']],
      ['java', ['spring', 'hibernate', 'maven', 'gradle']],
      ['sql', ['mysql', 'postgresql', 'oracle', 'sqlite']],
      ['aws', ['amazon web services', 'cloud', 'ec2', 's3']],
      ['docker', ['containers', 'kubernetes', 'k8s']]
    ]);
  }

  private initializeIndustryMapping(): void {
    this.industryMapping = new Map([
      ['technology', ['software', 'tech', 'it', 'development']],
      ['finance', ['banking', 'financial', 'investment']],
      ['healthcare', ['medical', 'health', 'pharmaceutical']]
    ]);
  }

  private initializeRoleMapping(): void {
    this.roleMapping = new Map([
      ['software engineer', ['developer', 'programmer', 'coder']],
      ['data scientist', ['data analyst', 'ml engineer', 'ai engineer']],
      ['product manager', ['pm', 'product owner', 'product lead']]
    ]);
  }
}

export const intelligentMatcher = new IntelligentMatcher();

















