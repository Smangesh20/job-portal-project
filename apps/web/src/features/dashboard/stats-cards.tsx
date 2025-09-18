'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown,
  Briefcase, 
  MessageSquare, 
  Calendar,
  Users,
  Star,
  Eye
} from 'lucide-react'

const statsData = [
  {
    title: 'Total Applications',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Briefcase,
    description: 'From last month',
    color: 'text-blue-600'
  },
  {
    title: 'Interview Rate',
    value: '67%',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Calendar,
    description: 'Applications to interviews',
    color: 'text-green-600'
  },
  {
    title: 'Response Rate',
    value: '89%',
    change: '+15%',
    changeType: 'positive' as const,
    icon: MessageSquare,
    description: 'Employer responses',
    color: 'text-purple-600'
  },
  {
    title: 'Profile Views',
    value: '156',
    change: '-3%',
    changeType: 'negative' as const,
    icon: Eye,
    description: 'This week',
    color: 'text-orange-600'
  },
  {
    title: 'Match Score',
    value: '94%',
    change: '+2%',
    changeType: 'positive' as const,
    icon: Star,
    description: 'Average match quality',
    color: 'text-yellow-600'
  },
  {
    title: 'Network Growth',
    value: '42',
    change: '+25%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'New connections',
    color: 'text-indigo-600'
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
