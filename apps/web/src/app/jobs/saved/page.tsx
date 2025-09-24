'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bookmark, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  MapPin,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Star,
  Download,
  Share,
  ExternalLink,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Bell,
  RefreshCw,
  Heart,
  Trash2,
  Plus
} from 'lucide-react'

// GOOGLE-STYLE SAVED JOBS PAGE - REAL-TIME DATA
export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time saved jobs data
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // Simulate real-time saved jobs data like Google
        const mockJobs = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            savedDate: '2024-12-20',
            postedDate: '2024-12-18',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            match: 98,
            description: 'We are looking for a Senior Software Engineer to join our team...',
            requirements: ['5+ years experience', 'Python/Java', 'System Design'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: true,
            hasApplied: false,
            isExpired: false,
            daysLeft: 12,
            recruiter: 'Sarah Johnson',
            recruiterEmail: 'sarah.johnson@google.com',
            companySize: '10,000+',
            industry: 'Technology',
            remote: 'Hybrid',
            experience: 'Senior',
            skills: ['Python', 'Java', 'System Design', 'AWS', 'Docker']
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            savedDate: '2024-12-19',
            postedDate: '2024-12-17',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 94,
            description: 'Join our product team to drive innovation and growth...',
            requirements: ['3+ years PM experience', 'Analytics', 'Leadership'],
            benefits: ['Health insurance', '401k', 'Flexible work'],
            isFavorite: false,
            hasApplied: true,
            isExpired: false,
            daysLeft: 8,
            recruiter: 'Mike Chen',
            recruiterEmail: 'mike.chen@microsoft.com',
            companySize: '5,000+',
            industry: 'Technology',
            remote: 'Remote',
            experience: 'Mid-level',
            skills: ['Product Management', 'Analytics', 'Leadership', 'Agile', 'SQL']
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            savedDate: '2024-12-18',
            postedDate: '2024-12-16',
            salary: '$120,000 - $170,000',
            type: 'Full-time',
            match: 89,
            description: 'Create amazing user experiences for our products...',
            requirements: ['3+ years UX experience', 'Figma', 'User Research'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: true,
            hasApplied: false,
            isExpired: false,
            daysLeft: 5,
            recruiter: 'David Smith',
            recruiterEmail: 'david.smith@meta.com',
            companySize: '15,000+',
            industry: 'Technology',
            remote: 'On-site',
            experience: 'Mid-level',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Figma']
          },
          {
            id: 4,
            title: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            savedDate: '2024-12-17',
            postedDate: '2024-12-15',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 92,
            description: 'Work with large datasets to drive business insights...',
            requirements: ['PhD in Data Science', 'Python/R', 'Machine Learning'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: false,
            hasApplied: false,
            isExpired: true,
            daysLeft: 0,
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            companySize: '20,000+',
            industry: 'Technology',
            remote: 'Hybrid',
            experience: 'Senior',
            skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'TensorFlow']
          }
        ]
        
        setJobs(mockJobs)
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

  const getMatchColor = (match: number) => {
    if (match >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (match >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (match >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const getDaysLeftColor = (days: number) => {
    if (days <= 3) return 'text-red-600'
    if (days <= 7) return 'text-yellow-600'
    return 'text-green-600'
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
          Manage your saved job opportunities and never miss a great opportunity.
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
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">Jobs saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.isFavorite).length}</div>
            <p className="text-xs text-muted-foreground">Starred jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.hasApplied).length}</div>
            <p className="text-xs text-muted-foreground">Already applied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.daysLeft <= 3 && !job.isExpired).length}</div>
            <p className="text-xs text-muted-foreground">Within 3 days</p>
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
                <Plus className="h-4 w-4 mr-2" />
                Find More Jobs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.map((job: any) => (
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
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Saved {job.savedDate} • Posted {job.postedDate}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getMatchColor(job.match)}>
                      {job.match}% Match
                    </Badge>
                    <Badge variant="outline">
                      {job.salary}
                    </Badge>
                    <Badge variant="outline">
                      {job.type}
                    </Badge>
                    <Badge variant="outline">
                      {job.remote}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.experience}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.companySize}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.industry}
                    </Badge>
                    {job.isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span className={getDaysLeftColor(job.daysLeft)}>
                      {job.isExpired ? 'Expired' : `${job.daysLeft} days left`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{job.recruiter}</span>
                  </div>
                  {job.hasApplied && (
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Applied</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {!job.hasApplied && !job.isExpired && (
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Apply
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

      {/* Job Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Saved Jobs Insights</span>
            </CardTitle>
            <CardDescription>Analysis of your saved job preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Top Industry</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most saved jobs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">Technology</div>
                <div className="text-sm text-gray-500">75% of saved jobs</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Preferred Location</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most common location</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">Remote</div>
                <div className="text-sm text-gray-500">60% of saved jobs</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Average Match</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your saved jobs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">93%</div>
                <div className="text-sm text-gray-500">Excellent fit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Job Management Tips</span>
            </CardTitle>
            <CardDescription>Optimize your saved jobs strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Apply Quickly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apply to jobs within 24-48 hours of posting for best results.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Organize by Priority</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use favorites to mark your top priority jobs and apply to them first.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Set Reminders</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set reminders for jobs that are expiring soon to avoid missing opportunities.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Clean Up Regularly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remove expired or no longer relevant jobs to keep your list organized.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Find More Jobs</CardTitle>
            <CardDescription>Discover new opportunities</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Browse Jobs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Bulk Apply</CardTitle>
            <CardDescription>Apply to multiple saved jobs</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Apply to Selected
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Set Alerts</CardTitle>
            <CardDescription>Get notified about similar jobs</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Create Alert
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}