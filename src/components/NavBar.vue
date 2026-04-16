<template>
  <nav class="bg-slate-900 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand -->
        <RouterLink
          to="/"
          class="text-lg font-bold hover:text-amber-400 transition flex items-center gap-2"
        >
          Mini Shop
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-5 text-sm">
          <RouterLink to="/" class="hover:text-amber-400 transition">
            Home
          </RouterLink>

          <!-- My Orders - Only visible when logged in AND not admin -->
          <RouterLink
            v-if="authStore.isLoggedIn && !isAdmin"
            to="/orders"
            class="hover:text-amber-400 transition"
          >
            My Orders
          </RouterLink>

          <RouterLink
            to="/cart"
            class="relative hover:text-amber-400 transition"
          >
            Cart
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            >
              {{ cartStore.totalItems }}
            </span>
          </RouterLink>

          <!-- Logged in user (Non-Admin) -->
          <template v-if="authStore.isLoggedIn && !isAdmin">
            <span class="text-amber-400 font-medium">
              Hi, {{ authStore.user?.name }}
            </span>
            
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition"
            >
              Logout
            </button>
          </template>

          <!-- Admin User - Show only admin link -->
          <template v-else-if="authStore.isLoggedIn && isAdmin">
            <span class="text-amber-400 font-medium">
              Hi, {{ authStore.user?.name }}
            </span>
            
            <RouterLink
              to="/admin"
              class="bg-amber-400 text-slate-900 px-3 py-1.5 rounded-md font-semibold hover:bg-amber-300 transition"
            >
              Admin Panel
            </RouterLink>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink
              to="/login"
              class="hover:text-amber-400 transition"
            >
              Login
            </RouterLink>

            <RouterLink
              to="/register"
              class="bg-amber-400 text-slate-900 px-3 py-1.5 rounded-md font-semibold hover:bg-amber-300 transition"
            >
              Register
            </RouterLink>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button @click="isOpen = !isOpen" class="md:hidden">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isOpen" class="md:hidden pb-4 space-y-2">
        <RouterLink 
          to="/" 
          class="block py-2 hover:text-amber-400 transition"
          @click="isOpen = false"
        >
          Home
        </RouterLink>

        <RouterLink
          v-if="authStore.isLoggedIn && !isAdmin"
          to="/orders"
          class="block py-2 hover:text-amber-400 transition"
          @click="isOpen = false"
        >
          My Orders
        </RouterLink>

        <RouterLink 
          to="/cart" 
          class="block py-2 hover:text-amber-400 transition"
          @click="isOpen = false"
        >
          Cart ({{ cartStore.totalItems }})
        </RouterLink>

        <!-- Logged in user (Non-Admin) -->
        <template v-if="authStore.isLoggedIn && !isAdmin">
          <div class="py-2 text-amber-400">Hi, {{ authStore.user?.name }}</div>
          
          <button
            @click="handleLogout"
            class="w-full text-left py-2 text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </template>

        <!-- Admin User -->
        <template v-else-if="authStore.isLoggedIn && isAdmin">
          <div class="py-2 text-amber-400">Hi, {{ authStore.user?.name }}</div>
          
          <RouterLink
            to="/admin"
            class="block py-2 text-amber-400 hover:text-amber-300 transition"
            @click="isOpen = false"
          >
            Admin Panel
          </RouterLink>
        </template>

        <!-- Guest -->
        <template v-else>
          <RouterLink 
            to="/login" 
            class="block py-2 hover:text-amber-400 transition"
            @click="isOpen = false"
          >
            Login
          </RouterLink>
          <RouterLink 
            to="/register" 
            class="block py-2 text-amber-400 hover:text-amber-300 transition"
            @click="isOpen = false"
          >
            Register
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const isOpen = ref(false)

// Check if user is admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isOpen.value = false
}
</script>