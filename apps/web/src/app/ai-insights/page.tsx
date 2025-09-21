'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  CpuChipIcon,
  TargetIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function AIInsightsPage() {
  const [selectedInsight, setSelectedInsight] = useState('market')

  const insights = [
    {
      id: 'market',
      name: 'Market Trends',
      description: 'Real-time job market analysis and predictions',
      icon: ChartBarIcon,
      color: 'blue'
    },
    {
      id: 'skills',
      name: 'Skills Demand',
      description: 'Most in-demand skills and emerging technologies',
      icon: ArrowTrendingUpIcon,
      color: 'green'
    },
    {
      id: 'career',
      name: 'Career Paths',
      description: 'AI-powered career progression recommendations',
      icon: TargetIcon,
      color: 'purple'
    },
    {
      id: 'salary',
      name: 'Salary Insights',
      description: 'Market-based salary predictions and negotiations',
      icon: CpuChipIcon,
      color: 'orange'
    }
  ]

  const marketData = [
    { skill: 'AI/ML', demand: 95, growth: '+23%', jobs: 12500 },
    { skill: 'React', demand: 88, growth: '+15%', jobs: 8900 },
    { skill: 'Python', demand: 92, growth: '+18%', jobs: 11200 },
    { skill: 'Cloud Computing', demand: 85, growth: '+20%', jobs: 7600 },
    { skill: 'Data Science', demand: 90, growth: '+25%', jobs: 9800 }
  ]

  const careerPaths = [
    {
      title: 'Software Engineer → Senior Engineer',
      duration: '2-3 years',
      salaryIncrease: '+40%',
      skills: ['Leadership', 'System Design', 'Mentoring'],
      difficulty: 'Medium'
    },
    {
      title: 'Data Analyst → Data Scientist',
      duration: '1-2 years',
      salaryIncrease: '+60%',
      skills: ['Machine Learning', 'Statistics', 'Python'],
      difficulty: 'Hard'
    },
    {
      title: 'Frontend Dev → Full Stack Engineer',
      duration: '1-2 years',
      salaryIncrease: '+35%',
      skills: ['Backend Development', 'Database Design', 'DevOps'],
      difficulty: 'Medium'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Insights</h1>
          <p className="text-lg text-gray-600">
            Make data-driven career decisions with our quantum-powered AI analysis
          </p>
        </div>

        {/* Insights Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {insights.map((insight) => (
            <Card 
              key={insight.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedInsight === insight.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedInsight(insight.id)}
            >
              <CardHeader className="text-center p-4">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${insight.color}-100 flex items-center justify-center`}>
                  <insight.icon className={`w-6 h-6 text-${insight.color}-600`} />
                </div>
                <CardTitle className="text-sm">{insight.name}</CardTitle>
                <CardDescription className="text-xs">
                  {insight.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Market Trends */}
        {selectedInsight === 'market' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Top In-Demand Skills
                </CardTitle>
                <CardDescription>
                  Based on 50,000+ job postings analyzed by our AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{skill.skill}</h3>
                          <p className="text-sm text-gray-600">{skill.jobs.toLocaleString()} jobs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{skill.growth}</div>
                        <div className="text-sm text-gray-600">growth</div>
                      </div>
                      <div className="w-32">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${skill.demand}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{skill.demand}% demand</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI/ML Jobs</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +30% by 2025
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Remote Work</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        +25% by 2025
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Green Tech</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +40% by 2025
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tech Salaries</span>
                      <span className="font-semibold text-green-600">+8.5% avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI/ML Engineers</span>
                      <span className="font-semibold text-green-600">$140k-$220k</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Scientists</span>
                      <span className="font-semibold text-green-600">$120k-$180k</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Career Paths */}
        {selectedInsight === 'career' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TargetIcon className="w-6 h-6 mr-2 text-purple-600" />
                  Recommended Career Progressions
                </CardTitle>
                <CardDescription>
                  AI-powered career path recommendations based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careerPaths.map((path, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{path.title}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>Duration: {path.duration}</span>
                            <span>Salary Increase: {path.salaryIncrease}</span>
                          </div>
                        </div>
                        <Badge variant={path.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
                          {path.difficulty}
                        </Badge>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Skills to Develop:</h4>
                        <div className="flex flex-wrap gap-2">
                          {path.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Get Learning Path
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <div className="text-center">
            <RocketLaunchIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-4">Get Your Personal AI Insights</h2>
            <p className="text-lg mb-6 opacity-90">
              Upload your profile and get personalized career recommendations powered by quantum AI
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Get My Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
