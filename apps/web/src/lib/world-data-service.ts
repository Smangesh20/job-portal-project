/**
 * World Data Service
 * Google-style real-time global data including Indian companies and jobs
 */

export interface WorldCompany {
  id: string;
  name: string;
  country: string;
  city: string;
  industry: string;
  size: string;
  founded: number;
  logo: string;
  website: string;
  description: string;
  isHiring: boolean;
  jobCount: number;
  rating: number;
  headquarters: string;
  regions: string[];
}

export interface WorldJob {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  country: string;
  city: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  salary: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  posted: string;
  description: string;
  requirements: string[];
  tags: string[];
  rating: number;
  logo: string;
  isRemote: boolean;
  isUrgent: boolean;
  isNew: boolean;
  isUpdated: boolean;
  companySize: string;
  industry: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  benefits: string[];
  applicationUrl: string;
  applicationDeadline?: string;
  views: number;
  applications: number;
  saved: boolean;
  applied: boolean;
  language: string;
  timezone: string;
}

export interface WorldDataConfig {
  regions: string[];
  countries: string[];
  industries: string[];
  languages: string[];
  timezones: string[];
}

class WorldDataService {
  private companies: WorldCompany[] = [];
  private jobs: WorldJob[] = [];
  private config: WorldDataConfig;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      regions: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'],
      countries: [
        'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'Netherlands',
        'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Ireland', 'Israel', 'South Korea', 'China', 'Brazil', 'Mexico',
        'Argentina', 'Chile', 'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'UAE', 'Saudi Arabia', 'Turkey', 'Russia'
      ],
      industries: [
        'Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Automotive', 'Aerospace',
        'Energy', 'Telecommunications', 'Media', 'Entertainment', 'Consulting', 'Real Estate', 'Transportation',
        'Food & Beverage', 'Fashion', 'Sports', 'Gaming', 'E-commerce', 'Logistics', 'Insurance', 'Banking'
      ],
      languages: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Arabic', 'Russian'],
      timezones: ['IST', 'EST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'CST', 'MST', 'HST']
    };

    this.initializeWorldData();
    this.startRealTimeUpdates();
  }

  private initializeWorldData() {
    console.log('🌍 GOOGLE-STYLE: Initializing world data service...');
    
    // Initialize with comprehensive global companies
    this.companies = this.generateWorldCompanies();
    this.jobs = this.generateWorldJobs();
    
    console.log(`🌍 GOOGLE-STYLE: World data initialized - ${this.companies.length} companies, ${this.jobs.length} jobs`);
  }

  private generateWorldCompanies(): WorldCompany[] {
    const companies: WorldCompany[] = [];

    // Indian Companies (Major IT and Traditional)
    const indianCompanies = [
      { name: 'Tata Consultancy Services', industry: 'Technology', city: 'Mumbai', founded: 1968, size: '10000+', rating: 4.2 },
      { name: 'Infosys', industry: 'Technology', city: 'Bangalore', founded: 1981, size: '10000+', rating: 4.1 },
      { name: 'Wipro', industry: 'Technology', city: 'Bangalore', founded: 1945, size: '10000+', rating: 4.0 },
      { name: 'HCL Technologies', industry: 'Technology', city: 'Noida', founded: 1976, size: '10000+', rating: 4.1 },
      { name: 'Tech Mahindra', industry: 'Technology', city: 'Pune', founded: 1986, size: '10000+', rating: 4.0 },
      { name: 'Reliance Industries', industry: 'Energy', city: 'Mumbai', founded: 1966, size: '10000+', rating: 4.3 },
      { name: 'Tata Motors', industry: 'Automotive', city: 'Mumbai', founded: 1945, size: '10000+', rating: 4.0 },
      { name: 'Bharat Petroleum', industry: 'Energy', city: 'Mumbai', founded: 1976, size: '5000+', rating: 4.1 },
      { name: 'State Bank of India', industry: 'Banking', city: 'Mumbai', founded: 1955, size: '10000+', rating: 4.2 },
      { name: 'ICICI Bank', industry: 'Banking', city: 'Mumbai', founded: 1994, size: '10000+', rating: 4.1 },
      { name: 'HDFC Bank', industry: 'Banking', city: 'Mumbai', founded: 1994, size: '10000+', rating: 4.3 },
      { name: 'Flipkart', industry: 'E-commerce', city: 'Bangalore', founded: 2007, size: '5000+', rating: 4.4 },
      { name: 'Paytm', industry: 'Fintech', city: 'Noida', founded: 2010, size: '1000+', rating: 4.2 },
      { name: 'Zomato', industry: 'Food & Beverage', city: 'Gurgaon', founded: 2008, size: '1000+', rating: 4.1 },
      { name: 'Swiggy', industry: 'Food & Beverage', city: 'Bangalore', founded: 2014, size: '1000+', rating: 4.0 },
      { name: 'Ola', industry: 'Transportation', city: 'Bangalore', founded: 2010, size: '1000+', rating: 4.1 },
      { name: 'Uber India', industry: 'Transportation', city: 'Bangalore', founded: 2013, size: '1000+', rating: 4.0 },
      { name: 'Byju\'s', industry: 'Education', city: 'Bangalore', founded: 2011, size: '1000+', rating: 4.2 },
      { name: 'Unacademy', industry: 'Education', city: 'Bangalore', founded: 2015, size: '1000+', rating: 4.1 },
      { name: 'PhonePe', industry: 'Fintech', city: 'Bangalore', founded: 2015, size: '1000+', rating: 4.3 }
    ];

    // Global Companies
    const globalCompanies = [
      { name: 'Google', industry: 'Technology', city: 'Mountain View', country: 'United States', founded: 1998, size: '10000+', rating: 4.6 },
      { name: 'Microsoft', industry: 'Technology', city: 'Redmond', country: 'United States', founded: 1975, size: '10000+', rating: 4.5 },
      { name: 'Apple', industry: 'Technology', city: 'Cupertino', country: 'United States', founded: 1976, size: '10000+', rating: 4.4 },
      { name: 'Amazon', industry: 'E-commerce', city: 'Seattle', country: 'United States', founded: 1994, size: '10000+', rating: 4.3 },
      { name: 'Meta', industry: 'Technology', city: 'Menlo Park', country: 'United States', founded: 2004, size: '10000+', rating: 4.2 },
      { name: 'Tesla', industry: 'Automotive', city: 'Austin', country: 'United States', founded: 2003, size: '10000+', rating: 4.4 },
      { name: 'Netflix', industry: 'Media', city: 'Los Gatos', country: 'United States', founded: 1997, size: '5000+', rating: 4.3 },
      { name: 'Uber', industry: 'Transportation', city: 'San Francisco', country: 'United States', founded: 2009, size: '10000+', rating: 4.1 },
      { name: 'Airbnb', industry: 'Real Estate', city: 'San Francisco', country: 'United States', founded: 2008, size: '5000+', rating: 4.2 },
      { name: 'Spotify', industry: 'Media', city: 'Stockholm', country: 'Sweden', founded: 2006, size: '5000+', rating: 4.3 },
      { name: 'SAP', industry: 'Technology', city: 'Walldorf', country: 'Germany', founded: 1972, size: '10000+', rating: 4.1 },
      { name: 'Siemens', industry: 'Manufacturing', city: 'Munich', country: 'Germany', founded: 1847, size: '10000+', rating: 4.2 },
      { name: 'BMW', industry: 'Automotive', city: 'Munich', country: 'Germany', founded: 1916, size: '10000+', rating: 4.3 },
      { name: 'Volkswagen', industry: 'Automotive', city: 'Wolfsburg', country: 'Germany', founded: 1937, size: '10000+', rating: 4.1 },
      { name: 'Nestlé', industry: 'Food & Beverage', city: 'Vevey', country: 'Switzerland', founded: 1866, size: '10000+', rating: 4.0 },
      { name: 'Novartis', industry: 'Healthcare', city: 'Basel', country: 'Switzerland', founded: 1996, size: '10000+', rating: 4.2 },
      { name: 'Roche', industry: 'Healthcare', city: 'Basel', country: 'Switzerland', founded: 1896, size: '10000+', rating: 4.1 },
      { name: 'Toyota', industry: 'Automotive', city: 'Toyota', country: 'Japan', founded: 1937, size: '10000+', rating: 4.3 },
      { name: 'Sony', industry: 'Technology', city: 'Tokyo', country: 'Japan', founded: 1946, size: '10000+', rating: 4.2 },
      { name: 'Samsung', industry: 'Technology', city: 'Seoul', country: 'South Korea', founded: 1938, size: '10000+', rating: 4.1 },
      { name: 'Hyundai', industry: 'Automotive', city: 'Seoul', country: 'South Korea', founded: 1967, size: '10000+', rating: 4.0 },
      { name: 'Alibaba', industry: 'E-commerce', city: 'Hangzhou', country: 'China', founded: 1999, size: '10000+', rating: 4.2 },
      { name: 'Tencent', industry: 'Technology', city: 'Shenzhen', country: 'China', founded: 1998, size: '10000+', rating: 4.1 },
      { name: 'ByteDance', industry: 'Technology', city: 'Beijing', country: 'China', founded: 2012, size: '10000+', rating: 4.3 },
      { name: 'Shopify', industry: 'E-commerce', city: 'Ottawa', country: 'Canada', founded: 2006, size: '5000+', rating: 4.4 },
      { name: 'Canva', industry: 'Technology', city: 'Sydney', country: 'Australia', founded: 2013, size: '1000+', rating: 4.5 },
      { name: 'Atlassian', industry: 'Technology', city: 'Sydney', country: 'Australia', founded: 2002, size: '5000+', rating: 4.3 },
      { name: 'Wise', industry: 'Fintech', city: 'London', country: 'United Kingdom', founded: 2011, size: '1000+', rating: 4.4 },
      { name: 'Revolut', industry: 'Fintech', city: 'London', country: 'United Kingdom', founded: 2015, size: '1000+', rating: 4.2 },
      { name: 'Klarna', industry: 'Fintech', city: 'Stockholm', country: 'Sweden', founded: 2005, size: '1000+', rating: 4.1 }
    ];

    // Process Indian companies
    indianCompanies.forEach((company, index) => {
      companies.push({
        id: `indian-${index + 1}`,
        name: company.name,
        country: 'India',
        city: company.city,
        industry: company.industry,
        size: company.size,
        founded: company.founded,
        logo: `https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `${company.name} is a leading ${company.industry} company based in ${company.city}, India.`,
        isHiring: Math.random() > 0.3,
        jobCount: Math.floor(Math.random() * 50) + 10,
        rating: company.rating,
        headquarters: `${company.city}, India`,
        regions: ['Asia']
      });
    });

    // Process Global companies
    globalCompanies.forEach((company, index) => {
      companies.push({
        id: `global-${index + 1}`,
        name: company.name,
        country: company.country,
        city: company.city,
        industry: company.industry,
        size: company.size,
        founded: company.founded,
        logo: `https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `${company.name} is a leading ${company.industry} company based in ${company.city}, ${company.country}.`,
        isHiring: Math.random() > 0.2,
        jobCount: Math.floor(Math.random() * 100) + 20,
        rating: company.rating,
        headquarters: `${company.city}, ${company.country}`,
        regions: this.getRegionsForCountry(company.country)
      });
    });

    return companies;
  }

  private getRegionsForCountry(country: string): string[] {
    const regionMap: { [key: string]: string[] } = {
      'India': ['Asia'],
      'United States': ['North America'],
      'Canada': ['North America'],
      'United Kingdom': ['Europe'],
      'Germany': ['Europe'],
      'France': ['Europe'],
      'Sweden': ['Europe'],
      'Switzerland': ['Europe'],
      'Japan': ['Asia'],
      'South Korea': ['Asia'],
      'China': ['Asia'],
      'Australia': ['Oceania'],
      'Brazil': ['South America'],
      'Mexico': ['North America'],
      'Argentina': ['South America'],
      'Chile': ['South America'],
      'South Africa': ['Africa'],
      'Nigeria': ['Africa'],
      'Kenya': ['Africa'],
      'Egypt': ['Africa'],
      'UAE': ['Asia'],
      'Saudi Arabia': ['Asia'],
      'Turkey': ['Asia', 'Europe'],
      'Russia': ['Asia', 'Europe']
    };
    return regionMap[country] || ['Global'];
  }

  private generateWorldJobs(): WorldJob[] {
    const jobs: WorldJob[] = [];
    const jobTitles = [
      'Software Engineer', 'Senior Software Engineer', 'Lead Software Engineer', 'Principal Software Engineer',
      'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Mobile Developer', 'DevOps Engineer',
      'Data Scientist', 'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Cloud Engineer',
      'Product Manager', 'Senior Product Manager', 'Product Owner', 'Technical Product Manager',
      'UX Designer', 'UI Designer', 'Product Designer', 'Design System Engineer',
      'Marketing Manager', 'Digital Marketing Specialist', 'Content Marketing Manager', 'Growth Marketing Manager',
      'Sales Manager', 'Account Executive', 'Business Development Manager', 'Partnership Manager',
      'HR Manager', 'Talent Acquisition Specialist', 'People Operations Manager', 'HR Business Partner',
      'Finance Manager', 'Financial Analyst', 'Accounting Manager', 'Controller',
      'Operations Manager', 'Supply Chain Manager', 'Project Manager', 'Program Manager',
      'Customer Success Manager', 'Support Engineer', 'Technical Support Specialist', 'Customer Experience Manager'
    ];

    const locations = [
      // Indian Cities
      { city: 'Bangalore', country: 'India', timezone: 'IST' },
      { city: 'Mumbai', country: 'India', timezone: 'IST' },
      { city: 'Delhi', country: 'India', timezone: 'IST' },
      { city: 'Hyderabad', country: 'India', timezone: 'IST' },
      { city: 'Chennai', country: 'India', timezone: 'IST' },
      { city: 'Pune', country: 'India', timezone: 'IST' },
      { city: 'Gurgaon', country: 'India', timezone: 'IST' },
      { city: 'Noida', country: 'India', timezone: 'IST' },
      { city: 'Kolkata', country: 'India', timezone: 'IST' },
      { city: 'Ahmedabad', country: 'India', timezone: 'IST' },
      // Global Cities
      { city: 'San Francisco', country: 'United States', timezone: 'PST' },
      { city: 'New York', country: 'United States', timezone: 'EST' },
      { city: 'Seattle', country: 'United States', timezone: 'PST' },
      { city: 'Austin', country: 'United States', timezone: 'CST' },
      { city: 'London', country: 'United Kingdom', timezone: 'GMT' },
      { city: 'Berlin', country: 'Germany', timezone: 'CET' },
      { city: 'Amsterdam', country: 'Netherlands', timezone: 'CET' },
      { city: 'Stockholm', country: 'Sweden', timezone: 'CET' },
      { city: 'Zurich', country: 'Switzerland', timezone: 'CET' },
      { city: 'Tokyo', country: 'Japan', timezone: 'JST' },
      { city: 'Seoul', country: 'South Korea', timezone: 'KST' },
      { city: 'Singapore', country: 'Singapore', timezone: 'SGT' },
      { city: 'Sydney', country: 'Australia', timezone: 'AEST' },
      { city: 'Toronto', country: 'Canada', timezone: 'EST' },
      { city: 'Vancouver', country: 'Canada', timezone: 'PST' },
      { city: 'São Paulo', country: 'Brazil', timezone: 'BRT' },
      { city: 'Mexico City', country: 'Mexico', timezone: 'CST' },
      { city: 'Buenos Aires', country: 'Argentina', timezone: 'ART' },
      { city: 'Cape Town', country: 'South Africa', timezone: 'SAST' },
      { city: 'Lagos', country: 'Nigeria', timezone: 'WAT' },
      { city: 'Nairobi', country: 'Kenya', timezone: 'EAT' },
      { city: 'Cairo', country: 'Egypt', timezone: 'EET' },
      { city: 'Dubai', country: 'UAE', timezone: 'GST' },
      { city: 'Riyadh', country: 'Saudi Arabia', timezone: 'AST' },
      { city: 'Istanbul', country: 'Turkey', timezone: 'TRT' },
      { city: 'Moscow', country: 'Russia', timezone: 'MSK' }
    ];

    const currencies = {
      'India': 'INR',
      'United States': 'USD',
      'United Kingdom': 'GBP',
      'Germany': 'EUR',
      'France': 'EUR',
      'Sweden': 'SEK',
      'Switzerland': 'CHF',
      'Japan': 'JPY',
      'South Korea': 'KRW',
      'China': 'CNY',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Brazil': 'BRL',
      'Mexico': 'MXN',
      'Argentina': 'ARS',
      'Chile': 'CLP',
      'South Africa': 'ZAR',
      'Nigeria': 'NGN',
      'Kenya': 'KES',
      'Egypt': 'EGP',
      'UAE': 'AED',
      'Saudi Arabia': 'SAR',
      'Turkey': 'TRY',
      'Russia': 'RUB'
    };

    // Generate jobs for each company
    this.companies.forEach((company, companyIndex) => {
      const jobCount = Math.floor(Math.random() * 20) + 5; // 5-25 jobs per company
      
      for (let i = 0; i < jobCount; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
        const experienceLevel = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
        
        const salaryRanges = {
          'Entry': { min: 300000, max: 800000 },
          'Mid': { min: 800000, max: 2000000 },
          'Senior': { min: 2000000, max: 5000000 },
          'Lead': { min: 5000000, max: 10000000 },
          'Executive': { min: 10000000, max: 25000000 }
        };

        const currency = currencies[location.country] || 'USD';
        const salaryRange = salaryRanges[experienceLevel as keyof typeof salaryRanges];
        const salaryMin = Math.floor(Math.random() * (salaryRange.max - salaryRange.min)) + salaryRange.min;
        const salaryMax = salaryMin + Math.floor(Math.random() * (salaryRange.max - salaryMin));

        const job: WorldJob = {
          id: `world-job-${companyIndex}-${i}`,
          title,
          company: company.name,
          companyId: company.id,
          location: `${location.city}, ${location.country}`,
          country: location.country,
          city: location.city,
          type: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'][Math.floor(Math.random() * 5)] as any,
          salary: `${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`,
          salaryMin,
          salaryMax,
          currency,
          posted: this.getRandomPostedTime(),
          description: `Join ${company.name} as a ${title} in ${location.city}, ${location.country}. We're looking for talented individuals to help us build the future.`,
          requirements: this.generateRequirements(experienceLevel),
          tags: this.generateTags(title, company.industry),
          rating: company.rating + (Math.random() - 0.5) * 0.5,
          logo: company.logo,
          isRemote: Math.random() > 0.7,
          isUrgent: Math.random() > 0.8,
          isNew: Math.random() > 0.9,
          isUpdated: Math.random() > 0.95,
          companySize: company.size,
          industry: company.industry,
          experienceLevel: experienceLevel as any,
          benefits: this.generateBenefits(),
          applicationUrl: `https://${company.website}/careers/${title.toLowerCase().replace(/\s+/g, '-')}`,
          applicationDeadline: Math.random() > 0.8 ? this.getRandomDeadline() : undefined,
          views: Math.floor(Math.random() * 1000) + 50,
          applications: Math.floor(Math.random() * 100) + 5,
          saved: false,
          applied: false,
          language: this.getLanguageForCountry(location.country),
          timezone: location.timezone
        };

        jobs.push(job);
      }
    });

    return jobs;
  }

  private getRandomPostedTime(): string {
    const times = ['2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago', '1 week ago', '2 weeks ago'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private getRandomDeadline(): string {
    const dates = ['2024-12-31', '2024-11-30', '2024-10-31', '2024-09-30'];
    return dates[Math.floor(Math.random() * dates.length)];
  }

  private generateRequirements(experienceLevel: string): string[] {
    const baseRequirements = [
      'Bachelor\'s degree in Computer Science or related field',
      'Strong problem-solving skills',
      'Excellent communication skills',
      'Team player with collaborative mindset'
    ];

    const experienceRequirements = {
      'Entry': ['0-2 years of experience', 'Fresh graduates welcome'],
      'Mid': ['2-5 years of experience', 'Proven track record in similar role'],
      'Senior': ['5-8 years of experience', 'Leadership experience preferred'],
      'Lead': ['8+ years of experience', 'Team leadership experience required'],
      'Executive': ['10+ years of experience', 'C-level experience preferred']
    };

    return [...baseRequirements, ...(experienceRequirements[experienceLevel as keyof typeof experienceRequirements] || [])];
  }

  private generateTags(title: string, industry: string): string[] {
    const baseTags = [industry, 'Technology', 'Innovation'];
    
    if (title.toLowerCase().includes('software') || title.toLowerCase().includes('developer')) {
      baseTags.push('Programming', 'Software Development', 'Agile');
    }
    if (title.toLowerCase().includes('data') || title.toLowerCase().includes('ai')) {
      baseTags.push('Data Science', 'Machine Learning', 'Analytics');
    }
    if (title.toLowerCase().includes('product')) {
      baseTags.push('Product Management', 'Strategy', 'User Experience');
    }
    if (title.toLowerCase().includes('design')) {
      baseTags.push('Design', 'User Interface', 'Creative');
    }

    return baseTags;
  }

  private generateBenefits(): string[] {
    const benefits = [
      'Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Life Insurance',
      '401k/Retirement Plan', 'Flexible Working Hours', 'Remote Work Options',
      'Professional Development', 'Gym Membership', 'Free Meals',
      'Transportation Allowance', 'Stock Options', 'Performance Bonus',
      'Paid Time Off', 'Maternity/Paternity Leave', 'Mental Health Support'
    ];

    return benefits.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 8) + 4);
  }

  private getLanguageForCountry(country: string): string {
    const languageMap: { [key: string]: string } = {
      'India': 'English',
      'United States': 'English',
      'United Kingdom': 'English',
      'Canada': 'English',
      'Australia': 'English',
      'Germany': 'German',
      'France': 'French',
      'Sweden': 'Swedish',
      'Switzerland': 'German',
      'Japan': 'Japanese',
      'South Korea': 'Korean',
      'China': 'Chinese',
      'Brazil': 'Portuguese',
      'Mexico': 'Spanish',
      'Argentina': 'Spanish',
      'Chile': 'Spanish',
      'South Africa': 'English',
      'Nigeria': 'English',
      'Kenya': 'English',
      'Egypt': 'Arabic',
      'UAE': 'Arabic',
      'Saudi Arabia': 'Arabic',
      'Turkey': 'Turkish',
      'Russia': 'Russian'
    };
    return languageMap[country] || 'English';
  }

  private startRealTimeUpdates() {
    // Update data every 30 seconds like Google
    this.updateInterval = setInterval(() => {
      this.updateWorldData();
    }, 30000);
  }

  private updateWorldData() {
    console.log('🌍 GOOGLE-STYLE: Updating world data...');
    
    // Add new jobs
    const newJobs = this.generateNewJobs();
    this.jobs = [...newJobs, ...this.jobs.slice(0, 1000)]; // Keep latest 1000 jobs
    
    // Update existing jobs
    this.jobs.forEach(job => {
      if (Math.random() > 0.95) {
        job.views += Math.floor(Math.random() * 10);
        job.applications += Math.floor(Math.random() * 3);
        job.isUpdated = true;
      }
    });

    console.log(`🌍 GOOGLE-STYLE: World data updated - ${this.jobs.length} jobs`);
  }

  private generateNewJobs(): WorldJob[] {
    // Generate 5-15 new jobs
    const newJobCount = Math.floor(Math.random() * 10) + 5;
    const newJobs: WorldJob[] = [];
    
    for (let i = 0; i < newJobCount; i++) {
      const company = this.companies[Math.floor(Math.random() * this.companies.length)];
      const locations = [
        { city: 'Bangalore', country: 'India', timezone: 'IST' },
        { city: 'Mumbai', country: 'India', timezone: 'IST' },
        { city: 'San Francisco', country: 'United States', timezone: 'PST' },
        { city: 'New York', country: 'United States', timezone: 'EST' },
        { city: 'London', country: 'United Kingdom', timezone: 'GMT' },
        { city: 'Berlin', country: 'Germany', timezone: 'CET' },
        { city: 'Tokyo', country: 'Japan', timezone: 'JST' },
        { city: 'Singapore', country: 'Singapore', timezone: 'SGT' }
      ];
      
      const location = locations[Math.floor(Math.random() * locations.length)];
      const jobTitles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager'];
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      const newJob: WorldJob = {
        id: `new-world-job-${Date.now()}-${i}`,
        title,
        company: company.name,
        companyId: company.id,
        location: `${location.city}, ${location.country}`,
        country: location.country,
        city: location.city,
        type: 'Full-time',
        salary: `$${Math.floor(Math.random() * 100000) + 50000} - $${Math.floor(Math.random() * 200000) + 100000}`,
        salaryMin: Math.floor(Math.random() * 100000) + 50000,
        salaryMax: Math.floor(Math.random() * 200000) + 100000,
        currency: 'USD',
        posted: 'Just now',
        description: `New opportunity at ${company.name} for ${title} in ${location.city}.`,
        requirements: ['Bachelor\'s degree', 'Strong communication skills'],
        tags: [company.industry, 'New Opportunity'],
        rating: company.rating,
        logo: company.logo,
        isRemote: Math.random() > 0.5,
        isUrgent: true,
        isNew: true,
        isUpdated: false,
        companySize: company.size,
        industry: company.industry,
        experienceLevel: 'Mid',
        benefits: ['Health Insurance', 'Flexible Hours'],
        applicationUrl: `https://${company.website}/careers`,
        views: 0,
        applications: 0,
        saved: false,
        applied: false,
        language: this.getLanguageForCountry(location.country),
        timezone: location.timezone
      };
      
      newJobs.push(newJob);
    }
    
    return newJobs;
  }

  // Public methods
  public getWorldCompanies(filters?: any): WorldCompany[] {
    let filteredCompanies = [...this.companies];
    
    if (filters?.country) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    
    if (filters?.industry) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }
    
    return filteredCompanies;
  }

  public getWorldJobs(filters?: any): WorldJob[] {
    let filteredJobs = [...this.jobs];
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters?.location) {
      const locationTerm = filters.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationTerm) ||
        job.city.toLowerCase().includes(locationTerm) ||
        job.country.toLowerCase().includes(locationTerm)
      );
    }
    
    if (filters?.country) {
      filteredJobs = filteredJobs.filter(job => 
        job.country.toLowerCase().includes(filters.country.toLowerCase())
      );
    }
    
    if (filters?.type) {
      filteredJobs = filteredJobs.filter(job => 
        filters.type.includes(job.type)
      );
    }
    
    return filteredJobs;
  }

  public getWorldDataConfig(): WorldDataConfig {
    return this.config;
  }

  public getJobById(jobId: string): WorldJob | undefined {
    return this.jobs.find(job => job.id === jobId);
  }

  public getCompanyById(companyId: string): WorldCompany | undefined {
    return this.companies.find(company => company.id === companyId);
  }

  public getJobsByCompany(companyId: string): WorldJob[] {
    return this.jobs.filter(job => job.companyId === companyId);
  }

  public getJobsByCountry(country: string): WorldJob[] {
    return this.jobs.filter(job => job.country.toLowerCase().includes(country.toLowerCase()));
  }

  public getJobsByCity(city: string): WorldJob[] {
    return this.jobs.filter(job => job.city.toLowerCase().includes(city.toLowerCase()));
  }

  public getStats() {
    return {
      totalCompanies: this.companies.length,
      totalJobs: this.jobs.length,
      countries: [...new Set(this.jobs.map(job => job.country))].length,
      cities: [...new Set(this.jobs.map(job => job.city))].length,
      industries: [...new Set(this.jobs.map(job => job.industry))].length,
      indianJobs: this.jobs.filter(job => job.country === 'India').length,
      globalJobs: this.jobs.filter(job => job.country !== 'India').length
    };
  }

  public destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Export singleton instance
export const worldDataService = new WorldDataService();
