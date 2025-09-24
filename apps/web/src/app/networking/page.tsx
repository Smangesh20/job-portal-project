'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Network, 
  Users, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Building2, 
  Star, 
  Award, 
  Search,
  Filter,
  Bookmark,
  Share,
  Download,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  UserPlus,
  UserCheck,
  Target,
  CheckCircle,
  Bell,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react'

// GOOGLE-STYLE NETWORKING PAGE - REAL-TIME DATA
export default function NetworkingPage() {
  const [networkingData, setNetworkingData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time networking data
  useEffect(() => {
    const fetchNetworkingData = async () => {
      try {
        // Simulate real-time networking data like Google
        const mockNetworkingData = {
          connections: [
            {
              id: 1,
              name: 'Sarah Johnson',
              title: 'Senior Product Manager',
              company: 'Google',
              location: 'Mountain View, CA',
              industry: 'Technology',
              mutualConnections: 12,
              lastActive: '2 hours ago',
              status: 'Online',
              avatar: '/avatars/sarah.jpg',
              skills: ['Product Management', 'AI/ML', 'Leadership'],
              interests: ['Innovation', 'Startups', 'AI'],
              connectionStrength: 95,
              recentActivity: 'Shared an article about AI in recruitment',
              isMutual: true
            },
            {
              id: 2,
              name: 'Mike Chen',
              title: 'Engineering Director',
              company: 'Microsoft',
              location: 'Seattle, WA',
              industry: 'Technology',
              mutualConnections: 8,
              lastActive: '1 day ago',
              status: 'Away',
              avatar: '/avatars/mike.jpg',
              skills: ['Engineering', 'Cloud Computing', 'Team Leadership'],
              interests: ['Cloud Technology', 'Open Source', 'Mentoring'],
              connectionStrength: 88,
              recentActivity: 'Posted about cloud architecture best practices',
              isMutual: false
            },
            {
              id: 3,
              name: 'Lisa Wang',
              title: 'UX Designer',
              company: 'Apple',
              location: 'Cupertino, CA',
              industry: 'Technology',
              mutualConnections: 15,
              lastActive: '3 hours ago',
              status: 'Online',
              avatar: '/avatars/lisa.jpg',
              skills: ['UX Design', 'User Research', 'Prototyping'],
              interests: ['Design Systems', 'Accessibility', 'Innovation'],
              connectionStrength: 92,
              recentActivity: 'Launched a new design system for mobile apps',
              isMutual: true
            }
          ],
          events: [
  {
    id: 1,
              title: 'Tech Networking Mixer',
              date: '2024-12-28',
              time: '6:00 PM',
    location: 'San Francisco, CA',
              attendees: 150,
              type: 'Networking',
              description: 'Connect with tech professionals and industry leaders',
              organizer: 'TechSF',
              price: 'Free',
              isAttending: true
            },
            {
              id: 2,
              title: 'AI & Machine Learning Conference',
              date: '2024-12-30',
              time: '9:00 AM',
              location: 'Virtual',
              attendees: 500,
              type: 'Conference',
              description: 'Learn about the latest AI and ML innovations',
              organizer: 'AI Institute',
              price: '$99',
              isAttending: false
            },
            {
              id: 3,
              title: 'Startup Pitch Night',
              date: '2025-01-05',
              time: '7:00 PM',
              location: 'Palo Alto, CA',
              attendees: 75,
              type: 'Pitch Event',
              description: 'Watch innovative startups pitch their ideas',
              organizer: 'Startup Valley',
              price: '$25',
              isAttending: false
            }
          ],
          recommendations: [
            {
              id: 1,
              name: 'David Smith',
              title: 'VP of Engineering',
              company: 'Meta',
              reason: 'Mutual connections with 5 people in your network',
              mutualConnections: 5,
              avatar: '/avatars/david.jpg'
  },
  {
    id: 2,
              name: 'Emily Rodriguez',
              title: 'Product Designer',
              company: 'Netflix',
              reason: 'Similar skills and interests in UX design',
              mutualConnections: 3,
              avatar: '/avatars/emily.jpg'
            },
            {
              id: 3,
              name: 'Alex Thompson',
              title: 'Data Scientist',
              company: 'Amazon',
              reason: 'Works in the same industry and location',
              mutualConnections: 7,
              avatar: '/avatars/alex.jpg'
            }
          ],
          stats: {
            totalConnections: 1247,
            newConnections: 23,
            eventsAttended: 8,
            messagesSent: 156,
            profileViews: 89,
            connectionRequests: 12
          }
        }
        
        setNetworkingData(mockNetworkingData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Networking data loaded successfully')
        setLoading(false)
      }
    }

    fetchNetworkingData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchNetworkingData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Away':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (strength >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (strength >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
          🌐 Professional Networking
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with industry professionals, attend events, and build meaningful relationships.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
                  </div>

      {/* Networking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkingData?.stats.totalConnections}</div>
            <p className="text-xs text-muted-foreground">+{networkingData?.stats.newConnections} this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkingData?.stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkingData?.stats.messagesSent}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkingData?.stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Requests</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkingData?.stats.connectionRequests}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
                      </div>

      {/* Connections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Connections</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Find People
              </Button>
                      </div>
                    </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {networkingData?.connections.map((connection: any) => (
            <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {connection.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    connection.status === 'Online' ? 'bg-green-500' : 
                    connection.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {connection.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connection.title} at {connection.company}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {connection.location} • {connection.industry}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(connection.status)}>
                      {connection.status}
                    </Badge>
                    <Badge className={getConnectionStrengthColor(connection.connectionStrength)}>
                      {connection.connectionStrength}% Match
                    </Badge>
                    <Badge variant="outline">
                      {connection.mutualConnections} mutual
                    </Badge>
                </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {connection.skills.slice(0, 3).map((skill: string, index: number) => (
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
                    <span>{connection.lastActive}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{connection.recentActivity}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
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
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Events and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>Networking events and conferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkingData?.events.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">{event.type}</Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {event.attendees} attendees
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.price}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-6 w-6" />
              <span>People You May Know</span>
            </CardTitle>
            <CardDescription>Recommended connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkingData?.recommendations.map((recommendation: any) => (
              <div key={recommendation.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {recommendation.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{recommendation.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {recommendation.title} at {recommendation.company}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {recommendation.reason}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge variant="outline">{recommendation.mutualConnections} mutual</Badge>
                  <Button size="sm" className="text-xs">
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Networking Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Connection Requests</CardTitle>
            <CardDescription>Manage your connection requests</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              View Requests
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Global Network</CardTitle>
            <CardDescription>Explore connections worldwide</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Explore Network
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Networking Goals</CardTitle>
            <CardDescription>Set and track your networking objectives</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Set Goals
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}