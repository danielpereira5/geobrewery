<template>
  <div ref="mapEl" class="w-full h-full leaflet-map"></div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BreweryMap'
})

import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import L, { Map as LeafletMap, CircleMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// (optional) icon path fix if you use default markers
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
})

import { loadBreweriesWithCoords } from '@/services/breweryService'
import { loadBeers } from '@/services/beerService'
import { loadStates } from '@/services/stateService'

const emit = defineEmits<{
  (e: 'location-selected', payload: { lat: number; lng: number; state?: string }): void
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: LeafletMap | null = null
const markers: CircleMarker[] = []
let highlightedState: L.GeoJSON | null = null
let radiusCircle: L.Circle | null = null

// Store beer count per brewery for markers
const beerCounts = new Map<number, number>()

onMounted(async () => {
  await nextTick()
  if (!mapEl.value) return

  // Initialize map with continental US bounds
  map = L.map(mapEl.value, {
    center: [39.8283, -98.5795],
    zoom: 4,
    preferCanvas: true
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
  }).addTo(map)

  // Set bounds to show continental US from California to Maine
  const usBounds = L.latLngBounds(
    L.latLng(24.396308, -125.0), // Southwest corner (California coast)
    L.latLng(49.0, -66.0)        // Northeast corner (Maine coast)
  )

  // Fit map to US bounds with padding
  map.fitBounds(usBounds, { padding: [20, 20] })

  // Load states and brewery data
  await Promise.all([
    loadStates(),
    loadBreweries()
  ])

  // Add click handler for map clicks
  map.on('click', handleMapClick)
})

async function loadBreweries() {
  try {
    // Load both breweries and beers
    const [breweries, beers] = await Promise.all([
      loadBreweriesWithCoords(),
      loadBeers()
    ])

    // Count beers per brewery
    for (const beer of beers) {
      const breweryId = parseInt(String(beer.brewery_id))
      const currentCount = beerCounts.get(breweryId) || 0
      beerCounts.set(breweryId, currentCount + 1)
    }

    // Add brewery markers
    for (const brewery of breweries) {
      const beerCount = beerCounts.get(parseInt(brewery.id)) || 0
      const size = Math.max(4, Math.min(12, 4 + beerCount / 2))

      const marker: CircleMarker = L.circleMarker([brewery.lat, brewery.lon], {
        radius: size,
        color: '#16a34a',
        fillColor: '#16a34a',
        fillOpacity: 0.25,
        weight: 1.5
      }).addTo(map!)

      // Add popup
      const popupContent = `
        <div style="min-width: 150px;">
          <b>${brewery.name}</b><br/>
          ${brewery.city}, ${brewery.state}<br/>
          <small>Beers: ${beerCount}</small>
        </div>
      `
      marker.bindPopup(popupContent)

      markers.push(marker)
    }
  } catch (error) {
    console.error('Error loading breweries:', error)
  }
}

function handleMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng
  emit('location-selected', { lat, lng })
}

// Function to highlight a state by stateId
function highlightState(stateId: number) {
  // Remove previous highlight
  if (highlightedState) {
    map?.removeLayer(highlightedState)
    highlightedState = null
  }

  // Load states if not already loaded
  loadStates().then(states => {
    const stateFeature = states.features.find((f: { properties: Record<string, string | number> }) => {
      const props = f.properties || {}
      const id = parseInt(String(props.STATEFP || props.STATE || props.GEOID || '0'))
      return id === stateId
    })

    if (stateFeature && map) {
      highlightedState = L.geoJSON(stateFeature, {
        style: {
          fillColor: '#20b2aa', // Teal color
          fillOpacity: 0.3,
          color: '#20b2aa',
          weight: 2,
          opacity: 0.8
        }
      }).addTo(map)
    }
  }).catch(error => {
    console.error('Error highlighting state:', error)
  })
}

// Function to clear state highlight
function clearStateHighlight() {
  if (highlightedState) {
    map?.removeLayer(highlightedState)
    highlightedState = null
  }
}

// Function to show radius circle
function showRadiusCircle(lat: number, lng: number, radiusMiles: number = 50) {
  // Remove previous radius circle
  if (radiusCircle) {
    map?.removeLayer(radiusCircle)
    radiusCircle = null
  }

  if (map) {
    // Convert miles to meters for Leaflet
    const radiusMeters = radiusMiles * 1609.34

    radiusCircle = L.circle([lat, lng], {
      radius: radiusMeters,
      color: '#f97316', // Orange color
      fillColor: '#f97316',
      fillOpacity: 0.1,
      weight: 2,
      opacity: 0.6
    }).addTo(map)
  }
}

// Function to clear radius circle
function clearRadiusCircle() {
  if (radiusCircle) {
    map?.removeLayer(radiusCircle)
    radiusCircle = null
  }
}

// Expose a resize hook the parent can call after opening the details panel
function resize() { map?.invalidateSize() }

// Inside Map.vue, expose a method to recenter with right padding
function recenterOn(lat: number, lng: number) {
  map?.setView([lat, lng], map.getZoom(), { animate: true })
}
defineExpose({ resize, recenterOn, highlightState, clearStateHighlight, showRadiusCircle, clearRadiusCircle })

onBeforeUnmount(() => map?.remove())
</script>
