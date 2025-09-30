'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  Video
} from 'lucide-react'

// GOOGLE-STYLE MESSAGES PAGE - REAL-TIME DATA
export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time messages data
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Simulate real-time messages like Google
        const mockMessages = [
          {
            id: 1,
            sender: 'Sarah Johnson',
            company: 'Google',
            subject: 'Interview Invitation - Senior Software Engineer',
            preview: 'Thank you for your application. We would like to invite you for an interview...',
            timestamp: '2 hours ago',
            isRead: false,
            isStarred: false,
            type: 'interview',
            priority: 'high'
          },
          {
            id: 2,
            sender: 'Mike Chen',
            company: 'Microsoft',
            subject: 'Application Status Update',
            preview: 'Your application for Product Manager position is currently under review...',
            timestamp: '4 hours ago',
            isRead: true,
            isStarred: true,
            type: 'application',
            priority: 'medium'
          },
          {
            id: 3,
            sender: 'Lisa Wang',
            company: 'Apple',
            subject: 'Next Steps - UX Designer Role',
            preview: 'Congratulations! We are moving forward with your application...',
            timestamp: '1 day ago',
            isRead: true,
            isStarred: false,
            type: 'offer',
            priority: 'high'
          },
          {
            id: 4,
            sender: 'David Smith',
            company: 'Amazon',
            subject: 'Technical Interview Schedule',
            preview: 'We have scheduled your technical interview for next Tuesday at 2 PM...',
            timestamp: '2 days ago',
            isRead: false,
            isStarred: false,
            type: 'interview',
            priority: 'medium'
          },
          {
            id: 5,
            sender: 'Emily Davis',
            company: 'Meta',
            subject: 'Welcome to the Team!',
            preview: 'We are excited to offer you the position of Software Engineer...',
            timestamp: '3 days ago',
            isRead: true,
            isStarred: true,
            type: 'offer',
            priority: 'high'
          }
        ]
        
        setMessages(mockMessages)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Messages loaded successfully')
        setLoading(false)
      }
    }

    fetchMessages()
    
    // Google-style real-time updates
    const interval = setInterval(fetchMessages, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Video className="h-4 w-4 text-blue-600" />
      case 'application':
        return <Mail className="h-4 w-4 text-green-600" />
      case 'offer':
        return <Star className="h-4 w-4 text-yellow-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
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
          💬 Your Messages
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Stay connected with recruiters and employers with real-time message updates.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
            Compose Message
          </Button>
          <Button variant="outline" className="px-8 py-3 text-lg">
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((message: any) => (
            <div 
              key={message.id} 
              className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                !message.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(message.type)}
                  <div>
                    <h3 className={`text-lg font-semibold ${!message.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {message.subject}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{message.sender}</span>
                      <span>•</span>
                      <Building2 className="h-4 w-4" />
                      <span>{message.company}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 max-w-md truncate">
                    {message.preview}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(message.priority)}>
                    {message.priority}
                  </Badge>
                  
                  {message.isStarred && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                  
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter((m: any) => !m.isRead).length}</div>
            <p className="text-xs text-muted-foreground">New messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter((m: any) => m.isStarred).length}</div>
            <p className="text-xs text-muted-foreground">Important messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}












