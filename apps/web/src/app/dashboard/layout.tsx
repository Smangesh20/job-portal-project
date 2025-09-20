import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - AskYaCham',
  description: 'Professional dashboard for job seekers and career management',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
