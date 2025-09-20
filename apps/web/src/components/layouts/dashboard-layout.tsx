'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/layouts/sidebar'
import Header from '@/components/layouts/header'
import { Breadcrumb } from '@/components/layouts/breadcrumb'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Sidebar - Mobile Optimized */}
      <Sidebar />
      
      {/* Main Content - Mobile Optimized */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Header - Mobile Optimized */}
        <Header />
        
        {/* Breadcrumb - Mobile Optimized */}
        <Breadcrumb />
        
        {/* Page Content - Mobile Optimized */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
