'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building, 
  MapPin, 
  Users, 
  Globe, 
  Star, 
  Heart, 
  Share2, 
  MessageSquare, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Bookmark, 
  Flag, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  EyeOff, 
  Camera, 
  Video, 
  Image, 
  FileText, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target, 
  Zap, 
  Lightbulb, 
  Trophy, 
  Rocket, 
  ShieldCheck, 
  Globe2, 
  Mail, 
  Phone, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Github, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Settings, 
  MoreHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CompanyProfile {
  id: string
  name: string
  logo: string
  coverImage: string
  tagline: string
  description: string
  website: string
  founded: number
  size: string
  industry: string
  location: {
    headquarters: string
    offices: Array<{
      city: string
      country: string
      type: 'headquarters' | 'office' | 'remote'
    }>
  }
  socialMedia: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
    github?: string
  }
  contact: {
    email: string
    phone: string
    address: string
  }
  stats: {
    totalJobs: number
    activeJobs: number
    totalEmployees: number
    averageRating: number
    totalReviews: number
    responseRate: number
    averageResponseTime: number
    diversityScore: number
    cultureScore: number
    growthScore: number
    workLifeBalance: number
  }
  benefits: Array<{
    category: string
    items: string[]
  }>
  culture: {
    values: string[]
    mission: string
    vision: string
    perks: string[]
    workEnvironment: string[]
  }
  media: {
    videos: Array<{
      id: string
      title: string
      description: string
      url: string
      thumbnail: string
      duration: number
      type: 'company_culture' | 'office_tour' | 'employee_testimonial' | 'product_demo'
    }>
    images: Array<{
      id: string
      title: string
      description: string
      url: string
      type: 'office' | 'team' | 'event' | 'product'
    }>
    documents: Array<{
      id: string
      title: string
      description: string
      url: string
      type: 'brochure' | 'annual_report' | 'benefits_guide' | 'culture_deck'
    }>
  }
  reviews: Array<{
    id: string
    author: {
      name: string
      position: string
      department: string
      avatar: string
      verified: boolean
    }
    rating: number
    title: string
    content: string
    pros: string[]
    cons: string[]
    workLifeBalance: number
    culture: number
    management: number
    careerGrowth: number
    compensation: number
    overall: number
    date: Date
    helpful: number
    verified: boolean
  }>
  jobs: Array<{
    id: string
    title: string
    department: string
    location: string
    type: string
    salary: {
      min: number
      max: number
      currency: string
    }
    posted: Date
    applications: number
    urgent: boolean
    featured: boolean
  }>
  leadership: Array<{
    name: string
    position: string
    bio: string
    avatar: string
    linkedin?: string
  }>
  awards: Array<{
    title: string
    organization: string
    year: number
    description: string
    logo: string
  }>
  news: Array<{
    id: string
    title: string
    summary: string
    url: string
    publishedAt: Date
    source: string
  }>
}

const mockCompanyProfile: CompanyProfile = {
  id: 'techcorp-1',
  name: 'TechCorp',
  logo: '/logos/techcorp.png',
  coverImage: '/images/techcorp-office.jpg',
  tagline: 'Building the Future of Technology',
  description: 'TechCorp is a leading technology company focused on innovative solutions that transform industries. We are committed to creating cutting-edge products and fostering a culture of innovation, collaboration, and growth.',
  website: 'https://techcorp.com',
  founded: 2010,
  size: '1001-5000 employees',
  industry: 'Technology',
  location: {
    headquarters: 'San Francisco, CA',
    offices: [
      { city: 'San Francisco', country: 'USA', type: 'headquarters' },
      { city: 'New York', country: 'USA', type: 'office' },
      { city: 'London', country: 'UK', type: 'office' },
      { city: 'Remote', country: 'Global', type: 'remote' }
    ]
  },
  socialMedia: {
    linkedin: 'https://linkedin.com/company/techcorp',
    twitter: 'https://twitter.com/techcorp',
    github: 'https://github.com/techcorp'
  },
  contact: {
    email: 'careers@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94105'
  },
  stats: {
    totalJobs: 45,
    activeJobs: 12,
    totalEmployees: 2500,
    averageRating: 4.2,
    totalReviews: 156,
    responseRate: 89,
    averageResponseTime: 2.3,
    diversityScore: 85,
    cultureScore: 88,
    growthScore: 92,
    workLifeBalance: 82
  },
  benefits: [
    {
      category: 'Health & Wellness',
      items: ['Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Mental Health Support', 'Gym Membership']
    },
    {
      category: 'Financial',
      items: ['401k Matching', 'Stock Options', 'Performance Bonuses', 'Financial Planning']
    },
    {
      category: 'Work-Life Balance',
      items: ['Flexible Hours', 'Remote Work', 'Unlimited PTO', 'Parental Leave', 'Sabbatical']
    },
    {
      category: 'Professional Development',
      items: ['Learning Budget', 'Conference Attendance', 'Certification Support', 'Mentorship Program']
    }
  ],
  culture: {
    values: ['Innovation', 'Collaboration', 'Integrity', 'Excellence', 'Diversity'],
    mission: 'To empower people and organizations through innovative technology solutions',
    vision: 'A world where technology seamlessly enhances human potential',
    perks: ['Free Meals', 'Office Events', 'Team Building', 'Hackathons', 'Innovation Time'],
    workEnvironment: ['Open Office', 'Collaborative', 'Fast-Paced', 'Inclusive', 'Supportive']
  },
  media: {
    videos: [
      {
        id: '1',
        title: 'Our Company Culture',
        description: 'Learn about what makes TechCorp a great place to work',
        url: '/videos/company-culture.mp4',
        thumbnail: '/images/video-thumb-1.jpg',
        duration: 180,
        type: 'company_culture'
      },
      {
        id: '2',
        title: 'Office Tour',
        description: 'Take a virtual tour of our San Francisco headquarters',
        url: '/videos/office-tour.mp4',
        thumbnail: '/images/video-thumb-2.jpg',
        duration: 240,
        type: 'office_tour'
      }
    ],
    images: [
      {
        id: '1',
        title: 'Modern Office Space',
        description: 'Our open-concept office in San Francisco',
        url: '/images/office-1.jpg',
        type: 'office'
      },
      {
        id: '2',
        title: 'Team Collaboration',
        description: 'Our team working together on innovative projects',
        url: '/images/team-1.jpg',
        type: 'team'
      }
    ],
    documents: [
      {
        id: '1',
        title: 'Company Brochure',
        description: 'Learn more about our company and culture',
        url: '/documents/techcorp-brochure.pdf',
        type: 'brochure'
      }
    ]
  },
  reviews: [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        position: 'Software Engineer',
        department: 'Engineering',
        avatar: '/avatars/sarah.jpg',
        verified: true
      },
      rating: 5,
      title: 'Amazing company culture and growth opportunities',
      content: 'I\'ve been working at TechCorp for 3 years and it\'s been an incredible experience. The culture is supportive, the work is challenging, and there are endless opportunities for growth.',
      pros: ['Great culture', 'Growth opportunities', 'Flexible work', 'Smart colleagues'],
      cons: ['Fast-paced environment', 'High expectations'],
      workLifeBalance: 4,
      culture: 5,
      management: 4,
      careerGrowth: 5,
      compensation: 4,
      overall: 5,
      date: new Date('2024-01-15'),
      helpful: 12,
      verified: true
    }
  ],
  jobs: [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: { min: 120000, max: 150000, currency: 'USD' },
      posted: new Date('2024-01-20'),
      applications: 45,
      urgent: false,
      featured: true
    }
  ],
  leadership: [
    {
      name: 'John Smith',
      position: 'CEO & Co-Founder',
      bio: 'John has over 15 years of experience in technology and has led TechCorp since its founding.',
      avatar: '/avatars/john.jpg',
      linkedin: 'https://linkedin.com/in/johnsmith'
    }
  ],
  awards: [
    {
      title: 'Best Tech Company to Work For',
      organization: 'Glassdoor',
      year: 2023,
      description: 'Recognized for outstanding employee satisfaction and company culture',
      logo: '/awards/glassdoor.png'
    }
  ],
  news: [
    {
      id: '1',
      title: 'TechCorp Raises $50M Series C Funding',
      summary: 'The funding will be used to expand our engineering team and accelerate product development.',
      url: 'https://techcrunch.com/techcorp-funding',
      publishedAt: new Date('2024-01-10'),
      source: 'TechCrunch'
    }
  ]
}

export function EmployerProfile() {
  const [profile, setProfile] = useState<CompanyProfile>(mockCompanyProfile)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
          <img
            src={profile.coverImage}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-4">
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-16 h-16 rounded-lg bg-white p-2"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-lg opacity-90">{profile.tagline}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{profile.stats.averageRating}</span>
                    <span className="ml-1 text-sm opacity-75">({profile.stats.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4" />
                    <span className="ml-1">{profile.location.headquarters}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4" />
                    <span className="ml-1">{profile.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button>
            <Briefcase className="h-4 w-4 mr-2" />
            View Jobs ({profile.stats.activeJobs})
          </Button>
          <Button variant="outline">
            <Heart className="h-4 w-4 mr-2" />
            Follow
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{profile.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Founded:</span>
                      <span className="ml-2">{profile.founded}</span>
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span>
                      <span className="ml-2">{profile.industry}</span>
                    </div>
                    <div>
                      <span className="font-medium">Website:</span>
                      <a href={profile.website} className="ml-2 text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>
                      <span className="ml-2">{profile.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.totalJobs}</div>
                      <div className="text-sm text-gray-600">Total Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.stats.responseRate}%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.averageResponseTime}d</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{profile.stats.totalEmployees}</div>
                      <div className="text-sm text-gray-600">Employees</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Leadership Team */}
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.leadership.map((leader, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={leader.avatar}
                          alt={leader.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{leader.name}</h4>
                          <p className="text-sm text-gray-600">{leader.position}</p>
                          <p className="text-xs text-gray-500">{leader.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Rating */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getRatingColor(profile.stats.averageRating)}`}>
                      {profile.stats.averageRating}
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= profile.stats.averageRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {profile.stats.totalReviews} reviews
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diversity</span>
                        <span>{profile.stats.diversityScore}%</span>
                      </div>
                      <Progress value={profile.stats.diversityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Culture</span>
                        <span>{profile.stats.cultureScore}%</span>
                      </div>
                      <Progress value={profile.stats.cultureScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Growth</span>
                        <span>{profile.stats.growthScore}%</span>
                      </div>
                      <Progress value={profile.stats.growthScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Work-Life Balance</span>
                        <span>{profile.stats.workLifeBalance}%</span>
                      </div>
                      <Progress value={profile.stats.workLifeBalance} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`mailto:${profile.contact.email}`} className="text-blue-600 hover:underline">
                        {profile.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${profile.contact.phone}`} className="text-blue-600 hover:underline">
                        {profile.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{profile.contact.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    {profile.socialMedia.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialMedia.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialMedia.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.socialMedia.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.culture.values.map((value, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mission & Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Mission</h4>
                    <p className="text-sm text-gray-600">{profile.culture.mission}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Vision</h4>
                    <p className="text-sm text-gray-600">{profile.culture.vision}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.culture.workEnvironment.map((env, index) => (
                    <Badge key={index} variant="secondary">
                      {env}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perks & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.culture.perks.map((perk, index) => (
                    <Badge key={index} variant="outline">
                      {perk}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{benefit.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.author.avatar}
                      alt={review.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{review.author.name}</h4>
                          <p className="text-sm text-gray-600">
                            {review.author.position} • {review.author.department}
                            {review.author.verified && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Verified
                              </Badge>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-sm text-gray-600 mb-4">{review.content}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">Work-Life Balance</div>
                          <div className="text-lg font-bold">{review.workLifeBalance}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Culture</div>
                          <div className="text-lg font-bold">{review.culture}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Management</div>
                          <div className="text-lg font-bold">{review.management}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Career Growth</div>
                          <div className="text-lg font-bold">{review.careerGrowth}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Compensation</div>
                          <div className="text-lg font-bold">{review.compensation}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-green-600 mb-1">Pros</h6>
                          <ul className="text-sm text-gray-600">
                            {review.pros.map((pro, index) => (
                              <li key={index}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-red-600 mb-1">Cons</h6>
                          <ul className="text-sm text-gray-600">
                            {review.cons.map((con, index) => (
                              <li key={index}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Not Helpful
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="space-y-4">
            {profile.jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {job.featured && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Featured
                          </Badge>
                        )}
                        {job.urgent && (
                          <Badge variant="destructive">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.department}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications} applications
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-lg font-semibold text-green-600">
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted {formatDate(job.posted)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Company Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.media.videos.map((video) => (
                  <div key={video.id} className="relative group cursor-pointer">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-medium">{video.title}</h4>
                      <p className="text-sm opacity-90">{video.description}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Company Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.media.images.map((image) => (
                  <div key={image.id} className="relative group cursor-pointer">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.media.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{doc.title}</h4>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
