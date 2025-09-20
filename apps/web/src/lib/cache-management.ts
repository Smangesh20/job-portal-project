/**
 * Advanced Cache Management System
 * Eliminates browser cache issues and optimizes performance
 */

interface CacheConfig {
  name: string
  version: string
  maxAge: number
  maxSize: number
}

const CACHE_CONFIG: CacheConfig = {
  name: 'askyacham-cache',
  version: '2.0.0',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 50 * 1024 * 1024 // 50MB
}

class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; size: number }> = new Map()
  private currentSize: number = 0

  // Generate cache key with version
  private generateKey(key: string): string {
    return `${CACHE_CONFIG.name}-${CACHE_CONFIG.version}-${key}`
  }

  // Calculate object size
  private calculateSize(obj: any): number {
    return new Blob([JSON.stringify(obj)]).size
  }

  // Clean expired entries
  private cleanExpired(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > CACHE_CONFIG.maxAge) {
        this.currentSize -= value.size
        this.cache.delete(key)
      }
    }
  }

  // Clean oldest entries if size limit exceeded
  private cleanOldest(): void {
    if (this.currentSize <= CACHE_CONFIG.maxSize) return

    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)

    for (const [key, value] of entries) {
      this.currentSize -= value.size
      this.cache.delete(key)
      if (this.currentSize <= CACHE_CONFIG.maxSize) break
    }
  }

  // Set cache entry
  set(key: string, data: any): void {
    const cacheKey = this.generateKey(key)
    const size = this.calculateSize(data)
    
    // Clean expired entries first
    this.cleanExpired()
    
    // Remove existing entry if it exists
    if (this.cache.has(cacheKey)) {
      this.currentSize -= this.cache.get(cacheKey)!.size
    }
    
    // Add new entry
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      size
    })
    
    this.currentSize += size
    
    // Clean oldest if size limit exceeded
    this.cleanOldest()
  }

  // Get cache entry
  get(key: string): any | null {
    const cacheKey = this.generateKey(key)
    const entry = this.cache.get(cacheKey)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > CACHE_CONFIG.maxAge) {
      this.cache.delete(cacheKey)
      this.currentSize -= entry.size
      return null
    }
    
    return entry.data
  }

  // Delete cache entry
  delete(key: string): boolean {
    const cacheKey = this.generateKey(key)
    const entry = this.cache.get(cacheKey)
    
    if (entry) {
      this.currentSize -= entry.size
      this.cache.delete(cacheKey)
      return true
    }
    
    return false
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  // Get cache stats
  getStats(): { size: number; entries: number; maxSize: number } {
    return {
      size: this.currentSize,
      entries: this.cache.size,
      maxSize: CACHE_CONFIG.maxSize
    }
  }
}

// Global cache instance
export const cacheManager = new CacheManager()

// Cache utilities
export const cacheUtils = {
  // Set with TTL
  setWithTTL: (key: string, data: any, ttl: number = CACHE_CONFIG.maxAge): void => {
    cacheManager.set(key, { data, ttl, timestamp: Date.now() })
  },

  // Get with TTL check
  getWithTTL: (key: string): any | null => {
    const entry = cacheManager.get(key)
    if (!entry || !entry.ttl) return entry?.data || null
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheManager.delete(key)
      return null
    }
    
    return entry.data
  },

  // Cache API response
  cacheApiResponse: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const cacheKey = `api-${url}-${JSON.stringify(options)}`
    const cached = cacheManager.get(cacheKey)
    
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        cacheManager.set(cacheKey, data)
      }
      return response
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  },

  // Invalidate cache by pattern
  invalidatePattern: (pattern: string): void => {
    const regex = new RegExp(pattern)
    for (const key of cacheManager['cache'].keys()) {
      if (regex.test(key)) {
        cacheManager.delete(key.replace(`${CACHE_CONFIG.name}-${CACHE_CONFIG.version}-`, ''))
      }
    }
  }
}

// Service Worker cache management
export const serviceWorkerCache = {
  // Clear all caches
  clearAll: async (): Promise<void> => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
  },

  // Clear specific cache
  clearCache: async (cacheName: string): Promise<void> => {
    if ('caches' in window) {
      await caches.delete(cacheName)
    }
  },

  // Get cache size
  getCacheSize: async (): Promise<number> => {
    if (!('caches' in window)) return 0
    
    let totalSize = 0
    const cacheNames = await caches.keys()
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      
      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }
    
    return totalSize
  }
}

// Browser cache busting
export const cacheBusting = {
  // Add timestamp to URL
  addTimestamp: (url: string): string => {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}_t=${Date.now()}`
  },

  // Add version to URL
  addVersion: (url: string, version: string = CACHE_CONFIG.version): string => {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}_v=${version}`
  },

  // Force reload
  forceReload: (): void => {
    window.location.reload()
  },

  // Clear browser cache
  clearBrowserCache: async (): Promise<void> => {
    if ('caches' in window) {
      await serviceWorkerCache.clearAll()
    }
    
    // Clear memory cache
    cacheManager.clear()
    
    // Force reload
    cacheBusting.forceReload()
  }
}

// Initialize cache management
export const initializeCacheManagement = () => {
  // Set up periodic cleanup
  setInterval(() => {
    cacheManager['cleanExpired']()
  }, 60 * 60 * 1000) // Every hour

  // Clear cache on version change
  const currentVersion = localStorage.getItem('app-version')
  if (currentVersion !== CACHE_CONFIG.version) {
    cacheManager.clear()
    localStorage.setItem('app-version', CACHE_CONFIG.version)
  }
}
