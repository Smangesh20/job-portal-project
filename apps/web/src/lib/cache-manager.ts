/**
 * Advanced Cache Management System
 * Handles browser cache, service worker cache, and API response caching
 */

export interface CacheConfig {
  name: string
  version: string
  maxAge: number
  maxSize: number
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only'
  enableCompression: boolean
  enableEncryption: boolean
}

export interface CacheEntry<T = any> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
  version: string
  compressed?: boolean
  encrypted?: boolean
  metadata?: Record<string, any>
}

export class CacheManager {
  private config: CacheConfig
  private memoryCache: Map<string, CacheEntry> = new Map()
  private cacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0
  }

  constructor(config: CacheConfig) {
    this.config = config
    this.initializeCache()
  }

  private async initializeCache() {
    // Initialize IndexedDB for persistent storage
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      await this.initIndexedDB()
    }
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`${this.config.name}-cache`, 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('expiresAt', 'expiresAt', { unique: false })
        }
      }
    })
  }

  private db: IDBDatabase | null = null

  /**
   * Get data from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      const memoryEntry = this.memoryCache.get(key)
      if (memoryEntry && this.isValid(memoryEntry)) {
        this.cacheStats.hits++
        return memoryEntry.data as T
      }

      // Check IndexedDB
      if (this.db) {
        const entry = await this.getFromIndexedDB(key)
        if (entry && this.isValid(entry)) {
          this.cacheStats.hits++
          // Store in memory cache for faster access
          this.memoryCache.set(key, entry)
          return entry.data as T
        }
      }

      this.cacheStats.misses++
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      this.cacheStats.misses++
      return null
    }
  }

  /**
   * Set data in cache
   */
  async set<T>(key: string, data: T, options?: {
    maxAge?: number
    metadata?: Record<string, any>
    compressed?: boolean
    encrypted?: boolean
  }): Promise<void> {
    try {
      const now = Date.now()
      const maxAge = options?.maxAge || this.config.maxAge
      const entry: CacheEntry<T> = {
        key,
        data,
        timestamp: now,
        expiresAt: now + maxAge,
        version: this.config.version,
        compressed: options?.compressed || false,
        encrypted: options?.encrypted || false,
        metadata: options?.metadata
      }

      // Store in memory cache
      this.memoryCache.set(key, entry)
      this.cacheStats.size++

      // Store in IndexedDB for persistence
      if (this.db) {
        await this.setInIndexedDB(entry)
      }

      // Clean up expired entries
      await this.cleanup()
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      // Remove from memory cache
      const memoryDeleted = this.memoryCache.delete(key)
      if (memoryDeleted) {
        this.cacheStats.size--
      }

      // Remove from IndexedDB
      if (this.db) {
        await this.deleteFromIndexedDB(key)
      }

      return memoryDeleted
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  /**
   * Clear all cache data
   */
  async clear(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear()
      this.cacheStats.size = 0

      // Clear IndexedDB
      if (this.db) {
        await this.clearIndexedDB()
      }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry): boolean {
    const now = Date.now()
    return entry.expiresAt > now && entry.version === this.config.version
  }

  /**
   * Clean up expired entries
   */
  private async cleanup(): Promise<void> {
    const now = Date.now()
    const expiredKeys: string[] = []

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach(key => {
      this.memoryCache.delete(key)
      this.cacheStats.evictions++
      this.cacheStats.size--
    })

    // Clean IndexedDB
    if (this.db) {
      await this.cleanupIndexedDB(now)
    }

    // Enforce size limit
    if (this.memoryCache.size > this.config.maxSize) {
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const toRemove = entries.slice(0, entries.length - this.config.maxSize)
      toRemove.forEach(([key]) => {
        this.memoryCache.delete(key)
        this.cacheStats.evictions++
        this.cacheStats.size--
      })
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate = this.cacheStats.hits + this.cacheStats.misses > 0 
      ? (this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses)) * 100 
      : 0

    return {
      ...this.cacheStats,
      hitRate: Math.round(hitRate * 100) / 100,
      memorySize: this.memoryCache.size,
      config: this.config
    }
  }

  /**
   * IndexedDB helper methods
   */
  private async getFromIndexedDB(key: string): Promise<CacheEntry | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null)
        return
      }

      const transaction = this.db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  private async setInIndexedDB(entry: CacheEntry): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.put(entry)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async deleteFromIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async cleanupIndexedDB(now: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve()
        return
      }

      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('expiresAt')
      const range = IDBKeyRange.upperBound(now)
      const request = index.openCursor(range)

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }
}

/**
 * Cache strategies
 */
export class CacheStrategies {
  static async cacheFirst<T>(
    key: string,
    fetcher: () => Promise<T>,
    cacheManager: CacheManager,
    options?: { maxAge?: number }
  ): Promise<T> {
    // Try cache first
    const cached = await cacheManager.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch from network
    const data = await fetcher()
    await cacheManager.set(key, data, options)
    return data
  }

  static async networkFirst<T>(
    key: string,
    fetcher: () => Promise<T>,
    cacheManager: CacheManager,
    options?: { maxAge?: number }
  ): Promise<T> {
    try {
      // Try network first
      const data = await fetcher()
      await cacheManager.set(key, data, options)
      return data
    } catch (error) {
      // Fallback to cache
      const cached = await cacheManager.get<T>(key)
      if (cached !== null) {
        return cached
      }
      throw error
    }
  }

  static async staleWhileRevalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    cacheManager: CacheManager,
    options?: { maxAge?: number }
  ): Promise<T> {
    // Return cached data immediately if available
    const cached = await cacheManager.get<T>(key)
    if (cached !== null) {
      // Fetch fresh data in background
      fetcher().then(data => {
        cacheManager.set(key, data, options)
      }).catch(() => {
        // Ignore background fetch errors
      })
      return cached
    }

    // No cached data, fetch from network
    const data = await fetcher()
    await cacheManager.set(key, data, options)
    return data
  }
}

/**
 * Predefined cache configurations
 */
export const CACHE_CONFIGS = {
  API_RESPONSES: {
    name: 'api-cache',
    version: '1.0.0',
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    strategy: 'stale-while-revalidate' as const,
    enableCompression: true,
    enableEncryption: false
  },
  USER_DATA: {
    name: 'user-cache',
    version: '1.0.0',
    maxAge: 30 * 60 * 1000, // 30 minutes
    maxSize: 50,
    strategy: 'cache-first' as const,
    enableCompression: true,
    enableEncryption: true
  },
  STATIC_ASSETS: {
    name: 'static-cache',
    version: '1.0.0',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 200,
    strategy: 'cache-first' as const,
    enableCompression: true,
    enableEncryption: false
  },
  JOB_LISTINGS: {
    name: 'jobs-cache',
    version: '1.0.0',
    maxAge: 10 * 60 * 1000, // 10 minutes
    maxSize: 100,
    strategy: 'stale-while-revalidate' as const,
    enableCompression: true,
    enableEncryption: false
  }
}

/**
 * Global cache manager instances
 */
export const apiCache = new CacheManager(CACHE_CONFIGS.API_RESPONSES)
export const userCache = new CacheManager(CACHE_CONFIGS.USER_DATA)
export const staticCache = new CacheManager(CACHE_CONFIGS.STATIC_ASSETS)
export const jobsCache = new CacheManager(CACHE_CONFIGS.JOB_LISTINGS)

/**
 * Cache version management
 */
export class CacheVersionManager {
  private static readonly VERSION_KEY = 'cache-version'
  private static readonly CURRENT_VERSION = '2.0.0'

  static async checkAndUpdateVersion(): Promise<void> {
    const storedVersion = localStorage.getItem(this.VERSION_KEY)
    
    if (storedVersion !== this.CURRENT_VERSION) {
      // Clear all caches when version changes
      await Promise.all([
        apiCache.clear(),
        userCache.clear(),
        staticCache.clear(),
        jobsCache.clear()
      ])
      
      // Update version
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION)
      
      // Clear service worker cache
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }
    }
  }
}

/**
 * Cache warming utilities
 */
export class CacheWarmer {
  static async warmCriticalCaches(): Promise<void> {
    try {
      // Warm up critical API endpoints
      const criticalEndpoints = [
        '/api/user/profile',
        '/api/jobs/featured',
        '/api/notifications/unread'
      ]

      await Promise.all(
        criticalEndpoints.map(endpoint => 
          CacheStrategies.staleWhileRevalidate(
            endpoint,
            () => fetch(endpoint).then(res => res.json()),
            apiCache
          )
        )
      )
    } catch (error) {
      console.error('Cache warming failed:', error)
    }
  }
}

// Initialize cache version check on load
if (typeof window !== 'undefined') {
  CacheVersionManager.checkAndUpdateVersion()
}
