<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Checkout</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
          Order Summary
        </h3>
        
        <div class="space-y-3 mb-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="flex justify-between text-sm text-gray-600 py-2 border-b border-gray-50 last:border-b-0"
          >
            <span>{{ item.name }} <span class="text-gray-400">x{{ item.quantity }}</span></span>
            <span class="font-medium">RM {{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
        
        <div class="flex justify-between font-bold text-lg text-slate-800 pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>RM {{ formatPrice(cartStore.totalAmount) }}</span>
        </div>
      </div>

      <!-- Shipping Form -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-gray-200">
          Shipping Details
        </h3>

        <!-- Form -->
        <div>
          <!-- Error Alert -->
          <div 
            v-if="error" 
            class="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"
          >
            {{ error }}
          </div>

          <!-- Full Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Your full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
            />
          </div>

          <!-- Phone Number -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              v-model="form.phone" 
              type="text" 
              placeholder="e.g. 011-1234567"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
            />
          </div>

          <!-- Address -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Address <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="form.address" 
              rows="3" 
              placeholder="Street address"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-none"
            ></textarea>
          </div>

          <!-- City & Postcode Grid -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                City <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.city" 
                type="text" 
                placeholder="e.g. Kuala Lumpur"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Postcode <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.postcode" 
                type="text" 
                placeholder="e.g. 47500"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <!-- Order Notes (Optional) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Order Notes (Optional)
            </label>
            <textarea 
              v-model="form.notes" 
              rows="2" 
              placeholder="Any special instructions for delivery"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-none"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            @click="placeOrder" 
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating Order...' : 'Proceed to Payment →' }}
          </button>

          <!-- Back to Cart -->
          <button 
            @click="router.push('/cart')"
            class="w-full mt-3 py-2 text-slate-600 hover:text-slate-800 text-sm transition-colors"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import api from '@/api'

const cartStore = useCartStore()
const router    = useRouter()

const form = ref({
  name: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  notes: ''
})

const loading = ref(false)
const error   = ref('')

// Helper function to safely format prices
const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const placeOrder = async () => {
  // Validation
  if (!form.value.name || !form.value.address || !form.value.city || !form.value.postcode) {
    error.value = 'Please fill in all required fields.'
    return
  }

  loading.value = true
  error.value   = ''

  // Build shipping address
  const shippingAddress = `${form.value.name}, ${form.value.phone}, ${form.value.address}, ${form.value.city}, ${form.value.postcode}`

  const payload = {
    shipping_address: shippingAddress,
    notes: form.value.notes || null,
    items: cartStore.items.map(item => ({
      product_id: item.id,
      quantity:   item.quantity,
    }))
  }

  try {
    const { data } = await api.post('/orders', payload)
    
    // Clear the cart after successful order creation
    cartStore.clearCart()
    
    // Redirect to payment page with the new order ID
    router.push(`/payment/${data.id}`)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to create order. Please try again.'
    loading.value = false
  }
}
</script>