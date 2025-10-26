<template>
  <div class="w-full h-48 sm:h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController)

interface BeerStyle {
  style: string
  count: number
  avgAbv: string
  avgIbu: string
}

interface Props {
  beerStyles: BeerStyle[]
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: ChartJS | null = null

const createChart = () => {
  if (!chartCanvas.value || !props.beerStyles.length) return

  // Destroy existing chart
  if (chart) {
    chart.destroy()
  }

  // Prepare data for top 6 styles
  const topStyles = props.beerStyles.slice(0, 6)
  const otherCount = props.beerStyles.slice(6).reduce((sum, style) => sum + style.count, 0)

  const labels = topStyles.map(style => style.style)
  const data = topStyles.map(style => style.count)

  if (otherCount > 0) {
    labels.push('Others')
    data.push(otherCount)
  }

  // Color palette
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
  ]

  chart = new ChartJS(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color + '80'),
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            usePointStyle: true,
            font: {
              size: 11
            },
            color: '#6B7280',
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} beers (${percentage}%)`
            }
          }
        },
        title: {
          display: false
        }
      },
      cutout: '60%'
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.beerStyles, () => {
  createChart()
}, { deep: true })
</script>
