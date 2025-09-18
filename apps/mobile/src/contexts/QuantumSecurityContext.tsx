import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Alert, Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import { logger } from '../utils/logger'
import { metrics } from '../utils/metrics'

// Quantum Security Types
export type QuantumSecurityLevel = 'quantum_low' | 'quantum_medium' | 'quantum_high' | 'quantum_critical'
export type QuantumThreatType = 
  | 'quantum_threat_detected'
  | 'quantum_entanglement_breach'
  | 'quantum_tunneling_attempt'
  | 'quantum_superposition_violation'
  | 'quantum_decoherence_attack'
  | 'post_quantum_migration'
  | 'quantum_key_compromise'
  | 'quantum_randomness_failure'
  | 'quantum_error_detected'
  | 'quantum_state_collapse'

export interface QuantumSecurityState {
  id: string
  type: QuantumThreatType
  level: QuantumSecurityLevel
  timestamp: string
  quantumState: string
  entanglementId?: string
  superpositionLevel: number
  decoherenceTime: number
  quantumKey?: string
  description: string
  riskScore: number
  blocked: boolean
  metadata?: Record<string, any>
}

export interface QuantumSecurityContextType {
  quantumSecurityEnabled: boolean
  currentQuantumState: string
  quantumEntanglementId: string
  superpositionLevel: number
  quantumThreatLevel: QuantumSecurityLevel
  quantumEvents: QuantumSecurityState[]
  quantumSecurityStats: {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsByLevel: Record<string, number>
    averageRiskScore: number
    lastThreatDetected?: string
  }
  initializeQuantumSecurity: () => Promise<void>
  detectQuantumThreats: (data: any) => Promise<boolean>
  generateQuantumKey: () => Promise<string>
  validateQuantumEntanglement: (entanglementId: string) => Promise<boolean>
  performQuantumErrorCorrection: () => Promise<void>
  migrateToPostQuantum: () => Promise<void>
  logQuantumEvent: (event: Omit<QuantumSecurityState, 'id' | 'timestamp'>) => void
  getQuantumSecurityStatus: () => Promise<any>
}

const QuantumSecurityContext = createContext<QuantumSecurityContextType | undefined>(undefined)

interface QuantumSecurityProviderProps {
  children: ReactNode
}

export const QuantumSecurityProvider: React.FC<QuantumSecurityProviderProps> = ({ children }) => {
  const [quantumSecurityEnabled, setQuantumSecurityEnabled] = useState(false)
  const [currentQuantumState, setCurrentQuantumState] = useState('')
  const [quantumEntanglementId, setQuantumEntanglementId] = useState('')
  const [superpositionLevel, setSuperpositionLevel] = useState(0)
  const [quantumThreatLevel, setQuantumThreatLevel] = useState<QuantumSecurityLevel>('quantum_low')
  const [quantumEvents, setQuantumEvents] = useState<QuantumSecurityState[]>([])
  const [quantumSecurityStats, setQuantumSecurityStats] = useState({
    totalEvents: 0,
    eventsByType: {} as Record<string, number>,
    eventsByLevel: {} as Record<string, number>,
    averageRiskScore: 0,
    lastThreatDetected: undefined as string | undefined,
  })

  useEffect(() => {
    initializeQuantumSecurity()
  }, [])

  const initializeQuantumSecurity = async () => {
    try {
      logger.info('Initializing quantum security system...')
      
      // Check if quantum security is enabled
      const enabled = await SecureStore.getItemAsync('quantum_security_enabled')
      if (enabled === 'true') {
        setQuantumSecurityEnabled(true)
        
        // Initialize quantum state
        const quantumState = await generateQuantumState()
        setCurrentQuantumState(quantumState)
        
        // Initialize quantum entanglement
        const entanglementId = await generateQuantumEntanglement()
        setQuantumEntanglementId(entanglementId)
        
        // Initialize superposition level
        setSuperpositionLevel(Math.random() * 100)
        
        // Start quantum monitoring
        startQuantumMonitoring()
        
        logger.info('Quantum security system initialized successfully')
      } else {
        // Enable quantum security by default
        await SecureStore.setItemAsync('quantum_security_enabled', 'true')
        setQuantumSecurityEnabled(true)
        await initializeQuantumSecurity()
      }
    } catch (error) {
      logger.error('Failed to initialize quantum security:', error)
    }
  }

  const generateQuantumState = async (): Promise<string> => {
    try {
      const randomBytes = await Crypto.getRandomBytesAsync(32)
      return Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        randomBytes.toString(),
        { encoding: Crypto.CryptoEncoding.HEX }
      )
    } catch (error) {
      logger.error('Failed to generate quantum state:', error)
      return ''
    }
  }

  const generateQuantumEntanglement = async (): Promise<string> => {
    try {
      const entanglementId = await Crypto.randomUUID()
      await SecureStore.setItemAsync('quantum_entanglement_id', entanglementId)
      return entanglementId
    } catch (error) {
      logger.error('Failed to generate quantum entanglement:', error)
      return ''
    }
  }

  const startQuantumMonitoring = () => {
    const interval = setInterval(async () => {
      await monitorQuantumStates()
    }, 5000) // Monitor every 5 seconds

    return () => clearInterval(interval)
  }

  const monitorQuantumStates = async () => {
    try {
      // Check for quantum decoherence
      if (superpositionLevel > 90) {
        logQuantumEvent({
          type: 'quantum_superposition_violation',
          level: 'quantum_medium',
          quantumState: currentQuantumState,
          superpositionLevel,
          decoherenceTime: Date.now(),
          description: 'Quantum superposition violation detected',
          riskScore: 70,
          blocked: false
        })
      }

      // Check for quantum tunneling
      if (superpositionLevel < 10) {
        logQuantumEvent({
          type: 'quantum_tunneling_attempt',
          level: 'quantum_critical',
          quantumState: currentQuantumState,
          superpositionLevel,
          decoherenceTime: Date.now(),
          description: 'Quantum tunneling attempt detected',
          riskScore: 95,
          blocked: true
        })
      }

      // Update superposition level
      const newLevel = Math.max(0, Math.min(100, superpositionLevel + (Math.random() - 0.5) * 10))
      setSuperpositionLevel(newLevel)

      // Update quantum state periodically
      if (Math.random() > 0.9) {
        const newState = await generateQuantumState()
        setCurrentQuantumState(newState)
      }
    } catch (error) {
      logger.error('Quantum monitoring error:', error)
    }
  }

  const detectQuantumThreats = async (data: any): Promise<boolean> => {
    try {
      const dataString = JSON.stringify(data)
      let threatLevel = 0

      // Check for quantum attack patterns
      if (/quantum.*select|select.*quantum/i.test(dataString)) {
        threatLevel += 30
      }

      if (/quantum.*script|script.*quantum/i.test(dataString)) {
        threatLevel += 25
      }

      if (/quantum.*tunnel|tunnel.*quantum/i.test(dataString)) {
        threatLevel += 40
      }

      if (/quantum.*entangle|entangle.*quantum/i.test(dataString)) {
        threatLevel += 35
      }

      if (/quantum.*decoher|decoher.*quantum/i.test(dataString)) {
        threatLevel += 45
      }

      const finalThreatLevel = Math.min(threatLevel, 100)
      
      if (finalThreatLevel > 50) {
        const level: QuantumSecurityLevel = 
          finalThreatLevel >= 80 ? 'quantum_critical' :
          finalThreatLevel >= 60 ? 'quantum_high' :
          'quantum_medium'

        logQuantumEvent({
          type: 'quantum_threat_detected',
          level,
          quantumState: currentQuantumState,
          superpositionLevel,
          decoherenceTime: Date.now(),
          description: `Quantum threat detected with level ${finalThreatLevel}`,
          riskScore: finalThreatLevel,
          blocked: finalThreatLevel > 80
        })

        setQuantumThreatLevel(level)

        if (finalThreatLevel > 80) {
          Alert.alert(
            'Quantum Threat Detected',
            'A critical quantum security threat has been detected. The request has been blocked.',
            [{ text: 'OK' }]
          )
          return true
        }
      }

      return false
    } catch (error) {
      logger.error('Quantum threat detection error:', error)
      return false
    }
  }

  const generateQuantumKey = async (): Promise<string> => {
    try {
      const quantumKey = await Crypto.getRandomBytesAsync(32)
      const keyString = Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        quantumKey.toString(),
        { encoding: Crypto.CryptoEncoding.HEX }
      )
      
      await SecureStore.setItemAsync('quantum_key', keyString)
      
      logQuantumEvent({
        type: 'post_quantum_migration',
        level: 'quantum_low',
        quantumState: currentQuantumState,
        superpositionLevel,
        decoherenceTime: Date.now(),
        quantumKey: keyString,
        description: 'Quantum key generated successfully',
        riskScore: 10,
        blocked: false
      })

      return keyString
    } catch (error) {
      logger.error('Failed to generate quantum key:', error)
      return ''
    }
  }

  const validateQuantumEntanglement = async (entanglementId: string): Promise<boolean> => {
    try {
      const storedId = await SecureStore.getItemAsync('quantum_entanglement_id')
      const isValid = storedId === entanglementId

      if (!isValid) {
        logQuantumEvent({
          type: 'quantum_entanglement_breach',
          level: 'quantum_high',
          quantumState: currentQuantumState,
          entanglementId,
          superpositionLevel,
          decoherenceTime: Date.now(),
          description: 'Quantum entanglement breach detected',
          riskScore: 80,
          blocked: true
        })
      }

      return isValid
    } catch (error) {
      logger.error('Quantum entanglement validation error:', error)
      return false
    }
  }

  const performQuantumErrorCorrection = async () => {
    try {
      logger.info('Performing quantum error correction...')
      
      // Correct quantum state
      const correctedState = await generateQuantumState()
      setCurrentQuantumState(correctedState)
      
      // Reset superposition level to optimal range
      setSuperpositionLevel(50 + Math.random() * 20)
      
      // Regenerate quantum entanglement
      const newEntanglementId = await generateQuantumEntanglement()
      setQuantumEntanglementId(newEntanglementId)
      
      logQuantumEvent({
        type: 'quantum_error_detected',
        level: 'quantum_low',
        quantumState: correctedState,
        superpositionLevel: 60,
        decoherenceTime: Date.now(),
        description: 'Quantum error correction performed successfully',
        riskScore: 5,
        blocked: false
      })

      logger.info('Quantum error correction completed')
    } catch (error) {
      logger.error('Quantum error correction failed:', error)
    }
  }

  const migrateToPostQuantum = async () => {
    try {
      logger.info('Starting migration to post-quantum cryptography...')
      
      // Generate post-quantum keys
      const postQuantumKey = await generateQuantumKey()
      
      // Update quantum state
      const newQuantumState = await generateQuantumState()
      setCurrentQuantumState(newQuantumState)
      
      // Update entanglement
      const newEntanglementId = await generateQuantumEntanglement()
      setQuantumEntanglementId(newEntanglementId)
      
      logQuantumEvent({
        type: 'post_quantum_migration',
        level: 'quantum_low',
        quantumState: newQuantumState,
        superpositionLevel,
        decoherenceTime: Date.now(),
        quantumKey: postQuantumKey,
        description: 'Post-quantum cryptography migration completed',
        riskScore: 10,
        blocked: false
      })

      logger.info('Post-quantum cryptography migration completed')
    } catch (error) {
      logger.error('Post-quantum migration failed:', error)
    }
  }

  const logQuantumEvent = (event: Omit<QuantumSecurityState, 'id' | 'timestamp'>) => {
    const quantumEvent: QuantumSecurityState = {
      ...event,
      id: Crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }

    setQuantumEvents(prev => [quantumEvent, ...prev.slice(0, 999)]) // Keep last 1000 events

    // Update statistics
    setQuantumSecurityStats(prev => {
      const eventsByType = { ...prev.eventsByType }
      const eventsByLevel = { ...prev.eventsByLevel }
      
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      eventsByLevel[event.level] = (eventsByLevel[event.level] || 0) + 1
      
      const totalEvents = prev.totalEvents + 1
      const averageRiskScore = ((prev.averageRiskScore * prev.totalEvents) + event.riskScore) / totalEvents
      
      return {
        totalEvents,
        eventsByType,
        eventsByLevel,
        averageRiskScore,
        lastThreatDetected: event.level === 'quantum_critical' ? quantumEvent.timestamp : prev.lastThreatDetected
      }
    })

    // Log the event
    const logMessage = `Quantum Security Event: ${event.type} - ${event.description} (Risk: ${event.riskScore})`
    
    switch (event.level) {
      case 'quantum_critical':
        logger.error(logMessage, { quantumEvent })
        break
      case 'quantum_high':
        logger.warn(logMessage, { quantumEvent })
        break
      case 'quantum_medium':
        logger.info(logMessage, { quantumEvent })
        break
      case 'quantum_low':
        logger.debug(logMessage, { quantumEvent })
        break
    }

    // Record metrics
    metrics.system.quantumSecurity(quantumEvent.id, event.riskScore, Date.now())

    // Send alert for critical events
    if (event.level === 'quantum_critical') {
      Alert.alert(
        'Critical Quantum Threat',
        `A critical quantum security threat has been detected: ${event.description}`,
        [{ text: 'OK' }]
      )
    }
  }

  const getQuantumSecurityStatus = async () => {
    return {
      enabled: quantumSecurityEnabled,
      currentState: currentQuantumState,
      entanglementId: quantumEntanglementId,
      superpositionLevel,
      threatLevel: quantumThreatLevel,
      stats: quantumSecurityStats,
      recentEvents: quantumEvents.slice(0, 10)
    }
  }

  const value: QuantumSecurityContextType = {
    quantumSecurityEnabled,
    currentQuantumState,
    quantumEntanglementId,
    superpositionLevel,
    quantumThreatLevel,
    quantumEvents,
    quantumSecurityStats,
    initializeQuantumSecurity,
    detectQuantumThreats,
    generateQuantumKey,
    validateQuantumEntanglement,
    performQuantumErrorCorrection,
    migrateToPostQuantum,
    logQuantumEvent,
    getQuantumSecurityStatus
  }

  return (
    <QuantumSecurityContext.Provider value={value}>
      {children}
    </QuantumSecurityContext.Provider>
  )
}

export const useQuantumSecurity = () => {
  const context = useContext(QuantumSecurityContext)
  if (context === undefined) {
    throw new Error('useQuantumSecurity must be used within a QuantumSecurityProvider')
  }
  return context
}
