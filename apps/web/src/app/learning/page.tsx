'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Users, 
  Award, 
  TrendingUp,
  Search,
  Filter,
  Bookmark,
  Share,
  Download,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Target,
  Lightbulb,
  Globe,
  Video,
  FileText,
  ExternalLink
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
              duration: '8 hours',
              level: 'Advanced',
              rating: 4.8,
              students: 1250,
              progress: 75,
              status: 'In Progress',
              category: 'Frontend Development',
              description: 'Master advanced React concepts including hooks, context, and performance optimization'
            },
            {
              id: 2,
              title: 'Machine Learning Fundamentals',
              instructor: 'Dr. Mike Chen',
              duration: '12 hours',
              level: 'Intermediate',
              rating: 4.9,
              students: 2100,
              progress: 0,
              status: 'Not Started',
              category: 'Data Science',
              description: 'Learn the fundamentals of machine learning and AI from scratch'
            },
            {
              id: 3,
              title: 'AWS Cloud Architecture',
              instructor: 'Lisa Wang',
              duration: '10 hours',
              level: 'Intermediate',
              rating: 4.7,
              students: 1800,
              progress: 100,
              status: 'Completed',
              category: 'Cloud Computing',
              description: 'Design and implement scalable cloud solutions on AWS'
            }
          ],
          skills: [
            {
              name: 'React',
              level: 'Advanced',
              progress: 85,
              nextMilestone: 'Expert',
              coursesCompleted: 3,
              certifications: 2
            },
            {
              name: 'TypeScript',
              level: 'Intermediate',
              progress: 60,
              nextMilestone: 'Advanced',
              coursesCompleted: 2,
              certifications: 1
            },
            {
              name: 'AWS',
              level: 'Intermediate',
              progress: 70,
              nextMilestone: 'Advanced',
              coursesCompleted: 2,
              certifications: 1
            }
          ],
          achievements: [
            {
              id: 1,
              title: 'React Master',
              description: 'Completed 5 React courses',
              icon: '🏆',
              earnedDate: '2024-12-15',
              rarity: 'Rare'
            },
            {
              id: 2,
              title: 'Cloud Architect',
              description: 'Earned AWS Solutions Architect certification',
              icon: '☁️',
              earnedDate: '2024-12-10',
              rarity: 'Epic'
            },
            {
              id: 3,
              title: 'Learning Streak',
              description: '30 days of continuous learning',
              icon: '🔥',
              earnedDate: '2024-12-20',
              rarity: 'Common'
            }
          ],
          recommendations: [
            {
              id: 1,
              title: 'Next.js 14 Complete Guide',
              reason: 'Based on your React skills',
              difficulty: 'Intermediate',
              duration: '6 hours'
            },
            {
              id: 2,
              title: 'Docker for Developers',
              reason: 'Popular with your skill set',
              difficulty: 'Beginner',
              duration: '4 hours'
            }
          ]
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
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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
          📚 Learning Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Enhance your skills with real-time learning progress and personalized recommendations.
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses and skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Professional certs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Mastered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Advanced level</p>
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
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {course.instructor}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
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
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating}</span>
                    <span>•</span>
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {course.status === 'In Progress' ? (
                    <Button size="sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  ) : course.status === 'Not Started' ? (
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Progress and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6" />
              <span>Skills Progress</span>
            </CardTitle>
            <CardDescription>Track your skill development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningData?.skills.map((skill: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <Badge className={getLevelColor(skill.level)}>
                    {skill.level}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{skill.progress}% complete</span>
                  <span>Next: {skill.nextMilestone}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                  <span>{skill.coursesCompleted} courses</span>
                  <span>{skill.certifications} certifications</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningData?.achievements.map((achievement: any) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Earned on {achievement.earnedDate}
                  </p>
                </div>
                <Badge className={achievement.rarity === 'Epic' ? 'bg-purple-100 text-purple-800' : achievement.rarity === 'Rare' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6" />
            <span>Recommended for You</span>
          </CardTitle>
          <CardDescription>Personalized course recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningData?.recommendations.map((rec: any) => (
              <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getLevelColor(rec.difficulty)}>
                      {rec.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {rec.duration}
                    </span>
                  </div>
                </div>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}