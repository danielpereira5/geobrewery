import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadStates, findStateForLonLat, findStateForLocation, resetStates } from '../stateService';

// Mock fetch for testing
global.fetch = vi.fn();

describe('StateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStates();
  });

  describe('loadStates', () => {
    it('should load states data successfully', async () => {
      const mockGeoJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { NAME: 'Texas', STATEFP: '48' },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-106.645646, 25.837163], [-93.508292, 25.837163]]]
            }
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGeoJSON)
      });

      const result = await loadStates();
      expect(result).toEqual(mockGeoJSON);
      expect(global.fetch).toHaveBeenCalledWith('/data/gz_2010_us_040_00_20m.json', { cache: 'no-store' });
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadStates()).rejects.toThrow('Network error');
    });
  });

  describe('findStateForLonLat', () => {
    const mockStates = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { NAME: 'Texas', STATEFP: '48' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-106.645646, 25.837163],
              [-93.508292, 25.837163],
              [-93.508292, 36.500704],
              [-106.645646, 36.500704],
              [-106.645646, 25.837163]
            ]]
          }
        }
      ]
    };

    it('should find state for coordinates within Texas', () => {
      const result = findStateForLonLat(-97.7431, 30.2672, mockStates);
      expect(result).toEqual({
        stateId: 48,
        stateName: 'Texas'
      });
    });

    it('should return null for coordinates outside any state', () => {
      const result = findStateForLonLat(-180, 90, mockStates);
      expect(result).toBeNull();
    });

    it('should throw error if states not loaded', () => {
      expect(() => findStateForLonLat(-97.7431, 30.2672, null)).toThrow(
        'States GeoJSON not loaded. Call loadStates() first.'
      );
    });
  });

  describe('findStateForLocation', () => {
    it('should load states and find state for location', async () => {
      const mockStates = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { NAME: 'Texas', STATEFP: '48' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-106.645646, 25.837163],
                [-93.508292, 25.837163],
                [-93.508292, 36.500704],
                [-106.645646, 36.500704],
                [-106.645646, 25.837163]
              ]]
            }
          }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStates)
      });

      const result = await findStateForLocation(-97.7431, 30.2672);
      expect(result).toEqual({
        stateId: 48,
        stateName: 'Texas'
      });
    });
  });
});
