<template>
  <div class="simple-chart">
    <div class="chart-header" v-if="title">
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div class="chart-body">
      <template v-if="type === 'bar'">
        <div class="bar-chart">
          <div 
            v-for="(item, index) in chartData" 
            :key="index"
            class="bar-item"
            :style="{ '--bar-height': getBarHeight(item.value) }"
          >
            <div class="bar-wrapper">
              <div class="bar" :style="{ background: getGradient(index) }">
                <span class="bar-value">{{ formatValue(item.value) }}</span>
              </div>
            </div>
            <div class="bar-label">{{ item.label }}</div>
          </div>
        </div>
      </template>

      <template v-else-if="type === 'line'">
        <svg class="line-chart" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#14b8a6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#86efac;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#14b8a6;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:0.05" />
            </linearGradient>
          </defs>
          
          <!-- Area fill -->
          <path :d="areaPath" fill="url(#areaGradient)" />
          
          <!-- Line -->
          <path :d="linePath" stroke="url(#lineGradient)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          
          <!-- Points -->
          <circle
            v-for="(point, index) in linePoints"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            r="5"
            fill="#14b8a6"
            class="chart-point"
          />
        </svg>
        <div class="line-labels">
          <span v-for="(item, index) in chartData" :key="index" class="line-label">
            {{ item.label }}
          </span>
        </div>
      </template>

      <template v-else-if="type === 'donut'">
        <svg class="donut-chart" :viewBox="`0 0 ${donutSize} ${donutSize}`">
          <circle
            v-for="(segment, index) in donutSegments"
            :key="index"
            :cx="donutSize / 2"
            :cy="donutSize / 2"
            :r="donutRadius"
            :stroke="segment.color"
            :stroke-width="donutStroke"
            fill="none"
            :stroke-dasharray="`${segment.length} ${donutCircumference}`"
            :stroke-dashoffset="segment.offset"
            class="donut-segment"
          />
          <text
            :x="donutSize / 2"
            :y="donutSize / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            class="donut-center-text"
          >
            <tslot name="center">{{ total }}</tslot>
          </text>
        </svg>
        <div class="donut-legend">
          <div v-for="(item, index) in chartData" :key="index" class="legend-item">
            <span class="legend-color" :style="{ background: colors[index % colors.length] }"></span>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ formatValue(item.value) }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ChartType = 'bar' | 'line' | 'donut'

interface ChartDataItem {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    type?: ChartType
    data: ChartDataItem[]
    title?: string
    formatter?: (val: number) => string
    height?: number
    width?: number
  }>(),
  {
    type: 'bar',
    title: undefined,
    formatter: undefined,
    height: 200,
    width: 600
  }
)

const colors = ['#14b8a6', '#86efac', '#fb923c', '#f87171', '#8b5cf6', '#60a5fa']

const chartData = computed(() => props.data)

const maxValue = computed(() => Math.max(...chartData.value.map(d => d.value), 1))

const total = computed(() => chartData.value.reduce((sum, d) => sum + d.value, 0))

function formatValue(val: number): string {
  if (props.formatter) {
    return props.formatter(val)
  }
  return val.toLocaleString('ru-RU')
}

function getBarHeight(value: number): string {
  return `${(value / maxValue.value) * 100}%`
}

function getGradient(index: number): string {
  const color = colors[index % colors.length]
  return `linear-gradient(180deg, ${color}, ${color}dd)`
}

type ChartPoint = { x: number; y: number }

// Line chart calculations
const linePoints = computed<ChartPoint[]>(() => {
  if (chartData.value.length === 0) return []
  
  const padding = 20
  const chartWidth = props.width - padding * 2
  const chartHeight = props.height - padding * 2
  const stepX = chartWidth / (chartData.value.length - 1 || 1)
  
  return chartData.value.map((item, index) => ({
    x: padding + index * stepX,
    y: padding + chartHeight - (item.value / maxValue.value) * chartHeight
  }))
})

const linePath = computed(() => {
  const points = linePoints.value
  if (points.length === 0) return ''

  const [firstPoint, ...rest] = points
  if (!firstPoint) return ''
  let path = `M ${firstPoint.x} ${firstPoint.y}`

  rest.forEach((curr, index) => {
    const prev = rest[index - 1] ?? firstPoint
    const cpX = (prev.x + curr.x) / 2

    path += ` Q ${cpX} ${prev.y}, ${cpX} ${(prev.y + curr.y) / 2}`
    path += ` Q ${cpX} ${curr.y}, ${curr.x} ${curr.y}`
  })

  return path
})

const areaPath = computed(() => {
  const points = linePoints.value
  if (points.length === 0) return ''

  const padding = 20
  const baseY = props.height - padding

  let path = linePath.value
  const lastPoint = points[points.length - 1]
  const firstPoint = points[0]
  if (!lastPoint || !firstPoint) return ''

  path += ` L ${lastPoint.x} ${baseY}`
  path += ` L ${firstPoint.x} ${baseY}`
  path += ' Z'
  
  return path
})

// Donut chart calculations
const donutSize = 200
const donutRadius = 70
const donutStroke = 30
const donutCircumference = computed(() => 2 * Math.PI * donutRadius)

const donutSegments = computed(() => {
  if (total.value === 0) return []
  
  let currentOffset = 0
  
  return chartData.value.map((item, index) => {
    const percentage = item.value / total.value
    const length = donutCircumference.value * percentage
    const segment = {
      length,
      offset: currentOffset,
      color: colors[index % colors.length]
    }
    
    currentOffset -= length
    
    return segment
  })
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.simple-chart {
  background: white;
  border-radius: $border-radius-lg;
  padding: $spacing-6;
  box-shadow: $shadow-sm;
}

.chart-header {
  margin-bottom: $spacing-6;
}

.chart-title {
  font-size: $text-lg;
  font-weight: 600;
  color: $gray-900;
  margin: 0;
}

.chart-body {
  position: relative;
}

// Bar Chart
.bar-chart {
  display: flex;
  gap: $spacing-4;
  align-items: flex-end;
  height: 200px;
  padding: $spacing-4 0;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-2;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  height: var(--bar-height, 0%);
  border-radius: $border-radius-sm $border-radius-sm 0 0;
  position: relative;
  transition: all $transition-normal;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: $spacing-2;
  min-height: 30px;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
}

.bar-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.bar-label {
  font-size: 0.8rem;
  color: $gray-600;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Line Chart
.line-chart {
  width: 100%;
  height: 200px;
  margin-bottom: $spacing-4;
}

.chart-point {
  cursor: pointer;
  transition: r $transition-fast;

  &:hover {
    r: 7;
  }
}

.line-labels {
  display: flex;
  justify-content: space-between;
  gap: $spacing-2;
}

.line-label {
  font-size: 0.8rem;
  color: $gray-600;
  text-align: center;
}

// Donut Chart
.donut-chart {
  width: 200px;
  height: 200px;
  margin: 0 auto $spacing-6;
  display: block;
  transform: rotate(-90deg);
}

.donut-segment {
  transition: stroke-width $transition-fast;
  cursor: pointer;

  &:hover {
    stroke-width: 35;
  }
}

.donut-center-text {
  font-size: 1.8rem;
  font-weight: 700;
  fill: $gray-900;
  transform: rotate(90deg);
  transform-origin: center;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: $border-radius-sm;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: $gray-700;
}

.legend-value {
  font-weight: 600;
  color: $gray-900;
  font-size: 0.9rem;
}
</style>
