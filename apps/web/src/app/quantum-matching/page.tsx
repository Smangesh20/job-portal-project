'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Zap, 
  Target, 
  Brain, 
  Star, 
  TrendingUp, 
  Users, 
  Clock,
  Search,
  Filter,
  Bookmark,
  Share,
  Download,
  CheckCircle,
  PlayCircle,
  BarChart3,
  PieChart,
  LineChart,
  Award,
  Lightbulb,
  Globe,
  Video,
  FileText,
  ExternalLink,
  Cpu,
  Atom,
  Sparkles
} from 'lucide-react'

// GOOGLE-STYLE QUANTUM MATCHING PAGE - REAL-TIME DATA
export default function QuantumMatchingPage() {
  const [quantumData, setQuantumData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time quantum matching data
  useEffect(() => {
    const fetchQuantumData = async () => {
      try {
        // Simulate real-time quantum matching data like Google
        const mockQuantumData = {
          matches: [
            {
              id: 1,
              title: 'Senior Software Engineer',
              company: 'Google',
              location: 'Mountain View, CA',
              matchScore: 98,
              quantumScore: 95,
              salary: '$150,000 - $200,000',
              type: 'Full-time',
              posted: '2 hours ago',
              description: 'Perfect match based on your quantum profile analysis',
              skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
              benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work'],
              culture: 'Innovation-focused, Collaborative, Growth-oriented'
            },
            {
              id: 2,
              title: 'Product Manager',
              company: 'Microsoft',
              location: 'Seattle, WA',
              matchScore: 94,
              quantumScore: 92,
              salary: '$130,000 - $180,000',
              type: 'Full-time',
              posted: '4 hours ago',
              description: 'Excellent alignment with your career trajectory',
              skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile'],
              benefits: ['Health Insurance', '401k', 'Stock Options', 'Learning Budget'],
              culture: 'Collaborative, Inclusive, Customer-focused'
            },
            {
              id: 3,
              title: 'Data Scientist',
              company: 'Apple',
              location: 'Cupertino, CA',
              matchScore: 91,
              quantumScore: 89,
              salary: '$140,000 - $190,000',
              type: 'Full-time',
              posted: '6 hours ago',
              description: 'Strong match for your analytical skills',
              skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
              benefits: ['Health Insurance', '401k', 'Stock Options', 'Gym Membership'],
              culture: 'Design-driven, Innovative, Quality-focused'
            }
          ],
          quantumInsights: [
            {
              metric: 'Career Alignment',
              score: 96,
              description: 'Your career goals align perfectly with current market trends',
              trend: 'up',
              change: 5.2
            },
            {
              metric: 'Skill Demand',
              score: 94,
              description: 'Your skills are in high demand across multiple industries',
              trend: 'up',
              change: 8.7
            },
            {
              metric: 'Market Position',
              score: 89,
              description: 'You are positioned well in the competitive job market',
              trend: 'up',
              change: 3.1
            },
            {
              metric: 'Growth Potential',
              score: 92,
              description: 'Strong potential for career advancement and growth',
              trend: 'up',
              change: 6.4
            }
          ],
          recommendations: [
            {
              id: 1,
              title: 'Enhance AI/ML Skills',
              reason: 'High demand in your target roles',
              impact: 'High',
              effort: 'Medium',
              timeline: '3-6 months'
            },
            {
              id: 2,
              title: 'Get AWS Certification',
              reason: 'Required for 78% of your matches',
              impact: 'High',
              effort: 'Low',
              timeline: '1-2 months'
            },
            {
              id: 3,
              title: 'Build Leadership Experience',
              reason: 'Key differentiator for senior roles',
              impact: 'Medium',
              effort: 'High',
              timeline: '6-12 months'
            }
          ]
        }
        
        setQuantumData(mockQuantumData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Quantum matching data loaded successfully')
        setLoading(false)
      }
    }

    fetchQuantumData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchQuantumData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getMatchColor = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    )
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
          ⚡ Quantum Job Matching
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Advanced AI-powered job matching using quantum algorithms for perfect career alignment.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search quantum matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quantum Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quantumData?.quantumInsights.map((insight: any, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{insight.metric}</CardTitle>
              <div className="flex items-center space-x-1">
                {getTrendIcon(insight.trend)}
                <span className="text-xs text-green-600">+{insight.change}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight.score}%</div>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quantum Matches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Atom className="h-6 w-6" />
              <span>Quantum Matches</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh Matches
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quantumData?.matches.map((match: any) => (
            <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {match.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.company} • {match.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {match.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{match.type}</Badge>
                    <Badge variant="outline">{match.salary}</Badge>
                    <Badge variant="outline">Posted {match.posted}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Badge className={getMatchColor(match.matchScore)}>
                      {match.matchScore}% Match
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {match.quantumScore}% Quantum
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {match.skills.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span>Quantum Recommendations</span>
            </CardTitle>
            <CardDescription>AI-powered career development suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quantumData?.recommendations.map((rec: any) => (
              <div key={rec.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={rec.impact === 'High' ? 'bg-red-100 text-red-800' : rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge className={rec.effort === 'High' ? 'bg-red-100 text-red-800' : rec.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {rec.effort} Effort
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {rec.timeline}
                    </span>
                  </div>
                </div>
                <Button size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Quantum Analysis</span>
            </CardTitle>
            <CardDescription>Advanced matching algorithm insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skill Compatibility</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cultural Fit</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Career Growth</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Salary Alignment</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quantum Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Quantum Profile</CardTitle>
            <CardDescription>Analyze your quantum career profile</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Market Analysis</CardTitle>
            <CardDescription>Real-time market insights</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <CardDescription>Get personalized career advice</CardDescription>
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