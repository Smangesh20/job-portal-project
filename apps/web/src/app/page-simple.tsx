export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Ask Ya Cham
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Quantum Computing-Powered Job Matching Platform - Connecting the right talent with the right opportunities
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Platform Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Web App</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  ✅ Running
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Service</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  ⚠️ Check API
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Service</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  ⚠️ Check AI
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <a 
              href="https://ask-ya-cham-api.onrender.com/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Check API Status
            </a>
            <a 
              href="https://ask-ya-cham-ai.onrender.com/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Check AI Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
