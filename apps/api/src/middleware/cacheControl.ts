import { Request, Response, NextFunction } from 'express';

export interface CacheConfig {
  enableETag: boolean;
  enableLastModified: boolean;
  maxAge: number; // in seconds
  mustRevalidate: boolean;
  noCache: boolean;
  noStore: boolean;
  private: boolean;
  public: boolean;
}

const defaultCacheConfig: CacheConfig = {
  enableETag: true,
  enableLastModified: true,
  maxAge: 300, // 5 minutes
  mustRevalidate: false,
  noCache: false,
  noStore: false,
  private: true,
  public: false
};

export class CacheControlService {
  private config: CacheConfig;

  constructor() {
    this.config = { ...defaultCacheConfig };
  }

  /**
   * Set appropriate cache headers
   */
  setCacheHeaders(req: Request, res: Response, next: NextFunction): void {
    const path = req.path;
    const method = req.method;

    // Don't cache non-GET requests
    if (method !== 'GET') {
      this.setNoCacheHeaders(res);
      next();
      return;
    }

    // Set cache headers based on endpoint
    if (this.isStaticContent(path)) {
      this.setStaticContentHeaders(res);
    } else if (this.isApiEndpoint(path)) {
      this.setApiHeaders(res, path);
    } else if (this.isAuthEndpoint(path)) {
      this.setAuthHeaders(res);
    } else {
      this.setDefaultHeaders(res);
    }

    next();
  }

  /**
   * Set no-cache headers
   */
  private setNoCacheHeaders(res: Response): void {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  /**
   * Set static content headers
   */
  private setStaticContentHeaders(res: Response): void {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    res.setHeader('ETag', this.generateETag(res));
  }

  /**
   * Set API headers
   */
  private setApiHeaders(res: Response, path: string): void {
    if (path.includes('/auth/') || path.includes('/users/') || path.includes('/admin/')) {
      // Sensitive endpoints - no cache
      this.setNoCacheHeaders(res);
    } else if (path.includes('/jobs/') || path.includes('/companies/')) {
      // Job/company data - short cache
      res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate'); // 5 minutes
      res.setHeader('ETag', this.generateETag(res));
    } else if (path.includes('/research/')) {
      // Research data - medium cache
      res.setHeader('Cache-Control', 'public, max-age=900, must-revalidate'); // 15 minutes
      res.setHeader('ETag', this.generateETag(res));
    } else {
      // Default API cache
      res.setHeader('Cache-Control', 'private, max-age=60, must-revalidate'); // 1 minute
      res.setHeader('ETag', this.generateETag(res));
    }
  }

  /**
   * Set auth headers
   */
  private setAuthHeaders(res: Response): void {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  /**
   * Set default headers
   */
  private setDefaultHeaders(res: Response): void {
    res.setHeader('Cache-Control', 'private, max-age=300, must-revalidate'); // 5 minutes
    res.setHeader('ETag', this.generateETag(res));
  }

  /**
   * Check if path is static content
   */
  private isStaticContent(path: string): boolean {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => path.endsWith(ext));
  }

  /**
   * Check if path is API endpoint
   */
  private isApiEndpoint(path: string): boolean {
    return path.startsWith('/api/');
  }

  /**
   * Check if path is auth endpoint
   */
  private isAuthEndpoint(path: string): boolean {
    return path.includes('/auth/') || path.includes('/login') || path.includes('/register');
  }

  /**
   * Generate ETag
   */
  private generateETag(res: Response): string {
    const crypto = require('crypto');
    const content = res.get('Content-Type') || '';
    const timestamp = Date.now().toString();
    return crypto.createHash('md5').update(content + timestamp).digest('hex');
  }

  /**
   * Handle conditional requests
   */
  handleConditionalRequest(req: Request, res: Response, next: NextFunction): void {
    const ifNoneMatch = req.get('If-None-Match');
    const ifModifiedSince = req.get('If-Modified-Since');
    const etag = res.get('ETag');
    const lastModified = res.get('Last-Modified');

    // Check ETag
    if (ifNoneMatch && etag && ifNoneMatch === etag) {
      res.status(304).end();
      return;
    }

    // Check Last-Modified
    if (ifModifiedSince && lastModified) {
      const ifModifiedSinceDate = new Date(ifModifiedSince);
      const lastModifiedDate = new Date(lastModified);
      
      if (lastModifiedDate <= ifModifiedSinceDate) {
        res.status(304).end();
        return;
      }
    }

    next();
  }

  /**
   * Clear cache for specific user
   */
  clearUserCache(userId: string): void {
    // This would typically clear user-specific cache entries
    // Implementation depends on your caching strategy
  }

  /**
   * Clear cache for specific endpoint
   */
  clearEndpointCache(endpoint: string): void {
    // This would typically clear cache entries for a specific endpoint
    // Implementation depends on your caching strategy
  }
}

export const cacheControlService = new CacheControlService();

// Middleware functions
export const setCacheHeaders = cacheControlService.setCacheHeaders.bind(cacheControlService);
export const handleConditionalRequest = cacheControlService.handleConditionalRequest.bind(cacheControlService);
