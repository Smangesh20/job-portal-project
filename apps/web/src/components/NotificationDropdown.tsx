'use client'

import React, { useRef, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/contexts/NotificationContext'

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className = '' }: NotificationDropdownProps) {
  const { notifications, isOpen, setIsOpen, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [setIsOpen])

  return (
    <div className={`relative ${className}`} ref={notificationRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors"
        data-testid="notification-button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('🔔 GOOGLE-STYLE: Notification button clicked, current state:', isOpen)
          setIsOpen(!isOpen)
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </Button>
      
      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="notification-dropdown absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500">{unreadCount} unread</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    notification.unread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-600 hover:text-gray-700 mb-2"
                onClick={() => {
                  markAllAsRead()
                }}
              >
                Mark all as read
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-700">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
