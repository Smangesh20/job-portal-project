'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

interface ToggleFilterButtonsProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  className?: string
}

export function ToggleFilterButtons({ 
  options, 
  selectedValues, 
  onToggle, 
  label,
  className = ""
}: ToggleFilterButtonsProps) {
  
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option)
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}










