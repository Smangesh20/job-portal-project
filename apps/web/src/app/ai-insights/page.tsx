'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  TrendingUp, 
  Star, 
  Target, 
  Users, 
  Award,
  ExternalLink,
  Heart,
  Eye,
  Zap,
  Lightbulb,
  BarChart3
} from 'lucide-react'

export default function AIInsightsPage() {
  const [insights, setInsights] = useState([
    {
      id: 1,
      title: 'AI-Powered Job Matching',
      description: 'Our advanced AI analyzes your skills, experience, and preferences to find the perfect job matches.',
      category: 'Job Matching',
      accuracy: 98,
      jobs: 1250,
      icon: Brain,
      color: 'blue',
      features: ['Skill Analysis', 'Preference Learning', 'Market Trends', 'Real-time Updates']
    },
    {
      id: 2,
      title: 'Quantum Resume Optimization',
      description: 'Revolutionary quantum computing technology optimizes your resume for maximum impact.',
      category: 'Resume Enhancement',
      accuracy: 95,
      jobs: 890,
      icon: Zap,
      color: 'purple',
      features: ['ATS Optimization', 'Keyword Analysis', 'Format Enhancement', 'Impact Scoring']
    },
    {
      id: 3,
      title: 'Predictive Career Analytics',
      description: 'AI predicts your career trajectory and suggests optimal career moves based on market data.',
      category: 'Career Planning',
      accuracy: 92,
      jobs: 650,
      icon: TrendingUp,
      color: 'green',
      features: ['Career Path Analysis', 'Salary Predictions', 'Skill Gap Analysis', 'Market Insights']
    },
    {
      id: 4,
      title: 'Smart Interview Preparation',
      description: 'AI-powered interview prep with personalized questions and real-time feedback.',
      category: 'Interview Prep',
      accuracy: 96,
      jobs: 420,
      icon: Target,
      color: 'orange',
      features: ['Question Generation', 'Answer Analysis', 'Confidence Scoring', 'Improvement Tips']
    },
    {
      id: 5,
      title: 'Intelligent Networking',
      description: 'AI identifies the best networking opportunities and connections for your career growth.',
      category: 'Networking',
      accuracy: 89,
      jobs: 320,
      icon: Users,
      color: 'pink',
      features: ['Connection Suggestions', 'Event Recommendations', 'Message Templates', 'Follow-up Reminders']
    },
    {
      id: 6,
      title: 'Market Intelligence',
      description: 'Real-time market analysis and industry insights to guide your career decisions.',
      category: 'Market Analysis',
      accuracy: 94,
      jobs: 780,
      icon: BarChart3,
      color: 'indigo',
      features: ['Industry Trends', 'Salary Benchmarks', 'Company Analysis', 'Growth Projections']
    }
  ])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <Badge variant="default" className="bg-green-100 text-green-800">
              NEW
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Harness the power of artificial intelligence to accelerate your career growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
                  <p className="text-gray-600">AI Features</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">96%</p>
                  <p className="text-gray-600">Avg Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">4,310</p>
                  <p className="text-gray-600">AI-Matched Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => {
            const IconComponent = insight.icon
            return (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(insight.color)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription className="text-sm">{insight.category}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{insight.accuracy}% accuracy</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{insight.jobs} jobs</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {insight.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {insight.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{insight.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="default" className={getColorClasses(insight.color)}>
                        AI Powered
                      </Badge>
                      <Button size="sm" className="flex items-center gap-1">
                        Try Now
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}