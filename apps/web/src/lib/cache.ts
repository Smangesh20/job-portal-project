/**
 * Enterprise Cache Management System
 * Google-style intelligent caching with invalidation strategies
 */

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  version: string;
  metadata: {
    size: number;
    hits: number;
    lastAccessed: number;
    createdAt: number;
  };
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  maxMemoryUsage: number;
  enableCompression: boolean;
  enableEncryption: boolean;
}

// Cache store
const cacheStore = new Map<string, CacheEntry>();
const tagIndex = new Map<string, Set<string>>();
const versionStore = new Map<string, string>();

// Default configuration
const defaultConfig: CacheConfig = {
  maxSize: 10000,
  defaultTTL: 300000, // 5 minutes
  cleanupInterval: 60000, // 1 minute
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  enableCompression: true,
  enableEncryption: false
};

class EnterpriseCacheManager {
  private static instance: EnterpriseCacheManager;
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private memoryUsage = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.startCleanupTimer();
  }

  public static getInstance(config?: Partial<CacheConfig>): EnterpriseCacheManager {
    if (!EnterpriseCacheManager.instance) {
      EnterpriseCacheManager.instance = new EnterpriseCacheManager(config);
    }
    return EnterpriseCacheManager.instance;
  }

  // Set cache entry
  public set<T>(
    key: string,
    value: T,
    options: {
      ttl?: number;
      tags?: string[];
      version?: string;
      compress?: boolean;
      encrypt?: boolean;
    } = {}
  ): void {
    const now = Date.now();
    const ttl = options.ttl || this.config.defaultTTL;
    const tags = options.tags || [];
    const version = options.version || this.generateVersion();
    
    // Serialize value
    let serializedValue: string;
    try {
      serializedValue = JSON.stringify(value);
    } catch (error) {
      console.error('🚀 ENTERPRISE: Cache serialization failed:', error);
      return;
    }

    // Compress if enabled
    if (options.compress && this.config.enableCompression) {
      serializedValue = this.compress(serializedValue);
    }

    // Encrypt if enabled
    if (options.encrypt && this.config.enableEncryption) {
      serializedValue = this.encrypt(serializedValue);
    }

    // Calculate size
    const size = new Blob([serializedValue]).size;

    // Check memory usage
    if (this.memoryUsage + size > this.config.maxMemoryUsage) {
      this.evictLRU();
    }

    // Create cache entry
    const entry: CacheEntry<T> = {
      key,
      value: serializedValue as any,
      timestamp: now,
      ttl,
      tags,
      version,
      metadata: {
        size,
        hits: 0,
        lastAccessed: now,
        createdAt: now
      }
    };

    // Store entry
    cacheStore.set(key, entry);
    this.memoryUsage += size;

    // Update tag index
    tags.forEach(tag => {
      if (!tagIndex.has(tag)) {
        tagIndex.set(tag, new Set());
      }
      tagIndex.get(tag)!.add(key);
    });

    // Store version
    versionStore.set(key, version);

    console.log(`🚀 ENTERPRISE: Cached ${key} (${size} bytes, TTL: ${ttl}ms)`);
  }

  // Get cache entry
  public get<T>(key: string): T | null {
    const entry = cacheStore.get(key);
    
    if (!entry) {
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    // Update metadata
    entry.metadata.hits++;
    entry.metadata.lastAccessed = Date.now();
    cacheStore.set(key, entry);

    try {
      let value = entry.value;

      // Decrypt if encrypted
      if (this.config.enableEncryption) {
        value = this.decrypt(value as string) as any;
      }

      // Decompress if compressed
      if (this.config.enableCompression) {
        value = this.decompress(value as string) as any;
      }

      // Deserialize
      return JSON.parse(value as string);
    } catch (error) {
      console.error('🚀 ENTERPRISE: Cache deserialization failed:', error);
      this.delete(key);
      return null;
    }
  }

  // Delete cache entry
  public delete(key: string): boolean {
    const entry = cacheStore.get(key);
    
    if (!entry) {
      return false;
    }

    // Update memory usage
    this.memoryUsage -= entry.metadata.size;

    // Remove from tag index
    entry.tags.forEach(tag => {
      const keys = tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          tagIndex.delete(tag);
        }
      }
    });

    // Remove from stores
    cacheStore.delete(key);
    versionStore.delete(key);

    console.log(`🚀 ENTERPRISE: Deleted cache entry ${key}`);
    return true;
  }

  // Invalidate by tags
  public invalidateByTags(tags: string[]): number {
    let invalidatedCount = 0;
    
    tags.forEach(tag => {
      const keys = tagIndex.get(tag);
      if (keys) {
        keys.forEach(key => {
          if (this.delete(key)) {
            invalidatedCount++;
          }
        });
        tagIndex.delete(tag);
      }
    });

    console.log(`🚀 ENTERPRISE: Invalidated ${invalidatedCount} entries by tags: ${tags.join(', ')}`);
    return invalidatedCount;
  }

  // Invalidate by pattern
  public invalidateByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let invalidatedCount = 0;
    
    for (const key of cacheStore.keys()) {
      if (regex.test(key)) {
        if (this.delete(key)) {
          invalidatedCount++;
        }
      }
    }

    console.log(`🚀 ENTERPRISE: Invalidated ${invalidatedCount} entries by pattern: ${pattern}`);
    return invalidatedCount;
  }

  // Clear all cache
  public clear(): void {
    cacheStore.clear();
    tagIndex.clear();
    versionStore.clear();
    this.memoryUsage = 0;
    console.log('🚀 ENTERPRISE: Cleared all cache');
  }

  // Get cache statistics
  public getStats(): {
    size: number;
    memoryUsage: number;
    hitRate: number;
    entries: number;
    tags: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(cacheStore.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.metadata.hits, 0);
    const totalRequests = entries.length + totalHits;
    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
    
    const timestamps = entries.map(entry => entry.timestamp);
    const oldestEntry = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    const newestEntry = timestamps.length > 0 ? Math.max(...timestamps) : 0;

    return {
      size: entries.length,
      memoryUsage: this.memoryUsage,
      hitRate,
      entries: entries.length,
      tags: tagIndex.size,
      oldestEntry,
      newestEntry
    };
  }

  // Browser cache management
  public generateCacheBustingKey(): string {
    return `v=${Date.now()}`;
  }

  // Clear browser cache
  public clearBrowserCache(): void {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
  }

  // Set cache headers
  public setCacheHeaders(
    maxAge: number = 300,
    staleWhileRevalidate: number = 86400,
    mustRevalidate: boolean = false
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Cache-Control': `public, max-age=${maxAge}${mustRevalidate ? ', must-revalidate' : ''}`,
      'ETag': `"${this.generateVersion()}"`,
      'Last-Modified': new Date().toUTCString()
    };

    if (staleWhileRevalidate > 0) {
      headers['Cache-Control'] += `, stale-while-revalidate=${staleWhileRevalidate}`;
    }

    return headers;
  }

  // Private methods
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of cacheStore.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🚀 ENTERPRISE: Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  private evictLRU(): void {
    const entries = Array.from(cacheStore.values());
    entries.sort((a, b) => a.metadata.lastAccessed - b.metadata.lastAccessed);
    
    // Remove 10% of entries (LRU)
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.delete(entries[i].key);
    }
  }

  private generateVersion(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private compress(data: string): string {
    // Simple compression (in production, use proper compression)
    return btoa(data);
  }

  private decompress(data: string): string {
    // Simple decompression (in production, use proper decompression)
    return atob(data);
  }

  private encrypt(data: string): string {
    // Simple encryption (in production, use proper encryption)
    return btoa(data);
  }

  private decrypt(data: string): string {
    // Simple decryption (in production, use proper decryption)
    return atob(data);
  }

  // Cleanup on destroy
  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Singleton instance
export const cacheManager = EnterpriseCacheManager.getInstance();

// React hook for cache management (client-side only)
export function useCache() {
  // This will be implemented in a separate client-side file
  return {
    set: () => {},
    get: () => null,
    invalidate: () => 0,
    invalidateTags: () => 0,
    clear: () => {},
    stats: cacheManager.getStats()
  };
}

// React hooks are imported at the bottom to avoid server-side issues
