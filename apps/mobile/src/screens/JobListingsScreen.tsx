import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Easing,
  RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTranscendence } from '../contexts/TranscendenceContext'
import { useQuantumSecurity } from '../contexts/QuantumSecurityContext'
import { logger } from '../utils/logger'

const { width, height } = Dimensions.get('window')

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  isRemote: boolean
  experienceLevel: string
  industry: string
  companySize: string
  matchScore: number
  consciousnessAlignment: number
  quantumSecurityLevel: number
  transcendenceCompatibility: number
}

const JobListingsScreen: React.FC = () => {
  const { consciousnessLevel, currentState } = useTranscendence()
  const { quantumSecurityEnabled, currentQuantumState } = useQuantumSecurity()

  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [animatedValues] = useState({
    search: new Animated.Value(0),
    filter: new Animated.Value(0),
  })

  useEffect(() => {
    loadJobs()
    animateValues()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [searchQuery, selectedFilter, jobs])

  const animateValues = () => {
    Animated.parallel([
      Animated.timing(animatedValues.search, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues.filter, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Quantum Developer',
          company: 'QuantumTech Solutions',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$150,000 - $200,000',
          description: 'Develop cutting-edge quantum computing applications with consciousness integration.',
          requirements: ['Quantum Computing', 'TypeScript', 'Consciousness Engineering'],
          benefits: ['Quantum Health Insurance', 'Transcendence Training', 'Unlimited PTO'],
          postedDate: '2024-01-15',
          isRemote: true,
          experienceLevel: 'Senior',
          industry: 'Quantum Technology',
          companySize: '50-200',
          matchScore: 95,
          consciousnessAlignment: 88,
          quantumSecurityLevel: 92,
          transcendenceCompatibility: 85,
        },
        {
          id: '2',
          title: 'AI Consciousness Engineer',
          company: 'Transcendence Labs',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120,000 - $180,000',
          description: 'Build AI systems that enhance human consciousness and spiritual growth.',
          requirements: ['Machine Learning', 'Python', 'Spiritual Practices'],
          benefits: ['Meditation Retreats', 'Quantum Benefits', 'Consciousness Coaching'],
          postedDate: '2024-01-14',
          isRemote: true,
          experienceLevel: 'Mid-Senior',
          industry: 'AI/ML',
          companySize: '10-50',
          matchScore: 92,
          consciousnessAlignment: 95,
          quantumSecurityLevel: 78,
          transcendenceCompatibility: 98,
        },
        {
          id: '3',
          title: 'Quantum Security Specialist',
          company: 'SecureFuture Inc',
          location: 'New York, NY',
          type: 'Full-time',
          salary: '$130,000 - $170,000',
          description: 'Implement quantum-resistant security systems for enterprise applications.',
          requirements: ['Cryptography', 'Quantum Computing', 'Security Architecture'],
          benefits: ['Quantum Security Training', 'Advanced Health', 'Stock Options'],
          postedDate: '2024-01-13',
          isRemote: false,
          experienceLevel: 'Senior',
          industry: 'Cybersecurity',
          companySize: '200-1000',
          matchScore: 88,
          consciousnessAlignment: 72,
          quantumSecurityLevel: 98,
          transcendenceCompatibility: 65,
        },
        {
          id: '4',
          title: 'Transcendence UX Designer',
          company: 'Enlightenment Design',
          location: 'Remote',
          type: 'Contract',
          salary: '$80,000 - $120,000',
          description: 'Design user experiences that facilitate spiritual growth and consciousness expansion.',
          requirements: ['UI/UX Design', 'Figma', 'Spiritual Understanding'],
          benefits: ['Flexible Schedule', 'Spiritual Retreats', 'Design Freedom'],
          postedDate: '2024-01-12',
          isRemote: true,
          experienceLevel: 'Mid-Level',
          industry: 'Design',
          companySize: '5-20',
          matchScore: 85,
          consciousnessAlignment: 98,
          quantumSecurityLevel: 45,
          transcendenceCompatibility: 92,
        },
        {
          id: '5',
          title: 'Quantum Data Scientist',
          company: 'DataTranscendence',
          location: 'Seattle, WA',
          type: 'Full-time',
          salary: '$140,000 - $190,000',
          description: 'Apply quantum algorithms to solve complex data problems with consciousness insights.',
          requirements: ['Quantum Algorithms', 'Python', 'Data Science', 'Machine Learning'],
          benefits: ['Quantum Computing Access', 'Research Time', 'Conference Attendance'],
          postedDate: '2024-01-11',
          isRemote: false,
          experienceLevel: 'Senior',
          industry: 'Data Science',
          companySize: '100-500',
          matchScore: 90,
          consciousnessAlignment: 82,
          quantumSecurityLevel: 85,
          transcendenceCompatibility: 78,
        },
      ]

      // Enhance jobs with consciousness and quantum metrics
      const enhancedJobs = mockJobs.map(job => ({
        ...job,
        consciousnessAlignment: Math.min(100, job.consciousnessAlignment + (consciousnessLevel * 0.1)),
        quantumSecurityLevel: quantumSecurityEnabled 
          ? Math.min(100, job.quantumSecurityLevel + 10)
          : job.quantumSecurityLevel,
        transcendenceCompatibility: currentState === 'ultimate_reality'
          ? 100
          : job.transcendenceCompatibility,
      }))

      setJobs(enhancedJobs)
    } catch (error) {
      logger.error('Error loading jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(job => {
        switch (selectedFilter) {
          case 'quantum':
            return job.quantumSecurityLevel > 80
          case 'consciousness':
            return job.consciousnessAlignment > 80
          case 'transcendence':
            return job.transcendenceCompatibility > 80
          case 'remote':
            return job.isRemote
          case 'high-match':
            return job.matchScore > 90
          default:
            return true
        }
      })
    }

    setFilteredJobs(filtered)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadJobs()
    setRefreshing(false)
  }

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity style={styles.jobCard}>
      <LinearGradient
        colors={item.matchScore > 90 ? ['#10b981', '#059669'] : ['#ffffff', '#f8fafc']}
        style={styles.jobCardGradient}
      >
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={[
              styles.jobTitle,
              item.matchScore > 90 && styles.jobTitleHighMatch
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.companyName,
              item.matchScore > 90 && styles.companyNameHighMatch
            ]}>
              {item.company}
            </Text>
          </View>
          <View style={styles.matchScoreContainer}>
            <Text style={[
              styles.matchScore,
              item.matchScore > 90 && styles.matchScoreHigh
            ]}>
              {item.matchScore}%
            </Text>
            <Text style={[
              styles.matchLabel,
              item.matchScore > 90 && styles.matchLabelHigh
            ]}>
              Match
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.jobDetailRow}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.jobDetailText}>{item.location}</Text>
            {item.isRemote && (
              <View style={styles.remoteBadge}>
                <Text style={styles.remoteText}>Remote</Text>
              </View>
            )}
          </View>
          
          <View style={styles.jobDetailRow}>
            <Ionicons name="briefcase" size={16} color="#6b7280" />
            <Text style={styles.jobDetailText}>{item.type}</Text>
          </View>
          
          <View style={styles.jobDetailRow}>
            <Ionicons name="cash" size={16} color="#6b7280" />
            <Text style={styles.jobDetailText}>{item.salary}</Text>
          </View>
        </View>

        <Text style={[
          styles.jobDescription,
          item.matchScore > 90 && styles.jobDescriptionHighMatch
        ]}>
          {item.description}
        </Text>

        {/* Advanced Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Consciousness</Text>
            <View style={styles.metricBar}>
              <View
                style={[
                  styles.metricFill,
                  { backgroundColor: '#8b5cf6', width: `${item.consciousnessAlignment}%` }
                ]}
              />
            </View>
            <Text style={styles.metricValue}>{item.consciousnessAlignment.toFixed(0)}%</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Quantum</Text>
            <View style={styles.metricBar}>
              <View
                style={[
                  styles.metricFill,
                  { backgroundColor: '#1e40af', width: `${item.quantumSecurityLevel}%` }
                ]}
              />
            </View>
            <Text style={styles.metricValue}>{item.quantumSecurityLevel.toFixed(0)}%</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Transcendence</Text>
            <View style={styles.metricBar}>
              <View
                style={[
                  styles.metricFill,
                  { backgroundColor: '#d946ef', width: `${item.transcendenceCompatibility}%` }
                ]}
              />
            </View>
            <Text style={styles.metricValue}>{item.transcendenceCompatibility.toFixed(0)}%</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.postedDate}>
            Posted {new Date(item.postedDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity style={styles.applyButton}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  const renderFilterButton = (filter: string, label: string, icon: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <LinearGradient
        colors={selectedFilter === filter ? ['#6366f1', '#8b5cf6'] : ['#f8fafc', '#e2e8f0']}
        style={styles.filterButtonGradient}
      >
        <Ionicons
          name={icon as any}
          size={16}
          color={selectedFilter === filter ? 'white' : '#6366f1'}
        />
        <Text
          style={[
            styles.filterButtonText,
            selectedFilter === filter && styles.filterButtonTextActive
          ]}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )

  const getHeaderColors = () => {
    if (consciousnessLevel > 90) {
      return ['#000000', '#1a1a1a']
    } else if (quantumSecurityEnabled) {
      return ['#1e40af', '#3b82f6']
    } else {
      return ['#6366f1', '#8b5cf6']
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={getHeaderColors()}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Job Listings</Text>
          <Text style={styles.headerSubtitle}>
            {quantumSecurityEnabled ? 'Quantum-enhanced job matching' : 'Find your perfect opportunity'}
          </Text>
        </View>
      </LinearGradient>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Animated.View
          style={[
            styles.searchInputContainer,
            {
              opacity: animatedValues.search,
              transform: [
                {
                  translateY: animatedValues.search.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, or keywords..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.filtersContainer,
            {
              opacity: animatedValues.filter,
              transform: [
                {
                  translateX: animatedValues.filter.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {renderFilterButton('all', 'All Jobs', 'grid')}
            {renderFilterButton('quantum', 'Quantum', 'shield-checkmark')}
            {renderFilterButton('consciousness', 'Consciousness', 'bulb')}
            {renderFilterButton('transcendence', 'Transcendence', 'star')}
            {renderFilterButton('remote', 'Remote', 'home')}
            {renderFilterButton('high-match', 'High Match', 'trophy')}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Jobs Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  clearButton: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersScroll: {
    paddingRight: 20,
  },
  filterButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  filterButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  jobList: {
    padding: 20,
  },
  jobCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  jobTitleHighMatch: {
    color: 'white',
  },
  companyName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  companyNameHighMatch: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  matchScoreContainer: {
    alignItems: 'center',
  },
  matchScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  matchScoreHigh: {
    color: 'white',
  },
  matchLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  matchLabelHigh: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  remoteBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  remoteText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobDescriptionHighMatch: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 2,
  },
  metricValue: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  applyButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

export default JobListingsScreen
