'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Clock, 
  DollarSign,
  Bookmark,
  Star,
  Eye,
  Users,
  Briefcase,
  Calendar,
  Share2,
  Flag,
  Heart,
  MessageSquare,
  Building,
  Globe,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const jobDetails = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  logo: '/logos/techcorp.png',
  location: 'San Francisco, CA',
  salary: '$120,000 - $150,000',
  matchScore: 94,
  postedDate: '2024-01-15',
  jobType: 'Full-time',
  isRemote: true,
  isUrgent: false,
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
  description: `We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining our web applications using modern technologies.

**What you'll do:**
- Develop and maintain responsive web applications
- Collaborate with designers and backend developers
- Write clean, maintainable, and testable code
- Participate in code reviews and technical discussions
- Mentor junior developers

**Requirements:**
- 5+ years of frontend development experience
- Strong proficiency in React and TypeScript
- Experience with modern build tools and testing frameworks
- Excellent communication skills
- Bachelor's degree in Computer Science or related field`,
  requirements: [
    '5+ years of frontend development experience',
    'Strong proficiency in React and TypeScript',
    'Experience with modern build tools and testing frameworks',
    'Excellent communication skills',
    'Bachelor\'s degree in Computer Science or related field'
  ],
  responsibilities: [
    'Develop and maintain responsive web applications',
    'Collaborate with designers and backend developers',
    'Write clean, maintainable, and testable code',
    'Participate in code reviews and technical discussions',
    'Mentor junior developers'
  ],
  benefits: [
    'Competitive salary and equity',
    'Comprehensive health, dental, and vision insurance',
    '401(k) with company matching',
    'Flexible work hours and remote work options',
    'Professional development budget',
    'Unlimited vacation policy',
    'Top-tier equipment and tools'
  ],
  companyInfo: {
    name: 'TechCorp',
    size: '201-500 employees',
    industry: 'Technology',
    founded: '2015',
    website: 'https://techcorp.com',
    description: 'TechCorp is a leading technology company focused on building innovative solutions for the modern web. We pride ourselves on our collaborative culture and commitment to excellence.',
    rating: 4.5,
    reviews: 234
  },
  views: 1247,
  applications: 89,
  isBookmarked: false,
  isApplied: false
}

export function JobDetails() {
  const [isBookmarked, setIsBookmarked] = useState(jobDetails.isBookmarked)
  const [isApplied, setIsApplied] = useState(jobDetails.isApplied)

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleApply = () => {
    setIsApplied(true)
    // Handle application logic
  }

  return (
    <div className="space-y-6 sticky top-6">
      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {jobDetails.company.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{jobDetails.title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{jobDetails.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {jobDetails.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {jobDetails.postedDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={isBookmarked ? 'text-blue-600 border-blue-600' : ''}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Match Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Match Score</span>
              <span className="text-lg font-bold text-green-600">{jobDetails.matchScore}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${jobDetails.matchScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Excellent match based on your skills and experience</p>
          </div>

          {/* Job Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{jobDetails.views}</div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{jobDetails.applications}</div>
              <div className="text-xs text-gray-500">Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24h</div>
              <div className="text-xs text-gray-500">Avg. Response</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Apply Button */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleApply}
              disabled={isApplied}
            >
              {isApplied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Application Submitted
                </>
              ) : (
                'Apply Now'
              )}
            </Button>
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Recruiter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">Salary:</span>
              <span className="ml-2">{jobDetails.salary}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium">Type:</span>
              <span className="ml-2">{jobDetails.jobType}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-purple-600" />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{jobDetails.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-orange-600" />
              <span className="font-medium">Posted:</span>
              <span className="ml-2">{jobDetails.postedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Required Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {jobDetails.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>About {jobDetails.companyInfo.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{jobDetails.companyInfo.rating}</span>
              <span className="text-sm text-gray-500">({jobDetails.companyInfo.reviews} reviews)</span>
            </div>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-1" />
              Website
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>{jobDetails.companyInfo.size}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-400" />
              <span>{jobDetails.companyInfo.industry}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {jobDetails.companyInfo.description}
          </p>
        </CardContent>
      </Card>

      {/* Similar Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((job) => (
            <div key={job} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">TC</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Frontend Developer</h4>
                <p className="text-xs text-gray-500">TechCorp • San Francisco, CA</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs">95% match</Badge>
                <p className="text-xs text-gray-500 mt-1">$110k - $140k</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Similar Jobs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
