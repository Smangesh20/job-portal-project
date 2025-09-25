'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

// 🚀 ENTERPRISE AUTHENTICATION INTERFACES
interface AuthStep {
  id: 'method' | 'email' | 'otp' | 'password' | 'mfa' | 'success'
  title: string
  description: string
}

interface AuthMethod {
  id: 'password' | 'otp' | 'social' | 'mfa'
  title: string
  description: string
  icon: React.ReactNode
  recommended?: boolean
}

// 🚀 ENTERPRISE AUTHENTICATION COMPONENT
export const EnterpriseAuthSystem: React.FC = () => {
  const { 
    login, 
    loginWithOtp, 
    socialLogin, 
    register, 
    setupMfa, 
    verifyMfa, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore()

  // 🚀 STATE MANAGEMENT
  const [currentStep, setCurrentStep] = useState<AuthStep['id']>('method')
  const [authMethod, setAuthMethod] = useState<AuthMethod['id'] | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    mfaCode: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  // 🚀 AUTHENTICATION STEPS CONFIGURATION
  const authSteps: Record<AuthStep['id'], AuthStep> = {
    method: {
      id: 'method',
      title: 'Choose Your Sign-In Method',
      description: 'Select the most convenient way to access your account'
    },
    email: {
      id: 'email',
      title: isRegisterMode ? 'Create Your Account' : 'Enter Your Email',
      description: isRegisterMode ? 'Fill in your details to get started' : 'We\'ll send you a secure login code'
    },
    otp: {
      id: 'otp',
      title: 'Enter Verification Code',
      description: 'Check your email for the 6-digit code we just sent'
    },
    password: {
      id: 'password',
      title: 'Enter Your Password',
      description: 'Use your secure password to continue'
    },
    mfa: {
      id: 'mfa',
      title: 'Two-Factor Authentication',
      description: 'Enter the code from your authenticator app'
    },
    success: {
      id: 'success',
      title: 'Welcome Back!',
      description: 'You have successfully signed in to your account'
    }
  }

  // 🚀 AUTHENTICATION METHODS - Google-style with only OTP and Social Login
  const authMethods: AuthMethod[] = [
    {
      id: 'otp',
      title: 'Email & OTP',
      description: 'Passwordless login with email verification',
      icon: <EnvelopeIcon className="h-6 w-6" />,
      recommended: true
    },
    {
      id: 'social',
      title: 'Google Sign-In',
      description: 'Quick and secure with Google',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    }
  ]

  // 🚀 OTP TIMER EFFECT
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  // 🚀 PASSWORD STRENGTH CALCULATION
  useEffect(() => {
    const password = formData.password
    let strength = 0
    
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    setPasswordStrength(strength)
  }, [formData.password])

  // 🚀 INPUT HANDLERS
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
  }, [error, clearError])

  // 🚀 METHOD SELECTION
  const handleMethodSelect = useCallback((method: AuthMethod['id']) => {
    setAuthMethod(method)
    clearError()
    
    switch (method) {
      case 'otp':
        setCurrentStep('email')
        break
      case 'password':
        setCurrentStep('email')
        break
      case 'social':
        handleSocialLogin()
        break
      case 'mfa':
        setCurrentStep('email')
        break
    }
  }, [clearError])

  // 🚀 SOCIAL LOGIN
  const handleSocialLogin = useCallback(async () => {
    try {
      console.log('🚀 Initiating Google Sign-In...')
      
      // Google OAuth implementation
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google' })
      })
      
      const data = await response.json()
      console.log('🚀 Google Sign-In response:', data)
      
      if (data.success) {
        if (data.data.demoMode) {
          // 🚀 DEMO MODE - Direct success
          toast.success('Google Sign-In successful! (Demo Mode)')
          setCurrentStep('success')
        } else if (data.data.authUrl) {
          // 🚀 REAL OAUTH - Redirect to Google
          window.location.href = data.data.authUrl
        } else {
          await socialLogin('google', data.data)
          setCurrentStep('success')
        }
      } else {
        toast.error(data.error || 'Google Sign-In failed')
      }
    } catch (error: any) {
      console.error('🚨 Social login error:', error)
      toast.error('Social login failed. Please try again.')
    }
  }, [socialLogin])

  // 🚀 SEND OTP
  const handleSendOtp = useCallback(async () => {
    try {
      console.log('🚀 Sending OTP to:', formData.email)
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      
      console.log('🚀 OTP Response status:', response.status)
      const data = await response.json()
      console.log('🚀 OTP Response data:', data)
      
      if (data.success) {
        setCurrentStep('otp')
        setOtpTimer(300) // 5 minutes
        toast.success('Verification code sent to your email')
        console.log('🚀 OTP sent successfully, moving to OTP step')
      } else {
        toast.error(data.error || 'Failed to send verification code')
        console.error('🚨 OTP sending failed:', data.error)
      }
    } catch (error: any) {
      toast.error('Failed to send verification code')
      console.error('🚨 OTP sending error:', error)
    }
  }, [formData.email])

  // 🚀 RESEND OTP
  const handleResendOtp = useCallback(async () => {
    setIsResendingOtp(true)
    try {
      await handleSendOtp()
      toast.success('New verification code sent')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsResendingOtp(false)
    }
  }, [handleSendOtp])

  // 🚀 VERIFY OTP
  const handleVerifyOtp = useCallback(async () => {
    try {
      await loginWithOtp(formData.email, formData.otp, 'LOGIN')
      setCurrentStep('success')
    } catch (error: any) {
      toast.error('Invalid verification code')
    }
  }, [formData.email, formData.otp, loginWithOtp])

  // 🚀 PASSWORD LOGIN
  const handlePasswordLogin = useCallback(async () => {
    try {
      await login(formData.email, formData.password)
      setCurrentStep('success')
    } catch (error: any) {
      toast.error('Invalid email or password')
    }
  }, [formData.email, formData.password, login])

  // 🚀 REGISTRATION
  const handleRegister = useCallback(async () => {
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })
      setCurrentStep('success')
    } catch (error: any) {
      toast.error('Registration failed. Please try again.')
    }
  }, [formData, register])

  // 🚀 MFA VERIFICATION
  const handleMfaVerify = useCallback(async () => {
    try {
      const isValid = await verifyMfa(formData.mfaCode)
      if (isValid) {
        setCurrentStep('success')
      } else {
        toast.error('Invalid MFA code')
      }
    } catch (error: any) {
      toast.error('MFA verification failed')
    }
  }, [formData.mfaCode, verifyMfa])

  // 🚀 STEP NAVIGATION
  const goToStep = useCallback((step: AuthStep['id']) => {
    setCurrentStep(step)
    clearError()
  }, [clearError])

  const goBack = useCallback(() => {
    if (currentStep === 'email') {
      setCurrentStep('method')
    } else if (currentStep === 'otp') {
      setCurrentStep('email')
    } else if (currentStep === 'password') {
      setCurrentStep('email')
    } else if (currentStep === 'mfa') {
      setCurrentStep('password')
    }
  }, [currentStep])

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

  // 🚀 RENDER METHODS STEP
  const renderMethodStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {authSteps.method.title}
        </h2>
        <p className="text-gray-600">
          {authSteps.method.description}
        </p>
      </div>

      <div className="grid gap-4">
        {authMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                method.recommended ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-gray-300'
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    method.recommended ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      {method.recommended && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🚀 Sign up here clicked - switching to register mode')
              console.log('🚀 Current isRegisterMode:', isRegisterMode)
              setIsRegisterMode(true)
              setCurrentStep('method') // Reset to method selection
              setAuthMethod(null) // Clear selected method
              clearError() // Clear any errors
              console.log('🚀 After setting isRegisterMode to true')
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
            type="button"
          >
            Sign up here
          </button>
        </p>
      </div>
    </motion.div>
  )

  // 🚀 RENDER EMAIL STEP
  const renderEmailStep = () => (
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
            {authSteps.email.title}
          </h2>
          <p className="text-gray-600">
            {authSteps.email.description}
          </p>
        </div>
      </div>

      {isRegisterMode && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className="h-12"
            />
          </div>
        </div>
      )}

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
            placeholder="john@example.com"
            className="pl-10 h-12"
          />
        </div>
      </div>

      {authMethod === 'password' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
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
        </div>
      )}

      {isRegisterMode && authMethod === 'password' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
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
            
            {formData.password && (
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
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
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
                {formData.password === formData.confirmPassword ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-green-500" />
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
        </>
      )}

      <Button
        onClick={() => {
          if (authMethod === 'otp') {
            handleSendOtp()
          } else if (authMethod === 'password') {
            if (isRegisterMode) {
              handleRegister()
            } else {
              handlePasswordLogin()
            }
          }
        }}
        disabled={isLoading || !formData.email || (authMethod === 'password' && !formData.password)}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {isRegisterMode ? 'Creating Account...' : 'Signing In...'}
          </div>
        ) : (
          isRegisterMode ? 'Create Account' : 'Continue'
        )}
      </Button>

      {/* 🚀 SIGN IN LINK FOR REGISTER MODE */}
      {isRegisterMode && (
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('🚀 Sign in here clicked - switching to login mode')
                console.log('🚀 Current isRegisterMode:', isRegisterMode)
                setIsRegisterMode(false)
                setCurrentStep('method') // Reset to method selection
                setAuthMethod(null) // Clear selected method
                clearError() // Clear any errors
                console.log('🚀 After setting isRegisterMode to false')
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
              type="button"
            >
              Sign in here
            </button>
          </p>
        </div>
      )}
    </motion.div>
  )

  // 🚀 RENDER OTP STEP
  const renderOtpStep = () => (
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
            {authSteps.otp.title}
          </h2>
          <p className="text-gray-600">
            {authSteps.otp.description}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <KeyIcon className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          We sent a 6-digit code to <strong>{formData.email}</strong>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <Input
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          placeholder="000000"
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest"
        />
      </div>

      {otpTimer > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Resend code in{' '}
            <span className="font-semibold text-blue-600">
              {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
            </span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleVerifyOtp}
          disabled={isLoading || formData.otp.length !== 6}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>

        {otpTimer === 0 && (
          <Button
            onClick={handleResendOtp}
            disabled={isResendingOtp}
            variant="outline"
            className="w-full h-12"
          >
            {isResendingOtp ? 'Sending...' : 'Resend Code'}
          </Button>
        )}
      </div>
    </motion.div>
  )

  // 🚀 RENDER MFA STEP
  const renderMfaStep = () => (
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
            {authSteps.mfa.title}
          </h2>
          <p className="text-gray-600">
            {authSteps.mfa.description}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Open your authenticator app and enter the 6-digit code
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Authentication Code
        </label>
        <Input
          name="mfaCode"
          value={formData.mfaCode}
          onChange={handleInputChange}
          placeholder="000000"
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest"
        />
      </div>

      <Button
        onClick={handleMfaVerify}
        disabled={isLoading || formData.mfaCode.length !== 6}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        {isLoading ? 'Verifying...' : 'Verify & Continue'}
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
          {authSteps.success.title}
        </h2>
        <p className="text-gray-600">
          {authSteps.success.description}
        </p>
      </div>

      <Button
        onClick={() => window.location.href = '/dashboard'}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        Go to Dashboard
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
              {currentStep === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderMethodStep()}
                </motion.div>
              )}

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

              {currentStep === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderOtpStep()}
                </motion.div>
              )}

              {currentStep === 'mfa' && (
                <motion.div
                  key="mfa"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderMfaStep()}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnterpriseAuthSystem
