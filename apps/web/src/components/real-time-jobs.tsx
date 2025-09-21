/**
 * Real-Time Jobs Component
 * Google-style real-time job updates and live data streaming
 */

'use client'

import { useState, useEffect } from 'react';
import { useRealtime } from '@/hooks/useEnterpriseHooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isNew?: boolean;
  isUpdated?: boolean;
}

export default function RealTimeJobs() {
  const { subscribe, isConnected } = useRealtime();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Real-time job updates
  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to job updates
    const unsubscribe = subscribe('job_update', (data) => {
      console.log('🚀 ENTERPRISE: Real-time job update received:', data);
      
      if (data.type === 'new_job') {
        setJobs(prev => [{
          ...data.job,
          isNew: true
        }, ...prev]);
      } else if (data.type === 'updated_job') {
        setJobs(prev => prev.map(job => 
          job.id === data.job.id 
            ? { ...data.job, isUpdated: true }
            : job
        ));
      } else if (data.type === 'deleted_job') {
        setJobs(prev => prev.filter(job => job.id !== data.job.id));
      }
    });

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [isConnected, subscribe]);

  // Load initial jobs
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        // Simulate API call - in production, use real API
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            salary: '$120,000 - $180,000',
            type: 'Full-time',
            postedAt: '2 hours ago',
            description: 'We are looking for a senior software engineer to join our team...',
            requirements: ['5+ years experience', 'React/Node.js', 'AWS'],
            benefits: ['Health insurance', '401k', 'Remote work']
          },
          {
            id: '2',
            title: 'Product Manager',
            company: 'StartupXYZ',
            location: 'New York, NY',
            salary: '$100,000 - $150,000',
            type: 'Full-time',
            postedAt: '4 hours ago',
            description: 'Lead product development and strategy...',
            requirements: ['3+ years PM experience', 'Analytics', 'Agile'],
            benefits: ['Equity', 'Flexible hours', 'Learning budget']
          }
        ];
        
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterType]);

  // Clear new/updated flags after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(prev => prev.map(job => ({
        ...job,
        isNew: false,
        isUpdated: false
      })));
    }, 5000);

    return () => clearTimeout(timer);
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Jobs</h2>
          <p className="text-gray-600">
            Live job updates powered by enterprise real-time technology
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            className={isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          >
            <Zap className="h-3 w-3 mr-1" />
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs, companies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="relative">
              {job.isNew && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-100 text-green-800 animate-pulse">
                    New
                  </Badge>
                </div>
              )}
              {job.isUpdated && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                    Updated
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-700">
                      {job.company}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{job.salary}</p>
                    <p className="text-sm text-gray-500">{job.type}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.postedAt}
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{job.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Requirements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Benefits</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">Save Job</Button>
                    <Button variant="outline">Share</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
