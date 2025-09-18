import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Star, 
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
  applications: number;
  views: number;
  matches: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  title: string;
  experience: string;
  skills: string[];
  matchScore: number;
  status: 'new' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: string;
  location: string;
  salary: string;
}

interface Analytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  hiredCandidates: number;
  averageTimeToHire: number;
  topPerformingJobs: JobPosting[];
  candidatePipeline: {
    new: number;
    reviewed: number;
    interviewed: number;
    hired: number;
    rejected: number;
  };
}

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load mock data
    loadAnalytics();
    loadJobPostings();
    loadCandidates();
  }, []);

  const loadAnalytics = () => {
    setAnalytics({
      totalJobs: 24,
      activeJobs: 18,
      totalApplications: 1247,
      newApplications: 89,
      hiredCandidates: 12,
      averageTimeToHire: 14,
      topPerformingJobs: [
        { id: '1', title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120k-150k', type: 'Full-time', status: 'active', postedDate: '2024-01-15', applications: 156, views: 892, matches: 23 },
        { id: '2', title: 'Product Manager', company: 'TechCorp', location: 'New York, NY', salary: '$130k-170k', type: 'Full-time', status: 'active', postedDate: '2024-01-20', applications: 98, views: 567, matches: 18 },
        { id: '3', title: 'DevOps Engineer', company: 'TechCorp', location: 'Remote', salary: '$110k-140k', type: 'Full-time', status: 'active', postedDate: '2024-01-25', applications: 67, views: 423, matches: 15 }
      ],
      candidatePipeline: {
        new: 89,
        reviewed: 45,
        interviewed: 23,
        hired: 12,
        rejected: 156
      }
    });
  };

  const loadJobPostings = () => {
    setJobPostings([
      { id: '1', title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120k-150k', type: 'Full-time', status: 'active', postedDate: '2024-01-15', applications: 156, views: 892, matches: 23 },
      { id: '2', title: 'Product Manager', company: 'TechCorp', location: 'New York, NY', salary: '$130k-170k', type: 'Full-time', status: 'active', postedDate: '2024-01-20', applications: 98, views: 567, matches: 18 },
      { id: '3', title: 'DevOps Engineer', company: 'TechCorp', location: 'Remote', salary: '$110k-140k', type: 'Full-time', status: 'active', postedDate: '2024-01-25', applications: 67, views: 423, matches: 15 },
      { id: '4', title: 'UX Designer', company: 'TechCorp', location: 'Austin, TX', salary: '$90k-120k', type: 'Full-time', status: 'paused', postedDate: '2024-01-10', applications: 45, views: 234, matches: 8 },
      { id: '5', title: 'Data Scientist', company: 'TechCorp', location: 'Seattle, WA', salary: '$140k-180k', type: 'Full-time', status: 'closed', postedDate: '2024-01-05', applications: 89, views: 456, matches: 12 }
    ]);
  };

  const loadCandidates = () => {
    setCandidates([
      { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', title: 'Senior React Developer', experience: '5 years', skills: ['React', 'TypeScript', 'Node.js', 'AWS'], matchScore: 95, status: 'interviewed', appliedDate: '2024-01-28', location: 'San Francisco, CA', salary: '$135k' },
      { id: '2', name: 'Michael Chen', email: 'm.chen@email.com', title: 'Product Manager', experience: '7 years', skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'], matchScore: 92, status: 'reviewed', appliedDate: '2024-01-27', location: 'New York, NY', salary: '$155k' },
      { id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', title: 'DevOps Engineer', experience: '4 years', skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'], matchScore: 88, status: 'new', appliedDate: '2024-01-29', location: 'Remote', salary: '$125k' },
      { id: '4', name: 'David Kim', email: 'd.kim@email.com', title: 'UX Designer', experience: '6 years', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], matchScore: 90, status: 'hired', appliedDate: '2024-01-26', location: 'Austin, TX', salary: '$110k' },
      { id: '5', name: 'Lisa Wang', email: 'lisa.w@email.com', title: 'Data Scientist', experience: '8 years', skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'], matchScore: 94, status: 'rejected', appliedDate: '2024-01-25', location: 'Seattle, WA', salary: '$165k' }
    ]);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesJob = selectedJob === 'all' || candidate.title.toLowerCase().includes(selectedJob.toLowerCase());
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJob && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'reviewed': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'interviewed': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'hired': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and candidates</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.activeJobs}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalApplications}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.newApplications}</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hired Candidates</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.hiredCandidates}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Candidate Pipeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Candidate Pipeline</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(analytics.candidatePipeline).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      status === 'new' ? 'bg-blue-100' :
                      status === 'reviewed' ? 'bg-yellow-100' :
                      status === 'interviewed' ? 'bg-purple-100' :
                      status === 'hired' ? 'bg-green-100' :
                      'bg-red-100'
                    }`}>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Jobs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Jobs</h3>
              <div className="space-y-4">
                {analytics.topPerformingJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.location} • {job.salary}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{job.applications} applications</span>
                      <span>{job.views} views</span>
                      <span className="text-green-600 font-medium">{job.matches} matches</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Job Postings Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
              <div className="flex gap-4">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Job
                </button>
              </div>
            </div>

            {/* Job Postings Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobPostings.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.salary}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{job.applications}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-green-600">{job.matches} matches</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Candidates Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
              <div className="flex gap-4">
                <select 
                  value={selectedJob} 
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">All Jobs</option>
                  {jobPostings.map(job => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                </select>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-500">{candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.title}</div>
                          <div className="text-sm text-gray-500">{candidate.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.experience}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${candidate.matchScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{candidate.matchScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(candidate.status)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.appliedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            
            {/* Analytics Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications Over Time</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart will be implemented here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Sources</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart will be implemented here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">14 days</div>
                  <div className="text-sm text-gray-600">Average Time to Hire</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">12.5%</div>
                  <div className="text-sm text-gray-600">Hire Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-gray-600">Candidate Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
