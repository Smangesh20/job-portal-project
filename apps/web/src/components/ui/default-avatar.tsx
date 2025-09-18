'use client'

import React from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

interface DefaultAvatarProps {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  name = 'User', 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-blue-500 to-indigo-600 
        flex items-center justify-center 
        text-white font-semibold
        ${className}
      `}
    >
      {initials || <UserIcon className={iconSizes[size]} />}
    </div>
  )
}
