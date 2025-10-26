# GeoBrewery Project Roadmap

## Project Overview
Create an interactive dashboard that allows users to click on a Leaflet map and receive detailed statistics about the closest state, including brewery proximity data and population consumption statistics.

## Current State Analysis

### Frontend (Vue.js + Tailwind CSS)
- ✅ **Vue 3** application with TypeScript
- ✅ **Leaflet** map integration with dark theme
- ✅ **Tailwind CSS** for styling
- ✅ **Responsive sidebar** with details panel
- ✅ **Map component** with click handlers
- ⚠️ **Currently using mock data** - needs replacement with Fall2025Project data

### Data Sources (Fall2025Project)
- ✅ **Brewery data**: `breweries_with_coords.csv` (553 breweries with lat/lon coordinates)
- ✅ **Beer data**: `beerData/beers.csv` (2,407 beers with ABV, IBU, style, brewery_id)
- ✅ **Population data**: `pcyr1970-2022.csv` (state consumption statistics 1970-2022)
- ✅ **State boundaries**: `gz_2010_us_040_00_20m.json` (GeoJSON for state detection)
- ✅ **JavaScript algorithms**: findState, brewery calculations, population data
- ✅ **Working features**: State detection, brewery geocoding, population data queries

## Implementation Roadmap

### Phase 1: Data Migration & Setup ✅ COMPLETED
**Goal**: Migrate algorithms from Fall2025Project to Vue app

#### 1.1 Create Data Services ✅ COMPLETED
- [x] Create `src/services/stateService.ts` - migrate `findState.js` (state detection from lat/lon)
- [x] Create `src/services/breweryService.ts` - migrate `breweries.js` (brewery data with coordinates)
- [x] Create `src/services/beerService.ts` - new service for beer data (ABV, IBU, styles)
- [x] Create `src/services/populationService.ts` - migrate `pcyrData.js` (state consumption data)
- [x] Set up data loading and caching mechanisms

#### 1.2 Data Integration ✅ COMPLETED
- [x] Copy data files from `Fall2025Project/data/` to `public/data/` directory
- [x] Copy beer data from `Fall2025Project/beerData/` to `public/data/` directory
- [x] Update service paths to use public data
- [x] Test data loading in Vue components
- [x] Verify all 553 breweries load correctly with coordinates

#### 1.3 Testing & Validation ✅ COMPLETED
- [x] Create comprehensive test suite (39 tests)
- [x] Unit tests for all services
- [x] Integration tests for end-to-end functionality
- [x] Error handling and data validation tests
- [x] All tests passing successfully

### Phase 2: Map Enhancement
**Goal**: Replace mock data with real brewery data from Fall2025Project

#### 2.1 Brewery Map Integration
- [ ] **Remove mock data** (Austin, Dallas, Houston points)
- [ ] Load all 553 breweries from `breweries_with_coords.csv` on map initialization
- [ ] Display breweries as markers on map with proper clustering
- [ ] Style breweries with different colors/sizes based on brewery data
- [ ] Add brewery popups with name, city, state, and beer count
- [ ] Implement brewery filtering by state or region

#### 2.2 Click Handler Enhancement
- [ ] **Replace mock city selection** with real location-based state detection
- [ ] Implement `findStateForLonLat()` function for accurate state detection
- [ ] Calculate brewery proximity to clicked location using real brewery coordinates
- [ ] Find nearest breweries within configurable radius (default 50 miles)
- [ ] Add brewery density calculations for the selected area

### Phase 3: Dashboard Development
**Goal**: Create comprehensive location statistics dashboard

#### 3.1 State Statistics
- [ ] Display state name and basic info
- [ ] Show population data (21+, 14+ demographics)
- [ ] Display alcohol consumption statistics
- [ ] Add per capita consumption metrics

#### 3.2 Brewery Analysis
- [ ] List nearby breweries with distances (using real brewery coordinates)
- [ ] Show brewery density in area (count per square mile)
- [ ] Calculate market saturation metrics based on population vs brewery count
- [ ] Add brewery type/category analysis using beer data (ABV, IBU, styles)
- [ ] Show beer variety analysis (unique styles, average ABV, etc.)
- [ ] Display brewery size distribution (number of beers per brewery)

#### 3.3 Market Analysis
- [ ] Calculate demand based on population density
- [ ] Show consumption trends over time
- [ ] Add market opportunity indicators
- [ ] Display competitive landscape

### Phase 4: UI/UX Enhancement
**Goal**: Polish user experience and add advanced features

#### 4.1 Dashboard Polish
- [ ] Improve visual design of statistics cards
- [ ] Add charts and graphs for data visualization
- [ ] Implement loading states and error handling
- [ ] Add responsive design improvements

#### 4.2 Advanced Features
- [ ] Add radius selection for brewery search
- [ ] Implement brewery filtering (by type, size, etc.)
- [ ] Add export functionality for reports
- [ ] Create comparison tools between locations

### Phase 5: Testing & Optimization
**Goal**: Ensure reliability and performance

#### 5.1 Testing
- [ ] Unit tests for data services
- [ ] Integration tests for map interactions
- [ ] End-to-end tests for complete user flows
- [ ] Performance testing with large datasets

#### 5.2 Optimization
- [ ] Implement data caching strategies
- [ ] Optimize map rendering performance
- [ ] Add lazy loading for large datasets
- [ ] Implement progressive data loading

## Technical Implementation Details

### Data Flow Architecture
```
User Click → Map Component → State Detection → Data Services → Dashboard Update
```

### Key Components
1. **Map.vue**: Enhanced with brewery markers and click handling
2. **StateService**: Geographic state detection algorithms
3. **BreweryService**: Brewery data management and proximity calculations
4. **PopulationService**: State demographic and consumption data
5. **Dashboard Panel**: Statistics display and visualization

### Data Dependencies
- **State GeoJSON**: `gz_2010_us_040_00_20m.json` for accurate state boundary detection
- **Brewery CSV**: `breweries_with_coords.csv` - 553 breweries with lat/lon coordinates
- **Beer CSV**: `beerData/beers.csv` - 2,407 beers with ABV, IBU, style, brewery_id
- **Population CSV**: `pcyr1970-2022.csv` - State-level consumption data (1970-2022)
- **Fall2025Project Algorithms**: Ready-to-use JavaScript functions for state detection and data processing

## Success Criteria
- [ ] Users can click anywhere on the map
- [ ] System accurately detects the state
- [ ] Dashboard shows relevant state statistics
- [ ] Brewery proximity data is displayed
- [ ] Performance is smooth with large datasets
- [ ] UI is intuitive and responsive

## Questions for Clarification
1. What radius should be used for "nearby breweries" calculation? (Suggested: 50 miles default)
2. Should we include brewery type/category filtering based on beer styles?
3. Do you want historical trend analysis in the dashboard using the 1970-2022 data?
4. Should the system support multiple location comparisons?
5. What specific statistics are most important for the dashboard?
6. Should we display beer style analysis (IPA, Lager, etc.) in the brewery analysis?
7. Do you want to show brewery size metrics (number of beers per brewery)?

## Phase 1 Completion Summary ✅

### What Was Accomplished
- **Data Migration**: All 553 breweries, 2,407 beers, and 52 years of consumption data integrated
- **Service Architecture**: 4 comprehensive services with TypeScript interfaces
- **Testing**: 39 tests covering all functionality with 100% pass rate
- **Error Handling**: Robust error handling for network failures and data validation
- **Performance**: Efficient caching and data loading mechanisms

### Files Created
- `src/services/stateService.ts` - State detection algorithms
- `src/services/breweryService.ts` - Brewery data and proximity calculations
- `src/services/beerService.ts` - Beer analysis and statistics
- `src/services/populationService.ts` - State consumption data
- `src/services/__tests__/` - Comprehensive test suite
- `public/data/` - All data files from Fall2025Project

### Ready for Phase 2
The foundation is now solid and ready for map integration and dashboard development.

## Next Steps
1. ✅ ~~Begin Phase 1: Data Migration & Setup~~ **COMPLETED**
2. ✅ ~~Set up proper data services in Vue app~~ **COMPLETED**
3. ✅ ~~Test data loading and state detection~~ **COMPLETED**
4. **Begin Phase 2: Map Enhancement** - Replace mock data with real brewery data
5. **Create Dashboard Components** - State statistics and brewery analysis

---
*This roadmap will be updated as implementation progresses and requirements are clarified.*
