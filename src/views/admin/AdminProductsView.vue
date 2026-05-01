<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800">Products Catalog</h2>
        <p class="text-sm text-slate-500 mt-1">{{ filteredProducts.length }} of {{ products.length }} products showing</p>
      </div>
      <button 
        class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 justify-center"
        @click="openModal()"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <!-- Category Filter -->
        <select 
          v-model="categoryFilter"
          class="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto text-sm bg-white"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        
        <!-- Stock Filter -->
        <select 
          v-model="stockFilter"
          class="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto text-sm bg-white"
        >
          <option value="">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <!-- Active Filters Badges -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Filters:</span>
        
        <span v-if="searchQuery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
          "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="hover:text-blue-900 ml-1">×</button>
        </span>
        
        <span v-if="categoryFilter" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
          {{ categoryFilter }}
          <button @click="categoryFilter = ''" class="hover:text-purple-900 ml-1">×</button>
        </span>
        
        <span v-if="stockFilter" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
          :class="{
            'bg-green-50 text-green-700 border-green-200': stockFilter === 'in_stock',
            'bg-yellow-50 text-yellow-700 border-yellow-200': stockFilter === 'low_stock',
            'bg-red-50 text-red-700 border-red-200': stockFilter === 'out_of_stock',
          }"
        >
          {{ stockFilter === 'in_stock' ? '✅ In Stock' : stockFilter === 'low_stock' ? '⚠️ Low Stock' : '❌ Out of Stock' }}
          <button @click="stockFilter = ''" class="hover:opacity-75 ml-1">×</button>
        </span>
        
        <button @click="clearAllFilters" class="text-xs text-gray-500 hover:text-red-600 font-medium ml-2 transition-colors">
          Clear All
        </button>
      </div>
    </div>

    <!-- Mode Indicator -->
    <div v-if="!loading && products.length > 0" class="text-xs text-gray-400 flex items-center gap-2">
      <span>Viewing</span>
      <span class="font-semibold text-gray-600">{{ filteredProducts.length }}</span>
      <span>products</span>
      <span v-if="hasActiveFilters" class="text-blue-500 font-medium">(filtered)</span>
      <span v-else class="text-gray-400">(all)</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-blue-200 border-t-blue-600 mb-4"></div>
      <p class="text-gray-500 font-medium">Loading products...</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div class="relative h-52 bg-gray-100 overflow-hidden">
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            @error="handleImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
            <span 
              v-if="product.category"
              class="px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm bg-white/90 backdrop-blur-sm text-gray-700 uppercase tracking-wider"
            >
              {{ product.category }}
            </span>
            <span 
              :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm',
                getStockClass(product.stock)
              ]"
            >
              {{ getStockLabel(product.stock) }}
            </span>
          </div>
        </div>
        
        <div class="p-5">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold text-gray-800 text-base leading-tight">{{ product.name }}</h3>
          </div>
          
          <p class="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{{ product.description }}</p>
          
          <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
            <div>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Price</p>
              <p class="text-lg font-bold text-gray-800">RM {{ formatPrice(product.price) }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Stock</p>
              <p class="text-lg font-semibold" :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'">
                {{ product.stock }}
              </p>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
              @click="openModal(product)"
            >
              Edit
            </button>
            <button 
              class="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
              @click="confirmDelete(product)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-16 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">No products found</h3>
      <p class="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        {{ hasActiveFilters ? 'Try adjusting your filters to see more products.' : 'Get started by adding your first product to the catalog.' }}
      </p>
      <button 
        v-if="!hasActiveFilters"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        @click="openModal()"
      >
        Add Your First Product
      </button>
      <button 
        v-else
        class="px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-medium transition-all"
        @click="clearAllFilters"
      >
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import api from '@/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  category?: string
}

const categories = ref([
  'Electronics',
  'Fashion',
  'Sports',
  'Books',
  'Toys',
  'Food & Beverages',
  'Health & Beauty',
  'Automotive',
])

const products = ref<Product[]>([])
const loading = ref(true)
const searchQuery = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || categoryFilter.value !== '' || stockFilter.value !== ''
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = searchQuery.value === '' || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = categoryFilter.value === '' || 
      product.category === categoryFilter.value
    
    let matchesStock = true
    if (stockFilter.value === 'in_stock') {
      matchesStock = product.stock > 10
    } else if (stockFilter.value === 'low_stock') {
      matchesStock = product.stock > 0 && product.stock <= 10
    } else if (stockFilter.value === 'out_of_stock') {
      matchesStock = product.stock === 0
    }
    
    return matchesSearch && matchesCategory && matchesStock
  })
})

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const getStockClass = (stock: number): string => {
  if (stock === 0) return 'bg-red-100 text-red-700'
  if (stock <= 10) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const getStockLabel = (stock: number): string => {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

const clearAllFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  stockFilter.value = ''
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300?text=No+Image'
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/admin/products')
    products.value = data.data || data || []
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Failed to load products' })
    products.value = []
  } finally {
    loading.value = false
  }
}

// Fancy SweetAlert2 Modal
const openModal = (product: Product | null = null) => {
  const isEdit = product !== null

  Swal.fire({
    title: isEdit ? 'Edit Product' : 'Add New Product',
    html: `
      <div style="text-align: left; display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Product Name <span style="color: #ef4444;">*</span>
          </label>
          <input id="swal-name" class="swal2-input" style="width: 100%; margin: 0;" placeholder="e.g., Wireless Headphones Pro" value="${product?.name ?? ''}">
        </div>
        
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Category <span style="color: #ef4444;">*</span>
          </label>
          <select id="swal-category" class="swal2-input" style="width: 100%; margin: 0;">
            <option value="">Select category...</option>
            ${categories.value.map(cat => `<option value="${cat}" ${product?.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
          </select>
        </div>
        
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Description
          </label>
          <textarea id="swal-description" class="swal2-textarea" style="width: 100%; margin: 0; resize: none;" placeholder="Product description..." rows="3">${product?.description ?? ''}</textarea>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Price (RM) <span style="color: #ef4444;">*</span>
            </label>
            <input id="swal-price" class="swal2-input" style="width: 100%; margin: 0;" type="number" step="0.01" min="0" placeholder="0.00" value="${product?.price ?? ''}">
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Stock <span style="color: #ef4444;">*</span>
            </label>
            <input id="swal-stock" class="swal2-input" style="width: 100%; margin: 0;" type="number" min="0" placeholder="0" value="${product?.stock ?? ''}">
          </div>
        </div>
        
        <div>
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #475569; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Image URL
          </label>
          <input id="swal-image" class="swal2-input" style="width: 100%; margin: 0;" placeholder="https://example.com/image.jpg" value="${product?.image ?? ''}">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Update Product' : 'Create Product',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    width: '560px',
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-lg font-bold text-slate-800',
      confirmButton: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg',
      cancelButton: 'px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors',
    },
    preConfirm: () => {
      const name = (document.getElementById('swal-name') as HTMLInputElement).value.trim()
      const category = (document.getElementById('swal-category') as HTMLSelectElement).value
      const description = (document.getElementById('swal-description') as HTMLTextAreaElement).value.trim()
      const price = parseFloat((document.getElementById('swal-price') as HTMLInputElement).value)
      const stock = parseInt((document.getElementById('swal-stock') as HTMLInputElement).value)
      const image = (document.getElementById('swal-image') as HTMLInputElement).value.trim()

      if (!name) { Swal.showValidationMessage('Product name is required'); return false }
      if (!category) { Swal.showValidationMessage('Please select a category'); return false }
      if (isNaN(price) || price <= 0) { Swal.showValidationMessage('Enter a valid price'); return false }
      if (isNaN(stock) || stock < 0) { Swal.showValidationMessage('Stock must be 0 or greater'); return false }

      return { name, category, description, price, stock, image }
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      await saveProduct(result.value, product?.id)
    }
  })
}

const saveProduct = async (formData: any, productId?: number) => {
  Swal.fire({
    title: 'Saving...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  })

  try {
    if (productId) {
      await api.put(`/admin/products/${productId}`, formData)
    } else {
      await api.post('/admin/products', formData)
    }
    await fetchProducts()
    Toast.fire({ icon: 'success', title: `Product ${productId ? 'updated' : 'created'} successfully` })
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'Failed to save product' })
  }
}

const confirmDelete = (product: Product) => {
  Swal.fire({
    title: 'Delete Product?',
    html: `
      <div style="text-align: center;">
        <p style="color: #475569; margin-bottom: 0.5rem;">Are you sure you want to delete</p>
        <p style="font-weight: 700; font-size: 1.1rem; color: #0f172a; margin-bottom: 0.5rem;">"${product.name}"</p>
        <p style="font-size: 0.85rem; color: #94a3b8;">This action cannot be undone.</p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Keep it',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors',
      cancelButton: 'px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors',
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteProduct(product.id, product.name)
    }
  })
}

const deleteProduct = async (id: number, name?: string) => {
  try {
    await api.delete(`/admin/products/${id}`)
    await fetchProducts()
    Toast.fire({ icon: 'success', title: `"${name}" deleted` })
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete product' })
  }
}

onMounted(() => fetchProducts())
</script>