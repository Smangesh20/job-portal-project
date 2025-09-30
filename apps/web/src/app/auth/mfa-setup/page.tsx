'use client'

import React from 'react'
import MFASetup from '@/components/auth/MFASetup'

// 🚀 MFA SETUP PAGE
export default function MFASetupPage() {
  return <MFASetup onComplete={() => window.location.href = '/dashboard'} />
}






