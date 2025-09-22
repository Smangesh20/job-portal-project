'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Target, 
  BarChart3, 
  Zap, 
  Star, 
  MapPin, 
  Building, 
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Code,
  GraduationCap,
  Sparkles,
  Cpu,
  Rocket,
  Eye,
  ExternalLink,
  Filter,
  SortAsc,
  Search,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react'
import { ResumeUpload } from '@/components/resume/resume-upload'
import { ResumeAnalyticsDashboard } from '@/components/analytics/resume-analytics-dashboard'
import { ResumeData } from '@/services/resume-parser'
import { MatchResult, SearchResults } from '@/services/job-aggregator'
import { resumeParser } from '@/services/resume-parser'
import { jobAggregator } from '@/services/job-aggregator'
import { intelligentMatcher } from '@/services/intelligent-matcher'

export default function ResumeMatchingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('upload')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchCriteria, setSearchCriteria] = useState<any>(null)

  const handleResumeParsed = async (data: ResumeData) => {
    setResumeData(data)
    setError(null)
    setIsLoading(true)

    try {
      // Generate search criteria from resume data
      const criteria = {
        keywords: data.extractedKeywords,
        skills: data.skills.map(s => s.name),
        experienceLevels: [data.experience[0]?.position || 'mid'],
        industries: [data.industry],
        location: data.personalInfo.location,
        remote: true
      }
      setSearchCriteria(criteria)

      // Search for jobs
      const results = await jobAggregator.searchJobs(criteria)
      setSearchResults(results)

      // Match resume to jobs
      const matches = await intelligentMatcher.matchResumeToJobs(data, results)
      setMatchResults(matches)

      // Switch to results tab
      setActiveTab('results')
    } catch (err) {
      console.error('Job search failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to search for jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const retrySearch = async () => {
    if (!resumeData || !searchCriteria) return

    setIsLoading(true)
    setError(null)

    try {
      const results = await jobAggregator.searchJobs(searchCriteria)
      setSearchResults(results)

      const matches = await intelligentMatcher.matchResumeToJobs(resumeData, results)
      setMatchResults(matches)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search for jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 75) return 'bg-blue-100 text-blue-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Exact Match'
    if (score >= 75) return 'Good Match'
    if (score >= 60) return 'Partial Match'
    return 'Low Match'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 mr-3 text-blue-600" />
                AI-Powered Resume Matching
              </h1>
              <p className="text-gray-600 mt-1">
                Upload your resume and let our AI find the perfect job matches across multiple portals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-3" onClick={retrySearch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="results" disabled={!matchResults.length}>
              Job Matches ({matchResults.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled={!resumeData}>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" disabled={!matchResults.length}>
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <ResumeUpload
              onResumeParsed={handleResumeParsed}
              onError={handleError}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Searching for Jobs...</h3>
                  <p className="text-gray-600">Our AI is finding the best matches for your profile</p>
                </div>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                          <p className="text-3xl font-bold text-gray-900">{matchResults.length}</p>
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
                          <p className="text-3xl font-bold text-green-600">
                            {matchResults.filter(m => m.overallScore >= 90).length}
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
                          <p className="text-sm font-medium text-gray-600">Good Matches</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {matchResults.filter(m => m.overallScore >= 75 && m.overallScore < 90).length}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Portals Searched</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {searchResults?.portalsSearched.length || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Job Matches</h2>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {matchResults.map((match, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {match.job.title}
                                </h3>
                                <Badge className={getMatchBadgeColor(match.overallScore)}>
                                  {getMatchLabel(match.overallScore)} ({match.overallScore}%)
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Building className="h-4 w-4 mr-1" />
                                  {match.job.company}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {match.job.location}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {match.job.postedDate.toLocaleDateString()}
                                </div>
                                {match.job.salaryRange && (
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    ${match.job.salaryRange.min.toLocaleString()} - ${match.job.salaryRange.max.toLocaleString()}
                                  </div>
                                )}
                              </div>

                              <p className="text-gray-700 mb-4 line-clamp-2">
                                {match.job.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {match.job.skills.slice(0, 6).map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {match.job.skills.length > 6 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{match.job.skills.length - 6} more
                                  </Badge>
                                )}
                              </div>

                              {/* Match Reasons */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Why this matches:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {match.reasoning.slice(0, 3).map((reason, reasonIndex) => (
                                    <Badge key={reasonIndex} variant="secondary" className="text-xs">
                                      {reason}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-3 ml-6">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {match.overallScore}%
                                </div>
                                <div className="text-xs text-gray-500">Match Score</div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {resumeData && searchResults && matchResults.length > 0 && (
              <ResumeAnalyticsDashboard
                resumeData={resumeData}
                matchResults={matchResults}
                searchResults={searchResults}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>
                    Personalized suggestions to improve your job prospects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matchResults.slice(0, 3).map((match, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-sm">{match.job.title}</h4>
                        <div className="space-y-1">
                          {match.recommendations.slice(0, 2).map((rec, recIndex) => (
                            <div key={recIndex} className="text-sm text-gray-600 flex items-start">
                              <ArrowRight className="h-3 w-3 mr-1 mt-1 flex-shrink-0" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Market Insights
                  </CardTitle>
                  <CardDescription>
                    Key trends and opportunities in your field
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
            </div>

            {/* Quantum Computing Integration */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Cpu className="h-5 w-5 mr-2" />
                  Quantum-Powered Insights
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Advanced quantum computing analysis for deeper job market insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Rocket className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Pattern Recognition</h4>
                    <p className="text-sm text-purple-700">
                      Quantum algorithms identify hidden job market patterns
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Predictive Analysis</h4>
                    <p className="text-sm text-purple-700">
                      Forecast future job opportunities and skill demands
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Optimization</h4>
                    <p className="text-sm text-purple-700">
                      Optimize your profile for maximum job match potential
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
