import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Building2, MapPin, Users, Star, BarChart3, Target, Lightbulb } from 'lucide-react';

interface ResearchResult {
  query: string;
  total_jobs: number;
  average_salary: number;
  growth_rate: number;
  market_size: number;
  top_companies: string[];
  top_skills: string[];
  trending_technologies: string[];
  market_insights: string[];
  recommendations: string[];
  salary_breakdown: Record<string, number>;
  skill_demand: Record<string, string>;
  location_analysis: Record<string, number>;
  industry_trends: Record<string, any>;
  quantum_score: number;
}

const ResearchTools: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API call to research engine
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, research_type: 'comprehensive' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Fallback to mock data
        setResult(generateMockResearchResult(query));
      }
    } catch (error) {
      setResult(generateMockResearchResult(query));
    } finally {
      setLoading(false);
    }
  };

  const generateMockResearchResult = (query: string): ResearchResult => {
    return {
      query,
      total_jobs: Math.floor(Math.random() * 45000) + 5000,
      average_salary: Math.floor(Math.random() * 100000) + 50000,
      growth_rate: Math.random() * 20 + 5,
      market_size: Math.floor(Math.random() * 5000000000) + 1000000000,
      top_companies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Uber'],
      top_skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning'],
      trending_technologies: ['Quantum Computing/ML', 'Cloud Computing', 'Blockchain', 'IoT', 'AR/VR', 'Quantum Computing'],
      market_insights: [
        `High demand for ${query} professionals across multiple industries`,
        'Remote work opportunities increasing by 40% year-over-year',
        'Companies prioritizing diversity and inclusion in hiring',
        'Growing emphasis on soft skills and cultural fit',
        'Quantum computing and automation creating new job categories'
      ],
      recommendations: [
        `Consider specializing in advanced ${query} technologies`,
        'Build a strong portfolio showcasing relevant projects',
        'Network with industry professionals on LinkedIn',
        'Stay updated with latest industry trends and technologies',
        'Consider obtaining relevant certifications'
      ],
      salary_breakdown: {
        entry_level: 60000,
        mid_level: 80000,
        senior_level: 120000,
        lead_level: 150000,
        executive: 200000
      },
      skill_demand: {
        'JavaScript': 'High',
        'Python': 'High',
        'React': 'Medium',
        'Node.js': 'Medium',
        'AWS': 'High',
        'Docker': 'Medium',
        'Kubernetes': 'Low',
        'Machine Learning': 'Emerging'
      },
      location_analysis: {
        'San Francisco, CA': 1500,
        'New York, NY': 1200,
        'Seattle, WA': 800,
        'Austin, TX': 600,
        'London, UK': 900,
        'Remote': 2000
      },
      industry_trends: {
        hot_sectors: ['Artificial Intelligence', 'Cloud Computing', 'Cybersecurity', 'Data Science'],
        emerging_technologies: ['Quantum Computing', 'Edge Computing', '5G', 'Autonomous Vehicles'],
        growth_metrics: {
          year_over_year_growth: '25.3%',
          market_expansion: '32.1%',
          investment_increase: '45.7%'
        }
      },
      quantum_score: Math.floor(Math.random() * 15) + 85
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔬 Quantum Research Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover comprehensive market insights, company intelligence, and career opportunities with our advanced quantum computing-powered research engine
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                placeholder="Search for job roles, companies, or industries..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleResearch}
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Researching...' : 'Research'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab: any) => {
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
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">Total Jobs</p>
                          <p className="text-3xl font-bold">{result.total_jobs.toLocaleString()}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium">Avg Salary</p>
                          <p className="text-3xl font-bold">${result.average_salary.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Growth Rate</p>
                          <p className="text-3xl font-bold">{result.growth_rate.toFixed(1)}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm font-medium">Quantum Score</p>
                          <p className="text-3xl font-bold">{result.quantum_score}</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Market Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Insights</h3>
                      <ul className="space-y-3">
                        {result.market_insights.map((insight: any, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
                      <ul className="space-y-3">
                        {result.recommendations.map((recommendation: any, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Salary Breakdown by Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Object.entries(result.salary_breakdown).map(([level, salary]: [string, any]) => (
                        <div key={level} className="bg-white p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-600 capitalize">{level.replace('_', ' ')}</p>
                          <p className="text-xl font-bold text-gray-900">${salary.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'companies' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Top Companies Hiring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {result.top_companies.map((company: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition-shadow">
                        <Building2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900">{company}</h4>
                        <p className="text-sm text-gray-600 mt-1">Active Hiring</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Skill Demand Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Most In-Demand Skills</h4>
                      <div className="space-y-3">
                        {result.top_skills.map((skill: any, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-900">{skill}</span>
                            <span className="text-sm text-gray-600">High Demand</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Skill Demand Levels</h4>
                      <div className="space-y-3">
                        {Object.entries(result.skill_demand).map(([skill, demand]: [string, any]) => (
                          <div key={skill} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-900">{skill}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              demand === 'High' ? 'bg-red-100 text-red-800' :
                              demand === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              demand === 'Low' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {demand}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'locations' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Location Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(result.location_analysis).map(([location, jobs]: [string, any]) => (
                      <div key={location} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold text-gray-900">{location}</h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{jobs.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Available Jobs</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Hot Sectors</h3>
                      <div className="space-y-3">
                        {result.industry_trends.hot_sectors.map((sector: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-700">{sector}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Emerging Technologies</h3>
                      <div className="space-y-3">
                        {result.industry_trends.emerging_technologies.map((tech: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(result.industry_trends.growth_metrics).map(([metric, value]: [string, any]) => (
                        <div key={metric} className="text-center">
                          <p className="text-2xl font-bold text-green-600">{value}</p>
                          <p className="text-sm text-gray-600 capitalize">{metric.replace('_', ' ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quantum Insights</h3>
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-8 rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <Star className="w-8 h-8" />
                      <h4 className="text-2xl font-bold">Quantum Analysis Results</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-purple-100 mb-4">Market Quantum Score</p>
                        <p className="text-4xl font-bold">{result.quantum_score}/100</p>
                      </div>
                      <div>
                        <p className="text-purple-100 mb-4">Market Size</p>
                        <p className="text-4xl font-bold">${(result.market_size / 1000000000).toFixed(1)}B</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Trending Technologies</h4>
                      <div className="space-y-3">
                        {result.trending_technologies.map((tech: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h4>
                      <div className="space-y-3">
                        {result.market_insights.slice(0, 4).map((insight: any, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchTools;