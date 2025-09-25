'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheckIcon,
  QrCodeIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/enhanced-auth-store'
import { toast } from 'react-hot-toast'

// 🚀 MFA SETUP INTERFACES
interface MFAStep {
  id: 'intro' | 'qr' | 'verify' | 'backup' | 'success'
  title: string
  description: string
}

interface BackupCode {
  id: string
  code: string
  used: boolean
}

// 🚀 MFA SETUP COMPONENT
export const MFASetup: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { setupMfa, verifyMfaSetup, user } = useAuthStore()

  // 🚀 STATE MANAGEMENT
  const [currentStep, setCurrentStep] = useState<MFAStep['id']>('intro')
  const [mfaData, setMfaData] = useState<any>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  // 🚀 MFA STEPS CONFIGURATION
  const mfaSteps: Record<MFAStep['id'], MFAStep> = {
    intro: {
      id: 'intro',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account'
    },
    qr: {
      id: 'qr',
      title: 'Scan QR Code',
      description: 'Use your authenticator app to scan this QR code'
    },
    verify: {
      id: 'verify',
      title: 'Verify Setup',
      description: 'Enter the code from your authenticator app'
    },
    backup: {
      id: 'backup',
      title: 'Save Backup Codes',
      description: 'Store these codes in a safe place'
    },
    success: {
      id: 'success',
      title: 'MFA Enabled Successfully',
      description: 'Your account is now protected with two-factor authentication'
    }
  }

  // 🚀 INITIALIZE MFA SETUP
  const initializeMFASetup = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await setupMfa()
      setMfaData(data)
      setCurrentStep('qr')
      toast.success('MFA setup initialized')
    } catch (error: any) {
      setError(error.message || 'Failed to initialize MFA setup')
      toast.error('Failed to initialize MFA setup')
    } finally {
      setIsLoading(false)
    }
  }, [setupMfa])

  // 🚀 VERIFY MFA SETUP
  const handleVerifyMFA = useCallback(async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const isValid = await verifyMfaSetup(verificationCode)
      if (isValid) {
        // Generate backup codes
        const codes = generateBackupCodes()
        setBackupCodes(codes)
        setCurrentStep('backup')
        toast.success('MFA verified successfully')
      } else {
        setError('Invalid verification code')
        toast.error('Invalid verification code')
      }
    } catch (error: any) {
      setError(error.message || 'MFA verification failed')
      toast.error('MFA verification failed')
    } finally {
      setIsLoading(false)
    }
  }, [verificationCode, verifyMfaSetup])

  // 🚀 COMPLETE MFA SETUP
  const handleCompleteSetup = useCallback(() => {
    setCurrentStep('success')
    toast.success('Two-factor authentication enabled successfully')
  }, [])

  // 🚀 NAVIGATION
  const goToStep = useCallback((step: MFAStep['id']) => {
    setCurrentStep(step)
    setError('')
  }, [])

  const goBack = useCallback(() => {
    if (currentStep === 'qr') {
      setCurrentStep('intro')
    } else if (currentStep === 'verify') {
      setCurrentStep('qr')
    } else if (currentStep === 'backup') {
      setCurrentStep('verify')
    }
  }, [currentStep])

  // 🚀 GENERATE BACKUP CODES
  const generateBackupCodes = (): BackupCode[] => {
    const codes: BackupCode[] = []
    for (let i = 0; i < 10; i++) {
      codes.push({
        id: `backup_${i + 1}`,
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        used: false
      })
    }
    return codes
  }

  // 🚀 COPY TO CLIPBOARD
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }, [])

  // 🚀 RENDER INTRO STEP
  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mfaSteps.intro.title}
        </h2>
        <p className="text-gray-600">
          {mfaSteps.intro.description}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Why Enable 2FA?</h3>
        <ul className="space-y-3 text-sm text-blue-800">
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Protects your account even if your password is compromised</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Required for accessing sensitive features and data</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Industry standard security practice</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Easy to set up and use with authenticator apps</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Need</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">A smartphone with an authenticator app</span>
          </div>
          <div className="flex items-center gap-3">
            <QrCodeIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">Ability to scan QR codes</span>
          </div>
          <div className="flex items-center gap-3">
            <KeyIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">A secure place to store backup codes</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={initializeMFASetup}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Initializing...
            </div>
          ) : (
            'Enable Two-Factor Authentication'
          )}
        </Button>

        <Button
          onClick={() => onComplete?.()}
          variant="outline"
          className="w-full h-12"
        >
          Skip for Now
        </Button>
      </div>
    </motion.div>
  )

  // 🚀 RENDER QR STEP
  const renderQRStep = () => (
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
            {mfaSteps.qr.title}
          </h2>
          <p className="text-gray-600">
            {mfaSteps.qr.description}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto w-64 h-64 bg-white border-2 border-gray-200 rounded-lg p-4 mb-4">
          {mfaData?.qrCode ? (
            <img 
              src={mfaData.qrCode} 
              alt="MFA QR Code" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
              <QrCodeIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code with your authenticator app
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">Popular Authenticator Apps</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Google Authenticator (iOS/Android)</li>
              <li>• Microsoft Authenticator (iOS/Android)</li>
              <li>• Authy (iOS/Android/Desktop)</li>
              <li>• 1Password (iOS/Android/Desktop)</li>
            </ul>
          </div>
        </div>
      </div>

      {mfaData?.secret && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Manual Entry Key</h4>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono">
              {mfaData.secret}
            </code>
            <Button
              onClick={() => copyToClipboard(mfaData.secret)}
              size="sm"
              variant="outline"
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Use this key if you can't scan the QR code
          </p>
        </div>
      )}

      <Button
        onClick={() => setCurrentStep('verify')}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        I've Added the Account
      </Button>
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
            {mfaSteps.verify.title}
          </h2>
          <p className="text-gray-600">
            {mfaSteps.verify.description}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <KeyIcon className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Open your authenticator app and enter the 6-digit code
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <Input
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest"
        />
      </div>

      <Button
        onClick={handleVerifyMFA}
        disabled={isLoading || verificationCode.length !== 6}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Verifying...
          </div>
        ) : (
          'Verify & Continue'
        )}
      </Button>
    </motion.div>
  )

  // 🚀 RENDER BACKUP STEP
  const renderBackupStep = () => (
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
            {mfaSteps.backup.title}
          </h2>
          <p className="text-gray-600">
            {mfaSteps.backup.description}
          </p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-900 mb-2">Important Security Notice</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Store these codes in a secure location</li>
              <li>• Each code can only be used once</li>
              <li>• These codes are your backup if you lose your phone</li>
              <li>• Don't share these codes with anyone</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Backup Codes</h3>
          <Button
            onClick={() => setShowBackupCodes(!showBackupCodes)}
            variant="outline"
            size="sm"
          >
            {showBackupCodes ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {showBackupCodes ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showBackupCodes ? (
          <div className="grid grid-cols-2 gap-3">
            {backupCodes.map((code) => (
              <div
                key={code.id}
                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-center"
              >
                <code className="text-sm font-mono text-gray-800">{code.code}</code>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Click "Show" to reveal your backup codes</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => copyToClipboard(backupCodes.map(c => c.code).join('\n'))}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Copy All Codes
          </Button>
          <Button
            onClick={() => {
              const blob = new Blob([backupCodes.map(c => c.code).join('\n')], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'ask-ya-cham-backup-codes.txt'
              a.click()
              URL.revokeObjectURL(url)
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Download
          </Button>
        </div>
      </div>

      <Button
        onClick={handleCompleteSetup}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        Complete Setup
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
          {mfaSteps.success.title}
        </h2>
        <p className="text-gray-600">
          {mfaSteps.success.description}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-2">Security Enhanced</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Two-factor authentication is now active</li>
              <li>• You'll need your authenticator app for future logins</li>
              <li>• Backup codes are available in your account settings</li>
              <li>• You can disable 2FA anytime in security settings</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onComplete?.()}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
      >
        Continue to Dashboard
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
              {currentStep === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderIntroStep()}
                </motion.div>
              )}

              {currentStep === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderQRStep()}
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

              {currentStep === 'backup' && (
                <motion.div
                  key="backup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderBackupStep()}
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

export default MFASetup
