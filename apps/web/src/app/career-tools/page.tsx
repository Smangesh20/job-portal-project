'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DocumentTextIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function CareerToolsPage() {
  const [activeTab, setActiveTab] = useState('resume')

  const tools = [
    {
      id: 'resume',
      name: 'Resume Builder',
      description: 'Create a professional resume with our AI-powered builder',
      icon: DocumentTextIcon,
      features: ['AI-optimized templates', 'ATS-friendly format', 'Industry-specific content'],
      color: 'blue'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Creator',
      description: 'Build an impressive portfolio to showcase your work',
      icon: ChartBarIcon,
      features: ['Interactive galleries', 'Project showcases', 'Skills visualization'],
      color: 'green'
    },
    {
      id: 'skills',
      name: 'Skills Assessment',
      description: 'Evaluate and improve your professional skills',
      icon: AcademicCapIcon,
      features: ['Skill gap analysis', 'Learning paths', 'Certification tracking'],
      color: 'purple'
    },
    {
      id: 'network',
      name: 'Network Builder',
      description: 'Expand your professional network strategically',
      icon: UserGroupIcon,
      features: ['Connection suggestions', 'Industry events', 'Mentorship matching'],
      color: 'orange'
    }
  ]

  const courses = [
    {
      title: 'AI & Machine Learning Fundamentals',
      provider: 'Tech Academy',
      duration: '8 weeks',
      level: 'Beginner',
      rating: 4.8,
      students: 1250
    },
    {
      title: 'Advanced React Development',
      provider: 'Code Masters',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.9,
      students: 890
    },
    {
      title: 'Data Science with Python',
      provider: 'Data University',
      duration: '10 weeks',
      level: 'Intermediate',
      rating: 4.7,
      students: 2100
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Tools</h1>
          <p className="text-lg text-gray-600">
            Accelerate your career with our comprehensive toolkit
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === tool.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveTab(tool.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${tool.color}-100 flex items-center justify-center`}>
                  <tool.icon className={`w-8 h-8 text-${tool.color}-600`} />
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ArrowRightIcon className="w-3 h-3 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Tool Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {tools.find(t => t.id === activeTab)?.name}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">How it works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Upload your information</h4>
                    <p className="text-sm text-gray-600">Provide your background and experience details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">AI optimization</h4>
                    <p className="text-sm text-gray-600">Our AI analyzes and optimizes your content</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Review and refine</h4>
                    <p className="text-sm text-gray-600">Make final adjustments and download</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Success stories</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    "The resume builder helped me land interviews at 3 top tech companies!"
                  </p>
                  <p className="text-xs text-gray-500">- Sarah Chen, Software Engineer</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    "My portfolio increased my client inquiries by 200%"
                  </p>
                  <p className="text-xs text-gray-500">- Michael Rodriguez, Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-1">{course.rating}</span>
                      <span className="text-xs text-gray-500">⭐</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="text-center">
            <LightBulbIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-4">Career Growth Tips</h2>
            <p className="text-lg mb-6 opacity-90">
              Get personalized career advice powered by our AI insights
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Personalized Tips
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
