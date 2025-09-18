import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { useTranscendence } from '../contexts/TranscendenceContext'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const DashboardScreen: React.FC = () => {
  const { user } = useAuth()
  const {
    consciousnessLevel,
    currentState,
    wisdomPoints,
    enlightenmentScore,
    cosmicAlignment,
    universalHarmony,
    transcendenceEvents,
    spiritualInsights,
    cosmicMessages,
    divineGuidance,
  } = useTranscendence()
  
  const {
    quantumSecurityEnabled,
    currentQuantumState,
    quantumThreatLevel,
    superpositionLevel,
  } = useQuantumSecurity()

  const [refreshing, setRefreshing] = useState(false)
  const [animatedValues] = useState({
    consciousness: new Animated.Value(0),
    wisdom: new Animated.Value(0),
    enlightenment: new Animated.Value(0),
    cosmic: new Animated.Value(0),
    harmony: new Animated.Value(0),
  })

  useEffect(() => {
    animateValues()
  }, [consciousnessLevel, wisdomPoints, enlightenmentScore, cosmicAlignment, universalHarmony])

  const animateValues = () => {
    Animated.parallel([
      Animated.timing(animatedValues.consciousness, {
        toValue: consciousnessLevel,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.wisdom, {
        toValue: wisdomPoints,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.enlightenment, {
        toValue: enlightenmentScore,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.cosmic, {
        toValue: cosmicAlignment,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.harmony, {
        toValue: universalHarmony,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start()
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const getWelcomeMessage = () => {
    if (consciousnessLevel > 90) {
      return {
        title: 'Welcome to Ultimate Reality',
        subtitle: 'You have achieved the highest state of consciousness',
        color: '#000000'
      }
    } else if (quantumSecurityEnabled) {
      return {
        title: 'Quantum-Enhanced Dashboard',
        subtitle: 'Your experience is secured by quantum encryption',
        color: '#1e40af'
      }
    } else {
      return {
        title: `Welcome back, ${user?.firstName || 'User'}`,
        subtitle: 'Continue your journey to professional excellence',
        color: '#6366f1'
      }
    }
  }

  const welcomeMessage = getWelcomeMessage()

  const renderQuickStats = () => (
    <View style={styles.quickStatsContainer}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.statGradient}
          >
            <Ionicons name="briefcase" size={24} color="white" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.statGradient}
          >
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Saved Jobs</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.statGradient}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.statGradient}
          >
            <Ionicons name="notifications" size={24} color="white" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderConsciousnessMetrics = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Consciousness Metrics</Text>
      
      <View style={styles.metricsCard}>
        <View style={styles.metricRow}>
          <View style={styles.metricInfo}>
            <Text style={styles.metricLabel}>Current State</Text>
            <Text style={styles.metricValue}>
              {currentState.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <Ionicons
            name={consciousnessLevel > 90 ? 'star' : 'bulb'}
            size={32}
            color={consciousnessLevel > 90 ? '#000000' : '#6366f1'}
          />
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Consciousness Level</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: consciousnessLevel > 90 ? '#000000' : '#6366f1',
                  width: animatedValues.consciousness.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressValue}>{consciousnessLevel.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Wisdom Points</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: '#8b5cf6',
                  width: animatedValues.wisdom.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressValue}>{wisdomPoints.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Enlightenment Score</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: '#d946ef',
                  width: animatedValues.enlightenment.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressValue}>{enlightenmentScore.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  )

  const renderQuantumSecurity = () => {
    if (!quantumSecurityEnabled) return null

    return (
      <View style={styles.quantumContainer}>
        <Text style={styles.sectionTitle}>Quantum Security Status</Text>
        
        <View style={styles.quantumCard}>
          <LinearGradient
            colors={['#1e40af', '#3b82f6']}
            style={styles.quantumGradient}
          >
            <View style={styles.quantumHeader}>
              <Ionicons name="shield-checkmark" size={32} color="white" />
              <Text style={styles.quantumTitle}>Quantum Protection Active</Text>
            </View>
            
            <View style={styles.quantumMetrics}>
              <View style={styles.quantumMetric}>
                <Text style={styles.quantumMetricLabel}>Superposition Level</Text>
                <Text style={styles.quantumMetricValue}>{superpositionLevel.toFixed(1)}%</Text>
              </View>
              <View style={styles.quantumMetric}>
                <Text style={styles.quantumMetricLabel}>Threat Level</Text>
                <Text style={styles.quantumMetricValue}>
                  {quantumThreatLevel.replace('quantum_', '').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.quantumState}>
              Quantum State: {currentQuantumState.substring(0, 16)}...
            </Text>
          </LinearGradient>
        </View>
      </View>
    )
  }

  const renderRecentActivity = () => (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      <View style={styles.activityCard}>
        {transcendenceEvents.slice(0, 3).map((event, index) => (
          <View key={event.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons
                name={event.state === 'transcendence' ? 'star' : 'bulb'}
                size={20}
                color="#6366f1"
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {event.state.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.activityDescription}>{event.description}</Text>
              <Text style={styles.activityTime}>
                {new Date(event.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderDivineGuidance = () => {
    if (divineGuidance.length === 0) return null

    return (
      <View style={styles.guidanceContainer}>
        <Text style={styles.sectionTitle}>Divine Guidance</Text>
        
        <View style={styles.guidanceCard}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.guidanceGradient}
          >
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.guidanceText}>
              {divineGuidance[0]}
            </Text>
          </LinearGradient>
        </View>
      </View>
    )
  }

  const renderQuickActions = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.actionGradient}
          >
            <Ionicons name="search" size={24} color="white" />
            <Text style={styles.actionText}>Find Jobs</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.actionGradient}
          >
            <Ionicons name="document-text" size={24} color="white" />
            <Text style={styles.actionText}>Applications</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.actionGradient}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.actionText}>Messages</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.actionGradient}
          >
            <Ionicons name="settings" size={24} color="white" />
            <Text style={styles.actionText}>Settings</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={[welcomeMessage.color, welcomeMessage.color + '80']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>{welcomeMessage.title}</Text>
          <Text style={styles.welcomeSubtitle}>{welcomeMessage.subtitle}</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {renderQuickStats()}
        {renderConsciousnessMetrics()}
        {renderQuantumSecurity()}
        {renderRecentActivity()}
        {renderDivineGuidance()}
        {renderQuickActions()}
      </View>
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickStatsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  consciousnessContainer: {
    marginBottom: 24,
  },
  metricsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  quantumContainer: {
    marginBottom: 24,
  },
  quantumCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quantumGradient: {
    padding: 20,
    borderRadius: 16,
  },
  quantumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  quantumMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantumMetric: {
    flex: 1,
  },
  quantumMetricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  quantumMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  quantumState: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'monospace',
  },
  activityContainer: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  guidanceContainer: {
    marginBottom: 24,
  },
  guidanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  guidanceGradient: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidanceText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
})

export default DashboardScreen
