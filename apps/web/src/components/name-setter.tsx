'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Edit3, Check, X } from 'lucide-react'

interface NameSetterProps {
  currentName?: string
  onNameSet?: (name: string) => void
  className?: string
}

export function NameSetter({ currentName, onNameSet, className = "" }: NameSetterProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(currentName || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    
    setIsLoading(true)
    try {
      // Save to localStorage
      const userData = localStorage.getItem('userData')
      let user: any = {}
      
      if (userData) {
        try {
          user = JSON.parse(userData)
        } catch (e) {
          console.log('Error parsing userData, creating new user object')
        }
      }
      
      // Set the name in multiple fields for maximum compatibility
      user.firstName = name.trim()
      user.lastName = name.trim()
      user.name = name.trim()
      
      // Save back to localStorage
      localStorage.setItem('userData', JSON.stringify(user))
      console.log('Name saved to localStorage:', user)
      
      // Call the callback if provided
      if (onNameSet) {
        onNameSet(name.trim())
      }
      
      setIsEditing(false)
      
      // Show success message
      alert(`Name set successfully! Welcome, ${name.trim()}!`)
      
    } catch (error) {
      console.error('Error saving name:', error)
      alert('Error saving name. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(currentName || '')
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <Card className={`border-blue-200 bg-blue-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personalize Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {currentName ? `Current name: ${currentName}` : 'No name set yet'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Set your name to see personalized welcome messages
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {currentName ? 'Edit' : 'Set Name'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSave()
                  } else if (e.key === 'Escape') {
                    handleCancel()
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!name.trim() || isLoading}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}