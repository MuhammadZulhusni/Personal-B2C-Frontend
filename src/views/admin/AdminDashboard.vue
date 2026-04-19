<template>
  <div class="space-y-6">
    <!-- Welcome Banner with Time Greeting -->
    <div class="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-white/10"></div>
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div class="relative flex items-center justify-between">
        <div>
          <p class="text-slate-300 text-sm mb-2">{{ greeting }}</p>
          <h2 class="text-2xl font-bold mb-1">{{ authStore.user?.name || 'Admin' }}</h2>
          <p class="text-slate-400 text-sm">Here's what's happening with your store today.</p>
        </div>
        <div class="hidden sm:block">
          <div class="flex items-center gap-2 text-sm">
            <div class="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">{{ currentDate }}</div>
            <div class="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm flex items-center gap-1">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Stats Overview with Sparklines -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Revenue Card -->
      <div class="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p class="text-3xl font-bold mt-1">
              <span ref="revenueRef" class="counter">{{ animatedRevenue }}</span>
            </p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-blue-100">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span :class="revenueTrend >= 0 ? 'text-green-200' : 'text-red-200'">
              {{ revenueTrend >= 0 ? '+' : '' }}{{ revenueTrend }}%
            </span>
            <span class="ml-1">vs last month</span>
          </div>
          <!-- Mini Sparkline -->
          <div class="w-16 h-6">
            <svg viewBox="0 0 60 20" class="w-full h-full">
              <polyline points="0,15 10,10 20,12 30,5 40,8 50,3 60,6" 
                fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Orders Card -->
      <div class="group bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Orders</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">
              <span ref="ordersRef" class="counter">{{ animatedOrders }}</span>
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm" :class="ordersTrend >= 0 ? 'text-green-600' : 'text-red-600'">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{{ ordersTrend >= 0 ? '+' : '' }}{{ ordersTrend }}% vs last month</span>
          </div>
          <div class="flex -space-x-2">
            <div class="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-green-700">
              {{ pendingOrders }}
            </div>
            <div class="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-blue-700">
              {{ processingOrders }}
            </div>
          </div>
        </div>
      </div>

      <!-- Products Card -->
      <div class="group bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Products</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">
              <span ref="productsRef" class="counter">{{ animatedProducts }}</span>
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm">
            <span class="text-gray-500">Across</span>
            <span class="ml-1 font-medium text-gray-700">{{ categoryCount }} categories</span>
          </div>
          <div class="flex items-center gap-1">
            <span v-if="lowStockCount > 0" class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
              {{ lowStockCount }} low stock
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts & Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions - Enhanced -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h3>
        <div class="space-y-3">
          <RouterLink 
            to="/admin/products" 
            class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group border border-blue-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <span class="font-medium text-gray-800">Add New Product</span>
                <p class="text-xs text-gray-500">Create a new product listing</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <RouterLink 
            to="/admin/orders" 
            class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group border border-green-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <span class="font-medium text-gray-800">View All Orders</span>
                <p class="text-xs text-gray-500">Manage and process orders</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <button 
            @click="exportReport"
            class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all group border border-purple-200"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div class="text-left">
                <span class="font-medium text-gray-800">Export Report</span>
                <p class="text-xs text-gray-500">Download sales data</p>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Recent Orders with Tabs -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <div class="flex gap-2">
            <button 
              v-for="tab in orderTabs" 
              :key="tab.value"
              @click="activeOrderTab = tab.value"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                activeOrderTab === tab.value 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ tab.label }}
            </button>
            <RouterLink 
              to="/admin/orders" 
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </RouterLink>
          </div>
        </div>
        
        <!-- Order List -->
        <div class="space-y-2">
          <div 
            v-for="order in filteredRecentOrders" 
            :key="order.id" 
            class="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewOrderDetails(order.id)"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-2 h-2 rounded-full transition-all group-hover:scale-125"
                :class="getStatusColor(order.status)"
              ></div>
              <div>
                <p class="font-medium text-gray-800 text-sm">#{{ order.id }}</p>
                <p class="text-xs text-gray-500">{{ order.customer }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{{ order.items }} items</span>
              <span class="font-semibold text-gray-800 text-sm">RM {{ formatPrice(order.total) }}</span>
              <span class="text-xs text-gray-400 w-16">{{ order.date }}</span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-medium',
                  statusBadgeClass(order.status)
                ]"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRecentOrders.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-gray-500 text-sm">No orders found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'
import { gsap } from 'gsap'

const router = useRouter()
const authStore = useAuthStore()

const productCount = ref(0)
const orderCount = ref(0)
const totalRevenue = ref(0)
const recentOrders = ref<any[]>([])
const activeOrderTab = ref('all')
const lowStockCount = ref(0)
const pendingOrders = ref(0)
const processingOrders = ref(0)
const categoryCount = ref(6)

// Animation refs
const animatedRevenue = ref('0.00')
const animatedOrders = ref(0)
const animatedProducts = ref(0)

// Computed trends (simulated)
const revenueTrend = ref(12.5)
const ordersTrend = ref(8.2)

const orderTabs = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
]

// Greeting based on time
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-MY', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
})

const filteredRecentOrders = computed(() => {
  if (activeOrderTab.value === 'all') return recentOrders.value
  return recentOrders.value.filter(o => o.status === activeOrderTab.value)
})

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-400',
    processing: 'bg-blue-400',
    completed: 'bg-green-400',
    cancelled: 'bg-red-400'
  }
  return colors[status] || 'bg-gray-400'
}

const statusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Animate numbers
const animateValue = (target: number, ref: any, isCurrency = false) => {
  gsap.to({ value: 0 }, {
    value: target,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: function() {
      const val = Math.round(this.targets()[0].value)
      if (isCurrency) {
        ref.value = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        ref.value = val
      }
    }
  })
}

const viewOrderDetails = (orderId: number) => {
  router.push(`/admin/orders`)
}

const exportReport = () => {
  alert('Exporting report... (Demo feature)')
}

onMounted(async () => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/orders')
    ])
    
    const products = productsRes.data.data || productsRes.data
    const orders = ordersRes.data.data || ordersRes.data
    
    productCount.value = products.length
    orderCount.value = orders.length
    
    // Calculate low stock
    lowStockCount.value = products.filter((p: any) => p.stock <= 10).length
    
    // Calculate order stats
    pendingOrders.value = orders.filter((o: any) => o.status === 'pending').length
    processingOrders.value = orders.filter((o: any) => o.status === 'processing').length
    
    // Calculate revenue (only from paid/completed orders)
    const revenue = orders
      .filter((o: any) => o.payment_status === 'paid' || o.status === 'completed')
      .reduce((sum: number, order: any) => sum + (Number(order.total_amount) || 0), 0)
    totalRevenue.value = revenue
    
    // Animate the numbers
    animateValue(revenue, animatedRevenue, true)
    animateValue(orderCount.value, animatedOrders)
    animateValue(productCount.value, animatedProducts)
    
    // Get recent orders with more details
    recentOrders.value = orders.slice(0, 8).map((order: any) => ({
      id: order.id,
      customer: order.user?.name || 'Guest',
      total: order.total_amount,
      status: order.status,
      items: order.items?.length || 1,
      date: new Date(order.created_at).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
    }))
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
})
</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L40 0 L40 40 L0 40 Z' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E");
}

.counter {
  font-variant-numeric: tabular-nums;
}
</style>