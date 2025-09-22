'use client'

import { useState, useEffect, useCallback } from 'react';
import { jobsService, Job, JobFilters, JobSearchResult } from '@/lib/jobs-service';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = jobsService.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load jobs
  const loadJobs = useCallback(async (newFilters?: JobFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchFilters = newFilters || filters;
      const result = await jobsService.searchJobs(searchFilters);
      
      setJobs(result.jobs);
      setFilters(result.filters);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Load more jobs
  const loadMoreJobs = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await jobsService.loadMoreJobs();
      
      setJobs(result.jobs);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load more jobs');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // Search jobs
  const searchJobs = useCallback(async (searchFilters: JobFilters) => {
    setFilters(searchFilters);
    await loadJobs(searchFilters);
  }, [loadJobs]);

  // Apply for job
  const applyForJob = useCallback(async (jobId: string) => {
    try {
      const success = await jobsService.applyForJob(jobId);
      if (success) {
        // Jobs will be updated via subscription
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to apply for job');
      return false;
    }
  }, []);

  // Save job
  const saveJob = useCallback(async (jobId: string) => {
    try {
      const success = await jobsService.saveJob(jobId);
      if (success) {
        // Jobs will be updated via subscription
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to save job');
      return false;
    }
  }, []);

  // Get saved jobs
  const getSavedJobs = useCallback(() => {
    return jobsService.getSavedJobs();
  }, []);

  // Get applied jobs
  const getAppliedJobs = useCallback(() => {
    return jobsService.getAppliedJobs();
  }, []);

  // Get recommended jobs
  const getRecommendedJobs = useCallback(() => {
    return jobsService.getRecommendedJobs();
  }, []);

  // Get locations
  const getLocations = useCallback(() => {
    return jobsService.getLocations();
  }, []);

  // Get companies
  const getCompanies = useCallback(() => {
    return jobsService.getCompanies();
  }, []);

  // Get industries
  const getIndustries = useCallback(() => {
    return jobsService.getIndustries();
  }, []);

  // Get tags
  const getTags = useCallback(() => {
    return jobsService.getTags();
  }, []);

  // World data methods
  const getWorldStats = useCallback(() => {
    return jobsService.getWorldStats();
  }, []);

  const getIndianJobs = useCallback(() => {
    return jobsService.getIndianJobs();
  }, []);

  const getGlobalJobs = useCallback(() => {
    return jobsService.getGlobalJobs();
  }, []);

  const getJobsByCountry = useCallback((country: string) => {
    return jobsService.getJobsByCountry(country);
  }, []);

  const getJobsByCity = useCallback((city: string) => {
    return jobsService.getJobsByCity(city);
  }, []);

  const getWorldCompanies = useCallback(() => {
    return jobsService.getWorldCompanies();
  }, []);

  const getIndianCompanies = useCallback(() => {
    return jobsService.getIndianCompanies();
  }, []);

  return {
    jobs,
    isLoading,
    error,
    filters,
    hasMore,
    total,
    loadJobs,
    loadMoreJobs,
    searchJobs,
    applyForJob,
    saveJob,
    getSavedJobs,
    getAppliedJobs,
    getRecommendedJobs,
    getLocations,
    getCompanies,
    getIndustries,
    getTags,
    getWorldStats,
    getIndianJobs,
    getGlobalJobs,
    getJobsByCountry,
    getJobsByCity,
    getWorldCompanies,
    getIndianCompanies,
    clearError: () => setError(null)
  };
}
