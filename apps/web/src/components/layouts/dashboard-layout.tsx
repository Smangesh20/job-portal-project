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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mobile-min-h-screen">
      {/* Sidebar - Mobile Optimized */}
      <Sidebar />
      
      {/* Main Content - Mobile Optimized */}
      <div className="lg:pl-64 mobile-pl-0">
        {/* Header - Mobile Optimized */}
        <Header />
        
        {/* Breadcrumb - Mobile Optimized */}
        <Breadcrumb />
        
        {/* Page Content - Mobile Optimized */}
        <main className="mobile-px mobile-py mobile-container-xl">
          {children}
        </main>
      </div>
    </div>
  )
}
