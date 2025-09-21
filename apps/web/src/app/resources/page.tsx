'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Career Guides' },
    { id: 'templates', name: 'Templates' },
    { id: 'courses', name: 'Courses' },
    { id: 'articles', name: 'Articles' }
  ]

  const resources = [
    {
      id: 1,
      title: 'Complete Guide to Landing Your Dream Tech Job',
      type: 'guide',
      category: 'guides',
      description: 'A comprehensive 50-page guide covering everything from resume writing to interview preparation.',
      author: 'Sarah Johnson',
      duration: '45 min read',
      downloads: 12500,
      rating: 4.9,
      tags: ['Career', 'Tech', 'Interview'],
      icon: BookOpenIcon,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Resume Templates for Tech Professionals',
      type: 'template',
      category: 'templates',
      description: '10 professionally designed resume templates optimized for ATS systems.',
      author: 'AskYaCham Team',
      duration: 'Instant download',
      downloads: 8900,
      rating: 4.8,
      tags: ['Resume', 'ATS', 'Template'],
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      id: 3,
      title: 'Interview Mastery Course',
      type: 'course',
      category: 'courses',
      description: 'Learn the secrets to acing technical and behavioral interviews.',
      author: 'Mike Chen',
      duration: '3 hours',
      downloads: 6700,
      rating: 4.9,
      tags: ['Interview', 'Technical', 'Behavioral'],
      icon: AcademicCapIcon,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Salary Negotiation Strategies',
      type: 'guide',
      category: 'guides',
      description: 'Master the art of salary negotiation with proven strategies and scripts.',
      author: 'Lisa Rodriguez',
      duration: '30 min read',
      downloads: 9800,
      rating: 4.7,
      tags: ['Salary', 'Negotiation', 'Career'],
      icon: LightBulbIcon,
      color: 'orange'
    },
    {
      id: 5,
      title: 'Cover Letter Templates',
      type: 'template',
      category: 'templates',
      description: 'Professional cover letter templates for different industries and roles.',
      author: 'AskYaCham Team',
      duration: 'Instant download',
      downloads: 5600,
      rating: 4.6,
      tags: ['Cover Letter', 'Template', 'Professional'],
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      id: 6,
      title: 'Networking for Introverts',
      type: 'article',
      category: 'articles',
      description: 'Practical tips for building professional relationships as an introvert.',
      author: 'David Park',
      duration: '15 min read',
      downloads: 4200,
      rating: 4.8,
      tags: ['Networking', 'Introvert', 'Career'],
      icon: BookOpenIcon,
      color: 'blue'
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resources</h1>
          <p className="text-lg text-gray-600">
            Access free career resources, guides, and templates to accelerate your success
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.slice(0, 3).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 bg-${resource.color}-100 rounded-lg flex items-center justify-center`}>
                      <resource.icon className={`w-6 h-6 text-${resource.color}-600`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>By {resource.author}</span>
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{resource.rating}</span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                      <span className="text-gray-600">{resource.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Resources</h2>
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${resource.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <resource.icon className={`w-6 h-6 text-${resource.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{resource.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{resource.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>By {resource.author}</span>
                          <span>•</span>
                          <span>{resource.duration}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{resource.rating}</span>
                            <span className="text-yellow-400">⭐</span>
                          </div>
                          <span>•</span>
                          <span>{resource.downloads.toLocaleString()} downloads</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                          Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 opacity-90">
            Get the latest career resources and job market insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="flex-1 bg-white text-gray-900"
            />
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
