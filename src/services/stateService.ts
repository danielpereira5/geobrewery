// State detection service - migrated from Fall2025Project/src/calcs/findState.js
// This function takes a longitude and latitude and returns the state.
// Data for this is from: https://eric.clst.org/tech/usgeojson/

export interface StateResult {
  stateId: number;
  stateName: string;
}

let STATES: any = null;

// Reset function for testing
export function resetStates() {
  STATES = null;
}

// --- load once & cache ---
export async function loadStates(): Promise<any> {
  if (STATES) return STATES;

  try {
    const res = await fetch('/data/gz_2010_us_040_00_20m.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load states geojson: ${res.status}`);
    STATES = await res.json();
    return STATES;
  } catch (error) {
    console.error('Error loading states:', error);
    throw error;
  }
}

// --- geometry helpers (ray casting) ---
function pointInRing([x, y]: [number, number], ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = ((yi > y) !== (yj > y)) &&
                      (x < (xj - xi) * (y - yi) / (yj - yi + 0.0) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(pt: [number, number], polygon: number[][][]): boolean {
  if (!pointInRing(pt, polygon[0])) return false;
  for (let h = 1; h < polygon.length; h++) {
    if (pointInRing(pt, polygon[h])) return false;
  }
  return true;
}

function pointInMultiPolygon(pt: [number, number], multi: number[][][][]): boolean {
  for (const polygon of multi) {
    if (pointInPolygon(pt, polygon)) return true;
  }
  return false;
}

// --- property parsing (robust to Census variants) ---
const USPS_TO_FIPS: Record<string, number> = {
  AL: 1, AK: 2, AZ: 4, AR: 5, CA: 6, CO: 8, CT: 9, DE: 10, DC: 11, FL: 12, GA: 13, HI: 15,
  ID: 16, IL: 17, IN: 18, IA: 19, KS: 20, KY: 21, LA: 22, ME: 23, MD: 24, MA: 25, MI: 26,
  MN: 27, MS: 28, MO: 29, MT: 30, NE: 31, NV: 32, NH: 33, NJ: 34, NM: 35, NY: 36, NC: 37,
  ND: 38, OH: 39, OK: 40, OR: 41, PA: 42, RI: 44, SC: 45, SD: 46, TN: 47, TX: 48, UT: 49,
  VT: 50, VA: 51, WA: 53, WV: 54, WI: 55, WY: 56
};

function fipsFromProps(props: any): number | null {
  if (props.STATEFP) return parseInt(props.STATEFP, 10);
  if (props.STATE) return parseInt(props.STATE, 10);
  if (props.GEOID && /^\d{2}$/.test(props.GEOID)) return parseInt(props.GEOID, 10);

  const tail2 = (s: any) => (String(s || '').match(/(\d{2})$/)?.[1] ?? null);
  const aff = tail2(props.AFFGEOID);
  if (aff) return parseInt(aff, 10);
  const gid = tail2(props.GEOID);
  if (gid) return parseInt(gid, 10);

  const st = String(props.STUSPS || '').toUpperCase();
  if (st && USPS_TO_FIPS[st] != null) return USPS_TO_FIPS[st];
  return null;
}

// --- main API ---
export function findStateForLonLat(lon: number, lat: number, statesFC: any = STATES): StateResult | null {
  if (!statesFC) throw new Error('States GeoJSON not loaded. Call loadStates() first.');

  const pt: [number, number] = [lon, lat];

  for (const f of statesFC.features) {
    const props = f.properties || {};
    const geom = f.geometry;
    if (!geom) continue;

    const stateId = fipsFromProps(props);
    const stateName = props.NAME || props.name || '(Unknown)';

    const hit = geom.type === 'Polygon'
      ? pointInPolygon(pt, geom.coordinates)
      : geom.type === 'MultiPolygon'
        ? pointInMultiPolygon(pt, geom.coordinates)
        : false;

    if (hit) return { stateId, stateName };
  }
  return null;
}

// --- convenience function that loads states and finds state ---
export async function findStateForLocation(lon: number, lat: number): Promise<StateResult | null> {
  const states = await loadStates();
  return findStateForLonLat(lon, lat, states);
}
