'use client'

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function TestDropdown() {
  const [selectedValue, setSelectedValue] = useState('')

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Test Dropdown</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Select an option:</label>
        <Select value={selectedValue} onValueChange={setSelectedValue}>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Selected value:</label>
        <p className="text-sm text-gray-600">{selectedValue || 'None selected'}</p>
      </div>

      <Button onClick={() => setSelectedValue('')}>
        Clear Selection
      </Button>
    </div>
  )
}
