<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-800 flex items-center gap-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        My Orders
      </h2>
      <p class="text-slate-500 text-sm mt-2">Track and manage your order history</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800 mb-4"></div>
      <p class="text-slate-500">Loading your orders...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-red-600 font-medium mb-4">{{ error }}</p>
      <button 
        @click="fetchOrders"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 class="text-xl font-semibold text-slate-800 mb-2">No orders yet</h3>
      <p class="text-slate-500 mb-8">Start shopping to see your order history here</p>
      <button 
        @click="router.push('/')"
        class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Start Shopping
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <!-- Order Stats Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p class="text-xs text-gray-500 mb-1">Total Orders</p>
          <p class="text-xl font-bold text-slate-800">{{ orders.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p class="text-xs text-gray-500 mb-1">Processing</p>
          <p class="text-xl font-bold text-blue-600">{{ processingCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p class="text-xs text-gray-500 mb-1">Completed</p>
          <p class="text-xl font-bold text-green-600">{{ completedCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p class="text-xs text-gray-500 mb-1">Total Spent</p>
          <p class="text-xl font-bold text-slate-800">RM {{ totalSpent }}</p>
        </div>
      </div>

      <!-- Order Cards -->
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="font-semibold text-slate-800">Order #{{ order.id }}</span>
            <span 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium capitalize',
                statusClasses[order.status] || 'bg-gray-100 text-gray-700'
              ]"
            >
              {{ order.status }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(order.created_at) }}
            </span>
            <span class="font-bold text-slate-800 text-base">
              RM {{ formatPrice(order.total_amount) }}
            </span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-5">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h4>
          <div class="space-y-3">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex items-center gap-4"
            >
              <img 
                :src="item.product?.image" 
                :alt="item.product?.name"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-50"
                @error="handleImageError"
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-slate-800 line-clamp-2">
                  {{ item.product?.name || 'Product Unavailable' }}
                </p>
                <p class="text-sm text-gray-500 mt-0.5">
                  RM {{ formatPrice(item.price) }} × {{ item.quantity }}
                </p>
              </div>
              <p class="font-bold text-slate-800">
                RM {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm text-gray-600">{{ order.shipping_address }}</span>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="px-5 py-4 border-t border-gray-200 flex flex-wrap gap-3">
          <button 
            @click="viewOrderDetails(order.id)"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
          
          <button 
            v-if="order.status === 'pending'"
            @click="cancelOrder(order.id)"
            class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel Order
          </button>
          
          <button 
            @click="trackOrder(order.id)"
            class="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Track Order
          </button>
          
          <button 
            @click="reorderItems(order)"
            class="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Buy Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useCartStore } from '@/stores/cart'

interface OrderItem {
  id: number
  price: number
  quantity: number
  product?: {
    name: string
    image: string
  }
}

interface Order {
  id: number
  status: string
  total_amount: number
  shipping_address: string
  created_at: string
  items: OrderItem[]
}

const router = useRouter()
const cartStore = useCartStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

// Status color mapping
const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// Computed stats
const processingCount = computed(() => {
  return orders.value.filter(order => order.status === 'processing' || order.status === 'pending').length
})

const completedCount = computed(() => {
  return orders.value.filter(order => order.status === 'completed').length
})

const totalSpent = computed(() => {
  const total = orders.value.reduce((sum, order) => sum + Number(order.total_amount), 0)
  return formatPrice(total)
})

// Helper functions
const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/64x64?text=Product'
}

const fetchOrders = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data } = await api.get('/orders')
    orders.value = data
  } catch (e) {
    error.value = 'Failed to load orders. Please try again.'
  } finally {
    loading.value = false
  }
}

const viewOrderDetails = (orderId: number) => {
  // Navigate to order details page or open modal
  console.log('View order details:', orderId)
  // router.push(`/orders/${orderId}`)
}

const cancelOrder = async (orderId: number) => {
  if (!confirm('Are you sure you want to cancel this order?')) return
  
  try {
    await api.put(`/orders/${orderId}/cancel`)
    await fetchOrders()
  } catch (error) {
    console.error('Failed to cancel order:', error)
    alert('Failed to cancel order. Please try again.')
  }
}

const trackOrder = (orderId: number) => {
  // Navigate to tracking page or open modal
  console.log('Track order:', orderId)
  // router.push(`/orders/${orderId}/track`)
}

const reorderItems = (order: Order) => {
  order.items.forEach(item => {
    if (item.product) {
      cartStore.addToCart({
        id: item.product as any,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        quantity: item.quantity
      })
    }
  })
  router.push('/cart')
}

onMounted(() => fetchOrders())
</script>