export default function handler(req, res) {
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

  res.status(200).json({
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
}
