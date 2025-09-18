const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    quantum_engine: 'active',
    coherence: 0.95,
    timestamp: new Date().toISOString(),
    platform: 'Ask Ya Cham - Quantum-Powered Job Matching'
  });
});

// API endpoints
app.get('/api/jobs', (req, res) => {
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Quantum Software Engineer',
      company: 'Quantum Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      experienceLevel: 'Senior',
      salary: '$120k - $180k',
      remote: true,
      quantumScore: 94,
      description: 'Join our revolutionary quantum computing team and build the future of AI-powered job matching.'
    },
    {
      id: '2',
      title: 'AI Research Scientist',
      company: 'Global Innovations',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experienceLevel: 'Mid-Senior',
      salary: '$100k - $150k',
      remote: false,
      quantumScore: 91,
      description: 'Research and develop cutting-edge AI algorithms for the next generation of job matching platforms.'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Tech Solutions Inc',
      location: 'New York, NY',
      type: 'Contract',
      experienceLevel: 'Mid',
      salary: '$80k - $120k',
      remote: true,
      quantumScore: 89,
      description: 'Build scalable web applications using modern technologies and quantum-enhanced algorithms.'
    }
  ];

  res.json({
    success: true,
    data: {
      jobs: mockJobs,
      total: 15847,
      page: 1,
      limit: 20
    },
    quantum: {
      coherence: 0.95,
      processing_time: Date.now()
    }
  });
});

app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalJobs: 15847,
      totalUsers: 28392,
      totalCompanies: 5247,
      successRate: 94.7
    },
    quantum: {
      coherence: 0.95,
      timestamp: Date.now()
    }
  });
});

app.get('/api/research', (req, res) => {
  const query = req.query.query || 'artificial intelligence';
  
  res.json({
    success: true,
    data: {
      query: query,
      totalJobs: 15847,
      averageSalary: '$95,000',
      growthRate: '12.5%',
      topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AI/ML'],
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
      marketInsights: 'The job market shows strong growth in AI and quantum computing roles.',
      quantumAnalysis: 'Quantum-enhanced matching shows 94.7% accuracy in skill alignment.'
    },
    quantum: {
      coherence: 0.95,
      analysis_time: Date.now()
    }
  });
});

// Authentication endpoints (mock)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'user@example.com',
        role: 'job_seeker'
      }
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token',
      user: {
        id: '2',
        email: req.body.email,
        role: 'job_seeker'
      }
    }
  });
});

module.exports = app;
