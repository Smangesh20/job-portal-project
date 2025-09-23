'use client'

import { EnterpriseBreadcrumb } from '@/components/professional/enterprise-navigation'

// PROFESSIONAL ENTERPRISE BREADCRUMB - GOOGLE-STYLE IMPLEMENTATION
export function Breadcrumb() {
  return (
    <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <EnterpriseBreadcrumb />
    </div>
  )
}