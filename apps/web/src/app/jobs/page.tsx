'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Quantum Tech Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      posted: '2 days ago',
      description: 'Join our quantum computing team to build next-generation applications.',
      tags: ['React', 'Node.js', 'Quantum Computing', 'Remote'],
      rating: 4.8,
      logo: '/logos/quantum-tech.png'
    },
    {
      id: 2,
      title: 'AI Research Scientist',
      company: 'AI Innovations Inc',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$150k - $200k',
      posted: '1 day ago',
      description: 'Lead cutting-edge AI research in machine learning and neural networks.',
      tags: ['Python', 'TensorFlow', 'Research', 'PhD'],
      rating: 4.6,
      logo: '/logos/ai-innovations.png'
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'Future Finance Corp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90k - $130k',
      posted: '3 days ago',
      description: 'Build beautiful user interfaces for our financial technology platform.',
      tags: ['React', 'TypeScript', 'UI/UX', 'Finance'],
      rating: 4.7,
      logo: '/logos/future-finance.png'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Green Energy Systems',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100k - $140k',
      posted: '4 days ago',
      description: 'Analyze energy data to optimize sustainable solutions.',
      tags: ['Python', 'Machine Learning', 'Data Analysis', 'Energy'],
      rating: 4.9,
      logo: '/logos/green-energy.png'
    }
  ]

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Opportunities</h1>
          <p className="text-lg text-gray-600">
            Discover your next career opportunity with our quantum-powered matching
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          {/* Job Type Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedFilters.includes(type) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  if (selectedFilters.includes(type)) {
                    setSelectedFilters(selectedFilters.filter(f => f !== type))
                  } else {
                    setSelectedFilters([...selectedFilters, type])
                  }
                }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BuildingOfficeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                          <HeartIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {job.rating}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {job.posted}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>
    </div>
  )
}