'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  UserPlus, 
  Brain, 
  MessageSquare, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Build a comprehensive profile with your skills, experience, and career goals.',
    details: [
      'Upload your resume and portfolio',
      'Define your skills and expertise',
      'Set your career preferences',
      'Add your availability and location'
    ],
    badge: 'Step 1',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'Quantum Computing Matching Magic',
    description: 'Our advanced quantum computing analyzes your profile and finds perfect job matches.',
    details: [
      'Semantic skill analysis',
      'Cultural fit assessment',
      'Salary and location matching',
      'Career progression alignment'
    ],
    badge: 'Step 2',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: MessageSquare,
    title: 'Connect & Communicate',
    description: 'Chat directly with employers and schedule interviews seamlessly.',
    details: [
      'Real-time messaging platform',
      'Video interview scheduling',
      'Collaborative hiring process',
      'Instant notifications'
    ],
    badge: 'Step 3',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: CheckCircle,
    title: 'Land Your Dream Job',
    description: 'Get hired faster with our streamlined application and interview process.',
    details: [
      'Simplified application process',
      'Interview preparation tools',
      'Offer negotiation support',
      'Onboarding assistance'
    ],
    badge: 'Step 4',
    color: 'from-orange-500 to-red-500'
  }
]

const benefits = [
  {
    icon: Sparkles,
    title: '95% Match Accuracy',
    description: 'Our quantum computing delivers incredibly accurate job matches based on multiple factors.'
  },
  {
    icon: ArrowRight,
    title: '3x Faster Hiring',
    description: 'Streamlined process reduces time-to-hire significantly.'
  },
  {
    icon: CheckCircle,
    title: 'Higher Success Rate',
    description: 'Better matches lead to more successful placements and retention.'
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Getting your dream job has never been easier. Our quantum computing-powered platform 
            simplifies the entire process from profile creation to job acceptance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 transform translate-x-4" />
                )}
                
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader className="text-center pb-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${step.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {step.badge}
                      </Badge>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 dark:text-gray-300 mb-6">
                      {step.description}
                    </CardDescription>
                    <ul className="space-y-2 text-sm text-left">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Our Process Works
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our data-driven approach delivers measurable results for both job seekers and employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Join thousands of professionals who found their dream jobs with Ask Ya Cham
          </p>
        </div>
      </div>
    </section>
  )
}
