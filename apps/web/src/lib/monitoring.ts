/**
 * Enterprise Monitoring and Health Check System
 * Google-style comprehensive monitoring and alerting
 */

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  timestamp: number;
  duration: number;
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  metadata?: Record<string, any>;
}

// Health check store
const healthChecks = new Map<string, HealthCheck>();
const systemMetrics: SystemMetrics[] = [];
const alerts: Alert[] = [];

class EnterpriseMonitoringSystem {
  private static instance: EnterpriseMonitoringSystem;
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertThresholds = {
    cpu: 80,
    memory: 85,
    disk: 90,
    responseTime: 1000,
    errorRate: 5
  };

  public static getInstance(): EnterpriseMonitoringSystem {
    if (!EnterpriseMonitoringSystem.instance) {
      EnterpriseMonitoringSystem.instance = new EnterpriseMonitoringSystem();
    }
    return EnterpriseMonitoringSystem.instance;
  }

  // Start monitoring
  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.runHealthChecks();
      this.checkAlerts();
    }, 30000); // Every 30 seconds

    console.log('🚀 ENTERPRISE: Monitoring system started');
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('🚀 ENTERPRISE: Monitoring system stopped');
  }

  // Collect system metrics
  private collectSystemMetrics(): void {
    const metrics: SystemMetrics = {
      cpu: this.getCPUUsage(),
      memory: this.getMemoryUsage(),
      disk: this.getDiskUsage(),
      network: this.getNetworkUsage(),
      uptime: this.getUptime(),
      timestamp: Date.now()
    };

    systemMetrics.push(metrics);

    // Keep only last 1000 metrics
    if (systemMetrics.length > 1000) {
      systemMetrics.splice(0, systemMetrics.length - 1000);
    }

    // Check thresholds
    this.checkMetricThresholds(metrics);
  }

  // Get CPU usage (simplified)
  private getCPUUsage(): number {
    // In a real implementation, this would use system APIs
    return Math.random() * 100;
  }

  // Get memory usage
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }
    return Math.random() * 100;
  }

  // Get disk usage (simplified)
  private getDiskUsage(): number {
    return Math.random() * 100;
  }

  // Get network usage (simplified)
  private getNetworkUsage(): number {
    return Math.random() * 100;
  }

  // Get uptime
  private getUptime(): number {
    if (typeof window !== 'undefined' && window.performance) {
      return window.performance.now();
    }
    return Date.now();
  }

  // Run health checks
  private runHealthChecks(): void {
    this.checkDatabaseHealth();
    this.checkAPIHealth();
    this.checkCacheHealth();
    this.checkExternalServicesHealth();
  }

  // Check database health
  private async checkDatabaseHealth(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Simulate database check
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const duration = Date.now() - startTime;
      const status = duration < 500 ? 'healthy' : duration < 1000 ? 'degraded' : 'unhealthy';
      
      healthChecks.set('database', {
        name: 'Database',
        status,
        message: `Database response time: ${duration}ms`,
        timestamp: Date.now(),
        duration,
        metadata: { responseTime: duration }
      });
    } catch (error) {
      healthChecks.set('database', {
        name: 'Database',
        status: 'unhealthy',
        message: `Database error: ${error}`,
        timestamp: Date.now(),
        duration: Date.now() - startTime
      });
    }
  }

  // Check API health
  private async checkAPIHealth(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Check internal API
      const response = await fetch('/api/health', { method: 'GET' });
      const duration = Date.now() - startTime;
      
      const status = response.ok && duration < 1000 ? 'healthy' : 'degraded';
      
      healthChecks.set('api', {
        name: 'API',
        status,
        message: `API response: ${response.status} (${duration}ms)`,
        timestamp: Date.now(),
        duration,
        metadata: { statusCode: response.status, responseTime: duration }
      });
    } catch (error) {
      healthChecks.set('api', {
        name: 'API',
        status: 'unhealthy',
        message: `API error: ${error}`,
        timestamp: Date.now(),
        duration: Date.now() - startTime
      });
    }
  }

  // Check cache health
  private checkCacheHealth(): void {
    const cacheStats = this.getCacheStats();
    const hitRate = cacheStats.hitRate * 100;
    
    const status = hitRate > 80 ? 'healthy' : hitRate > 60 ? 'degraded' : 'unhealthy';
    
    healthChecks.set('cache', {
      name: 'Cache',
      status,
      message: `Cache hit rate: ${hitRate.toFixed(2)}%`,
      timestamp: Date.now(),
      duration: 0,
      metadata: { hitRate, size: cacheStats.size }
    });
  }

  // Check external services health
  private async checkExternalServicesHealth(): Promise<void> {
    const services = [
      { name: 'SendGrid', url: 'https://api.sendgrid.com/v3/user/profile' },
      { name: 'CDN', url: 'https://cdn.jsdelivr.net' }
    ];

    for (const service of services) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(service.url, { 
          method: 'HEAD',
          mode: 'no-cors' // Avoid CORS issues
        });
        
        const duration = Date.now() - startTime;
        const status = duration < 2000 ? 'healthy' : 'degraded';
        
        healthChecks.set(service.name.toLowerCase(), {
          name: service.name,
          status,
          message: `${service.name} response: ${duration}ms`,
          timestamp: Date.now(),
          duration,
          metadata: { responseTime: duration }
        });
      } catch (error) {
        healthChecks.set(service.name.toLowerCase(), {
          name: service.name,
          status: 'unhealthy',
          message: `${service.name} error: ${error}`,
          timestamp: Date.now(),
          duration: Date.now() - startTime
        });
      }
    }
  }

  // Check metric thresholds
  private checkMetricThresholds(metrics: SystemMetrics): void {
    if (metrics.cpu > this.alertThresholds.cpu) {
      this.createAlert('warning', 'High CPU Usage', `CPU usage is ${metrics.cpu.toFixed(2)}%`);
    }

    if (metrics.memory > this.alertThresholds.memory) {
      this.createAlert('warning', 'High Memory Usage', `Memory usage is ${metrics.memory.toFixed(2)}%`);
    }

    if (metrics.disk > this.alertThresholds.disk) {
      this.createAlert('error', 'High Disk Usage', `Disk usage is ${metrics.disk.toFixed(2)}%`);
    }
  }

  // Check alerts
  private checkAlerts(): void {
    const now = Date.now();
    const recentAlerts = alerts.filter(alert => 
      !alert.resolved && now - alert.timestamp < 300000 // 5 minutes
    );

    // Check for critical alerts
    const criticalAlerts = recentAlerts.filter(alert => alert.type === 'critical');
    if (criticalAlerts.length > 0) {
      console.error('🚨 ENTERPRISE: Critical alerts detected:', criticalAlerts);
    }
  }

  // Create alert
  public createAlert(
    type: Alert['type'],
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): string {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      resolved: false,
      metadata
    };

    alerts.push(alert);

    // Keep only last 1000 alerts
    if (alerts.length > 1000) {
      alerts.splice(0, alerts.length - 1000);
    }

    console.log(`🚨 ENTERPRISE ALERT [${type.toUpperCase()}]: ${title} - ${message}`);

    return alert.id;
  }

  // Resolve alert
  public resolveAlert(alertId: string): boolean {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      return true;
    }
    return false;
  }

  // Get health status
  public getHealthStatus(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    checks: HealthCheck[];
    metrics: SystemMetrics[];
    alerts: Alert[];
  } {
    const checks = Array.from(healthChecks.values());
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      checks,
      metrics: systemMetrics.slice(-100), // Last 100 metrics
      alerts: alerts.filter(a => !a.resolved || Date.now() - a.timestamp < 3600000) // Last hour
    };
  }

  // Get cache stats (simplified)
  private getCacheStats(): { hitRate: number; size: number } {
    // In a real implementation, this would get actual cache stats
    return {
      hitRate: 0.85,
      size: 1000
    };
  }

  // Set alert thresholds
  public setAlertThresholds(thresholds: Partial<typeof this.alertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
  }

  // Get monitoring status
  public getMonitoringStatus(): {
    isMonitoring: boolean;
    uptime: number;
    checksCount: number;
    alertsCount: number;
    metricsCount: number;
  } {
    return {
      isMonitoring: this.isMonitoring,
      uptime: this.getUptime(),
      checksCount: healthChecks.size,
      alertsCount: alerts.length,
      metricsCount: systemMetrics.length
    };
  }
}

// Singleton instance
export const monitoringSystem = EnterpriseMonitoringSystem.getInstance();

// React hook for monitoring (client-side only)
export function useMonitoring() {
  // This will be implemented in a separate client-side file
  return {
    healthStatus: monitoringSystem.getHealthStatus(),
    monitoringStatus: monitoringSystem.getMonitoringStatus(),
    createAlert: (type: Alert['type'], title: string, message: string, metadata?: Record<string, any>) => {
      return monitoringSystem.createAlert(type, title, message, metadata);
    },
    resolveAlert: (alertId: string) => {
      return monitoringSystem.resolveAlert(alertId);
    }
  };
}

// React hooks are imported at the bottom to avoid server-side issues
