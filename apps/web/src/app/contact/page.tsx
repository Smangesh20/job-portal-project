import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact AskYaCham - Get in Touch',
  description: 'Get in touch with the AskYaCham team. We\'re here to help with your career journey.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions? We're here to help you on your career journey.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in touch</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Us</h3>
                  <p className="text-gray-600 mb-2">General inquiries:</p>
                  <a href="mailto:hello@askyacham.com" className="text-blue-600 hover:text-blue-700">
                    hello@askyacham.com
                  </a>
                  <p className="text-gray-600 mb-2 mt-4">Support:</p>
                  <a href="mailto:support@askyacham.com" className="text-blue-600 hover:text-blue-700">
                    support@askyacham.com
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Call Us</h3>
                  <p className="text-gray-600 mb-2">Monday - Friday, 9AM - 6PM EST</p>
                  <a href="tel:+15552759242" className="text-blue-600 hover:text-blue-700">
                    +1 (555) ASK-YACH
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Office Address</h3>
                  <p className="text-gray-600">
                    AskYaCham Headquarters<br />
                    123 Quantum Plaza<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      LinkedIn
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Twitter
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How quickly do you respond to inquiries?</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Do you offer phone support?</h3>
              <p className="text-gray-600">
                Yes, we offer phone support for Professional and Enterprise plan users. Free plan users can reach us via email.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I schedule a demo?</h3>
              <p className="text-gray-600">
                Absolutely! We'd love to show you how AskYaCham can transform your career search. Contact us to schedule a personalized demo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}