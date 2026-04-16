<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Revenue Card -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p class="text-3xl font-bold mt-1">RM {{ totalRevenue }}</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center text-sm text-blue-100">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+12.5% from last month</span>
        </div>
      </div>

      <!-- Orders Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Orders</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ orderCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center text-sm text-green-600">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>+8.2% from last month</span>
        </div>
      </div>

      <!-- Products Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Products</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ productCount }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="flex items-center text-sm text-purple-600">
          <span class="text-gray-500">Across</span>
          <span class="ml-1 font-medium">6 categories</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Orders -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <RouterLink 
            to="/admin/products" 
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span class="font-medium text-gray-700">Add New Product</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <RouterLink 
            to="/admin/orders" 
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span class="font-medium text-gray-700">View All Orders</span>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Orders Preview -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <RouterLink 
            to="/admin/orders" 
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </RouterLink>
        </div>
        <div class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="getStatusColor(order.status)"></div>
              <div>
                <p class="font-medium text-gray-800">Order #{{ order.id }}</p>
                <p class="text-sm text-gray-500">{{ order.customer }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">RM {{ formatPrice(order.total) }}</p>
              <p class="text-xs text-gray-500">{{ order.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api'

const productCount = ref(0)
const orderCount = ref(0)
const totalRevenue = ref('0.00')
const recentOrders = ref<any[]>([])

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

onMounted(async () => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/orders')
    ])
    productCount.value = productsRes.data.data.length
    orderCount.value = ordersRes.data.data.length
    
    const revenue = ordersRes.data.data.reduce((sum: number, order: any) => {
      return sum + (Number(order.total_amount) || 0)
    }, 0)
    totalRevenue.value = revenue.toFixed(2)

    // Get recent orders
    recentOrders.value = ordersRes.data.data.slice(0, 5).map((order: any) => ({
      id: order.id,
      customer: order.user?.name || 'Guest',
      total: order.total_amount,
      status: order.status,
      date: new Date(order.created_at).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
    }))
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
})
</script>