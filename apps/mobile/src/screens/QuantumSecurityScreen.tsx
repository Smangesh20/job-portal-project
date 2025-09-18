import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'
import { useTranscendence } from '../contexts/TranscendenceContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const QuantumSecurityScreen: React.FC = () => {
  const {
    quantumSecurityEnabled,
    currentQuantumState,
    quantumEntanglementId,
    superpositionLevel,
    quantumThreatLevel,
    quantumEvents,
    quantumSecurityStats,
    detectQuantumThreats,
    generateQuantumKey,
    validateQuantumEntanglement,
    performQuantumErrorCorrection,
    migrateToPostQuantum,
    getQuantumSecurityStatus,
  } = useQuantumSecurity()

  const { currentState, consciousnessLevel } = useTranscendence()

  const [animatedValues] = useState({
    superposition: new Animated.Value(superpositionLevel),
    threatLevel: new Animated.Value(0),
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  useEffect(() => {
    animateValues()
  }, [superpositionLevel, quantumThreatLevel])

  const animateValues = () => {
    Animated.parallel([
      Animated.timing(animatedValues.superposition, {
        toValue: superpositionLevel,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.threatLevel, {
        toValue: quantumThreatLevel === 'quantum_critical' ? 100 : 
                 quantumThreatLevel === 'quantum_high' ? 75 :
                 quantumThreatLevel === 'quantum_medium' ? 50 : 25,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start()
  }

  const handleQuantumAction = async (action: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    setSelectedAction(action)

    try {
      switch (action) {
        case 'generateKey':
          await generateQuantumKey()
          Alert.alert('Success', 'Quantum key generated successfully')
          break
        case 'validateEntanglement':
          const isValid = await validateQuantumEntanglement(quantumEntanglementId)
          Alert.alert(
            'Validation Result',
            isValid ? 'Quantum entanglement is valid' : 'Quantum entanglement breach detected'
          )
          break
        case 'errorCorrection':
          await performQuantumErrorCorrection()
          Alert.alert('Success', 'Quantum error correction completed')
          break
        case 'postQuantum':
          await migrateToPostQuantum()
          Alert.alert('Success', 'Post-quantum cryptography migration completed')
          break
        case 'threatScan':
          const hasThreats = await detectQuantumThreats({ test: 'quantum_scan' })
          Alert.alert(
            'Threat Scan Result',
            hasThreats ? 'Quantum threats detected' : 'No quantum threats found'
          )
          break
        default:
          break
      }
    } catch (error) {
      logger.error('Quantum action error:', error)
      Alert.alert('Error', 'Failed to perform quantum action. Please try again.')
    } finally {
      setIsProcessing(false)
      setSelectedAction(null)
    }
  }

  const getThreatLevelColor = (level: string) => {
    const colors = {
      quantum_low: '#10b981',
      quantum_medium: '#f59e0b',
      quantum_high: '#ef4444',
      quantum_critical: '#dc2626',
    }
    return colors[level as keyof typeof colors] || '#6b7280'
  }

  const getThreatLevelIcon = (level: string) => {
    const icons = {
      quantum_low: 'shield-checkmark',
      quantum_medium: 'shield-warning',
      quantum_high: 'shield-half',
      quantum_critical: 'shield-close',
    }
    return icons[level as keyof typeof colors] || 'shield'
  }

  const getEventTypeIcon = (type: string) => {
    const icons = {
      quantum_threat_detected: 'warning',
      quantum_entanglement_breach: 'link',
      quantum_tunneling_attempt: 'flash',
      quantum_superposition_violation: 'layers',
      quantum_decoherence_attack: 'radio',
      post_quantum_migration: 'arrow-forward',
      quantum_key_compromise: 'key',
      quantum_randomness_failure: 'dice',
      quantum_error_detected: 'bug',
      quantum_state_collapse: 'close-circle',
    }
    return icons[type as keyof typeof icons] || 'information-circle'
  }

  const renderQuantumStatus = () => (
    <View style={styles.statusContainer}>
      <LinearGradient
        colors={quantumSecurityEnabled ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
        style={styles.statusGradient}
      >
        <Ionicons
          name={quantumSecurityEnabled ? 'shield-checkmark' : 'shield-close'}
          size={32}
          color="white"
        />
        <Text style={styles.statusTitle}>
          {quantumSecurityEnabled ? 'Quantum Security Active' : 'Quantum Security Disabled'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {quantumSecurityEnabled
            ? 'Your data is protected by quantum-resistant encryption'
            : 'Enable quantum security for maximum protection'}
        </Text>
      </LinearGradient>
    </View>
  )

  const renderQuantumMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Quantum Metrics</Text>
      
      {/* Superposition Level */}
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Quantum Superposition Level</Text>
        <View style={styles.metricBar}>
          <Animated.View
            style={[
              styles.metricFill,
              {
                backgroundColor: superpositionLevel > 50 ? '#10b981' : '#ef4444',
                width: animatedValues.superposition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.metricValue}>{superpositionLevel.toFixed(1)}%</Text>
      </View>

      {/* Threat Level */}
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Quantum Threat Level</Text>
        <View style={styles.metricBar}>
          <Animated.View
            style={[
              styles.metricFill,
              {
                backgroundColor: getThreatLevelColor(quantumThreatLevel),
                width: animatedValues.threatLevel.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.metricValue}>
          {quantumThreatLevel.replace('quantum_', '').toUpperCase()}
        </Text>
      </View>

      {/* Quantum State */}
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Current Quantum State</Text>
        <Text style={styles.quantumState}>
          {currentQuantumState.substring(0, 32)}...
        </Text>
      </View>

      {/* Entanglement ID */}
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Quantum Entanglement ID</Text>
        <Text style={styles.entanglementId}>
          {quantumEntanglementId.substring(0, 16)}...
        </Text>
      </View>
    </View>
  )

  const renderQuantumActions = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Quantum Actions</Text>
      
      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedAction === 'generateKey' && styles.actionButtonActive,
          isProcessing && styles.actionButtonDisabled,
        ]}
        onPress={() => handleQuantumAction('generateKey')}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={selectedAction === 'generateKey' ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
          style={styles.actionGradient}
        >
          <Ionicons
            name="key"
            size={24}
            color={selectedAction === 'generateKey' ? 'white' : '#6366f1'}
          />
          <Text
            style={[
              styles.actionText,
              selectedAction === 'generateKey' && styles.actionTextActive,
            ]}
          >
            Generate Quantum Key
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedAction === 'validateEntanglement' && styles.actionButtonActive,
          isProcessing && styles.actionButtonDisabled,
        ]}
        onPress={() => handleQuantumAction('validateEntanglement')}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={selectedAction === 'validateEntanglement' ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
          style={styles.actionGradient}
        >
          <Ionicons
            name="link"
            size={24}
            color={selectedAction === 'validateEntanglement' ? 'white' : '#6366f1'}
          />
          <Text
            style={[
              styles.actionText,
              selectedAction === 'validateEntanglement' && styles.actionTextActive,
            ]}
          >
            Validate Entanglement
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedAction === 'errorCorrection' && styles.actionButtonActive,
          isProcessing && styles.actionButtonDisabled,
        ]}
        onPress={() => handleQuantumAction('errorCorrection')}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={selectedAction === 'errorCorrection' ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
          style={styles.actionGradient}
        >
          <Ionicons
            name="bug"
            size={24}
            color={selectedAction === 'errorCorrection' ? 'white' : '#6366f1'}
          />
          <Text
            style={[
              styles.actionText,
              selectedAction === 'errorCorrection' && styles.actionTextActive,
            ]}
          >
            Error Correction
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedAction === 'postQuantum' && styles.actionButtonActive,
          isProcessing && styles.actionButtonDisabled,
        ]}
        onPress={() => handleQuantumAction('postQuantum')}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={selectedAction === 'postQuantum' ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
          style={styles.actionGradient}
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color={selectedAction === 'postQuantum' ? 'white' : '#6366f1'}
          />
          <Text
            style={[
              styles.actionText,
              selectedAction === 'postQuantum' && styles.actionTextActive,
            ]}
          >
            Post-Quantum Migration
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          selectedAction === 'threatScan' && styles.actionButtonActive,
          isProcessing && styles.actionButtonDisabled,
        ]}
        onPress={() => handleQuantumAction('threatScan')}
        disabled={isProcessing}
      >
        <LinearGradient
          colors={selectedAction === 'threatScan' ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
          style={styles.actionGradient}
        >
          <Ionicons
            name="search"
            size={24}
            color={selectedAction === 'threatScan' ? 'white' : '#6366f1'}
          />
          <Text
            style={[
              styles.actionText,
              selectedAction === 'threatScan' && styles.actionTextActive,
            ]}
          >
            Threat Scan
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderQuantumEvents = () => (
    <View style={styles.eventsContainer}>
      <Text style={styles.sectionTitle}>Recent Quantum Events</Text>
      {quantumEvents.slice(0, 5).map((event, index) => (
        <View key={event.id} style={styles.eventItem}>
          <View style={styles.eventHeader}>
            <Ionicons
              name={getEventTypeIcon(event.type) as any}
              size={20}
              color={getThreatLevelColor(event.severity)}
            />
            <Text style={styles.eventType}>
              {event.type.replace('quantum_', '').replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.eventTime}>
              {new Date(event.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <View style={styles.eventFooter}>
            <Text style={styles.eventSeverity}>
              {event.severity.replace('quantum_', '').toUpperCase()}
            </Text>
            <Text style={styles.eventRisk}>Risk: {event.riskScore}%</Text>
          </View>
        </View>
      ))}
    </View>
  )

  const renderQuantumStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Quantum Security Statistics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{quantumSecurityStats.totalEvents}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {quantumSecurityStats.averageRiskScore.toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Avg Risk</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Object.keys(quantumSecurityStats.eventsByType).length}
          </Text>
          <Text style={styles.statLabel}>Event Types</Text>
        </View>
      </View>
    </View>
  )

  const renderConsciousnessIntegration = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Consciousness Integration</Text>
      <View style={styles.integrationItem}>
        <Ionicons name="star" size={24} color="#6366f1" />
        <Text style={styles.integrationText}>
          Current Transcendence State: {currentState.replace('_', ' ').toUpperCase()}
        </Text>
      </View>
      <View style={styles.integrationItem}>
        <Ionicons name="bulb" size={24} color="#8b5cf6" />
        <Text style={styles.integrationText}>
          Consciousness Level: {consciousnessLevel.toFixed(1)}%
        </Text>
      </View>
      <View style={styles.integrationItem}>
        <Ionicons name="shield" size={24} color="#10b981" />
        <Text style={styles.integrationText}>
          Quantum-Enhanced Consciousness Protection Active
        </Text>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Quantum Security</Text>
          <Text style={styles.subtitle}>
            Revolutionary quantum-resistant protection
          </Text>
        </View>
      </LinearGradient>

      {renderQuantumStatus()}
      {renderQuantumMetrics()}
      {renderQuantumActions()}
      {renderQuantumEvents()}
      {renderQuantumStats()}
      {renderConsciousnessIntegration()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statusContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statusGradient: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  metricsContainer: {
    padding: 20,
  },
  metricItem: {
    marginBottom: 20,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  metricBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  quantumState: {
    fontSize: 12,
    color: '#6366f1',
    fontFamily: 'monospace',
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 4,
  },
  entanglementId: {
    fontSize: 12,
    color: '#8b5cf6',
    fontFamily: 'monospace',
    backgroundColor: '#faf5ff',
    padding: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
  actionTextActive: {
    color: 'white',
  },
  eventsContainer: {
    padding: 20,
  },
  eventItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 8,
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  eventDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventSeverity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  eventRisk: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  consciousnessContainer: {
    padding: 20,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  integrationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
})

export default QuantumSecurityScreen
