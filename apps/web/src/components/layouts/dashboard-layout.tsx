'use client'

import { ReactNode } from 'react'
import { CleanSidebar } from '@/components/layouts/clean-sidebar'
import MinimalHeader from '@/components/layouts/minimal-header'
import { Breadcrumb } from '@/components/layouts/breadcrumb'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Google Style Layout */}
      <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
        <CleanSidebar />
      </div>
      
      {/* Main Content Area - Google Style */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - Google Style */}
        <MinimalHeader />
        
        {/* Breadcrumb - Google Style */}
        <Breadcrumb />
        
        {/* Page Content - Google Style */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
