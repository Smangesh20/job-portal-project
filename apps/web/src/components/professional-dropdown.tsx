'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfessionalDropdownProps {
  options: string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  label?: string
  placeholder?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

export function ProfessionalDropdown({
  options,
  selectedValues,
  onToggle,
  label,
  placeholder = "Select options",
  multiple = true,
  className = "",
  disabled = false
}: ProfessionalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleToggle = (option: string) => {
    onToggle(option)
    if (!multiple) {
      setIsOpen(false)
    }
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
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-sm",
          "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "hover:border-gray-400 dark:hover:border-gray-500 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-medium text-gray-900 dark:text-white"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="block truncate">
          {getDisplayText()}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    onClick={() => handleToggle(option)}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                      "focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <span className={cn(
                      "block truncate text-sm",
                      isSelected 
                        ? "font-medium text-blue-900 dark:text-blue-100" 
                        : "font-normal text-gray-900 dark:text-gray-100"
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

// Single Select Version
interface ProfessionalSingleDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ProfessionalSingleDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  disabled = false
}: ProfessionalSingleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
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
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left shadow-sm",
          "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "hover:border-gray-400 dark:hover:border-gray-500 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "text-sm font-medium text-gray-900 dark:text-white"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="block truncate">
          {value || placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left",
                      "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                      "focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <span className={cn(
                      "block truncate text-sm",
                      isSelected 
                        ? "font-medium text-blue-900 dark:text-blue-100" 
                        : "font-normal text-gray-900 dark:text-gray-100"
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