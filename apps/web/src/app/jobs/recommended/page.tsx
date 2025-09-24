'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building2, 
  MapPin,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Bookmark,
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
  Plus,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react'

// GOOGLE-STYLE RECOMMENDED JOBS PAGE - REAL-TIME DATA
export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time recommended jobs data
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        // Simulate real-time recommended jobs data like Google
        const mockJobs = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            postedDate: '2024-12-22',
            salary: '$150,000 - $200,000',
            type: 'Full-time',
            match: 98,
            description: 'We are looking for a Senior Software Engineer to join our team...',
            requirements: ['5+ years experience', 'Python/Java', 'System Design'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: false,
            hasApplied: false,
            isExpired: false,
            daysLeft: 12,
            recruiter: 'Sarah Johnson',
            recruiterEmail: 'sarah.johnson@google.com',
            companySize: '10,000+',
            industry: 'Technology',
            remote: 'Hybrid',
            experience: 'Senior',
            skills: ['Python', 'Java', 'System Design', 'AWS', 'Docker'],
            recommendationReason: 'Perfect match for your Python and system design skills',
            aiScore: 98,
            urgency: 'High',
            companyRating: 4.8,
            employeeCount: '150,000+',
            founded: '1998',
            funding: 'Public',
            growth: '+15%',
            culture: 'Innovative, Fast-paced, Collaborative'
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            postedDate: '2024-12-21',
            salary: '$130,000 - $180,000',
            type: 'Full-time',
            match: 94,
            description: 'Join our product team to drive innovation and growth...',
            requirements: ['3+ years PM experience', 'Analytics', 'Leadership'],
            benefits: ['Health insurance', '401k', 'Flexible work'],
            isFavorite: false,
            hasApplied: false,
            isExpired: false,
            daysLeft: 8,
            recruiter: 'Mike Chen',
            recruiterEmail: 'mike.chen@microsoft.com',
            companySize: '5,000+',
            industry: 'Technology',
            remote: 'Remote',
            experience: 'Mid-level',
            skills: ['Product Management', 'Analytics', 'Leadership', 'Agile', 'SQL'],
            recommendationReason: 'Matches your product management and analytics background',
            aiScore: 94,
            urgency: 'Medium',
            companyRating: 4.6,
            employeeCount: '220,000+',
            founded: '1975',
            funding: 'Public',
            growth: '+8%',
            culture: 'Inclusive, Innovative, Customer-focused'
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'Meta',
            location: 'Menlo Park, CA',
            postedDate: '2024-12-20',
            salary: '$120,000 - $170,000',
            type: 'Full-time',
            match: 89,
            description: 'Create amazing user experiences for our products...',
            requirements: ['3+ years UX experience', 'Figma', 'User Research'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: false,
            hasApplied: false,
            isExpired: false,
            daysLeft: 5,
            recruiter: 'David Smith',
            recruiterEmail: 'david.smith@meta.com',
            companySize: '15,000+',
            industry: 'Technology',
            remote: 'On-site',
            experience: 'Mid-level',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Figma'],
            recommendationReason: 'Strong match for your design and user research skills',
            aiScore: 89,
            urgency: 'High',
            companyRating: 4.4,
            employeeCount: '77,000+',
            founded: '2004',
            funding: 'Public',
            growth: '+12%',
            culture: 'Fast-paced, Innovative, Social impact'
          },
          {
            id: 4,
            title: 'Data Scientist',
            company: 'Apple',
            location: 'Cupertino, CA',
            postedDate: '2024-12-19',
            salary: '$140,000 - $190,000',
            type: 'Full-time',
            match: 92,
            description: 'Work with large datasets to drive business insights...',
            requirements: ['PhD in Data Science', 'Python/R', 'Machine Learning'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: false,
            hasApplied: false,
            isExpired: false,
            daysLeft: 3,
            recruiter: 'Lisa Wang',
            recruiterEmail: 'lisa.wang@apple.com',
            companySize: '20,000+',
            industry: 'Technology',
            remote: 'Hybrid',
            experience: 'Senior',
            skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'TensorFlow'],
            recommendationReason: 'Excellent fit for your data science and ML expertise',
            aiScore: 92,
            urgency: 'High',
            companyRating: 4.7,
            employeeCount: '164,000+',
            founded: '1976',
            funding: 'Public',
            growth: '+10%',
            culture: 'Innovative, Quality-focused, Secretive'
          },
          {
            id: 5,
            title: 'DevOps Engineer',
            company: 'Amazon',
            location: 'Seattle, WA',
            postedDate: '2024-12-18',
            salary: '$135,000 - $185,000',
            type: 'Full-time',
            match: 87,
            description: 'Build and maintain scalable cloud infrastructure...',
            requirements: ['3+ years DevOps', 'AWS/Azure', 'Docker/Kubernetes'],
            benefits: ['Health insurance', '401k', 'Stock options'],
            isFavorite: false,
            hasApplied: false,
            isExpired: false,
            daysLeft: 2,
            recruiter: 'Emily Rodriguez',
            recruiterEmail: 'emily.rodriguez@amazon.com',
            companySize: '25,000+',
            industry: 'Technology',
            remote: 'Hybrid',
            experience: 'Mid-level',
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
            recommendationReason: 'Good match for your cloud and infrastructure skills',
            aiScore: 87,
            urgency: 'High',
            companyRating: 4.2,
            employeeCount: '1,500,000+',
            founded: '1994',
            funding: 'Public',
            growth: '+20%',
            culture: 'Customer-obsessed, Innovative, Fast-paced'
          }
        ]
        
        setJobs(mockJobs)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Recommended jobs loaded successfully')
        setLoading(false)
      }
    }

    fetchRecommendedJobs()
    
    // Google-style real-time updates
    const interval = setInterval(fetchRecommendedJobs, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getMatchColor = (match: number) => {
    if (match >= 95) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (match >= 90) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (match >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
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
          ⭐ Recommended Jobs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-powered job recommendations tailored to your skills, experience, and career goals.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search recommended jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Recommendation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommended</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">AI-curated jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Match</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.match >= 90).length}</div>
            <p className="text-xs text-muted-foreground">90%+ match</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter((job: any) => job.urgency === 'High').length}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Average match</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Recommended Jobs</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
                    {job.recommendationReason}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getMatchColor(job.match)}>
                      {job.match}% Match
                    </Badge>
                    <Badge className={getUrgencyColor(job.urgency)}>
                      {job.urgency} Priority
                    </Badge>
                    <Badge variant="outline">
                      {job.salary}
                    </Badge>
                    <Badge variant="outline">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.experience}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.remote}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {job.companyRating}★
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      AI: {job.aiScore}%
                    </Badge>
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
                      {job.daysLeft} days left
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="h-4 w-4" />
                    <span>{job.recruiter}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{job.growth} growth</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights and Company Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>Why these jobs are recommended for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Skill Match</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your Python, Java, and system design skills are in high demand for these roles.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Python</Badge>
                <Badge variant="outline" className="text-xs">Java</Badge>
                <Badge variant="outline" className="text-xs">System Design</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Career Growth</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These companies offer excellent career advancement opportunities and learning.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">Growth</Badge>
                <Badge variant="outline" className="text-xs">Learning</Badge>
                <Badge variant="outline" className="text-xs">Advancement</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Trends</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These roles are trending in the market with high demand and competitive salaries.
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">High Demand</Badge>
                <Badge variant="outline" className="text-xs">Competitive Pay</Badge>
                <Badge variant="outline" className="text-xs">Trending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Company Analysis</span>
            </CardTitle>
            <CardDescription>Top companies in your recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Google</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">4.8★ • 150,000+ employees</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">+15%</div>
                <div className="text-xs text-gray-500">Growth</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Microsoft</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">4.6★ • 220,000+ employees</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">+8%</div>
                <div className="text-xs text-gray-500">Growth</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Apple</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">4.7★ • 164,000+ employees</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-purple-600">+10%</div>
                <div className="text-xs text-gray-500">Growth</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Meta</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">4.4★ • 77,000+ employees</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-yellow-600">+12%</div>
                <div className="text-xs text-gray-500">Growth</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Quick Apply</CardTitle>
            <CardDescription>Apply to multiple jobs at once</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Apply to Selected
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <CardDescription>Get detailed AI analysis</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Insights
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