/**
 * Comprehensive Error Prevention System
 * Handles browser cache, logic breaking, and infinite errors
 */

// @ts-nocheck

interface ErrorLog {
  id: string;
  timestamp: number;
  type: string;
  message: string;
  stack?: string;
  context?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: number;
  cacheControl: string;
}

class ErrorPreventionSystem {
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 1000;
  private cacheConfig: CacheConfig;
  private retryAttempts = new Map<string, number>();
  private circuitBreakers = new Map<string, boolean>();

  constructor() {
    this.cacheConfig = {
      maxAge: 3600, // 1 hour
      staleWhileRevalidate: 7200, // 2 hours
      cacheControl: 'public, max-age=3600, stale-while-revalidate=7200'
    };
    
    this.initializeErrorHandling();
    this.initializeCacheManagement();
    this.initializeCircuitBreakers();
  }

  /**
   * Initialize comprehensive error handling
   */
  private initializeErrorHandling(): void {
    // Global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError({
          type: 'javascript',
          message: event.message,
          stack: event.error?.stack,
          severity: this.determineSeverity(event.error)
        });
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError({
          type: 'promise',
          message: event.reason?.message || 'Unhandled promise rejection',
          stack: event.reason?.stack,
          severity: 'high'
        });
      });

      // Network error handler
      this.setupNetworkErrorHandling();
    }
  }

  /**
   * Setup network error handling with retry logic
   */
  private setupNetworkErrorHandling(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof window.fetch === 'undefined') {
      return
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      const circuitKey = this.getCircuitKey(url);
      
      // Check circuit breaker
      if (this.circuitBreakers.get(circuitKey)) {
        throw new Error(`Circuit breaker open for ${url}`);
      }

      try {
        const response = await this.executeWithRetry(
          () => originalFetch(input, init),
          url
        );
        
        // Reset circuit breaker on success
        this.circuitBreakers.set(circuitKey, false);
        return response;
      } catch (error) {
        this.handleNetworkError(url, error as Error);
        throw error;
      }
    };
  }

  /**
   * Execute function with retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    key: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await this.delay(delay);
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Handle network errors with circuit breaker pattern
   */
  private handleNetworkError(url: string, error: Error): void {
    const circuitKey = this.getCircuitKey(url);
    const attempts = this.retryAttempts.get(circuitKey) || 0;
    
    this.retryAttempts.set(circuitKey, attempts + 1);
    
    // Open circuit breaker after 5 consecutive failures
    if (attempts >= 4) {
      this.circuitBreakers.set(circuitKey, true);
      this.handleError({
        type: 'network',
        message: `Circuit breaker opened for ${url}`,
        severity: 'high'
      });
      
      // Reset circuit breaker after 30 seconds
      setTimeout(() => {
        this.circuitBreakers.set(circuitKey, false);
        this.retryAttempts.set(circuitKey, 0);
      }, 30000);
    }
  }

  /**
   * Initialize cache management system
   */
  private initializeCacheManagement(): void {
    if (typeof window !== 'undefined') {
      // Clear old cache on page load
      this.clearOldCache();
      
      // Setup cache invalidation
      this.setupCacheInvalidation();
      
      // Monitor cache usage
      this.monitorCacheUsage();
    }
  }

  /**
   * Clear old cache entries
   */
  private clearOldCache(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    try {
      const cacheKeys = Object.keys(localStorage);
      const now = Date.now();
      
      cacheKeys.forEach(key => {
        if (key.startsWith('cache_')) {
          try {
            const cached = JSON.parse(localStorage.getItem(key) || '{}');
            if (cached.timestamp && (now - cached.timestamp) > this.cacheConfig.maxAge * 1000) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // Remove corrupted cache entries
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      this.handleError({
        type: 'cache',
        message: 'Failed to clear old cache',
        severity: 'medium'
      });
    }
  }

  /**
   * Setup cache invalidation strategies
   */
  private setupCacheInvalidation(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    // Version-based cache invalidation
    const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
    const cachedVersion = localStorage.getItem('app_version');
    
    if (cachedVersion !== currentVersion) {
      this.clearAllCache();
      localStorage.setItem('app_version', currentVersion);
    }
    
    // Time-based cache invalidation
    setInterval(() => {
      this.clearOldCache();
    }, 300000); // Every 5 minutes
  }

  /**
   * Monitor cache usage and prevent overflow
   */
  private monitorCacheUsage(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    try {
      let totalSize = 0;
      const cacheKeys = Object.keys(localStorage);
      
      cacheKeys.forEach(key => {
        if (key.startsWith('cache_')) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      });
      
      // Clear cache if it exceeds 5MB
      if (totalSize > 5 * 1024 * 1024) {
        this.clearOldCache();
      }
    } catch (error) {
      this.handleError({
        type: 'cache',
        message: 'Failed to monitor cache usage',
        severity: 'medium'
      });
    }
  }

  /**
   * Initialize circuit breakers for different services
   */
  private initializeCircuitBreakers(): void {
    const services = [
      'auth',
      'jobs',
      'search',
      'analytics',
      'notifications'
    ];
    
    services.forEach(service => {
      this.circuitBreakers.set(service, false);
      this.retryAttempts.set(service, 0);
    });
  }

  /**
   * Handle errors with comprehensive logging
   */
  private handleError(error: Partial<ErrorLog>): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      type: error.type || 'unknown',
      message: error.message || 'Unknown error',
      stack: error.stack,
      context: error.context,
      severity: error.severity || 'medium',
      resolved: false
    };
    
    this.errorLogs.push(errorLog);
    
    // Keep only the most recent errors
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      }
    
    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorLog);
    }
    
    // Attempt auto-recovery for certain error types
    this.attemptAutoRecovery(errorLog);
  }

  /**
   * Attempt automatic error recovery
   */
  private attemptAutoRecovery(error: ErrorLog): void {
    switch (error.type) {
      case 'network':
        // Network errors might resolve themselves
        setTimeout(() => {
          this.retryAttempts.set(this.getCircuitKey(''), 0);
        }, 60000);
        break;
        
      case 'cache':
        // Clear problematic cache entries
        this.clearAllCache();
        break;
        
      case 'javascript':
        // Reload page for critical JavaScript errors
        if (error.severity === 'critical' && typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
        break;
    }
  }

  /**
   * Report errors to external service
   */
  private async reportError(error: ErrorLog): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error)
      });
    } catch (reportError) {
      // Silently fail to prevent infinite error loops
      }
  }

  /**
   * Determine error severity
   */
  private determineSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (error?.name === 'ChunkLoadError' || error?.message?.includes('Loading chunk')) {
      return 'high'; // Chunk loading errors are serious
    }
    
    if (error?.message?.includes('Network') || error?.message?.includes('fetch')) {
      return 'medium'; // Network errors are usually temporary
    }
    
    if (error?.message?.includes('Cannot read properties') || error?.message?.includes('undefined')) {
      return 'high'; // Property access errors indicate logic issues
    }
    
    return 'medium';
  }

  /**
   * Get circuit breaker key for URL
   */
  private getCircuitKey(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/')[1] || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Clear all cache entries
   */
  private clearAllCache(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    try {
      const cacheKeys = Object.keys(localStorage);
      cacheKeys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Public API methods
   */
  
  /**
   * Get error logs
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): any {
    const stats = {
      total: this.errorLogs.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      unresolved: this.errorLogs.filter(e => !e.resolved).length
    };
    
    this.errorLogs.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });
    
    return stats;
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string): boolean {
    const error = this.errorLogs.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Clear all error logs
   */
  clearErrorLogs(): void {
    this.errorLogs = [];
  }

  /**
   * Get cache configuration
   */
  getCacheConfig(): CacheConfig {
    return { ...this.cacheConfig };
  }

  /**
   * Update cache configuration
   */
  updateCacheConfig(config: Partial<CacheConfig>): void {
    this.cacheConfig = { ...this.cacheConfig, ...config };
  }

  /**
   * Check if circuit breaker is open for service
   */
  isCircuitBreakerOpen(service: string): boolean {
    return this.circuitBreakers.get(service) || false;
  }

  /**
   * Force close circuit breaker
   */
  closeCircuitBreaker(service: string): void {
    this.circuitBreakers.set(service, false);
    this.retryAttempts.set(service, 0);
  }

  /**
   * Get system health status
   */
  getSystemHealth(): any {
    const stats = this.getErrorStats();
    const openCircuitBreakers = Array.from(this.circuitBreakers.entries())
      .filter(([_, isOpen]) => isOpen)
      .map(([service, _]) => service);
    
    return {
      status: stats.unresolved > 10 || openCircuitBreakers.length > 2 ? 'degraded' : 'healthy',
      errorCount: stats.total,
      unresolvedErrors: stats.unresolved,
      openCircuitBreakers,
      lastError: this.errorLogs[this.errorLogs.length - 1]
    };
  }
}

// Export singleton instance
export const errorPreventionSystem = new ErrorPreventionSystem();
export type { ErrorLog, CacheConfig };
