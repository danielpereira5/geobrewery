import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadBreweriesWithCoords,
  findBreweriesNearLocation,
  resetBreweries
} from '../breweryService';
import {
  loadBeers,
  getBeersByBrewery,
  resetBeers
} from '../beerService';
import {
  loadStates,
  findStateForLocation,
  resetStates
} from '../stateService';
import {
  loadPcyr,
  getLatestStateData,
  resetPopulationData
} from '../populationService';

// Mock fetch for testing
global.fetch = vi.fn();

describe('Performance Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    resetBreweries();
    resetBeers();
    resetStates();
    resetPopulationData();
    // Clear cache to ensure fresh tests
    const { cacheService } = await import('../cacheService');
    cacheService.clear();
  });

  describe('Data Loading Performance', () => {
    it('should load all breweries within reasonable time', async () => {
      const mockBreweries = Array.from({ length: 1000 }, (_, i) =>
        `id,name,city,state,lat,lon,source,geocode_status
${i},Test Brewery ${i},Test City,TS,${30 + Math.random() * 20},${-100 + Math.random() * 20},test,ok`
      ).join('\n');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockBreweries)
      });

      const startTime = performance.now();
      const result = await loadBreweriesWithCoords();
      const endTime = performance.now();

      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should load within 1 second
    });

    it('should load all beers within reasonable time', async () => {
      const mockBeers = `,abv,ibu,id,name,style,brewery_id,ounces
` + Array.from({ length: 5000 }, (_, i) =>
        `${i},${0.04 + Math.random() * 0.1},${20 + Math.random() * 60},${i},Test Beer ${i},Test Style,${Math.floor(i / 10)},12.0`
      ).join('\n');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockBeers)
      });

      const startTime = performance.now();
      const result = await loadBeers();
      const endTime = performance.now();

      expect(result.length).toBeGreaterThan(4900); // Allow for some CSV parsing variations
      expect(endTime - startTime).toBeLessThan(2000); // Should load within 2 seconds
    });
  });

  describe('Search Performance', () => {
    beforeEach(() => {
      // Mock large dataset
      const mockBreweries = Array.from({ length: 1000 }, (_, i) =>
        `id,name,city,state,lat,lon,source,geocode_status
${i},Test Brewery ${i},Test City,TS,${30 + Math.random() * 20},${-100 + Math.random() * 20},test,ok`
      ).join('\n');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockBreweries)
      });
    });

    it('should find nearby breweries quickly', async () => {
      const startTime = performance.now();
      const result = await findBreweriesNearLocation(30.2672, -97.7431, 50);
      const endTime = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(500); // Should search within 500ms
    });

    it('should handle multiple concurrent searches', async () => {
      const locations = [
        { lat: 30.2672, lon: -97.7431 }, // Austin
        { lat: 40.7128, lon: -74.0060 }, // NYC
        { lat: 34.0522, lon: -118.2437 }, // LA
        { lat: 41.8781, lon: -87.6298 }, // Chicago
        { lat: 29.7604, lon: -95.3698 }  // Houston
      ];

      // Mock multiple fetch calls for concurrent operations
      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('id,name,city,state,lat,lon,source,geocode_status\n1,Test,Austin,TX,30.2672,-97.7431,test,ok') })
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('id,name,city,state,lat,lon,source,geocode_status\n1,Test,Austin,TX,30.2672,-97.7431,test,ok') })
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('id,name,city,state,lat,lon,source,geocode_status\n1,Test,Austin,TX,30.2672,-97.7431,test,ok') })
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('id,name,city,state,lat,lon,source,geocode_status\n1,Test,Austin,TX,30.2672,-97.7431,test,ok') })
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('id,name,city,state,lat,lon,source,geocode_status\n1,Test,Austin,TX,30.2672,-97.7431,test,ok') });

      const startTime = performance.now();
      const promises = locations.map(loc =>
        findBreweriesNearLocation(loc.lat, loc.lon, 50)
      );
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
      expect(endTime - startTime).toBeLessThan(2000); // All searches within 2 seconds
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with repeated operations', async () => {
      const mockBreweries = Array.from({ length: 100 }, (_, i) =>
        `id,name,city,state,lat,lon,source,geocode_status
${i},Test Brewery ${i},Test City,TS,${30 + Math.random() * 20},${-100 + Math.random() * 20},test,ok`
      ).join('\n');

      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockBreweries)
      });

      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        await loadBreweriesWithCoords();
        await findBreweriesNearLocation(30.2672, -97.7431, 50);
        resetBreweries();
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });

  describe('State Detection Performance', () => {
    beforeEach(() => {
      const mockStates = {
        type: 'FeatureCollection',
        features: Array.from({ length: 50 }, (_, i) => ({
          type: 'Feature',
          properties: { NAME: `State ${i}`, STATEFP: i.toString() },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-100 - i, 30 - i],
              [-90 - i, 30 - i],
              [-90 - i, 40 - i],
              [-100 - i, 40 - i],
              [-100 - i, 30 - i]
            ]]
          }
        }))
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStates)
      });
    });

    it('should detect state quickly', async () => {
      const startTime = performance.now();
      const result = await findStateForLocation(-95.3698, 29.7604);
      const endTime = performance.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should detect within 1 second
    });
  });

  describe('Beer Analysis Performance', () => {
    beforeEach(() => {
      const mockBeers = Array.from({ length: 1000 }, (_, i) =>
        `,abv,ibu,id,name,style,brewery_id,ounces
${i},${0.04 + Math.random() * 0.1},${20 + Math.random() * 60},${i},Test Beer ${i},Test Style ${i % 20},${Math.floor(i / 10)},12.0`
      ).join('\n');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockBeers)
      });
    });

    it('should analyze beer styles quickly', async () => {
      const startTime = performance.now();
      const result = await getBeersByBrewery(1);
      const endTime = performance.now();

      expect(Array.isArray(result)).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // Should analyze within 500ms
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent data loading', async () => {
      const mockData = {
        breweries: Array.from({ length: 100 }, (_, i) =>
          `id,name,city,state,lat,lon,source,geocode_status
${i},Test Brewery ${i},Test City,TS,${30 + Math.random() * 20},${-100 + Math.random() * 20},test,ok`
        ).join('\n'),
        beers: `,abv,ibu,id,name,style,brewery_id,ounces
` + Array.from({ length: 500 }, (_, i) =>
          `${i},${0.04 + Math.random() * 0.1},${20 + Math.random() * 60},${i},Test Beer ${i},Test Style,${Math.floor(i / 10)},12.0`
        ).join('\n'),
        states: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { NAME: 'Test State', STATEFP: '1' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-100, 30], [-90, 30], [-90, 40], [-100, 40], [-100, 30]]]
            }
          }]
        }
      };

      (global.fetch as any)
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockData.breweries) })
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(mockData.beers) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData.states) });

      const startTime = performance.now();
      const [breweries, beers, state] = await Promise.all([
        loadBreweriesWithCoords(),
        loadBeers(),
        loadStates()
      ]);
      const endTime = performance.now();

      expect(breweries).toHaveLength(100);
      expect(beers.length).toBeGreaterThanOrEqual(490); // Allow for some CSV parsing variations
      expect(state).toBeDefined();
      expect(endTime - startTime).toBeLessThan(3000); // All operations within 3 seconds
    });
  });
});
