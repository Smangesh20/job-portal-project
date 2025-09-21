import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How AskYaCham Works - Quantum Job Matching Process',
  description: 'Discover how AskYaCham\'s quantum computing technology matches you with perfect career opportunities.',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Our quantum-powered matching process in three simple steps.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 text-2xl font-bold rounded-full mb-6">
                  1
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Profile</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Tell us about your skills, experience, career goals, and what matters most to you in a job. Our intelligent system learns from your preferences to understand your unique professional DNA.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Skills and expertise
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Career aspirations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Work preferences
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Cultural fit factors
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-gray-600">Profile Creation</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 text-2xl font-bold rounded-full mb-6">
                  2
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quantum Analysis</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Our quantum algorithms analyze millions of data points, including job requirements, company culture, market trends, and your profile to find the most compatible matches.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Skill compatibility analysis
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Cultural fit assessment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Career progression potential
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Market opportunity analysis
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <p className="text-gray-600">Quantum Processing</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 text-2xl font-bold rounded-full mb-6">
                  3
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Perfect Matches</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Receive personalized job recommendations with detailed compatibility scores. Each match includes insights about why it's perfect for you and how it aligns with your career goals.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Personalized job recommendations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Compatibility scores
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Career insights and analysis
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Direct application opportunities
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-600">Perfect Matches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose AskYaCham?</h2>
            <p className="text-lg text-gray-600">
              Our quantum-powered approach delivers results that traditional job boards simply cannot match.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">95% Match Accuracy</h3>
              <p className="text-gray-600">
                Our quantum algorithms achieve unprecedented accuracy in matching candidates with opportunities.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Time Savings</h3>
              <p className="text-gray-600">
                Reduce your job search time by up to 80% with our intelligent pre-screening and matching.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Find opportunities that align with your long-term career goals and growth trajectory.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Fit</h3>
              <p className="text-gray-600">
                Ensure you're matched with companies whose values and culture align with your own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the quantum revolution in job matching today.
          </p>
          <a
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create Your Profile
          </a>
        </div>
      </section>
    </div>
  )
}
