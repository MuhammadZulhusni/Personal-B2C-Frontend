<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Business Analytics</h2>
        <p class="text-sm text-slate-500 mt-1">Insights, trends, and business intelligence</p>
      </div>
      <select 
        v-model="dateRange"
        class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="365">Last year</option>
      </select>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">Total Visitors</p>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ stats.totalVisitors.toLocaleString() }}</p>
        <p class="text-sm text-green-600 mt-1">↑ {{ stats.visitorGrowth }}% from last period</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">Conversion Rate</p>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ stats.conversionRate }}%</p>
        <p class="text-sm text-green-600 mt-1">↑ {{ stats.conversionGrowth }}% from last period</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">Avg Order Value</p>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">RM {{ formatPrice(stats.avgOrderValue) }}</p>
        <p class="text-sm text-green-600 mt-1">↑ {{ stats.aovGrowth }}% from last period</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">Cart Abandonment</p>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800">{{ stats.cartAbandonment }}%</p>
        <p class="text-sm text-red-600 mt-1">↓ {{ stats.abandonmentChange }}% from last period</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Trend Chart -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Sales Trend</h3>
        <div class="h-64">
          <canvas ref="salesChartRef"></canvas>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Top Selling Products</h3>
        <div class="space-y-3">
          <div 
            v-for="(product, index) in topProducts" 
            :key="product.id" 
            class="flex items-center gap-3"
          >
            <span class="text-sm font-bold w-6" :class="index < 3 ? 'text-amber-500' : 'text-slate-400'">
              #{{ index + 1 }}
            </span>
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-10 h-10 rounded-lg object-cover"
              @error="handleImageError"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate">{{ product.name }}</p>
              <p class="text-xs text-slate-500">{{ product.sold }} sold · RM {{ formatPrice(product.revenue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Performance -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Category Performance</h3>
      <div class="space-y-4">
        <div v-for="cat in categoryPerformance" :key="cat.name" class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-slate-700">{{ cat.name }}</span>
            <span class="font-medium text-slate-800">{{ cat.sales }} orders ({{ cat.percentage }}%)</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              :style="{ width: `${cat.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Timeline -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-4">
          <div :class="getActivityIconBg(activity.type)" class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <component :is="getActivityIcon(activity.type)" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-slate-800">
              <span class="font-medium">{{ activity.user }}</span> {{ activity.action }}
            </p>
            <p class="text-xs text-slate-400 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/api'

// ── Refs ───────────────────────────────────────
const dateRange = ref('30')
const salesChartRef = ref<HTMLCanvasElement | null>(null)
let salesChart: Chart | null = null

const stats = ref({
  totalVisitors: 0,
  visitorGrowth: 0,
  conversionRate: 0,
  conversionGrowth: 0,
  avgOrderValue: 0,
  aovGrowth: 0,
  cartAbandonment: 0,
  abandonmentChange: 0,
})

const topProducts = ref<any[]>([])
const categoryPerformance = ref<any[]>([])
const recentActivities = ref<any[]>([])

// ── Helpers ────────────────────────────────────
const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/40x40?text=No+Image'
}

const getActivityIconBg = (type: string): string => {
  const classes: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    payment: 'bg-green-100 text-green-600',
    product: 'bg-purple-100 text-purple-600',
    stock: 'bg-yellow-100 text-yellow-600',
    user: 'bg-cyan-100 text-cyan-600',
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

// ── Chart ──────────────────────────────────────
const initChart = () => {
  if (!salesChartRef.value) return
  
  const ctx = salesChartRef.value.getContext('2d')
  if (!ctx) return
  
  if (salesChart) salesChart.destroy()
  
  const days = parseInt(dateRange.value)
  const labels = Array.from({ length: days <= 30 ? days : 12 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
  })
  
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sales (RM)',
        data: Array.from({ length: labels.length }, () => Math.floor(Math.random() * 3000) + 500),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `RM ${value}`,
          },
        },
      },
    },
  })
}

// ── API Calls ──────────────────────────────────
const fetchAnalytics = async () => {
  try {
    const { data } = await api.get('/admin/analytics', {
      params: { days: parseInt(dateRange.value) }
    })
    
    const d = data.data
    
    // Update stats
    stats.value = {
      totalVisitors: d.stats.total_customers || 0,
      visitorGrowth: d.stats.order_growth || 0,
      conversionRate: d.stats.conversion_rate || 0,
      conversionGrowth: 0,
      avgOrderValue: d.stats.avg_order_value || 0,
      aovGrowth: 0,
      cartAbandonment: 0,
      abandonmentChange: 0,
    }
    
    // Update top products
    topProducts.value = d.top_products || []
    
    // Update category performance
    categoryPerformance.value = (d.category_performance || []).map((cat: any) => ({
      name: cat.category,
      sales: cat.orders,
      percentage: cat.percentage,
    }))
    
    // Update recent activities
    recentActivities.value = d.recent_activity || []
    
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  }
}

// ── Watchers ───────────────────────────────────
watch(dateRange, () => {
  fetchAnalytics()
  initChart()
})

// ── Lifecycle ──────────────────────────────────
onMounted(() => {
  fetchAnalytics()
  initChart()
})
</script>