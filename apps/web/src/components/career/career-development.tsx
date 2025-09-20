'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Brain, 
  Zap, 
  Clock, 
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  Trophy,
  Rocket,
  Shield,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  Database,
  Cloud,
  Smartphone,
  Cpu,
  Beaker,
  Palette,
  Megaphone,
  DollarSign,
  Heart,
  Eye,
  MessageSquare,
  Download,
  Share2,
  Bookmark,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Skill {
  id: string
  name: string
  category: string
  currentLevel: number
  targetLevel: number
  demand: number
  trend: 'up' | 'down' | 'stable'
  learningPath: LearningStep[]
  estimatedTime: number // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  resources: Resource[]
}

interface LearningStep {
  id: string
  title: string
  description: string
  type: 'course' | 'project' | 'certification' | 'practice'
  duration: number // in hours
  completed: boolean
  url?: string
  provider?: string
}

interface Resource {
  id: string
  title: string
  type: 'course' | 'book' | 'video' | 'article' | 'project' | 'certification'
  provider: string
  url: string
  rating: number
  duration?: number
  cost: 'free' | 'paid'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface CareerPath {
  id: string
  title: string
  description: string
  currentLevel: number
  targetLevel: number
  skills: string[]
  salaryRange: { min: number; max: number }
  growthRate: number
  jobCount: number
  requirements: string[]
  timeline: number // in months
  difficulty: 'easy' | 'medium' | 'hard'
  popularity: number
}

interface LearningGoal {
  id: string
  title: string
  description: string
  skillId: string
  targetDate: Date
  progress: number
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high'
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: Date
  points: number
}

const mockSkills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    currentLevel: 75,
    targetLevel: 90,
    demand: 95,
    trend: 'up',
    estimatedTime: 40,
    difficulty: 'intermediate',
    description: 'A JavaScript library for building user interfaces',
    learningPath: [
      {
        id: 'react-1',
        title: 'React Fundamentals',
        description: 'Learn the basics of React components, props, and state',
        type: 'course',
        duration: 8,
        completed: true,
        url: 'https://react.dev/learn',
        provider: 'React Official'
      },
      {
        id: 'react-2',
        title: 'Advanced React Patterns',
        description: 'Master hooks, context, and advanced patterns',
        type: 'course',
        duration: 12,
        completed: false,
        url: 'https://advanced-react.com',
        provider: 'Advanced React'
      },
      {
        id: 'react-3',
        title: 'Build a Portfolio Project',
        description: 'Create a full-stack application using React',
        type: 'project',
        duration: 20,
        completed: false
      }
    ],
    resources: [
      {
        id: 'react-res-1',
        title: 'React Documentation',
        type: 'article',
        provider: 'React Team',
        url: 'https://react.dev',
        rating: 4.9,
        cost: 'free',
        difficulty: 'beginner'
      },
      {
        id: 'react-res-2',
        title: 'React Course by Meta',
        type: 'course',
        provider: 'Coursera',
        url: 'https://coursera.org/react',
        rating: 4.7,
        duration: 40,
        cost: 'paid',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Programming Language',
    currentLevel: 60,
    targetLevel: 85,
    demand: 88,
    trend: 'up',
    estimatedTime: 30,
    difficulty: 'intermediate',
    description: 'A typed superset of JavaScript that compiles to plain JavaScript',
    learningPath: [
      {
        id: 'ts-1',
        title: 'TypeScript Basics',
        description: 'Learn types, interfaces, and basic TypeScript features',
        type: 'course',
        duration: 6,
        completed: true,
        url: 'https://typescriptlang.org/docs',
        provider: 'TypeScript Official'
      },
      {
        id: 'ts-2',
        title: 'Advanced TypeScript',
        description: 'Master generics, utility types, and advanced patterns',
        type: 'course',
        duration: 10,
        completed: false,
        url: 'https://advanced-typescript.com',
        provider: 'Advanced TypeScript'
      }
    ],
    resources: [
      {
        id: 'ts-res-1',
        title: 'TypeScript Handbook',
        type: 'book',
        provider: 'TypeScript Team',
        url: 'https://typescriptlang.org/docs',
        rating: 4.8,
        cost: 'free',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud Computing',
    currentLevel: 40,
    targetLevel: 80,
    demand: 92,
    trend: 'up',
    estimatedTime: 60,
    difficulty: 'advanced',
    description: 'Amazon Web Services cloud computing platform',
    learningPath: [
      {
        id: 'aws-1',
        title: 'AWS Fundamentals',
        description: 'Learn core AWS services and concepts',
        type: 'course',
        duration: 15,
        completed: false,
        url: 'https://aws.amazon.com/training',
        provider: 'AWS Training'
      },
      {
        id: 'aws-2',
        title: 'AWS Solutions Architect',
        description: 'Prepare for AWS Solutions Architect certification',
        type: 'certification',
        duration: 30,
        completed: false
      }
    ],
    resources: [
      {
        id: 'aws-res-1',
        title: 'AWS Free Tier',
        type: 'course',
        provider: 'AWS',
        url: 'https://aws.amazon.com/free',
        rating: 4.6,
        cost: 'free',
        difficulty: 'beginner'
      }
    ]
  }
]

const mockCareerPaths: CareerPath[] = [
  {
    id: 'frontend-dev',
    title: 'Senior Frontend Developer',
    description: 'Lead frontend development with modern frameworks',
    currentLevel: 3,
    targetLevel: 5,
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'JavaScript'],
    salaryRange: { min: 100000, max: 150000 },
    growthRate: 15,
    jobCount: 2340,
    requirements: ['5+ years experience', 'React expertise', 'Team leadership'],
    timeline: 12,
    difficulty: 'medium',
    popularity: 85
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    description: 'Develop both frontend and backend applications',
    currentLevel: 2,
    targetLevel: 4,
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    salaryRange: { min: 90000, max: 130000 },
    growthRate: 20,
    jobCount: 1890,
    requirements: ['3+ years experience', 'Full stack knowledge', 'Database skills'],
    timeline: 18,
    difficulty: 'hard',
    popularity: 92
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Manage infrastructure and deployment pipelines',
    currentLevel: 1,
    targetLevel: 3,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    salaryRange: { min: 110000, max: 160000 },
    growthRate: 25,
    jobCount: 1450,
    requirements: ['Infrastructure experience', 'Cloud platforms', 'Automation skills'],
    timeline: 24,
    difficulty: 'hard',
    popularity: 78
  }
]

const mockLearningGoals: LearningGoal[] = [
  {
    id: 'goal-1',
    title: 'Master React Development',
    description: 'Become proficient in React and related technologies',
    skillId: 'react',
    targetDate: new Date('2024-06-01'),
    progress: 60,
    status: 'in_progress',
    priority: 'high',
    milestones: [
      {
        id: 'milestone-1',
        title: 'Complete React Fundamentals',
        description: 'Finish the basic React course',
        completed: true,
        dueDate: new Date('2024-03-01'),
        points: 100
      },
      {
        id: 'milestone-2',
        title: 'Build First Project',
        description: 'Create a todo app with React',
        completed: true,
        dueDate: new Date('2024-03-15'),
        points: 150
      },
      {
        id: 'milestone-3',
        title: 'Advanced Patterns',
        description: 'Learn hooks and context',
        completed: false,
        dueDate: new Date('2024-04-01'),
        points: 200
      }
    ]
  }
]

export function CareerDevelopment() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>(mockCareerPaths)
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>(mockLearningGoals)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())

  const toggleSkillExpansion = (skillId: string) => {
    const newExpanded = new Set(expandedSkills)
    if (newExpanded.has(skillId)) {
      newExpanded.delete(skillId)
    } else {
      newExpanded.add(skillId)
    }
    setExpandedSkills(newExpanded)
  }

  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <Palette className="h-5 w-5" />
      case 'Backend': return <Database className="h-5 w-5" />
      case 'Cloud Computing': return <Cloud className="h-5 w-5" />
      case 'Mobile': return <Smartphone className="h-5 w-5" />
      case 'Programming Language': return <Code className="h-5 w-5" />
      case 'Data Science': return <BarChart3 className="h-5 w-5" />
      case 'AI/ML': return <Brain className="h-5 w-5" />
      case 'DevOps': return <Cpu className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Development</h2>
          <p className="text-gray-600">Build your skills and advance your career with personalized learning paths</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Progress
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="paths">Career Paths</TabsTrigger>
          <TabsTrigger value="goals">Learning Goals</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {/* Skills Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Skills</p>
                    <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {skills.filter(s => s.currentLevel < s.targetLevel).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {skills.filter(s => s.currentLevel >= s.targetLevel).length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills List */}
          <div className="space-y-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getSkillIcon(skill.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                          <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
                            {skill.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(skill.trend)}
                            <span className="text-sm text-gray-500">{skill.demand}% demand</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Current Level</span>
                            <span className="font-medium">{skill.currentLevel}%</span>
                          </div>
                          <Progress value={skill.currentLevel} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Target Level</span>
                            <span className="font-medium">{skill.targetLevel}%</span>
                          </div>
                          <Progress value={skill.targetLevel} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                          <span>Estimated time: {skill.estimatedTime}h</span>
                          <span>{skill.learningPath.length} learning steps</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSkillExpansion(skill.id)}
                    >
                      {expandedSkills.has(skill.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedSkills.has(skill.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Learning Path</h4>
                            <div className="space-y-2">
                              {skill.learningPath.map((step, index) => (
                                <div key={step.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-shrink-0">
                                    {step.completed ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-medium">{step.title}</h5>
                                      <span className="text-sm text-gray-500">{step.duration}h</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                    {step.provider && (
                                      <p className="text-xs text-gray-500 mt-1">Provider: {step.provider}</p>
                                    )}
                                  </div>
                                  {step.url && (
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={step.url} target="_blank" rel="noopener noreferrer">
                                        <Play className="h-4 w-4 mr-1" />
                                        Start
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Resources</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {skill.resources.map((resource) => (
                                <div key={resource.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-shrink-0">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm truncate">{resource.title}</h5>
                                    <p className="text-xs text-gray-500">{resource.provider}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Badge variant="outline" className="text-xs">
                                      {resource.cost}
                                    </Badge>
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        <ArrowRight className="h-3 w-3" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Salary Range</span>
                        <span className="font-medium">
                          ${path.salaryRange.min.toLocaleString()} - ${path.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Growth Rate</span>
                        <span className="font-medium text-green-600">+{path.growthRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Job Openings</span>
                        <span className="font-medium">{path.jobCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-500">
                          Level {path.currentLevel} → {path.targetLevel}
                        </span>
                      </div>
                      <Progress 
                        value={(path.currentLevel / path.targetLevel) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <Button className="w-full" onClick={() => setSelectedPath(path)}>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="space-y-4">
            {learningGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {goal.priority} priority
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              {milestone.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{milestone.title}</h5>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{milestone.points} pts</div>
                              <div className="text-xs text-gray-500">
                                Due: {milestone.dueDate.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.flatMap(skill => skill.resources).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{resource.provider}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{resource.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {resource.cost}
                      </Badge>
                      {resource.duration && (
                        <span className="text-xs text-gray-500">{resource.duration}h</span>
                      )}
                    </div>

                    <Button className="w-full" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
