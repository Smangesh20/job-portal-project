/**
 * Enterprise Performance Monitoring System
 * Google-style performance tracking and optimization
 */

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context: {
    url?: string;
    userId?: string;
    sessionId?: string;
    userAgent?: string;
  };
}

export interface PerformanceThreshold {
  name: string;
  warning: number;
  critical: number;
  unit: string;
}

// Performance thresholds (Google-style)
export const PERFORMANCE_THRESHOLDS: PerformanceThreshold[] = [
  { name: 'first-contentful-paint', warning: 1500, critical: 2500, unit: 'ms' },
  { name: 'largest-contentful-paint', warning: 2500, critical: 4000, unit: 'ms' },
  { name: 'first-input-delay', warning: 100, critical: 300, unit: 'ms' },
  { name: 'cumulative-layout-shift', warning: 0.1, critical: 0.25, unit: 'score' },
  { name: 'time-to-interactive', warning: 3000, critical: 5000, unit: 'ms' },
  { name: 'total-blocking-time', warning: 200, critical: 500, unit: 'ms' }
];

// Performance store
const performanceStore = new Map<string, PerformanceMetric[]>();

class EnterprisePerformanceMonitor {
  private static instance: EnterprisePerformanceMonitor;
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  public static getInstance(): EnterprisePerformanceMonitor {
    if (!EnterprisePerformanceMonitor.instance) {
      EnterprisePerformanceMonitor.instance = new EnterprisePerformanceMonitor();
    }
    return EnterprisePerformanceMonitor.instance;
  }

  // Initialize performance monitoring
  public initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;
    this.setupWebVitals();
    this.setupResourceTiming();
    this.setupNavigationTiming();
    this.setupLongTaskObserver();
    this.setupLayoutShiftObserver();
    this.setupMemoryMonitoring();
  }

  // Setup Web Vitals monitoring
  private setupWebVitals(): void {
    // First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('first-contentful-paint', entry.startTime, 'ms');
        }
      });
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      entries.forEach((entry) => {
        this.recordMetric('largest-contentful-paint', entry.startTime, 'ms');
      });
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach((entry) => {
        const processingStart = (entry as any).processingStart || entry.startTime;
        this.recordMetric('first-input-delay', processingStart - entry.startTime, 'ms');
      });
    });
  }

  // Setup resource timing
  private setupResourceTiming(): void {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry) => {
        const resourceEntry = entry as any;
        const duration = (resourceEntry.responseEnd || 0) - (resourceEntry.requestStart || 0);
        this.recordMetric('resource-load-time', duration, 'ms', {
          url: entry.name,
          userAgent: resourceEntry.initiatorType || 'unknown'
        });
      });
    });
  }

  // Setup navigation timing
  private setupNavigationTiming(): void {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // Time to Interactive
        const tti = navigation.loadEventEnd - navigation.fetchStart;
        this.recordMetric('time-to-interactive', tti, 'ms');

        // DOM Content Loaded
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        this.recordMetric('dom-content-loaded', domContentLoaded, 'ms');

        // Page Load
        const pageLoad = navigation.loadEventEnd - navigation.fetchStart;
        this.recordMetric('page-load', pageLoad, 'ms');
      }
    }
  }

  // Setup long task observer
  private setupLongTaskObserver(): void {
    this.observePerformanceEntry('longtask', (entries) => {
      let totalBlockingTime = 0;
      entries.forEach((entry) => {
        totalBlockingTime += entry.duration - 50; // Tasks over 50ms are considered blocking
      });
      
      if (totalBlockingTime > 0) {
        this.recordMetric('total-blocking-time', totalBlockingTime, 'ms');
      }
    });
  }

  // Setup layout shift observer
  private setupLayoutShiftObserver(): void {
    this.observePerformanceEntry('layout-shift', (entries) => {
      let cumulativeLayoutShift = 0;
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          cumulativeLayoutShift += (entry as any).value;
        }
      });
      
      if (cumulativeLayoutShift > 0) {
        this.recordMetric('cumulative-layout-shift', cumulativeLayoutShift, 'score');
      }
    });
  }

  // Setup memory monitoring
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      setInterval(() => {
        this.recordMetric('memory-used', memory.usedJSHeapSize, 'bytes');
        this.recordMetric('memory-total', memory.totalJSHeapSize, 'bytes');
        this.recordMetric('memory-limit', memory.jsHeapSizeLimit, 'bytes');
      }, 30000); // Every 30 seconds
    }
  }

  // Generic performance entry observer
  private observePerformanceEntry(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ entryTypes: [type] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('🚀 ENTERPRISE: Performance observer setup failed:', error);
    }
  }

  // Record performance metric
  public recordMetric(
    name: string,
    value: number,
    unit: string,
    context: Partial<PerformanceMetric['context']> = {}
  ): void {
    const metric: PerformanceMetric = {
      id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: Date.now(),
      context: {
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...context
      }
    };

    // Store metric
    const metrics = performanceStore.get(name) || [];
    metrics.push(metric);
    
    // Keep only last 1000 metrics per type
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }
    
    performanceStore.set(name, metrics);

    // Check thresholds
    this.checkThresholds(metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ENTERPRISE PERFORMANCE [${name}]:`, value, unit);
    }
  }

  // Check performance thresholds
  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = PERFORMANCE_THRESHOLDS.find(t => t.name === metric.name);
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      console.error(`🚨 ENTERPRISE: Critical performance issue - ${metric.name}: ${metric.value}${metric.unit}`);
      this.alertPerformanceIssue(metric, 'critical');
    } else if (metric.value >= threshold.warning) {
      console.warn(`⚠️ ENTERPRISE: Performance warning - ${metric.name}: ${metric.value}${metric.unit}`);
      this.alertPerformanceIssue(metric, 'warning');
    }
  }

  // Alert performance issues
  private alertPerformanceIssue(metric: PerformanceMetric, severity: 'warning' | 'critical'): void {
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric, severity);
    }
  }

  // Send to monitoring service
  private sendToMonitoringService(metric: PerformanceMetric, severity: string): void {
    // In production, send to monitoring service (e.g., Google Analytics, DataDog, etc.)
    console.log(`🚀 ENTERPRISE: Sending performance data to monitoring service:`, {
      metric: metric.name,
      value: metric.value,
      severity
    });
  }

  // Get performance metrics
  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return performanceStore.get(name) || [];
    }
    
    const allMetrics: PerformanceMetric[] = [];
    performanceStore.forEach(metrics => {
      allMetrics.push(...metrics);
    });
    
    return allMetrics.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get performance summary
  public getPerformanceSummary(): {
    [key: string]: {
      count: number;
      average: number;
      min: number;
      max: number;
      latest: number;
    }
  } {
    const summary: any = {};
    
    performanceStore.forEach((metrics, name) => {
      if (metrics.length === 0) return;
      
      const values = metrics.map(m => m.value);
      summary[name] = {
        count: metrics.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1]
      };
    });
    
    return summary;
  }

  // Cleanup
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    performanceStore.clear();
  }
}

// Singleton instance
export const performanceMonitor = EnterprisePerformanceMonitor.getInstance();

// React hook for performance monitoring (client-side only)
export function usePerformanceMonitor() {
  // This will be implemented in a separate client-side file
  return {
    metrics: performanceMonitor.getMetrics(),
    summary: performanceMonitor.getPerformanceSummary(),
    recordMetric: (name: string, value: number, unit: string, context?: Partial<PerformanceMetric['context']>) => {
      performanceMonitor.recordMetric(name, value, unit, context);
    }
  };
}

// React hooks are imported at the bottom to avoid server-side issues
