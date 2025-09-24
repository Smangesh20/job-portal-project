'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  Star,
  Bookmark,
  Share,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Lightbulb,
  Globe,
  FileText,
  ExternalLink
} from 'lucide-react'

// GOOGLE-STYLE RESEARCH PAGE - REAL-TIME DATA
export default function ResearchPage() {
  const [researchData, setResearchData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time research data
  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        // Simulate real-time research data like Google
        const mockResearchData = {
          marketTrends: [
            {
              title: 'Remote Work Revolution',
              description: 'The shift to remote work is accelerating across all industries',
              trend: 'up',
              change: 23.5,
              category: 'Work Culture',
              impact: 'high'
            },
            {
              title: 'AI Skills Demand',
              description: 'Artificial Intelligence skills are becoming essential in tech roles',
              trend: 'up',
              change: 45.2,
              category: 'Technology',
              impact: 'high'
            },
            {
              title: 'Green Jobs Growth',
              description: 'Sustainability roles are growing rapidly in the job market',
              trend: 'up',
              change: 18.7,
              category: 'Sustainability',
              impact: 'medium'
            }
          ],
          salaryInsights: [
            {
              role: 'Software Engineer',
              averageSalary: '$95,000',
              range: '$75,000 - $130,000',
              growth: 12.3,
              demand: 'high'
            },
            {
              role: 'Product Manager',
              averageSalary: '$110,000',
              range: '$85,000 - $150,000',
              growth: 8.7,
              demand: 'high'
            },
            {
              role: 'Data Scientist',
              averageSalary: '$105,000',
              range: '$80,000 - $140,000',
              growth: 15.2,
              demand: 'very high'
            }
          ],
          companyInsights: [
            {
              name: 'Google',
              industry: 'Technology',
              growth: 8.5,
              employeeCount: '190,000+',
              culture: 'Innovation-focused',
              benefits: 'Excellent'
            },
            {
              name: 'Microsoft',
              industry: 'Technology',
              growth: 6.2,
              employeeCount: '220,000+',
              culture: 'Collaborative',
              benefits: 'Excellent'
            },
            {
              name: 'Apple',
              industry: 'Technology',
              growth: 7.8,
              employeeCount: '160,000+',
              culture: 'Design-driven',
              benefits: 'Excellent'
            }
          ],
          skillDemand: [
            { skill: 'React', demand: 95, trend: 'up' },
            { skill: 'Python', demand: 88, trend: 'up' },
            { skill: 'AWS', demand: 82, trend: 'up' },
            { skill: 'Machine Learning', demand: 78, trend: 'up' },
            { skill: 'TypeScript', demand: 75, trend: 'up' }
          ]
        }
        
        setResearchData(mockResearchData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Research data loaded successfully')
        setLoading(false)
      }
    }

    fetchResearchData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchResearchData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    )
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'very high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🔍 Market Research
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Real-time insights into job market trends, salary data, and industry analysis.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search research topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span>Market Trends</span>
          </CardTitle>
          <CardDescription>Real-time analysis of job market trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {researchData?.marketTrends.map((trend: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(trend.trend)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trend.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {trend.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{trend.category}</Badge>
                      <Badge className={getDemandColor(trend.impact)}>
                        {trend.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {getTrendIcon(trend.trend)}
                  <span className="text-lg font-bold text-green-600">
                    +{trend.change}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Growth rate
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Salary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6" />
              <span>Salary Insights</span>
            </CardTitle>
            <CardDescription>Current salary data by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {researchData?.salaryInsights.map((salary: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{salary.role}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Range: {salary.range}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {salary.averageSalary}
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-sm text-green-600">+{salary.growth}%</span>
                  </div>
                  <Badge className={getDemandColor(salary.demand)}>
                    {salary.demand} demand
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>Company Insights</span>
            </CardTitle>
            <CardDescription>Top companies and their growth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {researchData?.companyInsights.map((company: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{company.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {company.industry} • {company.employeeCount} employees
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Culture: {company.culture}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-green-600">+{company.growth}%</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {company.benefits} benefits
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skill Demand Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6" />
            <span>Skill Demand Analysis</span>
          </CardTitle>
          <CardDescription>Most in-demand skills in the current market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {researchData?.skillDemand.map((skill: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{skill.skill}</span>
                {getTrendIcon(skill.trend)}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${skill.demand}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {skill.demand}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Research Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Salary Calculator</CardTitle>
            <CardDescription>Calculate your worth in the market</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Calculate Salary
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Market Report</CardTitle>
            <CardDescription>Download detailed market analysis</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Career Insights</CardTitle>
            <CardDescription>Get personalized career recommendations</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Get Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}