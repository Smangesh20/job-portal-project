'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  BarChart3,
  MessageSquare,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Quantum Computing-Powered Matching',
    description: 'Advanced quantum computing algorithms analyze skills, experience, and cultural fit to deliver 95%+ accurate job matches.',
    badge: 'Revolutionary',
    highlights: ['Semantic skill matching', 'Cultural fit analysis', 'Bias detection', 'Continuous learning']
  },
  {
    icon: Zap,
    title: 'Real-Time Communication',
    description: 'Instant messaging, video calls, and collaborative hiring tools for seamless employer-candidate interactions.',
    badge: 'Real-Time',
    highlights: ['Live chat', 'Video interviews', 'Collaborative hiring', 'Instant notifications']
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with AES-256 encryption, OWASP compliance, and comprehensive audit logging.',
    badge: 'A+ Rated',
    highlights: ['GDPR compliant', '2FA authentication', 'Zero-trust architecture', 'Regular audits']
  },
  {
    icon: Users,
    title: 'Diversity & Inclusion',
    description: 'Built-in bias detection and mitigation tools ensure fair hiring practices and promote workplace diversity.',
    badge: 'Inclusive',
    highlights: ['Bias detection', 'Inclusive language', 'Diverse sourcing', 'Equal opportunity']
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with opportunities worldwide with multi-language support and global compliance standards.',
    badge: 'Worldwide',
    highlights: ['Multi-language', 'Global compliance', 'Remote-first', 'Cross-border hiring']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights and predictive analytics to optimize hiring processes and career development.',
    badge: 'Data-Driven',
    highlights: ['Predictive analytics', 'Market insights', 'Performance metrics', 'Career forecasting']
  },
  {
    icon: MessageSquare,
    title: 'Smart Messaging',
    description: 'AI-assisted communication with translation, sentiment analysis, and automated follow-ups.',
    badge: 'Intelligent',
    highlights: ['Auto-translation', 'Sentiment analysis', 'Smart reminders', 'Template suggestions']
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock platform access with automated matching and instant notifications for global users.',
    badge: 'Always On',
    highlights: ['24/7 access', 'Automated matching', 'Global time zones', 'Instant alerts']
  },
  {
    icon: Target,
    title: 'Precision Targeting',
    description: 'Laser-focused job matching based on skills, preferences, and career goals for optimal outcomes.',
    badge: 'Precise',
    highlights: ['Skill-based matching', 'Preference learning', 'Career alignment', 'Goal tracking']
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'AI-powered career development insights and personalized learning recommendations for professional advancement.',
    badge: 'Growth-Focused',
    highlights: ['Career insights', 'Skill development', 'Learning paths', 'Progress tracking']
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose Ask Ya Cham?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of job matching with our cutting-edge AI technology, 
            real-time collaboration tools, and enterprise-grade security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
            <span>See All Features</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
