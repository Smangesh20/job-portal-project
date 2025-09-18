'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const faqs = [
    {
      question: "How does Ask Ya Cham's quantum job matching work?",
      answer: "Our platform uses advanced quantum computing algorithms to analyze your skills, preferences, and career goals, then matches you with the most suitable job opportunities from our extensive database."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use enterprise-grade encryption and follow strict data protection protocols. Your information is never shared without your explicit consent."
    },
    {
      question: "How do I update my profile?",
      answer: "You can update your profile anytime by going to the Profile section in your dashboard. Make sure to keep your skills and experience current for better job matches."
    },
    {
      question: "Can I apply for jobs directly through the platform?",
      answer: "Yes! You can apply for jobs directly through our platform. We'll track your applications and provide updates on their status."
    },
    {
      question: "What if I can't find a job that matches my skills?",
      answer: "Our AI continuously learns and updates job recommendations. You can also use our advanced search filters to find specific opportunities or contact our support team for personalized assistance."
    }
  ]

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: EnvelopeIcon,
      contact: "info.askyacham@gmail.com",
      action: "Send Email"
    },
    {
      title: "Phone Support",
      description: "Speak with our support team",
      icon: PhoneIcon,
      contact: "+1-800-ASK-YACHAM",
      action: "Call Now"
    },
    {
      title: "Live Chat",
      description: "Chat with us in real-time",
      icon: ChatBubbleLeftRightIcon,
      contact: "Available 24/7",
      action: "Start Chat"
    },
    {
      title: "Video Call",
      description: "Schedule a video consultation",
      icon: VideoCameraIcon,
      contact: "Book appointment",
      action: "Schedule"
    }
  ]

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn how to create an effective profile and find your first job",
      icon: BookOpenIcon,
      href: "/guides/getting-started"
    },
    {
      title: "Job Search Tips",
      description: "Expert advice on optimizing your job search strategy",
      icon: LightBulbIcon,
      href: "/guides/job-search-tips"
    },
    {
      title: "Resume Builder",
      description: "Create a professional resume with our AI-powered builder",
      icon: DocumentTextIcon,
      href: "/tools/resume-builder"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
              <QuestionMarkCircleIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
        </motion.div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <option.icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <p className="text-sm font-medium text-gray-900 mb-4">{option.contact}</p>
                  <Button className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <resource.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{resource.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

