'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PrivacyPage() {
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
              <LockClosedIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600">Effective Date: {new Date().toLocaleDateString()}</p>
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
                Ask Ya Cham Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect personal information you provide directly when creating an account, updating your profile, or contacting support. This may include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Name, email address, phone number</li>
                    <li>Resume, qualifications, work history</li>
                    <li>Usage data such as site visits, IP address, device info</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Provide, maintain, and improve our platform and services</li>
                    <li>Personalize job recommendations and analytics</li>
                    <li>Communicate account-related information and updates</li>
                    <li>Detect and prevent fraud, security breaches</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">We do not sell or trade your personal data. We may share information with:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Service providers who assist us in operating the platform (under confidentiality)</li>
                    <li>Legal authorities when required by law</li>
                    <li>Partners or employers only as needed for job placement (with your consent)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement administrative, technical, and physical safeguards to protect your data including encryption, access controls, and regular security audits. However, no system is fully secure; please use the platform responsibly.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Our platform uses cookies for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Authentication & session management</li>
                    <li>User preferences and personalization</li>
                    <li>Analytics and usage tracking</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    You can manage cookie preferences in your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Depending on your jurisdiction, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Access, correct, or delete your personal data</li>
                    <li>Restrict or object to processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time where applicable</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    Contact us to exercise these rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">7. Retention of Data</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We retain your data only as long as necessary for the purposes outlined or to comply with legal requirements.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy occasionally. We will notify you of significant changes via email or platform notices. Continued use implies acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have questions or concerns about this policy or your data, please contact:{' '}
                    <a href="mailto:info.askyacham@gmail.com" className="text-green-600 hover:text-green-800 font-medium">
                      info.askyacham@gmail.com
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