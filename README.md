# GeoBrewery

Interactive web app analyzing brewery locations, beer styles, and market demographics across the US. Click anywhere on the map to explore brewery data, population stats, and market analysis for that location.

## Important Features

- **Interactive Map**: Click anywhere in the US to analyze that location
- **Brewery Analysis**: Find nearby breweries within a search radius (can make larger with slider)
- **Population Demographics**: View state level population and consumption data
- **Beer Styles Analysis**: Explore beer styles within selected area
- **Market Saturation**: brewery density and market opportunities
  
### Prereq's

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repo:
```bash
git clone https://github.com/danielpereira5/geobrewery.git
cd geobrewery
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Development

The app runs on Vite with hot module replacement, so changes will be reflected immediately in the browser.

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## How to Use

1. **Explore the Map**: The application opens with an interactive map of the United States
2. **Click Anywhere**: Click on any location to analyze that area
3. **Adjust Search Radius**: Use the slider below the demographics to change your search radius (10-100 miles)
4. **View Analysis**: The sidebar will show:
   - State demographics and population data
   - Nearby breweries with distances
   - Market saturation metrics
   - Beer style distribution
   - Consumption statistics

## Technology Stack

- **Frontend**: Vue 3 with TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Charts**: Chart.js
- **Build Tool**: Vite

## Data Sources

- Brewery data from Open Brewery DB
- Population and consumption data from US Census and TTB
- State boundaries from US Census TIGER/Line
