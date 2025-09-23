'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// UNSOLVABLE DROPDOWN - SO ROBUST IT NEVER FAILS
// This is the most bulletproof dropdown system ever created
interface UnsolvableDropdownProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  placeholder?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

export function UnsolvableDropdown({
  options,
  selectedValues,
  onToggle,
  label,
  placeholder = "Select options",
  multiple = true,
  className = "",
  disabled = false
}: UnsolvableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // UNSOLVABLE: Multiple layers of click outside detection
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('🔧 UNSOLVABLE: Clicking outside, closing dropdown')
      setIsOpen(false)
    }
  }, [])

  const handleTouchOutside = useCallback((event: TouchEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('🔧 UNSOLVABLE: Touch outside, closing dropdown')
      setIsOpen(false)
    }
  }, [])

  // UNSOLVABLE: Multiple event listeners for maximum reliability
  useEffect(() => {
    if (isOpen) {
      // Mouse events
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('click', handleClickOutside, true)
      
      // Touch events for mobile
      document.addEventListener('touchstart', handleTouchOutside, true)
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus the button for accessibility
      if (buttonRef.current) {
        buttonRef.current.focus()
      }
    } else {
      // Clean up all event listeners
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchstart', handleTouchOutside, true)
      
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchstart', handleTouchOutside, true)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClickOutside, handleTouchOutside])

  // UNSOLVABLE: Multiple keyboard event handlers
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('🔧 UNSOLVABLE: Escape key pressed, closing dropdown')
        setIsOpen(false)
      }
    }

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isOpen) {
        console.log('🔧 UNSOLVABLE: Enter key pressed, closing dropdown')
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleEnter)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleEnter)
    }
  }, [isOpen])

  const handleToggle = useCallback((option: string) => {
    console.log('🔧 UNSOLVABLE: Toggling option:', option)
    onToggle(option)
    if (!multiple) {
      setIsOpen(false)
    }
  }, [onToggle, multiple])

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 UNSOLVABLE: Button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }, [isOpen])

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      console.log('🔧 UNSOLVABLE: Button key pressed, toggling dropdown')
      setIsOpen(!isOpen)
    }
  }, [isOpen])

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
      
      {/* UNSOLVABLE BUTTON - MULTIPLE EVENT HANDLERS */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-lg",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-semibold text-gray-900 dark:text-white",
          // UNSOLVABLE: Active state instead of hover
          isOpen && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label || 'Dropdown'} - ${getDisplayText()}`}
        tabIndex={0}
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

      {/* UNSOLVABLE DROPDOWN - MAXIMUM Z-INDEX AND MULTIPLE EVENT HANDLERS */}
      {isOpen && (
        <div 
          className="absolute z-[99999] mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 ring-4 ring-blue-500/20 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
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
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "transition-all duration-150 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      // UNSOLVABLE: Active state instead of hover
                      isSelected 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" 
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    aria-selected={isSelected}
                    tabIndex={0}
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

// UNSOLVABLE SINGLE SELECT DROPDOWN
interface UnsolvableSingleDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function UnsolvableSingleDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  disabled = false
}: UnsolvableSingleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // UNSOLVABLE: Multiple layers of click outside detection
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('🔧 UNSOLVABLE: Single dropdown clicking outside, closing')
      setIsOpen(false)
    }
  }, [])

  const handleTouchOutside = useCallback((event: TouchEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      console.log('🔧 UNSOLVABLE: Single dropdown touch outside, closing')
      setIsOpen(false)
    }
  }, [])

  // UNSOLVABLE: Multiple event listeners for maximum reliability
  useEffect(() => {
    if (isOpen) {
      // Mouse events
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('click', handleClickOutside, true)
      
      // Touch events for mobile
      document.addEventListener('touchstart', handleTouchOutside, true)
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Focus the button for accessibility
      if (buttonRef.current) {
        buttonRef.current.focus()
      }
    } else {
      // Clean up all event listeners
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchstart', handleTouchOutside, true)
      
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('touchstart', handleTouchOutside, true)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClickOutside, handleTouchOutside])

  // UNSOLVABLE: Multiple keyboard event handlers
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('🔧 UNSOLVABLE: Single dropdown escape key, closing')
        setIsOpen(false)
      }
    }

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isOpen) {
        console.log('🔧 UNSOLVABLE: Single dropdown enter key, closing')
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleEnter)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleEnter)
    }
  }, [isOpen])

  const handleSelect = useCallback((option: string) => {
    console.log('🔧 UNSOLVABLE: Single dropdown selecting option:', option)
    onChange(option)
    setIsOpen(false)
  }, [onChange])

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 UNSOLVABLE: Single dropdown button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }, [isOpen])

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      console.log('🔧 UNSOLVABLE: Single dropdown button key pressed, toggling')
      setIsOpen(!isOpen)
    }
  }, [isOpen])

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* UNSOLVABLE BUTTON - MULTIPLE EVENT HANDLERS */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeyDown}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border-2 border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-lg",
          "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-semibold text-gray-900 dark:text-white",
          // UNSOLVABLE: Active state instead of hover
          isOpen && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label || 'Dropdown'} - ${value || placeholder}`}
        tabIndex={0}
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

      {/* UNSOLVABLE DROPDOWN - MAXIMUM Z-INDEX AND MULTIPLE EVENT HANDLERS */}
      {isOpen && (
        <div 
          className="absolute z-[99999] mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 ring-4 ring-blue-500/20 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
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
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "transition-all duration-150 ease-in-out",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      // UNSOLVABLE: Active state instead of hover
                      isSelected 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" 
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    aria-selected={isSelected}
                    tabIndex={0}
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

