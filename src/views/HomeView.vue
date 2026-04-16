<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero Carousel Section -->
    <div class="relative overflow-hidden">
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <!-- Carousel -->
          <div class="relative">
            <TransitionGroup 
              name="carousel" 
              tag="div" 
              class="relative overflow-hidden rounded-2xl"
            >
              <div 
                v-for="(slide, index) in carouselSlides" 
                :key="slide.id"
                v-show="currentSlide === index"
                class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <span 
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    :class="slide.badgeClass"
                  >
                    {{ slide.badge }}
                  </span>
                  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {{ slide.title }} <br />
                    <span :class="slide.highlightClass">{{ slide.highlight }}</span>
                  </h1>
                  <p class="text-slate-300 text-lg mb-8 max-w-lg">
                    {{ slide.description }}
                  </p>
                  <div class="flex flex-wrap gap-4">
                    <button 
                      @click="scrollToProducts"
                      class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Shop Now
                    </button>
                    <button 
                      class="px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-all backdrop-blur-sm"
                    >
                      View Deals
                    </button>
                  </div>
                </div>
                <div class="hidden lg:block">
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
                    <img 
                      :src="slide.image" 
                      :alt="slide.title"
                      class="relative rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Carousel Indicators -->
            <div class="flex justify-center gap-2 mt-8">
              <button 
                v-for="(slide, index) in carouselSlides" 
                :key="index"
                @click="currentSlide = index"
                class="transition-all duration-300"
                :class="[
                  'h-2 rounded-full',
                  currentSlide === index 
                    ? 'w-8 bg-amber-500' 
                    : 'w-2 bg-white/50 hover:bg-white/70'
                ]"
              ></button>
            </div>

            <!-- Carousel Arrows -->
            <button 
              @click="prevSlide"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
            >
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              @click="nextSlide"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
            >
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Wave Divider -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-12 text-white fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    </div>

    <!-- Rest of the template remains the same -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Categories Quick Links -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Shop by Category</h2>
            <p class="text-slate-500">Find exactly what you're looking for</p>
          </div>
          <button class="group text-sm text-slate-600 hover:text-slate-800 font-medium flex items-center gap-1">
            View All 
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="(category, index) in categories" 
            :key="category.name"
            class="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="filterByCategory(category.name)"
          >
            <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
              <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <component :is="category.icon" class="w-8 h-8 text-amber-700" />
              </div>
              <p class="text-sm font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">{{ category.name }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ category.count }}+ items</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Promo Banner with Countdown -->
      <div class="mb-12">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-black/10"></div>
          <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div class="text-center lg:text-left mb-6 lg:mb-0">
              <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">Flash Sale</span>
              <h3 class="text-2xl sm:text-3xl font-bold mb-2">Up to 50% Off!</h3>
              <p class="text-white/90 text-lg">Limited time offer on selected items</p>
            </div>
            <div class="flex gap-4">
              <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span class="text-3xl font-bold">{{ timeLeft.days }}</span>
                  <span class="text-xs block">Days</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span class="text-3xl font-bold">{{ timeLeft.hours }}</span>
                  <span class="text-xs block">Hours</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span class="text-3xl font-bold">{{ timeLeft.minutes }}</span>
                  <span class="text-xs block">Mins</span>
                </div>
              </div>
              <div class="text-center">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span class="text-3xl font-bold">{{ timeLeft.seconds }}</span>
                  <span class="text-xs block">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Sort Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-64"
              />
            </div>
            
            <!-- Category Filter -->
            <select 
              v-model="selectedCategory"
              class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Sort -->
            <select 
              v-model="sortBy"
              class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            
            <!-- View Toggle -->
            <div class="hidden lg:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <button 
                @click="viewMode = 'grid'"
                :class="[
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'
                ]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'
                ]"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Active Filters -->
        <div v-if="selectedCategory || searchQuery" class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500">Active filters:</span>
          <span 
            v-if="selectedCategory"
            class="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
          >
            {{ selectedCategory }}
            <button @click="selectedCategory = ''" class="hover:text-amber-900">×</button>
          </span>
          <span 
            v-if="searchQuery"
            class="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
          >
            "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="hover:text-amber-900">×</button>
          </span>
          <button 
            @click="clearFilters"
            class="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-800">
            {{ selectedCategory || 'All Products' }}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            Showing {{ filteredProducts.length }} of {{ products.length }} products
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
        </div>
        <p class="text-slate-500 text-sm mt-4">Loading amazing products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 font-medium mb-3">{{ error }}</p>
        <button
          @click="() => fetchProducts(currentPage)"
          class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Products Display -->
      <div v-else>
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <TransitionGroup name="fade" appear>
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </TransitionGroup>
        </div>
        
        <!-- List View -->
        <div v-else class="space-y-4">
          <TransitionGroup name="fade" appear>
            <div 
              v-for="product in paginatedProducts"
              :key="product.id"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex gap-4">
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h3 class="font-semibold text-slate-800">{{ product.name }}</h3>
                  <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ product.description }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-lg font-bold text-slate-800">RM {{ formatPrice(product.price) }}</span>
                    <button 
                      @click="addToCart(product)"
                      class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-slate-500 text-lg mb-2">No products found</p>
          <p class="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && !loading" class="flex items-center justify-center gap-2 mt-12">
        <button
          @click="() => fetchProducts(1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-slate-600 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          «
        </button>

        <button
          @click="() => fetchProducts(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="() => fetchProducts(page)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[40px]',
              page === currentPage
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="() => fetchProducts(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

        <button
          @click="() => fetchProducts(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-slate-600 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          »
        </button>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="bg-slate-800 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold mb-3">Stay Updated</h3>
          <p class="text-slate-300 mb-6">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
          <div class="flex gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              class="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import api from '@/api'
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const products = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const currentSlide = ref(0)

// Carousel slides
const carouselSlides = ref([
  {
    id: 1,
    badge: 'Limited Time Offer',
    badgeClass: 'bg-amber-500/20 text-amber-300',
    title: 'Shop the Latest',
    highlight: 'Trends & Styles',
    highlightClass: 'text-amber-400',
    description: 'Discover our curated collection of premium products at unbeatable prices. Free shipping on orders over RM 100.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    badge: 'New Arrivals',
    badgeClass: 'bg-blue-500/20 text-blue-300',
    title: 'Summer Collection',
    highlight: 'Now Available',
    highlightClass: 'text-blue-400',
    description: 'Get ready for summer with our latest collection. Up to 30% off on selected items.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    badge: 'Exclusive Deal',
    badgeClass: 'bg-purple-500/20 text-purple-300',
    title: 'Premium Quality',
    highlight: 'Best Sellers',
    highlightClass: 'text-purple-400',
    description: 'Shop our most popular items loved by thousands of customers worldwide.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop'
  }
])

// Countdown timer
const timeLeft = ref({
  days: '02',
  hours: '12',
  minutes: '45',
  seconds: '30'
})

let carouselInterval: any = null
let countdownInterval: any = null

// Categories with counts
const categories = ref([
  { name: 'Electronics', icon: 'svg-electronics', count: 45 },
  { name: 'Fashion', icon: 'svg-fashion', count: 128 },
  { name: 'Home & Living', icon: 'svg-home', count: 67 },
  { name: 'Sports', icon: 'svg-sports', count: 34 },
  { name: 'Books', icon: 'svg-books', count: 89 },
  { name: 'Toys', icon: 'svg-toys', count: 23 },
])

// Filter and sort products
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  if (sortBy.value === 'price_low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price_high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'popular') {
    filtered = [...filtered].sort((a, b) => (b.sold || 0) - (a.sold || 0))
  }

  return filtered
})

// Pagination for filtered products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 12
  const end = start + 12
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const scrollToProducts = () => {
  document.querySelector('.max-w-7xl')?.scrollIntoView({ behavior: 'smooth' })
}

const filterByCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

const addToCart = (product: any) => {
  cartStore.addToCart(product)
  alert(`${product.name} added to cart!`)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? carouselSlides.value.length - 1 
    : currentSlide.value - 1
}

const startCarousel = () => {
  carouselInterval = setInterval(nextSlide, 5000)
}

const updateCountdown = () => {
  const now = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 2)
  end.setHours(12, 45, 30)
  
  const diff = end.getTime() - now.getTime()
  
  if (diff > 0) {
    timeLeft.value = {
      days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
      minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
      seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
    }
  }
}

const fetchProducts = async (page = 1) => {
  loading.value = true
  error.value = ''
  
  try {
    const { data } = await api.get(`/products?page=${page}`)
    products.value = data.data || []
    currentPage.value = data.current_page || 1
    totalPages.value = Math.ceil((data.total || 0) / 12)
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    error.value = 'Failed to load products. Please try again.'
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  startCarousel()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (carouselInterval) clearInterval(carouselInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>