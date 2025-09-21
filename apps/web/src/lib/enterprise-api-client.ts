/**
 * Enterprise API Client
 * Google-style real-time data integration with comprehensive error handling
 */

import { realtimeManager } from './realtime';
import { errorHandler } from './error-handler';
import { cacheManager } from './cache';
import { performanceMonitor } from './performance';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: number;
    requestId: string;
    version: string;
    cache?: {
      hit: boolean;
      ttl: number;
    };
  };
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  cache?: boolean;
  ttl?: number;
  retries?: number;
  timeout?: number;
}

// API configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retries: 3,
  cacheTTL: 300000, // 5 minutes
  realtimeEnabled: true
};

class EnterpriseAPIClient {
  private static instance: EnterpriseAPIClient;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private requestCount = 0;

  public static getInstance(): EnterpriseAPIClient {
    if (!EnterpriseAPIClient.instance) {
      EnterpriseAPIClient.instance = new EnterpriseAPIClient();
    }
    return EnterpriseAPIClient.instance;
  }

  // Make API request
  public async request<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = performance.now();
    
    try {
      // Check cache first
      if (request.cache !== false) {
        const cacheKey = this.generateCacheKey(request);
        const cached = cacheManager.get<APIResponse<T>>(cacheKey);
        
        if (cached) {
          performanceMonitor.recordMetric('api-cache-hit', 1, 'count');
          return {
            ...cached,
            metadata: {
              ...cached.metadata,
              cache: { hit: true, ttl: request.ttl || API_CONFIG.cacheTTL }
            }
          };
        }
      }

      // Check for duplicate requests
      if (this.requestQueue.has(request.url)) {
        return await this.requestQueue.get(request.url);
      }

      // Create request promise
      const requestPromise = this.executeRequest<T>(request, requestId);
      this.requestQueue.set(request.url, requestPromise);

      try {
        const response = await requestPromise;
        
        // Cache successful responses
        if (request.cache !== false && response.success) {
          const cacheKey = this.generateCacheKey(request);
          cacheManager.set(cacheKey, response, {
            ttl: request.ttl || API_CONFIG.cacheTTL,
            tags: ['api', request.method.toLowerCase(), request.url]
          });
        }

        // Record performance metrics
        const duration = performance.now() - startTime;
        performanceMonitor.recordMetric('api-response-time', duration, 'ms', {
          url: request.url,
          userAgent: request.headers?.['user-agent'] || ''
        });

        return response;
      } finally {
        this.requestQueue.delete(request.url);
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric('api-error', 1, 'count', {
        url: request.url,
        userAgent: request.headers?.['user-agent'] || ''
      });

      const errorResult = errorHandler.handleAPIError(error, {
        requestId,
        url: request.url,
        method: request.method,
        timestamp: Date.now()
      });

      return {
        success: false,
        error: {
          code: errorResult.statusCode.toString(),
          message: errorResult.userMessage,
          details: error
        },
        metadata: {
          timestamp: Date.now(),
          requestId,
          version: '1.0.0'
        }
      };
    }
  }

  // Execute actual request
  private async executeRequest<T>(request: APIRequest, requestId: string): Promise<APIResponse<T>> {
    const url = `${API_CONFIG.baseURL}${request.url}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Client-Version': '1.0.0',
      ...request.headers
    };

    // Add authentication token
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), request.timeout || API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        method: request.method,
        headers,
        body: request.data ? JSON.stringify(request.data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        metadata: {
          timestamp: Date.now(),
          requestId,
          version: '1.0.0'
        }
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Real-time data methods
  public async getJobs(filters: any = {}): Promise<APIResponse<any[]>> {
    return this.request({
      method: 'GET',
      url: '/api/jobs',
      data: filters,
      cache: true,
      ttl: 60000 // 1 minute cache for jobs
    });
  }

  public async getJob(id: string): Promise<APIResponse<any>> {
    return this.request({
      method: 'GET',
      url: `/api/jobs/${id}`,
      cache: true,
      ttl: 300000 // 5 minutes cache for job details
    });
  }

  public async createJob(jobData: any): Promise<APIResponse<any>> {
    const response = await this.request({
      method: 'POST',
      url: '/api/jobs',
      data: jobData,
      cache: false
    });

    // Invalidate jobs cache
    if (response.success) {
      cacheManager.invalidateByTags(['api', 'jobs']);
    }

    return response;
  }

  public async updateJob(id: string, jobData: any): Promise<APIResponse<any>> {
    const response = await this.request({
      method: 'PUT',
      url: `/api/jobs/${id}`,
      data: jobData,
      cache: false
    });

    // Invalidate caches
    if (response.success) {
      cacheManager.invalidateByTags(['api', 'jobs']);
      cacheManager.invalidateByPattern(`job_${id}`);
    }

    return response;
  }

  public async deleteJob(id: string): Promise<APIResponse<void>> {
    const response = await this.request({
      method: 'DELETE',
      url: `/api/jobs/${id}`,
      cache: false
    });

    // Invalidate caches
    if (response.success) {
      cacheManager.invalidateByTags(['api', 'jobs']);
      cacheManager.invalidateByPattern(`job_${id}`);
    }

    return response;
  }

  // User management
  public async getUsers(filters: any = {}): Promise<APIResponse<any[]>> {
    return this.request({
      method: 'GET',
      url: '/api/users',
      data: filters,
      cache: true,
      ttl: 300000
    });
  }

  public async getUser(id: string): Promise<APIResponse<any>> {
    return this.request({
      method: 'GET',
      url: `/api/users/${id}`,
      cache: true,
      ttl: 600000 // 10 minutes cache for user data
    });
  }

  public async updateUser(id: string, userData: any): Promise<APIResponse<any>> {
    const response = await this.request({
      method: 'PUT',
      url: `/api/users/${id}`,
      data: userData,
      cache: false
    });

    if (response.success) {
      cacheManager.invalidateByTags(['api', 'users']);
      cacheManager.invalidateByPattern(`user_${id}`);
    }

    return response;
  }

  // Analytics and reporting
  public async getAnalytics(period: string = '7d'): Promise<APIResponse<any>> {
    return this.request({
      method: 'GET',
      url: `/api/analytics?period=${period}`,
      cache: true,
      ttl: 300000
    });
  }

  public async getReports(type: string, filters: any = {}): Promise<APIResponse<any[]>> {
    return this.request({
      method: 'GET',
      url: `/api/reports/${type}`,
      data: filters,
      cache: true,
      ttl: 600000
    });
  }

  // Real-time subscriptions
  public subscribeToJobs(callback: (data: any) => void): () => void {
    if (!API_CONFIG.realtimeEnabled) {
      console.warn('🚀 ENTERPRISE: Real-time disabled');
      return () => {};
    }

    return realtimeManager.subscribe('job_update', callback).unsubscribe;
  }

  public subscribeToNotifications(callback: (data: any) => void): () => void {
    if (!API_CONFIG.realtimeEnabled) {
      console.warn('🚀 ENTERPRISE: Real-time disabled');
      return () => {};
    }

    return realtimeManager.subscribe('notification', callback).unsubscribe;
  }

  public subscribeToUserActivity(callback: (data: any) => void): () => void {
    if (!API_CONFIG.realtimeEnabled) {
      console.warn('🚀 ENTERPRISE: Real-time disabled');
      return () => {};
    }

    return realtimeManager.subscribe('user_activity', callback).unsubscribe;
  }

  // Utility methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestCount}`;
  }

  private generateCacheKey(request: APIRequest): string {
    const key = `${request.method}_${request.url}_${JSON.stringify(request.data || {})}`;
    return `api_${btoa(key).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  // Health check
  public async healthCheck(): Promise<APIResponse<any>> {
    return this.request({
      method: 'GET',
      url: '/api/health',
      cache: false
    });
  }

  // Get API statistics
  public getAPIStatistics(): {
    totalRequests: number;
    cacheHitRate: number;
    averageResponseTime: number;
    errorRate: number;
  } {
    const cacheStats = cacheManager.getStats();
    const performanceMetrics = performanceMonitor.getMetrics('api-response-time');
    
    const totalRequests = this.requestCount;
    const cacheHitRate = cacheStats.hitRate;
    const averageResponseTime = performanceMetrics.length > 0 
      ? performanceMetrics.reduce((sum, m) => sum + m.value, 0) / performanceMetrics.length 
      : 0;
    const errorRate = 0; // Calculate from error metrics

    return {
      totalRequests,
      cacheHitRate,
      averageResponseTime,
      errorRate
    };
  }
}

// Singleton instance
export const enterpriseAPIClient = EnterpriseAPIClient.getInstance();

// React hook for API client (client-side only)
export function useEnterpriseAPI() {
  // This will be implemented in a separate client-side file
  return {
    isConnected: true,
    statistics: enterpriseAPIClient.getAPIStatistics(),
    client: enterpriseAPIClient
  };
}

// React hooks are imported at the bottom to avoid server-side issues
