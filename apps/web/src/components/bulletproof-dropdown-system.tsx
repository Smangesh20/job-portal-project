'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// BULLETPROOF DROPDOWN - NO CSS HOVER, ONLY JAVASCRIPT CLICKS
interface BulletproofDropdownProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  placeholder?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

export function BulletproofDropdown({
  options,
  selectedValues,
  onToggle,
  label,
  placeholder = "Select options",
  multiple = true,
  className = "",
  disabled = false
}: BulletproofDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // BULLETPROOF: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Use capture phase to ensure we catch the event first
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  // BULLETPROOF: Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // BULLETPROOF: Prevent body scroll when dropdown is open
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
    console.log('🔧 BULLETPROOF: Toggling option:', option)
    onToggle(option)
    if (!multiple) {
      setIsOpen(false)
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 BULLETPROOF: Button clicked, current state:', isOpen)
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
      
      {/* BULLETPROOF BUTTON - NO HOVER, ONLY CLICK */}
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
          // BULLETPROOF: Active state instead of hover
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

      {/* BULLETPROOF DROPDOWN - NO HOVER, ONLY CLICK */}
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
                      // BULLETPROOF: Active state instead of hover
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

// BULLETPROOF SINGLE SELECT DROPDOWN
interface BulletproofSingleDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function BulletproofSingleDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  disabled = false
}: BulletproofSingleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // BULLETPROOF: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  // BULLETPROOF: Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSelect = (option: string) => {
    console.log('🔧 BULLETPROOF: Selecting option:', option)
    onChange(option)
    setIsOpen(false)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 BULLETPROOF: Single dropdown button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* BULLETPROOF BUTTON - NO HOVER, ONLY CLICK */}
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
          // BULLETPROOF: Active state instead of hover
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

      {/* BULLETPROOF DROPDOWN - NO HOVER, ONLY CLICK */}
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
                      // BULLETPROOF: Active state instead of hover
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

// BULLETPROOF NAVIGATION DROPDOWN
interface BulletproofNavDropdownProps {
  label: string
  options: Array<{
    name: string
    href: string
    icon?: React.ComponentType<any>
    badge?: string
  }>
  className?: string
}

export function BulletproofNavDropdown({
  label,
  options,
  className = ""
}: BulletproofNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // BULLETPROOF: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [])

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔧 BULLETPROOF: Nav dropdown button clicked, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* BULLETPROOF NAV BUTTON - NO HOVER, ONLY CLICK */}
      <button
        type="button"
        onClick={handleButtonClick}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg",
          "transition-all duration-200 ease-in-out",
          "text-gray-700 dark:text-gray-300",
          // BULLETPROOF: Active state instead of hover
          isOpen 
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
            : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{label}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* BULLETPROOF NAV DROPDOWN - NO HOVER, ONLY CLICK */}
      {isOpen && (
        <div className="absolute z-[9999] mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option) => {
              const IconComponent = option.icon
              return (
                <a
                  key={option.name}
                  href={option.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300",
                    "transition-all duration-150 ease-in-out",
                    "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {IconComponent && (
                    <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="flex-1">{option.name}</span>
                  {option.badge && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {option.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
















