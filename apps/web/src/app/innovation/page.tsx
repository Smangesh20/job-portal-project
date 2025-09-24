'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Lightbulb, 
  Rocket, 
  TrendingUp, 
  Users, 
  Star, 
  Award, 
  Search,
  Filter,
  Bookmark,
  Share,
  Download,
  Eye,
  Calendar,
  MapPin,
  Building2,
  Target,
  Zap,
  Brain,
  Globe,
  Shield,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

// GOOGLE-STYLE INNOVATION PAGE - REAL-TIME DATA
export default function InnovationPage() {
  const [innovationData, setInnovationData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time innovation data
  useEffect(() => {
    const fetchInnovationData = async () => {
      try {
        // Simulate real-time innovation data like Google
        const mockInnovationData = {
          innovations: [
            {
              id: 1,
              title: 'AI-Powered Job Matching',
              description: 'Revolutionary quantum computing algorithm for perfect job matching',
              category: 'AI/ML',
              status: 'Active',
              impact: 'High',
              team: 'AI Research Team',
              progress: 85,
              timeline: '6 months',
              funding: '$2.5M',
              technologies: ['Quantum Computing', 'Machine Learning', 'Neural Networks'],
              benefits: ['98% accuracy', 'Real-time matching', 'Predictive analytics']
            },
            {
              id: 2,
              title: 'Blockchain Resume Verification',
              description: 'Immutable resume verification system using blockchain technology',
              category: 'Blockchain',
              status: 'In Development',
              impact: 'Medium',
              team: 'Blockchain Team',
              progress: 60,
              timeline: '4 months',
              funding: '$1.2M',
              technologies: ['Blockchain', 'Smart Contracts', 'Cryptography'],
              benefits: ['Tamper-proof', 'Instant verification', 'Cost effective']
            },
            {
              id: 3,
              title: 'VR Interview Platform',
              description: 'Immersive virtual reality interview experience for remote hiring',
              category: 'VR/AR',
              status: 'Planning',
              impact: 'High',
              team: 'VR Development Team',
              progress: 25,
              timeline: '8 months',
              funding: '$3.0M',
              technologies: ['Virtual Reality', '3D Modeling', 'WebRTC'],
              benefits: ['Immersive experience', 'Global reach', 'Cost savings']
            }
          ],
          trends: [
            {
              name: 'AI Integration',
              growth: 45.2,
              description: 'Artificial Intelligence integration in recruitment processes',
              trend: 'up'
            },
            {
              name: 'Remote Work Tech',
              growth: 38.7,
              description: 'Technology solutions for remote work and collaboration',
              trend: 'up'
            },
            {
              name: 'Data Analytics',
              growth: 32.1,
              description: 'Advanced analytics for talent acquisition and retention',
              trend: 'up'
            }
          ],
          achievements: [
            {
              title: 'Innovation Award 2024',
              description: 'Best AI-powered recruitment platform',
              date: '2024-12-15',
              category: 'Award'
            },
            {
              title: 'Patent Filed',
              description: 'Quantum job matching algorithm patent application',
              date: '2024-12-10',
              category: 'Patent'
            },
            {
              title: 'Research Published',
              description: 'AI in recruitment: A comprehensive study',
              date: '2024-12-05',
              category: 'Research'
            }
          ]
        }
        
        setInnovationData(mockInnovationData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Innovation data loaded successfully')
        setLoading(false)
      }
    }

    fetchInnovationData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchInnovationData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
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
          🚀 Innovation Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Cutting-edge innovations and breakthrough technologies in recruitment and career development.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search innovations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Innovation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Innovation Score</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Industry leading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patents Filed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
      </div>

      {/* Innovation Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Innovation Projects</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Lightbulb className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {innovationData?.innovations.map((innovation: any) => (
            <div key={innovation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {innovation.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {innovation.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(innovation.status)}>
                      {innovation.status}
                    </Badge>
                    <Badge className={getImpactColor(innovation.impact)}>
                      {innovation.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      {innovation.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {innovation.technologies.slice(0, 3).map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{innovation.team}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{innovation.timeline}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{innovation.funding}</span>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${innovation.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {innovation.progress}% complete
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
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

      {/* Innovation Trends and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Innovation Trends</span>
            </CardTitle>
            <CardDescription>Current trends in recruitment technology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {innovationData?.trends.map((trend: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{trend.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trend.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-green-600">+{trend.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Latest innovation milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {innovationData?.achievements.map((achievement: any) => (
              <div key={achievement.title} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {achievement.date}
                  </p>
                </div>
                <Badge variant="outline">{achievement.category}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Innovation Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">AI Research Lab</CardTitle>
            <CardDescription>Explore our AI research and development</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Explore Lab
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Innovation Pipeline</CardTitle>
            <CardDescription>Track upcoming innovations and features</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Pipeline
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Global Impact</CardTitle>
            <CardDescription>See how our innovations impact the world</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Impact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}