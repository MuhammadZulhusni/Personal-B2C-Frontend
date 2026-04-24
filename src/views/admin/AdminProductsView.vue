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
        v-model="categoryFilter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
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
          <div class="absolute top-3 right-3 flex gap-1">
            <span 
              v-if="product.category"
              class="px-2 py-1 rounded-full text-xs font-medium shadow-sm bg-purple-100 text-purple-700"
            >
              {{ product.category }}
            </span>
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
          
          <span 
            v-if="product.category"
            class="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full mb-2"
          >
            {{ product.category }}
          </span>
          
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
              @click="confirmDelete(product)"
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

// SweetAlert2 Toast
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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300?text=No+Image'
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/admin/products')
    products.value = data.data
  } catch (error) {
    Toast.fire({ icon: 'error', title: 'Failed to load products' })
  } finally {
    loading.value = false
  }
}

// Build the HTML string for the SweetAlert2 product form
const buildFormHtml = (product: Product | null) => {
  const categoryOptions = categories.value
    .map(cat => `<option value="${cat}" ${product?.category === cat ? 'selected' : ''}>${cat}</option>`)
    .join('')

  return `
    <style>
      .swal-product-form { text-align: left; }
      .swal-product-form label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
      .swal-product-form .required { color: #ef4444; }
      .swal-product-form input,
      .swal-product-form select,
      .swal-product-form textarea {
        width: 100%;
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        margin-bottom: 1rem;
        color: #1f2937;
      }
      .swal-product-form input:focus,
      .swal-product-form select:focus,
      .swal-product-form textarea:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
      }
      .swal-product-form .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .swal-product-form .grid-2 input { margin-bottom: 0; }
      .swal-product-form textarea { resize: none; }
      .swal-product-form .form-error {
        background: #fef2f2;
        color: #dc2626;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.8rem;
        margin-bottom: 1rem;
        display: none;
      }
      .swal-product-form #img-preview {
        width: 72px; height: 72px; object-fit: cover;
        border-radius: 0.5rem; border: 1px solid #e5e7eb;
        margin-top: 0.4rem; display: none;
      }
    </style>
    <div class="swal-product-form">
      <div id="swal-form-error" class="form-error"></div>

      <label>Product Name <span class="required">*</span></label>
      <input id="swal-name" type="text" placeholder="e.g., Wireless Headphones" value="${product?.name ?? ''}" />

      <label>Category <span class="required">*</span></label>
      <select id="swal-category">
        <option value="">Select category...</option>
        ${categoryOptions}
      </select>

      <label>Description</label>
      <textarea id="swal-description" rows="3" placeholder="Product description...">${product?.description ?? ''}</textarea>

      <div class="grid-2">
        <div>
          <label>Price (RM) <span class="required">*</span></label>
          <input id="swal-price" type="number" step="0.01" min="0" placeholder="0.00" value="${product?.price ?? ''}" />
        </div>
        <div>
          <label>Stock <span class="required">*</span></label>
          <input id="swal-stock" type="number" min="0" placeholder="0" value="${product?.stock ?? ''}" />
        </div>
      </div>

      <label>Image URL</label>
      <input id="swal-image" type="text" placeholder="https://example.com/image.jpg" value="${product?.image ?? ''}" />
      <img id="img-preview" src="" alt="Preview" />
    </div>
  `
}

// Open SweetAlert2 modal for Add / Edit
const openModal = (product: Product | null = null) => {
  Swal.fire({
    title: product ? 'Edit Product' : 'Add New Product',
    html: buildFormHtml(product),
    width: 560,
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    confirmButtonText: product ? 'Update Product' : 'Create Product',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusConfirm: false,
    didOpen: () => {
      // Live image preview
      const imageInput = document.getElementById('swal-image') as HTMLInputElement
      const imgPreview = document.getElementById('img-preview') as HTMLImageElement

      const updatePreview = () => {
        const url = imageInput.value.trim()
        if (url) {
          imgPreview.style.display = 'block'
          imgPreview.src = url
          imgPreview.onerror = () => {
            imgPreview.src = 'https://via.placeholder.com/80x80?text=Invalid+URL'
          }
        } else {
          imgPreview.style.display = 'none'
        }
      }

      imageInput.addEventListener('input', updatePreview)
      // Show preview immediately if editing with existing image
      if (product?.image) updatePreview()
    },
    preConfirm: async () => {
      const name     = (document.getElementById('swal-name') as HTMLInputElement).value.trim()
      const category = (document.getElementById('swal-category') as HTMLSelectElement).value
      const description = (document.getElementById('swal-description') as HTMLTextAreaElement).value.trim()
      const price    = parseFloat((document.getElementById('swal-price') as HTMLInputElement).value)
      const stock    = parseInt((document.getElementById('swal-stock') as HTMLInputElement).value)
      const image    = (document.getElementById('swal-image') as HTMLInputElement).value.trim()

      const errorEl = document.getElementById('swal-form-error') as HTMLElement

      const showError = (msg: string) => {
        errorEl.textContent = msg
        errorEl.style.display = 'block'
        Swal.resetValidationMessage()
        return false
      }

      if (!name) return showError('Product name is required.')
      if (!category) return showError('Please select a category.')
      if (isNaN(price) || price <= 0) return showError('Please enter a valid price greater than 0.')
      if (isNaN(stock) || stock < 0) return showError('Stock must be 0 or greater.')

      errorEl.style.display = 'none'

      const payload = { name, category, description, price, stock, image }

      try {
        if (product) {
          await api.put(`/admin/products/${product.id}`, payload)
        } else {
          await api.post('/admin/products', payload)
        }
        return true
      } catch (e: any) {
        const msg = e.response?.data?.message || 'Failed to save product. Please try again.'
        return showError(msg)
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      await fetchProducts()
      Toast.fire({
        icon: 'success',
        title: `Product ${product ? 'updated' : 'created'} successfully`,
      })
    }
  })
}

// Delete confirmation
const confirmDelete = (product: Product) => {
  Swal.fire({
    title: 'Delete Product?',
    html: `<p>Are you sure you want to delete <strong>"${product.name}"</strong>?</p>
           <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
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
    Toast.fire({
      icon: 'success',
      title: name ? `"${name}" deleted` : 'Product deleted',
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to delete product. Please try again.',
    })
  }
}

onMounted(() => fetchProducts())
</script>