'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  TrendingUp, 
  Star, 
  MapPin, 
  Users, 
  Award,
  ExternalLink,
  Heart,
  Eye,
  Crown
} from 'lucide-react'

export default function Fortune500Page() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Walmart',
      logo: '/logos/walmart.png',
      industry: 'Retail',
      location: 'Bentonville, AR',
      employees: '2.3M+',
      revenue: '$611B',
      rank: 1,
      rating: 4.2,
      jobs: 2100,
      description: 'World\'s largest retailer with operations in 24 countries.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Employee Discounts'],
      isFortune500: true,
      founded: 1962
    },
    {
      id: 2,
      name: 'Amazon',
      logo: '/logos/amazon.png',
      industry: 'E-commerce & Cloud',
      location: 'Seattle, WA',
      employees: '1.5M+',
      revenue: '$574B',
      rank: 2,
      rating: 4.5,
      jobs: 3200,
      description: 'Global leader in e-commerce, cloud computing, and artificial intelligence.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Career Development'],
      isFortune500: true,
      founded: 1994
    },
    {
      id: 3,
      name: 'Apple',
      logo: '/logos/apple.png',
      industry: 'Technology',
      location: 'Cupertino, CA',
      employees: '164,000+',
      revenue: '$394B',
      rank: 3,
      rating: 4.6,
      jobs: 1800,
      description: 'Innovative technology company creating revolutionary products and services.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Product Discounts'],
      isFortune500: true,
      founded: 1976
    },
    {
      id: 4,
      name: 'CVS Health',
      logo: '/logos/cvs.png',
      industry: 'Healthcare',
      location: 'Woonsocket, RI',
      employees: '300,000+',
      revenue: '$322B',
      rank: 4,
      rating: 4.1,
      jobs: 950,
      description: 'Leading healthcare company providing pharmacy and health services.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Health Services'],
      isFortune500: true,
      founded: 1963
    },
    {
      id: 5,
      name: 'UnitedHealth Group',
      logo: '/logos/unitedhealth.png',
      industry: 'Healthcare',
      location: 'Minnetonka, MN',
      employees: '400,000+',
      revenue: '$324B',
      rank: 5,
      rating: 4.3,
      jobs: 1200,
      description: 'Diversified health care company serving millions of people worldwide.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Wellness Programs'],
      isFortune500: true,
      founded: 1977
    },
    {
      id: 6,
      name: 'Berkshire Hathaway',
      logo: '/logos/berkshire.png',
      industry: 'Conglomerate',
      location: 'Omaha, NE',
      employees: '372,000+',
      revenue: '$302B',
      rank: 6,
      rating: 4.4,
      jobs: 450,
      description: 'Multinational conglomerate holding company with diverse business interests.',
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Investment Opportunities'],
      isFortune500: true,
      founded: 1839
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
            <Crown className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Fortune 500 Companies</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Join the most prestigious and largest companies in the world
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                  <p className="text-gray-600">Fortune 500</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">$2.5T+</p>
                  <p className="text-gray-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">5.1M+</p>
                  <p className="text-gray-600">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">9,700+</p>
                  <p className="text-gray-600">Open Positions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                          #{company.rank}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{company.industry}</CardDescription>
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
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{company.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>{company.revenue} revenue</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{company.rating}/5.0</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {company.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {company.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {company.benefits.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{company.benefits.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      {company.jobs} Open Jobs
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