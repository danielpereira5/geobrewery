// Beer service - for analyzing beer data from Fall2025Project/beerData/beers.csv

export interface Beer {
  id: number;
  name: string;
  abv: number;
  ibu: number | null;
  style: string;
  brewery_id: number;
  ounces: number;
}

export interface BeerStyleAnalysis {
  style: string;
  count: number;
  avgAbv: number;
  avgIbu: number | null;
}

export interface BreweryBeerAnalysis {
  breweryId: number;
  beerCount: number;
  avgAbv: number;
  avgIbu: number | null;
  styles: string[];
  uniqueStyles: number;
}

let BEERS: Beer[] | null = null;

// Reset function for testing
export function resetBeers() {
  BEERS = null;
}

function parseCSV(text: string): Record<string, string>[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  if (!header) return [];
  const headers = header.split(',').map(s => s.trim());
  return lines.map(line => {
    const cells = line.split(',').map(s => s.trim());
    const o: Record<string, string> = {};
    headers.forEach((h, i) => o[h] = cells[i] || '');
    return o;
  });
}

function parseNumber(value: unknown): number | null {
  if (value == null || value === '' || value === '.') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function loadBeers(): Promise<Beer[]> {
  if (BEERS) return BEERS;

  try {
    const res = await fetch('/data/beers.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load beers.csv: ${res.status}`);
    const rows = parseCSV(await res.text());

    // Parse and validate beer data
    BEERS = rows.map(r => ({
      id: parseInt(r.id || '0') || 0,
      name: (r.name || '').trim(),
      abv: parseNumber(r.abv) || 0,
      ibu: parseNumber(r.ibu),
      style: (r.style || '').trim(),
      brewery_id: parseInt(r.brewery_id || '0') || 0,
      ounces: parseNumber(r.ounces) || 0
    })).filter(beer => beer.id > 0 && beer.brewery_id > 0);

    return BEERS;
  } catch (error) {
    console.error('Error loading beers:', error);
    throw error;
  }
}

export function beersCount(): number {
  if (!BEERS) return 0;
  return BEERS.length;
}

// Get beers by brewery ID
export async function getBeersByBrewery(breweryId: number): Promise<Beer[]> {
  const beers = await loadBeers();
  return beers.filter(beer => beer.brewery_id === breweryId);
}

// Analyze beer styles
export async function getBeerStyleAnalysis(): Promise<BeerStyleAnalysis[]> {
  const beers = await loadBeers();
  const styleMap = new Map<string, { count: number; abvSum: number; ibuSum: number; ibuCount: number }>();

  for (const beer of beers) {
    const style = beer.style || 'Unknown';
    const existing = styleMap.get(style) || { count: 0, abvSum: 0, ibuSum: 0, ibuCount: 0 };

    existing.count++;
    existing.abvSum += beer.abv;
    if (beer.ibu != null) {
      existing.ibuSum += beer.ibu;
      existing.ibuCount++;
    }

    styleMap.set(style, existing);
  }

  return Array.from(styleMap.entries()).map(([style, data]) => ({
    style,
    count: data.count,
    avgAbv: data.abvSum / data.count,
    avgIbu: data.ibuCount > 0 ? data.ibuSum / data.ibuCount : null
  })).sort((a, b) => b.count - a.count);
}

// Analyze breweries by their beer offerings
export async function getBreweryBeerAnalysis(): Promise<BreweryBeerAnalysis[]> {
  const beers = await loadBeers();
  const breweryMap = new Map<number, { beers: Beer[] }>();

  // Group beers by brewery
  for (const beer of beers) {
    if (!breweryMap.has(beer.brewery_id)) {
      breweryMap.set(beer.brewery_id, { beers: [] });
    }
    breweryMap.get(beer.brewery_id)!.beers.push(beer);
  }

  // Analyze each brewery
  return Array.from(breweryMap.entries()).map(([breweryId, data]) => {
    const beers = data.beers;
    const styles = [...new Set(beers.map(b => b.style))];
    const abvSum = beers.reduce((sum, beer) => sum + beer.abv, 0);
    const ibuBeers = beers.filter(b => b.ibu != null);
    const ibuSum = ibuBeers.reduce((sum, beer) => sum + (beer.ibu || 0), 0);

    return {
      breweryId,
      beerCount: beers.length,
      avgAbv: abvSum / beers.length,
      avgIbu: ibuBeers.length > 0 ? ibuSum / ibuBeers.length : null,
      styles,
      uniqueStyles: styles.length
    };
  }).sort((a, b) => b.beerCount - a.beerCount);
}

// Get top beer styles by count
export async function getTopBeerStyles(limit: number = 10): Promise<BeerStyleAnalysis[]> {
  const analysis = await getBeerStyleAnalysis();
  return analysis.slice(0, limit);
}

// Get breweries with most beers
export async function getBreweriesWithMostBeers(limit: number = 10): Promise<BreweryBeerAnalysis[]> {
  const analysis = await getBreweryBeerAnalysis();
  return analysis.slice(0, limit);
}
