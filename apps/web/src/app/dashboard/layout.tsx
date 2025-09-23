import { Metadata } from 'next'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export const metadata: Metadata = {
  title: 'Dashboard - AskYaCham',
  description: 'Professional dashboard for job seekers and career management',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
