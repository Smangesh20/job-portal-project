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
  EnvelopeIcon,
  LockClosedIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ProfessionalError } from '@/components/ui/professional-error'
import { PublicRoute } from '@/components/auth/route-guard'

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
                Account Created Successfully!
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                Congratulations! Your Ask Ya Cham account has been created successfully. 
                Welcome to the future of job matching with quantum computing technology.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Go to Dashboard
                </Button>
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Back to Home
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, isLoading, error, errorDetails, clearError } = useAuthStore()
  
  // Form state with persistence
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('ask_ya_cham_register_form')
      const savedEmail = localStorage.getItem('ask_ya_cham_register_email') || searchParams.get('email') || ''
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          return {
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            email: parsed.email || savedEmail,
            password: '',
            confirmPassword: '',
            agreeToTerms: false
          }
        } catch (e) {
          // Fallback to default
        }
      }
      
      return {
        firstName: '',
        lastName: '',
        email: savedEmail,
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      }
    }
    return {
      firstName: '',
      lastName: '',
      email: searchParams.get('email') || '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicateEmail, setDuplicateEmail] = useState('')
  const [forceRender, setForceRender] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const duplicateModalRef = useRef<HTMLDivElement>(null)
  
  // Debug state changes
  useEffect(() => {
    }, [showSuccessModal])
  
  // Force show modal using direct DOM manipulation
  const forceShowModal = useCallback(() => {
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
          break
        }
      }
    }
    
    if (modalElement) {
      modalElement.style.display = 'flex'
      modalElement.style.opacity = '1'
      modalElement.style.visibility = 'visible'
      modalElement.style.transition = 'opacity 0.3s ease-in-out'
      } else {
      }
  }, [])
  
  // Force show duplicate modal using direct DOM manipulation
  const forceShowDuplicateModal = useCallback(() => {
    const selectors = [
      '[data-duplicate-modal-ref]',
      '.duplicate-modal-container',
      'div[style*="z-[9998]"]'
    ]
    
    let modalElement = duplicateModalRef.current
    
    if (!modalElement) {
      for (const selector of selectors) {
        modalElement = document.querySelector(selector) as HTMLDivElement
        if (modalElement) {
          break
        }
      }
    }
    
    if (modalElement) {
      modalElement.style.display = 'flex'
      modalElement.style.opacity = '1'
      modalElement.style.visibility = 'visible'
      modalElement.style.transition = 'opacity 0.3s ease-in-out'
      } else {
      }
  }, [])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Preserve form data on component re-renders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('ask_ya_cham_register_email')
      if (savedEmail && savedEmail !== formData.email) {
        setFormData(prev => ({ ...prev, email: savedEmail }))
      }
    }
  }, [])

  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Password strength calculation
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

  // Handle input changes with persistence
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newFormData = { 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    }
    
    setFormData(newFormData)
    
    // Save form data to sessionStorage for persistence (excluding passwords)
    if (typeof window !== 'undefined') {
      const dataToSave = {
        firstName: newFormData.firstName,
        lastName: newFormData.lastName,
        email: newFormData.email,
        // Don't save passwords for security
      }
      sessionStorage.setItem('ask_ya_cham_register_form', JSON.stringify(dataToSave))
      
      // Also save email to localStorage for cross-session persistence
      if (name === 'email') {
        localStorage.setItem('ask_ya_cham_register_email', value)
      }
    }
    
    // Clear errors when user starts typing
    if (error) {
      clearError()
    }
  }, [formData, error, clearError])

  // Get password strength color
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Get password strength text
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    clearError()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setIsSubmitting(false)
      return
    }
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      setIsSubmitting(false)
      return
    }
    
    try {
      console.log('🚀 REGISTRATION: Starting registration for:', formData.email, 'Name:', formData.firstName, formData.lastName)
      
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })
      
      console.log('🚀 REGISTRATION: Registration result:', result)
      
      // FORCE SAVE USER DATA TO LOCALSTORAGE IMMEDIATELY
      if (typeof window !== 'undefined') {
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
        }
        
        console.log('🚀 REGISTRATION: Force saving user data:', userData)
        localStorage.setItem('userData', JSON.stringify(userData))
        console.log('🚀 REGISTRATION: User data saved to localStorage')
        
        // Verify it was saved
        const savedData = localStorage.getItem('userData')
        console.log('🚀 REGISTRATION: Verified saved data:', savedData)
      }
      
      // Show success modal with multiple approaches to ensure it works
      // Try immediate update
      setShowSuccessModal(true)
      setForceRender(prev => prev + 1)
      forceShowModal()
      
      // Try with flushSync
      flushSync(() => {
        setShowSuccessModal(true)
      })
      
      // Try with timeout as backup
      setTimeout(() => {
        setShowSuccessModal(true)
        setForceRender(prev => prev + 1)
        forceShowModal()
      }, 100)
      
      // Additional timeout to ensure DOM is ready
      setTimeout(() => {
        forceShowModal()
      }, 200)
      
      // Clear saved form data on success
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ask_ya_cham_register_email')
        sessionStorage.removeItem('ask_ya_cham_register_form')
      }
      
    } catch (error: any) {
      // Special handling for duplicate email - show professional modal
      if (error.message && error.message.includes('already exists')) {
        setDuplicateEmail(formData.email)
        setShowDuplicateModal(true)
        forceShowDuplicateModal()
        
        // Also try with timeout
        setTimeout(() => {
          setShowDuplicateModal(true)
          forceShowDuplicateModal()
        }, 100)
      } else {
        toast.error(error.message || 'Registration failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, register, clearError, isSubmitting])

  // Handle success modal continue
  const handleSuccessContinue = useCallback(() => {
    setShowSuccessModal(false)
    router.push('/dashboard')
  }, [router])

  // Handle success modal close
  const handleSuccessClose = useCallback(() => {
    setShowSuccessModal(false)
    router.push('/')
  }, [router])
  
  // Handle duplicate modal close
  const handleDuplicateClose = useCallback(() => {
    setShowDuplicateModal(false)
    if (duplicateModalRef.current) {
      duplicateModalRef.current.style.display = 'none'
    }
  }, [])
  
  // Handle duplicate modal - go to login
  const handleDuplicateLogin = useCallback(() => {
    setShowDuplicateModal(false)
    if (duplicateModalRef.current) {
      duplicateModalRef.current.style.display = 'none'
    }
    router.push('/auth/login')
  }, [router])
  
  // Handle duplicate modal - try different email
  const handleDuplicateTryAgain = useCallback(() => {
    setShowDuplicateModal(false)
    if (duplicateModalRef.current) {
      duplicateModalRef.current.style.display = 'none'
    }
    // Clear the email field to allow user to enter different email
    setFormData(prev => ({ ...prev, email: '' }))
  }, [])

  return (
    <PublicRoute>
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 p-4">
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
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-sm font-semibold">
                Join Ask Ya Cham
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Start your journey to finding the perfect job
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
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
                    placeholder="john@example.com"
                    className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Create a strong password
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
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
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
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                  Confirm your password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-2">
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
              </motion.div>

              {/* Terms and Conditions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-start gap-3"
              >
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-800 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-600 hover:text-green-800 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              {/* Registration Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-green-900 mb-2">Registration Guidelines</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>• Password must be at least 8 characters long</p>
                      <p>• Use any valid email address</p>
                      <p>• All fields are required</p>
                      <p>• If you already have an account, you'll be prompted to sign in</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading || !formData.agreeToTerms}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting || isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.div>
              
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center pt-4 border-t border-gray-200"
            >
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                >
                  Sign in here
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
              Account Created Successfully!
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Congratulations! Your Ask Ya Cham account has been created successfully. 
              Welcome to the future of job matching with quantum AI technology. 
              You will now be redirected to the home page.
            </p>

            {/* Button */}
            <Button
              onClick={handleSuccessContinue}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
      
      {/* Duplicate Account Modal - Professional Enterprise Style */}
      <div
        ref={duplicateModalRef}
        data-duplicate-modal-ref="true"
        className="duplicate-modal-container fixed inset-0 z-[9998] flex items-center justify-center"
        style={{ 
          display: 'none',
          opacity: 0,
          visibility: 'hidden'
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={handleDuplicateClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
          {/* Header with warning icon */}
          <div className="p-8 text-center">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <ExclamationTriangleIcon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Account Already Exists
            </h3>

            {/* Message */}
            <div className="text-gray-600 mb-8 leading-relaxed">
              <p className="mb-4">
                We found an existing account associated with:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900">{duplicateEmail}</p>
              </div>
              <p className="text-sm">
                This email address is already registered in our system. Please choose one of the options below to continue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleDuplicateLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Sign In to Existing Account
              </Button>
              
              <Button
                onClick={handleDuplicateTryAgain}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Use Different Email Address
              </Button>
              
              <button
                onClick={handleDuplicateClose}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Success Modal */}
    <SuccessModal
      isOpen={showSuccessModal}
      onClose={handleSuccessClose}
      onContinue={handleSuccessContinue}
    />
    </PublicRoute>
  )
}
