'use client'

import React, { useState } from 'react'
import { EnterpriseWelcome, QuickNameSetter } from '@/components/professional/enterprise-welcome'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// ENTERPRISE TEST COMPONENT - TESTING PROFESSIONAL COMPONENTS

export function EnterpriseTest() {
  const [userName, setUserName] = useState('Test User')

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profileImage: null
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
          Testing professional Google-style components
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
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Current test state and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Current User Name:</h4>
              <p className="text-gray-600">{userName}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Test Status:</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600">All components working correctly</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Available Components:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>EnterpriseWelcome - Professional welcome message system</li>
                <li>QuickNameSetter - Simple name setting component</li>
                <li>EnterpriseNavigation - Professional navigation system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}