<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <button 
      @click="router.back()" 
      class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors group"
    >
      <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Products
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
      <p class="text-slate-500">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-red-600 font-medium mb-4">{{ error }}</p>
      <button 
        @click="router.push('/')"
        class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
      >
        Browse Products
      </button>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
        <!-- Product Image Section -->
        <div class="space-y-4">
          <div class="relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <img 
              :src="product.image || product.image_url || 'https://via.placeholder.com/600x600?text=No+Image'" 
              :alt="product.name"
              class="w-full h-[400px] lg:h-[500px] object-cover"
              @error="handleImageError"
            />
            <!-- Stock Badge -->
            <div class="absolute top-4 left-4">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium shadow-sm',
                  (product.stock || product.quantity) > 10 ? 'bg-green-100 text-green-700' : 
                  (product.stock || product.quantity) > 0 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                ]"
              >
                {{ getStockLabel() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product Info Section -->
        <div class="space-y-6">
          <!-- Category Badge -->
          <div>
            <span class="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
              {{ product.category || product.category_name || 'Uncategorized' }}
            </span>
          </div>

          <!-- Product Name -->
          <h1 class="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
            {{ product.name || product.title || 'Product Name' }}
          </h1>

          <!-- Product Description -->
          <p class="text-slate-600 leading-relaxed">
            {{ product.description || product.desc || 'No description available.' }}
          </p>

          <!-- Stock Status -->
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" :class="getStock() > 0 ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="getStock() > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium" :class="getStock() > 0 ? 'text-green-600' : 'text-red-600'">
              {{ getStock() > 0 ? `${getStock()} units available` : 'Currently out of stock' }}
            </span>
          </div>

          <!-- Price -->
          <div class="border-t border-gray-100 pt-6">
            <p class="text-sm text-slate-500 mb-1">Price</p>
            <p class="text-4xl lg:text-5xl font-bold text-slate-800">
              RM {{ formatPrice(product.price || product.unit_price || 0) }}
            </p>
          </div>

          <!-- Quantity Selector -->
          <div v-if="getStock() > 0">
            <p class="text-sm font-medium text-slate-700 mb-3">Quantity</p>
            <div class="flex items-center gap-3">
              <button 
                @click="qty > 1 ? qty-- : null"
                :disabled="qty <= 1"
                class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="text-lg font-semibold text-slate-800 min-w-[2.5rem] text-center">{{ qty }}</span>
              <button 
                @click="qty < getStock() ? qty++ : null"
                :disabled="qty >= getStock()"
                class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              @click="addToCart"
              :disabled="getStock() === 0"
              class="flex-1 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            
            <button 
              @click="buyNow"
              :disabled="getStock() === 0"
              class="px-6 py-4 border-2 border-slate-800 text-slate-800 hover:bg-slate-50 font-medium rounded-xl transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed text-base"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Info (Remove in production) -->
    <div v-if="product" class="mt-8 p-4 bg-gray-100 rounded-lg">
      <details>
        <summary class="cursor-pointer text-sm text-slate-600">Debug: API Response</summary>
        <pre class="mt-2 text-xs overflow-auto max-h-96">{{ JSON.stringify(product, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const qty = ref(1)

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const getStock = (): number => {
  if (!product.value) return 0
  return product.value.stock || product.value.quantity || 0
}

const getStockLabel = (): string => {
  const stock = getStock()
  if (stock > 10) return 'In Stock'
  if (stock > 0) return 'Low Stock'
  return 'Out of Stock'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/600x600?text=Product+Image'
}

const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const productId = route.params.id
    console.log('Fetching product with ID:', productId)
    
    const { data } = await api.get(`/products/${productId}`)
    console.log('API Response:', data)
    
    // Handle different API response structures
    if (data.data) {
      product.value = data.data
    } else if (data.product) {
      product.value = data.product
    } else {
      product.value = data
    }
    
    console.log('Product data set:', product.value)
    
    // Reset quantity if stock is low
    const stock = getStock()
    if (qty.value > stock && stock > 0) {
      qty.value = 1
    }
  } catch (e: any) {
    console.error('Failed to fetch product:', e)
    error.value = e.response?.data?.message || 'Product not found or unavailable.'
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!product.value || getStock() === 0) return
  
  for (let i = 0; i < qty.value; i++) {
    cartStore.addToCart(product.value)
  }
  
  const productName = product.value.name || product.value.title || 'Product'
  alert(`${qty.value} × ${productName} added to cart!`)
}

const buyNow = () => {
  if (!product.value || getStock() === 0) return
  
  for (let i = 0; i < qty.value; i++) {
    cartStore.addToCart(product.value)
  }
  
  router.push('/cart')
}

onMounted(() => {
  fetchProduct()
})
</script>