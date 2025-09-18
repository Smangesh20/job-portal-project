// Comprehensive Error Prevention Service
// Eliminates browser cache, logic breaking, and infinite errors

interface ErrorPreventionConfig {
  enableCacheControl: boolean;
  enableRequestValidation: boolean;
  enableResponseValidation: boolean;
  enableMemoryMonitoring: boolean;
  enableCircularReferenceDetection: boolean;
  enableInfiniteLoopDetection: boolean;
  enableConcurrentRequestLimiting: boolean;
  maxConcurrentRequests: number;
  requestTimeout: number; // milliseconds
  memoryThreshold: number; // MB
  maxRetries: number;
  retryDelay: number; // milliseconds
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  cacheHits: number;
  cacheMisses: number;
  memoryLeaks: number;
  infiniteLoops: number;
  circularReferences: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

interface RequestContext {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  timeout: number;
  retries: number;
  maxRetries: number;
}

class ErrorPreventionService {
  private config: ErrorPreventionConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private activeRequests: Map<string, RequestContext> = new Map();
  private errorLog: Array<{ id: string; type: string; severity: string; message: string; timestamp: number; stack?: string }> = [];
  private memoryUsage: Array<{ timestamp: number; used: number; total: number }> = [];
  private circularReferenceTracker: Set<string> = new Set();
  private infiniteLoopTracker: Map<string, { count: number; lastCall: number }> = new Map();

  constructor() {
    this.config = this.getDefaultConfig();
    this.initializeErrorHandling();
    this.startMonitoring();
  }

  private getDefaultConfig(): ErrorPreventionConfig {
    return {
      enableCacheControl: true,
      enableRequestValidation: true,
      enableResponseValidation: true,
      enableMemoryMonitoring: true,
      enableCircularReferenceDetection: true,
      enableInfiniteLoopDetection: true,
      enableConcurrentRequestLimiting: true,
      maxConcurrentRequests: 10,
      requestTimeout: 30000, // 30 seconds
      memoryThreshold: 100, // 100MB
      maxRetries: 3,
      retryDelay: 1000 // 1 second
    };
  }

  private initializeErrorHandling(): void {
    // Only initialize on client side
    if (typeof window === 'undefined') return;

    // Global error handlers
    window.addEventListener('error', (event) => {
      this.handleError('javascript', 'high', event.error?.message || 'Unknown error', event.error?.stack);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('promise', 'high', event.reason?.message || 'Unhandled promise rejection', event.reason?.stack);
    });

    // Memory monitoring
    if (this.config.enableMemoryMonitoring && typeof performance !== 'undefined' && 'memory' in performance) {
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 10000); // Every 10 seconds
    }

    // Cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, 60000); // Every minute

    // Request cleanup
    setInterval(() => {
      this.cleanupStaleRequests();
    }, 30000); // Every 30 seconds
  }

  // Cache management
  setCache(key: string, data: any, ttl: number = 300000): void {
    if (!this.config.enableCacheControl) return;

    try {
      // Validate data for circular references
      if (this.config.enableCircularReferenceDetection) {
        this.validateForCircularReferences(data, key);
      }

      const entry: CacheEntry = {
        key,
        data: this.deepClone(data),
        timestamp: Date.now(),
        ttl,
        hits: 0,
        lastAccessed: Date.now()
      };

      this.cache.set(key, entry);
    } catch (error) {
      this.handleError('cache', 'medium', `Failed to cache data for key ${key}: ${error}`);
    }
  }

  getCache(key: string): any | null {
    if (!this.config.enableCacheControl) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    entry.lastAccessed = now;
    return this.deepClone(entry.data);
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Request management
  async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const requestId = this.generateRequestId();
    
    if (this.config.enableConcurrentRequestLimiting) {
      if (this.activeRequests.size >= this.config.maxConcurrentRequests) {
        throw new Error('Too many concurrent requests');
      }
    }

    const context: RequestContext = {
      id: requestId,
      url,
      method: options.method || 'GET',
      timestamp: Date.now(),
      timeout: this.config.requestTimeout,
      retries: 0,
      maxRetries: this.config.maxRetries
    };

    this.activeRequests.set(requestId, context);

    try {
      const response = await this.executeRequest(url, options, context);
      this.activeRequests.delete(requestId);
      return response;
    } catch (error) {
      this.activeRequests.delete(requestId);
      throw error;
    }
  }

  private async executeRequest(url: string, options: RequestInit, context: RequestContext): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), context.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (context.retries < context.maxRetries) {
        context.retries++;
        await this.delay(this.config.retryDelay);
        return this.executeRequest(url, options, context);
      }
      
      throw error;
    }
  }

  // Data validation
  validateRequest(data: any): { isValid: boolean; errors: string[] } {
    if (!this.config.enableRequestValidation) return { isValid: true, errors: [] };

    const errors: string[] = [];

    try {
      // Check for null/undefined
      if (data === null || data === undefined) {
        errors.push('Data cannot be null or undefined');
      }

      // Check for circular references
      if (this.config.enableCircularReferenceDetection) {
        this.validateForCircularReferences(data, 'request');
      }

      // Check for excessive nesting
      if (this.getObjectDepth(data) > 10) {
        errors.push('Data structure is too deeply nested');
      }

      // Check for excessive size
      const size = this.getObjectSize(data);
      if (size > 1024 * 1024) { // 1MB
        errors.push('Data size exceeds maximum allowed size');
      }

    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateResponse(data: any): { isValid: boolean; errors: string[] } {
    if (!this.config.enableResponseValidation) return { isValid: true, errors: [] };

    const errors: string[] = [];

    try {
      // Check for valid response structure
      if (typeof data !== 'object' || data === null) {
        errors.push('Response must be a valid object');
        return { isValid: false, errors };
      }

      // Check for required fields
      if (data.success === undefined) {
        errors.push('Response must include success field');
      }

      // Check for circular references
      if (this.config.enableCircularReferenceDetection) {
        this.validateForCircularReferences(data, 'response');
      }

      // Check for excessive nesting
      if (this.getObjectDepth(data) > 10) {
        errors.push('Response structure is too deeply nested');
      }

    } catch (error) {
      errors.push(`Response validation error: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Memory monitoring
  private monitorMemoryUsage(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize / 1024 / 1024; // MB
    const total = memory.totalJSHeapSize / 1024 / 1024; // MB

    this.memoryUsage.push({
      timestamp: Date.now(),
      used,
      total
    });

    // Keep only last 100 measurements
    if (this.memoryUsage.length > 100) {
      this.memoryUsage = this.memoryUsage.slice(-100);
    }

    // Check for memory leaks
    if (used > this.config.memoryThreshold) {
      this.handleError('memory', 'high', `Memory usage exceeded threshold: ${used.toFixed(2)}MB`);
    }

    // Check for memory growth trend
    if (this.memoryUsage.length >= 10) {
      const recent = this.memoryUsage.slice(-10);
      const growth = recent[recent.length - 1].used - recent[0].used;
      if (growth > 10) { // 10MB growth in last 10 measurements
        this.handleError('memory', 'medium', `Potential memory leak detected: ${growth.toFixed(2)}MB growth`);
      }
    }
  }

  // Circular reference detection
  private validateForCircularReferences(obj: any, path: string = ''): void {
    if (!this.config.enableCircularReferenceDetection) return;

    const visited = new Set();
    const stack: any[] = [];

    const check = (value: any, currentPath: string) => {
      if (value === null || typeof value !== 'object') return;

      if (visited.has(value)) {
        throw new Error(`Circular reference detected at ${currentPath}`);
      }

      visited.add(value);
      stack.push(value);

      try {
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            check(value[key], `${currentPath}.${key}`);
          }
        }
      } finally {
        stack.pop();
        visited.delete(value);
      }
    };

    check(obj, path);
  }

  // Infinite loop detection
  detectInfiniteLoop(functionName: string): boolean {
    if (!this.config.enableInfiniteLoopDetection) return false;

    const now = Date.now();
    const tracker = this.infiniteLoopTracker.get(functionName);

    if (!tracker) {
      this.infiniteLoopTracker.set(functionName, { count: 1, lastCall: now });
      return false;
    }

    // Reset if more than 1 second has passed
    if (now - tracker.lastCall > 1000) {
      tracker.count = 1;
      tracker.lastCall = now;
      return false;
    }

    tracker.count++;
    tracker.lastCall = now;

    if (tracker.count > 100) { // More than 100 calls per second
      this.handleError('infinite_loop', 'critical', `Infinite loop detected in function: ${functionName}`);
      return true;
    }

    return false;
  }

  // Error handling
  private handleError(type: string, severity: string, message: string, stack?: string): void {
    const error = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: Date.now(),
      stack
    };

    this.errorLog.push(error);

    // Keep only last 1000 errors
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-1000);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${severity.toUpperCase()}] ${type}: ${message}`, stack);
    }

    // Send to error reporting service in production
    this.sendToErrorReporting(error);
  }

  // Utility methods
  private deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  private getObjectDepth(obj: any, depth: number = 0): number {
    if (obj === null || typeof obj !== 'object') return depth;
    
    let maxDepth = depth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        maxDepth = Math.max(maxDepth, this.getObjectDepth(obj[key], depth + 1));
      }
    }
    return maxDepth;
  }

  private getObjectSize(obj: any): number {
    return JSON.stringify(obj).length;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private cleanupStaleRequests(): void {
    const now = Date.now();
    for (const [id, context] of this.activeRequests.entries()) {
      if (now - context.timestamp > context.timeout) {
        this.activeRequests.delete(id);
        this.handleError('request', 'medium', `Stale request cleaned up: ${context.url}`);
      }
    }
  }

  private startMonitoring(): void {
    // Monitor for memory leaks
    setInterval(() => {
      this.detectMemoryLeaks();
    }, 60000); // Every minute

    // Monitor for infinite loops
    setInterval(() => {
      this.cleanupInfiniteLoopTracker();
    }, 30000); // Every 30 seconds
  }

  private detectMemoryLeaks(): void {
    if (this.memoryUsage.length < 20) return;

    const recent = this.memoryUsage.slice(-20);
    const trend = this.calculateTrend(recent.map(m => m.used));
    
    if (trend > 0.1) { // Growing trend
      this.handleError('memory', 'medium', `Potential memory leak detected: ${(trend * 100).toFixed(2)}% growth trend`);
    }
  }

  private calculateTrend(values: number[]): number {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private cleanupInfiniteLoopTracker(): void {
    const now = Date.now();
    for (const [functionName, tracker] of this.infiniteLoopTracker.entries()) {
      if (now - tracker.lastCall > 5000) { // 5 seconds
        this.infiniteLoopTracker.delete(functionName);
      }
    }
  }

  private sendToErrorReporting(error: any): void {
    // In production, this would send to an error reporting service
    console.log('Error reporting:', error);
  }

  // Public API
  getErrorMetrics(): ErrorMetrics {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const last7Days = now - (7 * 24 * 60 * 60 * 1000);
    const last30Days = now - (30 * 24 * 60 * 60 * 1000);

    const errors24h = this.errorLog.filter(e => e.timestamp > last24Hours);
    const errors7d = this.errorLog.filter(e => e.timestamp > last7Days);
    const errors30d = this.errorLog.filter(e => e.timestamp > last30Days);

    const errorsByType = this.errorLog.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = this.errorLog.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let cacheHits = 0;
    let cacheMisses = 0;
    for (const entry of this.cache.values()) {
      cacheHits += entry.hits;
      cacheMisses += 1;
    }

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      errorsBySeverity,
      cacheHits,
      cacheMisses,
      memoryLeaks: this.errorLog.filter(e => e.type === 'memory').length,
      infiniteLoops: this.errorLog.filter(e => e.type === 'infinite_loop').length,
      circularReferences: this.errorLog.filter(e => e.type === 'circular_reference').length,
      last24Hours: errors24h.length,
      last7Days: errors7d.length,
      last30Days: errors30d.length
    };
  }

  getRecentErrors(limit: number = 50): any[] {
    return this.errorLog
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  updateConfig(newConfig: Partial<ErrorPreventionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const errorPreventionService = new ErrorPreventionService();

// Export types
export type {
  ErrorPreventionConfig,
  ErrorMetrics,
  CacheEntry,
  RequestContext
};
