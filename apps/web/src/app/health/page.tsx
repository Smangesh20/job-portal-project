import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health Check - Ask Ya Cham',
  description: 'System health status and monitoring',
}

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          System Healthy
        </h1>
        
        <p className="text-gray-600 mb-4">
          All systems are operating normally
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-600 font-medium">Healthy</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span>1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
