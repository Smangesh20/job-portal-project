'use client'

import { EnterpriseDashboardLayout } from '@/components/layouts/enterprise-dashboard-layout'

export default function ApplicationsPage() {
  return (
    <EnterpriseDashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">My Applications</h1>
          <p className="text-slate-600">Track and manage your job applications</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Total Applications</h3>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                12
              </div>
            </div>
            <p className="text-slate-600 text-sm">Applications submitted this month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">In Review</h3>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                5
              </div>
            </div>
            <p className="text-slate-600 text-sm">Currently being reviewed</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Interviews</h3>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                3
              </div>
            </div>
            <p className="text-slate-600 text-sm">Scheduled interviews</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Applications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Senior Frontend Developer</h3>
                <p className="text-sm text-slate-600">TechCorp Inc.</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Review
                </span>
                <p className="text-xs text-slate-500 mt-1">Applied 2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Full Stack Engineer</h3>
                <p className="text-sm text-slate-600">StartupXYZ</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Interview Scheduled
                </span>
                <p className="text-xs text-slate-500 mt-1">Applied 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnterpriseDashboardLayout>
  )
}