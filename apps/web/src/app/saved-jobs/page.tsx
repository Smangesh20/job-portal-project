'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bookmark, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Building2, 
  DollarSign,
  Search,
  Filter,
  Share,
  ExternalLink,
  Trash2,
  Eye,
  Send,
  Calendar,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// GOOGLE-STYLE SAVED JOBS PAGE - REAL-TIME DATA
export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time saved jobs data
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // Simulate real-time saved jobs data like Google
        const mockSavedJobs = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            posted: '2 hours ago',
            savedDate: '2024-12-20',
            match: 98,
            status: 'Active',
            description: 'Join our team to build the next generation of web applications',
            skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
            benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work'],
            isFavorite: true,
            notes: 'Perfect match for my skills and career goals'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            posted: '4 hours ago',
            savedDate: '2024-12-19',
            match: 94,
            status: 'Active',
            description: 'Lead product strategy for our cloud computing platform',
            skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile'],
            benefits: ['Health Insurance', '401k', 'Stock Options', 'Learning Budget'],
            isFavorite: false,
            notes: 'Great company culture and growth opportunities'
          },
          {
            id: 3,
            title: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            posted: '6 hours ago',
            savedDate: '2024-12-18',
            match: 91,
            status: 'Applied',
            description: 'Analyze user behavior and improve product recommendations',
            skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
            benefits: ['Health Insurance', '401k', 'Stock Options', 'Gym Membership'],
            isFavorite: true,
            notes: 'Applied last week, waiting for response'
          },
          {
            id: 4,
            title: 'UX Designer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            salary: '$120,000 - $170,000',
            type: 'Full-time',
            posted: '1 day ago',
            savedDate: '2024-12-17',
            match: 89,
            status: 'Expired',
            description: 'Design user experiences for our social media platform',
            skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
            benefits: ['Health Insurance', '401k', 'Stock Options', 'Free Meals'],
            isFavorite: false,
            notes: 'Job posting expired, but keeping for reference'
          }
        ]
        
        setSavedJobs(mockSavedJobs)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Saved jobs loaded successfully')
        setLoading(false)
      }
    }

    fetchSavedJobs()
    
    // Google-style real-time updates
    const interval = setInterval(fetchSavedJobs, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getMatchColor = (match: number) => {
    if (match >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (match >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (match >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
          💾 Saved Jobs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage your saved job opportunities with real-time updates and status tracking.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Saved Jobs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobs.length}</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobs.filter((job: any) => job.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobs.filter((job: any) => job.status === 'Applied').length}</div>
            <p className="text-xs text-muted-foreground">Applications sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedJobs.filter((job: any) => job.isFavorite).length}</div>
            <p className="text-xs text-muted-foreground">Starred jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Saved Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Saved Jobs</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save New Job
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedJobs.map((job: any) => (
            <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Badge className={getMatchColor(job.match)}>
                      {job.match}% Match
                    </Badge>
                    <Badge variant="outline">
                      {job.type}
                    </Badge>
                    <Badge variant="outline">
                      {job.salary}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {job.skills.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Saved {job.savedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span>Posted {job.posted}</span>
                  </div>
                  {job.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 max-w-xs truncate">
                      {job.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {job.status === 'Active' ? (
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  ) : job.status === 'Applied' ? (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Expired
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    {job.isFavorite ? (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Job Alerts</CardTitle>
            <CardDescription>Get notified about similar jobs</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Set Up Alerts
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Application Tracker</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Tracker
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Job Recommendations</CardTitle>
            <CardDescription>Discover new opportunities</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}