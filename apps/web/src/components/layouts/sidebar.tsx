'use client'

import { useState } from 'react'
import { useAuthUnified } from '@/hooks/useAuthUnified'
import { EnterpriseNavigation } from '@/components/professional/enterprise-navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// PROFESSIONAL ENTERPRISE SIDEBAR - GOOGLE-STYLE IMPLEMENTATION
export function Sidebar() {
  const { user, logout } = useAuthUnified()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      console.log('🏢 Professional logout initiated')
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}