<template>
  <div class="home-root">

    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="noise-overlay"></div>

      <div class="hero-inner">
        <TransitionGroup name="hero-slide" tag="div" class="hero-slides">
          <div
            v-for="(slide, index) in carouselSlides"
            :key="slide.id"
            v-show="currentSlide === index"
            class="hero-slide"
          >
            <div class="hero-content">
              <span class="slide-badge" :style="{ background: slide.badgeBg, color: slide.badgeColor }">
                {{ slide.badge }}
              </span>
              <h1 class="hero-title">{{ slide.title }}<br /><em class="hero-highlight" :style="{ color: slide.accentColor }">{{ slide.highlight }}</em></h1>
              <p class="hero-desc">{{ slide.description }}</p>
              <div class="hero-actions">
                <button @click="scrollToProducts" class="btn-primary"><span>Shop Now</span></button>
                <button class="btn-ghost">Explore Deals</button>
              </div>
            </div>
            <div class="hero-image-wrap">
              <div class="hero-image-glow" :style="{ background: `radial-gradient(circle, ${slide.accentColor}33, transparent 70%)` }"></div>
              <img :src="slide.image" :alt="slide.title" class="hero-image" />
            </div>
          </div>
        </TransitionGroup>

        <div class="slide-dots">
          <button v-for="(slide, i) in carouselSlides" :key="i" @click="goToSlide(i)" class="slide-dot" :class="{ active: currentSlide === i }"></button>
        </div>

        <button @click="prevSlide" class="slide-arrow slide-arrow-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button @click="nextSlide" class="slide-arrow slide-arrow-right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="slide-counter">
        <span class="counter-current">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
        <span class="counter-sep"></span>
        <span class="counter-total">{{ String(carouselSlides.length).padStart(2, '0') }}</span>
      </div>
    </section>

    <!-- MARQUEE STRIP -->
    <div class="marquee-strip">
      <div class="marquee-track">
        <span v-for="n in 8" :key="n" class="marquee-item">
          Free Shipping Over RM100 <span class="marquee-dot">✦</span>
          New Arrivals Daily <span class="marquee-dot">✦</span>
          Exclusive Member Deals <span class="marquee-dot">✦</span>
          Premium Quality Guaranteed <span class="marquee-dot">✦</span>
        </span>
      </div>
    </div>

    <!-- CATEGORIES -->
    <section class="section categories-section" id="categories">
      <div class="section-inner">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Curated Collections</p>
            <h2 class="section-title">Shop by Category</h2>
          </div>
          <button class="link-btn">View All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></button>
        </div>
        <div class="categories-grid">
          <div v-for="(cat, i) in categoryCards" :key="cat.name" class="cat-card" :style="{ '--delay': `${i * 60}ms`, '--cat-color': cat.color }" @click="filterByCategory(cat.name)">
            <div class="cat-icon-wrap"><span class="cat-emoji">{{ cat.emoji }}</span></div>
            <div class="cat-info">
              <p class="cat-name">{{ cat.name }}</p>
              <p class="cat-count">{{ cat.count > 0 ? `${cat.count} items` : '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FLASH SALE BANNER -->
    <section class="flash-banner">
      <div class="flash-inner">
        <div class="flash-text">
          <span class="flash-badge">⚡ Flash Sale</span>
          <h3 class="flash-title">Up to <strong>50% Off</strong> Selected Items</h3>
          <p class="flash-sub">Limited stock — grab yours before it's gone</p>
        </div>
        <div class="flash-countdown">
          <div v-for="(unit, key) in timeLeft" :key="key" class="countdown-block">
            <span class="countdown-num">{{ unit }}</span>
            <span class="countdown-label">{{ key }}</span>
          </div>
        </div>
        <button class="btn-flash">Shop the Sale</button>
      </div>
      <div class="flash-deco flash-deco-1"></div>
      <div class="flash-deco flash-deco-2"></div>
    </section>

    <!-- AI STYLIST SECTION -->
    <section class="section ai-section">
      <div class="section-inner">
        <div class="ai-header">
          <div>
            <p class="section-eyebrow">✨ Powered by AI</p>
            <h2 class="section-title">Shop the Vibe</h2>
            <p class="ai-subtitle">Tell us your mood or occasion — our AI stylist will handpick products just for you.</p>
          </div>
        </div>
        <div class="vibe-grid">
          <button v-for="vibe in vibeOptions" :key="vibe.label" class="vibe-btn" :class="{ active: selectedVibe === vibe.label }" @click="selectVibe(vibe.label)">
            <span class="vibe-emoji">{{ vibe.emoji }}</span>
            <span class="vibe-label">{{ vibe.label }}</span>
          </button>
        </div>
        <div class="vibe-custom">
          <input v-model="customVibe" type="text" placeholder="Or describe your own vibe..." class="vibe-input" maxlength="100" @keydown.enter="runAiSuggest" />
          <button class="btn-ai" :disabled="aiLoading || (!selectedVibe && !customVibe.trim())" @click="runAiSuggest">
            <svg v-if="!aiLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.003 3.003 0 01-.927 1.623A3 3 0 0112 20.657a3 3 0 01-2.13-.882 3.003 3.003 0 01-.927-1.623l-.347-.347z"/></svg>
            <div v-else class="ai-spinner"></div>
            <span>{{ aiLoading ? 'Styling...' : 'Get AI Picks' }}</span>
          </button>
        </div>
        <div v-if="aiLoading" class="ai-results">
          <div v-for="n in 3" :key="n" class="ai-card skeleton"><div class="sk-img"></div><div class="sk-body"><div class="sk-line short"></div><div class="sk-line"></div><div class="sk-line medium"></div><div class="sk-line short"></div></div></div>
        </div>
        <div v-else-if="aiError" class="ai-error"><span>😕</span><p>{{ aiError }}</p><button class="btn-primary small" @click="runAiSuggest">Try Again</button></div>
        <div v-else-if="aiResults.length" class="ai-results">
          <p class="ai-result-label">🎯 AI picks for <strong>"{{ aiCurrentVibe }}"</strong></p>
          <div class="ai-cards">
            <div v-for="(item, i) in aiResults" :key="item.id" class="ai-card" :style="{ animationDelay: `${i * 100}ms` }">
              <div class="ai-card-img-wrap" @click="router.push(`/products/${item.id}`)">
                <img :src="item.image" :alt="item.name" class="ai-card-img" @error="onAiImgError" />
                <span class="ai-rank">#{{ i + 1 }}</span>
              </div>
              <div class="ai-card-body">
                <span class="ai-card-cat">{{ item.category }}</span>
                <h4 class="ai-card-name" @click="router.push(`/products/${item.id}`)">{{ item.name }}</h4>
                <div class="ai-reason"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.003 3.003 0 01-.927 1.623A3 3 0 0112 20.657a3 3 0 01-2.13-.882 3.003 3.003 0 01-.927-1.623l-.347-.347z"/></svg><p>{{ item.reason }}</p></div>
                <div class="ai-card-footer"><span class="ai-card-price">RM {{ formatPrice(item.price) }}</span><button class="btn-ai-cart" @click="addToCartAi(item)">Add to Cart</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS SECTION -->
    <section class="section products-section" id="products" ref="productsRef">
      <div class="section-inner">
        <div class="filters-bar">
          <div class="filters-left">
            <div class="search-wrap">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input v-model="searchQuery" type="text" placeholder="Search products..." class="search-input" />
            </div>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="cat in categoryCards" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div class="filters-right">
            <div class="view-toggle">
              <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }" class="toggle-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }" class="toggle-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            </div>
          </div>
        </div>

        <div v-if="selectedCategory || searchQuery" class="active-filters">
          <span class="af-label">Filtered:</span>
          <span v-if="selectedCategory" class="af-tag">{{ selectedCategory }}<button @click="selectedCategory = ''">×</button></span>
          <span v-if="searchQuery" class="af-tag">"{{ searchQuery }}"<button @click="searchQuery = ''">×</button></span>
          <button @click="clearFilters" class="af-clear">Clear all</button>
        </div>

        <div class="products-header">
          <div><p class="section-eyebrow">Our Inventory</p><h2 class="section-title">{{ selectedCategory || 'All Products' }}</h2></div>
          <p class="products-count">{{ products.length }} / {{ totalItems }} products</p>
        </div>

        <div v-if="loading" class="loading-state"><div class="loader-ring"></div><p>Loading amazing products...</p></div>
        <div v-else-if="error" class="error-state"><span class="error-icon">⚠</span><p>{{ error }}</p><button @click="fetchProducts(currentPage)" class="btn-primary small">Try Again</button></div>
        <div v-else-if="viewMode === 'grid'" class="products-grid">
          <TransitionGroup name="fade" appear>
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
          </TransitionGroup>
        </div>
        <div v-else class="products-list">
          <TransitionGroup name="fade" appear>
            <div v-for="product in paginatedProducts" :key="product.id" class="list-card">
              <img :src="product.image" :alt="product.name" class="list-card-img" />
              <div class="list-card-body">
                <span class="list-card-cat">{{ product.category }}</span>
                <h3 class="list-card-name">{{ product.name }}</h3>
                <p class="list-card-desc">{{ product.description }}</p>
                <div class="list-card-footer">
                  <span class="list-card-price">RM {{ formatPrice(product.price) }}</span>
                  <button @click="addToCart(product)" class="btn-primary small">Add to Cart</button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-if="!loading && !error && filteredProducts.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span><p class="empty-title">No products found</p>
          <p class="empty-sub">Try adjusting your filters or search terms</p>
          <button @click="clearFilters" class="btn-primary small">Clear Filters</button>
        </div>

        <div v-if="totalPages > 1 && !loading" class="pagination">
          <button @click="goToPage(1)" :disabled="currentPage === 1" class="page-btn nav">«</button>
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn nav">‹</button>
          <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="['page-btn', { active: page === currentPage }]">{{ page }}</button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn nav">›</button>
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="page-btn nav">»</button>
        </div>
      </div>
    </section>

    <!-- LOCATION & MAP SECTION -->
    <section class="location-section">
      <div class="location-inner">
        <div class="location-content">
          <div class="location-badge"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Our Location</div>
          <h3 class="location-title">Visit Our Store</h3>
          <p class="location-sub">Come visit us at our physical store.</p>
          <div class="location-info-grid">
            <div class="location-info-card"><div class="location-info-icon"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><p class="location-info-label">Address</p><p class="location-info-value">{{ locationData.address }}</p></div></div>
            <div class="location-info-card"><div class="location-info-icon"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><p class="location-info-label">Hours</p><p class="location-info-value">{{ locationData.hours }}</p></div></div>
            <div class="location-info-card"><div class="location-info-icon"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p class="location-info-label">Contact</p><p class="location-info-value">{{ locationData.contact }}</p></div></div>
          </div>
          <a :href="locationData.mapsUrl" target="_blank" rel="noopener noreferrer" class="location-cta"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Get Directions</a>
        </div>
        <div class="location-map-wrap">
          <div class="location-map"><iframe :src="locationData.embedUrl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="location-map-iframe"></iframe></div>
          <div class="location-map-overlay"><a :href="locationData.mapsUrl" target="_blank" rel="noopener noreferrer" class="location-map-btn"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>Open in Google Maps</a></div>
        </div>
      </div>
      <div class="location-orb location-orb-1"></div>
      <div class="location-orb location-orb-2"></div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue' 
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useAiStylist, useCart } from '@/composables/useAiStylist'
import { useCarousel, useCountdown } from '@/composables/useCarousel'
import { carouselSlides, categoryCards, vibeOptions, locationData } from '@/data/homeData'
import '@/styles/home.css'

const router = useRouter()
const productsRef = ref<HTMLElement | null>(null)

const {
  products, loading, error, currentPage, totalPages, totalItems,
  searchQuery, selectedCategory, viewMode,
  filteredProducts, paginatedProducts, visiblePages,
  fetchProducts, filterByCategory, clearFilters, goToPage, fetchCategoryCounts
} = useProducts()

const {
  selectedVibe, customVibe, aiLoading, aiError, aiResults, aiCurrentVibe,
  selectVibe, runAiSuggest, addToCartAi, onAiImgError
} = useAiStylist()

const { currentSlide, next: nextSlide, prev: prevSlide, goTo: goToSlide } = useCarousel(carouselSlides.length)
const { timeLeft } = useCountdown()
const { addToCart } = useCart()

const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const scrollToProducts = () => {
  productsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const filterAndScroll = (cat: string) => {
  filterByCategory(cat)
  setTimeout(scrollToProducts, 100)
}

// Disabled state for buttons
const isDisabled = (condition: boolean): boolean => condition

onMounted(() => {
  fetchProducts()
  fetchCategoryCounts()
})
</script>