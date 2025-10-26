// Population service - migrated from Fall2025Project/src/calcs/pcyrData.js

export interface PopulationData {
  year: number;
  geographicID: number;
  type: number;
  gallons_bev: number | null;
  gallons_eth: number | null;
  pop_14up: number | null;
  gallons_eth_per14up: number | null;
  decile_pcc14up: number | null;
  pop21up: number | null;
  gallons_eth_per21up: number | null;
  data_source: string | null;
  abv: number | null;
  gallons_eth_fromabv: number | null;
}

export interface StateYearSummary {
  'Rows matched': number;
  'Total gallons_eth': string;
  'Total gallons_bev': string;
  'pop21up (first)': string;
  'gallons_eth / pop21up': string;
  'pop_14up (first)': string;
  'gallons_eth / pop_14up': string;
}

let DB: PopulationData[] | null = null;

// Reset function for testing
export function resetPopulationData() {
  DB = null;
}

function parseCSV(text: string): any[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()!.split(',').map(s => s.trim());
  return lines.map(line => {
    const cells = line.split(',').map(s => s.trim());
    const row: any = {};
    headers.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
}

export async function loadPcyr(): Promise<PopulationData[]> {
  if (DB) return DB;

  try {
    const res = await fetch('/data/pcyr1970-2022.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load pcyr CSV: ${res.status}`);
    const txt = await res.text();
    const rows = parseCSV(txt);

    // Parse and validate data
    DB = rows.map(r => ({
      year: parseInt(r.year) || 0,
      geographicID: parseInt(r.geographicID) || 0,
      type: parseInt(r.type) || 0,
      gallons_bev: parseNumber(r.gallons_bev),
      gallons_eth: parseNumber(r.gallons_eth),
      pop_14up: parseNumber(r.pop_14up),
      gallons_eth_per14up: parseNumber(r.gallons_eth_per14up),
      decile_pcc14up: parseNumber(r.decile_pcc14up),
      pop21up: parseNumber(r.pop21up),
      gallons_eth_per21up: parseNumber(r.gallons_eth_per21up),
      data_source: r.data_source || null,
      abv: parseNumber(r.abv),
      gallons_eth_fromabv: parseNumber(r.gallons_eth_fromabv)
    })).filter(row => row.year > 0 && row.geographicID > 0);

    return DB;
  } catch (error) {
    console.error('Error loading population data:', error);
    throw error;
  }
}

function parseNumber(x: any): number | null {
  if (x == null) return null;
  const s = String(x).trim();
  if (s === '.' || s === '') return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

function fmtInt(n: number | null): string {
  return n == null ? '—' : Math.round(n).toLocaleString();
}

function fmtFloat(n: number | null): string {
  return n == null ? '—' : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/**
 * Summarize by state/year across all 'type' rows.
 * Returns a plain object ready to print.
 */
export function getStateYearSummary(stateId: number, year: number): StateYearSummary {
  if (!DB) throw new Error('pcyr DB not loaded. Call loadPcyr() first.');

  const rows = DB.filter(r => r.year === year && r.geographicID === stateId);

  let gallons_eth_total = 0;
  let gallons_bev_total = 0;
  let pop21up: number | null = null;
  let pop14up: number | null = null;

  for (const r of rows) {
    if (r.gallons_eth != null) gallons_eth_total += r.gallons_eth;
    if (r.gallons_bev != null) gallons_bev_total += r.gallons_bev;

    if (r.pop21up != null && pop21up == null) pop21up = r.pop21up;
    if (r.pop_14up != null && pop14up == null) pop14up = r.pop_14up;
  }

  const per21 = (pop21up && gallons_eth_total) ? (gallons_eth_total / pop21up) : null;
  const per14 = (pop14up && gallons_eth_total) ? (gallons_eth_total / pop14up) : null;

  return {
    'Rows matched': rows.length,
    'Total gallons_eth': fmtInt(gallons_eth_total || 0),
    'Total gallons_bev': fmtInt(gallons_bev_total || 0),
    'pop21up (first)': fmtInt(pop21up),
    'gallons_eth / pop21up': fmtFloat(per21),
    'pop_14up (first)': fmtInt(pop14up),
    'gallons_eth / pop_14up': fmtFloat(per14),
  };
}

// Get consumption trends for a state over time
export async function getStateConsumptionTrends(stateId: number, startYear: number = 1970, endYear: number = 2022): Promise<Array<{ year: number; summary: StateYearSummary }>> {
  await loadPcyr();
  const trends = [];

  for (let year = startYear; year <= endYear; year++) {
    const summary = getStateYearSummary(stateId, year);
    if (summary['Rows matched'] > 0) {
      trends.push({ year, summary });
    }
  }

  return trends;
}

// Get latest consumption data for a state
export async function getLatestStateData(stateId: number): Promise<StateYearSummary | null> {
  await loadPcyr();

  // Find the latest year with data for this state
  const years = [...new Set(DB!.filter(r => r.geographicID === stateId).map(r => r.year))].sort((a, b) => b - a);

  if (years.length === 0) return null;

  return getStateYearSummary(stateId, years[0]);
}

// Compare consumption between states
export async function compareStatesConsumption(stateIds: number[], year: number = 2022): Promise<Array<{ stateId: number; summary: StateYearSummary }>> {
  await loadPcyr();

  return stateIds.map(stateId => ({
    stateId,
    summary: getStateYearSummary(stateId, year)
  }));
}
