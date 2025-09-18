'use client'

import { ReactNode } from 'react'
import { Header } from '@/components/layouts/header'
import { Breadcrumb } from '@/components/layouts/breadcrumb'

interface JobsLayoutProps {
  children: ReactNode
}

export function JobsLayout({ children }: JobsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />
      
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
