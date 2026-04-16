<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Products Catalog</h2>
        <p class="text-sm text-gray-500 mt-1">{{ products.length }} products in inventory</p>
      </div>
      <button 
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 justify-center shadow-sm"
        @click="openModal()"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Search/Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search products by name or description..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select 
        v-model="stockFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
      >
        <option value="">All Stock Status</option>
        <option value="in_stock">In Stock (>10)</option>
        <option value="low_stock">Low Stock (1-10)</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
      <p class="text-gray-500">Loading products...</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="relative h-48 bg-gray-100">
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div class="absolute top-3 right-3">
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium shadow-sm',
                getStockClass(product.stock)
              ]"
            >
              {{ getStockLabel(product.stock) }}
            </span>
          </div>
        </div>
        
        <div class="p-5">
          <h3 class="font-semibold text-gray-800 text-lg mb-1">{{ product.name }}</h3>
          <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ product.description }}</p>
          
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-xs text-gray-500">Price</p>
              <p class="text-xl font-bold text-gray-800">RM {{ formatPrice(product.price) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Stock</p>
              <p class="text-lg font-semibold text-gray-700">{{ product.stock }} units</p>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              @click="openModal(product)"
            >
              Edit
            </button>
            <button 
              class="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
              @click="deleteProduct(product.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl shadow-sm p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p class="text-lg text-gray-600 mb-2">No products found</p>
      <p class="text-sm text-gray-400 mb-4">Get started by adding your first product</p>
      <button 
        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        @click="openModal()"
      >
        Add Product
      </button>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        v-if="showModal" 
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
            </h3>

            <!-- Error Alert -->
            <div 
              v-if="formError" 
              class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm"
            >
              {{ formError }}
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.name" 
                  type="text"
                  placeholder="e.g., Wireless Headphones"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  v-model="form.description" 
                  rows="3"
                  placeholder="Product description..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Price (RM) <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model.number="form.price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model.number="form.stock" 
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input 
                  v-model="form.image" 
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <!-- Image Preview -->
                <div v-if="form.image" class="mt-2">
                  <img 
                    :src="form.image" 
                    alt="Preview" 
                    class="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    @error="handlePreviewError"
                  />
                </div>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex gap-3 mt-6">
              <button 
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                @click="showModal = false"
              >
                Cancel
              </button>
              <button 
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                @click="saveProduct" 
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
}

const products = ref<Product[]>([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingProduct = ref<Product | null>(null)
const searchQuery = ref('')
const stockFilter = ref('')

const form = ref({ 
  name: '', 
  description: '', 
  price: 0, 
  stock: 0, 
  image: '' 
})

// Filtered products based on search and stock filter
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Search filter
    const matchesSearch = searchQuery.value === '' || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Stock filter
    let matchesStock = true
    if (stockFilter.value === 'in_stock') {
      matchesStock = product.stock > 10
    } else if (stockFilter.value === 'low_stock') {
      matchesStock = product.stock > 0 && product.stock <= 10
    } else if (stockFilter.value === 'out_of_stock') {
      matchesStock = product.stock === 0
    }
    
    return matchesSearch && matchesStock
  })
})

// Helper function to safely format prices
const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

// Get stock status class
const getStockClass = (stock: number): string => {
  if (stock === 0) return 'bg-red-100 text-red-700'
  if (stock <= 10) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

// Get stock status label
const getStockLabel = (stock: number): string => {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300?text=No+Image'
}

const handlePreviewError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/80x80?text=Invalid+URL'
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/admin/products')
    products.value = data.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (product: Product | null = null) => {
  editingProduct.value = product
  formError.value = ''
  
  if (product) {
    form.value = { ...product }
  } else {
    form.value = { name: '', description: '', price: 0, stock: 0, image: '' }
  }
  
  showModal.value = true
}

const saveProduct = async () => {
  // Validation
  if (!form.value.name || form.value.price <= 0 || form.value.stock < 0) {
    formError.value = 'Please fill in all required fields with valid values.'
    return
  }

  saving.value = true
  formError.value = ''
  
  try {
    if (editingProduct.value) {
      await api.put(`/admin/products/${editingProduct.value.id}`, form.value)
    } else {
      await api.post('/admin/products', form.value)
    }
    showModal.value = false
    await fetchProducts()
  } catch (e: any) {
    formError.value = e.response?.data?.message || 'Failed to save product.'
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
  
  try {
    await api.delete(`/admin/products/${id}`)
    await fetchProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
    alert('Failed to delete product. Please try again.')
  }
}

onMounted(() => fetchProducts())
</script>