'use client'

import { ReactNode } from 'react'
import { ComprehensiveSidebar } from '@/components/layouts/comprehensive-sidebar'
import CleanHeader from '@/components/layouts/clean-header'
import { Breadcrumb } from '@/components/layouts/breadcrumb'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Mobile Optimized */}
      <ComprehensiveSidebar />
      
      {/* Main Content - Mobile Optimized */}
      <div className="lg:pl-80">
        {/* Clean Header - Only Essential Elements */}
        <CleanHeader />
        
        {/* Breadcrumb - Mobile Optimized */}
        <Breadcrumb />
        
        {/* Page Content - Mobile Optimized */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
