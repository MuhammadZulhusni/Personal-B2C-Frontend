<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-slate-800 flex items-center gap-3">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Shopping Cart
      </h2>
      <p class="text-slate-500 text-sm mt-2">Review and modify your items before checkout</p>
    </div>

    <!-- Empty Cart -->
    <div 
      v-if="cartStore.items.length === 0" 
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 lg:p-16 text-center"
    >
      <div class="max-w-sm mx-auto">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h3>
        <p class="text-slate-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <button 
          @click="router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </button>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-else class="space-y-6">
      <!-- Cart Header -->
      <div class="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-600">
        <div class="col-span-5">Product</div>
        <div class="col-span-2 text-center">Price</div>
        <div class="col-span-2 text-center">Quantity</div>
        <div class="col-span-2 text-right">Subtotal</div>
        <div class="col-span-1"></div>
      </div>

      <!-- Cart Items List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div 
          v-for="(item, index) in cartStore.items" 
          :key="item.id"
          :class="[
            'p-4 sm:p-6 transition-colors',
            index < cartStore.items.length - 1 ? 'border-b border-gray-100' : ''
          ]"
        >
          <!-- Mobile Layout -->
          <div class="sm:hidden space-y-4">
            <div class="flex gap-4">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-50"
                @error="handleImageError"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {{ item.name }}
                </h3>
                <p class="text-gray-500 text-sm mb-2">
                  RM {{ formatPrice(item.price) }}
                </p>
                <button 
                  @click="cartStore.removeItem(item.id)"
                  class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button 
                  @click="cartStore.decreaseItem(item.id)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="font-semibold text-gray-800 min-w-[2rem] text-center">
                  {{ item.quantity }}
                </span>
                <button 
                  @click="cartStore.increaseItem(item.id)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <p class="font-bold text-gray-800">
                RM {{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>

          <!-- Desktop Layout -->
          <div class="hidden sm:grid grid-cols-12 gap-4 items-center">
            <!-- Product -->
            <div class="col-span-5 flex items-center gap-4">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-50"
                @error="handleImageError"
              />
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-800 truncate">
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-0.5">
                  SKU: {{ item.id }}
                </p>
              </div>
            </div>

            <!-- Price -->
            <div class="col-span-2 text-center">
              <span class="font-medium text-gray-700">RM {{ formatPrice(item.price) }}</span>
            </div>

            <!-- Quantity -->
            <div class="col-span-2 flex justify-center">
              <div class="flex items-center gap-2">
                <button 
                  @click="cartStore.decreaseItem(item.id)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="font-semibold text-gray-800 min-w-[2rem] text-center">
                  {{ item.quantity }}
                </span>
                <button 
                  @click="cartStore.increaseItem(item.id)"
                  class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Subtotal -->
            <div class="col-span-2 text-right">
              <span class="font-bold text-gray-800">
                RM {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>

            <!-- Remove -->
            <div class="col-span-1 text-right">
              <button 
                @click="cartStore.removeItem(item.id)"
                class="text-gray-400 hover:text-red-500 transition-colors p-2"
                aria-label="Remove item"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 ml-auto lg:max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
        
        <div class="space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal ({{ cartStore.totalItems }} items)</span>
            <span class="font-medium">RM {{ formatPrice(cartStore.totalAmount) }}</span>
          </div>
          
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span class="text-green-600 font-medium">Free</span>
          </div>
          
          <div class="border-t border-gray-200 pt-3">
            <div class="flex justify-between text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>RM {{ formatPrice(cartStore.totalAmount) }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Including VAT</p>
          </div>

          <div class="pt-4 space-y-3">
            <button 
              @click="goCheckout"
              class="w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button 
              @click="cartStore.clearCart()"
              class="w-full px-6 py-3 border border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-600 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Continue Shopping Link -->
      <div class="text-center lg:text-left">
        <button 
          @click="router.push('/')"
          class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Helper function to safely format prices
const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/80x80?text=Product'
}

const goCheckout = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  } else {
    router.push('/checkout')
  }
}
</script>