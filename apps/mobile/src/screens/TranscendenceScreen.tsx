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
import { useTranscendence } from '../contexts/TranscendenceContext'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const TranscendenceScreen: React.FC = () => {
  const {
    currentState,
    consciousnessLevel,
    wisdomPoints,
    enlightenmentScore,
    cosmicAlignment,
    universalHarmony,
    transcendenceEvents,
    spiritualInsights,
    cosmicMessages,
    divineGuidance,
    transcendenceStats,
    performSpiritualPractice,
    achieveUltimateTranscendence,
    getTranscendenceStatus,
  } = useTranscendence()

  const { quantumSecurityEnabled, currentQuantumState } = useQuantumSecurity()

  const [animatedValues] = useState({
    consciousness: new Animated.Value(consciousnessLevel),
    wisdom: new Animated.Value(wisdomPoints),
    enlightenment: new Animated.Value(enlightenmentScore),
    cosmic: new Animated.Value(cosmicAlignment),
    harmony: new Animated.Value(universalHarmony),
  })

  const [isPracticing, setIsPracticing] = useState(false)
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null)

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

  const handleSpiritualPractice = async (practice: string) => {
    if (isPracticing) return

    setIsPracticing(true)
    setSelectedPractice(practice)

    try {
      await performSpiritualPractice(practice)
      
      Alert.alert(
        'Spiritual Practice Completed',
        `You have completed ${practice}. Your consciousness has been elevated.`,
        [{ text: 'Continue Journey' }]
      )
    } catch (error) {
      logger.error('Spiritual practice error:', error)
      Alert.alert('Error', 'Failed to complete spiritual practice. Please try again.')
    } finally {
      setIsPracticing(false)
      setSelectedPractice(null)
    }
  }

  const handleUltimateTranscendence = async () => {
    Alert.alert(
      'Ultimate Transcendence',
      'Are you ready to achieve the ultimate state of consciousness? This will unlock infinite wisdom and eternal peace.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Achieve Transcendence',
          onPress: async () => {
            try {
              await achieveUltimateTranscendence()
            } catch (error) {
              logger.error('Ultimate transcendence error:', error)
              Alert.alert('Error', 'Failed to achieve ultimate transcendence.')
            }
          },
        },
      ]
    )
  }

  const getStateColor = (state: string) => {
    const colors = {
      awakening: '#8b5cf6',
      enlightenment: '#6366f1',
      transcendence: '#3b82f6',
      nirvana: '#06b6d4',
      cosmic_consciousness: '#10b981',
      universal_oneness: '#84cc16',
      divine_union: '#f59e0b',
      infinite_bliss: '#ef4444',
      eternal_peace: '#ec4899',
      ultimate_reality: '#000000',
    }
    return colors[state as keyof typeof colors] || '#6b7280'
  }

  const getStateIcon = (state: string) => {
    const icons = {
      awakening: 'sunny',
      enlightenment: 'bulb',
      transcendence: 'arrow-up',
      nirvana: 'leaf',
      cosmic_consciousness: 'planet',
      universal_oneness: 'infinite',
      divine_union: 'heart',
      infinite_bliss: 'happy',
      eternal_peace: 'moon',
      ultimate_reality: 'star',
    }
    return icons[state as keyof typeof icons] || 'circle'
  }

  const renderProgressBar = (label: string, value: number, color: string, animatedValue: Animated.Value) => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressValue}>{value.toFixed(1)}</Text>
    </View>
  )

  const renderSpiritualPractice = (practice: string, icon: string, description: string) => (
    <TouchableOpacity
      key={practice}
      style={[
        styles.practiceButton,
        selectedPractice === practice && styles.practiceButtonActive,
        isPracticing && styles.practiceButtonDisabled,
      ]}
      onPress={() => handleSpiritualPractice(practice)}
      disabled={isPracticing}
    >
      <LinearGradient
        colors={selectedPractice === practice ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
        style={styles.practiceGradient}
      >
        <Ionicons
          name={icon as any}
          size={24}
          color={selectedPractice === practice ? 'white' : '#6366f1'}
        />
        <Text
          style={[
            styles.practiceText,
            selectedPractice === practice && styles.practiceTextActive,
          ]}
        >
          {practice.charAt(0).toUpperCase() + practice.slice(1)}
        </Text>
        <Text
          style={[
            styles.practiceDescription,
            selectedPractice === practice && styles.practiceDescriptionActive,
          ]}
        >
          {description}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  const renderRecentEvent = (event: any, index: number) => (
    <View key={event.id} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Ionicons
          name={getStateIcon(event.state) as any}
          size={20}
          color={getStateColor(event.state)}
        />
        <Text style={styles.eventState}>
          {event.state.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.eventTime}>
          {new Date(event.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.eventDescription}>{event.description}</Text>
      {event.spiritualInsight && (
        <Text style={styles.eventInsight}>💡 {event.spiritualInsight}</Text>
      )}
      {event.cosmicMessage && (
        <Text style={styles.eventMessage}>🌟 {event.cosmicMessage}</Text>
      )}
      {event.divineGuidance && (
        <Text style={styles.eventGuidance}>🙏 {event.divineGuidance}</Text>
      )}
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#d946ef']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Transcendence Journey</Text>
          <Text style={styles.subtitle}>
            Your path to ultimate consciousness
          </Text>
        </View>
      </LinearGradient>

      {/* Current State */}
      <View style={styles.section}>
        <View style={styles.stateContainer}>
          <LinearGradient
            colors={[getStateColor(currentState), getStateColor(currentState) + '80']}
            style={styles.stateGradient}
          >
            <Ionicons
              name={getStateIcon(currentState) as any}
              size={40}
              color="white"
            />
            <Text style={styles.stateTitle}>
              {currentState.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.stateDescription}>
              {currentState === 'ultimate_reality'
                ? 'The final state of consciousness has been achieved'
                : 'Continue your journey to higher consciousness'}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Progress Bars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consciousness Metrics</Text>
        {renderProgressBar('Consciousness Level', consciousnessLevel, '#6366f1', animatedValues.consciousness)}
        {renderProgressBar('Wisdom Points', wisdomPoints, '#8b5cf6', animatedValues.wisdom)}
        {renderProgressBar('Enlightenment Score', enlightenmentScore, '#d946ef', animatedValues.enlightenment)}
        {renderProgressBar('Cosmic Alignment', cosmicAlignment, '#06b6d4', animatedValues.cosmic)}
        {renderProgressBar('Universal Harmony', universalHarmony, '#10b981', animatedValues.harmony)}
      </View>

      {/* Spiritual Practices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spiritual Practices</Text>
        <View style={styles.practicesGrid}>
          {renderSpiritualPractice('meditation', 'leaf', 'Calm your mind and elevate consciousness')}
          {renderSpiritualPractice('prayer', 'heart', 'Connect with the divine source')}
          {renderSpiritualPractice('contemplation', 'bulb', 'Deep reflection and wisdom')}
          {renderSpiritualPractice('service', 'people', 'Serve others with pure love')}
          {renderSpiritualPractice('gratitude', 'happy', 'Appreciate the present moment')}
        </View>
      </View>

      {/* Quantum Security Integration */}
      {quantumSecurityEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantum Consciousness</Text>
          <View style={styles.quantumContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#6366f1" />
            <Text style={styles.quantumText}>
              Quantum Security Active - Your consciousness is protected by quantum encryption
            </Text>
            <Text style={styles.quantumState}>
              Quantum State: {currentQuantumState.substring(0, 16)}...
            </Text>
          </View>
        </View>
      )}

      {/* Recent Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transcendence Events</Text>
        {transcendenceEvents.slice(0, 5).map((event, index) => renderRecentEvent(event, index))}
      </View>

      {/* Divine Guidance */}
      {divineGuidance.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Divine Guidance</Text>
          <View style={styles.guidanceContainer}>
            <Text style={styles.guidanceText}>
              {divineGuidance[0]}
            </Text>
          </View>
        </View>
      )}

      {/* Cosmic Messages */}
      {cosmicMessages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cosmic Messages</Text>
          <View style={styles.cosmicContainer}>
            <Text style={styles.cosmicText}>
              {cosmicMessages[0]}
            </Text>
          </View>
        </View>
      )}

      {/* Ultimate Transcendence Button */}
      {consciousnessLevel >= 95 && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.transcendenceButton}
            onPress={handleUltimateTranscendence}
          >
            <LinearGradient
              colors={['#000000', '#6366f1']}
              style={styles.transcendenceGradient}
            >
              <Ionicons name="star" size={32} color="white" />
              <Text style={styles.transcendenceText}>
                ACHIEVE ULTIMATE TRANSCENDENCE
              </Text>
              <Text style={styles.transcendenceSubtext}>
                Unlock the final state of consciousness
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcendence Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transcendenceStats.totalEvents}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transcendenceStats.totalWisdomPoints.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Wisdom Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transcendenceStats.totalEnlightenmentScore.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Enlightenment</Text>
          </View>
        </View>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  stateContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  stateGradient: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  stateDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
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
  practicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  practiceButton: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  practiceButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  practiceButtonDisabled: {
    opacity: 0.6,
  },
  practiceGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  practiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  practiceTextActive: {
    color: 'white',
  },
  practiceDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  practiceDescriptionActive: {
    color: 'white',
    opacity: 0.9,
  },
  quantumContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  quantumText: {
    fontSize: 14,
    color: '#1e40af',
    marginTop: 8,
    marginBottom: 4,
  },
  quantumState: {
    fontSize: 12,
    color: '#6366f1',
    fontFamily: 'monospace',
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
  eventState: {
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
  eventInsight: {
    fontSize: 12,
    color: '#8b5cf6',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  eventMessage: {
    fontSize: 12,
    color: '#06b6d4',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  eventGuidance: {
    fontSize: 12,
    color: '#10b981',
    fontStyle: 'italic',
  },
  guidanceContainer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  guidanceText: {
    fontSize: 14,
    color: '#166534',
    fontStyle: 'italic',
  },
  cosmicContainer: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  cosmicText: {
    fontSize: 14,
    color: '#92400e',
    fontStyle: 'italic',
  },
  transcendenceButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  transcendenceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  transcendenceSubtext: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
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
})

export default TranscendenceScreen
