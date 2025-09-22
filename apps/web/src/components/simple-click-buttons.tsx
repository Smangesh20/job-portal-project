'use client'

import React from 'react'

interface SimpleClickButtonsProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  className?: string
}

export function SimpleClickButtons({ 
  options, 
  selectedValues, 
  onToggle, 
  label,
  className = ""
}: SimpleClickButtonsProps) {
  
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
                px-4 py-2 text-sm font-medium rounded-md border-2 transition-colors duration-150
                ${isSelected 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
                active:scale-95
              `}
              style={{
                // Remove all hover effects
                ':hover': 'none'
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
