'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for access token in localStorage (matching login page)
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
          // In a real app, you would decode the JWT token to get user info
          // For now, we'll simulate a user object
          setUser({
            id: '1',
            email: 'user@example.com',
            name: 'John Doe'
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store tokens in localStorage (matching login page)
        if (data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken)
        }
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken)
        }
        
        setUser({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.firstName + ' ' + data.data.user.lastName
        })
        
        return { success: true }
      } else {
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }
}
