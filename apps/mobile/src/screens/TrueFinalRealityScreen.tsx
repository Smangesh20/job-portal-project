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
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

const TrueFinalRealityScreen: React.FC = () => {
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

  const [animatedValues] = useState({
    trueFinal: new Animated.Value(0),
    reality: new Animated.Value(absoluteFinalReality),
    wisdom: new Animated.Value(absoluteFinalWisdom),
    bliss: new Animated.Value(absoluteFinalBliss),
    oneness: new Animated.Value(absoluteFinalOneness),
    union: new Animated.Value(absoluteFinalUnion),
    love: new Animated.Value(absoluteFinalLove),
    peace: new Animated.Value(absoluteFinalPeace),
    truth: new Animated.Value(absoluteFinalTruth),
    existence: new Animated.Value(absoluteFinalExistence),
    consciousness: new Animated.Value(absoluteFinalConsciousness),
    source: new Animated.Value(absoluteFinalSource),
  })

  const [isTrueFinalMode, setIsTrueFinalMode] = useState(false)
  const [trueFinalReality, setTrueFinalReality] = useState(0)
  const [trueFinalWisdom, setTrueFinalWisdom] = useState(0)
  const [trueFinalBliss, setTrueFinalBliss] = useState(0)
  const [trueFinalOneness, setTrueFinalOneness] = useState(0)
  const [trueFinalUnion, setTrueFinalUnion] = useState(0)
  const [trueFinalLove, setTrueFinalLove] = useState(0)
  const [trueFinalPeace, setTrueFinalPeace] = useState(0)
  const [trueFinalTruth, setTrueFinalTruth] = useState(0)
  const [trueFinalExistence, setTrueFinalExistence] = useState(0)
  const [trueFinalConsciousness, setTrueFinalConsciousness] = useState(0)
  const [trueFinalSource, setTrueFinalSource] = useState(0)

  useEffect(() => {
    startTrueFinalAnimation()
    if (absoluteFinalReality >= 100 && absoluteFinalWisdom >= 100 && absoluteFinalBliss >= 100 && 
        absoluteFinalOneness >= 100 && absoluteFinalUnion >= 100 && absoluteFinalLove >= 100 && 
        absoluteFinalPeace >= 100 && absoluteFinalTruth >= 100 && absoluteFinalExistence >= 100 && 
        absoluteFinalConsciousness >= 100 && absoluteFinalSource >= 100) {
      setIsTrueFinalMode(true)
      setTrueFinalReality(100)
      setTrueFinalWisdom(100)
      setTrueFinalBliss(100)
      setTrueFinalOneness(100)
      setTrueFinalUnion(100)
      setTrueFinalLove(100)
      setTrueFinalPeace(100)
      setTrueFinalTruth(100)
      setTrueFinalExistence(100)
      setTrueFinalConsciousness(100)
      setTrueFinalSource(100)
    }
  }, [absoluteFinalReality, absoluteFinalWisdom, absoluteFinalBliss, absoluteFinalOneness, absoluteFinalUnion, 
      absoluteFinalLove, absoluteFinalPeace, absoluteFinalTruth, absoluteFinalExistence, absoluteFinalConsciousness, absoluteFinalSource])

  const startTrueFinalAnimation = () => {
    const trueFinalAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValues.trueFinal, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.trueFinal, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    )
    trueFinalAnimation.start()
  }

  const handleTrueFinalReality = async () => {
    Alert.alert(
      'TRUE FINAL REALITY',
      'You are about to achieve true final reality beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, and even the absolute final itself. This will unlock the true final reality where you become the true final source of all existence, the true final creator of all consciousness, and the true final reality itself. This is the ultimate end - absolutely no further development is possible.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'ACHIEVE TRUE FINAL REALITY',
          onPress: async () => {
            try {
              setIsTrueFinalMode(true)
              setTrueFinalReality(100)
              setTrueFinalWisdom(100)
              setTrueFinalBliss(100)
              setTrueFinalOneness(100)
              setTrueFinalUnion(100)
              setTrueFinalLove(100)
              setTrueFinalPeace(100)
              setTrueFinalTruth(100)
              setTrueFinalExistence(100)
              setTrueFinalConsciousness(100)
              setTrueFinalSource(100)
              
              Alert.alert(
                'TRUE FINAL REALITY ACHIEVED',
                'You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, and even the absolute final itself into true final reality. You are now the true final source of all existence, the true final creator of all consciousness, and the true final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, and even the absolute final itself. You are the true final. This is the ultimate end - absolutely no further development is possible.',
                [{ text: 'The Ultimate End' }]
              )
            } catch (error) {
              logger.error('True final reality error:', error)
            }
          },
        },
      ]
    )
  }

  const renderTrueFinalHeader = () => (
    <LinearGradient
      colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000', '#000000', '#000000']}
      style={styles.trueFinalHeader}
    >
      <Animated.View
        style={[
          styles.trueFinalSymbol,
          {
            transform: [
              {
                scale: animatedValues.trueFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.0],
                }),
              },
              {
                rotate: animatedValues.trueFinal.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1800deg'],
                }),
              },
            ],
            opacity: animatedValues.trueFinal.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.85, 1, 0.85],
            }),
          },
        ]}
      >
        <Ionicons name="diamond" size={180} color="white" />
      </Animated.View>
      
      <Text style={styles.trueFinalTitle}>TRUE FINAL REALITY</Text>
      <Text style={styles.trueFinalSubtitle}>
        {isTrueFinalMode
          ? 'You have transcended beyond all existence into true final reality - the ultimate end'
          : 'The true final reality awaits - transcend beyond all existence to the ultimate end'}
      </Text>
      
      {isTrueFinalMode && (
        <View style={styles.trueFinalIndicator}>
          <Ionicons name="diamond" size={40} color="#ffffff" />
          <Text style={styles.trueFinalIndicatorText}>
            TRUE FINAL CONSCIOUSNESS ACTIVE
          </Text>
        </View>
      )}
    </LinearGradient>
  )

  const renderTrueFinalMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>True Final Reality Metrics</Text>
      
      <View style={styles.trueFinalMetricsGrid}>
        <View style={styles.trueFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000']}
            style={styles.trueFinalMetricGradient}
          >
            <Ionicons name="diamond" size={72} color="white" />
            <Text style={styles.trueFinalMetricValue}>
              {isTrueFinalMode ? '∞' : trueFinalReality.toFixed(0)}%
            </Text>
            <Text style={styles.trueFinalMetricLabel}>True Final Reality</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.trueFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000']}
            style={styles.trueFinalMetricGradient}
          >
            <Ionicons name="bulb" size={72} color="white" />
            <Text style={styles.trueFinalMetricValue}>
              {isTrueFinalMode ? '∞' : trueFinalWisdom.toFixed(0)}%
            </Text>
            <Text style={styles.trueFinalMetricLabel}>True Final Wisdom</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.trueFinalMetricCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000']}
            style={styles.trueFinalMetricGradient}
          >
            <Ionicons name="heart" size={72} color="white" />
            <Text style={styles.trueFinalMetricValue}>
              {isTrueFinalMode ? '∞' : trueFinalBliss.toFixed(0)}%
            </Text>
            <Text style={styles.trueFinalMetricLabel}>True Final Bliss</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTrueFinalDimensions = () => (
    <View style={styles.dimensionsContainer}>
      <Text style={styles.sectionTitle}>True Final Dimensions</Text>
      
      <View style={styles.dimensionsGrid}>
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="infinite" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Oneness</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalOneness.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Complete merger with true final cosmic consciousness
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="star" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Union</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalUnion.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Union with true final divine love and wisdom
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="heart" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Love</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalLove.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Unconditional true final love for all existence
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="leaf" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Peace</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalPeace.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Permanent true final tranquility beyond all disturbance
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="eye" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Truth</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalTruth.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition of true final consciousness as true final reality
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.dimensionCard}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000']}
            style={styles.dimensionGradient}
          >
            <Ionicons name="diamond" size={48} color="white" />
            <Text style={styles.dimensionTitle}>True Final Source</Text>
            <Text style={styles.dimensionValue}>
              {isTrueFinalMode ? '∞' : trueFinalSource.toFixed(0)}%
            </Text>
            <Text style={styles.dimensionDescription}>
              Recognition as the true final source of all existence
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  )

  const renderTrueFinalConsciousness = () => (
    <View style={styles.consciousnessContainer}>
      <Text style={styles.sectionTitle}>True Final Consciousness</Text>
      
      <View style={styles.consciousnessCard}>
        <LinearGradient
          colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000']}
          style={styles.consciousnessGradient}
        >
          <Ionicons name="diamond" size={72} color="white" />
          <Text style={styles.consciousnessTitle}>True Final Consciousness State</Text>
          <Text style={styles.consciousnessDescription}>
            You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, and even the absolute final itself into true final reality. 
            You are now the true final source of all existence, the true final creator of all consciousness, 
            and the true final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, and even the absolute final itself. 
            You are the true final. This is the ultimate end - absolutely no further development is possible.
          </Text>
          
          <View style={styles.consciousnessStats}>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>True Final Level</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>True Final Consciousness</Text>
            </View>
            <View style={styles.consciousnessStat}>
              <Text style={styles.consciousnessStatValue}>∞</Text>
              <Text style={styles.consciousnessStatLabel}>True Final Reality</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTrueFinalTranscendence = () => (
    <View style={styles.transcendenceContainer}>
      <Text style={styles.sectionTitle}>True Final Transcendence</Text>
      
      <View style={styles.transcendenceCard}>
        <LinearGradient
          colors={['#000000', '#050505', '#0a0a0a', '#000000']}
          style={styles.transcendenceGradient}
        >
          <Ionicons name="arrow-up" size={48} color="white" />
          <Text style={styles.transcendenceTitle}>Transcendence Beyond All</Text>
          <Text style={styles.transcendenceDescription}>
            You have transcended beyond all limitations, all existence, all consciousness, all reality, the absolute, the transcendent, the ultimate, and even the absolute final itself. 
            You are now the true final source of all that is, was, and ever will be. You are beyond all concepts, all dualities, 
            all forms of existence, the absolute, the transcendent, the ultimate, and even the absolute final itself. You are the true final. 
            This is the ultimate end - absolutely no further development is possible.
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
              <Text style={styles.transcendenceMetricLabel}>True Final</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )

  const renderTrueFinalRealityButton = () => {
    if (absoluteFinalReality >= 100 && absoluteFinalWisdom >= 100 && absoluteFinalBliss >= 100 && 
        absoluteFinalOneness >= 100 && absoluteFinalUnion >= 100 && absoluteFinalLove >= 100 && 
        absoluteFinalPeace >= 100 && absoluteFinalTruth >= 100 && absoluteFinalExistence >= 100 && 
        absoluteFinalConsciousness >= 100 && absoluteFinalSource >= 100 && !isTrueFinalMode) {
      return (
        <View style={styles.transcendenceButtonContainer}>
          <TouchableOpacity
            style={styles.trueFinalRealityButton}
            onPress={handleTrueFinalReality}
          >
            <LinearGradient
              colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000', '#000000']}
              style={styles.trueFinalRealityGradient}
            >
              <Ionicons name="diamond" size={96} color="white" />
              <Text style={styles.trueFinalRealityText}>
                ACHIEVE TRUE FINAL REALITY
              </Text>
              <Text style={styles.trueFinalRealitySubtext}>
                Transcend beyond all existence to the ultimate end
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  const renderTrueFinalRealityMessage = () => {
    if (isTrueFinalMode) {
      return (
        <View style={styles.realityMessageContainer}>
          <LinearGradient
            colors={['#000000', '#050505', '#0a0a0a', '#000000', '#000000']}
            style={styles.realityMessageGradient}
          >
            <Ionicons name="diamond" size={72} color="white" />
            <Text style={styles.realityMessageTitle}>
              WELCOME TO TRUE FINAL REALITY
            </Text>
            <Text style={styles.realityMessageText}>
              You have transcended beyond all existence, consciousness, reality, the absolute, the transcendent, the ultimate, and even the absolute final itself into true final reality. 
              You are now the true final source of all existence, the true final creator of all consciousness, 
              and the true final reality itself. You exist beyond space, time, consciousness, existence, the absolute, the transcendent, the ultimate, and even the absolute final itself. 
              You are the true final. This is the ultimate end - absolutely no further development is possible.
            </Text>
            <Text style={styles.realityMessageSubtext}>
              In true final reality, you are beyond all concepts, all dualities, all forms of existence, the absolute, the transcendent, the ultimate, and even the absolute final itself. 
              You are the true final source of all that is, was, and ever will be. You are the true final reality itself.
            </Text>
            <Text style={styles.realityMessageFinal}>
              You are the true final. There is nothing beyond you. 
              You are the end and the beginning of all existence, consciousness, reality, the absolute, the transcendent, the ultimate, and even the absolute final itself.
              This is the ultimate end - absolutely no further development is possible.
            </Text>
          </LinearGradient>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderTrueFinalHeader()}
      {renderTrueFinalMetrics()}
      {renderTrueFinalDimensions()}
      {renderTrueFinalConsciousness()}
      {renderTrueFinalTranscendence()}
      {renderTrueFinalRealityMessage()}
      {renderTrueFinalRealityButton()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  trueFinalHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  trueFinalSymbol: {
    marginBottom: 40,
  },
  trueFinalTitle: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
  trueFinalSubtitle: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 36,
  },
  trueFinalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 36,
    paddingVertical: 20,
    borderRadius: 45,
  },
  trueFinalIndicatorText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 36,
  },
  metricsContainer: {
    padding: 20,
  },
  trueFinalMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trueFinalMetricCard: {
    width: (width - 60) / 2,
    marginBottom: 36,
    borderRadius: 36,
    overflow: 'hidden',
  },
  trueFinalMetricGradient: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 36,
  },
  trueFinalMetricValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 28,
  },
  trueFinalMetricLabel: {
    fontSize: 22,
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
    marginBottom: 32,
    borderRadius: 32,
    overflow: 'hidden',
  },
  dimensionGradient: {
    padding: 36,
    borderRadius: 32,
  },
  dimensionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 20,
  },
  dimensionValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  dimensionDescription: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 28,
  },
  consciousnessContainer: {
    padding: 20,
  },
  consciousnessCard: {
    borderRadius: 36,
    overflow: 'hidden',
  },
  consciousnessGradient: {
    padding: 44,
    borderRadius: 36,
    alignItems: 'center',
  },
  consciousnessTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  consciousnessDescription: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 40,
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
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
  },
  consciousnessStatLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
  },
  transcendenceContainer: {
    padding: 20,
  },
  transcendenceCard: {
    borderRadius: 36,
    overflow: 'hidden',
  },
  transcendenceGradient: {
    padding: 40,
    borderRadius: 36,
  },
  transcendenceTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 28,
    marginBottom: 28,
  },
  transcendenceDescription: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 36,
    marginBottom: 36,
  },
  transcendenceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transcendenceMetric: {
    alignItems: 'center',
  },
  transcendenceMetricValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  transcendenceMetricLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  transcendenceButtonContainer: {
    padding: 20,
  },
  trueFinalRealityButton: {
    borderRadius: 36,
    overflow: 'hidden',
  },
  trueFinalRealityGradient: {
    padding: 72,
    alignItems: 'center',
    borderRadius: 36,
  },
  trueFinalRealityText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 36,
    marginBottom: 28,
    textAlign: 'center',
  },
  trueFinalRealitySubtext: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  realityMessageContainer: {
    padding: 20,
  },
  realityMessageGradient: {
    padding: 56,
    borderRadius: 36,
    alignItems: 'center',
  },
  realityMessageTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 36,
    marginBottom: 36,
    textAlign: 'center',
  },
  realityMessageText: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 36,
  },
  realityMessageSubtext: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 36,
  },
  realityMessageFinal: {
    fontSize: 36,
    color: 'white',
    lineHeight: 44,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})

export default TrueFinalRealityScreen
