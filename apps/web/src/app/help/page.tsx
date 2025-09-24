'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  BookOpen, 
  Video, 
  FileText,
  Users,
  Settings,
  Shield,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react'

// GOOGLE-STYLE HELP PAGE
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      icon: BookOpen,
      articles: [
        'How to create your profile',
        'Setting up job alerts',
        'Understanding job matches',
        'First steps guide'
      ]
    },
    {
      title: 'Job Search',
      description: 'Find and apply to jobs effectively',
      icon: Search,
      articles: [
        'Advanced search filters',
        'Saving and organizing jobs',
        'Application tracking',
        'Interview scheduling'
      ]
    },
    {
      title: 'Profile & Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      articles: [
        'Updating your profile',
        'Privacy settings',
        'Notification preferences',
        'Account security'
      ]
    },
    {
      title: 'AI Features',
      description: 'Make the most of our AI-powered tools',
      icon: Zap,
      articles: [
        'AI job matching',
        'Resume optimization',
        'Interview preparation',
        'Career insights'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How do I create a professional profile?',
      answer: 'Go to your Profile section and fill in all the required information including your skills, experience, and education. Upload a professional photo and resume for better visibility.'
    },
    {
      question: 'How does the AI job matching work?',
      answer: 'Our AI analyzes your profile, skills, and preferences to match you with relevant job opportunities. The more complete your profile, the better the matches.'
    },
    {
      question: 'Can I track my job applications?',
      answer: 'Yes! All your applications are tracked in the Applications section where you can see the status, interview schedules, and updates from employers.'
    },
    {
      question: 'How do I schedule interviews?',
      answer: 'When an employer is interested, you\'ll receive a notification. You can then schedule interviews directly through the platform or coordinate with the employer.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security measures to protect your personal information and ensure your data is safe and private.'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🆘 Help & Support
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get help with using our platform and find answers to common questions.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Live Chat</CardTitle>
            <CardDescription>Get instant help from our support team</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Email Support</CardTitle>
            <CardDescription>Send us a detailed message</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Video Call</CardTitle>
            <CardDescription>Schedule a one-on-one session</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Schedule Call
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpCategories.map((category, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <category.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <div key={articleIndex} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{article}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-6 w-6" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>Get in touch with our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Email</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@askyacham.com</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Response within 24 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Live Chat</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Instant responses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}