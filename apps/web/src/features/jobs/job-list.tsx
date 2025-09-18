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
  TrendingUp,
  Users,
  Briefcase,
  Calendar
} from 'lucide-react'

const jobListings = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    logo: '/logos/techcorp.png',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    matchScore: 94,
    postedDate: '2 hours ago',
    jobType: 'Full-time',
    isRemote: true,
    isUrgent: false,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    description: 'Join our team to build the next generation of web applications...',
    isBookmarked: false,
    views: 245,
    applications: 12,
    companySize: '201-500 employees',
    benefits: ['Health Insurance', '401k', 'Stock Options']
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    logo: '/logos/startupxyz.png',
    location: 'Remote',
    salary: '$100,000 - $130,000',
    matchScore: 89,
    postedDate: '1 day ago',
    jobType: 'Full-time',
    isRemote: true,
    isUrgent: true,
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    description: 'We\'re looking for a passionate full-stack engineer...',
    isBookmarked: true,
    views: 189,
    applications: 8,
    companySize: '11-50 employees',
    benefits: ['Flexible Hours', 'Remote Work', 'Learning Budget']
  },
  {
    id: 3,
    title: 'React Developer',
    company: 'InnovateLab',
    logo: '/logos/innovate.png',
    location: 'New York, NY',
    salary: '$90,000 - $120,000',
    matchScore: 91,
    postedDate: '3 days ago',
    jobType: 'Full-time',
    isRemote: false,
    isUrgent: false,
    skills: ['React', 'Redux', 'Jest', 'Webpack'],
    description: 'Help us build innovative solutions for our enterprise clients...',
    isBookmarked: false,
    views: 312,
    applications: 15,
    companySize: '51-200 employees',
    benefits: ['Health Insurance', 'Dental', 'Vision']
  },
  {
    id: 4,
    title: 'Frontend Engineer',
    company: 'DesignStudio',
    logo: '/logos/design.png',
    location: 'Los Angeles, CA',
    salary: '$95,000 - $125,000',
    matchScore: 87,
    postedDate: '1 week ago',
    jobType: 'Full-time',
    isRemote: true,
    isUrgent: false,
    skills: ['Vue.js', 'JavaScript', 'CSS', 'Figma'],
    description: 'Create beautiful and intuitive user interfaces...',
    isBookmarked: false,
    views: 156,
    applications: 6,
    companySize: '11-50 employees',
    benefits: ['Creative Freedom', 'Flexible Schedule', 'Team Events']
  },
  {
    id: 5,
    title: 'Software Developer',
    company: 'Enterprise Solutions',
    logo: '/logos/enterprise.png',
    location: 'Chicago, IL',
    salary: '$85,000 - $110,000',
    matchScore: 82,
    postedDate: '2 weeks ago',
    jobType: 'Full-time',
    isRemote: false,
    isUrgent: false,
    skills: ['Java', 'Spring', 'MySQL', 'Docker'],
    description: 'Develop enterprise-level applications for Fortune 500 companies...',
    isBookmarked: false,
    views: 89,
    applications: 4,
    companySize: '1000+ employees',
    benefits: ['Comprehensive Benefits', 'Career Growth', 'Stability']
  }
]

export function JobList() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('relevance')
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([2])

  const toggleBookmark = (jobId: number) => {
    if (bookmarkedJobs.includes(jobId)) {
      setBookmarkedJobs(bookmarkedJobs.filter(id => id !== jobId))
    } else {
      setBookmarkedJobs([...bookmarkedJobs, jobId])
    }
  }

  const sortedJobs = [...jobListings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case 'salary':
        return parseInt(b.salary.split('-')[0].replace(/[$,]/g, '')) - parseInt(a.salary.split('-')[0].replace(/[$,]/g, ''))
      case 'match':
        return b.matchScore - a.matchScore
      default:
        return b.matchScore - a.matchScore
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job Listings</CardTitle>
            <p className="text-sm text-muted-foreground">
              {jobListings.length} jobs found
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="salary">Salary</option>
              <option value="match">Match Score</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedJobs.map((job) => (
          <div
            key={job.id}
            className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
              selectedJob === job.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedJob(job.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg hover:text-blue-600">
                      {job.title}
                    </h3>
                    {job.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.companySize}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBookmark(job.id)
                }}
                className={`p-2 ${bookmarkedJobs.includes(job.id) ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedJobs.includes(job.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Match Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Match Score</span>
                <span className="text-sm font-bold text-green-600">{job.matchScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${job.matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-1" />
                {job.postedDate}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Eye className="h-4 w-4 mr-1" />
                {job.views} views
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4 mr-1" />
                {job.applications} applied
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Job Type and Remote */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {job.jobType}
                </Badge>
                {job.isRemote && (
                  <Badge variant="outline" className="text-xs">
                    Remote
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                High Demand
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                Apply Now
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBookmark(job.id)
                }}
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedJobs.includes(job.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        ))}

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
