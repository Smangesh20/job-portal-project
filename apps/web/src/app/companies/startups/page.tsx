'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Rocket, 
  TrendingUp, 
  Star, 
  MapPin, 
  Users, 
  Award,
  ExternalLink,
  Heart,
  Eye,
  Zap
} from 'lucide-react'

export default function StartupsPage() {
  const [startups, setStartups] = useState([
    {
      id: 1,
      name: 'OpenAI',
      logo: '/logos/openai.png',
      industry: 'AI & Machine Learning',
      location: 'San Francisco, CA',
      employees: '1,500+',
      funding: '$13.5B',
      stage: 'Series C',
      rating: 4.9,
      jobs: 45,
      description: 'Leading AI research company creating safe artificial general intelligence.',
      benefits: ['Equity', 'Health Insurance', 'Learning Budget', 'Flexible Hours'],
      isHot: true,
      founded: 2015
    },
    {
      id: 2,
      name: 'Anthropic',
      logo: '/logos/anthropic.png',
      industry: 'AI Safety',
      location: 'San Francisco, CA',
      employees: '500+',
      funding: '$7.3B',
      stage: 'Series C',
      rating: 4.8,
      jobs: 32,
      description: 'AI safety company building helpful, harmless, and honest AI systems.',
      benefits: ['Equity', 'Health Insurance', 'Research Time', 'Conference Budget'],
      isHot: true,
      founded: 2021
    },
    {
      id: 3,
      name: 'Stripe',
      logo: '/logos/stripe.png',
      industry: 'Fintech',
      location: 'San Francisco, CA',
      employees: '8,000+',
      funding: '$9.2B',
      stage: 'Series H',
      rating: 4.7,
      jobs: 120,
      description: 'Global payment processing platform for internet businesses.',
      benefits: ['Equity', 'Health Insurance', '401k', 'Remote Work'],
      isHot: true,
      founded: 2010
    },
    {
      id: 4,
      name: 'Notion',
      logo: '/logos/notion.png',
      industry: 'Productivity Software',
      location: 'San Francisco, CA',
      employees: '500+',
      funding: '$343M',
      stage: 'Series C',
      rating: 4.6,
      jobs: 28,
      description: 'All-in-one workspace for notes, docs, wikis, and project management.',
      benefits: ['Equity', 'Health Insurance', 'Learning Budget', 'Flexible Hours'],
      isHot: false,
      founded: 2016
    },
    {
      id: 5,
      name: 'Figma',
      logo: '/logos/figma.png',
      industry: 'Design Tools',
      location: 'San Francisco, CA',
      employees: '1,200+',
      funding: '$333M',
      stage: 'Series D',
      rating: 4.8,
      jobs: 65,
      description: 'Collaborative interface design tool for teams.',
      benefits: ['Equity', 'Health Insurance', 'Design Budget', 'Creative Time'],
      isHot: true,
      founded: 2012
    },
    {
      id: 6,
      name: 'Vercel',
      logo: '/logos/vercel.png',
      industry: 'Web Development',
      location: 'San Francisco, CA',
      employees: '300+',
      funding: '$250M',
      stage: 'Series D',
      rating: 4.7,
      jobs: 18,
      description: 'Platform for frontend developers to deploy and scale web applications.',
      benefits: ['Equity', 'Health Insurance', 'Open Source Time', 'Conference Budget'],
      isHot: true,
      founded: 2015
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Hot Startups</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Join the most innovative and fast-growing startups shaping the future
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Rocket className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{startups.length}</p>
                  <p className="text-gray-600">Hot Startups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">$31B+</p>
                  <p className="text-gray-600">Total Funding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">12,000+</p>
                  <p className="text-gray-600">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">308</p>
                  <p className="text-gray-600">Open Positions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Startups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{startup.name}</CardTitle>
                        {startup.isHot && (
                          <Badge variant="destructive" className="text-xs">
                            🔥 Hot
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{startup.industry}</CardDescription>
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{startup.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{startup.funding} • {startup.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{startup.rating}/5.0</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {startup.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {startup.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {startup.benefits.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{startup.benefits.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="default" className="bg-orange-100 text-orange-800">
                      {startup.jobs} Open Jobs
                    </Badge>
                    <Button size="sm" className="flex items-center gap-1">
                      View Jobs
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}