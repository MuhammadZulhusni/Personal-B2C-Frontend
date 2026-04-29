<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div 
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Brand Header -->
      <div class="p-5 border-b border-slate-700/50">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold tracking-tight">Admin Panel</h2>
            <p class="text-xs text-slate-400">Management Console</p>
          </div>
          <!-- Close button for mobile -->
          <button 
            @click="sidebarOpen = false"
            class="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        
        <!-- ==================== MAIN SECTION ==================== -->
        <div class="mb-4">
          <p class="px-4 pt-2 pb-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 select-none">
            Main Menu
          </p>
          
          <RouterLink 
            to="/admin"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            :class="{ 'bg-white/10 text-white shadow-lg': $route.path === '/admin' }"
            @click="closeSidebarOnMobile"
          >
            <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <span class="font-medium">Dashboard</span>
            <span v-if="$route.path === '/admin'" class="absolute right-3 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </RouterLink>

          <RouterLink 
            to="/admin/products" 
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/products') }"
            @click="closeSidebarOnMobile"
          >
            <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
            <span class="font-medium">Products</span>
            <span v-if="$route.path.startsWith('/admin/products')" class="absolute right-3 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </RouterLink>

          <RouterLink 
            to="/admin/orders" 
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/orders') }"
            @click="closeSidebarOnMobile"
          >
            <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
            <span class="font-medium">Orders</span>
            <span v-if="orderCount > 0" class="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
              {{ orderCount }}
            </span>
            <span v-if="$route.path.startsWith('/admin/orders')" class="absolute right-3 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </RouterLink>
        </div>

        <!-- ==================== ANALYTICS SECTION ==================== -->
        <div class="mb-4">
          <p class="px-4 pt-2 pb-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 select-none">
            Insights
          </p>
          
          <RouterLink 
            to="/admin/analytics" 
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/analytics') }"
            @click="closeSidebarOnMobile"
          >
            <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span class="font-medium">Analytics</span>
            <span v-if="$route.path.startsWith('/admin/analytics')" class="absolute right-3 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </RouterLink>

          <RouterLink 
            to="/admin/finance" 
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group relative"
            :class="{ 'bg-white/10 text-white shadow-lg': $route.path.startsWith('/admin/finance') }"
            @click="closeSidebarOnMobile"
          >
            <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="font-medium">Finance</span>
            <span v-if="$route.path.startsWith('/admin/finance')" class="absolute right-3 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
          </RouterLink>
        </div>

      </nav>

      <div class="p-3 border-t border-slate-700/50 space-y-2">
        <!-- Profile Link -->
        <RouterLink 
          to="/admin/profile" 
          class="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
          :class="{ 'bg-white/10': $route.path === '/admin/profile' }"
          @click="closeSidebarOnMobile"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-orange-500/25 overflow-hidden">
          <img 
            v-if="(authStore.user as any)?.avatar_url" 
            :src="(authStore.user as any)?.avatar_url" 
            class="w-full h-full object-cover"
            alt="Avatar"
          />
            <span v-else>{{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate">{{ authStore.user?.name || 'Administrator' }}</p>
            <p class="text-xs text-slate-400">Edit Profile</p>
          </div>
          <svg class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>

        <!-- Action Buttons -->
        <div class="space-y-0.5">
          <RouterLink 
            to="/" 
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm group"
            @click="closeSidebarOnMobile"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Visit Store</span>
          </RouterLink>
          
          <button 
            @click="confirmLogout"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 text-sm group"
          >
            <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 lg:ml-72 transition-all duration-300 min-h-screen">
      <!-- Floating Mobile Menu Button -->
      <button 
        @click="sidebarOpen = !sidebarOpen"
        class="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-xl shadow-lg text-slate-600 hover:text-slate-900 transition-all"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page Content -->
      <div class="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const orderCount = ref(0)

// Close sidebar on route change (mobile)
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

// Logout with SweetAlert2 confirmation
const confirmLogout = async () => {
  sidebarOpen.value = false
  
  const result = await Swal.fire({
    title: 'Sign Out?',
    html: `
      <div class="text-center">
        <p class="text-slate-600 mb-1">Are you sure you want to sign out from the admin panel?</p>
        <p class="text-sm text-slate-400">You will be redirected to the login page.</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, sign out',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-lg font-bold text-slate-800',
      confirmButton: 'px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors',
      cancelButton: 'px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors',
    }
  })

  if (result.isConfirmed) {
    // Show loading
    Swal.fire({
      title: 'Signing out...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      await authStore.logout()
      
      // Show success
      await Swal.fire({
        icon: 'success',
        title: 'Signed Out Successfully',
        text: 'You have been logged out of the admin panel.',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        }
      })
      
      router.push('/login')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to sign out. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-2xl',
        }
      })
    }
  }
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>