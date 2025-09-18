'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  UserGroupIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-green-600" />,
      title: 'Smart Matching',
      description: 'Our quantum-powered algorithm matches candidates with the perfect job opportunities based on skills, culture, and career goals.'
    },
    {
      icon: <LightBulbIcon className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized career advice, interview preparation, and skill recommendations powered by advanced AI technology.'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-purple-600" />,
      title: 'Analytics Dashboard',
      description: 'Track your job search progress, application success rates, and career growth with detailed analytics and insights.'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-orange-600" />,
      title: 'Global Opportunities',
      description: 'Access job opportunities from companies worldwide, with support for remote work and international placements.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-red-600" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls, ensuring your information stays safe.'
    },
    {
      icon: <RocketLaunchIcon className="h-8 w-8 text-indigo-600" />,
      title: 'Career Acceleration',
      description: 'Accelerate your career growth with personalized learning paths, mentorship opportunities, and skill development programs.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '50,000+', label: 'Job Listings' },
    { number: '95%', label: 'Match Accuracy' },
    { number: '24/7', label: 'AI Support' }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former Google engineer with 10+ years in AI and quantum computing.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Quantum computing expert and former IBM researcher.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'UX designer with expertise in career development platforms.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'David Kim',
      role: 'Lead AI Engineer',
      bio: 'Machine learning specialist focused on job matching algorithms.',
      image: '/api/placeholder/150/150'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Revolutionizing Career Matching
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              We use cutting-edge quantum computing and AI to connect talented professionals 
              with their dream careers, ensuring perfect matches every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-green-600">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To democratize career opportunities by leveraging quantum computing and artificial intelligence 
              to create perfect matches between talented individuals and innovative companies, 
              fostering meaningful careers and driving economic growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why We Started Ask Ya Cham
              </h3>
              <p className="text-gray-600 mb-6">
                Traditional job matching relies on keyword matching and basic algorithms, 
                leading to poor matches and frustrated job seekers. We saw an opportunity 
                to revolutionize this process using quantum computing and advanced AI.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform analyzes not just skills and experience, but also cultural fit, 
                career aspirations, learning potential, and long-term compatibility to create 
                matches that truly work for both candidates and employers.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Quantum Computing</Badge>
                <Badge variant="secondary">AI-Powered</Badge>
                <Badge variant="secondary">Cultural Fit</Badge>
                <Badge variant="secondary">Career Growth</Badge>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RocketLaunchIcon className="h-12 w-12 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  The Future of Work
                </h4>
                <p className="text-gray-600">
                  We're building the infrastructure for the future of work, 
                  where every professional finds their perfect role and every 
                  company discovers their ideal talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the latest in quantum computing, AI, and user experience 
              design to create the most advanced career matching system ever built.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of engineers, designers, and career experts 
              passionate about revolutionizing how people find their dream jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Dream Career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already discovered their perfect job matches 
            through our revolutionary platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-green-600">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
