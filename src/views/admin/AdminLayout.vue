<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-xl',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Admin Header -->
      <div class="p-6 border-b border-slate-700/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold">Admin Panel</h2>
            <p class="text-xs text-slate-400 mt-0.5">Management Console</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <RouterLink 
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          :class="{ 'bg-white/10 text-white shadow-lg': $route.path === '/admin' }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink 
          to="/admin/products" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/products') }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Products</span>
        </RouterLink>

        <RouterLink 
          to="/admin/orders" 
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
          :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/orders') }"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Orders</span>
        </RouterLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-slate-700/50 space-y-3">
        <!-- User Info -->
        <div class="flex items-center gap-3 px-2 py-2 bg-white/5 rounded-lg">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ authStore.user?.name || 'Administrator' }}</p>
            <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email || 'admin@example.com' }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-1">
          <RouterLink 
            to="/" 
            class="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>View Store</span>
          </RouterLink>
          
          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 text-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 lg:ml-64 transition-all duration-300">
      <!-- Top Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Button -->
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-800 transition-colors rounded-lg hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="flex-1">
              <h1 class="text-xl sm:text-2xl font-bold text-slate-800">
                {{ pageTitle }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ pageSubtitle }}</p>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-2">
              <button 
                @click="refreshPage"
                class="p-2 text-slate-600 hover:text-slate-800 transition-colors rounded-lg hover:bg-gray-100"
                title="Refresh"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-4 sm:p-6 lg:p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue' // add onMounted, onUnmounted
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/products': 'Products Management',
    '/admin/orders': 'Orders Management',
  }
  return titles[route.path] || 'Admin'
})

const pageSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    '/admin': 'Monitor your store performance and metrics',
    '/admin/products': 'Manage your product catalog and inventory',
    '/admin/orders': 'Track and process customer orders',
  }
  return subtitles[route.path] || ''
})

watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const refreshPage = () => {
  window.location.reload()
}

const handleLogout = async () => {
  sidebarOpen.value = false
  await authStore.logout()
  router.push('/login')
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = false
    }
  })
}

onMounted(() => {
  document.body.style.margin = '0'
  document.body.style.padding = '0'
})

onUnmounted(() => {
  document.body.style.margin = ''
  document.body.style.padding = ''
})
</script>
