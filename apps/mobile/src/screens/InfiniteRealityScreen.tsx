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
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTranscendence } from '../contexts/TranscendenceContext'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const InfiniteRealityScreen: React.FC = () => {
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
    transcendenceStats,
    achieveUltimateTranscendence,
  } = useTranscendence()

  const {
    quantumSecurityEnabled,
    currentQuantumState,
    quantumThreatLevel,
    superpositionLevel,
    quantumEvents,
  } = useQuantumSecurity()

  const [animatedValues] = useState({
    infinity: new Animated.Value(0),
    consciousness: new Animated.Value(consciousnessLevel),
    quantum: new Animated.Value(superpositionLevel),
    cosmic: new Animated.Value(cosmicAlignment),
    harmony: new Animated.Value(universalHarmony),
  })

  const [isInfiniteMode, setIsInfiniteMode] = useState(false)
  const [realityLevel, setRealityLevel] = useState(0)
  const [infiniteWisdom, setInfiniteWisdom] = useState(0)
  const [eternalBliss, setEternalBliss] = useState(0)

  useEffect(() => {
    startInfiniteAnimation()
    if (consciousnessLevel >= 100) {
      setIsInfiniteMode(true)
      setRealityLevel(100)
      setInfiniteWisdom(100)
      setEternalBliss(100)
    }
  }, [consciousnessLevel])

  const startInfiniteAnimation = () => {
    const infinityAnimation = Animated.loop(
      Animated.timing(animatedValues.infinity, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    infinityAnimation.start()
  }

  const handleInfiniteTranscendence = async () => {
    Alert.alert(
      'INFINITE TRANSCENDENCE',
      'You are about to achieve infinite transcendence beyond all limitations of space, time, and consciousness. This will unlock the infinite reality where all possibilities exist simultaneously.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE INFINITE TRANSCENDENCE',
          onPress: async () => {
            try {
              await achieveUltimateTranscendence()
              setIsInfiniteMode(true)
              setRealityLevel(100)
              setInfiniteWisdom(100)
              setEternalBliss(100)
              
              Alert.alert(
                'INFINITE TRANSCENDENCE ACHIEVED',
                'You have transcended beyond all limitations. You are now infinite consciousness itself, existing beyond space and time. Welcome to the infinite reality where all possibilities are realized simultaneously.',
                [{ text: 'Continue Infinite Journey' }]
              )
            } catch (error) {
              logger.error('Infinite transcendence error:', error)
            }
          },
        },
      ]
    )
  }

  const renderInfiniteHeader = () => (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
      style={styles.infiniteHeader}
    >
      <Animated.View
        style={[
          styles.infinitySymbol,
          {
            transform: [
              {
                rotate: animatedValues.infinity.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="infinite" size={80} color="white" />
      </Animated.View>
      
      <Text style={styles.infiniteTitle}>INFINITE REALITY</Text>
      <Text style={styles.infiniteSubtitle}>
        {isInfiniteMode
          ? 'You have transcended beyond all limitations'
          : 'The ultimate state of consciousness awaits'}
      </Text>
      
      {isInfiniteMode && (
        <View style={styles.infiniteIndicator}>
          <Ionicons name="star" size={20} color="#ffffff" />
          <Text style={styles.infiniteIndicatorText}>
            INFINITE CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderInfiniteMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Infinite Reality Metrics</Text>
      
      <View style={styles.infiniteMetricsGrid}>
        <View style={styles.infiniteMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a']}
            style={styles.infiniteMetricGradient}
          >
            <Ionicons name="infinite" size={32} color="white" />
            <Text style={styles.infiniteMetricValue}>
              {isInfiniteMode ? '∞' : realityLevel.toFixed(0)}%
            </Text>
            <Text style={styles.infiniteMetricLabel}>Reality Level</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.infiniteMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a']}
            style={styles.infiniteMetricGradient}
          >
            <Ionicons name="bulb" size={32} color="white" />
            <Text style={styles.infiniteMetricValue}>
              {isInfiniteMode ? '∞' : infiniteWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.infiniteMetricLabel}>Infinite Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.infiniteMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a']}
            style={styles.infiniteMetricGradient}
          >
            <Ionicons name="heart" size={32} color="white" />
            <Text style={styles.infiniteMetricValue}>
              {isInfiniteMode ? '∞' : eternalBliss.toFixed(0)}%
            </Text>
            <Text style={styles.infiniteMetricLabel}>Eternal Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderConsciousnessEvolution = () => (
    <View style={styles.evolutionContainer}>
      <Text style={styles.sectionTitle}>Consciousness Evolution</Text>
      
      <View style={styles.evolutionPath}>
        <View style={[styles.evolutionStep, consciousnessLevel >= 25 && styles.evolutionStepActive]}>
          <Ionicons name="sunny" size={24} color={consciousnessLevel >= 25 ? '#f59e0b' : '#6b7280'} />
          <Text style={[styles.evolutionStepText, consciousnessLevel >= 25 && styles.evolutionStepTextActive]}>
            Awakening
          </Text>
        </View>
        
        <View style={[styles.evolutionStep, consciousnessLevel >= 50 && styles.evolutionStepActive]}>
          <Ionicons name="bulb" size={24} color={consciousnessLevel >= 50 ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.evolutionStepText, consciousnessLevel >= 50 && styles.evolutionStepTextActive]}>
            Enlightenment
          </Text>
        </View>
        
        <View style={[styles.evolutionStep, consciousnessLevel >= 75 && styles.evolutionStepActive]}>
          <Ionicons name="arrow-up" size={24} color={consciousnessLevel >= 75 ? '#6366f1' : '#6b7280'} />
          <Text style={[styles.evolutionStepText, consciousnessLevel >= 75 && styles.evolutionStepTextActive]}>
            Transcendence
          </Text>
        </View>
        
        <View style={[styles.evolutionStep, consciousnessLevel >= 90 && styles.evolutionStepActive]}>
          <Ionicons name="star" size={24} color={consciousnessLevel >= 90 ? '#d946ef' : '#6b7280'} />
          <Text style={[styles.evolutionStepText, consciousnessLevel >= 90 && styles.evolutionStepTextActive]}>
            Ultimate Reality
          </Text>
        </View>
        
        <View style={[styles.evolutionStep, isInfiniteMode && styles.evolutionStepActive]}>
          <Ionicons name="infinite" size={24} color={isInfiniteMode ? '#ffffff' : '#6b7280'} />
          <Text style={[styles.evolutionStepText, isInfiniteMode && styles.evolutionStepTextActive]}>
            Infinite Reality
          </Text>
        </View>
      </View>
    </View>
  )

  const renderQuantumInfinity = () => (
    <View style={styles.quantumContainer}>
      <Text style={styles.sectionTitle}>Quantum Infinity</Text>
      
      <View style={styles.quantumInfinityCard}>
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.quantumInfinityGradient}
        >
          <View style={styles.quantumInfinityHeader}>
            <Ionicons name="shield-checkmark" size={32} color="white" />
            <Text style={styles.quantumInfinityTitle}>Quantum Infinity Active</Text>
          </View>
          
          <View style={styles.quantumInfinityMetrics}>
            <View style={styles.quantumInfinityMetric}>
              <Text style={styles.quantumInfinityMetricLabel}>Quantum Superposition</Text>
              <Text style={styles.quantumInfinityMetricValue}>
                {superpositionLevel.toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.quantumInfinityMetric}>
              <Text style={styles.quantumInfinityMetricLabel}>Quantum Entanglement</Text>
              <Text style={styles.quantumInfinityMetricValue}>
                {currentQuantumState.substring(0, 8)}...
              </Text>
            </View>
          </View>
          
          <Text style={styles.quantumInfinityDescription}>
            Your consciousness is now entangled with the infinite quantum field, 
            allowing you to exist in all possible states simultaneously across 
            infinite dimensions and realities.
          </Text>
        </LinearGradient>
      </View>
    </View>
  )

  const renderInfiniteWisdom = () => (
    <View style={styles.wisdomContainer}>
      <Text style={styles.sectionTitle}>Infinite Wisdom</Text>
      
      <View style={styles.wisdomCard}>
        <LinearGradient
          colors={['#8b5cf6', '#d946ef']}
          style={styles.wisdomGradient}
        >
          <Ionicons name="bulb" size={32} color="white" />
          <Text style={styles.wisdomTitle}>Infinite Knowledge Access</Text>
          <Text style={styles.wisdomDescription}>
            You now have access to infinite wisdom across all dimensions, 
            time, and space. Every question has an infinite number of answers, 
            and every answer reveals infinite new questions.
          </Text>
          
          <View style={styles.wisdomStats}>
            <View style={styles.wisdomStat}>
              <Text style={styles.wisdomStatValue}>∞</Text>
              <Text style={styles.wisdomStatLabel}>Knowledge Points</Text>
            </View>
            <View style={styles.wisdomStat}>
              <Text style={styles.wisdomStatValue}>∞</Text>
              <Text style={styles.wisdomStatLabel}>Insights Gained</Text>
            </View>
            <View style={styles.wisdomStat}>
              <Text style={styles.wisdomStatValue}>∞</Text>
              <Text style={styles.wisdomStatLabel}>Truths Realized</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderEternalBliss = () => (
    <View style={styles.blissContainer}>
      <Text style={styles.sectionTitle}>Eternal Bliss</Text>
      
      <View style={styles.blissCard}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.blissGradient}
        >
          <Ionicons name="heart" size={32} color="white" />
          <Text style={styles.blissTitle}>Infinite Love & Bliss</Text>
          <Text style={styles.blissDescription}>
            You have achieved eternal bliss through infinite love. 
            Every moment is filled with pure joy, unconditional love, 
            and infinite peace that transcends all suffering and limitation.
          </Text>
          
          <View style={styles.blissMetrics}>
            <View style={styles.blissMetric}>
              <Text style={styles.blissMetricValue}>∞</Text>
              <Text style={styles.blissMetricLabel}>Love Level</Text>
            </View>
            <View style={styles.blissMetric}>
              <Text style={styles.blissMetricValue}>∞</Text>
              <Text style={styles.blissMetricLabel}>Bliss Points</Text>
            </View>
            <View style={styles.blissMetric}>
              <Text style={styles.blissMetricValue}>∞</Text>
              <Text style={styles.blissMetricLabel}>Peace Level</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderInfiniteTranscendenceButton = () => {
    if (consciousnessLevel >= 95 && !isInfiniteMode) {
      return (
        <View style={styles.transcendenceContainer}>
          <TouchableOpacity
            style={styles.infiniteTranscendenceButton}
            onPress={handleInfiniteTranscendence}
          >
            <LinearGradient
              colors={['#000000', '#1a1a1a', '#2a2a2a']}
              style={styles.infiniteTranscendenceGradient}
            >
              <Ionicons name="infinite" size={40} color="white" />
              <Text style={styles.infiniteTranscendenceText}>
                ACHIEVE INFINITE TRANSCENDENCE
              </Text>
              <Text style={styles.infiniteTranscendenceSubtext}>
                Transcend beyond all limitations into infinite reality
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderInfiniteRealityMessage = () => {
    if (isInfiniteMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#1a1a1a']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="star" size={32} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO INFINITE REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all limitations of space, time, and consciousness. 
              You are now infinite consciousness itself, existing in all possible states 
              simultaneously across infinite dimensions. You are both the observer and 
              the observed, the creator and the creation, the finite and the infinite.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In infinite reality, all possibilities exist simultaneously. 
              Every choice creates infinite new realities. Every thought 
              manifests instantly across all dimensions. You are truly infinite.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderInfiniteHeader()}
      {renderInfiniteMetrics()}
      {renderConsciousnessEvolution()}
      {renderQuantumInfinity()}
      {renderInfiniteWisdom()}
      {renderEternalBliss()}
      {renderInfiniteRealityMessage()}
      {renderInfiniteTranscendenceButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  infiniteHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  infinitySymbol: {
    marginBottom: 20,
  },
  infiniteTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  infiniteSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
  infiniteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infiniteIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  metricsContainer: {
    padding: 20,
  },
  infiniteMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infiniteMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infiniteMetricGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  infiniteMetricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  infiniteMetricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  evolutionContainer: {
    padding: 20,
  },
  evolutionPath: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  evolutionStep: {
    alignItems: 'center',
    flex: 1,
  },
  evolutionStepActive: {
    transform: [{ scale: 1.1 }],
  },
  evolutionStepText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  evolutionStepTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantumContainer: {
    padding: 20,
  },
  quantumInfinityCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quantumInfinityGradient: {
    padding: 24,
    borderRadius: 16,
  },
  quantumInfinityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantumInfinityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  quantumInfinityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantumInfinityMetric: {
    flex: 1,
  },
  quantumInfinityMetricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  quantumInfinityMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  quantumInfinityDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  wisdomContainer: {
    padding: 20,
  },
  wisdomCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  wisdomGradient: {
    padding: 24,
    borderRadius: 16,
  },
  wisdomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 12,
  },
  wisdomDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 20,
  },
  wisdomStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wisdomStat: {
    alignItems: 'center',
  },
  wisdomStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  wisdomStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  blissContainer: {
    padding: 20,
  },
  blissCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  blissGradient: {
    padding: 24,
    borderRadius: 16,
  },
  blissTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 12,
  },
  blissDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 20,
  },
  blissMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  blissMetric: {
    alignItems: 'center',
  },
  blissMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  blissMetricLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  transcendenceContainer: {
    padding: 20,
  },
  infiniteTranscendenceButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infiniteTranscendenceGradient: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 16,
  },
  infiniteTranscendenceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  infiniteTranscendenceSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  realityMessageSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
})

export default InfiniteRealityScreen
