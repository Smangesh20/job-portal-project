import { Metadata } from 'next'
import { DashboardLayout as Layout } from '@/components/layouts/dashboard-layout'

export const metadata: Metadata = {
  title: 'Dashboard - AskYaCham',
  description: 'Professional dashboard for job seekers and career management',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}
