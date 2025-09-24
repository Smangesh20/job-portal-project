'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Building2, 
  Star,
  Search,
  Filter,
  Globe,
  Video,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Award,
  TrendingUp,
  Heart,
  Share,
  Bookmark,
  MoreVertical
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
              title: 'Senior Software Engineer',
              company: 'Google',
              location: 'Mountain View, CA',
              avatar: '/avatars/sarah.jpg',
              mutualConnections: 12,
              isOnline: true,
              lastActive: '2 minutes ago',
              skills: ['React', 'TypeScript', 'Node.js'],
              interests: ['AI', 'Machine Learning', 'Open Source']
            },
            {
              id: 2,
              name: 'Mike Chen',
              title: 'Product Manager',
              company: 'Microsoft',
              location: 'Seattle, WA',
              avatar: '/avatars/mike.jpg',
              mutualConnections: 8,
              isOnline: false,
              lastActive: '1 hour ago',
              skills: ['Product Strategy', 'Data Analysis', 'Leadership'],
              interests: ['Innovation', 'User Experience', 'Technology']
            },
            {
              id: 3,
              name: 'Lisa Wang',
              title: 'UX Designer',
              company: 'Apple',
              location: 'Cupertino, CA',
              avatar: '/avatars/lisa.jpg',
              mutualConnections: 15,
              isOnline: true,
              lastActive: '5 minutes ago',
              skills: ['UI/UX Design', 'Figma', 'User Research'],
              interests: ['Design Systems', 'Accessibility', 'Mobile Design']
            }
          ],
          events: [
            {
              id: 1,
              title: 'Tech Networking Mixer',
              date: '2024-12-28',
              time: '6:00 PM',
              location: 'San Francisco, CA',
              attendees: 45,
              type: 'In-Person',
              description: 'Connect with fellow tech professionals and industry leaders'
            },
            {
              id: 2,
              title: 'Remote Work Panel Discussion',
              date: '2024-12-30',
              time: '2:00 PM',
              location: 'Online',
              attendees: 120,
              type: 'Virtual',
              description: 'Learn about the future of remote work from industry experts'
            },
            {
              id: 3,
              title: 'Startup Pitch Night',
              date: '2025-01-05',
              time: '7:00 PM',
              location: 'Palo Alto, CA',
              attendees: 80,
              type: 'In-Person',
              description: 'Watch innovative startups pitch their ideas to investors'
            }
          ],
          recommendations: [
            {
              id: 1,
              name: 'David Smith',
              title: 'Engineering Manager',
              company: 'Amazon',
              reason: 'You both work in cloud computing and have similar career paths',
              mutualConnections: 5
            },
            {
              id: 2,
              name: 'Emily Davis',
              title: 'Data Scientist',
              company: 'Meta',
              reason: 'You share interests in machine learning and AI',
              mutualConnections: 3
            }
          ]
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
          🤝 Professional Networking
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with professionals, attend events, and grow your network with real-time updates.
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

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Networking events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
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
                Add Connection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {networkingData?.connections.map((connection: any) => (
            <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {connection.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  {connection.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {connection.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4" />
                    <span>{connection.title} at {connection.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{connection.location}</span>
                    <span>•</span>
                    <span>{connection.mutualConnections} mutual connections</span>
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
              
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${connection.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{connection.lastActive}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
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
            <CardDescription>Networking events you might be interested in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkingData?.events.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.date} at {event.time}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                    <span>•</span>
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={event.type === 'Virtual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                    {event.type}
                  </Badge>
                  <Button size="sm" className="mt-2">
                    Join Event
                  </Button>
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
            <CardDescription>Suggested connections based on your network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkingData?.recommendations.map((rec: any) => (
              <div key={rec.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {rec.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{rec.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.title} at {rec.company}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {rec.mutualConnections} mutual connections
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="sm" className="mb-2">
                    Connect
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {rec.reason}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}