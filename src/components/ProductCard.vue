<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1">
    <img 
      :src="product.image" 
      :alt="product.name" 
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="mb-1 text-base font-semibold text-gray-800">
        {{ product.name }}
      </h3>
      <p class="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {{ product.description }}
      </p>
      <div class="flex justify-between items-center flex-wrap gap-2">
        <span class="text-lg font-bold text-gray-800">
          RM {{ product.price }}
        </span>
        <div class="flex gap-2">
          <button 
            class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
            @click="router.push(`/products/${product.id}`)"
          >
            Details
          </button>
          <button 
            class="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 text-white rounded-md transition-colors text-sm font-medium"
            @click="addToCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  product: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    image: string
  }
}>()

const router    = useRouter()
const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addToCart(props.product)
  alert(`✅ ${props.product.name} added to cart!`)
}
</script>