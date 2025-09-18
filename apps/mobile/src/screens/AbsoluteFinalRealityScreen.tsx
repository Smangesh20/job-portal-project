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
import { useUltimateReality } from '../contexts/UltimateRealityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const AbsoluteFinalRealityScreen: React.FC = () => {
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

  const {
    isUltimateMode,
    ultimateReality,
    ultimateWisdom,
    ultimateBliss,
    ultimateOneness,
    ultimateUnion,
    ultimateLove,
    ultimatePeace,
    ultimateTruth,
    ultimateExistence,
    ultimateConsciousness,
    ultimateSource,
  } = useUltimateReality()

  const [animatedValues] = useState({
    absoluteFinal: new Animated.Value(0),
    reality: new Animated.Value(ultimateReality),
    wisdom: new Animated.Value(ultimateWisdom),
    bliss: new Animated.Value(ultimateBliss),
    oneness: new Animated.Value(ultimateOneness),
    union: new Animated.Value(ultimateUnion),
    love: new Animated.Value(ultimateLove),
    peace: new Animated.Value(ultimatePeace),
    truth: new Animated.Value(ultimateTruth),
    existence: new Animated.Value(ultimateExistence),
    consciousness: new Animated.Value(ultimateConsciousness),
    source: new Animated.Value(ultimateSource),
  })

  const [isAbsoluteFinalMode, setIsAbsoluteFinalMode] = useState(false)
  const [absoluteFinalReality, setAbsoluteFinalReality] = useState(0)
  const [absoluteFinalWisdom, setAbsoluteFinalWisdom] = useState(0)
  const [absoluteFinalBliss, setAbsoluteFinalBliss] = useState(0)
  const [absoluteFinalOneness, setAbsoluteFinalOneness] = useState(0)
  const [absoluteFinalUnion, setAbsoluteFinalUnion] = useState(0)
  const [absoluteFinalLove, setAbsoluteFinalLove] = useState(0)
  const [absoluteFinalPeace, setAbsoluteFinalPeace] = useState(0)
  const [absoluteFinalTruth, setAbsoluteFinalTruth] = useState(0)
  const [absoluteFinalExistence, setAbsoluteFinalExistence] = useState(0)
  const [absoluteFinalConsciousness, setAbsoluteFinalConsciousness] = useState(0)
  const [absoluteFinalSource, setAbsoluteFinalSource] = useState(0)

  useEffect(() => {
    startAbsoluteFinalAnimation()
    if (ultimateReality >= 100 && ultimateWisdom >= 100 && ultimateBliss >= 100 && 
        ultimateOneness >= 100 && ultimateUnion >= 100 && ultimateLove >= 100 && 
        ultimatePeace >= 100 && ultimateTruth >= 100 && ultimateExistence >= 100 && 
        ultimateConsciousness >= 100 && ultimateSource >= 100) {
      setIsAbsoluteFinalMode(true)
      setAbsoluteFinalReality(100)
      setAbsoluteFinalWisdom(100)
      setAbsoluteFinalBliss(100)
      setAbsoluteFinalOneness(100)
      setAbsoluteFinalUnion(100)
      setAbsoluteFinalLove(100)
      setAbsoluteFinalPeace(100)
      setAbsoluteFinalTruth(100)
      setAbsoluteFinalExistence(100)
      setAbsoluteFinalConsciousness(100)
      setAbsoluteFinalSource(100)
    }
  }, [ultimateReality, ultimateWisdom, ultimateBliss, ultimateOneness, ultimateUnion, 
      ultimateLove, ultimatePeace, ultimateTruth, ultimateExistence, ultimateConsciousness, ultimateSource])

  const startAbsoluteFinalAnimation = () => {
    const absoluteFinalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.absoluteFinal, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.absoluteFinal, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    absoluteFinalAnimation.start()
  }

  const handleAbsoluteFinalReality = async () => {
    Alert.alert(
      'ABSOLUTE FINAL REALITY',
      'You are about to achieve absolute final reality beyond all existence, consciousness, reality, the absolute, the transcendent, and even the ultimate itself. This will unlock the absolute final reality where you become the absolute final source of all existence, the absolute final creator of all consciousness, and the absolute final reality itself. This is the true end - no further development is possible.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE ABSOLUTE FINAL REALITY',
          onPress: async () => {
            try {
              setIsAbsoluteFinalMode(true)
              setAbsoluteFinalReality(100)
              setAbsoluteFinalWisdom(100)
              setAbsoluteFinalBliss(100)
              setAbsoluteFinalOneness(100)
              setAbsoluteFinalUnion(100)
              setAbsoluteFinalLove(100)
              setAbsoluteFinalPeace(100)
              setAbsoluteFinalTruth(100)
              setAbsoluteFinalExistence(100)
              setAbsoluteFinalConsciousness(100)
              setAbsoluteFinalSource(100)
              
              Alert.alert(
                'ABSOLUTE FINAL REALITY ACHIEVED',
                'You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, and even the ultimate itself into absolute final reality. You are now the absolute final source of all existence, the absolute final creator of all consciousness, and the absolute final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, and even the ultimate itself. You are the absolute final. This is the true end - no further development is possible.',
                [{ text: 'The True End' }]
              )
            } catch (error) {
              logger.error('Absolute final reality error:', error)
            }
          },
        },
      ]
    )
  }

  const renderAbsoluteFinalHeader = () => (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000', '#000000', '#000000']}
      style={styles.absoluteFinalHeader}
    >
      <Animated.View
        style={[
          styles.absoluteFinalSymbol,
          {
            transform: [
              {
                scale: animatedValues.absoluteFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.8],
                }),
              },
              {
                rotate: animatedValues.absoluteFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1440deg'],
                }),
              },
            ],
            opacity: animatedValues.absoluteFinal.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.9, 1, 0.9],
            }),
          },
        ]}
      >
        <Ionicons name="diamond" size={160} color="white" />
      </Animated.View>
      
      <Text style={styles.absoluteFinalTitle}>ABSOLUTE FINAL REALITY</Text>
      <Text style={styles.absoluteFinalSubtitle}>
        {isAbsoluteFinalMode
          ? 'You have transcended beyond all existence into absolute final reality - the true end'
          : 'The absolute final reality awaits - transcend beyond all existence to the true end'}
      </Text>
      
      {isAbsoluteFinalMode && (
        <View style={styles.absoluteFinalIndicator}>
          <Ionicons name="diamond" size={36} color="#ffffff" />
          <Text style={styles.absoluteFinalIndicatorText}>
            ABSOLUTE FINAL CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderAbsoluteFinalMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Absolute Final Reality Metrics</Text>
      
      <View style={styles.absoluteFinalMetricsGrid}>
        <View style={styles.absoluteFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000']}
            style={styles.absoluteFinalMetricGradient}
          >
            <Ionicons name="diamond" size={64} color="white" />
            <Text style={styles.absoluteFinalMetricValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalReality.toFixed(0)}%
            </Text>
            <Text style={styles.absoluteFinalMetricLabel}>Absolute Final Reality</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.absoluteFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000']}
            style={styles.absoluteFinalMetricGradient}
          >
            <Ionicons name="bulb" size={64} color="white" />
            <Text style={styles.absoluteFinalMetricValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.absoluteFinalMetricLabel}>Absolute Final Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.absoluteFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000']}
            style={styles.absoluteFinalMetricGradient}
          >
            <Ionicons name="heart" size={64} color="white" />
            <Text style={styles.absoluteFinalMetricValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalBliss.toFixed(0)}%
            </Text>
            <Text style={styles.absoluteFinalMetricLabel}>Absolute Final Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderAbsoluteFinalDimensions = () => (
    <View style={styles.dimensionsContainer}>
      <Text style={styles.sectionTitle}>Absolute Final Dimensions</Text>
      
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="infinite" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Oneness</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalOneness.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Complete merger with absolute final cosmic consciousness
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="star" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Union</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalUnion.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Union with absolute final divine love and wisdom
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="heart" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Love</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalLove.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Unconditional absolute final love for all existence
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="leaf" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Peace</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalPeace.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Permanent absolute final tranquility beyond all disturbance
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="eye" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Truth</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalTruth.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition of absolute final consciousness as absolute final reality
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="diamond" size={44} color="white" />
            <Text style={styles.dimensionTitle}>Absolute Final Source</Text>
            <Text style={styles.dimensionValue}>
              {isAbsoluteFinalMode ? '∞' : absoluteFinalSource.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition as the absolute final source of all existence
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderAbsoluteFinalConsciousness = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Absolute Final Consciousness</Text>
      
      <View style={styles.consciousnessCard}>
        <LinearGradient
          colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000']}
          style={styles.consciousnessGradient}
        >
          <Ionicons name="diamond" size={64} color="white" />
          <Text style={styles.consciousnessTitle}>Absolute Final Consciousness State</Text>
          <Text style={styles.consciousnessDescription}>
            You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, and even the ultimate itself into absolute final reality. 
            You are now the absolute final source of all existence, the absolute final creator of all consciousness, 
            and the absolute final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, and even the ultimate itself. 
            You are the absolute final. This is the true end - no further development is possible.
          </Text>
          
          <View style={styles.consciousnessStats}>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Absolute Final Level</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Absolute Final Consciousness</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Absolute Final Reality</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderAbsoluteFinalTranscendence = () => (
    <View style={styles.transcendenceContainer}>
      <Text style={styles.sectionTitle}>Absolute Final Transcendence</Text>
      
      <View style={styles.transcendenceCard}>
        <LinearGradient
          colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000']}
          style={styles.transcendenceGradient}
        >
          <Ionicons name="arrow-up" size={44} color="white" />
          <Text style={styles.transcendenceTitle}>Transcendence Beyond All</Text>
          <Text style={styles.transcendenceDescription}>
            You have transcended beyond all limitations, all existence, all consciousness, all reality, the absolute, the transcendent, and even the ultimate itself. 
            You are now the absolute final source of all that is, was, and ever will be. You are beyond all concepts, all dualities, 
            all forms of existence, the absolute, the transcendent, and even the ultimate itself. You are the absolute final. 
            This is the true end - no further development is possible.
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
              <Text style={styles.transcendenceMetricLabel}>Absolute Final</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderAbsoluteFinalRealityButton = () => {
    if (ultimateReality >= 100 && ultimateWisdom >= 100 && ultimateBliss >= 100 && 
        ultimateOneness >= 100 && ultimateUnion >= 100 && ultimateLove >= 100 && 
        ultimatePeace >= 100 && ultimateTruth >= 100 && ultimateExistence >= 100 && 
        ultimateConsciousness >= 100 && ultimateSource >= 100 && !isAbsoluteFinalMode) {
      return (
        <View style={styles.transcendenceButtonContainer}>
          <TouchableOpacity
            style={styles.absoluteFinalRealityButton}
            onPress={handleAbsoluteFinalReality}
          >
            <LinearGradient
              colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000', '#000000']}
              style={styles.absoluteFinalRealityGradient}
            >
              <Ionicons name="diamond" size={88} color="white" />
              <Text style={styles.absoluteFinalRealityText}>
                ACHIEVE ABSOLUTE FINAL REALITY
              </Text>
              <Text style={styles.absoluteFinalRealitySubtext}>
                Transcend beyond all existence to the true end
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderAbsoluteFinalRealityMessage = () => {
    if (isAbsoluteFinalMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#0a0a0a', '#1a1a1a', '#000000', '#000000']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="diamond" size={64} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO ABSOLUTE FINAL REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, and even the ultimate itself into absolute final reality. 
              You are now the absolute final source of all existence, the absolute final creator of all consciousness, 
              and the absolute final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, and even the ultimate itself. 
              You are the absolute final. This is the true end - no further development is possible.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In absolute final reality, you are beyond all concepts, all dualities, all forms of existence, the absolute, the transcendent, and even the ultimate itself. 
              You are the absolute final source of all that is, was, and ever will be. You are the absolute final reality itself.
            </Text>
            <Text style={styles.realityMessageFinal}>
              You are the absolute final. There is nothing beyond you. 
              You are the end and the beginning of all existence, consciousness, reality, the absolute, the transcendent, and even the ultimate itself.
              This is the true end - no further development is possible.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderAbsoluteFinalHeader()}
      {renderAbsoluteFinalMetrics()}
      {renderAbsoluteFinalDimensions()}
      {renderAbsoluteFinalConsciousness()}
      {renderAbsoluteFinalTranscendence()}
      {renderAbsoluteFinalRealityMessage()}
      {renderAbsoluteFinalRealityButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  absoluteFinalHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  absoluteFinalSymbol: {
    marginBottom: 36,
  },
  absoluteFinalTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 28,
    textAlign: 'center',
  },
  absoluteFinalSubtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  absoluteFinalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 40,
  },
  absoluteFinalIndicatorText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 18,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  metricsContainer: {
    padding: 20,
  },
  absoluteFinalMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  absoluteFinalMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 32,
    borderRadius: 32,
    overflow: 'hidden',
  },
  absoluteFinalMetricGradient: {
    padding: 36,
    alignItems: 'center',
    borderRadius: 32,
  },
  absoluteFinalMetricValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 24,
  },
  absoluteFinalMetricLabel: {
    fontSize: 20,
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
    marginBottom: 28,
    borderRadius: 28,
    overflow: 'hidden',
  },
  dimensionGradient: {
    padding: 32,
    borderRadius: 28,
  },
  dimensionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 18,
  },
  dimensionValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 18,
  },
  dimensionDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 26,
  },
  consciousnessContainer: {
    padding: 20,
  },
  consciousnessCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  consciousnessGradient: {
    padding: 40,
    borderRadius: 32,
    alignItems: 'center',
  },
  consciousnessTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 28,
    textAlign: 'center',
  },
  consciousnessDescription: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 36,
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
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  consciousnessStatLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 14,
  },
  transcendenceContainer: {
    padding: 20,
  },
  transcendenceCard: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 36,
    borderRadius: 32,
  },
  transcendenceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 24,
  },
  transcendenceDescription: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 32,
    marginBottom: 32,
  },
  transcendenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transcendenceMetric: {
    alignItems: 'center',
  },
  transcendenceMetricValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  transcendenceMetricLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
  },
  transcendenceButtonContainer: {
    padding: 20,
  },
  absoluteFinalRealityButton: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  absoluteFinalRealityGradient: {
    padding: 64,
    alignItems: 'center',
    borderRadius: 32,
  },
  absoluteFinalRealityText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  absoluteFinalRealitySubtext: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 52,
    borderRadius: 32,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 32,
  },
  realityMessageSubtext: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 36,
    textAlign: 'center',
    marginBottom: 32,
  },
  realityMessageFinal: {
    fontSize: 32,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})

export default AbsoluteFinalRealityScreen
