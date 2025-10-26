import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadPcyr,
  getStateYearSummary,
  getStateConsumptionTrends,
  getLatestStateData,
  compareStatesConsumption,
  resetPopulationData
} from '../populationService';

// Mock fetch for testing
global.fetch = vi.fn();

describe('PopulationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPopulationData();
  });

  describe('loadPcyr', () => {
    it('should load population data successfully', async () => {
      const mockCSV = `year,geographicID,type,gallons_bev,gallons_eth,pop_14up,gallons_eth_per14up,decile_pcc14up,pop21up,gallons_eth_per21up,decile_pcc14up,data_source,abv,gallons_eth_fromabv
1970,5,3,22378000,1007010,1422000,7082,10,1169000,8614,10,.,.,.`;

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockCSV)
      });

      const result = await loadPcyr();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        year: 1970,
        geographicID: 5,
        type: 3,
        gallons_bev: 22378000,
        gallons_eth: 1007010,
        pop_14up: 1422000,
        gallons_eth_per14up: 7082,
        decile_pcc14up: 10,
        pop21up: 1169000,
        gallons_eth_per21up: 8614,
        data_source: '.',
        abv: null,
        gallons_eth_fromabv: null
      });
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadPcyr()).rejects.toThrow('Network error');
    });
  });

  describe('getStateYearSummary', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`year,geographicID,type,gallons_bev,gallons_eth,pop_14up,gallons_eth_per14up,decile_pcc14up,pop21up,gallons_eth_per21up,decile_pcc14up,data_source,abv,gallons_eth_fromabv
1970,5,3,22378000,1007010,1422000,7082,10,1169000,8614,10,.,.,.
1970,5,4,.,2037140,1422000,14326,10,1169000,17426,10,.,.,.`)
      });
    });

    it('should summarize state data for a specific year', async () => {
      await loadPcyr();
      const result = getStateYearSummary(5, 1970);

      expect(result).toHaveProperty('Rows matched');
      expect(result).toHaveProperty('Total gallons_eth');
      expect(result).toHaveProperty('Total gallons_bev');
      expect(result).toHaveProperty('pop21up (first)');
      expect(result).toHaveProperty('gallons_eth / pop21up');
      expect(result).toHaveProperty('pop_14up (first)');
      expect(result).toHaveProperty('gallons_eth / pop_14up');
    });

    it('should throw error if data not loaded', () => {
      expect(() => getStateYearSummary(5, 1970)).toThrow(
        'pcyr DB not loaded. Call loadPcyr() first.'
      );
    });
  });

  describe('getStateConsumptionTrends', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`year,geographicID,type,gallons_bev,gallons_eth,pop_14up,gallons_eth_per14up,decile_pcc14up,pop21up,gallons_eth_per21up,decile_pcc14up,data_source,abv,gallons_eth_fromabv
1970,5,3,22378000,1007010,1422000,7082,10,1169000,8614,10,.,.,.
1980,5,3,25000000,1200000,1500000,8000,10,1200000,10000,10,.,.,.`)
      });
    });

    it('should get consumption trends for a state over time', async () => {
      const result = await getStateConsumptionTrends(5, 1970, 1980);

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('summary');
      if (result.length > 1) {
        expect(result[1]).toHaveProperty('year');
        expect(result[1]).toHaveProperty('summary');
      }
    });
  });

  describe('getLatestStateData', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`year,geographicID,type,gallons_bev,gallons_eth,pop_14up,gallons_eth_per14up,decile_pcc14up,pop21up,gallons_eth_per21up,decile_pcc14up,data_source,abv,gallons_eth_fromabv
1970,5,3,22378000,1007010,1422000,7082,10,1169000,8614,10,.,.,.
2022,5,3,30000000,1500000,2000000,7500,10,1800000,8333,10,.,.,.`)
      });
    });

    it('should get latest consumption data for a state', async () => {
      const result = await getLatestStateData(5);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('Rows matched');
    });

    it('should return null for state with no data', async () => {
      const result = await getLatestStateData(999);
      expect(result).toBeNull();
    });
  });

  describe('compareStatesConsumption', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`year,geographicID,type,gallons_bev,gallons_eth,pop_14up,gallons_eth_per14up,decile_pcc14up,pop21up,gallons_eth_per21up,decile_pcc14up,data_source,abv,gallons_eth_fromabv
1970,5,3,22378000,1007010,1422000,7082,10,1169000,8614,10,.,.,.
1970,6,3,45071000,20281950,14811000,13694,3,12247000,16561,3,.,.,.`)
      });
    });

    it('should compare consumption between states', async () => {
      const result = await compareStatesConsumption([5, 6], 1970);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('stateId', 5);
      expect(result[0]).toHaveProperty('summary');
      expect(result[1]).toHaveProperty('stateId', 6);
      expect(result[1]).toHaveProperty('summary');
    });
  });
});
