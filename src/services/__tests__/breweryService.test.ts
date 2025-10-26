import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadBreweriesWithCoords,
  breweriesCount,
  findBreweriesNearLocation,
  getBreweriesByState,
  getBreweryDensity,
  resetBreweries
} from '../breweryService';

// Mock fetch for testing
global.fetch = vi.fn();

describe('BreweryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetBreweries();
  });

  describe('loadBreweriesWithCoords', () => {
    it('should load breweries data successfully', async () => {
      const mockCSV = `id,name,city,state,lat,lon,source,geocode_status
0,NorthGate Brewing,Minneapolis,MN,44.977300,-93.265469,nominatim:city+state,ok
1,Against the Grain Brewery,Louisville,KY,38.255567,-85.744268,nominatim:name+city+state,ok`;

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockCSV)
      });

      const result = await loadBreweriesWithCoords();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '0',
        name: 'NorthGate Brewing',
        city: 'Minneapolis',
        state: 'MN',
        lat: 44.977300,
        lon: -93.265469,
        source: 'nominatim:city+state',
        geocode_status: 'ok'
      });
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadBreweriesWithCoords()).rejects.toThrow('Network error');
    });
  });

  describe('breweriesCount', () => {
    it('should return 0 when no breweries loaded', () => {
      expect(breweriesCount()).toBe(0);
    });
  });

  describe('findBreweriesNearLocation', () => {
    const mockBreweries = [
      {
        id: '1',
        name: 'Test Brewery 1',
        city: 'Austin',
        state: 'TX',
        lat: 30.2672,
        lon: -97.7431,
        source: 'test',
        geocode_status: 'ok'
      },
      {
        id: '2',
        name: 'Test Brewery 2',
        city: 'Dallas',
        state: 'TX',
        lat: 32.7767,
        lon: -96.7970,
        source: 'test',
        geocode_status: 'ok'
      }
    ];

    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`id,name,city,state,lat,lon,source,geocode_status
1,Test Brewery 1,Austin,TX,30.2672,-97.7431,test,ok
2,Test Brewery 2,Dallas,TX,32.7767,-96.7970,test,ok`)
      });
    });

    it('should find breweries within radius', async () => {
      // Austin coordinates
      const result = await findBreweriesNearLocation(30.2672, -97.7431, 200);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('distance');
      expect(result[0].distance).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array when no breweries in radius', async () => {
      // Coordinates far from any brewery
      const result = await findBreweriesNearLocation(0, 0, 10);
      expect(result).toHaveLength(0);
    });
  });

  describe('getBreweriesByState', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`id,name,city,state,lat,lon,source,geocode_status
1,Test Brewery 1,Austin,TX,30.2672,-97.7431,test,ok
2,Test Brewery 2,Minneapolis,MN,44.977300,-93.265469,test,ok`)
      });
    });

    it('should filter breweries by state', async () => {
      const result = await getBreweriesByState('TX');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('TX');
    });

    it('should handle case insensitive state matching', async () => {
      const result = await getBreweriesByState('tx');
      expect(result).toHaveLength(1);
      expect(result[0].state).toBe('TX');
    });
  });

  describe('getBreweryDensity', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`id,name,city,state,lat,lon,source,geocode_status
1,Test Brewery 1,Austin,TX,30.2672,-97.7431,test,ok
2,Test Brewery 2,Dallas,TX,32.7767,-96.7970,test,ok`)
      });
    });

    it('should calculate brewery density', async () => {
      const result = await getBreweryDensity(30.2672, -97.7431, 100);

      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('density');
      expect(result.count).toBeGreaterThanOrEqual(0);
      expect(result.density).toBeGreaterThanOrEqual(0);
    });
  });
});
