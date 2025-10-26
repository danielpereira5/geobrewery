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

const emit = defineEmits<{
  (e: 'location-selected', payload: { lat: number; lng: number; state?: string }): void
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: LeafletMap | null = null
const markers: CircleMarker[] = []

// Store beer count per brewery for markers
const beerCounts = new Map<number, number>()

onMounted(async () => {
  await nextTick()
  if (!mapEl.value) return

  map = L.map(mapEl.value, { center: [39.8283, -98.5795], zoom: 4, preferCanvas: true })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
  }).addTo(map)

  // Load brewery data
  await loadBreweries()

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
    const bounds: [number, number][] = []

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
      bounds.push([brewery.lat, brewery.lon])
    }

    // Fit map to show all breweries
    if (bounds.length > 0) {
      map!.fitBounds(bounds, { padding: [40, 40] })
    }
  } catch (error) {
    console.error('Error loading breweries:', error)
  }
}

function handleMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng
  emit('location-selected', { lat, lng })
}

// Expose a resize hook the parent can call after opening the details panel
function resize() { map?.invalidateSize() }

// Inside Map.vue, expose a method to recenter with right padding
function recenterOn(lat: number, lng: number) {
  map?.setView([lat, lng], map.getZoom(), { animate: true })
}
defineExpose({ resize, recenterOn })

onBeforeUnmount(() => map?.remove())
</script>
