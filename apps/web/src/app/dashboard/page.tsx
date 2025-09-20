'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedPage } from '@/components/auth/google-auth-guard'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Google-style: Always redirect to overview tab
    router.replace('/dashboard/overview')
  }, [router])

  return (
    <ProtectedPage>
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </ProtectedPage>
  )
}
