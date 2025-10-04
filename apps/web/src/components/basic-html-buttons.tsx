'use client'

import React from 'react'

interface BasicHtmlButtonsProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  className?: string
}

export function BasicHtmlButtons({ 
  options, 
  selectedValues, 
  onToggle, 
  label,
  className = ""
}: BasicHtmlButtonsProps) {
  
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
              type="button"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                border: '2px solid',
                backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                color: isSelected ? '#ffffff' : '#374151',
                borderColor: isSelected ? '#2563eb' : '#d1d5db',
                cursor: 'pointer',
                outline: 'none',
                transition: 'none'
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





















