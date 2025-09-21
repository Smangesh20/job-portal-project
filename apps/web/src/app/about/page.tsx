import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About AskYaCham - Quantum-Powered Job Matching',
  description: 'Learn about AskYaCham\'s mission to revolutionize job matching with quantum computing technology.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About AskYaCham</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Revolutionizing job matching with quantum computing technology to create perfect career connections.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that finding the right career opportunity should be effortless, intelligent, and perfectly matched to your unique skills and aspirations. Our quantum-powered platform eliminates the guesswork from job searching by leveraging advanced algorithms to create meaningful connections between talented professionals and innovative companies.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quantum-Powered Technology</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our proprietary quantum computing algorithms analyze millions of data points to understand your professional profile, career goals, and cultural fit preferences. This allows us to match you with opportunities that align not just with your skills, but with your values and long-term aspirations.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Precision</h3>
              <p className="text-gray-600">
                Every match is calculated with mathematical precision to ensure optimal compatibility between candidates and opportunities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible in career matching through cutting-edge technology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connection</h3>
              <p className="text-gray-600">
                We believe in creating meaningful connections that benefit both job seekers and employers equally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have already discovered their perfect career match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}