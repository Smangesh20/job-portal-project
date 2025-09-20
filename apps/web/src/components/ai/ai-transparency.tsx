'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Target, 
  Shield, 
  Eye, 
  EyeOff, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Users, 
  Clock, 
  Star, 
  Zap, 
  Lightbulb, 
  Settings, 
  RefreshCw, 
  Download, 
  Share2, 
  BookOpen, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIMatchExplanation {
  jobId: string
  overallScore: number
  factors: {
    skillMatch: {
      score: number
      weight: number
      details: Array<{
        skill: string
        required: number
        candidate: number
        match: number
        importance: 'high' | 'medium' | 'low'
      }>
    }
    experienceMatch: {
      score: number
      weight: number
      details: {
        yearsRequired: number
        yearsCandidate: number
        relevance: number
        industryMatch: number
      }
    }
    culturalFit: {
      score: number
      weight: number
      details: {
        valuesAlignment: number
        workStyleMatch: number
        teamDynamics: number
        companyCulture: number
      }
    }
    locationMatch: {
      score: number
      weight: number
      details: {
        remoteWork: boolean
        locationPreference: number
        timeZoneCompatibility: number
      }
    }
    salaryMatch: {
      score: number
      weight: number
      details: {
        expectedSalary: number
        offeredSalary: number
        marketRate: number
        flexibility: number
      }
    }
  }
  fairnessScore: number
  biasAnalysis: {
    genderBias: number
    ageBias: number
    ethnicityBias: number
    educationBias: number
    locationBias: number
  }
  recommendations: Array<{
    type: 'improve' | 'warning' | 'info'
    title: string
    description: string
    impact: number
  }>
  confidence: number
  lastUpdated: Date
}

interface AIAlgorithmInfo {
  name: string
  version: string
  description: string
  accuracy: number
  fairness: number
  transparency: number
  lastTrained: Date
  trainingData: {
    size: number
    diversity: number
    quality: number
  }
  performance: {
    precision: number
    recall: number
    f1Score: number
  }
  biasMitigation: Array<{
    technique: string
    description: string
    effectiveness: number
  }>
}

interface FairnessMetrics {
  demographicParity: number
  equalizedOdds: number
  calibration: number
  individualFairness: number
  counterfactualFairness: number
}

const mockMatchExplanation: AIMatchExplanation = {
  jobId: 'job-123',
  overallScore: 87,
  factors: {
    skillMatch: {
      score: 92,
      weight: 0.35,
      details: [
        { skill: 'React', required: 90, candidate: 85, match: 94, importance: 'high' },
        { skill: 'TypeScript', required: 80, candidate: 75, match: 94, importance: 'high' },
        { skill: 'Node.js', required: 70, candidate: 80, match: 100, importance: 'medium' },
        { skill: 'AWS', required: 60, candidate: 45, match: 75, importance: 'low' }
      ]
    },
    experienceMatch: {
      score: 85,
      weight: 0.25,
      details: {
        yearsRequired: 5,
        yearsCandidate: 4,
        relevance: 90,
        industryMatch: 85
      }
    },
    culturalFit: {
      score: 88,
      weight: 0.20,
      details: {
        valuesAlignment: 90,
        workStyleMatch: 85,
        teamDynamics: 88,
        companyCulture: 90
      }
    },
    locationMatch: {
      score: 95,
      weight: 0.10,
      details: {
        remoteWork: true,
        locationPreference: 100,
        timeZoneCompatibility: 90
      }
    },
    salaryMatch: {
      score: 78,
      weight: 0.10,
      details: {
        expectedSalary: 120000,
        offeredSalary: 110000,
        marketRate: 115000,
        flexibility: 85
      }
    }
  },
  fairnessScore: 89,
  biasAnalysis: {
    genderBias: 2,
    ageBias: 1,
    ethnicityBias: 3,
    educationBias: 5,
    locationBias: 2
  },
  recommendations: [
    {
      type: 'improve',
      title: 'Improve AWS Skills',
      description: 'Consider learning AWS to increase your match score by 8%',
      impact: 8
    },
    {
      type: 'warning',
      title: 'Salary Expectation Gap',
      description: 'Your salary expectation is 9% higher than the offered range',
      impact: -5
    },
    {
      type: 'info',
      title: 'Strong Cultural Fit',
      description: 'Your values and work style align well with the company culture',
      impact: 3
    }
  ],
  confidence: 92,
  lastUpdated: new Date()
}

const mockAlgorithmInfo: AIAlgorithmInfo = {
  name: 'QuantumMatch AI v2.1',
  version: '2.1.0',
  description: 'Advanced quantum-inspired matching algorithm that considers multiple factors for optimal job-candidate pairing',
  accuracy: 94,
  fairness: 89,
  transparency: 92,
  lastTrained: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  trainingData: {
    size: 2500000,
    diversity: 87,
    quality: 91
  },
  performance: {
    precision: 92,
    recall: 89,
    f1Score: 90
  },
  biasMitigation: [
    {
      technique: 'Demographic Parity',
      description: 'Ensures equal selection rates across demographic groups',
      effectiveness: 85
    },
    {
      technique: 'Adversarial Debiasing',
      description: 'Uses adversarial networks to reduce bias in predictions',
      effectiveness: 78
    },
    {
      technique: 'Fairness Constraints',
      description: 'Applies mathematical constraints to ensure fair outcomes',
      effectiveness: 82
    }
  ]
}

const mockFairnessMetrics: FairnessMetrics = {
  demographicParity: 89,
  equalizedOdds: 87,
  calibration: 91,
  individualFairness: 88,
  counterfactualFairness: 85
}

export function AITransparency() {
  const [matchExplanation, setMatchExplanation] = useState<AIMatchExplanation>(mockMatchExplanation)
  const [algorithmInfo, setAlgorithmInfo] = useState<AIAlgorithmInfo>(mockAlgorithmInfo)
  const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetrics>(mockFairnessMetrics)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getBiasColor = (bias: number) => {
    if (bias <= 2) return 'text-green-600 bg-green-100'
    if (bias <= 5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'improve': return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Info className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'improve': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'info': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Transparency</h2>
          <p className="text-gray-600">Understand how our AI makes matching decisions and ensures fairness</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* AI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Algorithm Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{algorithmInfo.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fairness Score</p>
                <p className="text-2xl font-bold text-gray-900">{algorithmInfo.fairness}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transparency</p>
                <p className="text-2xl font-bold text-gray-900">{algorithmInfo.transparency}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{matchExplanation.confidence}%</p>
              </div>
              <Brain className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="explanation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explanation">Match Explanation</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Info</TabsTrigger>
          <TabsTrigger value="fairness">Fairness Analysis</TabsTrigger>
          <TabsTrigger value="bias">Bias Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation" className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overall Match Score: {matchExplanation.overallScore}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={matchExplanation.overallScore} className="h-3" />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Confidence: {matchExplanation.confidence}%</span>
                  <span>Last updated: {matchExplanation.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Match Factors Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(matchExplanation.factors).map(([factorKey, factor]) => (
                  <div key={factorKey} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize">{factorKey.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getScoreColor(factor.score)}>
                          {factor.score}%
                        </Badge>
                        <span className="text-sm text-gray-500">Weight: {Math.round(factor.weight * 100)}%</span>
                      </div>
                    </div>
                    
                    <Progress value={factor.score} className="h-2 mb-3" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(factor.details).map(([detailKey, detailValue]) => (
                        <div key={detailKey} className="text-sm">
                          <span className="font-medium capitalize">
                            {detailKey.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-2">
                            {typeof detailValue === 'number' ? `${detailValue}%` : detailValue.toString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matchExplanation.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${getRecommendationColor(rec.type)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getRecommendationIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Impact: {rec.impact > 0 ? '+' : ''}{rec.impact}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Algorithm Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{algorithmInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{algorithmInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Trained:</span>
                      <span className="font-medium">{algorithmInfo.lastTrained.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precision:</span>
                      <span className="font-medium">{algorithmInfo.performance.precision}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recall:</span>
                      <span className="font-medium">{algorithmInfo.performance.recall}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">F1 Score:</span>
                      <span className="font-medium">{algorithmInfo.performance.f1Score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{algorithmInfo.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Training Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{algorithmInfo.trainingData.size.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Data Points</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{algorithmInfo.trainingData.diversity}%</div>
                    <div className="text-sm text-gray-600">Diversity</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{algorithmInfo.trainingData.quality}%</div>
                    <div className="text-sm text-gray-600">Quality</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fairness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fairness Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(fairnessMetrics).map(([metric, value]) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-bold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bias Mitigation Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algorithmInfo.biasMitigation.map((technique, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{technique.technique}</h4>
                        <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
                      </div>
                      <Badge className={getScoreColor(technique.effectiveness)}>
                        {technique.effectiveness}% effective
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Bias Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(matchExplanation.biasAnalysis).map(([biasType, biasValue]) => (
                  <div key={biasType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {biasType.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge className={getBiasColor(biasValue)}>
                        {biasValue}% bias
                      </Badge>
                    </div>
                    <Progress value={100 - biasValue} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {biasValue <= 2 ? 'Very low bias' : 
                       biasValue <= 5 ? 'Low bias' : 
                       biasValue <= 10 ? 'Moderate bias' : 'High bias'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fairness Score: {matchExplanation.fairnessScore}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={matchExplanation.fairnessScore} className="h-3" />
                <div className="text-sm text-gray-600">
                  <p>
                    Our AI system is designed to minimize bias and ensure fair matching across all demographic groups. 
                    The fairness score is calculated based on multiple fairness metrics and bias detection algorithms.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    This score indicates good fairness performance
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
