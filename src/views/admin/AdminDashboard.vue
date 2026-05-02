<template>
  <div class="space-y-6">
    <!-- Welcome Banner with Time Greeting -->
    <div class="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-xl p-6 text-white relative">
      <!-- Orbs container - keeps overflow hidden for decorative elements only -->
      <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div class="absolute inset-0 bg-grid-white/10"></div>
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative flex items-center justify-between">
        <div>
          <p class="text-slate-300 text-sm mb-2">{{ greeting }}</p>
          <h2 class="text-2xl font-bold mb-1">{{ authStore.user?.name || 'Admin' }}</h2>
          <p class="text-slate-400 text-sm">Here's what's happening with your store today.</p>
        </div>
        <div class="flex items-center gap-3">
          
          <!-- ─── NOTIFICATION BELL ─── -->
          <div class="relative" ref="notificationRef">
            <button 
              @click.stop="toggleNotifications"
              class="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span 
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Notification Dropdown -->
            <Transition name="dropdown">
              <div 
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden"
              >
                <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h4 class="font-semibold text-gray-800 text-sm">Notifications</h4>
                  <button 
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>

                <div class="max-h-[350px] overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-8 text-center">
                    <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p class="text-xs text-gray-400">No notifications yet</p>
                  </div>

                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    @click="handleNotificationClick(notification)"
                    :class="[
                      'px-4 py-3 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors hover:bg-gray-50 flex items-start gap-3',
                      !notification.read ? 'bg-blue-50/30' : ''
                    ]"
                  >
                    <div :class="getIconBg(notification.type)" class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg v-if="notification.type === 'order'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <svg v-else-if="notification.type === 'payment'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg v-else-if="notification.type === 'user'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <svg v-else-if="notification.type === 'stock'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-800 font-medium leading-tight">{{ notification.title }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ notification.message }}</p>
                      <p class="text-[10px] text-gray-400 mt-1">{{ notification.time }}</p>
                    </div>

                    <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  </div>
                </div>

                <div class="p-3 border-t border-gray-100 bg-gray-50">
                  <RouterLink 
                    to="/admin/orders" 
                    @click="showNotifications = false"
                    class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Orders
                  </RouterLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Date & Live -->
          <div class="hidden sm:flex items-center gap-2 text-sm">
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

    <!-- KPI Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p class="text-3xl font-bold mt-1">RM {{ animatedRevenue }}</p>
          </div>
        </div>
      </div>
      <div class="group bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Orders</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ animatedOrders }}</p>
          </div>
        </div>
      </div>
      <div class="group bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-gray-500 text-sm font-medium">Total Products</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ animatedProducts }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Orders -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <RouterLink to="/admin/products" class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group border border-blue-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <div><span class="font-medium text-gray-800">Add New Product</span><p class="text-xs text-gray-500">Create a new product listing</p></div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
          <RouterLink to="/admin/orders" class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group border border-green-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div><span class="font-medium text-gray-800">View All Orders</span><p class="text-xs text-gray-500">Manage and process orders</p></div>
            </div>
            <svg class="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div class="space-y-2">
          <div v-for="order in recentOrders.slice(0, 6)" :key="order.id" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="getStatusColor(order.status)"></div>
              <div>
                <p class="font-medium text-gray-800 text-sm">#{{ order.id }}</p>
                <p class="text-xs text-gray-500">{{ order.customer }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{{ order.items }} items</span>
              <span class="font-semibold text-gray-800 text-sm">RM {{ formatPrice(order.total) }}</span>
              <span class="text-xs text-gray-400 w-16">{{ order.date }}</span>
              <span :class="['px-2 py-0.5 rounded-full text-[10px] font-medium', statusBadgeClass(order.status)]">{{ order.status }}</span>
            </div>
          </div>
        </div>
        <div v-if="recentOrders.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-sm">No orders yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const router = useRouter()
const authStore = useAuthStore()
const notificationRef = ref<HTMLElement | null>(null)

const productCount = ref(0)
const orderCount = ref(0)
const recentOrders = ref<any[]>([])
const showNotifications = ref(false)

const animatedRevenue = ref('0.00')
const animatedOrders = ref(0)
const animatedProducts = ref(0)

// ── Notification System ──────────────────────
const notifications = ref<any[]>([])
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const loadNotifications = () => {
  const stored = localStorage.getItem('admin_notifications')
  if (stored) {
    try {
      notifications.value = JSON.parse(stored)
    } catch {
      notifications.value = []
    }
  }
}

const saveNotifications = () => {
  localStorage.setItem('admin_notifications', JSON.stringify(notifications.value))
}

const addNotification = (type: string, title: string, message: string, link: string = '') => {
  // Check if notification already exists (avoid duplicates)
  const exists = notifications.value.find(n => n.message === message && n.type === type)
  if (exists) return

  const notification = {
    id: Date.now(),
    type,
    title,
    message,
    link,
    read: false,
    time: 'Just now',
  }
  notifications.value.unshift(notification)
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
  saveNotifications()
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  saveNotifications()
}

const handleNotificationClick = (notification: any) => {
  notification.read = true
  saveNotifications()
  showNotifications.value = false
  if (notification.link) {
    router.push(notification.link)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    showNotifications.value = false
  }
}

const getIconBg = (type: string): string => {
  const classes: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    payment: 'bg-green-100 text-green-600',
    user: 'bg-purple-100 text-purple-600',
    stock: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-gray-600',
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

// ── Helpers ──────────────────────────────────
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-MY', { weekday: 'short', month: 'short', day: 'numeric' })
})

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-400', processing: 'bg-blue-400',
    completed: 'bg-green-400', cancelled: 'bg-red-400'
  }
  return colors[status] || 'bg-gray-400'
}

const statusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// ── Main Logic ───────────────────────────────
onMounted(async () => {
  loadNotifications()
  
  try {
    const [productsRes, ordersRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/orders')
    ])
    
    const products = productsRes.data.data || productsRes.data
    const orders = ordersRes.data.data || ordersRes.data
    
    productCount.value = products.length
    orderCount.value = orders.length
    animatedProducts.value = products.length
    animatedOrders.value = orders.length
    
    // Calculate revenue
    const revenue = orders
      .filter((o: any) => o.payment_status === 'paid' || o.status === 'completed')
      .reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0)
    animatedRevenue.value = revenue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    // Build recent orders list
    recentOrders.value = orders.slice(0, 8).map((o: any) => ({
      id: o.id,
      customer: o.user?.name || 'Guest',
      total: o.total_amount,
      status: o.status,
      items: o.items?.length || 1,
      date: new Date(o.created_at).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
    }))

    // 🔥 CHECK FOR NEW ORDERS (last 24 hours)
    const last24h = orders.filter((o: any) => {
      return (Date.now() - new Date(o.created_at).getTime()) < 24 * 60 * 60 * 1000
    })
    
    last24h.forEach((order: any) => {
      addNotification(
        'order',
        `New Order #${order.id}`,
        `${order.user?.name || 'Guest'} placed order - RM ${Number(order.total_amount).toFixed(2)}`,
        '/admin/orders'
      )
    })

    // 🔥 CHECK FOR LOW STOCK
    const lowStock = products.filter((p: any) => p.stock <= 10 && p.stock > 0)
    if (lowStock.length > 0) {
      lowStock.forEach((p: any) => {
        addNotification(
          'stock',
          'Low Stock Alert',
          `${p.name} is down to ${p.stock} units`,
          '/admin/products'
        )
      })
    }

    // 🔥 CHECK FOR OUT OF STOCK
    const outOfStock = products.filter((p: any) => p.stock === 0)
    if (outOfStock.length > 0) {
      outOfStock.forEach((p: any) => {
        addNotification(
          'stock',
          'Out of Stock',
          `${p.name} is out of stock`,
          '/admin/products'
        )
      })
    }

    // 🔥 CHECK FOR RECENT PAYMENTS
    const recentPayments = orders.filter((o: any) => {
      if (!o.paid_at) return false
      return (Date.now() - new Date(o.paid_at).getTime()) < 24 * 60 * 60 * 1000
    })
    
    recentPayments.forEach((order: any) => {
      addNotification(
        'payment',
        'Payment Received',
        `RM ${Number(order.total_amount).toFixed(2)} confirmed for Order #${order.id}`,
        '/admin/orders'
      )
    })

    console.log('Notifications loaded:', notifications.value.length)
    console.log('Unread count:', unreadCount.value)

  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 0 L40 0 L40 40 L0 40 Z' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/svg%3E");
}

.dropdown-enter-active { transition: all 0.2s ease-out; }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.dropdown-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>