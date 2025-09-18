// Core User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
  subscription?: Subscription;
}

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  showContactInfo: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONNECTIONS_ONLY = 'connections_only'
}

// Job Seeker Types
export interface JobSeeker extends User {
  role: UserRole.JOB_SEEKER;
  profile: JobSeekerProfile;
  applications: JobApplication[];
  savedJobs: string[];
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  careerGoals: CareerGoal[];
  availability: Availability;
}

export interface JobSeekerProfile {
  headline: string;
  summary: string;
  location: Location;
  remoteWorkPreference: boolean;
  salaryExpectation?: SalaryRange;
  jobTypes: JobType[];
  industries: string[];
  workAuthorization: WorkAuthorization;
  diversity: DiversityInfo;
  personalityTraits: PersonalityTrait[];
  culturalFit: CulturalFitScore;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  industry: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
}

// Employer Types
export interface Employer extends User {
  role: UserRole.EMPLOYER;
  company: Company;
  permissions: EmployerPermission[];
  teamMembers: TeamMember[];
  jobPostings: JobPosting[];
  interviews: Interview[];
  analytics: EmployerAnalytics;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  industry: string;
  size: CompanySize;
  location: Location;
  foundedYear?: number;
  culture: CompanyCulture;
  benefits: Benefit[];
  socialMedia: SocialMedia;
  verification: VerificationStatus;
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export interface CompanyCulture {
  values: string[];
  workStyle: WorkStyle;
  diversity: DiversityMetrics;
  perks: string[];
  growthOpportunities: string[];
  teamDescription: string;
}

export enum WorkStyle {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'onsite'
}

export interface DiversityMetrics {
  genderDistribution: GenderDistribution;
  ethnicDistribution: EthnicDistribution;
  ageDistribution: AgeDistribution;
  disabilityInclusion: boolean;
  lgbtqInclusive: boolean;
}

// Job Types
export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: JobRequirement[];
  responsibilities: string[];
  benefits: string[];
  location: Location;
  remoteOption: boolean;
  jobType: JobType;
  salaryRange?: SalaryRange;
  experienceLevel: ExperienceLevel;
  industry: string;
  department: string;
  skills: Skill[];
  company: Company;
  employer: string;
  status: JobStatus;
  publishedAt?: Date;
  expiresAt?: Date;
  applicationsCount: number;
  viewsCount: number;
  aiMatchingScore?: number;
  diversityTargets?: DiversityTarget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobRequirement {
  type: RequirementType;
  description: string;
  isRequired: boolean;
  weight: number;
}

export enum RequirementType {
  SKILL = 'skill',
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  CERTIFICATION = 'certification',
  LANGUAGE = 'language',
  SOFT_SKILL = 'soft_skill'
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency?: ProficiencyLevel;
  verified: boolean;
  endorsements: number;
  yearsExperience?: number;
}

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  LANGUAGE = 'language',
  CERTIFICATION = 'certification',
  INDUSTRY_SPECIFIC = 'industry_specific'
}

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
  TEMPORARY = 'temporary'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  CLOSED = 'closed',
  EXPIRED = 'expired'
}

// Application Types
export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  coverLetter?: string;
  resume?: Resume;
  portfolio?: PortfolioItem[];
  answers: ApplicationAnswer[];
  aiMatchingScore: number;
  culturalFitScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  interviewScheduled?: Date;
  notes: ApplicationNote[];
  timeline: ApplicationTimelineEvent[];
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  parsedData: ParsedResumeData;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  achievements: Achievement[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: Location;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
}

export interface Language {
  name: string;
  proficiency: ProficiencyLevel;
  certifications?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  url?: string;
  githubUrl?: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: Date;
  category: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: PortfolioType;
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  technologies: string[];
  createdAt: Date;
}

export enum PortfolioType {
  WEBSITE = 'website',
  MOBILE_APP = 'mobile_app',
  DESIGN = 'design',
  WRITING = 'writing',
  VIDEO = 'video',
  OTHER = 'other'
}

// AI Matching Types
export interface MatchingScore {
  overall: number;
  skillMatch: number;
  experienceMatch: number;
  culturalFit: number;
  locationMatch: number;
  salaryMatch: number;
  growthPotential: number;
  diversityScore: number;
}

export interface CulturalFitScore {
  overall: number;
  workStyle: number;
  values: number;
  communication: number;
  leadership: number;
  teamwork: number;
}

export interface PersonalityTrait {
  trait: string;
  score: number;
  description: string;
}

// Interview Types
export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: Date;
  duration: number;
  location?: string;
  meetingUrl?: string;
  interviewers: Interviewer[];
  feedback: InterviewFeedback[];
  recordingUrl?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  PANEL = 'panel'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export interface Interviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface InterviewFeedback {
  interviewerId: string;
  rating: number;
  comments: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: Recommendation;
  submittedAt: Date;
}

export enum Recommendation {
  STRONG_HIRE = 'strong_hire',
  HIRE = 'hire',
  NO_HIRE = 'no_hire',
  STRONG_NO_HIRE = 'strong_no_hire'
}

// Analytics Types
export interface EmployerAnalytics {
  totalJobsPosted: number;
  activeJobs: number;
  totalApplications: number;
  applicationsThisMonth: number;
  averageTimeToHire: number;
  costPerHire: number;
  diversityMetrics: DiversityAnalytics;
  skillDemand: SkillDemandAnalytics[];
  marketInsights: MarketInsights;
  candidatePipeline: CandidatePipelineMetrics;
}

export interface DiversityAnalytics {
  genderDistribution: GenderDistribution;
  ethnicDistribution: EthnicDistribution;
  ageDistribution: AgeDistribution;
  disabilityInclusion: number;
  lgbtqInclusion: number;
  overallScore: number;
}

export interface SkillDemandAnalytics {
  skill: string;
  demandScore: number;
  averageSalary: number;
  growthRate: number;
  marketTrend: Trend;
}

export enum Trend {
  RISING = 'rising',
  STABLE = 'stable',
  DECLINING = 'declining'
}

export interface MarketInsights {
  averageSalaryByRole: SalaryInsight[];
  topSkills: string[];
  emergingSkills: string[];
  industryTrends: IndustryTrend[];
  competitorAnalysis: CompetitorAnalysis;
}

export interface SalaryInsight {
  role: string;
  averageSalary: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
}

export interface IndustryTrend {
  industry: string;
  growthRate: number;
  jobOpenings: number;
  averageSalary: number;
  topSkills: string[];
}

export interface CompetitorAnalysis {
  competitor: string;
  marketShare: number;
  averageSalary: number;
  employeeSatisfaction: number;
  growthRate: number;
}

export interface CandidatePipelineMetrics {
  totalCandidates: number;
  newCandidates: number;
  qualifiedCandidates: number;
  interviewedCandidates: number;
  offeredCandidates: number;
  hiredCandidates: number;
  conversionRates: ConversionRate[];
}

export interface ConversionRate {
  stage: string;
  rate: number;
  timeToConvert: number;
}

// Communication Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  attachments?: Attachment[];
  readAt?: Date;
  createdAt: Date;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: NotificationPriority;
  scheduledAt?: Date;
  createdAt: Date;
}

export enum NotificationType {
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_STATUS_CHANGED = 'application_status_changed',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  JOB_MATCH = 'job_match',
  MESSAGE_RECEIVED = 'message_received',
  SYSTEM_UPDATE = 'system_update',
  SECURITY_ALERT = 'security_alert'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Common Types
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
  isNegotiable: boolean;
}

export enum SalaryPeriod {
  HOURLY = 'hourly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface WorkAuthorization {
  type: AuthorizationType;
  validUntil?: Date;
  restrictions?: string[];
}

export enum AuthorizationType {
  CITIZEN = 'citizen',
  PERMANENT_RESIDENT = 'permanent_resident',
  WORK_VISA = 'work_visa',
  STUDENT_VISA = 'student_visa',
  TEMPORARY_WORK = 'temporary_work',
  NO_AUTHORIZATION = 'no_authorization'
}

export interface DiversityInfo {
  gender?: Gender;
  ethnicity?: Ethnicity;
  age?: AgeRange;
  disability?: boolean;
  veteran?: boolean;
  lgbtq?: boolean;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum Ethnicity {
  WHITE = 'white',
  BLACK = 'black',
  HISPANIC = 'hispanic',
  ASIAN = 'asian',
  NATIVE_AMERICAN = 'native_american',
  PACIFIC_ISLANDER = 'pacific_islander',
  MIXED = 'mixed',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export interface AgeRange {
  min: number;
  max: number;
}

export interface GenderDistribution {
  male: number;
  female: number;
  nonBinary: number;
  preferNotToSay: number;
}

export interface EthnicDistribution {
  white: number;
  black: number;
  hispanic: number;
  asian: number;
  nativeAmerican: number;
  pacificIslander: number;
  mixed: number;
  other: number;
  preferNotToSay: number;
}

export interface AgeDistribution {
  under25: number;
  '25-34': number;
  '35-44': number;
  '45-54': number;
  '55-64': number;
  over65: number;
}

export interface DiversityTarget {
  type: DiversityType;
  percentage: number;
  description: string;
}

export enum DiversityType {
  GENDER = 'gender',
  ETHNICITY = 'ethnicity',
  AGE = 'age',
  DISABILITY = 'disability',
  VETERAN = 'veteran',
  LGBTQ = 'lgbtq'
}

export interface Availability {
  startDate: Date;
  noticePeriod: number;
  workSchedule: WorkSchedule;
  timeZone: string;
}

export interface WorkSchedule {
  type: ScheduleType;
  hours: number;
  days: DayOfWeek[];
  flexibility: FlexibilityLevel;
}

export enum ScheduleType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  FLEXIBLE = 'flexible',
  CONTRACT = 'contract'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum FlexibilityLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  COMPLETE = 'complete'
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  milestones: Milestone[];
  skills: string[];
  resources: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  category: BenefitCategory;
  value?: number;
  currency?: string;
}

export enum BenefitCategory {
  HEALTH = 'health',
  DENTAL = 'dental',
  VISION = 'vision',
  RETIREMENT = 'retirement',
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  FLEXIBLE_HOURS = 'flexible_hours',
  REMOTE_WORK = 'remote_work',
  EDUCATION = 'education',
  TRANSPORTATION = 'transportation',
  MEALS = 'meals',
  OTHER = 'other'
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface VerificationStatus {
  isVerified: boolean;
  verifiedAt?: Date;
  verificationMethod: VerificationMethod;
  documents: VerificationDocument[];
}

export enum VerificationMethod {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  THIRD_PARTY = 'third_party'
}

export interface VerificationDocument {
  type: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
}

export enum DocumentType {
  BUSINESS_LICENSE = 'business_license',
  TAX_ID = 'tax_id',
  BANK_STATEMENT = 'bank_statement',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface EmployerPermission {
  resource: string;
  actions: string[];
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: string;
  value: any;
}

export interface TeamMember {
  id: string;
  userId: string;
  role: TeamRole;
  permissions: EmployerPermission[];
  department: string;
  joinedAt: Date;
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  INTERVIEWER = 'interviewer',
  VIEWER = 'viewer'
}

export interface ApplicationAnswer {
  questionId: string;
  question: string;
  answer: string;
  type: AnswerType;
}

export enum AnswerType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple_choice',
  CHECKBOX = 'checkbox',
  RATING = 'rating',
  FILE_UPLOAD = 'file_upload'
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface ApplicationTimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  metadata?: any;
}

export enum TimelineEventType {
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_REVIEWED = 'application_reviewed',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEW_COMPLETED = 'interview_completed',
  OFFER_MADE = 'offer_made',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_REJECTED = 'offer_rejected',
  APPLICATION_REJECTED = 'application_rejected'
}

export interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  features: SubscriptionFeature[];
  billing: BillingInfo;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial'
}

export interface SubscriptionFeature {
  name: string;
  limit?: number;
  used: number;
  enabled: boolean;
}

export interface BillingInfo {
  paymentMethod: PaymentMethod;
  billingAddress: Location;
  taxId?: string;
  invoiceEmail: string;
}

export interface PaymentMethod {
  type: PaymentType;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_ACCOUNT = 'bank_account',
  PAYPAL = 'paypal',
  WIRE_TRANSFER = 'wire_transfer'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
  pagination?: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  location?: Location;
  salaryRange?: SalaryRange;
  jobTypes?: JobType[];
  experienceLevels?: ExperienceLevel[];
  industries?: string[];
  skills?: string[];
  companies?: string[];
  remote?: boolean;
  postedDate?: DateRange;
  diversity?: DiversityFilter;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DiversityFilter {
  gender?: Gender[];
  ethnicity?: Ethnicity[];
  ageRange?: AgeRange;
  disability?: boolean;
  veteran?: boolean;
  lgbtq?: boolean;
}

// AI and ML Types
export interface AIMatchingRequest {
  jobId: string;
  candidateIds?: string[];
  limit?: number;
  weights?: MatchingWeights;
  diversityBoost?: boolean;
}

export interface MatchingWeights {
  skills: number;
  experience: number;
  culturalFit: number;
  location: number;
  salary: number;
  diversity: number;
}

export interface AIMatchingResponse {
  matches: CandidateMatch[];
  totalCandidates: number;
  processingTime: number;
  algorithm: string;
  version: string;
}

export interface CandidateMatch {
  candidateId: string;
  overallScore: number;
  breakdown: MatchingScore;
  reasoning: string[];
  recommendations: string[];
  riskFactors: string[];
}

// Event Types for Real-time Updates
export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp: Date;
  userId?: string;
}

export enum WebSocketMessageType {
  APPLICATION_UPDATE = 'application_update',
  MESSAGE_RECEIVED = 'message_received',
  INTERVIEW_REMINDER = 'interview_reminder',
  JOB_MATCH_NOTIFICATION = 'job_match_notification',
  SYSTEM_NOTIFICATION = 'system_notification',
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline'
}

// Export all types
export * from './auth';
export * from './errors';
