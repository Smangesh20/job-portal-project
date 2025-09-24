'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  CheckCircle,
  Star,
  Target,
  Zap,
  Award
} from 'lucide-react'

export default function ResumeBuilderPage() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Professional Classic',
      description: 'Clean, traditional design perfect for corporate environments',
      category: 'Professional',
      downloads: 12500,
      rating: 4.8,
      icon: FileText,
      color: 'blue',
      features: ['ATS Friendly', 'Clean Layout', 'Professional Fonts', 'Easy Customization']
    },
    {
      id: 2,
      name: 'Modern Creative',
      description: 'Bold, contemporary design for creative and tech professionals',
      category: 'Creative',
      downloads: 8900,
      rating: 4.7,
      icon: Star,
      color: 'purple',
      features: ['Visual Elements', 'Color Schemes', 'Creative Layout', 'Portfolio Integration']
    },
    {
      id: 3,
      name: 'Executive Premium',
      description: 'Sophisticated design for senior-level and executive positions',
      category: 'Executive',
      downloads: 5600,
      rating: 4.9,
      icon: Award,
      color: 'gold',
      features: ['Premium Design', 'Executive Layout', 'High Impact', 'Professional Branding']
    },
    {
      id: 4,
      name: 'Tech Specialist',
      description: 'Optimized for technical roles with emphasis on skills and projects',
      category: 'Technical',
      downloads: 11200,
      rating: 4.6,
      icon: Target,
      color: 'green',
      features: ['Skills Focus', 'Project Showcase', 'Technical Layout', 'Code Highlighting']
    },
    {
      id: 5,
      name: 'Startup Ready',
      description: 'Dynamic design perfect for startup and entrepreneurial roles',
      category: 'Startup',
      downloads: 7800,
      rating: 4.5,
      icon: Zap,
      color: 'orange',
      features: ['Dynamic Layout', 'Startup Focus', 'Innovation Emphasis', 'Flexible Design']
    },
    {
      id: 6,
      name: 'Academic Scholar',
      description: 'Formal design ideal for academic and research positions',
      category: 'Academic',
      downloads: 4200,
      rating: 4.7,
      icon: CheckCircle,
      color: 'indigo',
      features: ['Academic Format', 'Publication Focus', 'Research Emphasis', 'Formal Style']
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
      gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
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
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <Badge variant="default" className="bg-green-100 text-green-800">
              New
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            Create a professional resume that gets you noticed by employers
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Upload Existing Resume</h3>
                  <p className="text-sm text-gray-600">Import and enhance your current resume</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Edit className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Start from Scratch</h3>
                  <p className="text-sm text-gray-600">Build a new resume with our templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Resume Review</h3>
                  <p className="text-sm text-gray-600">Get AI-powered feedback on your resume</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const IconComponent = template.icon
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(template.color)}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.downloads.toLocaleString()} downloads
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{template.rating}/5.0</span>
                        <span className="text-gray-500">({template.downloads.toLocaleString()} downloads)</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Use Template
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
    </div>
  )
}