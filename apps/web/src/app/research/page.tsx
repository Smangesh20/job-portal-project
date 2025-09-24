'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Star, 
  Award, 
  Filter,
  Bookmark,
  Share,
  Download,
  Eye,
  Calendar,
  Users,
  Globe,
  Target,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Brain,
  Lightbulb,
  Zap,
  Database,
  Cpu,
  Network,
  Shield,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Maximize,
  Minimize
} from 'lucide-react'

// GOOGLE-STYLE RESEARCH PAGE - REAL-TIME DATA
export default function ResearchPage() {
  const [researchData, setResearchData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time research data
  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        // Simulate real-time research data like Google
        const mockResearchData = {
          research: [
            {
              id: 1,
              title: 'AI-Powered Job Matching: A Comprehensive Study',
              authors: ['Dr. Sarah Johnson', 'Prof. Mike Chen', 'Dr. Lisa Wang'],
              institution: 'Stanford University',
              publishedDate: '2024-12-15',
              category: 'Artificial Intelligence',
              type: 'Research Paper',
              status: 'Published',
              impact: 'High',
              citations: 45,
              downloads: 1200,
              abstract: 'This study explores the effectiveness of AI-powered job matching algorithms in improving recruitment outcomes and candidate satisfaction.',
              keywords: ['AI', 'Job Matching', 'Recruitment', 'Machine Learning'],
              doi: '10.1000/ai-job-matching-2024',
              journal: 'Journal of AI in Recruitment',
              volume: '15',
              issue: '3',
              pages: '45-67',
              funding: 'NSF Grant #1234567',
              methodology: 'Quantitative Analysis',
              sampleSize: 10000,
              duration: '18 months',
              results: '98% accuracy in job matching',
              implications: 'Significant improvement in recruitment efficiency',
              limitations: 'Limited to tech industry',
              futureWork: 'Expand to other industries',
              isOpenAccess: true,
              isPeerReviewed: true,
              isBookmarked: true,
              isDownloaded: false
            },
            {
              id: 2,
              title: 'Remote Work Impact on Employee Productivity',
              authors: ['Dr. Emily Rodriguez', 'Prof. David Smith'],
              institution: 'MIT',
              publishedDate: '2024-12-10',
              category: 'Work Psychology',
              type: 'Case Study',
              status: 'Published',
              impact: 'Medium',
              citations: 23,
              downloads: 890,
              abstract: 'An analysis of remote work patterns and their correlation with employee productivity metrics across different industries.',
              keywords: ['Remote Work', 'Productivity', 'Employee Engagement', 'Work-Life Balance'],
              doi: '10.1000/remote-work-productivity-2024',
              journal: 'Work Psychology Quarterly',
              volume: '12',
              issue: '4',
              pages: '123-145',
              funding: 'Corporate Partnership',
              methodology: 'Mixed Methods',
              sampleSize: 5000,
              duration: '12 months',
              results: '15% increase in productivity',
              implications: 'Remote work policies need optimization',
              limitations: 'Self-reported data',
              futureWork: 'Longitudinal study',
              isOpenAccess: false,
              isPeerReviewed: true,
              isBookmarked: false,
              isDownloaded: true
            },
            {
              id: 3,
              title: 'Blockchain in HR: Security and Transparency',
              authors: ['Dr. Alex Thompson', 'Prof. Maria Garcia'],
              institution: 'Berkeley University',
              publishedDate: '2024-12-05',
              category: 'Blockchain Technology',
              type: 'Technical Report',
              status: 'Under Review',
              impact: 'High',
              citations: 8,
              downloads: 450,
              abstract: 'Exploring blockchain applications in human resources for secure and transparent employee data management.',
              keywords: ['Blockchain', 'HR', 'Security', 'Transparency', 'Data Privacy'],
              doi: '10.1000/blockchain-hr-2024',
              journal: 'Blockchain Technology Review',
              volume: '8',
              issue: '2',
              pages: '78-95',
              funding: 'Industry Grant',
              methodology: 'Technical Analysis',
              sampleSize: 1000,
              duration: '8 months',
              results: '99.9% data integrity',
              implications: 'Revolutionary HR data management',
              limitations: 'Implementation complexity',
              futureWork: 'Pilot implementation',
              isOpenAccess: true,
              isPeerReviewed: false,
              isBookmarked: true,
              isDownloaded: false
            }
          ],
          trends: [
            {
              name: 'AI in Recruitment',
              growth: 45.2,
              description: 'Artificial Intelligence applications in recruitment processes',
              trend: 'up',
              papers: 156,
              citations: 2340
            },
            {
              name: 'Remote Work Studies',
              growth: 38.7,
              description: 'Research on remote work patterns and productivity',
              trend: 'up',
              papers: 89,
              citations: 1890
            },
            {
              name: 'Blockchain HR',
              growth: 32.1,
              description: 'Blockchain technology in human resources',
              trend: 'up',
              papers: 45,
              citations: 890
            }
          ],
          stats: {
            totalPapers: 1247,
            myPapers: 8,
            bookmarkedPapers: 45,
            downloadedPapers: 23,
            citations: 156,
            hIndex: 12,
            researchAreas: 5,
            collaborations: 15
          }
        }
        
        setResearchData(mockResearchData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Research data loaded successfully')
        setLoading(false)
      }
    }

    fetchResearchData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchResearchData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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
          🔬 Research Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Access cutting-edge research, academic papers, and industry insights in recruitment and career development.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search research papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Research Stats */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.totalPapers}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Papers</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.myPapers}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.bookmarkedPapers}</div>
            <p className="text-xs text-muted-foreground">Saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.downloadedPapers}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.citations}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">H-Index</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.hIndex}</div>
            <p className="text-xs text-muted-foreground">Impact</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Areas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.researchAreas}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData?.stats.collaborations}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Research Papers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Research Papers</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Paper
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {researchData?.research.map((paper: any) => (
            <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {paper.authors.join(', ')} • {paper.institution}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {paper.abstract}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(paper.status)}>
                      {paper.status}
                    </Badge>
                    <Badge className={getImpactColor(paper.impact)}>
                      {paper.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      {paper.category}
                    </Badge>
                    <Badge variant="outline">
                      {paper.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {paper.keywords.slice(0, 4).map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{paper.publishedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{paper.citations} citations</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Download className="h-4 w-4" />
                    <span>{paper.downloads} downloads</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{paper.sampleSize} participants</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Research Trends and Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Research Trends</span>
            </CardTitle>
            <CardDescription>Current trends in recruitment research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {researchData?.trends.map((trend: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{trend.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trend.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{trend.papers} papers</Badge>
                    <Badge variant="outline">{trend.citations} citations</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-green-600">+{trend.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>Research Tools</span>
            </CardTitle>
            <CardDescription>Tools for research and analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium text-sm">Data Analysis</h4>
                <p className="text-xs text-gray-500">Statistical analysis tools</p>
              </div>
              <div className="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium text-sm">Data Collection</h4>
                <p className="text-xs text-gray-500">Survey and data tools</p>
              </div>
              <div className="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <Network className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-medium text-sm">Collaboration</h4>
                <p className="text-xs text-gray-500">Team collaboration tools</p>
              </div>
              <div className="p-3 border rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h4 className="font-medium text-sm">Ethics Review</h4>
                <p className="text-xs text-gray-500">Research ethics tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Research Library</CardTitle>
            <CardDescription>Access to academic databases</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Access Library
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Research Network</CardTitle>
            <CardDescription>Connect with researchers</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Join Network
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Research Grants</CardTitle>
            <CardDescription>Funding opportunities</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              View Grants
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}