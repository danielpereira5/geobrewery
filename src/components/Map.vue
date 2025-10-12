<template>
  <div ref="mapEl" class="w-full h-full leaflet-map"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L, { Map, CircleMarker } from 'leaflet'
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

type Pt = { id:number; name:string; lat:number; lng:number; sales:number; growthPct:number }
const points: Pt[] = [
  { id: 1, name: 'Austin, TX',  lat: 30.2672, lng: -97.7431, sales: 120000, growthPct: 8.3 },
  { id: 2, name: 'Dallas, TX',  lat: 32.7767, lng: -96.7970, sales: 98000,  growthPct: 5.1 },
  { id: 3, name: 'Houston, TX', lat: 29.7604, lng: -95.3698, sales: 150000, growthPct: 12.0 },
]

const emit = defineEmits<{
  (e: 'city-selected', payload: Pt): void
}>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: Map | null = null

function sizeBySales(v: number) {
  const vals = points.map(p => p.sales)
  const min = Math.min(...vals), max = Math.max(...vals)
  const minR = 6, maxR = 20
  if (min === max) return (minR + maxR) / 2
  return minR + (Math.sqrt(v - min) / Math.sqrt(max - min)) * (maxR - minR)
}

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, { center: [31, -97], zoom: 6, preferCanvas: true })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
  }).addTo(map)

  const layer = L.layerGroup().addTo(map)

  points.forEach(p => {
    const color = p.growthPct >= 0 ? '#16a34a' : '#dc2626'
    const cm: CircleMarker = L.circleMarker([p.lat, p.lng], {
      radius: sizeBySales(p.sales),
      color, fillColor: color, fillOpacity: 0.25, weight: 1.5
    }).addTo(layer)

    cm.on('click', () => {
      emit('city-selected', p)
      // optional: keep popup too
      cm.bindPopup(`<b>${p.name}</b><br/>Sales: $${p.sales.toLocaleString()}<br/>Growth: ${p.growthPct}%`).openPopup()
    })
  })

  const bounds = points.map(p => [p.lat, p.lng]) as [number, number][]
  if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] })
})

// Expose a resize hook the parent can call after opening the details panel
function resize() { map?.invalidateSize() }

// Inside Map.vue, expose a method to recenter with right padding
function recenterOn(lat: number, lng: number) {
  map?.setView([lat, lng], map.getZoom(), { animate: true })
}
defineExpose({ resize, recenterOn })

onBeforeUnmount(() => map?.remove())
</script>
