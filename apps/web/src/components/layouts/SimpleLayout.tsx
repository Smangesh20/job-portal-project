'use client'

import { ReactNode } from 'react'
import { SimpleNav } from '@/components/navigation/SimpleNav'
import MinimalHeader from '@/components/layouts/minimal-header'

interface SimpleLayoutProps {
  children: ReactNode
}

// GOOGLE'S APPROACH - SIMPLE LAYOUT, NEVER FAILS
export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <SimpleNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <MinimalHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}













