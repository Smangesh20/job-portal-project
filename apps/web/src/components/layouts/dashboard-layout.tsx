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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Mobile Optimized */}
      <CleanSidebar />
      
      {/* Main Content - Perfect Alignment with Fixed Header */}
      <div className="lg:pl-80">
        {/* Minimal Header - Perfect Alignment, Fixed Height */}
        <MinimalHeader />
        
        {/* Breadcrumb - Mobile Optimized */}
        <Breadcrumb />
        
        {/* Page Content - Mobile Optimized, Perfect Spacing */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
