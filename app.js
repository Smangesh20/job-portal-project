const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation middleware
app.use((req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    }
  }
  
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    }
  });
});

// Research API endpoints
app.post('/api/research/search', (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Search query is required and must be a string'
        }
      });
    }

    const mockResults = [
                {
                    id: 1,
                    title: "Senior Software Engineer",
        company: "Tech Solutions Inc",
                    location: "Remote",
        salary: "$100,000 - $150,000",
        match: 95,
        description: "We are looking for a senior software engineer with expertise in React and Node.js...",
        postedAt: new Date().toISOString(),
        type: "Full-time"
                },
                {
                    id: 2,
                    title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        salary: "$90,000 - $130,000",
        match: 88,
        description: "Join our growing team as a full stack developer...",
        postedAt: new Date().toISOString(),
        type: "Full-time"
      }
    ];

    const filteredResults = mockResults.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: {
        results: filteredResults,
        total: filteredResults.length,
        query,
        filters
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal server error occurred'
      }
    });
  }
});

// Main page
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ask Ya Cham - AI-Powered Job Matching</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 1rem 0; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1); }
            .nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.8rem; font-weight: bold; color: #667eea; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s ease; }
        .nav-links a:hover { color: #667eea; }
        .hero { text-align: center; padding: 4rem 0; color: white; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; font-weight: 700; }
        .hero p { font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9; }
        .btn { display: inline-block; padding: 1rem 2rem; background: white; color: #667eea; text-decoration: none; border-radius: 50px; font-weight: 600; transition: transform 0.3s ease, box-shadow 0.3s ease; margin: 0 0.5rem; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); }
        .features { background: white; padding: 4rem 0; }
        .features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .feature-card { text-align: center; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #333; }
        .feature-card p { color: #666; line-height: 1.6; }
        .research-section { background: #f8f9fa; padding: 4rem 0; }
        .research-section h2 { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; color: #333; }
        .search-form { max-width: 600px; margin: 0 auto; display: flex; gap: 1rem; margin-bottom: 2rem; }
        .search-input { flex: 1; padding: 1rem; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; outline: none; transition: border-color 0.3s ease; }
        .search-input:focus { border-color: #667eea; }
        .search-btn { padding: 1rem 2rem; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s ease; }
        .search-btn:hover { background: #5a6fd8; }
        .results { max-width: 800px; margin: 0 auto; }
        .job-card { background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; }
        .job-card:hover { transform: translateY(-2px); }
        .job-title { font-size: 1.3rem; font-weight: 600; color: #333; margin-bottom: 0.5rem; }
        .job-company { color: #667eea; font-weight: 500; margin-bottom: 0.5rem; }
        .job-location { color: #666; margin-bottom: 0.5rem; }
        .job-salary { color: #28a745; font-weight: 600; }
        .footer { background: #333; color: white; text-align: center; padding: 2rem 0; }
        @media (max-width: 768px) { .hero h1 { font-size: 2.5rem; } .nav-links { display: none; } .search-form { flex-direction: column; } }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                <div class="logo">Ask Ya Cham</div>
                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/login" class="btn">Sign In</a></li>
                </ul>
                </nav>
            </div>
        </header>
    <main>
        <section class="hero">
            <div class="container">
                <h1>Find Your Dream Job with Ask Ya Cham</h1>
                <p>AI-powered job matching platform that connects talented professionals with the perfect career opportunities.</p>
                <a href="#research" class="btn">Get Started Free</a>
                <a href="#features" class="btn">Learn More</a>
                    </div>
        </section>
        <section id="features" class="features">
            <div class="container">
                <h2>Why Choose Ask Ya Cham?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🤖</div>
                        <h3>AI-Powered Matching</h3>
                        <p>Advanced algorithms match you with the perfect job opportunities based on your skills, experience, and preferences.</p>
                        </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔔</div>
                        <h3>Real-time Notifications</h3>
                        <p>Get instant updates about new job matches, application status, and interview invitations.</p>
                        </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Smart Analytics</h3>
                        <p>Track your job search progress with detailed insights and personalized recommendations.</p>
                        </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3>Secure & Private</h3>
                        <p>Your data is protected with enterprise-grade security and privacy controls.</p>
                    </div>
                        </div>
                    </div>
        </section>
        <section id="research" class="research-section">
            <div class="container">
                <h2>Research Job Opportunities</h2>
                <form class="search-form" id="searchForm">
                    <input type="text" class="search-input" id="searchInput" placeholder="Search for jobs, companies, or skills..." required>
                    <button type="submit" class="search-btn">Search</button>
                         </form>
                <div class="results" id="results"></div>
                     </div>
        </section>
        </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Ask Ya Cham. All rights reserved. | AI-Powered Job Matching Platform</p>
        </div>
    </footer>
        <script>
        document.getElementById('searchForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
            const query = document.getElementById('searchInput').value;
            const resultsDiv = document.getElementById('results');
            if (!query.trim()) return;
            resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Searching...</p>';
            try {
                const response = await fetch('/api/research/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query.trim() })
                });
                const data = await response.json();
                if (data.success) {
                    displayResults(data.data.results);
                } else {
                    resultsDiv.innerHTML = '<p style="text-align: center; color: #e74c3c;">Search failed. Please try again.</p>';
                }
  } catch (error) {
                console.error('Search error:', error);
                resultsDiv.innerHTML = '<p style="text-align: center; color: #e74c3c;">Network error. Please try again.</p>';
            }
        });
        function displayResults(results) {
            const resultsDiv = document.getElementById('results');
            if (results.length === 0) {
                resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No jobs found. Try a different search term.</p>';
                return;
            }
            resultsDiv.innerHTML = results.map(job => \`<div class="job-card"><div class="job-title">\${job.title}</div><div class="job-company">\${job.company}</div><div class="job-location">\${job.location}</div><div class="job-salary">\${job.salary}</div><div style="margin-top: 10px; color: #28a745; font-weight: 600;">\${job.match}% Match</div></div>\`).join('');
        }
    </script>
</body>
</html>`;
  
  res.send(html);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred',
    timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ask Ya Cham Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Research API: http://localhost:${PORT}/api/research/search`);
  console.log(`🌐 Main site: http://localhost:${PORT}/`);
});

module.exports = app;
