'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ResetPasswordDirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No reset token provided')
      return
    }
    
    // Validate token with API
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/validate-token?token=${token}`)
        const data = await response.json()
        
        if (data.success) {
          setIsValidToken(true)
        } else {
          setError(data.error?.message || 'Invalid or expired reset token')
        }
      } catch (error) {
        console.error('Token validation error:', error)
        setError('Failed to validate reset token')
      }
    }
    
    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 GOOGLE-STYLE: Reset password form submitted')
    console.log('🔐 GOOGLE-STYLE: Form data:', { password: password.length, confirmPassword: confirmPassword.length, token: !!token })
    
    // Google-style: Clear previous errors first
    setError('')
    setMessage('')
    
    if (password !== confirmPassword) {
      console.log('🔐 GOOGLE-STYLE: Password mismatch error')
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      console.log('🔐 GOOGLE-STYLE: Password too short error')
      setError('Password must be at least 8 characters long')
      return
    }

    if (!token) {
      console.log('🔐 GOOGLE-STYLE: No token error')
      setError('No reset token provided')
      return
    }

    console.log('🔐 GOOGLE-STYLE: All validations passed, calling API')
    setIsLoading(true)

    try {
      // Call the real reset password API
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password: password.trim()
        }),
      })

      console.log('🔐 GOOGLE-STYLE: API response status:', response.status)
      const data = await response.json()
      console.log('🔐 GOOGLE-STYLE: API response data:', data)

      if (data.success) {
        console.log('🔐 GOOGLE-STYLE: Password reset successful')
        setMessage('Password reset successfully! You can now login with your new password.')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        console.log('🔐 GOOGLE-STYLE: API returned error:', data.error)
        setError(data.error?.message || 'Failed to reset password. Please try again.')
      }
    } catch (error: any) {
      console.error('🔐 GOOGLE-STYLE: Reset password error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={() => router.push('/auth/forgot-password')} className="w-full">
                  Request New Reset Link
                </Button>
                <Button variant="outline" onClick={() => router.push('/auth/login')} className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your new password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Confirm your new password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !password || !confirmPassword || !token}
                onClick={() => {
                  console.log('🔐 GOOGLE-STYLE: Reset password button clicked')
                  console.log('🔐 GOOGLE-STYLE: Button state:', { isLoading, password: !!password, confirmPassword: !!confirmPassword, token: !!token })
                }}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
