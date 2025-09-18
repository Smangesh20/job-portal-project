/**
 * QUANTUM COMPUTING TYPES
 * Type definitions for real quantum computing integration
 */

export interface QuantumProfile {
  id: string
  skills: string[]
  experience: number
  preferences: {
    location: string[]
    salary: {
      min: number
      max: number
    }
    workType: string[]
    companySize: string[]
  }
  quantumState: QuantumState
}

export interface QuantumState {
  amplitude: number
  phase: number
  coherence: number
  entanglement: string[]
}

export interface QuantumJobMatch {
  jobId: string
  title: string
  company: string
  location: string
  salary: string
  quantumScore: number
  quantumProbability: number
  quantumAdvantage: number
  quantumInsights: QuantumInsights
  executionTime: number
  backend: string
}

export interface QuantumInsights {
  quantumEntanglement: string
  quantumSuperposition: string
  quantumInterference: string
  quantumTunneling: string
  quantumCoherence: string
}

export interface QuantumCircuit {
  name: string
  qubits: number
  gates: QuantumGate[]
  measurements: number[]
}

export interface QuantumGate {
  type: 'hadamard' | 'cnot' | 'phase' | 'rotation' | 'measurement'
  qubits: number[]
  control?: number
  target?: number
  angle?: number
}

export interface QuantumResult {
  measurements: Record<string, string>[]
  counts: Record<string, number>
  execution_time: number
  backend: string
  quantum_volume?: number
  fidelity?: number
}

export interface QuantumProvider {
  name: string
  apiKey: string
  endpoint: string
  type: 'simulator' | 'hardware' | 'hybrid'
  capabilities: string[]
  quantum_volume?: number
  max_qubits?: number
  availability?: 'available' | 'busy' | 'offline'
}

export interface QuantumAlgorithm {
  name: string
  description: string
  complexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n²)' | 'O(2ⁿ)'
  qubits_required: number
  gates_required: number
  applications: string[]
}

export interface QuantumOptimization {
  problem_type: 'job_matching' | 'skill_analysis' | 'career_path' | 'salary_optimization'
  variables: number
  constraints: string[]
  objective_function: string
  quantum_advantage: number
  classical_complexity: string
  quantum_complexity: string
}

export interface QuantumMachineLearning {
  model_type: 'quantum_neural_network' | 'quantum_svm' | 'quantum_clustering'
  training_data: any[]
  quantum_features: string[]
  accuracy: number
  quantum_speedup: number
  convergence_rate: number
}

export interface QuantumAnalytics {
  total_executions: number
  average_execution_time: number
  quantum_advantage_achieved: number
  success_rate: number
  cost_per_execution: number
  energy_efficiency: number
}

export interface QuantumDashboardData {
  real_time_status: {
    active_providers: number
    queued_jobs: number
    current_execution: string
    system_health: 'optimal' | 'good' | 'degraded' | 'critical'
  }
  performance_metrics: {
    quantum_volume: number
    gate_fidelity: number
    coherence_time: number
    error_rate: number
  }
  cost_analysis: {
    total_cost: number
    cost_per_match: number
    savings_vs_classical: number
    roi: number
  }
  quantum_insights: {
    top_algorithms: string[]
    optimization_opportunities: string[]
    performance_trends: any[]
    recommendations: string[]
  }
}
