'use client'

import { ReactNode } from 'react'
import { SimpleLayout } from '@/components/layouts/SimpleLayout'
import MinimalHeader from '@/components/layouts/minimal-header'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <SimpleLayout>{children}</SimpleLayout>
}
