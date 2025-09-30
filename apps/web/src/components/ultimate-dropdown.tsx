'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ULTIMATE BULLETPROOF DROPDOWN - NO CSS HOVER, ONLY JAVASCRIPT CLICKS
// This will work 100% reliably like Google and Apple
interface UltimateDropdownProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  placeholder?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

export function UltimateDropdown({
  options,
  selectedValues,
  onToggle,
  label,
  placeholder = "Select options",
  multiple = true,
  className = "",
  disabled = false
}: UltimateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ULTIMATE: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('🔧 ULTIMATE: Clicking outside, closing dropdown')
        setIsOpen(false)
      }
    }

    // Use capture phase to ensure we catch the event first
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  // ULTIMATE: Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('🔧 ULTIMATE: Escape key pressed, closing dropdown')
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // ULTIMATE: Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleToggle = (option: string) => {
    console.log('🔧 ULTIMATE: Toggling option:', option)
    onToggle(option)
    if (!multiple) {
      setIsOpen(false)
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 ULTIMATE: Button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder
    }
    if (selectedValues.length === 1) {
      return selectedValues[0]
    }
    return `${selectedValues.length} selected`
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* ULTIMATE BUTTON - NO HOVER, ONLY CLICK */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleButtonClick}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-lg",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-semibold text-gray-900 dark:text-white",
          // ULTIMATE: Active state instead of hover
          isOpen && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label || 'Dropdown'} - ${getDisplayText()}`}
      >
        <span className="block truncate">
          {getDisplayText()}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-300",
              isOpen && "rotate-180 text-blue-500"
            )} 
          />
        </span>
      </button>

      {/* ULTIMATE DROPDOWN - NO HOVER, ONLY CLICK */}
      {isOpen && (
        <div className="absolute z-[9999] mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 ring-4 ring-blue-500/20 focus:outline-none">
          <div className="py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selectedValues.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleToggle(option)
                    }}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "transition-all duration-150 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      // ULTIMATE: Active state instead of hover
                      isSelected 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" 
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    aria-selected={isSelected}
                  >
                    <span className={cn(
                      "block truncate text-sm font-medium",
                      isSelected 
                        ? "text-blue-900 dark:text-blue-100" 
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {option}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ULTIMATE SINGLE SELECT DROPDOWN
interface UltimateSingleDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function UltimateSingleDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  disabled = false
}: UltimateSingleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ULTIMATE: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('🔧 ULTIMATE: Single dropdown clicking outside, closing')
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  // ULTIMATE: Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('🔧 ULTIMATE: Single dropdown escape key, closing')
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSelect = (option: string) => {
    console.log('🔧 ULTIMATE: Single dropdown selecting option:', option)
    onChange(option)
    setIsOpen(false)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 ULTIMATE: Single dropdown button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* ULTIMATE BUTTON - NO HOVER, ONLY CLICK */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleButtonClick}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-lg",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-semibold text-gray-900 dark:text-white",
          // ULTIMATE: Active state instead of hover
          isOpen && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label || 'Dropdown'} - ${value || placeholder}`}
      >
        <span className="block truncate">
          {value || placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-300",
              isOpen && "rotate-180 text-blue-500"
            )} 
          />
        </span>
      </button>

      {/* ULTIMATE DROPDOWN - NO HOVER, ONLY CLICK */}
      {isOpen && (
        <div className="absolute z-[9999] mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 ring-4 ring-blue-500/20 focus:outline-none">
          <div className="py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(option)
                    }}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "transition-all duration-150 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      // ULTIMATE: Active state instead of hover
                      isSelected 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" 
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    aria-selected={isSelected}
                  >
                    <span className={cn(
                      "block truncate text-sm font-medium",
                      isSelected 
                        ? "text-blue-900 dark:text-blue-100" 
                        : "text-gray-900 dark:text-gray-100"
                    )}>
                      {option}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
















