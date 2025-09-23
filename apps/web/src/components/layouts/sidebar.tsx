'use client'

import { useState } from 'react'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { EnterpriseNavigation } from '@/components/professional/enterprise-navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

// PROFESSIONAL ENTERPRISE SIDEBAR - GOOGLE-STYLE IMPLEMENTATION
export function Sidebar() {
  const { user } = useAuthUnified()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0">
      <EnterpriseNavigation 
        user={user}
        variant="sidebar"
        className="h-full"
      />
      
      {/* Professional Logout Section */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
          onClick={() => {
            // Handle logout
            console.log('🏢 Professional logout initiated')
            // Add your logout logic here
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  )
}