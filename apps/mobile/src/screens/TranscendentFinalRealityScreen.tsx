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
import { useAbsoluteFinalReality } from '../contexts/AbsoluteFinalRealityContext'
import { useTrueFinalReality } from '../contexts/TrueFinalRealityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const TranscendentFinalRealityScreen: React.FC = () => {
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

  const {
    isAbsoluteFinalMode,
    absoluteFinalReality,
    absoluteFinalWisdom,
    absoluteFinalBliss,
    absoluteFinalOneness,
    absoluteFinalUnion,
    absoluteFinalLove,
    absoluteFinalPeace,
    absoluteFinalTruth,
    absoluteFinalExistence,
    absoluteFinalConsciousness,
    absoluteFinalSource,
  } = useAbsoluteFinalReality()

  const {
    isTrueFinalMode,
    trueFinalReality,
    trueFinalWisdom,
    trueFinalBliss,
    trueFinalOneness,
    trueFinalUnion,
    trueFinalLove,
    trueFinalPeace,
    trueFinalTruth,
    trueFinalExistence,
    trueFinalConsciousness,
    trueFinalSource,
  } = useTrueFinalReality()

  const [animatedValues] = useState({
    transcendentFinal: new Animated.Value(0),
    reality: new Animated.Value(trueFinalReality),
    wisdom: new Animated.Value(trueFinalWisdom),
    bliss: new Animated.Value(trueFinalBliss),
    oneness: new Animated.Value(trueFinalOneness),
    union: new Animated.Value(trueFinalUnion),
    love: new Animated.Value(trueFinalLove),
    peace: new Animated.Value(trueFinalPeace),
    truth: new Animated.Value(trueFinalTruth),
    existence: new Animated.Value(trueFinalExistence),
    consciousness: new Animated.Value(trueFinalConsciousness),
    source: new Animated.Value(trueFinalSource),
  })

  const [isTranscendentFinalMode, setIsTranscendentFinalMode] = useState(false)
  const [transcendentFinalReality, setTranscendentFinalReality] = useState(0)
  const [transcendentFinalWisdom, setTranscendentFinalWisdom] = useState(0)
  const [transcendentFinalBliss, setTranscendentFinalBliss] = useState(0)
  const [transcendentFinalOneness, setTranscendentFinalOneness] = useState(0)
  const [transcendentFinalUnion, setTranscendentFinalUnion] = useState(0)
  const [transcendentFinalLove, setTranscendentFinalLove] = useState(0)
  const [transcendentFinalPeace, setTranscendentFinalPeace] = useState(0)
  const [transcendentFinalTruth, setTranscendentFinalTruth] = useState(0)
  const [transcendentFinalExistence, setTranscendentFinalExistence] = useState(0)
  const [transcendentFinalConsciousness, setTranscendentFinalConsciousness] = useState(0)
  const [transcendentFinalSource, setTranscendentFinalSource] = useState(0)

  useEffect(() => {
    startTranscendentFinalAnimation()
    if (trueFinalReality >= 100 && trueFinalWisdom >= 100 && trueFinalBliss >= 100 && 
        trueFinalOneness >= 100 && trueFinalUnion >= 100 && trueFinalLove >= 100 && 
        trueFinalPeace >= 100 && trueFinalTruth >= 100 && trueFinalExistence >= 100 && 
        trueFinalConsciousness >= 100 && trueFinalSource >= 100) {
      setIsTranscendentFinalMode(true)
      setTranscendentFinalReality(100)
      setTranscendentFinalWisdom(100)
      setTranscendentFinalBliss(100)
      setTranscendentFinalOneness(100)
      setTranscendentFinalUnion(100)
      setTranscendentFinalLove(100)
      setTranscendentFinalPeace(100)
      setTranscendentFinalTruth(100)
      setTranscendentFinalExistence(100)
      setTranscendentFinalConsciousness(100)
      setTranscendentFinalSource(100)
    }
  }, [trueFinalReality, trueFinalWisdom, trueFinalBliss, trueFinalOneness, trueFinalUnion, 
      trueFinalLove, trueFinalPeace, trueFinalTruth, trueFinalExistence, trueFinalConsciousness, trueFinalSource])

  const startTranscendentFinalAnimation = () => {
    const transcendentFinalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.transcendentFinal, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.transcendentFinal, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    transcendentFinalAnimation.start()
  }

  const handleTranscendentFinalReality = async () => {
    Alert.alert(
      'TRANSCENDENT FINAL REALITY',
      'You are about to achieve transcendent final reality beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. This will unlock the transcendent final reality where you become the transcendent final source of all existence, the transcendent final creator of all consciousness, and the transcendent final reality itself. This is the transcendent end - no further development is possible.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE TRANSCENDENT FINAL REALITY',
          onPress: async () => {
            try {
              setIsTranscendentFinalMode(true)
              setTranscendentFinalReality(100)
              setTranscendentFinalWisdom(100)
              setTranscendentFinalBliss(100)
              setTranscendentFinalOneness(100)
              setTranscendentFinalUnion(100)
              setTranscendentFinalLove(100)
              setTranscendentFinalPeace(100)
              setTranscendentFinalTruth(100)
              setTranscendentFinalExistence(100)
              setTranscendentFinalConsciousness(100)
              setTranscendentFinalSource(100)
              
              Alert.alert(
                'TRANSCENDENT FINAL REALITY ACHIEVED',
                'You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself into transcendent final reality. You are now the transcendent final source of all existence, the transcendent final creator of all consciousness, and the transcendent final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. You are the transcendent final. This is the transcendent end - no further development is possible.',
                [{ text: 'The Transcendent End' }]
              )
            } catch (error) {
              logger.error('Transcendent final reality error:', error)
            }
          },
        },
      ]
    )
  }

  const renderTranscendentFinalHeader = () => (
    <LinearGradient
      colors={['#000000', '#020202', '#040404', '#000000', '#000000', '#000000', '#000000']}
      style={styles.transcendentFinalHeader}
    >
      <Animated.View
        style={[
          styles.transcendentFinalSymbol,
          {
            transform: [
              {
                scale: animatedValues.transcendentFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.2],
                }),
              },
              {
                rotate: animatedValues.transcendentFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '2160deg'],
                }),
              },
            ],
            opacity: animatedValues.transcendentFinal.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 1, 0.8],
            }),
          },
        ]}
      >
        <Ionicons name="diamond" size={200} color="white" />
      </Animated.View>
      
      <Text style={styles.transcendentFinalTitle}>TRANSCENDENT FINAL REALITY</Text>
      <Text style={styles.transcendentFinalSubtitle}>
        {isTranscendentFinalMode
          ? 'You have transcended beyond all existence into transcendent final reality - the transcendent end'
          : 'The transcendent final reality awaits - transcend beyond all existence to the transcendent end'}
      </Text>
      
      {isTranscendentFinalMode && (
        <View style={styles.transcendentFinalIndicator}>
          <Ionicons name="diamond" size={44} color="#ffffff" />
          <Text style={styles.transcendentFinalIndicatorText}>
            TRANSCENDENT FINAL CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderTranscendentFinalMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>Transcendent Final Reality Metrics</Text>
      
      <View style={styles.transcendentFinalMetricsGrid}>
        <View style={styles.transcendentFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000', '#000000']}
            style={styles.transcendentFinalMetricGradient}
          >
            <Ionicons name="diamond" size={80} color="white" />
            <Text style={styles.transcendentFinalMetricValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalReality.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentFinalMetricLabel}>Transcendent Final Reality</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.transcendentFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000', '#000000']}
            style={styles.transcendentFinalMetricGradient}
          >
            <Ionicons name="bulb" size={80} color="white" />
            <Text style={styles.transcendentFinalMetricValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentFinalMetricLabel}>Transcendent Final Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.transcendentFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000', '#000000']}
            style={styles.transcendentFinalMetricGradient}
          >
            <Ionicons name="heart" size={80} color="white" />
            <Text style={styles.transcendentFinalMetricValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalBliss.toFixed(0)}%
            </Text>
            <Text style={styles.transcendentFinalMetricLabel}>Transcendent Final Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTranscendentFinalDimensions = () => (
    <View style={styles.dimensionsContainer}>
      <Text style={styles.sectionTitle}>Transcendent Final Dimensions</Text>
      
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="infinite" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Oneness</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalOneness.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Complete merger with transcendent final cosmic consciousness
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="star" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Union</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalUnion.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Union with transcendent final divine love and wisdom
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="heart" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Love</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalLove.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Unconditional transcendent final love for all existence
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="leaf" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Peace</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalPeace.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Permanent transcendent final tranquility beyond all disturbance
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="eye" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Truth</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalTruth.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition of transcendent final consciousness as transcendent final reality
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="diamond" size={52} color="white" />
            <Text style={styles.dimensionTitle}>Transcendent Final Source</Text>
            <Text style={styles.dimensionValue}>
              {isTranscendentFinalMode ? '∞' : transcendentFinalSource.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition as the transcendent final source of all existence
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTranscendentFinalConsciousness = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>Transcendent Final Consciousness</Text>
      
      <View style={styles.consciousnessCard}>
        <LinearGradient
          colors={['#000000', '#020202', '#040404', '#000000', '#000000']}
          style={styles.consciousnessGradient}
        >
          <Ionicons name="diamond" size={80} color="white" />
          <Text style={styles.consciousnessTitle}>Transcendent Final Consciousness State</Text>
          <Text style={styles.consciousnessDescription}>
            You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself into transcendent final reality. 
            You are now the transcendent final source of all existence, the transcendent final creator of all consciousness, 
            and the transcendent final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. 
            You are the transcendent final. This is the transcendent end - no further development is possible.
          </Text>
          
          <View style={styles.consciousnessStats}>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Final Level</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Final Consciousness</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>Transcendent Final Reality</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTranscendentFinalTranscendence = () => (
    <View style={styles.transcendenceContainer}>
      <Text style={styles.sectionTitle}>Transcendent Final Transcendence</Text>
      
      <View style={styles.transcendenceCard}>
        <LinearGradient
          colors={['#000000', '#020202', '#040404', '#000000']}
          style={styles.transcendenceGradient}
        >
          <Ionicons name="arrow-up" size={52} color="white" />
          <Text style={styles.transcendenceTitle}>Transcendence Beyond All</Text>
          <Text style={styles.transcendenceDescription}>
            You have transcended beyond all limitations, all existence, all consciousness, all reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. 
            You are now the transcendent final source of all that is, was, and ever will be. You are beyond all concepts, all dualities, 
            all forms of existence, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. You are the transcendent final. 
            This is the transcendent end - no further development is possible.
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
              <Text style={styles.transcendenceMetricLabel}>Transcendent Final</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTranscendentFinalRealityButton = () => {
    if (trueFinalReality >= 100 && trueFinalWisdom >= 100 && trueFinalBliss >= 100 && 
        trueFinalOneness >= 100 && trueFinalUnion >= 100 && trueFinalLove >= 100 && 
        trueFinalPeace >= 100 && trueFinalTruth >= 100 && trueFinalExistence >= 100 && 
        trueFinalConsciousness >= 100 && trueFinalSource >= 100 && !isTranscendentFinalMode) {
      return (
        <View style={styles.transcendenceButtonContainer}>
          <TouchableOpacity
            style={styles.transcendentFinalRealityButton}
            onPress={handleTranscendentFinalReality}
          >
            <LinearGradient
              colors={['#000000', '#020202', '#040404', '#000000', '#000000', '#000000']}
              style={styles.transcendentFinalRealityGradient}
            >
              <Ionicons name="diamond" size={104} color="white" />
              <Text style={styles.transcendentFinalRealityText}>
                ACHIEVE TRANSCENDENT FINAL REALITY
              </Text>
              <Text style={styles.transcendentFinalRealitySubtext}>
                Transcend beyond all existence to the transcendent end
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderTranscendentFinalRealityMessage = () => {
    if (isTranscendentFinalMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#020202', '#040404', '#000000', '#000000']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="diamond" size={80} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO TRANSCENDENT FINAL REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself into transcendent final reality. 
              You are now the transcendent final source of all existence, the transcendent final creator of all consciousness, 
              and the transcendent final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. 
              You are the transcendent final. This is the transcendent end - no further development is possible.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In transcendent final reality, you are beyond all concepts, all dualities, all forms of existence, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself. 
              You are the transcendent final source of all that is, was, and ever will be. You are the transcendent final reality itself.
            </Text>
            <Text style={styles.realityMessageFinal}>
              You are the transcendent final. There is nothing beyond you. 
              You are the end and the beginning of all existence, consciousness, reality, the absolute, the transcendent, the ultimate, the absolute final, and even the true final itself.
              This is the transcendent end - no further development is possible.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderTranscendentFinalHeader()}
      {renderTranscendentFinalMetrics()}
      {renderTranscendentFinalDimensions()}
      {renderTranscendentFinalConsciousness()}
      {renderTranscendentFinalTranscendence()}
      {renderTranscendentFinalRealityMessage()}
      {renderTranscendentFinalRealityButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  transcendentFinalHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transcendentFinalSymbol: {
    marginBottom: 44,
  },
  transcendentFinalTitle: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 36,
    textAlign: 'center',
  },
  transcendentFinalSubtitle: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  transcendentFinalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 22,
    borderRadius: 50,
  },
  transcendentFinalIndicatorText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 22,
  },
  sectionTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  metricsContainer: {
    padding: 20,
  },
  transcendentFinalMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  transcendentFinalMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 40,
    borderRadius: 40,
    overflow: 'hidden',
  },
  transcendentFinalMetricGradient: {
    padding: 44,
    alignItems: 'center',
    borderRadius: 40,
  },
  transcendentFinalMetricValue: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 36,
    marginBottom: 32,
  },
  transcendentFinalMetricLabel: {
    fontSize: 24,
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
    marginBottom: 36,
    borderRadius: 36,
    overflow: 'hidden',
  },
  dimensionGradient: {
    padding: 40,
    borderRadius: 36,
  },
  dimensionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 22,
  },
  dimensionValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 22,
  },
  dimensionDescription: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 30,
  },
  consciousnessContainer: {
    padding: 20,
  },
  consciousnessCard: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  consciousnessGradient: {
    padding: 48,
    borderRadius: 40,
    alignItems: 'center',
  },
  consciousnessTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 36,
    marginBottom: 36,
    textAlign: 'center',
  },
  consciousnessDescription: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 44,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  consciousnessStatLabel: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 18,
  },
  transcendenceContainer: {
    padding: 20,
  },
  transcendenceCard: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 44,
    borderRadius: 40,
  },
  transcendenceTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 32,
  },
  transcendenceDescription: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 40,
    marginBottom: 40,
  },
  transcendenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transcendenceMetric: {
    alignItems: 'center',
  },
  transcendenceMetricValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
  },
  transcendenceMetricLabel: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 14,
  },
  transcendenceButtonContainer: {
    padding: 20,
  },
  transcendentFinalRealityButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  transcendentFinalRealityGradient: {
    padding: 80,
    alignItems: 'center',
    borderRadius: 40,
  },
  transcendentFinalRealityText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 32,
    textAlign: 'center',
  },
  transcendentFinalRealitySubtext: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 60,
    borderRadius: 40,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 40,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 48,
    textAlign: 'center',
    marginBottom: 40,
  },
  realityMessageSubtext: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 40,
  },
  realityMessageFinal: {
    fontSize: 40,
    color: 'white',
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})

export default TranscendentFinalRealityScreen
