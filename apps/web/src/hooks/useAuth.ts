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
        // Check for access token in cookies
        const accessToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1]

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
        // Set cookies (in a real app, this would be handled by the API)
        document.cookie = `accessToken=${data.token}; path=/; secure; samesite=strict`
        document.cookie = `refreshToken=${data.refreshToken}; path=/; secure; samesite=strict`
        
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name
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
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
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
