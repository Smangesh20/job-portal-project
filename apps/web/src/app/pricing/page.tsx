import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - AskYaCham Quantum Job Matching',
  description: 'Choose the perfect plan for your career journey with AskYaCham\'s flexible pricing options.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Choose the plan that fits your career goals. All plans include our quantum-powered matching technology.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <div className="text-4xl font-bold text-gray-900 mb-8">
                  $0<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">5 job matches per month</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Basic profile creation</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Email notifications</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Community support</span>
                </li>
              </ul>
              <a
                href="/auth/register"
                className="w-full inline-flex justify-center items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border-2 border-blue-500 rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-6">For serious job seekers</p>
                <div className="text-4xl font-bold text-gray-900 mb-8">
                  $29<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Unlimited job matches</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Advanced profile features</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Priority application review</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Career insights & analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Direct recruiter contact</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Premium support</span>
                </li>
              </ul>
              <a
                href="/auth/register?plan=professional"
                className="w-full inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Professional
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-purple-500 rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For companies & teams</p>
                <div className="text-4xl font-bold text-gray-900 mb-8">
                  $99<span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Team collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Custom matching criteria</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">API access</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <span className="w-5 h-5 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">24/7 phone support</span>
                </li>
              </ul>
              <a
                href="/contact?plan=enterprise"
                className="w-full inline-flex justify-center items-center px-6 py-3 border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time with no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their perfect match with AskYaCham.
          </p>
          <a
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Start Your Free Trial
          </a>
        </div>
      </section>
    </div>
  )
}
