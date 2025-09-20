'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  MapPin, 
  DollarSign,
  Clock,
  Briefcase,
  Filter,
  X,
  ChevronDown,
  Check,
  Sparkles,
  TrendingUp,
  Star,
  Building,
  Users,
  Globe,
  Zap,
  Target,
  Brain,
  Lightbulb,
  FileText,
  GraduationCap,
  Calendar,
  Crown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchFilters {
  query: string
  location: string
  jobTypes: string[]
  experienceLevels: string[]
  remoteOptions: string[]
  salaryRange: [number, number]
  companySizes: string[]
  industries: string[]
  skills: string[]
  benefits: string[]
  workArrangements: string[]
  diversity: string[]
  aiSuggestions: string[]
}

interface AISuggestion {
  id: string
  text: string
  type: 'skill' | 'location' | 'company' | 'role'
  confidence: number
  reason: string
}

const jobTypes = [
  { id: 'full-time', label: 'Full-time', count: 1247, icon: Briefcase },
  { id: 'part-time', label: 'Part-time', count: 89, icon: Clock },
  { id: 'contract', label: 'Contract', count: 234, icon: FileText },
  { id: 'freelance', label: 'Freelance', count: 156, icon: Users },
  { id: 'internship', label: 'Internship', count: 67, icon: GraduationCap },
  { id: 'temporary', label: 'Temporary', count: 45, icon: Calendar }
]

const experienceLevels = [
  { id: 'entry', label: 'Entry Level (0-2 years)', count: 456, icon: Target },
  { id: 'mid', label: 'Mid Level (3-5 years)', count: 892, icon: TrendingUp },
  { id: 'senior', label: 'Senior Level (6-10 years)', count: 567, icon: Star },
  { id: 'lead', label: 'Lead/Principal (11+ years)', count: 234, icon: Crown },
  { id: 'executive', label: 'Executive', count: 89, icon: Building }
]

const remoteOptions = [
  { id: 'remote', label: 'Remote', count: 1234, icon: Globe },
  { id: 'hybrid', label: 'Hybrid', count: 567, icon: Building },
  { id: 'onsite', label: 'On-site', count: 890, icon: MapPin }
]

const companySizes = [
  { id: 'startup', label: 'Startup (1-50)', count: 234 },
  { id: 'small', label: 'Small (51-200)', count: 456 },
  { id: 'medium', label: 'Medium (201-1000)', count: 567 },
  { id: 'large', label: 'Large (1000+)', count: 678 }
]

const industries = [
  { id: 'tech', label: 'Technology', count: 1234 },
  { id: 'finance', label: 'Finance', count: 567 },
  { id: 'healthcare', label: 'Healthcare', count: 456 },
  { id: 'education', label: 'Education', count: 234 },
  { id: 'retail', label: 'Retail', count: 345 },
  { id: 'manufacturing', label: 'Manufacturing', count: 123 }
]

const popularSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker',
  'Kubernetes', 'Machine Learning', 'Data Science', 'DevOps', 'UI/UX Design',
  'Product Management', 'Sales', 'Marketing', 'Finance', 'Healthcare'
]

const benefits = [
  'Health Insurance', '401k Matching', 'Stock Options', 'Flexible Hours',
  'Remote Work', 'Learning Budget', 'Gym Membership', 'Unlimited PTO',
  'Maternity Leave', 'Childcare', 'Transportation', 'Meals'
]

const workArrangements = [
  '4-day work week', 'Flexible schedule', 'Compressed hours', 'Job sharing',
  'Sabbatical', 'Phased retirement', 'Compressed work week'
]

const diversityOptions = [
  'Women-led', 'Minority-owned', 'LGBTQ+ friendly', 'Veteran-owned',
  'Disability-friendly', 'Inclusive culture', 'Equal opportunity'
]

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    jobTypes: [],
    experienceLevels: [],
    remoteOptions: [],
    salaryRange: [30000, 200000],
    companySizes: [],
    industries: [],
    skills: [],
    benefits: [],
    workArrangements: [],
    diversity: [],
    aiSuggestions: []
  })

  const [showFilters, setShowFilters] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // AI-powered search suggestions
  useEffect(() => {
    if (filters.query.length > 2) {
      setIsLoadingSuggestions(true)
      
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Debounce search suggestions
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestions = await generateAISuggestions(filters.query)
          setAiSuggestions(suggestions)
        } catch (error) {
          console.error('Error generating AI suggestions:', error)
        } finally {
          setIsLoadingSuggestions(false)
        }
      }, 300)
    } else {
      setAiSuggestions([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [filters.query])

  // Load trending searches and search history
  useEffect(() => {
    loadTrendingSearches()
    loadSearchHistory()
  }, [])

  const generateAISuggestions = async (query: string): Promise<AISuggestion[]> => {
    // Simulate AI-powered suggestions based on query
    const mockSuggestions: AISuggestion[] = []
    
    // Skill-based suggestions
    if (query.toLowerCase().includes('react') || query.toLowerCase().includes('frontend')) {
      mockSuggestions.push({
        id: 'skill-react',
        text: 'React Developer',
        type: 'role',
        confidence: 0.95,
        reason: 'High demand for React skills in your area'
      })
    }

    // Location-based suggestions
    if (query.toLowerCase().includes('remote') || query.toLowerCase().includes('work from home')) {
      mockSuggestions.push({
        id: 'location-remote',
        text: 'Remote Software Engineer',
        type: 'role',
        confidence: 0.88,
        reason: 'Popular remote work option with 1200+ openings'
      })
    }

    // Company-based suggestions
    if (query.toLowerCase().includes('startup') || query.toLowerCase().includes('fast growing')) {
      mockSuggestions.push({
        id: 'company-startup',
        text: 'Startup Software Engineer',
        type: 'role',
        confidence: 0.82,
        reason: 'Fast-growing startups in your skill set'
      })
    }

    // Add generic suggestions based on popular skills
    popularSkills.forEach(skill => {
      if (query.toLowerCase().includes(skill.toLowerCase())) {
        mockSuggestions.push({
          id: `skill-${skill.toLowerCase()}`,
          text: `${skill} Developer`,
          type: 'role',
          confidence: 0.75,
          reason: `${skill} is trending with 500+ new jobs this week`
        })
      }
    })

    return mockSuggestions.slice(0, 5) // Limit to 5 suggestions
  }

  const loadTrendingSearches = async () => {
    // Simulate loading trending searches
    setTrendingSearches([
      'Remote Software Engineer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
      'DevOps Engineer'
    ])
  }

  const loadSearchHistory = async () => {
    // Load from localStorage or API
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setSearchHistory(history)
  }

  const saveSearchHistory = (query: string) => {
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    }
  }

  const toggleFilter = (
    filterArray: string[],
    setFilterArray: (filters: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  const clearAllFilters = () => {
    setFilters({
      query: '',
      location: '',
      jobTypes: [],
      experienceLevels: [],
      remoteOptions: [],
      salaryRange: [30000, 200000],
      companySizes: [],
      industries: [],
      skills: [],
      benefits: [],
      workArrangements: [],
      diversity: [],
      aiSuggestions: []
    })
  }

  const handleSearch = () => {
    saveSearchHistory(filters.query)
    // Implement actual search logic here
    console.log('Searching with filters:', filters)
  }

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    setFilters(prev => ({
      ...prev,
      query: suggestion.text,
      aiSuggestions: [...prev.aiSuggestions, suggestion.id]
    }))
  }

  const activeFiltersCount = 
    filters.jobTypes.length + 
    filters.experienceLevels.length + 
    filters.remoteOptions.length + 
    filters.companySizes.length + 
    filters.industries.length + 
    filters.skills.length + 
    filters.benefits.length + 
    filters.workArrangements.length + 
    filters.diversity.length

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Search Bar */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
                {isLoadingSuggestions && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>

              {/* AI Suggestions Dropdown */}
              <AnimatePresence>
                {aiSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                  >
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 border-b">
                        <Brain className="h-4 w-4" />
                        AI-Powered Suggestions
                      </div>
                      {aiSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{suggestion.text}</div>
                              <div className="text-sm text-gray-500">{suggestion.reason}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(suggestion.confidence * 100)}% match
                              </Badge>
                              <Sparkles className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Input */}
            <div className="lg:w-80 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="City, state, or remote"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              />
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Trending Searches */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Trending:</span>
              {trendingSearches.slice(0, 3).map((search, index) => (
                <button
                  key={index}
                  onClick={() => setFilters(prev => ({ ...prev, query: search }))}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Advanced Filters
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Types */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Type
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => toggleFilter(filters.jobTypes, (types) => setFilters(prev => ({ ...prev, jobTypes: types })), type.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          filters.jobTypes.includes(type.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.count} jobs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Experience Level
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => toggleFilter(filters.experienceLevels, (levels) => setFilters(prev => ({ ...prev, experienceLevels: levels })), level.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          filters.experienceLevels.includes(level.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <level.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.count} jobs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remote Options */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Work Arrangement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {remoteOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleFilter(filters.remoteOptions, (options) => setFilters(prev => ({ ...prev, remoteOptions: options })), option.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          filters.remoteOptions.includes(option.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.count} jobs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Salary Range: ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
                  </h3>
                  <div className="px-4">
                    <Slider
                      value={filters.salaryRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, salaryRange: value as [number, number] }))}
                      min={20000}
                      max={300000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>$20k</span>
                      <span>$300k+</span>
                    </div>
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Size
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {companySizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => toggleFilter(filters.companySizes, (sizes) => setFilters(prev => ({ ...prev, companySizes: sizes })), size.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          filters.companySizes.includes(size.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{size.label}</div>
                          <div className="text-xs text-gray-500">{size.count} jobs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Industry
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {industries.map((industry) => (
                      <button
                        key={industry.id}
                        onClick={() => toggleFilter(filters.industries, (inds) => setFilters(prev => ({ ...prev, industries: inds })), industry.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                          filters.industries.includes(industry.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{industry.label}</div>
                          <div className="text-xs text-gray-500">{industry.count} jobs</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleFilter(filters.skills, (skills) => setFilters(prev => ({ ...prev, skills })), skill)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          filters.skills.includes(skill)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Benefits
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {benefits.map((benefit) => (
                      <button
                        key={benefit}
                        onClick={() => toggleFilter(filters.benefits, (bens) => setFilters(prev => ({ ...prev, benefits: bens })), benefit)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          filters.benefits.includes(benefit)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{benefit}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Work Arrangements */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Work Arrangements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {workArrangements.map((arrangement) => (
                      <button
                        key={arrangement}
                        onClick={() => toggleFilter(filters.workArrangements, (arrs) => setFilters(prev => ({ ...prev, workArrangements: arrs })), arrangement)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          filters.workArrangements.includes(arrangement)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{arrangement}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diversity & Inclusion */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Diversity & Inclusion
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {diversityOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleFilter(filters.diversity, (divs) => setFilters(prev => ({ ...prev, diversity: divs })), option)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          filters.diversity.includes(option)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
