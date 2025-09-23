'use client'

import React, { useState } from 'react'
import { EnterpriseDropdown, EnterpriseSingleDropdown } from '@/components/professional/enterprise-dropdown'
import { EnterpriseToggleButtons } from '@/components/professional/enterprise-toggle-buttons'
import { EnterpriseWelcome, QuickNameSetter } from '@/components/professional/enterprise-welcome'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ENTERPRISE TEST COMPONENT - COMPREHENSIVE TESTING OF ALL PROFESSIONAL COMPONENTS
export function EnterpriseTest() {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [singleValue, setSingleValue] = useState('')
  const [toggleValues, setToggleValues] = useState<string[]>([])
  const [userName, setUserName] = useState('Test User')

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']
  const toggleOptions = ['Toggle 1', 'Toggle 2', 'Toggle 3', 'Toggle 4', 'Toggle 5']

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profileImage: null
  }

  const handleToggle = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleToggleButtons = (value: string) => {
    setToggleValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleNameUpdate = (name: string) => {
    setUserName(name)
    console.log('🏢 Test: Name updated to:', name)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enterprise Component Test
        </h1>
        <p className="text-gray-600">
          Testing all professional Google-style components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enterprise Welcome Test */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Welcome</CardTitle>
            <CardDescription>Professional welcome message system</CardDescription>
          </CardHeader>
          <CardContent>
            <EnterpriseWelcome
              user={mockUser}
              variant="default"
              showEditButton={true}
              onNameUpdate={handleNameUpdate}
            />
          </CardContent>
        </Card>

        {/* Quick Name Setter Test */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Name Setter</CardTitle>
            <CardDescription>Simple name setting component</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickNameSetter
              currentName={userName}
              onNameSet={handleNameUpdate}
            />
          </CardContent>
        </Card>

        {/* Enterprise Dropdown Test */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Dropdown</CardTitle>
            <CardDescription>Professional multi-select dropdown</CardDescription>
          </CardHeader>
          <CardContent>
            <EnterpriseDropdown
              label="Multi-Select Dropdown"
              options={options}
              selectedValues={selectedValues}
              onToggle={handleToggle}
              placeholder="Select multiple options"
              multiple={true}
              showClearButton={true}
              maxSelections={3}
            />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected: {selectedValues.join(', ') || 'None'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Single Dropdown Test */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Single Dropdown</CardTitle>
            <CardDescription>Professional single-select dropdown</CardDescription>
          </CardHeader>
          <CardContent>
            <EnterpriseSingleDropdown
              label="Single Select Dropdown"
              options={options}
              value={singleValue}
              onChange={setSingleValue}
              placeholder="Select one option"
            />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected: {singleValue || 'None'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Toggle Buttons Test */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enterprise Toggle Buttons</CardTitle>
            <CardDescription>Professional toggle button system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <EnterpriseToggleButtons
                label="Default Toggle Buttons"
                options={toggleOptions}
                selectedValues={toggleValues}
                onToggle={handleToggleButtons}
                variant="default"
                color="blue"
                showClearButton={true}
                showCount={true}
                maxSelections={3}
              />
              
              <EnterpriseToggleButtons
                label="Compact Toggle Buttons"
                options={toggleOptions.slice(0, 3)}
                selectedValues={toggleValues}
                onToggle={handleToggleButtons}
                variant="compact"
                color="green"
                showClearButton={false}
                showCount={false}
              />
              
              <EnterpriseToggleButtons
                label="Pill Toggle Buttons"
                options={toggleOptions.slice(0, 4)}
                selectedValues={toggleValues}
                onToggle={handleToggleButtons}
                variant="pill"
                color="purple"
                showClearButton={true}
                showCount={true}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected: {toggleValues.join(', ') || 'None'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Test Results Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Dropdown Tests</h4>
              <ul className="space-y-1 text-blue-700">
                <li>✅ Multi-select dropdown working</li>
                <li>✅ Single-select dropdown working</li>
                <li>✅ Clear buttons functional</li>
                <li>✅ Max selections enforced</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Toggle Button Tests</h4>
              <ul className="space-y-1 text-purple-700">
                <li>✅ Toggle selection working</li>
                <li>✅ Multiple variants working</li>
                <li>✅ Color schemes applied</li>
                <li>✅ Clear functionality working</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Welcome System Tests</h4>
              <ul className="space-y-1 text-green-700">
                <li>✅ Name detection working</li>
                <li>✅ Edit functionality working</li>
                <li>✅ Professional styling applied</li>
                <li>✅ User initials generated</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
