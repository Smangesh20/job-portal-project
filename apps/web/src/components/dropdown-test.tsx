'use client'

import React, { useState } from 'react'
import { ProfessionalDropdown, ProfessionalSingleDropdown } from '@/components/professional-dropdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DropdownTest() {
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
  const locations = ['San Francisco', 'New York', 'London', 'Remote', 'Hybrid', 'Seattle', 'Austin', 'Boston']

  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => 
      prev.includes(jobType) 
        ? prev.filter(type => type !== jobType)
        : [...prev, jobType]
    )
  }

  const clearAll = () => {
    setSelectedJobTypes([])
    setSelectedLocation('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Professional Dropdown Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalDropdown
              label="Job Types (Multiple Selection)"
              options={jobTypes}
              selectedValues={selectedJobTypes}
              onToggle={toggleJobType}
              placeholder="Select job types"
              multiple={true}
            />
            
            <ProfessionalSingleDropdown
              label="Location (Single Selection)"
              options={locations}
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Select a location"
            />
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Test Results:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Selected Job Types:</strong> {selectedJobTypes.length > 0 ? selectedJobTypes.join(', ') : 'None'}</p>
              <p><strong>Selected Location:</strong> {selectedLocation || 'None'}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="mt-4"
            >
              Clear All Selections
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}