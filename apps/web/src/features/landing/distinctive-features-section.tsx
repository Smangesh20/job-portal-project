'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CpuChipIcon,
  LanguageIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export function DistinctiveFeaturesSection() {
  const lackingFeatures = [
    {
      title: "Profile-Based Quantum Computing Job Matching",
      description: "Traditional portals mostly rely on keyword or filter-based searches, leading to lots of irrelevant roles. Advanced quantum computing can analyze the full candidate profile—including skills, experience, goals, and even work styles—to create nuanced, personalized job matches, reducing the need to sift through hundreds of listings.",
      icon: CpuChipIcon,
      color: "blue"
    },
    {
      title: "Regional Language Support",
      description: "Major portals usually operate in English and sometimes Hindi, but rarely support the full range of local languages. Newer platforms now offer job listings and candidate support in 10+ regional languages, breaking down accessibility barriers.",
      icon: LanguageIcon,
      color: "green"
    },
    {
      title: "Skill Gap & Career Path Visualization",
      description: "While basic job details are present, very few portals help job seekers visualize how their current skills stack up to a target job, which courses/trainings could help close specific gaps, and what real-world career paths are possible from their current position.",
      icon: ChartBarIcon,
      color: "purple"
    },
    {
      title: "Integrated Calendar & Interview Scheduling",
      description: "Instead of external tools, some modern portals now let users and recruiters directly sync calendars for automatic, real-time interview scheduling—greatly reducing missed connections and scheduling hassles.",
      icon: CalendarDaysIcon,
      color: "orange"
    },
    {
      title: "Embedded Video Interviewing",
      description: "The majority of established portals require using separate apps (Zoom, Teams, etc.) for video interviews, whereas some new entrants offer native, browser-based video interview capabilities—making hiring faster and smoother.",
      icon: VideoCameraIcon,
      color: "red"
    },
    {
      title: "Employer Branding with Rich Content",
      description: "Traditional job boards show company names and text descriptions, but platforms allowing companies to display videos, testimonials, and detailed culture highlights let candidates make more informed choices.",
      icon: BuildingOfficeIcon,
      color: "indigo"
    }
  ]

  const provenFeatures = [
    {
      title: "Smart Quantum Computing Job Matching",
      benefit: "Increases relevance of job recommendations, helping candidates quickly find positions that match both qualifications and aspirations. Leads to higher application success rates.",
      impact: "95% Match Success Rate"
    },
    {
      title: "Skill Gap & Personalized Upskilling",
      benefit: "Guidance on what specific certifications or skills would open doors for a particular role, with links to training resources, empowers career growth and confidence.",
      impact: "3x Faster Career Growth"
    },
    {
      title: "Calendar Integration",
      benefit: "Automatic, conflict-free scheduling of recruiter calls and interviews directly reduces candidate drop-off and saves time.",
      impact: "50% Less Drop-off Rate"
    },
    {
      title: "Multilingual Support",
      benefit: "Language inclusivity enables more candidates to participate and apply confidently, especially in diverse regions.",
      impact: "10+ Languages Supported"
    },
    {
      title: "Strong Employer Branding",
      benefit: "Videos and authentic culture content help job seekers avoid mismatches and choose workplaces where they will thrive.",
      impact: "80% Better Job Satisfaction"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600", 
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600"
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            <SparklesIcon className="w-4 h-4 mr-2" />
            What Makes Us Different
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Features That Leading Job Portals Don't Have
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most established job platforms offer strong job databases, search tools, alerts, and resume uploads. However, there are several unique, high-impact features that go beyond the basics—features designed to truly empower, guide, and support job seekers and employers in ways that deliver greater value to society.
          </p>
        </motion.div>

        {/* Lacking Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Features Lacking in Leading Job Portals
            </h3>
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <XMarkIcon className="w-5 h-5" />
              <span className="font-medium">What Others Miss</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lackingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${getColorClasses(feature.color)}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Proven Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Features Proven to Help Job Seekers
            </h3>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">What Actually Works</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {provenFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {feature.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-700">
                      {feature.benefit}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Experience the Future of Job Search?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                By focusing on these features, Ask Ya Cham provides genuinely superior value, combating information overload, bridging skill gaps, and making the entire hiring process smoother and more inclusive for all job seekers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Get Started Now
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
