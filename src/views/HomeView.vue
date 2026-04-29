<template>
  <div class="home-root">

    <!-- ══════════════════════════════════════════════════
         HERO SECTION
    ══════════════════════════════════════════════════ -->
    <section class="hero-section">
      <!-- Ambient background orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="noise-overlay"></div>

      <!-- Carousel -->
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
              <h1 class="hero-title">
                {{ slide.title }}<br />
                <em class="hero-highlight" :style="{ color: slide.accentColor }">{{ slide.highlight }}</em>
              </h1>
              <p class="hero-desc">{{ slide.description }}</p>
              <div class="hero-actions">
                <button @click="scrollToProducts" class="btn-primary">
                  <span>Shop Now</span>
                  <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button class="btn-ghost">Explore Deals</button>
              </div>
            </div>
            <div class="hero-image-wrap">
              <div class="hero-image-glow" :style="{ background: `radial-gradient(circle, ${slide.accentColor}33, transparent 70%)` }"></div>
              <img :src="slide.image" :alt="slide.title" class="hero-image" />
            </div>
          </div>
        </TransitionGroup>

        <!-- Slide indicators -->
        <div class="slide-dots">
          <button
            v-for="(slide, i) in carouselSlides"
            :key="i"
            @click="goToSlide(i)"
            class="slide-dot"
            :class="{ active: currentSlide === i }"
          ></button>
        </div>

        <!-- Nav arrows -->
        <button @click="prevSlide" class="slide-arrow slide-arrow-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button @click="nextSlide" class="slide-arrow slide-arrow-right">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Slide number -->
      <div class="slide-counter">
        <span class="counter-current">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
        <span class="counter-sep"></span>
        <span class="counter-total">{{ String(carouselSlides.length).padStart(2, '0') }}</span>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         MARQUEE STRIP
    ══════════════════════════════════════════════════ -->
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

    <!-- ══════════════════════════════════════════════════
         CATEGORIES
    ══════════════════════════════════════════════════ -->
    <section class="section categories-section" id="categories">
      <div class="section-inner">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Curated Collections</p>
            <h2 class="section-title">Shop by Category</h2>
          </div>
          <button class="link-btn">
            View All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

        <div class="categories-grid">
          <div
            v-for="(cat, i) in categoryCards"
            :key="cat.name"
            class="cat-card"
            :style="{ '--delay': `${i * 60}ms`, '--cat-color': cat.color }"
            @click="filterByCategory(cat.name)"
          >
            <div class="cat-icon-wrap">
              <span class="cat-emoji">{{ cat.emoji }}</span>
            </div>
            <div class="cat-info">
              <p class="cat-name">{{ cat.name }}</p>
              <p class="cat-count">{{ cat.count > 0 ? `${cat.count} items` : '—' }}</p>
            </div>
            <div class="cat-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         FLASH SALE BANNER
    ══════════════════════════════════════════════════ -->
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
        <button class="btn-flash">Shop the Sale →</button>
      </div>
      <div class="flash-deco flash-deco-1"></div>
      <div class="flash-deco flash-deco-2"></div>
    </section>

    <!-- ══════════════════════════════════════════════════
         AI STYLIST SECTION
    ══════════════════════════════════════════════════ -->
    <section class="section ai-section">
      <div class="section-inner">
        <div class="ai-header">
          <div>
            <p class="section-eyebrow">✨ Powered by AI</p>
            <h2 class="section-title">Shop the Vibe</h2>
            <p class="ai-subtitle">Tell us your mood or occasion — our AI stylist will handpick products just for you.</p>
          </div>
        </div>

        <!-- Vibe picker -->
        <div class="vibe-grid">
          <button
            v-for="vibe in vibeOptions"
            :key="vibe.label"
            class="vibe-btn"
            :class="{ active: selectedVibe === vibe.label }"
            @click="selectVibe(vibe.label)"
          >
            <span class="vibe-emoji">{{ vibe.emoji }}</span>
            <span class="vibe-label">{{ vibe.label }}</span>
          </button>
        </div>

        <!-- Custom vibe input -->
        <div class="vibe-custom">
          <input
            v-model="customVibe"
            type="text"
            placeholder="Or describe your own vibe... e.g. 'birthday gift for my dad'"
            class="vibe-input"
            maxlength="100"
            @keydown.enter="runAiSuggest"
          />
          <button
            class="btn-ai"
            :disabled="aiLoading || (!selectedVibe && !customVibe.trim())"
            @click="runAiSuggest"
          >
            <svg v-if="!aiLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.003 3.003 0 01-.927 1.623A3 3 0 0112 20.657a3 3 0 01-2.13-.882 3.003 3.003 0 01-.927-1.623l-.347-.347z"/>
            </svg>
            <div v-else class="ai-spinner"></div>
            <span>{{ aiLoading ? 'Styling...' : 'Get AI Picks' }}</span>
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="aiLoading" class="ai-results">
          <div v-for="n in 3" :key="n" class="ai-card skeleton">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line short"></div>
              <div class="sk-line"></div>
              <div class="sk-line medium"></div>
              <div class="sk-line short"></div>
            </div>
          </div>
        </div>

        <!-- AI Error -->
        <div v-else-if="aiError" class="ai-error">
          <span>😕</span>
          <p>{{ aiError }}</p>
          <button class="btn-primary small" @click="runAiSuggest">Try Again</button>
        </div>

        <!-- AI Results -->
        <div v-else-if="aiResults.length" class="ai-results">
          <p class="ai-result-label">
            🎯 AI picks for <strong>"{{ aiCurrentVibe }}"</strong>
          </p>
          <div class="ai-cards">
            <div
              v-for="(item, i) in aiResults"
              :key="item.id"
              class="ai-card"
              :style="{ animationDelay: `${i * 100}ms` }"
            >
              <div class="ai-card-img-wrap" @click="router.push(`/products/${item.id}`)">
                <img :src="item.image" :alt="item.name" class="ai-card-img" @error="onAiImgError" />
                <span class="ai-rank">#{{ i + 1 }}</span>
              </div>
              <div class="ai-card-body">
                <span class="ai-card-cat">{{ item.category }}</span>
                <h4 class="ai-card-name" @click="router.push(`/products/${item.id}`)">{{ item.name }}</h4>
                <div class="ai-reason">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.003 3.003 0 01-.927 1.623A3 3 0 0112 20.657a3 3 0 01-2.13-.882 3.003 3.003 0 01-.927-1.623l-.347-.347z"/>
                  </svg>
                  <p>{{ item.reason }}</p>
                </div>
                <div class="ai-card-footer">
                  <span class="ai-card-price">RM {{ formatPrice(item.price) }}</span>
                  <button class="btn-ai-cart" @click="addToCartAi(item)">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         PRODUCTS SECTION
    ══════════════════════════════════════════════════ -->
    <section class="section products-section" id="products" ref="productsRef">
      <div class="section-inner">

        <!-- Filters bar -->
        <div class="filters-bar">
          <div class="filters-left">
            <div class="search-wrap">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="search-input"
              />
            </div>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="cat in categoryCards" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
            </select>
            <!-- <select v-model="sortBy" class="filter-select">
              <option value="newest">Newest</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
              <option value="popular">Popular</option>
            </select> -->
          </div>
          <div class="filters-right">
            <div class="view-toggle">
              <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }" class="toggle-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }" class="toggle-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Active filters -->
        <div v-if="selectedCategory || searchQuery" class="active-filters">
          <span class="af-label">Filtered:</span>
          <span v-if="selectedCategory" class="af-tag">
            {{ selectedCategory }}
            <button @click="selectedCategory = ''">×</button>
          </span>
          <span v-if="searchQuery" class="af-tag">
            "{{ searchQuery }}"
            <button @click="searchQuery = ''">×</button>
          </span>
          <button @click="clearFilters" class="af-clear">Clear all</button>
        </div>

        <!-- Section header -->
        <div class="products-header">
          <div>
            <p class="section-eyebrow">Our Inventory</p>
            <h2 class="section-title">{{ selectedCategory || 'All Products' }}</h2>
          </div>
          <p class="products-count">{{ products.length }} / {{ totalItems }} products</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="loader-ring"></div>
          <p>Loading amazing products...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-state">
          <span class="error-icon">⚠</span>
          <p>{{ error }}</p>
          <button @click="fetchProducts(currentPage)" class="btn-primary small">Try Again</button>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="products-grid">
          <TransitionGroup name="fade" appear>
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </TransitionGroup>
        </div>

        <!-- List view -->
        <div v-else class="products-list">
          <TransitionGroup name="fade" appear>
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="list-card"
            >
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

        <!-- Empty -->
        <div v-if="!loading && !error && filteredProducts.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p class="empty-title">No products found</p>
          <p class="empty-sub">Try adjusting your filters or search terms</p>
          <button @click="clearFilters" class="btn-primary small">Clear Filters</button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1 && !loading" class="pagination">
          <button @click="goToPage(1)" :disabled="currentPage === 1" class="page-btn nav">«</button>
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn nav">‹</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-btn', { active: page === currentPage }]"
          >{{ page }}</button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn nav">›</button>
          <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="page-btn nav">»</button>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
        LOCATION & MAP SECTION
    ══════════════════════════════════════════════════ -->
    <!-- ══════════════════════════════════════════════════
     LOCATION & MAP SECTION
══════════════════════════════════════════════════ -->
<section class="location-section">
  <div class="location-inner">
    <div class="location-content">
      <div class="location-badge">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Our Location
      </div>
      <h3 class="location-title">Visit Our Store</h3>
      <p class="location-sub">Come visit us at our physical store. We're conveniently located and ready to serve you.</p>
      
      <div class="location-info-grid">
        <div class="location-info-card">
          <div class="location-info-icon">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="location-info-label">Address</p>
            <p class="location-info-value">PARC 3, Residensi Pudu Alam Rekreasi,<br />5, Jalan Pudu Perdana, Taman Pertama,<br />56100 Kuala Lumpur, Malaysia</p>
          </div>
        </div>
        
        <div class="location-info-card">
          <div class="location-info-icon">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="location-info-label">Operating Hours</p>
            <p class="location-info-value">Mon - Sat: 10:00 AM - 8:00 PM<br />Sun: 10:00 AM - 6:00 PM</p>
          </div>
        </div>
        
        <div class="location-info-card">
          <div class="location-info-icon">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p class="location-info-label">Contact</p>
            <p class="location-info-value">+60 12-345 6789<br />hello@minishop.com</p>
          </div>
        </div>
      </div>

      <a 
        href="https://maps.app.goo.gl/tckRpQsLgKrsykQB9" 
        target="_blank" 
        rel="noopener noreferrer"
        class="location-cta"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Get Directions on Google Maps
      </a>
    </div>

    <!-- Map Container -->
    <div class="location-map-wrap">
      <div class="location-map">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4061.7081054201035!2d101.7281918750462!3d3.121776953320148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc366d5edd2813%3A0xaad62a668c76756f!2sParc%203!5e1!3m2!1sen!2smy!4v1777475719857!5m2!1sen!2smy"
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          class="location-map-iframe"
        ></iframe>
      </div>
      <div class="location-map-overlay">
        <a 
          href="https://maps.app.goo.gl/tckRpQsLgKrsykQB9" 
          target="_blank" 
          rel="noopener noreferrer"
          class="location-map-btn"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Google Maps
        </a>
      </div>
    </div>
  </div>
  <div class="location-orb location-orb-1"></div>
  <div class="location-orb location-orb-2"></div>
</section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const router    = useRouter()
const cartStore = useCartStore()
const products = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const currentSlide = ref(0)
const productsRef = ref<HTMLElement | null>(null)
let searchDebounce: any = null

const carouselSlides = ref([
  {
    id: 1,
    badge: 'Limited Time Offer',
    badgeBg: 'rgba(251,191,36,0.15)',
    badgeColor: '#fbbf24',
    title: 'Shop the Latest',
    highlight: 'Trends & Styles',
    accentColor: '#f59e0b',
    description: 'Discover our curated collection of premium products at unbeatable prices. Free shipping on orders over RM 100.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=500&fit=crop'
  },
  {
    id: 2,
    badge: 'New Arrivals',
    badgeBg: 'rgba(59,130,246,0.15)',
    badgeColor: '#60a5fa',
    title: 'Summer Collection',
    highlight: 'Now Available',
    accentColor: '#3b82f6',
    description: 'Get ready for summer with our latest collection. Up to 30% off on selected items.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&h=500&fit=crop'
  },
  {
    id: 3,
    badge: 'Exclusive Deal',
    badgeBg: 'rgba(168,85,247,0.15)',
    badgeColor: '#c084fc',
    title: 'Premium Quality',
    highlight: 'Best Sellers',
    accentColor: '#a855f7',
    description: 'Shop our most popular items loved by thousands of customers worldwide.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&h=500&fit=crop'
  }
])

const categoryCards = ref([
  { name: 'Electronics',     emoji: '⚡', count: 0, color: '#f59e0b' },
  { name: 'Fashion',         emoji: '👗', count: 0, color: '#ec4899' },
  { name: 'Sports',          emoji: '🏋️', count: 0, color: '#10b981' },
  { name: 'Books',           emoji: '📚', count: 0, color: '#6366f1' },
  { name: 'Toys',            emoji: '🎮', count: 0, color: '#f97316' },
  { name: 'Food & Beverages',emoji: '☕', count: 0, color: '#84cc16' },
  { name: 'Health & Beauty', emoji: '✨', count: 0, color: '#06b6d4' },
  { name: 'Automotive',      emoji: '🚗', count: 0, color: '#ef4444' },
])

const timeLeft = ref({ Days: '02', Hours: '12', Mins: '45', Secs: '30' })
let carouselInterval: any = null
let countdownInterval: any = null

// Products come pre-filtered from backend
const filteredProducts = computed(() => products.value)
const paginatedProducts = computed(() => products.value)

const visiblePages = computed(() => {
  const pages = []
  const max = 5
  let start = Math.max(1, currentPage.value - Math.floor(max / 2))
  let end = Math.min(totalPages.value, start + max - 1)
  if (end - start + 1 < max) start = Math.max(1, end - max + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const scrollToProducts = () => {
  productsRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const filterByCategory = (cat: string) => {
  selectedCategory.value = cat
  currentPage.value = 1
  fetchProducts(1)
  scrollToProducts()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'newest'
  currentPage.value = 1
  fetchProducts(1)
}

// ── AI Stylist ──────────────────────────────────
const vibeOptions = [
  { emoji: '🎉', label: 'Birthday Party' },
  { emoji: '💼', label: 'Work From Home' },
  { emoji: '🏋️', label: 'Fitness Goals' },
  { emoji: '🌴', label: 'Beach Vacation' },
  { emoji: '🎮', label: 'Gaming Night' },
  { emoji: '💝', label: 'Gift for Partner' },
  { emoji: '📚', label: 'Study Mode' },
  { emoji: '🍳', label: 'Home Cooking' },
]

const selectedVibe  = ref('')
const customVibe    = ref('')
const aiLoading     = ref(false)
const aiError       = ref('')
const aiResults     = ref<any[]>([])
const aiCurrentVibe = ref('')

const selectVibe = (label: string) => {
  selectedVibe.value = selectedVibe.value === label ? '' : label
  customVibe.value   = ''
}

const onAiImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f1f5f9/94a3b8?text=No+Image'
}

// ── Toast (defined early so all functions can use it) ──
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const runAiSuggest = async () => {
  const vibe = customVibe.value.trim() || selectedVibe.value
  if (!vibe || aiLoading.value) return

  aiLoading.value     = true
  aiError.value       = ''
  aiResults.value     = []
  aiCurrentVibe.value = vibe

  try {
    const { data } = await api.post('/ai/suggest', { vibe })
    aiResults.value = data.results || []
  } catch (e: any) {
    aiError.value = e.response?.data?.error || 'Something went wrong. Please try again.'
  } finally {
    aiLoading.value = false
  }
}

const addToCartAi = (product: any) => {
  cartStore.addToCart(product)
  Toast.fire({ icon: 'success', title: 'Added to cart!', text: product.name })
}

const addToCart = (product: any) => {
  cartStore.addToCart(product)
  Toast.fire({
    icon: 'success',
    title: 'Added to cart!',
    text: product.name,
  })
}

const goToPage = (page: number) => {
  fetchProducts(page)
  scrollToProducts()
}

const goToSlide = (i: number) => { currentSlide.value = i }
const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length }
const prevSlide = () => { currentSlide.value = currentSlide.value === 0 ? carouselSlides.value.length - 1 : currentSlide.value - 1 }

const updateCountdown = () => {
  const now = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 2)
  end.setHours(12, 45, 30)
  const diff = end.getTime() - now.getTime()
  if (diff > 0) {
    timeLeft.value = {
      Days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      Hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
      Mins: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
      Secs: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0'),
    }
  }
}

const fetchProducts = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, any> = { page, per_page: 12 }
    if (searchQuery.value.trim())   params.search   = searchQuery.value.trim()
    if (selectedCategory.value)     params.category = selectedCategory.value
    if (sortBy.value !== 'newest')  params.sort     = sortBy.value
    else                            params.sort     = 'newest'

    const { data } = await api.get('/products', { params })
    products.value  = data.data || []
    currentPage.value = data.current_page || 1
    totalPages.value  = data.last_page || 1
    totalItems.value  = data.total || 0
  } catch {
    error.value = 'Failed to load products. Please try again.'
    products.value = []
  } finally {
    loading.value = false
  }
}

// Debounce search so we don't spam the API on every keystroke
watch(searchQuery, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    currentPage.value = 1
    fetchProducts(1)
  }, 400)
})

// Category and sort fire immediately
watch(selectedCategory, () => {
  currentPage.value = 1
  fetchProducts(1)
})

watch(sortBy, () => {
  currentPage.value = 1
  fetchProducts(1)
})

const fetchCategoryCounts = async () => {
  try {
    const results = await Promise.all(
      categoryCards.value.map(cat =>
        api.get('/products', { params: { category: cat.name, per_page: 1 } })
      )
    )
    results.forEach((res, i) => {
      categoryCards.value[i].count = res.data.total ?? 0
    })
  } catch {
    // silently fail — counts just stay 0
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategoryCounts()
  carouselInterval = setInterval(nextSlide, 5000)
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})
onUnmounted(() => {
  if (carouselInterval) clearInterval(carouselInterval)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
/* ── Google Fonts ──────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Root Variables ────────────────────────────── */
.home-root {
  --gold: #b8860b;
  --gold-light: #d4a017;
  --gold-pale: #fef3c7;
  --surface: #f8fafc;
  --surface-2: #f1f5f9;
  --surface-3: #e2e8f0;
  --border: rgba(15,23,42,0.08);
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --accent-amber: #d97706;
  background: var(--surface);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

/* ── Hero ──────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(ellipse 80% 60% at 60% 40%, #e0f2fe 0%, #f8fafc 100%);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(184,134,11,0.08), transparent 70%);
  top: -200px; right: -100px;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%);
  bottom: 0; left: -100px;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%);
  top: 40%; left: 40%;
}
.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
  z-index: 1;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 2rem 80px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-slides { position: relative; min-height: 460px; }

.hero-slide {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.slide-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 900;
  line-height: 1.05;
  color: var(--text-primary);
}

.hero-highlight {
  font-style: italic;
  display: block;
}

.hero-desc {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 460px;
  margin-bottom: 2.5rem;
  font-weight: 300;
}

.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

.hero-image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 0;
}

.hero-image {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  height: 380px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  transition: transform 0.6s ease;
}
.hero-image:hover { transform: scale(1.02); }

/* Carousel controls */
.slide-dots {
  display: flex;
  gap: 8px;
  margin-top: 2.5rem;
  padding-left: 2px;
}
.slide-dot {
  height: 3px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  background: rgba(255,255,255,0.2);
  transition: all 0.4s ease;
  width: 24px;
}
.slide-dot.active {
  width: 48px;
  background: var(--gold);
}

.slide-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: white;
  box-shadow: 0 2px 12px rgba(15,23,42,0.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}
.slide-arrow svg { width: 18px; height: 18px; }
.slide-arrow:hover { background: var(--gold-pale); border-color: var(--gold); color: var(--gold); }
.slide-arrow-left { left: -22px; }
.slide-arrow-right { right: -22px; }

.slide-counter {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3;
  font-family: 'DM Sans', sans-serif;
}
.counter-current {
  font-size: 2rem;
  font-weight: 600;
  color: var(--gold);
  line-height: 1;
}
.counter-sep {
  width: 1px;
  height: 28px;
  background: var(--border);
}.counter-total {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Hero slide transition */
.hero-slide-enter-active, .hero-slide-leave-active {
  transition: opacity 0.7s ease, transform 0.7s ease;
  position: absolute;
  width: 100%;
}
.hero-slide-enter-from { opacity: 0; transform: translateX(40px); }
.hero-slide-leave-to { opacity: 0; transform: translateX(-40px); }

/* ── Buttons ───────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: #0f0f17;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(201,168,76,0.45);
}
.btn-primary.small { padding: 10px 20px; font-size: 0.82rem; }
.btn-arrow { width: 16px; height: 16px; transition: transform 0.2s; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }

.btn-ghost {
  padding: 13px 28px;
  border: 1px solid rgba(15,23,42,0.2);
  color: var(--text-primary);
  background: white;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(15,23,42,0.08);
}
.btn-ghost:hover {
  background: var(--surface-2);
  border-color: rgba(15,23,42,0.3);
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  color: var(--gold);
  font-weight: 500;
  font-size: 0.88rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: gap 0.2s;
}
.link-btn svg { width: 16px; height: 16px; }
.link-btn:hover { gap: 10px; }

/* ── Marquee ───────────────────────────────────── */
.marquee-strip {
  background: var(--gold);
  overflow: hidden;
  padding: 10px 0;
}
.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
}
.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #0f0f17;
}
.marquee-dot { font-size: 0.6rem; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── Sections ──────────────────────────────────── */
.section { padding: 80px 0; }
.section-inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.section-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.15;
}

/* ── Categories ────────────────────────────────── */
.categories-section { background: var(--surface-2); }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.4rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  animation: fadeInUp 0.5s ease both;
  animation-delay: var(--delay);
  position: relative;
  overflow: hidden;
}
.cat-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--cat-color);
  opacity: 0;
  transition: opacity 0.2s;
}
.cat-card:hover {
  border-color: var(--cat-color);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
.cat-card:hover::before { opacity: 1; }

.cat-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: var(--surface-3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.cat-card:hover .cat-icon-wrap { transform: scale(1.1) rotate(5deg); }

.cat-info { flex: 1; min-width: 0; }
.cat-name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
.cat-count { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.cat-arrow {
  color: var(--text-muted);
  font-size: 1rem;
  transition: all 0.2s;
  flex-shrink: 0;
}
.cat-card:hover .cat-arrow { color: var(--cat-color); transform: translateX(4px); }

/* ── Flash Sale ────────────────────────────────── */
.flash-banner {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #14532d 100%);
  border-top: 1px solid rgba(201,168,76,0.15);
  border-bottom: 1px solid rgba(201,168,76,0.15);
}

.flash-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.flash-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(201,168,76,0.15);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--gold);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.flash-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}
.flash-title strong { color: var(--gold); }
.flash-sub { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.4rem; }

.flash-countdown { display: flex; gap: 1rem; }
.countdown-block {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  min-width: 70px;
}
.countdown-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
}
.countdown-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-top: 4px;
}

.btn-flash {
  padding: 14px 28px;
  background: var(--gold);
  color: #0f0f17;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 0 30px rgba(201,168,76,0.25);
}
.btn-flash:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(201,168,76,0.45); }

.flash-deco {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.flash-deco-1 {
  width: 400px; height: 400px;
  background: rgba(168,85,247,0.08);
  top: -100px; left: -50px;
}
.flash-deco-2 {
  width: 300px; height: 300px;
  background: rgba(201,168,76,0.08);
  bottom: -80px; right: 100px;
}

/* ── Products ──────────────────────────────────── */
.products-section { background: var(--surface); }

.filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  box-shadow: 0 1px 4px rgba(15,23,42,0.06);
}
.filters-left { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; flex: 1; }
.filters-right { display: flex; align-items: center; gap: 0.75rem; }

.search-wrap { position: relative; }
.search-icon {
  position: absolute;
  left: 10px; top: 50%; transform: translateY(-50%);
  width: 15px; height: 15px;
  color: rgba(255,255,255,0.3);
}
.search-input {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  padding: 8px 14px 8px 32px;
  width: 220px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: var(--gold); }

.filter-select {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: var(--gold); }
.filter-select option { background: white; }

.view-toggle {
  display: flex;
  gap: 2px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
}
.toggle-btn {
  padding: 6px 8px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
}
.toggle-btn svg { width: 15px; height: 15px; }
.toggle-btn.active { background: var(--gold); color: white; }

.active-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0.75rem 0;
}
.af-label { font-size: 0.78rem; color: var(--text-muted); }
.af-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(201,168,76,0.1);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 100px;
  font-size: 0.78rem;
  color: var(--gold);
}
.af-tag button { background: none; border: none; color: var(--gold); cursor: pointer; font-size: 1rem; line-height: 1; }
.af-clear { font-size: 0.78rem; color: var(--text-muted); background: none; border: none; cursor: pointer; text-decoration: underline; }

.products-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 2rem 0 1.5rem;
}
.products-count { font-size: 0.85rem; color: var(--text-muted); padding-bottom: 4px; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* List view */
.products-list { display: flex; flex-direction: column; gap: 1rem; }
.list-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(15,23,42,0.05);
}
.list-card:hover { border-color: var(--gold); transform: translateX(4px); box-shadow: 0 4px 16px rgba(15,23,42,0.1); }
.list-card-img { width: 120px; height: 120px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
.list-card-body { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.list-card-cat { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold); font-weight: 600; }
.list-card-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
.list-card-desc {
  font-size: 0.83rem;
  color: var(--text-muted);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
.list-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
.list-card-price { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }

/* Loading / Error / Empty */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 1.25rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.loader-ring {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 3px solid rgba(201,168,76,0.15);
  border-top-color: var(--gold);
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  gap: 1rem;
  text-align: center;
}
.error-icon { font-size: 2.5rem; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 0.75rem;
  text-align: center;
}
.empty-icon { font-size: 3rem; }
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); }
.empty-sub { font-size: 0.88rem; color: var(--text-muted); }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 3rem;
}
.page-btn {
  min-width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(15,23,42,0.06);
}
.page-btn:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
.page-btn.active { background: var(--gold); border-color: var(--gold); color: white; font-weight: 700; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-btn.nav { font-size: 1rem; }

/* ── Location & Map ──────────────────────────────── */
.location-section {
  position: relative;
  overflow: hidden;
  background: var(--surface-2);
  border-top: 1px solid var(--border);
  padding: 80px 0;
}

.location-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 768px) {
  .location-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.location-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(201,168,76,0.1);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--gold);
  text-transform: uppercase;
  width: fit-content;
}

.location-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.15;
}

.location-sub {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.location-info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.location-info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.location-info-card:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(184,134,11,0.1);
}

.location-info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--gold-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gold);
}

.location-info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.location-info-value {
  font-size: 0.88rem;
  color: var(--text-primary);
  line-height: 1.5;
}

.location-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: #0f0f17;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  width: fit-content;
  margin-top: 0.5rem;
}

.location-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(201,168,76,0.45);
}

/* Map Container */
.location-map-wrap {
  position: relative;
  height: 100%;
  min-height: 400px;
}

.location-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(15,23,42,0.08);
}

.location-map-iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.location-map-overlay {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.location-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: white;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(15,23,42,0.15);
  transition: all 0.2s;
  border: 1px solid var(--border);
}

.location-map-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(15,23,42,0.2);
  border-color: var(--gold);
}

/* Location Orbs */
.location-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.location-orb-1 {
  width: 350px;
  height: 350px;
  background: rgba(184,134,11,0.05);
  top: -100px;
  left: -100px;
}

.location-orb-2 {
  width: 350px;
  height: 350px;
  background: rgba(59,130,246,0.04);
  bottom: -100px;
  right: -50px;
}

/* ── Transitions & Animations ──────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.fade-enter-from { opacity: 0; transform: translateY(12px); }
.fade-leave-to { opacity: 0; transform: translateY(-8px); }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-slide { grid-template-columns: 1fr; gap: 2rem; }
  .hero-image-wrap { display: none; }
  .hero-inner { padding: 100px 2rem 60px; }
  .slide-arrow-left { left: 0; }
  .slide-arrow-right { right: 0; }
}

@media (max-width: 640px) {
  .flash-inner { flex-direction: column; align-items: flex-start; }
  .flash-countdown { flex-wrap: wrap; }
  .categories-grid { grid-template-columns: 1fr 1fr; }
  .filters-bar { flex-direction: column; align-items: stretch; }
  .filters-left { flex-direction: column; }
  .search-input { width: 100%; }
  .newsletter-form { flex-direction: column; }
  .products-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .hero-title { font-size: 2.4rem; }
}
/* ── AI Stylist ────────────────────────────────── */
.ai-section { background: var(--surface-2); }

.ai-header { margin-bottom: 2rem; }
.ai-subtitle { color: var(--text-muted); font-size: 0.95rem; margin-top: 0.4rem; max-width: 500px; }

/* Vibe pill grid */
.vibe-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.vibe-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 100px;
  border: 1.5px solid var(--border);
  background: white;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(15,23,42,0.05);
}
.vibe-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(184,134,11,0.15);
}
.vibe-btn.active {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 16px rgba(184,134,11,0.3);
  transform: translateY(-1px);
}
.vibe-emoji { font-size: 1rem; }
.vibe-label { white-space: nowrap; }

/* Custom input row */
.vibe-custom {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.vibe-input {
  flex: 1;
  padding: 12px 18px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(15,23,42,0.05);
}
.vibe-input::placeholder { color: var(--text-muted); }
.vibe-input:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184,134,11,0.1);
}

.btn-ai {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(15,23,42,0.2);
}
.btn-ai svg { width: 17px; height: 17px; flex-shrink: 0; }
.btn-ai:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  box-shadow: 0 6px 20px rgba(184,134,11,0.35);
  transform: translateY(-1px);
}
.btn-ai:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.ai-spinner {
  width: 17px; height: 17px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

/* Result label */
.ai-result-label {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}
.ai-result-label strong { color: var(--gold); }

/* AI Cards */
.ai-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.ai-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15,23,42,0.06);
  animation: fadeInUp 0.5s ease both;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s;
}
.ai-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(15,23,42,0.1);
  border-color: var(--gold);
}

.ai-card-img-wrap {
  position: relative;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
  background: var(--surface-2);
}
.ai-card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.ai-card:hover .ai-card-img { transform: scale(1.05); }

.ai-rank {
  position: absolute;
  top: 10px; left: 10px;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(184,134,11,0.4);
}

.ai-card-body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ai-card-cat {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}

.ai-card-name {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1.3;
}
.ai-card-name:hover { color: var(--gold); }

/* AI reason chip */
.ai-reason {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  background: #fef9ec;
  border: 1px solid rgba(184,134,11,0.15);
  border-radius: 8px;
  padding: 8px 10px;
  margin: 0.25rem 0;
}
.ai-reason svg {
  width: 14px; height: 14px;
  color: var(--gold);
  flex-shrink: 0;
  margin-top: 2px;
}
.ai-reason p {
  font-size: 0.78rem;
  color: #78580a;
  line-height: 1.5;
  margin: 0;
}

.ai-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--surface-2);
}

.ai-card-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-ai-cart {
  padding: 8px 16px;
  background: #0f172a;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ai-cart:hover {
  background: var(--gold);
  box-shadow: 0 4px 12px rgba(184,134,11,0.3);
  transform: translateY(-1px);
}

/* Skeleton loading */
.ai-results { }
.ai-card.skeleton {
  display: flex;
  flex-direction: column;
  pointer-events: none;
}
.sk-img {
  height: 180px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-body { padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 10px; }
.sk-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-line.short { width: 40%; }
.sk-line.medium { width: 70%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* AI Error */
.ai-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
.ai-error span { font-size: 2.5rem; }

/* Responsive */
@media (max-width: 640px) {
  .vibe-custom { flex-direction: column; }
  .ai-cards { grid-template-columns: 1fr; }
}
</style>