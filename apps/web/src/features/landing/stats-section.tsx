'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  Star,
  Globe,
  Zap,
  Shield
} from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
    description: 'Professionals actively seeking opportunities',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Briefcase,
    value: '10K+',
    label: 'Job Postings',
    description: 'High-quality opportunities available',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Match Accuracy',
    description: 'AI-powered precision matching',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Clock,
    value: '72hrs',
    label: 'Avg. Response Time',
    description: 'Lightning-fast employer responses',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'User Rating',
    description: 'Exceptional user satisfaction',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Countries',
    description: 'Global reach and opportunities',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Zap,
    value: '3x',
    label: 'Faster Hiring',
    description: 'Streamlined recruitment process',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Shield,
    value: 'A+',
    label: 'Security Rating',
    description: 'Enterprise-grade security',
    color: 'from-gray-500 to-slate-500'
  }
]

const achievements = [
  {
    title: 'Industry Recognition',
    description: 'Winner of Best AI Job Matching Platform 2024',
    icon: '🏆'
  },
  {
    title: 'Security Excellence',
    description: 'SOC 2 Type II certified with A+ security rating',
    icon: '🔒'
  },
  {
    title: 'Innovation Leader',
    description: 'Featured in TechCrunch for breakthrough AI technology',
    icon: '🚀'
  },
  {
    title: 'User Satisfaction',
    description: '98% user satisfaction rate based on 10,000+ reviews',
    icon: '⭐'
  }
]

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            Trusted by Thousands
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of professionals and companies who trust Ask Ya Cham 
            for their career and hiring success.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Recognition & Achievements
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our commitment to excellence has earned us recognition from industry leaders and users worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {achievement.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Growing Every Day
            </h3>
            <p className="text-lg text-blue-100">
              Our platform continues to grow as more professionals discover the power of quantum computing-driven job matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">+25%</div>
              <div className="text-sm text-blue-100">Monthly User Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">+40%</div>
              <div className="text-sm text-blue-100">Success Rate Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">+60%</div>
              <div className="text-sm text-blue-100">Employer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted by Leading Companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for company logos */}
            {['Microsoft', 'Google', 'Amazon', 'Apple', 'Meta', 'Netflix'].map((company, index) => (
              <div 
                key={index} 
                className="text-2xl font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            And 500+ other leading companies worldwide
          </p>
        </div>
      </div>
    </section>
  )
}
