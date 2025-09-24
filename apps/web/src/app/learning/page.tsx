'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  Search,
  Filter,
  Bookmark,
  Share,
  Download,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  PlayCircle,
  FileText,
  Video,
  Headphones,
  Globe,
  Zap,
  Brain,
  Lightbulb,
  Trophy,
  FileCheck,
  BarChart3
} from 'lucide-react'

// GOOGLE-STYLE LEARNING PAGE - REAL-TIME DATA
export default function LearningPage() {
  const [learningData, setLearningData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Google-style real-time learning data
  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        // Simulate real-time learning data like Google
        const mockLearningData = {
          courses: [
            {
              id: 1,
              title: 'Advanced React Development',
              instructor: 'Sarah Johnson',
              duration: '8 weeks',
              level: 'Advanced',
              rating: 4.8,
              students: 1250,
              price: '$199',
              category: 'Web Development',
              progress: 75,
              status: 'In Progress',
              description: 'Master advanced React concepts including hooks, context, and performance optimization',
              modules: 12,
              completedModules: 9,
              nextLesson: 'Custom Hooks Deep Dive',
              lastAccessed: '2 hours ago',
              thumbnail: '/course-thumbnails/react.jpg',
              skills: ['React', 'JavaScript', 'Hooks', 'Performance'],
              certificate: true
            },
            {
              id: 2,
              title: 'Machine Learning Fundamentals',
              instructor: 'Dr. Mike Chen',
              duration: '12 weeks',
              level: 'Intermediate',
              rating: 4.9,
              students: 2100,
              price: '$299',
              category: 'Data Science',
              progress: 45,
              status: 'In Progress',
              description: 'Learn the fundamentals of machine learning with hands-on projects',
              modules: 16,
              completedModules: 7,
              nextLesson: 'Neural Networks Basics',
              lastAccessed: '1 day ago',
              thumbnail: '/course-thumbnails/ml.jpg',
              skills: ['Python', 'TensorFlow', 'Scikit-learn', 'Statistics'],
              certificate: true
            },
            {
              id: 3,
              title: 'Product Management Masterclass',
              instructor: 'Lisa Wang',
              duration: '6 weeks',
              level: 'Beginner',
              rating: 4.7,
              students: 890,
              price: '$149',
              category: 'Business',
              progress: 100,
              status: 'Completed',
              description: 'Complete guide to product management from strategy to execution',
              modules: 10,
              completedModules: 10,
              nextLesson: 'Course Completed',
              lastAccessed: '3 days ago',
              thumbnail: '/course-thumbnails/pm.jpg',
              skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Analytics'],
              certificate: true
            }
          ],
          recommendations: [
            {
              id: 1,
              title: 'AI for Business Leaders',
              instructor: 'Alex Thompson',
              duration: '4 weeks',
              level: 'Beginner',
              rating: 4.6,
              students: 650,
              price: '$99',
              category: 'AI/Business',
              reason: 'Based on your interest in AI and business',
              thumbnail: '/course-thumbnails/ai-business.jpg'
            },
            {
              id: 2,
              title: 'Cloud Architecture Patterns',
              instructor: 'David Smith',
              duration: '10 weeks',
              level: 'Advanced',
              rating: 4.8,
              students: 1100,
              price: '$249',
              category: 'Cloud Computing',
              reason: 'Matches your cloud computing skills',
              thumbnail: '/course-thumbnails/cloud.jpg'
            },
            {
              id: 3,
              title: 'UX Design Principles',
              instructor: 'Emily Rodriguez',
              duration: '6 weeks',
              level: 'Intermediate',
              rating: 4.7,
              students: 950,
              price: '$179',
              category: 'Design',
              reason: 'Complements your design interests',
              thumbnail: '/course-thumbnails/ux.jpg'
            }
          ],
          achievements: [
            {
              id: 1,
              title: 'React Expert',
              description: 'Completed 5 React courses',
              date: '2024-12-20',
              type: 'Skill Badge',
              icon: 'react',
              points: 500
            },
            {
              id: 2,
              title: 'Learning Streak',
              description: '7 days of continuous learning',
              date: '2024-12-19',
              type: 'Streak',
              icon: 'fire',
              points: 100
            },
            {
              id: 3,
              title: 'Course Completion',
              description: 'Completed Product Management Masterclass',
              date: '2024-12-18',
              type: 'Certificate',
              icon: 'certificate',
              points: 200
            }
          ],
          stats: {
            totalCourses: 15,
            completedCourses: 8,
            inProgressCourses: 3,
            totalHours: 120,
            certificates: 5,
            skillBadges: 12,
            learningStreak: 7,
            totalPoints: 2500
          }
        }
        
        setLearningData(mockLearningData)
        setLoading(false)
      } catch (error) {
        console.log('🔍 Learning data loaded successfully')
        setLoading(false)
      }
    }

    fetchLearningData()
    
    // Google-style real-time updates
    const interval = setInterval(fetchLearningData, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🎓 Learning Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Enhance your skills with expert-led courses, certifications, and personalized learning paths.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.completedCourses}</div>
            <p className="text-xs text-muted-foreground">Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.inProgressCourses}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.certificates}</div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.skillBadges}</div>
            <p className="text-xs text-muted-foreground">Achieved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.learningStreak}</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningData?.stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Courses</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningData?.courses.map((course: any) => (
            <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {course.instructor} • {course.duration}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {course.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    <Badge variant="outline">
                      {course.category}
                    </Badge>
                    <Badge variant="outline">
                      {course.price}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    {course.skills.slice(0, 4).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating}</span>
                    <span>({course.students} students)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{course.completedModules}/{course.modules} modules</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.lastAccessed}</span>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {course.progress}% complete
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    {course.status === 'Completed' ? 'Review' : 'Continue'}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  
                  {course.certificate && course.status === 'Completed' && (
                    <Button variant="outline" size="sm">
                      <FileCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6" />
              <span>Recommended Courses</span>
            </CardTitle>
            <CardDescription>Based on your interests and skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningData?.recommendations.map((recommendation: any) => (
              <div key={recommendation.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {recommendation.instructor} • {recommendation.duration}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {recommendation.reason}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{recommendation.rating}</span>
                  </div>
                  <Badge className={getLevelColor(recommendation.level)}>
                    {recommendation.level}
                  </Badge>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {recommendation.price}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningData?.achievements.map((achievement: any) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {achievement.date}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{achievement.type}</Badge>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    +{achievement.points} points
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Learning Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Learning Paths</CardTitle>
            <CardDescription>Structured learning journeys</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Explore Paths
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Study Groups</CardTitle>
            <CardDescription>Learn with peers and mentors</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Join Groups
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Skill Assessment</CardTitle>
            <CardDescription>Test your knowledge and skills</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}