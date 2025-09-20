'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Clock, 
  DollarSign,
  Bookmark,
  Star,
  Eye,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  Share2,
  Heart,
  Zap,
  Shield,
  Award,
  Globe,
  Building,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  Sparkles,
  Target,
  Brain,
  Lightbulb,
  Trophy,
  Flame
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface JobCardProps {
  job: {
    id: number
    title: string
    company: string
    logo?: string
    location: string
    salary: string
    matchScore: number
    postedDate: string
    jobType: string
    isRemote: boolean
    isUrgent: boolean
    isFeatured: boolean
    isQuantum: boolean
    skills: string[]
    description: string
    isBookmarked: boolean
    views: number
    applications: number
    companySize: string
    benefits: string[]
    companyRating: number
    companyReviews: number
    diversityScore: number
    cultureScore: number
    growthScore: number
    workLifeBalance: number
    isApplied: boolean
    applicationStatus?: string
    quickApply: boolean
    aiInsights?: {
      culturalFit: number
      skillMatch: number
      growthPotential: number
      salaryMatch: number
      overallScore: number
      recommendations: string[]
    }
  }
  onBookmark: (jobId: number) => void
  onApply: (jobId: number) => void
  onShare: (jobId: number) => void
  onView: (jobId: number) => void
  onQuickApply?: (jobId: number) => void
}

export function EnhancedJobCard({ 
  job, 
  onBookmark, 
  onApply, 
  onShare, 
  onView,
  onQuickApply 
}: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBookmark(job.id)
    toast.success(job.isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    onApply(job.id)
    toast.success('Application submitted successfully!')
  }

  const handleQuickApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onQuickApply) {
      onQuickApply(job.id)
      toast.success('Quick application submitted!')
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare(job.id)
    toast.success('Job link copied to clipboard')
  }

  const handleView = () => {
    onView(job.id)
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPLIED': return 'text-blue-600 bg-blue-100'
      case 'INTERVIEW_SCHEDULED': return 'text-purple-600 bg-purple-100'
      case 'UNDER_REVIEW': return 'text-yellow-600 bg-yellow-100'
      case 'REJECTED': return 'text-red-600 bg-red-100'
      case 'OFFERED': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-300 cursor-pointer group ${
          job.isFeatured ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
        } ${job.isApplied ? 'bg-blue-50 border-blue-200' : ''}`}
        onClick={handleView}
      >
        {/* Featured Badge */}
        {job.isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Quantum Badge */}
        {job.isQuantum && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
              <Brain className="h-3 w-3 mr-1" />
              Quantum
            </Badge>
          </div>
        )}

        {/* Urgent Badge */}
        {job.isUrgent && (
          <div className="absolute top-12 right-4 z-10">
            <Badge variant="destructive" className="animate-pulse">
              <Flame className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {/* Company Logo */}
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.logo} alt={job.company} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {job.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {job.companyRating > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded-full text-xs">
                      <Star className="h-3 w-3 mr-0.5 fill-current" />
                      {job.companyRating.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {job.title}
                  </h3>
                  {job.quickApply && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Zap className="h-3 w-3 mr-1" />
                      Quick Apply
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-600 font-medium">{job.company}</p>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{job.companySize}</span>
                  {job.companyReviews > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{job.companyReviews} reviews</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.postedDate}
                  </span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Match Score & Actions */}
            <div className="flex flex-col items-end space-y-2">
              {/* Match Score */}
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                  <Target className="h-3 w-3 mr-1" />
                  {job.matchScore}% match
                </div>
                {job.aiInsights && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowAIInsights(!showAIInsights)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    AI Insights
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`h-8 w-8 p-0 ${job.isBookmarked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`h-4 w-4 ${job.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Salary & Benefits */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </div>
              {job.benefits.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  {job.benefits.slice(0, 2).join(', ')}
                  {job.benefits.length > 2 && ` +${job.benefits.length - 2} more`}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {job.views} views
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {job.applications} applied
              </span>
            </div>
          </div>

          {/* Company Culture Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Diversity</div>
              <div className="flex items-center justify-center">
                <Progress value={job.diversityScore} className="w-16 h-2 mr-2" />
                <span className="text-xs font-medium">{job.diversityScore}%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Culture</div>
              <div className="flex items-center justify-center">
                <Progress value={job.cultureScore} className="w-16 h-2 mr-2" />
                <span className="text-xs font-medium">{job.cultureScore}%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Growth</div>
              <div className="flex items-center justify-center">
                <Progress value={job.growthScore} className="w-16 h-2 mr-2" />
                <span className="text-xs font-medium">{job.growthScore}%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Work-Life</div>
              <div className="flex items-center justify-center">
                <Progress value={job.workLifeBalance} className="w-16 h-2 mr-2" />
                <span className="text-xs font-medium">{job.workLifeBalance}%</span>
              </div>
            </div>
          </div>

          {/* Application Status */}
          {job.isApplied && job.applicationStatus && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Application Status: {job.applicationStatus.replace('_', ' ')}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                  Track Application
                </Button>
              </div>
            </div>
          )}

          {/* AI Insights */}
          <AnimatePresence>
            {showAIInsights && job.aiInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-center mb-3">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-800">AI Insights</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Cultural Fit</div>
                    <div className="text-lg font-bold text-purple-600">{job.aiInsights.culturalFit}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Skill Match</div>
                    <div className="text-lg font-bold text-blue-600">{job.aiInsights.skillMatch}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Growth Potential</div>
                    <div className="text-lg font-bold text-green-600">{job.aiInsights.growthPotential}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Salary Match</div>
                    <div className="text-lg font-bold text-orange-600">{job.aiInsights.salaryMatch}%</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Recommendations:</strong> {job.aiInsights.recommendations.join(', ')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {job.quickApply && !job.isApplied ? (
                <Button
                  onClick={handleQuickApply}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Apply
                </Button>
              ) : job.isApplied ? (
                <Button variant="outline" disabled className="text-green-600 border-green-300">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Applied
                </Button>
              ) : (
                <Button
                  onClick={handleApply}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Now
                </Button>
              )}
              
              <Button variant="outline" onClick={handleView}>
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button className="flex items-center hover:text-gray-700">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </button>
              <button className="flex items-center hover:text-gray-700">
                <Flag className="h-4 w-4 mr-1" />
                Report
              </button>
            </div>
          </div>
        </CardContent>

        {/* Hover Effects */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
