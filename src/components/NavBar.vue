<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled 
        ? 'bg-transparent backdrop-blur-sm' 
        : 'bg-slate-900/95 backdrop-blur-md shadow-lg',
      isHomePage ? 'text-white' : 'text-white'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20 transition-all duration-300">
        <!-- Brand -->
        <RouterLink
          to="/"
          class="text-lg lg:text-xl font-bold hover:text-amber-400 transition flex items-center gap-2"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="hidden sm:inline">Mini Shop</span>
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6 text-sm font-medium">
          <RouterLink 
            to="/" 
            class="hover:text-amber-400 transition relative group"
          >
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
          </RouterLink>

          <!-- My Orders - Only visible when logged in AND not admin -->
          <RouterLink
            v-if="authStore.isLoggedIn && !isAdmin"
            to="/orders"
            class="hover:text-amber-400 transition relative group"
          >
            My Orders
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
          </RouterLink>

          <RouterLink
            to="/cart"
            class="relative hover:text-amber-400 transition group"
          >
            <span class="flex items-center gap-1">
              Cart
              <span
                v-if="cartStore.totalItems > 0"
                class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                :class="{ 'animate-pulse': !isScrolled }"
              >
                {{ cartStore.totalItems }}
              </span>
            </span>
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
          </RouterLink>

          <!-- Logged in user (Non-Admin) -->
          <template v-if="authStore.isLoggedIn && !isAdmin">
            <div class="flex items-center gap-3">
              <span 
                class="font-medium transition-colors"
                :class="isScrolled ? 'text-slate-800' : 'text-amber-400'"
              >
                Hi, {{ authStore.user?.name?.split(' ')[0] }}
              </span>
              
              <button
                @click="handleLogout"
                class="px-4 py-2 rounded-lg text-sm transition-all"
                :class="[
                  isScrolled 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200' 
                    : 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500'
                ]"
              >
                Logout
              </button>
            </div>
          </template>

          <!-- Admin User - Show only admin link -->
          <template v-else-if="authStore.isLoggedIn && isAdmin">
            <div class="flex items-center gap-3">
              <span 
                class="font-medium transition-colors"
                :class="isScrolled ? 'text-slate-800' : 'text-amber-400'"
              >
                Hi, {{ authStore.user?.name?.split(' ')[0] }}
              </span>
              
              <RouterLink
                to="/admin"
                class="px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                :class="[
                  isScrolled 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                ]"
              >
                Admin Panel
              </RouterLink>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink
              to="/login"
              class="hover:text-amber-400 transition relative group"
            >
              Login
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
            </RouterLink>

            <RouterLink
              to="/register"
              class="px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              :class="[
                isScrolled 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-900'
              ]"
            >
              Register
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Right Section -->
        <div class="flex items-center gap-3 md:hidden">
          <!-- Cart Icon Mobile -->
          <RouterLink to="/cart" class="relative p-2 hover:text-amber-400 transition">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
            >
              {{ cartStore.totalItems }}
            </span>
          </RouterLink>

          <!-- Mobile menu button -->
          <button 
            @click="isOpen = !isOpen" 
            class="p-2 rounded-lg transition"
            :class="isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div 
          v-show="isOpen" 
          class="md:hidden py-4 space-y-1 border-t"
          :class="isScrolled ? 'border-slate-200' : 'border-white/10'"
        >
          <RouterLink 
            to="/" 
            class="block py-3 px-4 rounded-lg transition"
            :class="isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'"
            @click="isOpen = false"
          >
            Home
          </RouterLink>

          <RouterLink
            v-if="authStore.isLoggedIn && !isAdmin"
            to="/orders"
            class="block py-3 px-4 rounded-lg transition"
            :class="isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'"
            @click="isOpen = false"
          >
            My Orders
          </RouterLink>

          <!-- Logged in user (Non-Admin) -->
          <template v-if="authStore.isLoggedIn && !isAdmin">
            <div 
              class="py-3 px-4 font-medium"
              :class="isScrolled ? 'text-slate-600' : 'text-amber-400'"
            >
              Hi, {{ authStore.user?.name }}
            </div>
            
            <button
              @click="handleLogout"
              class="w-full text-left py-3 px-4 rounded-lg transition"
              :class="isScrolled ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500/10'"
            >
              Logout
            </button>
          </template>

          <!-- Admin User -->
          <template v-else-if="authStore.isLoggedIn && isAdmin">
            <div 
              class="py-3 px-4 font-medium"
              :class="isScrolled ? 'text-slate-600' : 'text-amber-400'"
            >
              Hi, {{ authStore.user?.name }}
            </div>
            
            <RouterLink
              to="/admin"
              class="block py-3 px-4 rounded-lg font-semibold text-center"
              :class="[
                isScrolled 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-amber-400 text-slate-900'
              ]"
              @click="isOpen = false"
            >
              Admin Panel
            </RouterLink>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink 
              to="/login" 
              class="block py-3 px-4 rounded-lg transition"
              :class="isScrolled ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'"
              @click="isOpen = false"
            >
              Login
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="block py-3 px-4 rounded-lg font-semibold text-center"
              :class="[
                isScrolled 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-amber-400 text-slate-900'
              ]"
              @click="isOpen = false"
            >
              Register
            </RouterLink>
          </template>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const isScrolled = ref(false)

// Check if user is admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

// Check if on home page
const isHomePage = computed(() => {
  return route.path === '/'
})

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:global(body) {
  padding-top: 64px;
}

@media (min-width: 1024px) {
  :global(body) {
    padding-top: 80px;
  }
}
</style>