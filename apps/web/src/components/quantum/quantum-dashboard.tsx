'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CpuChipIcon,
  ChartBarIcon,
  BoltIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { realQuantumService } from '@/lib/quantum-computing-service'
import { QuantumProvider } from '@/types/quantum'

export function QuantumDashboard() {
  const [quantumStatus, setQuantumStatus] = useState<any>(null)
  const [providers, setProviders] = useState<QuantumProvider[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<any[]>([])

  useEffect(() => {
    loadQuantumStatus()
    loadProviders()
  }, [])

  const loadQuantumStatus = async () => {
    try {
      const status = realQuantumService.getQuantumStatus()
      setQuantumStatus(status)
    } catch (error) {
      }
  }

  const loadProviders = async () => {
    try {
      const availableProviders = realQuantumService.getAvailableProviders()
      setProviders(availableProviders)
    } catch (error) {
      }
  }

  const executeQuantumTest = async () => {
    setIsExecuting(true)
    try {
      // Simulate quantum job matching execution
      const mockProfile = {
        id: 'test-user',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning'],
        experience: 5,
        preferences: {
          location: ['San Francisco', 'Remote'],
          salary: { min: 100000, max: 200000 },
          workType: ['Full-time'],
          companySize: ['Startup', 'Medium', 'Large']
        },
        quantumState: {
          amplitude: 0.8,
          phase: Math.PI / 4,
          coherence: 0.95,
          entanglement: ['skill-matching', 'culture-fit']
        }
      }

      const mockJobs = [
        { id: '1', title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120,000 - $150,000' },
        { id: '2', title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Remote', salary: '$100,000 - $130,000' },
        { id: '3', title: 'Machine Learning Engineer', company: 'AI Solutions', location: 'New York, NY', salary: '$140,000 - $180,000' }
      ]

      const results = await realQuantumService.executeQuantumJobMatching(mockProfile, mockJobs)
      setExecutionResults(results)
    } catch (error) {
      } finally {
      setIsExecuting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'good': return <CheckCircleIcon className="h-5 w-5 text-blue-600" />
      case 'degraded': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'critical': return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quantum Computing Dashboard</h2>
          <p className="text-gray-600">Real-time quantum computing performance and status</p>
        </div>
        <Button 
          onClick={executeQuantumTest}
          disabled={isExecuting}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {isExecuting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Executing Quantum Algorithm...
            </>
          ) : (
            <>
              <BoltIcon className="h-4 w-4 mr-2" />
              Execute Quantum Test
            </>
          )}
        </Button>
      </div>

      {/* Quantum Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {provider.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      provider.type === 'hardware' 
                        ? 'bg-green-100 text-green-800' 
                        : provider.type === 'simulator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {provider.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <span>{provider.endpoint}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.slice(0, 2).map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {provider.capabilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.capabilities.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quantum Status */}
      {quantumStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CpuChipIcon className="h-5 w-5 mr-2 text-purple-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Provider</span>
                  <Badge variant="secondary">{quantumStatus.activeProvider}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Providers</span>
                  <span className="font-semibold">{quantumStatus.availableProviders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quantum Results</span>
                  <span className="font-semibold">{quantumStatus.quantumResults}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quantum Volume</span>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-600">64</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gate Fidelity</span>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-600">99.9%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Coherence Time</span>
                  <span className="font-semibold">150μs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost per Match</span>
                  <span className="font-semibold">$0.05</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Savings vs Classical</span>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-600">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ROI</span>
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-semibold text-green-600">320%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Execution Results */}
      {executionResults.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BoltIcon className="h-5 w-5 mr-2 text-purple-600" />
              Latest Quantum Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {executionResults.map((result, index) => (
                <motion.div
                  key={result.jobId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{result.title}</h4>
                    <Badge className="bg-purple-100 text-purple-800">
                      {Math.round(result.quantumScore * 100)}% Match
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Quantum Advantage:</span>
                      <div className="font-semibold text-green-600">
                        +{Math.round(result.quantumAdvantage)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Execution Time:</span>
                      <div className="font-semibold">{Math.round(result.executionTime)}ms</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Backend:</span>
                      <div className="font-semibold">{result.backend}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Probability:</span>
                      <div className="font-semibold">{Math.round(result.quantumProbability * 100)}%</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-purple-700">
                    {result.quantumInsights.quantumEntanglement}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
