'use client'

import React from 'react'

interface UltraSimpleLinksProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
}

export function UltraSimpleLinks({ 
  options, 
  selectedValues, 
  onToggle, 
  label
}: UltraSimpleLinksProps) {
  
  return (
    <div>
      {label && (
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option)
          return (
            <span
              key={option}
              onClick={() => onToggle(option)}
              style={{
                padding: '2px 6px',
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#000000' : '#ffffff',
                color: isSelected ? '#ffffff' : '#000000',
                border: '1px solid #000000',
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










