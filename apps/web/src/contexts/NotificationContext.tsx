'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  unread: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isNotificationsOpen: boolean
  setIsNotificationsOpen: (open: boolean) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Welcome to AskYaCham!', message: 'Discover your next career opportunity', time: '2m ago', unread: true },
    { id: 2, title: 'New job opportunities', message: '700+ jobs from 23 countries available', time: '1h ago', unread: true },
    { id: 3, title: 'Sign up for updates', message: 'Get personalized job recommendations', time: '3h ago', unread: false },
    { id: 4, title: 'Indian companies hiring', message: 'TCS, Infosys, Wipro and more', time: '1d ago', unread: false },
    { id: 5, title: 'Global opportunities', message: 'Jobs from Google, Microsoft, Apple', time: '2d ago', unread: false },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Add new notifications periodically (Google-style)
  useEffect(() => {
    console.log('🔔 GOOGLE-STYLE: Notifications effect running')
    
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        title: 'New job opportunities',
        message: `${Math.floor(Math.random() * 10) + 1} new jobs match your profile`,
        time: 'Just now',
        unread: true
      }
      
      console.log('🔔 GOOGLE-STYLE: Adding new notification:', newNotification)
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
    }, 30000) // Add notification every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: number) => {
    console.log('🔔 GOOGLE-STYLE: Marking notification as read:', id)
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    console.log('🔔 GOOGLE-STYLE: Marking all notifications as read')
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    )
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      isOpen,
      setIsOpen,
      isNotificationsOpen,
      setIsNotificationsOpen,
      markAsRead,
      markAllAsRead,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
