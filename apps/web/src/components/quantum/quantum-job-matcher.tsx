'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CpuChipIcon,
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { realQuantumService } from '@/lib/quantum-computing-service'
import { QuantumJobMatch, QuantumProfile } from '@/types/quantum'

interface QuantumJobMatcherProps {
  profile: QuantumProfile
  jobs: any[]
  onMatchesFound: (matches: QuantumJobMatch[]) => void
}

export function QuantumJobMatcher({ profile, jobs, onMatchesFound }: QuantumJobMatcherProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionProgress, setExecutionProgress] = useState(0)
  const [quantumResults, setQuantumResults] = useState<QuantumJobMatch[]>([])
  const [selectedProvider, setSelectedProvider] = useState('ibm')
  const [executionStats, setExecutionStats] = useState<any>(null)

  const executeQuantumMatching = async () => {
    setIsExecuting(true)
    setExecutionProgress(0)
    setQuantumResults([])

    try {
      // Simulate quantum execution progress
      const progressInterval = setInterval(() => {
        setExecutionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      // Execute real quantum job matching
      const results = await realQuantumService.executeQuantumJobMatching(
        profile,
        jobs,
        selectedProvider
      )

      clearInterval(progressInterval)
      setExecutionProgress(100)
      setQuantumResults(results)
      onMatchesFound(results)

      // Calculate execution statistics
      const stats = {
        totalJobs: jobs.length,
        averageScore: results.reduce((sum, r) => sum + r.quantumScore, 0) / results.length,
        averageAdvantage: results.reduce((sum, r) => sum + r.quantumAdvantage, 0) / results.length,
        executionTime: results[0]?.executionTime || 0,
        backend: results[0]?.backend || 'unknown'
      }
      setExecutionStats(stats)

    } catch (error) {
      } finally {
      setIsExecuting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100'
    if (score >= 0.8) return 'text-blue-600 bg-blue-100'
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getAdvantageColor = (advantage: number) => {
    if (advantage >= 20) return 'text-green-600'
    if (advantage >= 10) return 'text-blue-600'
    if (advantage >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Quantum Execution Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CpuChipIcon className="h-6 w-6 mr-3 text-purple-600" />
            Quantum Computing Job Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Provider Selection */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantum Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isExecuting}
              >
                <option value="ibm">IBM Quantum Network</option>
                <option value="google">Google Quantum AI</option>
                <option value="azure">Microsoft Azure Quantum</option>
                <option value="braket">Amazon Braket</option>
              </select>
            </div>

            {/* Execution Button */}
            <Button
              onClick={executeQuantumMatching}
              disabled={isExecuting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Executing Quantum Algorithm... {Math.round(executionProgress)}%
                </>
              ) : (
                <>
                  <BoltIcon className="h-5 w-5 mr-3" />
                  Execute Quantum Job Matching
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isExecuting && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${executionProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execution Statistics */}
      {executionStats && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
              Quantum Execution Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{executionStats.totalJobs}</div>
                <div className="text-sm text-gray-600">Jobs Analyzed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(executionStats.averageScore * 100)}%
                </div>
                <div className="text-sm text-gray-600">Avg Match Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  +{Math.round(executionStats.averageAdvantage)}%
                </div>
                <div className="text-sm text-gray-600">Quantum Advantage</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(executionStats.executionTime)}ms
                </div>
                <div className="text-sm text-gray-600">Execution Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quantum Results */}
      {quantumResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" />
            Quantum-Enhanced Job Matches
          </h3>
          
          {quantumResults.map((result, index) => (
            <motion.div
              key={result.jobId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {result.title}
                      </h4>
                      <p className="text-gray-600 mb-2">{result.company} • {result.location}</p>
                      <p className="text-green-600 font-semibold">{result.salary}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`px-3 py-1 ${getScoreColor(result.quantumScore)}`}>
                        {Math.round(result.quantumScore * 100)}% Match
                      </Badge>
                      <div className={`text-sm font-semibold ${getAdvantageColor(result.quantumAdvantage)}`}>
                        +{Math.round(result.quantumAdvantage)}% Quantum Advantage
                      </div>
                    </div>
                  </div>

                  {/* Quantum Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{result.quantumInsights.quantumEntanglement}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{result.quantumInsights.quantumSuperposition}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <BoltIcon className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-gray-700">{result.quantumInsights.quantumInterference}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClockIcon className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-gray-700">{result.quantumInsights.quantumCoherence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span>Backend: {result.backend}</span>
                      <span>Execution: {Math.round(result.executionTime)}ms</span>
                      <span>Probability: {Math.round(result.quantumProbability * 100)}%</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                      Apply with Quantum Advantage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
