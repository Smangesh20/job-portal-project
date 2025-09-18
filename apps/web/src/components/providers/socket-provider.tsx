'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-provider'
import { toast } from 'react-hot-toast'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  emit: (event: string, data: any) => void
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback?: (...args: any[]) => void) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect socket if user is not authenticated
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Skip WebSocket connection in production to prevent 404 errors
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_WS_URL?.includes('onrender.com')) {
      return
    }

    // Initialize socket connection only in development
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      auth: {
        token: localStorage.getItem('accessToken')
      },
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: false,
      timeout: 5000
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      // Socket connection error
      setIsConnected(false)
    })

    // Only attempt connection in development
    if (process.env.NODE_ENV === 'development') {
      newSocket.connect()
    }

    // Handle real-time notifications
    newSocket.on('notification', (notification) => {
      toast.success(notification.message, {
        duration: 5000,
        position: 'top-right'
      })
    })

    // Handle job match notifications
    newSocket.on('job_match', (match) => {
      toast.success(`New job match: ${match.jobTitle}`, {
        duration: 8000,
        position: 'top-right'
      })
    })

    // Handle application status updates
    newSocket.on('application_update', (update) => {
      toast(`Application update: ${update.status}`, {
        duration: 6000,
        position: 'top-right'
      })
    })

    // Handle interview invitations
    newSocket.on('interview_invitation', (invitation) => {
      toast.success(`Interview invitation: ${invitation.jobTitle}`, {
        duration: 10000,
        position: 'top-right'
      })
    })

    // Handle message notifications
    newSocket.on('message_received', (message) => {
      toast(`New message from ${message.senderName}`, {
        duration: 5000,
        position: 'top-right'
      })
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAuthenticated, user])

  const emit = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data)
    } else {
      }
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket) {
      socket.on(event, callback)
    }
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback)
      } else {
        socket.off(event)
      }
    }
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    emit,
    on,
    off
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
