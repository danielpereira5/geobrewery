// Brewery service - migrated from Fall2025Project/src/calcs/breweries.js

export interface Brewery {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lon: number;
  source?: string;
  geocode_status?: string;
}

export interface BreweryWithDistance extends Brewery {
  distance: number; // in miles
}

let BREWERIES: Brewery[] | null = null;

// Reset function for testing
export function resetBreweries() {
  BREWERIES = null;
}

function parseCSV(text: string): any[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const headers = header.split(',').map(s => s.trim());
  return lines.map(line => {
    const cells = line.split(',').map(s => s.trim());
    const o: any = {};
    headers.forEach((h, i) => o[h] = cells[i]);
    return o;
  });
}

export async function loadBreweriesWithCoords(): Promise<Brewery[]> {
  if (BREWERIES) return BREWERIES;

  try {
    const res = await fetch('/data/breweries_with_coords.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load breweries_with_coords.csv: ${res.status}`);
    const rows = parseCSV(await res.text());

    // Normalize & validate
    BREWERIES = rows.map(r => ({
      id: String(r.id).trim(),
      name: (r.name || '').trim(),
      city: (r.city || '').trim(),
      state: (r.state || '').trim(),
      lat: Number(r.lat),
      lon: Number(r.lon),
      source: r.source,
      geocode_status: r.geocode_status
    })).filter(r => Number.isFinite(r.lat) && Number.isFinite(r.lon));

    return BREWERIES;
  } catch (error) {
    console.error('Error loading breweries:', error);
    throw error;
  }
}

export function breweriesCount(): number {
  if (!BREWERIES) return 0;
  return BREWERIES.length;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find breweries within a specified radius of a location
export async function findBreweriesNearLocation(
  lat: number,
  lon: number,
  radiusMiles: number = 50
): Promise<BreweryWithDistance[]> {
  const breweries = await loadBreweriesWithCoords();

  const nearbyBreweries: BreweryWithDistance[] = [];

  for (const brewery of breweries) {
    const distance = calculateDistance(lat, lon, brewery.lat, brewery.lon);
    if (distance <= radiusMiles) {
      nearbyBreweries.push({
        ...brewery,
        distance
      });
    }
  }

  // Sort by distance
  return nearbyBreweries.sort((a, b) => a.distance - b.distance);
}

// Get breweries by state
export async function getBreweriesByState(state: string): Promise<Brewery[]> {
  const breweries = await loadBreweriesWithCoords();
  return breweries.filter(brewery =>
    brewery.state.toLowerCase().trim() === state.toLowerCase().trim()
  );
}

// Get brewery density for a given area (breweries per square mile)
export async function getBreweryDensity(
  lat: number,
  lon: number,
  radiusMiles: number = 50
): Promise<{ count: number; density: number }> {
  const nearbyBreweries = await findBreweriesNearLocation(lat, lon, radiusMiles);
  const area = Math.PI * radiusMiles * radiusMiles; // Area of circle
  const density = nearbyBreweries.length / area;

  return {
    count: nearbyBreweries.length,
    density
  };
}
