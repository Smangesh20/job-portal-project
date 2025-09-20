'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon, DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function TermsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/auth/register">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Registration
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                Ask Ya Cham Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using the Ask Ya Cham platform ("Service"), you agree to comply with and be legally bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">2. User Eligibility and Account Registration</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Users must be at least 18 years old or have legal guardian consent.</li>
                    <li>You agree to provide accurate, complete, and current information during account registration.</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">3. License to Use Service</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask Ya Cham grants you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes compliant with these Terms.</li>
                    <li>Any unauthorized use or reproduction of the Service content is prohibited.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>You promise not to use the Service for any unlawful activity or content, including but not limited to fraud, harassment, infringement of intellectual property, or spreading misinformation.</li>
                    <li>You have sole responsibility for all the content you upload or share and must ensure you have all rights to do so.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>All intellectual property rights in the Service and content provided through it (excluding user-uploaded content) are owned by or licensed to Ask Ya Cham.</li>
                    <li>By submitting content, you grant Ask Ya Cham a worldwide, royalty-free license to use, reproduce, and display such content for Service operation.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask Ya Cham's Privacy Policy governs how user data is collected, used, and protected.</li>
                    <li>We comply with applicable data protection laws (GDPR, CCPA) and implement technical and organizational measures to safeguard data.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">7. Fees and Payments</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Use of the basic platform is free unless otherwise stated.</li>
                    <li>Premium or paid features require payment as per the terms described prior to subscription or purchase.</li>
                    <li>Unauthorized access to paid features or fraudulent payments will result in suspension and potential legal action.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">8. Disclaimers & Limitation of Liability</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>The Service is provided "as is" without warranties of any kind.</li>
                    <li>Ask Ya Cham is not responsible for job placement, employer fairness, or content accuracy uploaded by users or third parties.</li>
                    <li>Under no circumstances will Ask Ya Cham be liable for any indirect, incidental, special, or consequential damages resulting from using or inability to use the Service.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">9. Termination and Suspension</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask Ya Cham reserves the right to suspend or terminate access to the Service for any user violating these Terms or engaged in harmful conduct.</li>
                    <li>Users may delete their accounts at any time, though residual data may persist as detailed in the Privacy Policy.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">10. Governing Law and Dispute Resolution</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>These Terms are governed by the laws of India.</li>
                    <li>Disputes shall be resolved via mediation, and if unresolved, by binding arbitration or the courts as applicable.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Ask Ya Cham may modify or update these Terms at any time with notice to users.</li>
                    <li>Continued use of the Service after changes constitutes acceptance of the updated Terms.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">12. Contact</h2>
                  <p className="text-gray-700 leading-relaxed">
                    For questions or concerns regarding these Terms, please contact us at:{' '}
                    <a href="mailto:info@askyacham.com" className="text-green-600 hover:text-green-800 font-medium">
                      info@askyacham.com
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}