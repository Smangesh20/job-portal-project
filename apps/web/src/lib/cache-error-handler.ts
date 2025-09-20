/**
 * BROWSER CACHE ERROR HANDLER
 * Handles all browser cache, storage, and memory related errors
 */

// Simplified error handling

export interface CacheError {
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cache' | 'memory' | 'cookie'
  operation: 'read' | 'write' | 'delete' | 'clear' | 'check'
  key?: string
  value?: any
  error: Error
  timestamp: Date
  context?: any
}

export class CacheErrorHandler {
  private cacheErrorHistory: CacheError[] = []
  private cacheHealthStatus: Map<string, boolean> = new Map()
  private maxCacheSize = 5 * 1024 * 1024 // 5MB
  private cacheCleanupInterval: number | null = null

  constructor() {
    this.initializeCacheErrorHandling()
  }

  private initializeCacheErrorHandling() {
    this.setupLocalStorageMonitoring()
    this.setupSessionStorageMonitoring()
    this.setupIndexedDBMonitoring()
    this.setupMemoryMonitoring()
    this.setupCacheCleanup()
    this.setupCacheHealthCheck()
  }

  private setupLocalStorageMonitoring() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    const originalSetItem = localStorage.setItem
    const originalGetItem = localStorage.getItem
    const originalRemoveItem = localStorage.removeItem
    const originalClear = localStorage.clear

    localStorage.setItem = (key: string, value: string) => {
      try {
        // Check cache size before writing
        this.checkCacheSize('localStorage', key, value)
        
        originalSetItem.call(localStorage, key, value)
        this.cacheHealthStatus.set('localStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'localStorage',
          operation: 'write',
          key,
          value,
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }

    localStorage.getItem = (key: string) => {
      try {
        const value = originalGetItem.call(localStorage, key)
        this.cacheHealthStatus.set('localStorage', true)
        return value
      } catch (error) {
        this.handleCacheError({
          type: 'localStorage',
          operation: 'read',
          key,
          error: error as Error,
          timestamp: new Date()
        })
        return null
      }
    }

    localStorage.removeItem = (key: string) => {
      try {
        originalRemoveItem.call(localStorage, key)
        this.cacheHealthStatus.set('localStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'localStorage',
          operation: 'delete',
          key,
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }

    localStorage.clear = () => {
      try {
        originalClear.call(localStorage)
        this.cacheHealthStatus.set('localStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'localStorage',
          operation: 'clear',
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }
  }

  private setupSessionStorageMonitoring() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return
    }

    const originalSetItem = sessionStorage.setItem
    const originalGetItem = sessionStorage.getItem
    const originalRemoveItem = sessionStorage.removeItem
    const originalClear = sessionStorage.clear

    sessionStorage.setItem = (key: string, value: string) => {
      try {
        this.checkCacheSize('sessionStorage', key, value)
        originalSetItem.call(sessionStorage, key, value)
        this.cacheHealthStatus.set('sessionStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'sessionStorage',
          operation: 'write',
          key,
          value,
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }

    sessionStorage.getItem = (key: string) => {
      try {
        const value = originalGetItem.call(sessionStorage, key)
        this.cacheHealthStatus.set('sessionStorage', true)
        return value
      } catch (error) {
        this.handleCacheError({
          type: 'sessionStorage',
          operation: 'read',
          key,
          error: error as Error,
          timestamp: new Date()
        })
        return null
      }
    }

    sessionStorage.removeItem = (key: string) => {
      try {
        originalRemoveItem.call(sessionStorage, key)
        this.cacheHealthStatus.set('sessionStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'sessionStorage',
          operation: 'delete',
          key,
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }

    sessionStorage.clear = () => {
      try {
        originalClear.call(sessionStorage)
        this.cacheHealthStatus.set('sessionStorage', true)
      } catch (error) {
        this.handleCacheError({
          type: 'sessionStorage',
          operation: 'clear',
          error: error as Error,
          timestamp: new Date()
        })
        throw error
      }
    }
  }

  private setupIndexedDBMonitoring() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return
    }

    // Monitor IndexedDB operations
    if ('indexedDB' in window) {
      const originalOpen = indexedDB.open
      
      indexedDB.open = (name: string, version?: number) => {
        try {
          const request = originalOpen.call(indexedDB, name, version)
          
          request.onerror = (event) => {
            this.handleCacheError({
              type: 'indexedDB',
              operation: 'check',
              error: new Error('IndexedDB open failed'),
              timestamp: new Date(),
              context: { name, version, event }
            })
          }
          
          return request
        } catch (error) {
          this.handleCacheError({
            type: 'indexedDB',
            operation: 'check',
            error: error as Error,
            timestamp: new Date(),
            context: { name, version }
          })
          throw error
        }
      }
    }
  }

  private setupMemoryMonitoring() {
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        try {
          const memory = (performance as any).memory
          const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
          
          if (memoryUsage > 0.8) {
            this.handleCacheError({
              type: 'memory',
              operation: 'check',
              error: new Error(`High memory usage: ${(memoryUsage * 100).toFixed(2)}%`),
              timestamp: new Date(),
              context: {
                used: memory.usedJSHeapSize,
                total: memory.jsHeapSizeLimit,
                usage: memoryUsage
              }
            })
            
            // Trigger memory cleanup
            this.performMemoryCleanup()
          }
        } catch (error) {
          this.handleCacheError({
            type: 'memory',
            operation: 'check',
            error: error as Error,
            timestamp: new Date()
          })
        }
      }, 10000) // Check every 10 seconds
    }
  }

  private setupCacheCleanup() {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return
    }

    // Periodic cache cleanup
    this.cacheCleanupInterval = window.setInterval(() => {
      this.performCacheCleanup()
    }, 300000) // Every 5 minutes
  }

  private setupCacheHealthCheck() {
    // Periodic cache health check
    setInterval(() => {
      this.performCacheHealthCheck()
    }, 60000) // Every minute
  }

  private checkCacheSize(storageType: string, key: string, value: string) {
    try {
      const currentSize = this.getStorageSize(storageType)
      const newItemSize = key.length + value.length
      
      if (currentSize + newItemSize > this.maxCacheSize) {
        throw new Error(`Cache size limit exceeded: ${currentSize + newItemSize} bytes`)
      }
    } catch (error) {
      this.handleCacheError({
        type: 'cache',
        operation: 'write',
        key,
        value,
        error: error as Error,
        timestamp: new Date(),
        context: { storageType, maxSize: this.maxCacheSize }
      })
      throw error
    }
  }

  private getStorageSize(storageType: string): number {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') {
      return 0
    }

    let storage: Storage
    
    switch (storageType) {
      case 'localStorage':
        storage = localStorage
        break
      case 'sessionStorage':
        storage = sessionStorage
        break
      default:
        return 0
    }
    
    let totalSize = 0
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key) {
        const value = storage.getItem(key)
        if (value) {
          totalSize += key.length + value.length
        }
      }
    }
    
    return totalSize
  }

  private handleCacheError(error: CacheError) {
    // Add to error history
    this.cacheErrorHistory.push(error)
    
    // Update cache health status
    this.cacheHealthStatus.set(error.type, false)
    
    // Report to error prevention system
    console.error('Cache error:', error)
    
    // Attempt recovery
    this.attemptCacheErrorRecovery(error)
    
    // Log error
    console.error('Cache error detected:', error)
  }

  // Simplified error mapping removed

  private attemptCacheErrorRecovery(error: CacheError) {
    switch (error.type) {
      case 'localStorage':
        this.recoverLocalStorageError(error)
        break
      case 'sessionStorage':
        this.recoverSessionStorageError(error)
        break
      case 'indexedDB':
        this.recoverIndexedDBError(error)
        break
      case 'memory':
        this.recoverMemoryError(error)
        break
      case 'cache':
        this.recoverCacheError(error)
        break
    }
  }

  private recoverLocalStorageError(error: CacheError) {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    console.log('Attempting localStorage recovery...')
    
    try {
      // Clear corrupted data
      if (error.key) {
        localStorage.removeItem(error.key)
      } else {
        localStorage.clear()
      }
      
      // Rebuild essential data
      this.rebuildEssentialLocalStorageData()
      
      this.cacheHealthStatus.set('localStorage', true)
      console.log('localStorage recovery completed')
    } catch (recoveryError) {
      console.error('localStorage recovery failed:', recoveryError)
    }
  }

  private recoverSessionStorageError(error: CacheError) {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return
    }

    console.log('Attempting sessionStorage recovery...')
    
    try {
      // Clear corrupted data
      if (error.key) {
        sessionStorage.removeItem(error.key)
      } else {
        sessionStorage.clear()
      }
      
      // Rebuild essential data
      this.rebuildEssentialSessionStorageData()
      
      this.cacheHealthStatus.set('sessionStorage', true)
      console.log('sessionStorage recovery completed')
    } catch (recoveryError) {
      console.error('sessionStorage recovery failed:', recoveryError)
    }
  }

  private recoverIndexedDBError(error: CacheError) {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return
    }

    console.log('Attempting IndexedDB recovery...')
    
    try {
      // Clear IndexedDB
      if ('indexedDB' in window) {
        indexedDB.deleteDatabase('app-cache')
      }
      
      this.cacheHealthStatus.set('indexedDB', true)
      console.log('IndexedDB recovery completed')
    } catch (recoveryError) {
      console.error('IndexedDB recovery failed:', recoveryError)
    }
  }

  private recoverMemoryError(error: CacheError) {
    console.log('Attempting memory recovery...')
    
    try {
      // Force garbage collection
      if ((window as any).gc) {
        (window as any).gc()
      }
      
      // Clear large objects
      this.clearLargeObjects()
      
      // Reduce memory usage
      this.reduceMemoryUsage()
      
      console.log('Memory recovery completed')
    } catch (recoveryError) {
      console.error('Memory recovery failed:', recoveryError)
    }
  }

  private recoverCacheError(error: CacheError) {
    console.log('Attempting cache recovery...')
    
    try {
      // Clear all caches
      this.clearAllCaches()
      
      // Rebuild essential cache
      this.rebuildEssentialCache()
      
      console.log('Cache recovery completed')
    } catch (recoveryError) {
      console.error('Cache recovery failed:', recoveryError)
    }
  }

  private rebuildEssentialLocalStorageData() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    const essentialData = {
      theme: 'light',
      language: 'en',
      userPreferences: {},
      appVersion: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
    
    try {
      localStorage.setItem('app_essential_data', JSON.stringify(essentialData))
    } catch (error) {
      console.error('Failed to rebuild essential localStorage data:', error)
    }
  }

  private rebuildEssentialSessionStorageData() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return
    }

    const essentialData = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      pageViews: 1
    }
    
    try {
      sessionStorage.setItem('app_session_data', JSON.stringify(essentialData))
    } catch (error) {
      console.error('Failed to rebuild essential sessionStorage data:', error)
    }
  }

  private clearLargeObjects() {
    // Clear large objects from memory
    if ((window as any).largeObjects) {
      (window as any).largeObjects = null
    }
    
    if ((window as any).cachedData) {
      (window as any).cachedData = null
    }
    
    if ((window as any).quantumCache) {
      (window as any).quantumCache = null
    }
  }

  private performMemoryCleanup() {
    console.log('Performing memory cleanup...')
    
    try {
      // Clear large objects
      this.clearLargeObjects()
      
      // Reduce memory usage
      this.reduceMemoryUsage()
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc()
      }
      
      console.log('Memory cleanup completed')
    } catch (error) {
      console.error('Memory cleanup failed:', error)
    }
  }

  private reduceMemoryUsage() {
    // Remove unnecessary data from storage
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('temp_') || 
      key.startsWith('cache_') || 
      key.startsWith('debug_') ||
      key.includes('old_') ||
      key.includes('backup_')
    )
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Failed to remove key ${key}:`, error)
      }
    })
  }

  private clearAllCaches() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') {
      return
    }

    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (error) {
      console.error('Failed to clear all caches:', error)
    }
  }

  private rebuildEssentialCache() {
    this.rebuildEssentialLocalStorageData()
    this.rebuildEssentialSessionStorageData()
  }

  private performCacheCleanup() {
    console.log('Performing periodic cache cleanup...')
    
    try {
      // Remove old cache entries
      this.removeOldCacheEntries()
      
      // Compress cache data
      this.compressCacheData()
      
      // Update cache health status
      this.updateCacheHealthStatus()
      
      console.log('Cache cleanup completed')
    } catch (error) {
      console.error('Cache cleanup failed:', error)
    }
  }

  private removeOldCacheEntries() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    // Remove old localStorage entries
    Object.keys(localStorage).forEach(key => {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          const data = JSON.parse(value)
          if (data.timestamp && (now - data.timestamp) > maxAge) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        // Remove corrupted entries
        localStorage.removeItem(key)
      }
    })
  }

  private compressCacheData() {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    // Compress large cache entries
    Object.keys(localStorage).forEach(key => {
      try {
        const value = localStorage.getItem(key)
        if (value && value.length > 1000) { // Compress entries larger than 1KB
          const compressed = this.compressString(value)
          if (compressed.length < value.length) {
            localStorage.setItem(key, compressed)
          }
        }
      } catch (error) {
        console.warn(`Failed to compress cache entry ${key}:`, error)
      }
    })
  }

  private compressString(str: string): string {
    // Simple compression using JSON.stringify for repeated patterns
    try {
      return JSON.stringify(JSON.parse(str))
    } catch {
      return str
    }
  }

  private updateCacheHealthStatus() {
    // Check each storage type
    this.cacheHealthStatus.set('localStorage', this.isStorageHealthy('localStorage'))
    this.cacheHealthStatus.set('sessionStorage', this.isStorageHealthy('sessionStorage'))
    this.cacheHealthStatus.set('indexedDB', this.isIndexedDBHealthy())
  }

  private isStorageHealthy(storageType: string): boolean {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage
      const testKey = `health_check_${Date.now()}`
      const testValue = 'test'
      
      storage.setItem(testKey, testValue)
      const retrieved = storage.getItem(testKey)
      storage.removeItem(testKey)
      
      return retrieved === testValue
    } catch {
      return false
    }
  }

  private isIndexedDBHealthy(): boolean {
    try {
      return 'indexedDB' in window
    } catch {
      return false
    }
  }

  private performCacheHealthCheck() {
    console.log('Performing cache health check...')
    
    try {
      this.updateCacheHealthStatus()
      
      // Report unhealthy caches
      this.cacheHealthStatus.forEach((isHealthy, cacheType) => {
        if (!isHealthy) {
          console.warn(`Cache ${cacheType} is unhealthy`)
          
          this.handleCacheError({
            type: cacheType as any,
            operation: 'check',
            error: new Error(`Cache ${cacheType} health check failed`),
            timestamp: new Date()
          })
        }
      })
      
      console.log('Cache health check completed')
    } catch (error) {
      console.error('Cache health check failed:', error)
    }
  }

  public getCacheErrorHistory(): CacheError[] {
    return [...this.cacheErrorHistory]
  }

  public getCacheHealthStatus(): Map<string, boolean> {
    return new Map(this.cacheHealthStatus)
  }

  public clearCacheErrorHistory() {
    this.cacheErrorHistory = []
  }

  public forceCacheCleanup() {
    this.performCacheCleanup()
  }

  public destroy() {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval)
    }
  }
}

// Create global instance
export const cacheErrorHandler = new CacheErrorHandler()

export default cacheErrorHandler
