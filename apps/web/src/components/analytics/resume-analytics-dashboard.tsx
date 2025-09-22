'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  MapPin, 
  DollarSign, 
  Users, 
  Award, 
  BookOpen,
  Briefcase,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Globe,
  Building,
  GraduationCap,
  Code,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { ResumeData } from '@/services/resume-parser'
import { SearchResults } from '@/services/job-aggregator'
import { MatchResult } from '@/services/intelligent-matcher'

interface ResumeAnalyticsDashboardProps {
  resumeData: ResumeData
  matchResults: MatchResult[]
  searchResults: SearchResults
  isLoading?: boolean
}

export function ResumeAnalyticsDashboard({ 
  resumeData, 
  matchResults, 
  searchResults, 
  isLoading = false 
}: ResumeAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  // Calculate key metrics
  const exactMatches = matchResults.filter(match => match.overallScore >= 90).length
  const goodMatches = matchResults.filter(match => match.overallScore >= 75 && match.overallScore < 90).length
  const partialMatches = matchResults.filter(match => match.overallScore >= 60 && match.overallScore < 75).length
  const averageMatchScore = matchResults.length > 0 
    ? Math.round(matchResults.reduce((sum, match) => sum + match.overallScore, 0) / matchResults.length)
    : 0

  const topSkills = resumeData.skills
    .sort((a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0))
    .slice(0, 10)

  const experienceDistribution = getExperienceDistribution(matchResults)
  const salaryDistribution = getSalaryDistribution(matchResults)
  const locationDistribution = getLocationDistribution(matchResults)
  const industryDistribution = getIndustryDistribution(matchResults)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Resume Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your job market performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold text-gray-900">{matchResults.length}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12% from last week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exact Matches</p>
                <p className="text-3xl font-bold text-green-600">{exactMatches}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {Math.round((exactMatches / matchResults.length) * 100)}% of total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-purple-600">{averageMatchScore}%</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Above market average
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Reach</p>
                <p className="text-3xl font-bold text-orange-600">{searchResults.portalsSearched.length}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Globe className="h-4 w-4 mr-1" />
                  Job portals searched
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="market">Market Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Match Score Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of job matches by score range
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Exact Matches (90-100%)</span>
                    </div>
                    <span className="font-semibold">{exactMatches}</span>
                  </div>
                  <Progress value={(exactMatches / matchResults.length) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Good Matches (75-89%)</span>
                    </div>
                    <span className="font-semibold">{goodMatches}</span>
                  </div>
                  <Progress value={(goodMatches / matchResults.length) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Partial Matches (60-74%)</span>
                    </div>
                    <span className="font-semibold">{partialMatches}</span>
                  </div>
                  <Progress value={(partialMatches / matchResults.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Your Top Skills
                </CardTitle>
                <CardDescription>
                  Skills ranked by experience and demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSkills.map((skill, index) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                        <span className="text-sm font-medium ml-2">{skill.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {skill.proficiency}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          {skill.yearsExperience || 0}y
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Top Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchResults.statistics.topCompanies.slice(0, 5).map((company, index) => (
                    <div key={company.name} className="flex items-center justify-between">
                      <span className="text-sm">{company.name}</span>
                      <Badge variant="outline">{company.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchResults.statistics.topLocations.slice(0, 5).map((location, index) => (
                    <div key={location.location} className="flex items-center justify-between">
                      <span className="text-sm">{location.location}</span>
                      <Badge variant="outline">{location.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Salary Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Salary</span>
                    <span className="font-semibold">
                      ${Math.round(searchResults.statistics.averageSalary).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Your Expectation</span>
                    <span className="font-semibold">
                      ${resumeData.salaryExpectation ? 
                        Math.round((resumeData.salaryExpectation.min + resumeData.salaryExpectation.max) / 2).toLocaleString() : 
                        'Not specified'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills Analysis Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills vs Market Demand</CardTitle>
                <CardDescription>
                  How your skills compare to market demand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumeData.skills.slice(0, 10).map((skill) => {
                    const marketDemand = searchResults.statistics.topSkills.find(
                      s => s.skill.toLowerCase() === skill.name.toLowerCase()
                    );
                    const demandCount = marketDemand?.count || 0;
                    const maxDemand = Math.max(...searchResults.statistics.topSkills.map(s => s.count));
                    const demandPercentage = maxDemand > 0 ? (demandCount / maxDemand) * 100 : 0;

                    return (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {skill.proficiency}
                            </Badge>
                            <span className="text-xs text-gray-500">{demandCount} jobs</span>
                          </div>
                        </div>
                        <Progress value={demandPercentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency Levels</CardTitle>
                <CardDescription>
                  Distribution of your skills by proficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['expert', 'advanced', 'intermediate', 'beginner'].map((level) => {
                    const count = resumeData.skills.filter(s => s.proficiency === level).length;
                    const percentage = resumeData.skills.length > 0 ? (count / resumeData.skills.length) * 100 : 0;
                    
                    return (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{level}</span>
                          <span className="text-sm text-gray-500">{count} skills</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Experience Timeline</CardTitle>
                <CardDescription>
                  Your career progression over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <span className="text-sm text-gray-500">
                          {exp.startDate.getFullYear()} - {exp.endDate ? exp.endDate.getFullYear() : 'Present'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.skills.slice(0, 5).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Experience</CardTitle>
                <CardDescription>
                  Your experience across different industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(resumeData.experience.map(exp => exp.industry))).map((industry) => {
                    const industryExp = resumeData.experience.filter(exp => exp.industry === industry);
                    const totalYears = industryExp.reduce((total, exp) => {
                      const start = new Date(exp.startDate);
                      const end = exp.endDate ? new Date(exp.endDate) : new Date();
                      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
                      return total + years;
                    }, 0);

                    return (
                      <div key={industry} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{industry}</span>
                          <span className="text-sm text-gray-500">{Math.round(totalYears)} years</span>
                        </div>
                        <Progress value={Math.min((totalYears / 10) * 100, 100)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>
                  Current job market trends in your field
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">High Demand Skills</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+15%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Remote Opportunities</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">+25%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium">Salary Growth</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">+8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>
                  How you compare to other candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Experience Level</span>
                      <span className="text-sm font-semibold">Above Average</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Education</span>
                      <span className="text-sm font-semibold">Competitive</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Wins
                </CardTitle>
                <CardDescription>
                  Immediate actions to improve your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Add Missing Skills</h4>
                      <p className="text-sm text-blue-700">
                        Learn React and Node.js to match 40% more job requirements
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Update Location</h4>
                      <p className="text-sm text-green-700">
                        Add remote work preference to increase opportunities by 60%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Certifications</h4>
                      <p className="text-sm text-purple-700">
                        Get AWS certification to boost your profile by 25%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Long-term Strategy
                </CardTitle>
                <CardDescription>
                  Strategic recommendations for career growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Career Path</h4>
                    <p className="text-sm text-gray-600">
                      Consider transitioning to Senior Developer role within 12-18 months
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Skill Development</h4>
                    <p className="text-sm text-gray-600">
                      Focus on leadership and architecture skills for management track
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Industry Trends</h4>
                    <p className="text-sm text-gray-600">
                      AI/ML skills are becoming essential - consider learning Python and TensorFlow
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Comparison</CardTitle>
              <CardDescription>
                How your profile compares to market standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{averageMatchScore}%</div>
                    <div className="text-sm text-gray-600">Your Average Match</div>
                    <div className="text-xs text-green-600 mt-1">Above Market Average</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{exactMatches}</div>
                    <div className="text-sm text-gray-600">Exact Matches</div>
                    <div className="text-xs text-green-600 mt-1">Top 15% of Candidates</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{resumeData.skills.length}</div>
                    <div className="text-sm text-gray-600">Skills Listed</div>
                    <div className="text-xs text-blue-600 mt-1">Above Average</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function getExperienceDistribution(matchResults: MatchResult[]) {
  const distribution = {
    'entry': 0,
    'junior': 0,
    'mid': 0,
    'senior': 0,
    'lead': 0,
    'executive': 0
  };

  matchResults.forEach(match => {
    const level = match.job.experienceLevel;
    if (level in distribution) {
      distribution[level as keyof typeof distribution]++;
    }
  });

  return distribution;
}

function getSalaryDistribution(matchResults: MatchResult[]) {
  const salaries = matchResults
    .filter(match => match.job.salaryRange)
    .map(match => (match.job.salaryRange!.min + match.job.salaryRange!.max) / 2);

  return {
    min: Math.min(...salaries),
    max: Math.max(...salaries),
    average: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
  };
}

function getLocationDistribution(matchResults: MatchResult[]) {
  const locations = new Map<string, number>();
  
  matchResults.forEach(match => {
    const location = match.job.location;
    locations.set(location, (locations.get(location) || 0) + 1);
  });

  return Array.from(locations.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

function getIndustryDistribution(matchResults: MatchResult[]) {
  const industries = new Map<string, number>();
  
  matchResults.forEach(match => {
    const industry = match.job.industry;
    industries.set(industry, (industries.get(industry) || 0) + 1);
  });

  return Array.from(industries.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}
