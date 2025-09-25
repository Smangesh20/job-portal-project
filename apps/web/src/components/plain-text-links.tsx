'use client'

import React from 'react'

interface PlainTextLinksProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  className?: string
}

export function PlainTextLinks({ 
  options, 
  selectedValues, 
  onToggle, 
  label,
  className = ""
}: PlainTextLinksProps) {
  
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option)
          return (
            <span
              key={option}
              onClick={() => onToggle(option)}
              style={{
                padding: '4px 8px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#2563eb' : 'transparent',
                color: isSelected ? '#ffffff' : '#374151',
                borderRadius: '4px',
                border: isSelected ? '1px solid #2563eb' : '1px solid #d1d5db',
                display: 'inline-block'
              }}
            >
              {option}
            </span>
          )
        })}
      </div>
    </div>
  )
}










