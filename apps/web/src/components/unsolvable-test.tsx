'use client'

import React, { useState } from 'react'
import { UnsolvableDropdown, UnsolvableSingleDropdown } from '@/components/unsolvable-dropdown'
import { getUnsolvableWelcomeMessage, setUnsolvableUserName, autoDetectAndSetUnsolvableUserName, getAllUnsolvableUserNames } from '@/utils/unsolvable-welcome'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthUnified } from '@/hooks/useAuthUnified'

export function UnsolvableTest() {
  const { user } = useAuthUnified()
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [testName, setTestName] = useState<string>('')
  
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

  const handleSetName = () => {
    if (testName.trim()) {
      setUnsolvableUserName(testName.trim())
      alert(`Name set successfully! Welcome, ${testName.trim()}!`)
      setTestName('')
      // Force refresh to show new name
      window.location.reload()
    }
  }

  const handleAutoDetect = () => {
    const detectedName = autoDetectAndSetUnsolvableUserName()
    alert(`Auto-detected name: ${detectedName}`)
    // Force refresh to show new name
    window.location.reload()
  }

  const allNames = getAllUnsolvableUserNames(user)

  return (
    <div className="space-y-6">
      <Card className="border-2 border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-800">🔧 UNSOLVABLE DROPDOWN TEST - SO ROBUST IT NEVER FAILS!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Welcome Message Test */}
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Welcome Message Test</h3>
            <p className="text-sm text-gray-600 mb-3">
              Current welcome message: <strong>{getUnsolvableWelcomeMessage(user)}</strong>
            </p>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Enter your name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSetName} disabled={!testName.trim()}>
                Set Name
              </Button>
              <Button onClick={handleAutoDetect} variant="outline">
                Auto Detect
              </Button>
            </div>
          </div>

          {/* Dropdown Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UnsolvableDropdown
              label="Job Types (Multiple Selection) - UNSOLVABLE SYSTEM"
              options={jobTypes}
              selectedValues={selectedJobTypes}
              onToggle={toggleJobType}
              placeholder="Select job types"
              multiple={true}
            />
            
            <UnsolvableSingleDropdown
              label="Location (Single Selection) - UNSOLVABLE SYSTEM"
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

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🔧 UNSOLVABLE INSTRUCTIONS</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>NO CSS HOVER:</strong> These dropdowns use ONLY JavaScript clicks</li>
              <li>• <strong>MULTIPLE EVENT HANDLERS:</strong> Mouse, touch, keyboard events</li>
              <li>• <strong>CLICK TO OPEN:</strong> Click the dropdown button to open/close</li>
              <li>• <strong>CLICK TO SELECT:</strong> Click options to select them</li>
              <li>• <strong>CLICK OUTSIDE:</strong> Click anywhere outside to close</li>
              <li>• <strong>ESCAPE KEY:</strong> Press Escape to close dropdown</li>
              <li>• <strong>ENTER KEY:</strong> Press Enter to close dropdown</li>
              <li>• <strong>WELCOME MESSAGE:</strong> Will ALWAYS show your name if set</li>
              <li>• <strong>AUTO DETECT:</strong> Automatically detects name from registration data</li>
              <li>• <strong>MULTIPLE STORAGE:</strong> Saves name in multiple localStorage locations</li>
            </ul>
          </div>

          {/* Debug Info */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>User Data:</strong> {JSON.stringify(user, null, 2)}</p>
              <p><strong>Welcome Message:</strong> {getUnsolvableWelcomeMessage(user)}</p>
              <p><strong>LocalStorage UserData:</strong> {typeof window !== 'undefined' ? localStorage.getItem('userData') : 'Server side'}</p>
              <p><strong>LocalStorage AccessToken:</strong> {typeof window !== 'undefined' ? localStorage.getItem('accessToken') : 'Server side'}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">All Possible User Names:</h4>
              <div className="space-y-1 text-xs">
                {allNames.map((name, index) => (
                  <p key={index} className="text-gray-600">{name}</p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}















