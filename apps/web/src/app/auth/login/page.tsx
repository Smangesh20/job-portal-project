'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ProfessionalError } from '@/components/ui/professional-error'
import { AuthPage } from '@/components/auth/google-auth-guard'

// World-Class Success Modal Component
const SuccessModal = ({ isOpen, onClose, onContinue }: { 
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}) => {
  // SuccessModal render
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100"
          >
            {/* Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <CheckCircleIcon className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                Login Successful!
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                Welcome back! You have successfully logged into your Ask Ya Cham account. 
                You will now be redirected to your personalized dashboard.
              </motion.p>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading, error, isAuthenticated } = useAuth()
  
  // Form state with persistence
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('ask_ya_cham_login_email') || searchParams.get('email') || ''
      return {
        email: savedEmail,
        password: ''
      }
    }
    return {
      email: searchParams.get('email') || '',
      password: ''
    }
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [forceRender, setForceRender] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Debug state changes
  useEffect(() => {
    // Success modal state changed
  }, [showSuccessModal])
  
  // Force show modal using direct DOM manipulation
  const forceShowModal = useCallback(() => {
    // Force showing modal via DOM manipulation
    
    // Try multiple times with different selectors
    const selectors = [
      '[data-modal-ref]',
      '.success-modal-container',
      'div[style*="z-[9999]"]'
    ]
    
    let modalElement = modalRef.current
    
    if (!modalElement) {
      for (const selector of selectors) {
        modalElement = document.querySelector(selector) as HTMLDivElement
        if (modalElement) {
          // Found modal using selector
          break
        }
      }
    }
    
    if (modalElement) {
      modalElement.style.display = 'flex'
      modalElement.style.opacity = '1'
      modalElement.style.visibility = 'visible'
      modalElement.style.transition = 'opacity 0.3s ease-in-out'
      // Modal should now be visible
    } else {
      // Modal ref is null and could not find modal element
    }
  }, [])

  // Preserve form data on component re-renders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('ask_ya_cham_login_email')
      if (savedEmail && savedEmail !== formData.email) {
        setFormData(prev => ({ ...prev, email: savedEmail }))
      }
    }
  }, [])

  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Handle input changes with persistence
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Save email to localStorage for persistence
    if (name === 'email' && typeof window !== 'undefined') {
      localStorage.setItem('ask_ya_cham_login_email', value)
    }
    
    // Error handling is managed by the auth store
  }, [error])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Attempt login
      await login(formData.email, formData.password)
      
      // If we get here, login was successful
      setShowSuccessModal(true)
      setForceRender(prev => prev + 1)
      forceShowModal()
      
      // Clear saved email on success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ask_ya_cham_login_email')
      }
      
    } catch (error: any) {
      // Login failed - error will be shown by the auth store
      console.log('Login error:', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, login, isSubmitting])

  // Handle success modal continue
  const handleSuccessContinue = useCallback(() => {
    setShowSuccessModal(false)
    // Google-style: Check for return URL
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get('returnUrl')
    if (returnUrl) {
      window.location.href = decodeURIComponent(returnUrl)
    } else {
      window.location.href = '/dashboard'
    }
  }, [])

  // Handle success modal close
  const handleSuccessClose = useCallback(() => {
    setShowSuccessModal(false)
    // Google-style: Check for return URL
    const urlParams = new URLSearchParams(window.location.search)
    const returnUrl = urlParams.get('returnUrl')
    if (returnUrl) {
      window.location.href = decodeURIComponent(returnUrl)
    } else {
      window.location.href = '/dashboard'
    }
  }, [])

  return (
    <AuthPage>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors z-10"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold">
                Welcome Back
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Sign In to Your Account
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Enter your credentials to access your dashboard
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Professional Error Display */}
            {errorDetails && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <ProfessionalError 
                  error={errorDetails} 
                  onDismiss={clearError}
                />
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-right"
              >
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </motion.div>


              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting || isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center pt-4 border-t border-gray-200 space-y-3"
            >
              <div>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/auth/register" 
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Modal - Direct DOM approach */}
      <div
        ref={modalRef}
        data-modal-ref="true"
        className="success-modal-container fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ 
          display: 'none',
          opacity: 0,
          visibility: 'hidden'
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleSuccessClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Login Successful!
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Welcome back! You have successfully logged into your Ask Ya Cham account. 
              You will now be redirected to your personalized dashboard.
            </p>

            {/* Button */}
            <Button
              onClick={handleSuccessContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
      </div>
    </AuthPage>
  )
}
