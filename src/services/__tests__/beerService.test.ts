import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadBeers,
  beersCount,
  getBeersByBrewery,
  getBeerStyleAnalysis,
  getBreweryBeerAnalysis,
  getTopBeerStyles,
  getBreweriesWithMostBeers,
  resetBeers
} from '../beerService';

// Mock fetch for testing
global.fetch = vi.fn();

describe('BeerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetBeers();
  });

  describe('loadBeers', () => {
    it('should load beers data successfully', async () => {
      const mockCSV = `,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0`;

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockCSV)
      });

      const result = await loadBeers();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1436,
        name: 'Pub Beer',
        abv: 0.05,
        ibu: null,
        style: 'American Pale Lager',
        brewery_id: 408,
        ounces: 12.0
      });
    });

    it('should handle fetch errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(loadBeers()).rejects.toThrow('Network error');
    });
  });

  describe('beersCount', () => {
    it('should return 0 when no beers loaded', () => {
      expect(beersCount()).toBe(0);
    });
  });

  describe('getBeersByBrewery', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0
2,0.071,,2264,Rise of the Phoenix,American IPA,177,12.0`)
      });
    });

    it('should filter beers by brewery ID', async () => {
      const result = await getBeersByBrewery(177);
      expect(result).toHaveLength(2);
      expect(result.every(beer => beer.brewery_id === 177)).toBe(true);
    });

    it('should return empty array for non-existent brewery', async () => {
      const result = await getBeersByBrewery(999);
      expect(result).toHaveLength(0);
    });
  });

  describe('getBeerStyleAnalysis', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0
2,0.071,,2264,Rise of the Phoenix,American IPA,177,12.0`)
      });
    });

    it('should analyze beer styles', async () => {
      const result = await getBeerStyleAnalysis();

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('style');
      expect(result[0]).toHaveProperty('count');
      expect(result[0]).toHaveProperty('avgAbv');
      expect(result[0]).toHaveProperty('avgIbu');
    });

    it('should sort styles by count descending', async () => {
      const result = await getBeerStyleAnalysis();

      for (let i = 1; i < result.length; i++) {
        expect(result[i-1].count).toBeGreaterThanOrEqual(result[i].count);
      }
    });
  });

  describe('getBreweryBeerAnalysis', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0
2,0.071,,2264,Rise of the Phoenix,American IPA,177,12.0`)
      });
    });

    it('should analyze breweries by their beer offerings', async () => {
      const result = await getBreweryBeerAnalysis();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('breweryId');
      expect(result[0]).toHaveProperty('beerCount');
      expect(result[0]).toHaveProperty('avgAbv');
      expect(result[0]).toHaveProperty('avgIbu');
      expect(result[0]).toHaveProperty('styles');
      expect(result[0]).toHaveProperty('uniqueStyles');
    });

    it('should sort breweries by beer count descending', async () => {
      const result = await getBreweryBeerAnalysis();

      for (let i = 1; i < result.length; i++) {
        expect(result[i-1].beerCount).toBeGreaterThanOrEqual(result[i].beerCount);
      }
    });
  });

  describe('getTopBeerStyles', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0
2,0.071,,2264,Rise of the Phoenix,American IPA,177,12.0`)
      });
    });

    it('should return top beer styles with limit', async () => {
      const result = await getTopBeerStyles(2);
      expect(result).toHaveLength(2);
    });
  });

  describe('getBreweriesWithMostBeers', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`,abv,ibu,id,name,style,brewery_id,ounces
0,0.05,,1436,Pub Beer,American Pale Lager,408,12.0
1,0.066,,2265,Devil's Cup,American Pale Ale (APA),177,12.0
2,0.071,,2264,Rise of the Phoenix,American IPA,177,12.0`)
      });
    });

    it('should return breweries with most beers with limit', async () => {
      const result = await getBreweriesWithMostBeers(1);
      expect(result).toHaveLength(1);
    });
  });
});
