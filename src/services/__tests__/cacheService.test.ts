import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from '../cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve data', () => {
      const testData = { name: 'Test', value: 123 };
      cacheService.set('test-key', testData);

      const retrieved = cacheService.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should check if key exists', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.has('test-key')).toBe(true);
      expect(cacheService.has('non-existent')).toBe(false);
    });

    it('should delete keys', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.has('test-key')).toBe(true);

      const deleted = cacheService.delete('test-key');
      expect(deleted).toBe(true);
      expect(cacheService.has('test-key')).toBe(false);
    });

    it('should clear all data', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');

      cacheService.clear();

      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('TTL and Expiration', () => {
    it('should respect TTL', async () => {
      cacheService.set('test-key', 'test-value', 100); // 100ms TTL

      expect(cacheService.get('test-key')).toBe('test-value');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cacheService.get('test-key')).toBeNull();
    });

    it('should use default TTL when not specified', () => {
      cacheService.set('test-key', 'test-value');
      expect(cacheService.get('test-key')).toBe('test-value');
    });

    it('should clear expired entries', async () => {
      cacheService.set('key1', 'value1', 50);
      cacheService.set('key2', 'value2', 200);

      // Wait for first key to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      cacheService.clearExpired();

      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBe('value2');
    });
  });

  describe('Cache Types', () => {
    it('should set data with specific cache type TTL', () => {
      cacheService.setWithType('brewery-key', 'brewery-data', 'BREWERIES');
      expect(cacheService.get('brewery-key')).toBe('brewery-data');
    });

    it('should use different TTL for different types', () => {
      cacheService.setWithType('brewery-key', 'brewery-data', 'BREWERIES');
      cacheService.setWithType('beer-key', 'beer-data', 'BEERS');

      expect(cacheService.get('brewery-key')).toBe('brewery-data');
      expect(cacheService.get('beer-key')).toBe('beer-data');
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate brewery search keys', () => {
      const key = cacheService.generateBrewerySearchKey(30.2672, -97.7431, 50);
      expect(key).toBe('brewery_search_30.2672_-97.7431_50');
    });

    it('should generate state search keys', () => {
      const key = cacheService.generateStateSearchKey(-97.7431, 30.2672);
      expect(key).toBe('state_search_-97.7431_30.2672');
    });

    it('should generate beer analysis keys', () => {
      const key = cacheService.generateBeerAnalysisKey([1, 3, 2]);
      expect(key).toBe('beer_analysis_1_2_3'); // Should be sorted
    });

    it('should generate location analysis keys', () => {
      const key = cacheService.generateLocationAnalysisKey(30.2672, -97.7431, 50);
      expect(key).toBe('location_analysis_30.2672_-97.7431_50');
    });
  });

  describe('Statistics', () => {
    it('should track cache hits and misses', () => {
      cacheService.set('test-key', 'test-value');

      // Miss
      cacheService.get('non-existent');

      // Hit
      cacheService.get('test-key');
      cacheService.get('test-key');

      const stats = cacheService.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    it('should calculate hit rate', () => {
      cacheService.set('test-key', 'test-value');

      cacheService.get('test-key'); // Hit
      cacheService.get('non-existent'); // Miss
      cacheService.get('test-key'); // Hit

      const hitRate = cacheService.getHitRate();
      expect(hitRate).toBe(2/3); // 2 hits out of 3 total requests
    });

    it('should track cache size', () => {
      expect(cacheService.getStats().size).toBe(0);

      cacheService.set('key1', 'value1');
      expect(cacheService.getStats().size).toBe(1);

      cacheService.set('key2', 'value2');
      expect(cacheService.getStats().size).toBe(2);

      cacheService.delete('key1');
      expect(cacheService.getStats().size).toBe(1);
    });

    it('should track evictions', async () => {
      cacheService.set('test-key', 'test-value', 50);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));

      // This should trigger eviction
      cacheService.get('test-key');

      const stats = cacheService.getStats();
      expect(stats.evictions).toBe(1);
    });
  });

  describe('Memory Management', () => {
    it('should estimate memory usage', () => {
      cacheService.set('test-key', 'test-value');

      const memoryUsage = cacheService.getMemoryUsage();
      expect(memoryUsage).toBeGreaterThan(0);
    });

    it('should cleanup when cache gets too large', () => {
      // Add many entries to trigger cleanup
      for (let i = 0; i < 120; i++) {
        cacheService.set(`key-${i}`, `value-${i}`);
      }

      // Manually trigger cleanup
      cacheService.cleanup();

      const stats = cacheService.getStats();
      expect(stats.size).toBeLessThan(120); // Should have cleaned up some entries
    });
  });

  describe('Preloading', () => {
    it('should preload data without errors', async () => {
      // This should not throw
      await expect(cacheService.preloadData()).resolves.toBeUndefined();
    });
  });
});
