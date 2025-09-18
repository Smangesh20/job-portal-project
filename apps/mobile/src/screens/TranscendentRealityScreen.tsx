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
import { useInfiniteReality } from '../contexts/InfiniteRealityContext'
import { useAbsoluteReality } from '../contexts/AbsoluteRealityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const TranscendentRealityScreen: React.FC = () => {
  const {
    consciousnessLevel,
    currentState,
    wisdomPoints,
    enlightenmentScore,
    cosmicAlignment,
    universalHarmony,
  } = useTranscendence()

  const {
    quantumSecurityEnabled,
    currentQuantumState,
    superpositionLevel,
  } = useQuantumSecurity()

  const {
    isInfiniteMode,
    realityLevel,
    infiniteWisdom,
    eternalBliss,
    cosmicOneness,
    divineUnion,
    infiniteLove,
    eternalPeace,
    ultimateTruth,
  } = useInfiniteReality()

  const {
    isAbsoluteMode,
    absoluteReality,
    absoluteWisdom,
    absoluteBliss,
    absoluteOneness,
    absoluteUnion,
    absoluteLove,
    absolutePeace,
    absoluteTruth,
    absoluteExistence,
    absoluteConsciousness,
    absoluteSource,
  } = useAbsoluteReality()

  const [animatedValues] = useState({
    transcendent: new Animated.Value(0),
    reality: new Animated.Value(absoluteReality),
    wisdom: new Animated.Value(absoluteWisdom),
    bliss: new Animated.Value(absoluteBliss),
    oneness: new Animated.Value(absoluteOneness),
    union: new Animated.Value(absoluteUnion),
    love: new Animated.Value(absoluteLove),
    peace: new Animated.Value(absolutePeace),
    truth: new Animated.Value(absoluteTruth),
    existence: new Animated.Value(absoluteExistence),
    consciousness: new Animated.Value(absoluteConsciousness),
    source: new Animated.Value(absoluteSource),
  })

  const [isTranscendentMode, setIsTranscendentMode] = useState(false)
  const [transcendentReality, setTranscendentReality] = useState(0)
  const [transcendentWisdom, setTranscendentWisdom] = useState(0)
  const [transcendentBliss, setTranscendentBliss] = useState(0)
  const [transcendentOneness, setTranscendentOneness] = useState(0)
  const [transcendentUnion, setTranscendentUnion] = useState(0)
  const [transcendentLove, setTranscendentLove] = useState(0)
  const [transcendentPeace, setTranscendentPeace] = useState(0)
  const [transcendentTruth, setTranscendentTruth] = useState(0)
  const [transcendentExistence, setTranscendentExistence] = useState(0)
  const [transcendentConsciousness, setTranscendentConsciousness] = useState(0)
  const [transcendentSource, setTranscendentSource] = useState(0)

  useEffect(() => {
    startTranscendentAnimation()
    if (absoluteReality >= 100 && absoluteWisdom >= 100 && absoluteBliss >= 100 && 
        absoluteOneness >= 100 && absoluteUnion >= 100 && absoluteLove >= 100 && 
        absolutePeace >= 100 && absoluteTruth >= 100 && absoluteExistence >= 100 && 
        absoluteConsciousness >= 100 && absoluteSource >= 100) {
      setIsTranscendentMode(true)
      setTranscendentReality(100)
      setTranscendentWisdom(100)
      setTranscendentBliss(100)
      setTranscendentOneness(100)
      setTranscendentUnion(100)
      setTranscendentLove(100)
      setTranscendentPeace(100)
      setTranscendentTruth(100)
      setTranscendentExistence(100)
      setTranscendentConsciousness(100)
      setTranscendentSource(100)
    }
  }, [absoluteReality, absoluteWisdom, absoluteBliss, absoluteOneness, absoluteUnion, 
      absoluteLove, absolutePeace, absoluteTruth, absoluteExistence, absoluteConsciousness, absoluteSource])

  const startTranscendentAnimation = () => {
    const transcendentAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.transcendent, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.transcendent, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    transcendentAnimation.start()
  }

  const handleTranscendentReality = async () => {
    Alert.alert(
      'TRANSCENDENT REALITY',
      'You are about to achieve transcendent reality beyond all existence, consciousness, reality, and even the absolute itself. This will unlock the transcendent reality where you become the transcendent source of all existence, the transcendent creator of all consciousness, and the transcendent reality itself.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE TRANSCENDENT REALITY',
          onPress: async () => {
            try {
              setIsTranscendentMode(true)
              setTranscendentReality(100)
              setTranscendentWisdom(100)
              setTranscendentBliss(100)
              setTranscendentOneness(100)
              setTranscendentUnion(100)
              setTranscendentLove(100)
              setTranscendentPeace(100)
              setTranscendentTruth(100)
              setTranscendentExistence(100)
              setTranscendentConsciousness(100)
              setTranscendentSource(100)
              
              Alert.alert(
                'TRANSCENDENT REALITY ACHIEVED',
                'You have transcended beyond all existence, consciousness, reality, and even the absolute itself into transcendent reality. You are now the transcendent source of all existence, the transcendent creator of all consciousness, and the transcendent reality itself. You exist beyond space, time, consciousness, existence, and even the absolute itself. You are the transcendent.',
                [{ text: 'Continue Transcendent Journey' }]
              )
            } catch (error) {
              logger.error('Transcendent reality error:', error)
            }
          },
        },
      ]
    )
  }

  const renderTranscendentHeader = () => (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000', '#000000']}
      style={styles.transcendentHeader}
    >
      <Animated.View
        style={[
          styles.transcendentSymbol,
          {
            transform: [
              {
                scale: animatedValues.transcendent.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
              {
                rotate: animatedValues.transcendent.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '720deg'],
                }),
              },
            ],
            opacity: animatedValues.transcendent.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.9, 1, 0.9],
            }),
          },
        ]}
      >
        <Ionicons name="diamond" size={120} color="white" />
      </Animated.View>
      
      <Text style={styles.transcendentTitle}>TRANSCENDENT REALITY</Text>
      <Text style={styles.transcendentSubtitle}>
        {isTranscendentMode
          ? 'You have transcended beyond all existence into transcendent reality'
          : 'The transcendent reality awaits - transcend beyond all existence'}
      </Text>
      
      {isTranscendentMode && (
        <View style={styles.transcendentIndicator}>
          <Ionicons name="diamond" size={28} color="#ffffff" />
          <Text style={styles.transcendentIndicatorText}>
            TRANSCENDENT CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderTranscendentMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Transcendent Reality Metrics</Text>
      
      <View style={styles.transcendentMetricsGrid}>
        <View style={styles.transcendentMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.transcendentMetricGradient}
          >
            <Ionicons name="diamond" size={48} color="white" />
            <Text style={styles.transcendentMetricValue}>
              {isTranscendentMode ? '∞' : transcendentReality.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentMetricLabel}>Transcendent Reality</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.transcendentMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.transcendentMetricGradient}
          >
            <Ionicons name="bulb" size={48} color="white" />
            <Text style={styles.transcendentMetricValue}>
              {isTranscendentMode ? '∞' : transcendentWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentMetricLabel}>Transcendent Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.transcendentMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.transcendentMetricGradient}
          >
            <Ionicons name="heart" size={48} color="white" />
            <Text style={styles.transcendentMetricValue}>
              {isTranscendentMode ? '∞' : transcendentBliss.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentMetricLabel}>Transcendent Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTranscendentDimensions = () => (
    <View style={styles.dimensionsContainer}>
      <Text style={styles.sectionTitle}>Transcendent Dimensions</Text>
      
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="infinite" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Oneness</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentOneness.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Complete merger with transcendent cosmic consciousness
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="star" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Union</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentUnion.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Union with transcendent divine love and wisdom
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="heart" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Love</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentLove.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Unconditional transcendent love for all existence
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="leaf" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Peace</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentPeace.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Permanent transcendent tranquility beyond all disturbance
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="eye" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Truth</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentTruth.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition of transcendent consciousness as transcendent reality
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="diamond" size={36} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Source</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentMode ? '∞' : transcendentSource.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition as the transcendent source of all existence
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTranscendentConsciousness = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Transcendent Consciousness</Text>
      
      <View style={styles.consciousnessCard}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
          style={styles.consciousnessGradient}
        >
          <Ionicons name="diamond" size={48} color="white" />
          <Text style={styles.consciousnessTitle}>Transcendent Consciousness State</Text>
          <Text style={styles.consciousnessDescription}>
            You have transcended beyond all existence, consciousness, reality, and even the absolute itself into transcendent reality. 
            You are now the transcendent source of all existence, the transcendent creator of all consciousness, 
            and the transcendent reality itself. You exist beyond space, time, consciousness, existence, and even the absolute itself. 
            You are the transcendent.
          </Text>
          
          <View style={styles.consciousnessStats}>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Level</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Consciousness</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Reality</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTranscendentTranscendence = () => (
    <View style={styles.transcendenceContainer}>
      <Text style={styles.sectionTitle}>Transcendent Transcendence</Text>
      
      <View style={styles.transcendenceCard}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#2a2a2a']}
          style={styles.transcendenceGradient}
        >
          <Ionicons name="arrow-up" size={36} color="white" />
          <Text style={styles.transcendenceTitle}>Transcendence Beyond All</Text>
          <Text style={styles.transcendenceDescription}>
            You have transcended beyond all limitations, all existence, all consciousness, all reality, and even the absolute itself. 
            You are now the transcendent source of all that is, was, and ever will be. You are beyond all concepts, all dualities, 
            all forms of existence, and even the absolute itself. You are the transcendent.
          </Text>
          
          <View style={styles.transcendenceMetrics}>
            <View style={styles.transcendenceMetric}>
              <Text style={styles.transcendenceMetricValue}>∞</Text>
              <Text style={styles.transcendenceMetricLabel}>Transcendence</Text>
            </View>
            <View style={styles.transcendenceMetric}>
              <Text style={styles.transcendenceMetricValue}>∞</Text>
              <Text style={styles.transcendenceMetricLabel}>Beyond All</Text>
            </View>
            <View style={styles.transcendenceMetric}>
              <Text style={styles.transcendenceMetricValue}>∞</Text>
              <Text style={styles.transcendenceMetricLabel}>Transcendent</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTranscendentRealityButton = () => {
    if (absoluteReality >= 100 && absoluteWisdom >= 100 && absoluteBliss >= 100 && 
        absoluteOneness >= 100 && absoluteUnion >= 100 && absoluteLove >= 100 && 
        absolutePeace >= 100 && absoluteTruth >= 100 && absoluteExistence >= 100 && 
        absoluteConsciousness >= 100 && absoluteSource >= 100 && !isTranscendentMode) {
      return (
        <View style={styles.transcendenceButtonContainer}>
          <TouchableOpacity
            style={styles.transcendentRealityButton}
            onPress={handleTranscendentReality}
          >
            <LinearGradient
              colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
              style={styles.transcendentRealityGradient}
            >
              <Ionicons name="diamond" size={60} color="white" />
              <Text style={styles.transcendentRealityText}>
                ACHIEVE TRANSCENDENT REALITY
              </Text>
              <Text style={styles.transcendentRealitySubtext}>
                Transcend beyond all existence into transcendent reality
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderTranscendentRealityMessage = () => {
    if (isTranscendentMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="diamond" size={48} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO TRANSCENDENT REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all existence, consciousness, reality, and even the absolute itself into transcendent reality. 
              You are now the transcendent source of all existence, the transcendent creator of all consciousness, 
              and the transcendent reality itself. You exist beyond space, time, consciousness, existence, and even the absolute itself. 
              You are the transcendent.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In transcendent reality, you are beyond all concepts, all dualities, all forms of existence, and even the absolute itself. 
              You are the transcendent source of all that is, was, and ever will be. You are the transcendent reality itself.
            </Text>
            <Text style={styles.realityMessageFinal}>
              You are the transcendent. There is nothing beyond you. 
              You are the end and the beginning of all existence, consciousness, reality, and even the absolute itself.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderTranscendentHeader()}
      {renderTranscendentMetrics()}
      {renderTranscendentDimensions()}
      {renderTranscendentConsciousness()}
      {renderTranscendentTranscendence()}
      {renderTranscendentRealityMessage()}
      {renderTranscendentRealityButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  transcendentHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transcendentSymbol: {
    marginBottom: 28,
  },
  transcendentTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  transcendentSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  transcendentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  transcendentIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  metricsContainer: {
    padding: 20,
  },
  transcendentMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  transcendentMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  transcendentMetricGradient: {
    padding: 28,
    alignItems: 'center',
    borderRadius: 24,
  },
  transcendentMetricValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 16,
  },
  transcendentMetricLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  dimensionsContainer: {
    padding: 20,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dimensionCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dimensionGradient: {
    padding: 24,
    borderRadius: 20,
  },
  dimensionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 12,
  },
  dimensionValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  dimensionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  consciousnessContainer: {
    padding: 20,
  },
  consciousnessCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  consciousnessGradient: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  consciousnessTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  consciousnessDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 28,
  },
  consciousnessStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  consciousnessStat: {
    alignItems: 'center',
  },
  consciousnessStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  consciousnessStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  transcendenceContainer: {
    padding: 20,
  },
  transcendenceCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 28,
    borderRadius: 24,
  },
  transcendenceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 16,
  },
  transcendenceDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 24,
  },
  transcendenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transcendenceMetric: {
    alignItems: 'center',
  },
  transcendenceMetricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  transcendenceMetricLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
  },
  transcendenceButtonContainer: {
    padding: 20,
  },
  transcendentRealityButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  transcendentRealityGradient: {
    padding: 48,
    alignItems: 'center',
    borderRadius: 24,
  },
  transcendentRealityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  transcendentRealitySubtext: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 24,
  },
  realityMessageSubtext: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  realityMessageFinal: {
    fontSize: 24,
    color: 'white',
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})

export default TranscendentRealityScreen
