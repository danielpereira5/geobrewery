// Enhanced caching service for GeoBrewery application

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0
  };

  // Default TTL values (in milliseconds)
  private readonly DEFAULT_TTL = {
    BREWERIES: 5 * 60 * 1000, // 5 minutes
    BEERS: 10 * 60 * 1000, // 10 minutes
    STATES: 60 * 60 * 1000, // 1 hour
    POPULATION: 30 * 60 * 1000, // 30 minutes
    SEARCH_RESULTS: 2 * 60 * 1000, // 2 minutes
    ANALYSIS_RESULTS: 5 * 60 * 1000 // 5 minutes
  };

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.evictions++;
      this.stats.size--;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL.BREWERIES
    };

    // If key already exists, update stats
    if (this.cache.has(key)) {
      this.stats.size--; // Will be incremented below
    }

    this.cache.set(key, entry);
    this.stats.size++;
  }

  /**
   * Set data with specific cache type TTL
   */
  setWithType<T>(key: string, data: T, type: keyof typeof this.DEFAULT_TTL): void {
    this.set(key, data, this.DEFAULT_TTL[type]);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.evictions++;
      this.stats.size--;
      return false;
    }

    return true;
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    const existed = this.cache.delete(key);
    if (existed) {
      this.stats.size--;
    }
    return existed;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0
    };
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    let evicted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        evicted++;
      }
    }

    this.stats.evictions += evicted;
    this.stats.size -= evicted;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  /**
   * Get cache size in memory (approximate)
   */
  getMemoryUsage(): number {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // Approximate string size
      size += JSON.stringify(entry.data).length * 2; // Approximate data size
      size += 16; // Entry overhead
    }
    return size;
  }

  /**
   * Generate cache key for brewery search
   */
  generateBrewerySearchKey(lat: number, lon: number, radius: number): string {
    return `brewery_search_${lat.toFixed(4)}_${lon.toFixed(4)}_${radius}`;
  }

  /**
   * Generate cache key for state detection
   */
  generateStateSearchKey(lon: number, lat: number): string {
    return `state_search_${lon.toFixed(4)}_${lat.toFixed(4)}`;
  }

  /**
   * Generate cache key for beer analysis
   */
  generateBeerAnalysisKey(breweryIds: number[]): string {
    const sortedIds = [...breweryIds].sort((a, b) => a - b);
    return `beer_analysis_${sortedIds.join('_')}`;
  }

  /**
   * Generate cache key for location analysis
   */
  generateLocationAnalysisKey(lat: number, lon: number, radius: number): string {
    return `location_analysis_${lat.toFixed(4)}_${lon.toFixed(4)}_${radius}`;
  }

  /**
   * Preload frequently accessed data
   */
  async preloadData(): Promise<void> {
    // This would be called during app initialization
    // to preload commonly used data
    console.log('Preloading cache data...');

    // Clear expired entries first
    this.clearExpired();

    console.log(`Cache preloaded. Current size: ${this.stats.size} entries`);
  }

  /**
   * Cleanup old entries to prevent memory leaks
   */
  cleanup(): void {
    this.clearExpired();

    // If cache is getting too large, remove oldest entries
    if (this.stats.size > 100) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      // Remove oldest 20% of entries
      const toRemove = Math.floor(entries.length * 0.2);
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
        this.stats.evictions++;
        this.stats.size--;
      }
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Export types
export type { CacheStats };

// Auto-cleanup every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);
