<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800">Orders Management</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Track and manage customer orders</p>
      </div>
      <button 
        class="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors flex items-center gap-2 justify-center text-sm shadow-sm"
        @click="() => fetchOrders()"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-3 gap-3 sm:gap-4">
      <div class="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</p>
            <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ orders.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pending</p>
            <p class="text-xl sm:text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Completed</p>
            <p class="text-xl sm:text-2xl font-bold text-green-600">{{ completedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600 mb-4"></div>
      <p class="text-gray-500 font-medium">Loading orders...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">No orders found</h3>
      <p class="text-sm text-gray-500">Orders will appear here once customers make purchases</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-3 sm:space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Order Header -->
        <div class="p-4 sm:p-5 bg-gray-50/80 border-b border-gray-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-gray-800">Order #{{ order.id }}</span>
              <span 
                :class="[
                  'px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider',
                  statusClasses[order.status] || 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ order.status }}
              </span>
            </div>
            <span class="font-bold text-gray-800 text-base">
              RM {{ formatPrice(order.total_amount) }}
            </span>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="truncate max-w-[150px] sm:max-w-none">{{ order.user?.name || 'Guest' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(order.created_at) }}
            </span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Items ({{ order.items.length }})
            </h4>
            <button 
              v-if="order.items.length > 2"
              @click="toggleItems(order.id)"
              class="text-xs text-blue-600 hover:text-blue-700 font-medium sm:hidden"
            >
              {{ expandedOrders.includes(order.id) ? 'Show Less' : 'Show All' }}
            </button>
          </div>
          
          <div class="space-y-2 sm:space-y-3">
            <div 
              v-for="(item, index) in getDisplayItems(order)" 
              :key="item.id"
              class="flex items-start gap-3 sm:gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img 
                :src="item.product?.image" 
                :alt="item.product?.name"
                class="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl flex-shrink-0 bg-gray-100 border border-gray-200"
                @error="handleImageError"
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 text-sm truncate">
                  {{ item.product?.name || 'Product Unavailable' }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  RM {{ formatPrice(item.price) }} &times; {{ item.quantity }}
                </p>
              </div>
              <p class="font-semibold text-gray-800 text-sm">
                RM {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
              </p>
            </div>
          </div>
          
          <div 
            v-if="!expandedOrders.includes(order.id) && order.items.length > 2"
            class="mt-2 text-center sm:hidden"
          >
            <span class="text-xs text-gray-400">
              +{{ order.items.length - 2 }} more item(s)
            </span>
          </div>
        </div>

        <!-- Order Footer -->
        <div class="border-t border-gray-200 bg-gray-50/80">
          <div class="p-4 sm:p-5 border-b border-gray-200 sm:border-b-0">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-xs sm:text-sm text-gray-600 break-all">{{ order.shipping_address }}</span>
            </div>
          </div>
          
          <div class="p-4 sm:p-5">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label class="text-xs sm:text-sm font-semibold text-gray-700">Update Status:</label>
              <select 
                :value="order.status" 
                @change="(event) => confirmStatusUpdate(order, (event.target as HTMLSelectElement).value)"
                class="w-full sm:w-auto px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white shadow-sm"
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

    <!-- Pagination -->
    <div v-if="!loading && orders.length > 0" class="flex justify-center mt-8">
      <div class="flex items-center gap-1 sm:gap-2">
        <button 
          @click="() => prevPage()"
          :disabled="currentPage === 1"
          class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Previous
        </button>
        <span class="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="() => nextPage()"
          :disabled="currentPage === totalPages"
          class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
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

const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)
const completedCount = computed(() => orders.value.filter(o => o.status === 'completed').length)

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

const toggleItems = (orderId: number) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}

const getDisplayItems = (order: Order) => {
  if (window.innerWidth >= 640) return order.items
  if (expandedOrders.value.includes(order.id)) return order.items
  return order.items.slice(0, 2)
}

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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/56x56?text=N/A'
}

// SweetAlert2 confirmation for status update
const confirmStatusUpdate = async (order: Order, newStatus: string) => {
  if (newStatus === order.status) return

  const result = await Swal.fire({
    title: 'Update Order Status?',
    html: `
      <div class="text-center">
        <p class="text-gray-600 mb-2">Change status of <strong>Order #${order.id}</strong></p>
        <div class="flex items-center justify-center gap-2 mt-3">
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[order.status]}">${order.status}</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[newStatus] || 'bg-gray-100 text-gray-700'}">${newStatus}</span>
        </div>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, update',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors',
      cancelButton: 'px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors',
    },
  })

  if (result.isConfirmed) {
    await updateStatus(order.id, newStatus)
  }
}

const updateStatus = async (orderId: number, status: string) => {
  try {
    await api.put(`/admin/orders/${orderId}/status`, { status })
    await fetchOrders(currentPage.value)
    Toast.fire({ icon: 'success', title: 'Order status updated' })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update order status. Please try again.',
      confirmButtonColor: '#dc2626',
      customClass: { popup: 'rounded-2xl' },
    })
  }
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

const nextPage = () => { if (currentPage.value < totalPages.value) fetchOrders(currentPage.value + 1) }
const prevPage = () => { if (currentPage.value > 1) fetchOrders(currentPage.value - 1) }

onMounted(() => fetchOrders())
</script>