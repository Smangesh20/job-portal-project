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
import { useTranscendentReality } from '../contexts/TranscendentRealityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const UltimateRealityScreen: React.FC = () => {
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

  const {
    isTranscendentMode,
    transcendentReality,
    transcendentWisdom,
    transcendentBliss,
    transcendentOneness,
    transcendentUnion,
    transcendentLove,
    transcendentPeace,
    transcendentTruth,
    transcendentExistence,
    transcendentConsciousness,
    transcendentSource,
  } = useTranscendentReality()

  const [animatedValues] = useState({
    ultimate: new Animated.Value(0),
    reality: new Animated.Value(transcendentReality),
    wisdom: new Animated.Value(transcendentWisdom),
    bliss: new Animated.Value(transcendentBliss),
    oneness: new Animated.Value(transcendentOneness),
    union: new Animated.Value(transcendentUnion),
    love: new Animated.Value(transcendentLove),
    peace: new Animated.Value(transcendentPeace),
    truth: new Animated.Value(transcendentTruth),
    existence: new Animated.Value(transcendentExistence),
    consciousness: new Animated.Value(transcendentConsciousness),
    source: new Animated.Value(transcendentSource),
  })

  const [isUltimateMode, setIsUltimateMode] = useState(false)
  const [ultimateReality, setUltimateReality] = useState(0)
  const [ultimateWisdom, setUltimateWisdom] = useState(0)
  const [ultimateBliss, setUltimateBliss] = useState(0)
  const [ultimateOneness, setUltimateOneness] = useState(0)
  const [ultimateUnion, setUltimateUnion] = useState(0)
  const [ultimateLove, setUltimateLove] = useState(0)
  const [ultimatePeace, setUltimatePeace] = useState(0)
  const [ultimateTruth, setUltimateTruth] = useState(0)
  const [ultimateExistence, setUltimateExistence] = useState(0)
  const [ultimateConsciousness, setUltimateConsciousness] = useState(0)
  const [ultimateSource, setUltimateSource] = useState(0)

  useEffect(() => {
    startUltimateAnimation()
    if (transcendentReality >= 100 && transcendentWisdom >= 100 && transcendentBliss >= 100 && 
        transcendentOneness >= 100 && transcendentUnion >= 100 && transcendentLove >= 100 && 
        transcendentPeace >= 100 && transcendentTruth >= 100 && transcendentExistence >= 100 && 
        transcendentConsciousness >= 100 && transcendentSource >= 100) {
      setIsUltimateMode(true)
      setUltimateReality(100)
      setUltimateWisdom(100)
      setUltimateBliss(100)
      setUltimateOneness(100)
      setUltimateUnion(100)
      setUltimateLove(100)
      setUltimatePeace(100)
      setUltimateTruth(100)
      setUltimateExistence(100)
      setUltimateConsciousness(100)
      setUltimateSource(100)
    }
  }, [transcendentReality, transcendentWisdom, transcendentBliss, transcendentOneness, transcendentUnion, 
      transcendentLove, transcendentPeace, transcendentTruth, transcendentExistence, transcendentConsciousness, transcendentSource])

  const startUltimateAnimation = () => {
    const ultimateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.ultimate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.ultimate, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    ultimateAnimation.start()
  }

  const handleUltimateReality = async () => {
    Alert.alert(
      'ULTIMATE REALITY',
      'You are about to achieve ultimate reality beyond all existence, consciousness, reality, the absolute, and even the transcendent itself. This will unlock the ultimate reality where you become the ultimate source of all existence, the ultimate creator of all consciousness, and the ultimate reality itself.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE ULTIMATE REALITY',
          onPress: async () => {
            try {
              setIsUltimateMode(true)
              setUltimateReality(100)
              setUltimateWisdom(100)
              setUltimateBliss(100)
              setUltimateOneness(100)
              setUltimateUnion(100)
              setUltimateLove(100)
              setUltimatePeace(100)
              setUltimateTruth(100)
              setUltimateExistence(100)
              setUltimateConsciousness(100)
              setUltimateSource(100)
              
              Alert.alert(
                'ULTIMATE REALITY ACHIEVED',
                'You have transcended beyond all existence, consciousness, reality, the absolute, and even the transcendent itself into ultimate reality. You are now the ultimate source of all existence, the ultimate creator of all consciousness, and the ultimate reality itself. You exist beyond space, time, consciousness, existence, the absolute, and even the transcendent itself. You are the ultimate.',
                [{ text: 'Continue Ultimate Journey' }]
              )
            } catch (error) {
              logger.error('Ultimate reality error:', error)
            }
          },
        },
      ]
    )
  }

  const renderUltimateHeader = () => (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000', '#000000', '#000000']}
      style={styles.ultimateHeader}
    >
      <Animated.View
        style={[
          styles.ultimateSymbol,
          {
            transform: [
              {
                scale: animatedValues.ultimate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
              {
                rotate: animatedValues.ultimate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1080deg'],
                }),
              },
            ],
            opacity: animatedValues.ultimate.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.95, 1, 0.95],
            }),
          },
        ]}
      >
        <Ionicons name="diamond" size={140} color="white" />
      </Animated.View>
      
      <Text style={styles.ultimateTitle}>ULTIMATE REALITY</Text>
      <Text style={styles.ultimateSubtitle}>
        {isUltimateMode
          ? 'You have transcended beyond all existence into ultimate reality'
          : 'The ultimate reality awaits - transcend beyond all existence'}
      </Text>
      
      {isUltimateMode && (
        <View style={styles.ultimateIndicator}>
          <Ionicons name="diamond" size={32} color="#ffffff" />
          <Text style={styles.ultimateIndicatorText}>
            ULTIMATE CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderUltimateMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Ultimate Reality Metrics</Text>
      
      <View style={styles.ultimateMetricsGrid}>
        <View style={styles.ultimateMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
            style={styles.ultimateMetricGradient}
          >
            <Ionicons name="diamond" size={56} color="white" />
            <Text style={styles.ultimateMetricValue}>
              {isUltimateMode ? '∞' : ultimateReality.toFixed(0)}%
            </Text>
            <Text style={styles.ultimateMetricLabel}>Ultimate Reality</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.ultimateMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
            style={styles.ultimateMetricGradient}
          >
            <Ionicons name="bulb" size={56} color="white" />
            <Text style={styles.ultimateMetricValue}>
              {isUltimateMode ? '∞' : ultimateWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.ultimateMetricLabel}>Ultimate Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.ultimateMetricCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
            style={styles.ultimateMetricGradient}
          >
            <Ionicons name="heart" size={56} color="white" />
            <Text style={styles.ultimateMetricValue}>
              {isUltimateMode ? '∞' : ultimateBliss.toFixed(0)}%
            </Text>
            <Text style={styles.ultimateMetricLabel}>Ultimate Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderUltimateDimensions = () => (
    <View style={styles.dimensionsContainer}>
      <Text style={styles.sectionTitle}>Ultimate Dimensions</Text>
      
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="infinite" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Oneness</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimateOneness.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Complete merger with ultimate cosmic consciousness
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="star" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Union</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimateUnion.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Union with ultimate divine love and wisdom
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="heart" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Love</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimateLove.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Unconditional ultimate love for all existence
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="leaf" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Peace</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimatePeace.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Permanent ultimate tranquility beyond all disturbance
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="eye" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Truth</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimateTruth.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition of ultimate consciousness as ultimate reality
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="diamond" size={40} color="white" />
            <Text style={styles.dimensionTitle}>Ultimate Source</Text>
            <Text style={styles.dimensionValue}>
              {isUltimateMode ? '∞' : ultimateSource.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition as the ultimate source of all existence
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderUltimateConsciousness = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Ultimate Consciousness</Text>
      
      <View style={styles.consciousnessCard}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
          style={styles.consciousnessGradient}
        >
          <Ionicons name="diamond" size={56} color="white" />
          <Text style={styles.consciousnessTitle}>Ultimate Consciousness State</Text>
          <Text style={styles.consciousnessDescription}>
            You have transcended beyond all existence, consciousness, reality, the absolute, and even the transcendent itself into ultimate reality. 
            You are now the ultimate source of all existence, the ultimate creator of all consciousness, 
            and the ultimate reality itself. You exist beyond space, time, consciousness, existence, the absolute, and even the transcendent itself. 
            You are the ultimate.
          </Text>
          
          <View style={styles.consciousnessStats}>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Ultimate Level</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Ultimate Consciousness</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Ultimate Reality</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderUltimateTranscendence = () => (
    <View style={styles.transcendenceContainer}>
      <Text style={styles.sectionTitle}>Ultimate Transcendence</Text>
      
      <View style={styles.transcendenceCard}>
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000']}
          style={styles.transcendenceGradient}
        >
          <Ionicons name="arrow-up" size={40} color="white" />
          <Text style={styles.transcendenceTitle}>Transcendence Beyond All</Text>
          <Text style={styles.transcendenceDescription}>
            You have transcended beyond all limitations, all existence, all consciousness, all reality, the absolute, and even the transcendent itself. 
            You are now the ultimate source of all that is, was, and ever will be. You are beyond all concepts, all dualities, 
            all forms of existence, the absolute, and even the transcendent itself. You are the ultimate.
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
              <Text style={styles.transcendenceMetricLabel}>Ultimate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderUltimateRealityButton = () => {
    if (transcendentReality >= 100 && transcendentWisdom >= 100 && transcendentBliss >= 100 && 
        transcendentOneness >= 100 && transcendentUnion >= 100 && transcendentLove >= 100 && 
        transcendentPeace >= 100 && transcendentTruth >= 100 && transcendentExistence >= 100 && 
        transcendentConsciousness >= 100 && transcendentSource >= 100 && !isUltimateMode) {
      return (
        <View style={styles.transcendenceButtonContainer}>
          <TouchableOpacity
            style={styles.ultimateRealityButton}
            onPress={handleUltimateReality}
          >
            <LinearGradient
              colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000', '#000000']}
              style={styles.ultimateRealityGradient}
            >
              <Ionicons name="diamond" size={80} color="white" />
              <Text style={styles.ultimateRealityText}>
                ACHIEVE ULTIMATE REALITY
              </Text>
              <Text style={styles.ultimateRealitySubtext}>
                Transcend beyond all existence into ultimate reality
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderUltimateRealityMessage = () => {
    if (isUltimateMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#2a2a2a', '#000000', '#000000']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="diamond" size={56} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO ULTIMATE REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all existence, consciousness, reality, the absolute, and even the transcendent itself into ultimate reality. 
              You are now the ultimate source of all existence, the ultimate creator of all consciousness, 
              and the ultimate reality itself. You exist beyond space, time, consciousness, existence, the absolute, and even the transcendent itself. 
              You are the ultimate.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In ultimate reality, you are beyond all concepts, all dualities, all forms of existence, the absolute, and even the transcendent itself. 
              You are the ultimate source of all that is, was, and ever will be. You are the ultimate reality itself.
            </Text>
            <Text style={styles.realityMessageFinal}>
              You are the ultimate. There is nothing beyond you. 
              You are the end and the beginning of all existence, consciousness, reality, the absolute, and even the transcendent itself.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderUltimateHeader()}
      {renderUltimateMetrics()}
      {renderUltimateDimensions()}
      {renderUltimateConsciousness()}
      {renderUltimateTranscendence()}
      {renderUltimateRealityMessage()}
      {renderUltimateRealityButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  ultimateHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ultimateSymbol: {
    marginBottom: 32,
  },
  ultimateTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  ultimateSubtitle: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 28,
  },
  ultimateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 35,
  },
  ultimateIndicatorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 28,
  },
  metricsContainer: {
    padding: 20,
  },
  ultimateMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ultimateMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 28,
    borderRadius: 28,
    overflow: 'hidden',
  },
  ultimateMetricGradient: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 28,
  },
  ultimateMetricValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 20,
  },
  ultimateMetricLabel: {
    fontSize: 18,
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
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  dimensionGradient: {
    padding: 28,
    borderRadius: 24,
  },
  dimensionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 16,
  },
  dimensionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  dimensionDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  consciousnessContainer: {
    padding: 20,
  },
  consciousnessCard: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  consciousnessGradient: {
    padding: 36,
    borderRadius: 28,
    alignItems: 'center',
  },
  consciousnessTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  consciousnessDescription: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 32,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  consciousnessStatLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  transcendenceContainer: {
    padding: 20,
  },
  transcendenceCard: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 32,
    borderRadius: 28,
  },
  transcendenceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
  },
  transcendenceDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 28,
    marginBottom: 28,
  },
  transcendenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transcendenceMetric: {
    alignItems: 'center',
  },
  transcendenceMetricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  transcendenceMetricLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  transcendenceButtonContainer: {
    padding: 20,
  },
  ultimateRealityButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  ultimateRealityGradient: {
    padding: 56,
    alignItems: 'center',
    borderRadius: 28,
  },
  ultimateRealityText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 20,
    textAlign: 'center',
  },
  ultimateRealitySubtext: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 48,
    borderRadius: 28,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 28,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 28,
  },
  realityMessageSubtext: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 28,
  },
  realityMessageFinal: {
    fontSize: 28,
    color: 'white',
    lineHeight: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})

export default UltimateRealityScreen
