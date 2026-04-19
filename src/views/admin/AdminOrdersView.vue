<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Orders Management</h2>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">Track and manage customer orders</p>
      </div>
      <!-- <button 
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 justify-center sm:justify-start text-sm"
        @click="() => fetchOrders()"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="hidden sm:inline">Refresh</span>
      </button> -->
    </div>

    <!-- Stats Summary - Responsive Grid -->
    <div class="grid grid-cols-3 gap-2 sm:gap-4">
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
        <p class="text-xs sm:text-sm text-gray-500 truncate">Total Orders</p>
        <p class="text-lg sm:text-2xl font-bold text-gray-800">{{ orders.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
        <p class="text-xs sm:text-sm text-gray-500 truncate">Pending</p>
        <p class="text-lg sm:text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
        <p class="text-xs sm:text-sm text-gray-500 truncate">Completed</p>
        <p class="text-lg sm:text-2xl font-bold text-green-600">{{ completedCount }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
      <p class="text-gray-500 text-sm sm:text-base">Loading orders...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
      <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-base sm:text-lg text-gray-600 mb-2">No orders found</p>
      <p class="text-xs sm:text-sm text-gray-400">Orders will appear here once customers make purchases</p>
    </div>

    <!-- Orders List - Mobile Optimized -->
    <div v-else class="space-y-3 sm:space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Order Header - Stack on mobile -->
        <div class="p-3 sm:p-5 bg-gray-50 border-b border-gray-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-gray-800 text-sm sm:text-base">Order #{{ order.id }}</span>
              <span 
                :class="[
                  'px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium',
                  statusClasses[order.status] || 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ order.status }}
              </span>
            </div>
            <span class="font-bold text-gray-800 text-sm sm:text-base">
              RM {{ formatPrice(order.total_amount) }}
            </span>
          </div>
          
          <!-- Order Meta - Responsive -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="truncate max-w-[150px] sm:max-w-none">{{ order.user?.name || 'Guest' }}</span>
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(order.created_at) }}
            </span>
          </div>
        </div>

        <!-- Order Items - Mobile accordion style -->
        <div class="p-3 sm:p-5">
          <div class="flex items-center justify-between mb-2 sm:mb-3">
            <h4 class="text-xs sm:text-sm font-semibold text-gray-700">
              Items ({{ order.items.length }})
            </h4>
            <button 
              v-if="order.items.length > 2"
              @click="toggleItems(order.id)"
              class="text-xs text-blue-600 hover:text-blue-700 sm:hidden"
            >
              {{ expandedOrders.includes(order.id) ? 'Show Less' : 'Show All' }}
            </button>
          </div>
          
          <div class="space-y-2 sm:space-y-3">
            <div 
              v-for="(item, index) in getDisplayItems(order)" 
              :key="item.id"
              class="flex items-start gap-2 sm:gap-4"
            >
              <img 
                :src="item.product?.image" 
                :alt="item.product?.name"
                class="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                @error="handleImageError"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-800 text-xs sm:text-sm truncate">
                  {{ item.product?.name || 'Product Unavailable' }}
                </p>
                <p class="text-xs text-gray-500">
                  RM {{ formatPrice(item.price) }} × {{ item.quantity }}
                </p>
              </div>
              <p class="font-semibold text-gray-800 text-xs sm:text-sm">
                RM {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
              </p>
            </div>
          </div>
          
          <!-- Show more indicator for mobile -->
          <div 
            v-if="!expandedOrders.includes(order.id) && order.items.length > 2"
            class="mt-2 text-center sm:hidden"
          >
            <span class="text-xs text-gray-400">
              +{{ order.items.length - 2 }} more item(s)
            </span>
          </div>
        </div>

        <!-- Order Footer - Stack on mobile -->
        <div class="border-t border-gray-200 bg-gray-50">
          <!-- Shipping Address - Full width on mobile -->
          <div class="p-3 sm:p-5 border-b border-gray-200 sm:border-b-0">
            <div class="flex items-start gap-2">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-xs sm:text-sm text-gray-600 break-all">{{ order.shipping_address }}</span>
            </div>
          </div>
          
          <!-- Status Update - Full width on mobile -->
          <div class="p-3 sm:p-5">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label class="text-xs sm:text-sm font-medium text-gray-700">Update Status:</label>
              <select 
                :value="order.status" 
                @change="(event) => updateStatus(order.id, (event.target as HTMLSelectElement).value)"
                class="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination - Mobile friendly -->
    <div v-if="!loading && orders.length > 0" class="flex justify-center mt-6">
      <div class="flex items-center gap-1 sm:gap-2">
        <button 
          @click="() => prevPage()"
          :disabled="currentPage === 1"
          class="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        <span class="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="() => nextPage()"
          :disabled="currentPage === totalPages"
          class="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

interface OrderItem {
  id: number
  price: number | string
  quantity: number
  product?: {
    name: string
    image: string
  }
}

interface Order {
  id: number
  status: string
  total_amount: number | string
  shipping_address: string
  created_at: string
  user?: {
    name: string
  }
  items: OrderItem[]
}

interface OrdersResponse {
  data: Order[]
  current_page?: number
  last_page?: number
}

const orders = ref<Order[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const expandedOrders = ref<number[]>([])

// Status color mapping
const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// Computed stats
const pendingCount = computed(() => {
  return orders.value.filter(order => order.status === 'pending').length
})

const completedCount = computed(() => {
  return orders.value.filter(order => order.status === 'completed').length
})

// Toggle items visibility for mobile
const toggleItems = (orderId: number) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

// Get display items based on expanded state
const getDisplayItems = (order: Order) => {
  // On desktop, show all items
  if (window.innerWidth >= 640) {
    return order.items
  }
  // On mobile, show 2 items max unless expanded
  if (expandedOrders.value.includes(order.id)) {
    return order.items
  }
  return order.items.slice(0, 2)
}

// Helper function to safely format prices
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  })
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/56x56?text=No+Image'
}

const fetchOrders = async (page: number = 1) => {
  loading.value = true
  try {
    const { data } = await api.get<OrdersResponse>(`/admin/orders?page=${page}`)
    orders.value = data.data
    currentPage.value = data.current_page || 1
    totalPages.value = data.last_page || 1
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (orderId: number, status: string) => {
  try {
    await api.put(`/admin/orders/${orderId}/status`, { status })
    await fetchOrders(currentPage.value)
  } catch (error) {
    console.error('Failed to update order status:', error)
    alert('Failed to update order status. Please try again.')
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchOrders(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchOrders(currentPage.value - 1)
  }
}

onMounted(() => fetchOrders())
</script>