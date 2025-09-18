'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Briefcase,
  Zap
} from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Get Matched in Minutes',
    description: 'Our AI analyzes your profile and finds perfect opportunities instantly'
  },
  {
    icon: Users,
    title: 'Connect with Top Employers',
    description: 'Access exclusive opportunities from leading companies worldwide'
  },
  {
    icon: Briefcase,
    title: 'Land Your Dream Job',
    description: 'Join thousands who found their perfect career match'
  }
]

const features = [
  'AI-powered job matching',
  'Real-time communication',
  'Enterprise-grade security',
  'Diversity & inclusion tools',
  'Advanced analytics',
  '24/7 platform access'
]

const stats = [
  { number: '50K+', label: 'Active Users' },
  { number: '10K+', label: 'Job Postings' },
  { number: '95%', label: 'Match Accuracy' },
  { number: '4.9/5', label: 'User Rating' }
]

export function CtaSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
            Ready to Transform Your Career?
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Join the Future of
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Job Matching
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of quantum computing-driven job matching. Get personalized recommendations, 
            connect with top employers, and land your dream job faster than ever before.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-blue-100">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
              <span className="text-white font-medium ml-2">4.9/5 from 10,000+ reviews</span>
            </div>
            <p className="text-blue-100 text-sm">
              Trusted by professionals at Microsoft, Google, Apple, and 500+ other leading companies
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm mb-4">
              Secure • GDPR Compliant • SOC 2 Certified • A+ Security Rating
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-blue-200 text-xs">
              <span>🔒 Enterprise Security</span>
              <span>🌍 Global Reach</span>
              <span>⚡ Real-time Matching</span>
              <span>🤖 Quantum Computing-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-500" />
    </section>
  )
}
