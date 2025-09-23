/**
 * Enterprise Client-Side Hooks
 * Google-style comprehensive React hooks for client-side functionality
 */

'use client'

import { useState, useEffect, useCallback } from 'react';
import { realtimeManager } from '@/lib/realtime';
import { performanceMonitor } from '@/lib/performance';
import { cacheManager } from '@/lib/cache';
import { monitoringSystem } from '@/lib/monitoring';
import { testingFramework } from '@/lib/testing';
import { enterpriseAPIClient } from '@/lib/enterprise-api-client';

// Real-time hook
export function useRealtime() {
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const connectionSubscription = realtimeManager.subscribe('connection', (data) => {
      setIsConnected(data.status === 'connected');
    });

    return () => {
      connectionSubscription.unsubscribe();
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [subscriptions]);

  const subscribe = useCallback((type: string, callback: (data: any) => void) => {
    const subscription = realtimeManager.subscribe(type, callback);
    setSubscriptions(prev => [...prev, subscription]);
    return subscription;
  }, []);

  const send = useCallback((type: string, data: any) => {
    realtimeManager.send(type, data);
  }, []);

  return {
    isConnected,
    subscribe,
    send,
    connectionStatus: realtimeManager.getConnectionStatus()
  };
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    performanceMonitor.initialize();
    
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
      setSummary(performanceMonitor.getPerformanceSummary());
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    return () => {
      clearInterval(interval);
    };
  }, []);

  const recordMetric = useCallback((
    name: string,
    value: number,
    unit: string,
    context?: any
  ) => {
    performanceMonitor.recordMetric(name, value, unit, context);
  }, []);

  return {
    metrics,
    summary,
    recordMetric
  };
}

// Cache management hook
export function useCache() {
  const [stats, setStats] = useState(cacheManager.getStats());

  useEffect(() => {
    const updateStats = () => {
      setStats(cacheManager.getStats());
    };

    const interval = setInterval(updateStats, 5000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  const set = useCallback(<T>(
    key: string,
    value: T,
    options?: any
  ) => {
    cacheManager.set(key, value, options);
  }, []);

  const get = useCallback(<T>(key: string): T | null => {
    return cacheManager.get<T>(key);
  }, []);

  const invalidate = useCallback((pattern: string) => {
    return cacheManager.invalidateByPattern(pattern);
  }, []);

  const invalidateTags = useCallback((tags: string[]) => {
    return cacheManager.invalidateByTags(tags);
  }, []);

  const clear = useCallback(() => {
    cacheManager.clear();
  }, []);

  return {
    set,
    get,
    invalidate,
    invalidateTags,
    clear,
    stats
  };
}

// Monitoring hook
export function useMonitoring() {
  const [healthStatus, setHealthStatus] = useState(monitoringSystem.getHealthStatus());
  const [monitoringStatus, setMonitoringStatus] = useState(monitoringSystem.getMonitoringStatus());

  useEffect(() => {
    monitoringSystem.startMonitoring();
    
    const updateStatus = () => {
      setHealthStatus(monitoringSystem.getHealthStatus());
      setMonitoringStatus(monitoringSystem.getMonitoringStatus());
    };

    const interval = setInterval(updateStatus, 10000);
    updateStatus();

    return () => {
      clearInterval(interval);
      monitoringSystem.stopMonitoring();
    };
  }, []);

  const createAlert = useCallback((
    type: 'info' | 'warning' | 'error' | 'critical',
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) => {
    return monitoringSystem.createAlert(type, title, message, metadata);
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    return monitoringSystem.resolveAlert(alertId);
  }, []);

  return {
    healthStatus,
    monitoringStatus,
    createAlert,
    resolveAlert
  };
}

// Testing hook
export function useTesting() {
  const [testSuites, setTestSuites] = useState(testingFramework.getTestSuites());
  const [testResults, setTestResults] = useState(testingFramework.getTestResults());
  const [statistics, setStatistics] = useState(testingFramework.getTestStatistics());

  const updateData = useCallback(() => {
    setTestSuites(testingFramework.getTestSuites());
    setTestResults(testingFramework.getTestResults());
    setStatistics(testingFramework.getTestStatistics());
  }, []);

  const createTestSuite = useCallback((name: string, description: string) => {
    const suite = testingFramework.createTestSuite(name, description);
    updateData();
    return suite;
  }, [updateData]);

  const addTestCase = useCallback((
    suiteId: string,
    name: string,
    description: string,
    type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security'
  ) => {
    const testCase = testingFramework.addTestCase(suiteId, name, description, type);
    updateData();
    return testCase;
  }, [updateData]);

  const runTestCase = useCallback(async (
    suiteId: string,
    testId: string,
    testFn: () => Promise<void> | void
  ) => {
    await testingFramework.runTestCase(suiteId, testId, testFn);
    updateData();
  }, [updateData]);

  const runTestSuite = useCallback(async (suiteId: string) => {
    const result = await testingFramework.runTestSuite(suiteId);
    updateData();
    return result;
  }, [updateData]);

  const runAllTests = useCallback(async () => {
    const results = await testingFramework.runAllTests();
    updateData();
    return results;
  }, [updateData]);

  return {
    testSuites,
    testResults,
    statistics,
    createTestSuite,
    addTestCase,
    runTestCase,
    runTestSuite,
    runAllTests
  };
}

// Enterprise API hook
export function useEnterpriseAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [statistics, setStatistics] = useState(enterpriseAPIClient.getAPIStatistics());

  useEffect(() => {
    // Check connection
    enterpriseAPIClient.healthCheck().then(response => {
      setIsConnected(response.success);
    });

    // Update statistics
    const updateStats = () => {
      setStatistics(enterpriseAPIClient.getAPIStatistics());
    };

    const interval = setInterval(updateStats, 10000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    statistics,
    client: enterpriseAPIClient
  };
}

// Combined enterprise hook
export function useEnterprise() {
  const realtime = useRealtime();
  const performance = usePerformanceMonitor();
  const cache = useCache();
  const monitoring = useMonitoring();
  const testing = useTesting();
  const api = useEnterpriseAPI();

  return {
    realtime,
    performance,
    cache,
    monitoring,
    testing,
    api
  };
}



