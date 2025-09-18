/**
 * Global type definitions to prevent TypeScript errors
 * This file extends the global Window interface to include our custom properties
 */

declare global {
  interface Window {
    // Error monitoring properties (string/boolean values)
    aiErrorMonitoring?: string
    quantumErrorMonitoring?: boolean
    databaseErrorMonitoring?: boolean
    thirdPartyServiceMonitoring?: boolean
    businessLogicMonitoring?: boolean
    uiuxMonitoring?: boolean
    dataProcessingMonitoring?: boolean
    timeDateMonitoring?: boolean
    mathematicalMonitoring?: boolean
    concurrencyMonitoring?: boolean
    configurationMonitoring?: boolean
    genericErrorMonitoring?: boolean
    
    // Error recovery functions
    aiErrorRecovery?: () => void
    quantumReset?: () => void
    quantumRecalibrate?: () => void
    clearAllCaches?: () => void
    repairCaches?: () => void
    databaseErrorRecovery?: () => void
    serviceErrorRecovery?: () => void
    businessLogicErrorRecovery?: () => void
    uiuxErrorRecovery?: () => void
    dataProcessingErrorRecovery?: () => void
    timeDateErrorRecovery?: () => void
    mathematicalErrorRecovery?: () => void
    concurrencyErrorRecovery?: () => void
    configurationErrorRecovery?: () => void
    genericErrorRecovery?: () => void
    
    // Quantum operations
    quantumOperations?: {
      errorCount: number
    }
    
    // Error handlers
    quantumErrorHandler?: any
    cacheErrorHandler?: any
  }
}

export {}
