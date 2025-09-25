'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Google,
  Microsoft,
  Apple,
  Github,
  Linkedin,
  Clock,
  RefreshCw
} from 'lucide-react'

interface AuthFormProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function GoogleLikeAuthForm({ onSuccess, onError }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'social'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [requiresMfa, setRequiresMfa] = useState(false)
  const [mfaCode, setMfaCode] = useState('')

  // Google-like animations and transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  }

  // OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleSendOtp = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/google-like/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: authMode === 'register' ? 'REGISTER' : 'LOGIN'
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setOtpTimer(600) // 10 minutes
        setSuccess('OTP sent to your email address')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode || !email) {
      setError('OTP code is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/google-like/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token: otpCode,
          type: authMode === 'register' ? 'REGISTER' : 'LOGIN'
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Authentication successful!')
        if (onSuccess) {
          onSuccess(data.data)
        }
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/google-like/enhanced-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        if (data.data.requiresMfa) {
          setRequiresMfa(true)
          setSuccess('Please enter your MFA code')
        } else {
          setSuccess('Login successful!')
          if (onSuccess) {
            onSuccess(data.data)
          }
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMfaVerification = async () => {
    if (!mfaCode) {
      setError('MFA code is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // This would complete the MFA verification
      setSuccess('MFA verification successful!')
      if (onSuccess) {
        onSuccess({ /* user data */ })
      }
    } catch (err) {
      setError('MFA verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: string) => {
    setLoading(true)
    setError('')

    try {
      // This would redirect to social provider or handle the auth flow
      console.log(`Social auth with ${provider}`)
    } catch (err) {
      setError(`Social authentication with ${provider} failed`)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordRecovery = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/google-like/password-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Password reset instructions sent to your email')
      } else {
        setError(data.error || 'Password recovery failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setOtpCode('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setOtpSent(false)
    setOtpTimer(0)
    setRequiresMfa(false)
    setMfaCode('')
  }

  const switchAuthMode = (mode: 'login' | 'register' | 'forgot') => {
    setAuthMode(mode)
    resetForm()
  }

  const switchAuthMethod = (method: 'password' | 'otp' | 'social') => {
    setAuthMethod(method)
    resetForm()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {authMode === 'login' && 'Welcome back'}
              {authMode === 'register' && 'Create your account'}
              {authMode === 'forgot' && 'Reset your password'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {authMode === 'login' && 'Sign in to your account'}
              {authMode === 'register' && 'Get started with your new account'}
              {authMode === 'forgot' && 'Enter your email to reset password'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MFA Verification */}
          {requiresMfa ? (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                <p className="text-gray-600 text-sm">Enter the code from your authenticator app</p>
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <Button
                onClick={handleMfaVerification}
                disabled={loading || !mfaCode}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRequiresMfa(false)}
                className="w-full text-gray-500"
              >
                Back to login
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Auth Method Tabs */}
              <motion.div variants={itemVariants} className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => switchAuthMethod('password')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    authMethod === 'password'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => switchAuthMethod('otp')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    authMethod === 'otp'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email Code
                </button>
                <button
                  onClick={() => switchAuthMethod('social')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    authMethod === 'social'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Social
                </button>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Password Input (for password method) */}
              {authMethod === 'password' && authMode !== 'forgot' && (
                <motion.div variants={itemVariants}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* OTP Input */}
              {authMethod === 'otp' && otpSent && (
                <motion.div variants={itemVariants}>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      disabled={loading}
                    />
                    {otpTimer > 0 && (
                      <div className="text-center text-sm text-gray-500">
                        Resend code in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Social Login Buttons */}
              {authMethod === 'social' && (
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('google')}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <Google className="h-4 w-4" />
                      <span>Google</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialAuth('microsoft')}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <Microsoft className="h-4 w-4" />
                      <span>Microsoft</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialAuth('apple')}
                      disabled={loading}
                    >
                      <Apple className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialAuth('github')}
                      disabled={loading}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialAuth('linkedin')}
                      disabled={loading}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-3">
                {authMethod === 'password' && authMode === 'login' && (
                  <Button
                    onClick={handlePasswordLogin}
                    disabled={loading || !email || !password}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                  </Button>
                )}

                {authMethod === 'otp' && !otpSent && (
                  <Button
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
                  </Button>
                )}

                {authMethod === 'otp' && otpSent && (
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || !otpCode}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Code'}
                  </Button>
                )}

                {authMode === 'forgot' && (
                  <Button
                    onClick={handlePasswordRecovery}
                    disabled={loading || !email}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                  </Button>
                )}

                {/* Resend OTP */}
                {authMethod === 'otp' && otpSent && otpTimer === 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full text-blue-600"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </Button>
                )}
              </motion.div>

              {/* Mode Switcher */}
              <motion.div variants={itemVariants} className="text-center space-y-2">
                <div className="text-sm text-gray-600">
                  {authMode === 'login' && "Don't have an account? "}
                  {authMode === 'register' && 'Already have an account? '}
                  {authMode === 'forgot' && 'Remember your password? '}
                  <button
                    onClick={() => {
                      if (authMode === 'login') switchAuthMode('register')
                      else if (authMode === 'register') switchAuthMode('login')
                      else switchAuthMode('login')
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {authMode === 'login' && 'Sign up'}
                    {authMode === 'register' && 'Sign in'}
                    {authMode === 'forgot' && 'Sign in'}
                  </button>
                </div>

                {authMode === 'login' && (
                  <button
                    onClick={() => switchAuthMode('forgot')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Forgot your password?
                  </button>
                )}
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
