'use client'

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function TestSimpleDropdown() {
  const [value, setValue] = useState('')

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Simple Dropdown Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Dropdown:</label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-sm">
            <strong>Selected value:</strong> {value || 'None selected'}
          </p>
        </div>
      </div>
    </div>
  )
}
