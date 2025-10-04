'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  ShieldCheckIcon,
  KeyIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

// 🚀 ENHANCED PASSWORD RECOVERY INTERFACES
interface RecoveryStep {
  id: 'email' | 'verify' | 'reset' | 'success'
  title: string
  description: string
}

interface RecoveryMethod {
  id: 'email' | 'sms' | 'security'
  title: string
  description: string
  icon: React.ReactNode
  available: boolean
}

// 🚀 ENHANCED PASSWORD RECOVERY COMPONENT
export const EnhancedPasswordRecovery: React.FC = () => {
  // 🚀 STATE MANAGEMENT
  const [currentStep, setCurrentStep] = useState<RecoveryStep['id']>('email')
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod['id']>('email')
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
    securityAnswer: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [canResend, setCanResend] = useState(false)

  // 🚀 RECOVERY STEPS CONFIGURATION
  const recoverySteps: Record<RecoveryStep['id'], RecoveryStep> = {
    email: {
      id: 'email',
      title: 'Reset Your Password',
      description: 'Enter your email address to receive reset instructions'
    },
    verify: {
      id: 'verify',
      title: 'Verify Your Identity',
      description: 'We\'ve sent a verification code to your email'
    },
    reset: {
      id: 'reset',
      title: 'Create New Password',
      description: 'Enter a strong new password for your account'
    },
    success: {
      id: 'success',
      title: 'Password Reset Complete',
      description: 'Your password has been successfully updated'
    }
  }

  // 🚀 RECOVERY METHODS
  const recoveryMethods: RecoveryMethod[] = [
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Send reset link to your registered email',
      icon: <EnvelopeIcon className="h-6 w-6" />,
      available: true
    },
    {
      id: 'sms',
      title: 'SMS Verification',
      description: 'Send verification code to your phone',
      icon: <KeyIcon className="h-6 w-6" />,
      available: false // Future implementation
    },
    {
      id: 'security',
      title: 'Security Questions',
      description: 'Answer your security questions',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      available: false // Future implementation
    }
  ]

  // 🚀 COUNTDOWN TIMER
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [countdown])

  // 🚀 PASSWORD STRENGTH CALCULATION
  useEffect(() => {
    const password = formData.newPassword
    let strength = 0
    
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
  }, [formData.newPassword])

  // 🚀 INPUT HANDLERS
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }, [error])

  // 🚀 SEND RESET EMAIL
  const handleSendResetEmail = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Password reset instructions have been sent to your email')
        setCurrentStep('verify')
        setCountdown(300) // 5 minutes
        setCanResend(false)
        toast.success('Reset instructions sent successfully')
      } else {
        setError(data.error || 'Failed to send reset instructions')
        toast.error('Failed to send reset instructions')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData.email])

  // 🚀 VERIFY RESET CODE
  const handleVerifyCode = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.verificationCode 
        })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentStep('reset')
        toast.success('Code verified successfully')
      } else {
        setError(data.error || 'Invalid verification code')
        toast.error('Invalid verification code')
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData.email, formData.verificationCode])

  // 🚀 RESET PASSWORD
  const handleResetPassword = useCallback(async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please choose a stronger password.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          code: formData.verificationCode,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentStep('success')
        toast.success('Password reset successfully')
      } else {
        setError(data.error || 'Failed to reset password')
        toast.error('Failed to reset password')
      }
    } catch (error) {
      setError('Password reset failed. Please try again.')
      toast.error('Password reset failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, passwordStrength])

  // 🚀 RESEND CODE
  const handleResendCode = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      await handleSendResetEmail()
      setCountdown(300)
      setCanResend(false)
      toast.success('New verification code sent')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }, [handleSendResetEmail])

  // 🚀 NAVIGATION
  const goBack = useCallback(() => {
    if (currentStep === 'verify') {
      setCurrentStep('email')
    } else if (currentStep === 'reset') {
      setCurrentStep('verify')
    }
  }, [currentStep])

  const goToLogin = useCallback(() => {
    window.location.href = '/auth/login'
  }, [])

  // 🚀 PASSWORD STRENGTH HELPERS
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  // 🚀 RENDER EMAIL STEP
  const renderEmailStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <LockClosedIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {recoverySteps.email.title}
        </h2>
        <p className="text-gray-600">
          {recoverySteps.email.description}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="pl-10 h-12"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Security Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll send a secure reset link to your email</li>
              <li>• The link expires in 15 minutes for security</li>
              <li>• If you don't see the email, check your spam folder</li>
              <li>• Only the most recent reset link will be valid</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSendResetEmail}
        disabled={isLoading || !formData.email}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Sending Instructions...
          </div>
        ) : (
          'Send Reset Instructions'
        )}
      </Button>

      <div className="text-center">
        <Link 
          href="/auth/login"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Login
        </Link>
      </div>
    </motion.div>
  )

  // 🚀 RENDER VERIFY STEP
  const renderVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {recoverySteps.verify.title}
          </h2>
          <p className="text-gray-600">
            {recoverySteps.verify.description}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          We sent a verification code to <strong>{formData.email}</strong>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <Input
          name="verificationCode"
          value={formData.verificationCode}
          onChange={handleInputChange}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest"
        />
      </div>

      {countdown > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Resend code in{' '}
            <span className="font-semibold text-blue-600">
              {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleVerifyCode}
          disabled={isLoading || formData.verificationCode.length !== 6}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>

        {canResend && (
          <Button
            onClick={handleResendCode}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12"
          >
            Resend Code
          </Button>
        )}
      </div>
    </motion.div>
  )

  // 🚀 RENDER RESET STEP
  const renderResetStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {recoverySteps.reset.title}
          </h2>
          <p className="text-gray-600">
            {recoverySteps.reset.description}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Create a strong password"
            className="pl-10 pr-10 h-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {formData.newPassword && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">
                {getPasswordStrengthText()}
              </span>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                  One special character
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your new password"
            className="pl-10 pr-10 h-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        
        {formData.confirmPassword && (
          <div className="mt-2 flex items-center gap-2">
            {formData.newPassword === formData.confirmPassword ? (
              <>
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Passwords match</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleResetPassword}
        disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || passwordStrength < 3}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Resetting Password...
          </div>
        ) : (
          'Reset Password'
        )}
      </Button>
    </motion.div>
  )

  // 🚀 RENDER SUCCESS STEP
  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircleIcon className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {recoverySteps.success.title}
        </h2>
        <p className="text-gray-600">
          {recoverySteps.success.description}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-2">Security Notice</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Your password has been successfully updated</li>
              <li>• All active sessions have been terminated</li>
              <li>• You'll need to sign in again with your new password</li>
              <li>• If you didn't make this change, contact support immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        onClick={goToLogin}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        Sign In with New Password
      </Button>
    </motion.div>
  )

  // 🚀 MAIN RENDER
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderEmailStep()}
                </motion.div>
              )}

              {currentStep === 'verify' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderVerifyStep()}
                </motion.div>
              )}

              {currentStep === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderResetStep()}
                </motion.div>
              )}

              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {renderSuccessStep()}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnhancedPasswordRecovery










