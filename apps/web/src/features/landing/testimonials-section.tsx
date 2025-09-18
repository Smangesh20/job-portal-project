'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Microsoft',
    image: '/avatars/sarah.jpg',
    rating: 5,
    text: 'Ask Ya Cham completely transformed my job search experience. The quantum computing matching was incredibly accurate, and I landed my dream job at Microsoft within 2 weeks. The platform\'s cultural fit analysis was spot-on!',
    highlight: 'Found dream job in 2 weeks',
    verified: true
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'Google',
    image: '/avatars/michael.jpg',
    rating: 5,
    text: 'As a hiring manager, Ask Ya Cham has revolutionized our recruitment process. The quality of candidates we receive is exceptional, and the real-time collaboration features make the entire process seamless.',
    highlight: '3x faster hiring process',
    verified: true
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Apple',
    image: '/avatars/emily.jpg',
    rating: 5,
    text: 'The diversity and inclusion features on Ask Ya Cham are outstanding. As someone who values inclusive workplaces, I appreciate how the platform promotes fair hiring practices and helps me find companies that align with my values.',
    highlight: 'Perfect cultural match',
    verified: true
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Netflix',
    image: '/avatars/david.jpg',
    rating: 5,
    text: 'The quantum computing recommendations are incredibly intelligent. It understood my career goals and suggested opportunities I never would have found on my own. The salary insights and market analysis features are game-changers.',
    highlight: 'Quantum computing found hidden opportunities',
    verified: true
  },
  {
    name: 'Lisa Thompson',
    role: 'Marketing Director',
    company: 'Amazon',
    image: '/avatars/lisa.jpg',
    rating: 5,
    text: 'Ask Ya Cham\'s real-time messaging and interview scheduling made the entire hiring process so smooth. I could communicate directly with candidates and schedule interviews without any back-and-forth emails.',
    highlight: 'Streamlined communication',
    verified: true
  },
  {
    name: 'James Wilson',
    role: 'DevOps Engineer',
    company: 'Meta',
    image: '/avatars/james.jpg',
    rating: 5,
    text: 'The security features give me complete confidence in the platform. Knowing that my personal data is protected with enterprise-grade security while getting matched with amazing opportunities is exactly what I needed.',
    highlight: 'Enterprise-grade security',
    verified: true
  }
]

const stats = [
  {
    number: '98%',
    label: 'Success Rate',
    description: 'Of users find suitable matches'
  },
  {
    number: '4.9/5',
    label: 'User Rating',
    description: 'Based on 10,000+ reviews'
  },
  {
    number: '72hrs',
    label: 'Avg. Response',
    description: 'Time from application to interview'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            User Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from thousands of professionals 
            who have transformed their careers with Ask Ya Cham.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                </div>
                
                <blockquote className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {testimonial.highlight}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Watch Success Stories
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See how Ask Ya Cham has transformed careers and hiring processes for real users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'From Job Seeker to Dream Job',
                duration: '2:30',
                thumbnail: '/video-thumbnails/success-story-1.jpg'
              },
              {
                title: 'Hiring Manager Success',
                duration: '3:15',
                thumbnail: '/video-thumbnails/success-story-2.jpg'
              },
              {
                title: 'Career Transformation',
                duration: '2:45',
                thumbnail: '/video-thumbnails/success-story-3.jpg'
              }
            ].map((video, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden aspect-video mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-y-[8px] border-y-transparent ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Trusted by Professionals Worldwide
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              'SOC 2 Certified',
              'GDPR Compliant',
              'ISO 27001',
              'A+ Security Rating'
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
