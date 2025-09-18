'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  DollarSign,
  Clock,
  Briefcase,
  Filter,
  X,
  ChevronDown,
  Check
} from 'lucide-react'

const jobTypes = [
  { id: 'full-time', label: 'Full-time', count: 1247 },
  { id: 'part-time', label: 'Part-time', count: 89 },
  { id: 'contract', label: 'Contract', count: 234 },
  { id: 'freelance', label: 'Freelance', count: 156 },
  { id: 'internship', label: 'Internship', count: 67 }
]

const experienceLevels = [
  { id: 'entry', label: 'Entry Level', count: 456 },
  { id: 'mid', label: 'Mid Level', count: 892 },
  { id: 'senior', label: 'Senior Level', count: 567 },
  { id: 'lead', label: 'Lead/Principal', count: 234 },
  { id: 'executive', label: 'Executive', count: 89 }
]

const remoteOptions = [
  { id: 'remote', label: 'Remote', count: 1234 },
  { id: 'hybrid', label: 'Hybrid', count: 567 },
  { id: 'onsite', label: 'On-site', count: 890 }
]

const salaryRanges = [
  { id: '0-50k', label: '$0 - $50,000', count: 234 },
  { id: '50k-75k', label: '$50,000 - $75,000', count: 456 },
  { id: '75k-100k', label: '$75,000 - $100,000', count: 567 },
  { id: '100k-125k', label: '$100,000 - $125,000', count: 678 },
  { id: '125k-150k', label: '$125,000 - $150,000', count: 345 },
  { id: '150k+', label: '$150,000+', count: 234 }
]

export function JobSearchFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedRemote, setSelectedRemote] = useState<string[]>([])
  const [selectedSalary, setSelectedSalary] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

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
    setSelectedJobTypes([])
    setSelectedExperience([])
    setSelectedRemote([])
    setSelectedSalary([])
    setSearchQuery('')
    setLocation('')
  }

  const activeFiltersCount = selectedJobTypes.length + selectedExperience.length + 
                            selectedRemote.length + selectedSalary.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Job Search</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedJobTypes.includes('full-time') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(selectedJobTypes, setSelectedJobTypes, 'full-time')}
            >
              <Briefcase className="h-4 w-4 mr-1" />
              Full-time
            </Button>
            <Button
              variant={selectedRemote.includes('remote') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(selectedRemote, setSelectedRemote, 'remote')}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Remote
            </Button>
            <Button
              variant={selectedExperience.includes('senior') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(selectedExperience, setSelectedExperience, 'senior')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Senior Level
            </Button>
            <Button
              variant={selectedSalary.includes('100k-125k') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(selectedSalary, setSelectedSalary, '100k-125k')}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              $100k+
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t">
            {/* Job Type */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Type
              </h4>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedJobTypes.includes(type.id)}
                        onChange={() => toggleFilter(selectedJobTypes, setSelectedJobTypes, type.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Experience
              </h4>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <label key={level.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(level.id)}
                        onChange={() => toggleFilter(selectedExperience, setSelectedExperience, level.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{level.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {level.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Remote Work */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </h4>
              <div className="space-y-2">
                {remoteOptions.map((option) => (
                  <label key={option.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRemote.includes(option.id)}
                        onChange={() => toggleFilter(selectedRemote, setSelectedRemote, option.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {option.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Salary
              </h4>
              <div className="space-y-2">
                {salaryRanges.map((range) => (
                  <label key={range.id} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSalary.includes(range.id)}
                        onChange={() => toggleFilter(selectedSalary, setSelectedSalary, range.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{range.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {range.count}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="pt-4">
          <Button className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Search Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
