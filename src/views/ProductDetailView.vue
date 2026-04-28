<template>
  <div class="detail-root">

    <!-- Back -->
    <div class="back-bar">
      <div class="back-inner">
        <button @click="router.back()" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Products
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-wrap">
      <div class="loader-ring"></div>
      <p class="state-text">Loading product details...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-wrap">
      <span class="state-icon">⚠</span>
      <p class="state-text error">{{ error }}</p>
      <button class="btn-primary" @click="router.push('/')">Browse Products</button>
    </div>

    <!-- Product -->
    <div v-else-if="product" class="detail-inner">

      <!-- LEFT: Image column -->
      <div class="img-col">
        <div class="img-frame">
          <img
            :src="product.image || 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image'"
            :alt="product.name"
            class="main-img"
            @error="handleImageError"
          />

          <!-- Stock ribbon -->
          <div class="stock-ribbon" :class="stockClass">
            <span class="ribbon-dot"></span>
            {{ stockLabel }}
          </div>

          <!-- Decorative corner accent -->
          <div class="img-corner"></div>
        </div>

        <!-- Trust badges -->
        <div class="trust-row">
          <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            <span>Free shipping over RM100</span>
          </div>
          <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Secure payment</span>
          </div>
          <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Easy returns</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: Info column -->
      <div class="info-col">

        <!-- Eyebrow: category -->
        <p class="eyebrow">{{ product.category || 'Uncategorized' }}</p>

        <!-- Name -->
        <h1 class="product-name">{{ product.name }}</h1>

        <!-- Price -->
        <div class="price-row">
          <span class="price-label">Price</span>
          <span class="price-value">RM {{ formatPrice(product.price) }}</span>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Description -->
        <div class="desc-block">
          <p class="desc-heading">About this product</p>
          <p class="desc-text">{{ product.description || 'No description available.' }}</p>
        </div>

        <!-- Stock indicator -->
        <div class="stock-row">
          <div class="stock-bar-wrap">
            <div class="stock-bar" :style="{ width: stockBarWidth }"></div>
          </div>
          <span class="stock-text" :class="stockClass">
            {{ getStock() > 0 ? `${getStock()} units available` : 'Currently out of stock' }}
          </span>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Quantity -->
        <div v-if="getStock() > 0" class="qty-block">
          <p class="qty-label">Quantity</p>
          <div class="qty-row">
            <button class="qty-btn" :disabled="qty <= 1" @click="qty > 1 && qty--">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
            </button>
            <span class="qty-num">{{ qty }}</span>
            <button class="qty-btn" :disabled="qty >= getStock()" @click="qty < getStock() && qty++">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </button>
            <span class="qty-total">= <strong>RM {{ formatPrice(product.price * qty) }}</strong></span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="cta-row">
          <button
            class="btn-cart"
            :class="{ added: justAdded }"
            :disabled="getStock() === 0 || justAdded"
            @click="addToCart"
          >
            <svg v-if="!justAdded" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            {{ justAdded ? 'Added to Cart!' : getStock() === 0 ? 'Out of Stock' : 'Add to Cart' }}
          </button>

          <button
            class="btn-buynow"
            :disabled="getStock() === 0"
            @click="buyNow"
          >
            Buy Now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        <!-- Product meta tags -->
        <div class="meta-tags">
          <span class="meta-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            {{ product.category || 'General' }}
          </span>
          <span class="meta-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            ID #{{ product.id }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const route     = useRoute()
const router    = useRouter()
const cartStore = useCartStore()

const product   = ref<any>(null)
const loading   = ref(true)
const error     = ref('')
const qty       = ref(1)
const justAdded = ref(false)

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

const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : Number(price)
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const getStock = (): number => {
  if (!product.value) return 0
  return product.value.stock ?? product.value.quantity ?? 0
}

const stockLabel = computed(() => {
  const s = getStock()
  if (s > 10) return 'In Stock'
  if (s > 0)  return 'Low Stock'
  return 'Out of Stock'
})

const stockClass = computed(() => {
  const s = getStock()
  if (s > 10) return 'in-stock'
  if (s > 0)  return 'low-stock'
  return 'no-stock'
})

const stockBarWidth = computed(() => {
  const s = getStock()
  if (s <= 0)  return '0%'
  if (s >= 50) return '100%'
  return `${(s / 50) * 100}%`
})

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/f1f5f9/94a3b8?text=No+Image'
}

const fetchProduct = async () => {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await api.get(`/products/${route.params.id}`)
    product.value = data.data ?? data.product ?? data
    const stock = getStock()
    if (qty.value > stock && stock > 0) qty.value = 1
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Product not found or unavailable.'
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!product.value || getStock() === 0 || justAdded.value) return
  for (let i = 0; i < qty.value; i++) cartStore.addToCart(product.value)
  justAdded.value = true
  Toast.fire({
    icon: 'success',
    title: 'Added to cart!',
    text: `${qty.value} × ${product.value.name}`,
  })
  setTimeout(() => { justAdded.value = false }, 2200)
}

const buyNow = () => {
  if (!product.value || getStock() === 0) return
  for (let i = 0; i < qty.value; i++) cartStore.addToCart(product.value)
  router.push('/cart')
}

onMounted(fetchProduct)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Root ────────────────────────────────────────── */
.detail-root {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
}

/* ── Back bar ────────────────────────────────────── */
.back-bar {
  border-bottom: 1px solid #e9edf2;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 68px;
  z-index: 10;
}
.back-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s, gap 0.2s;
  padding: 4px 0;
}
.back-btn svg { width: 16px; height: 16px; transition: transform 0.2s; }
.back-btn:hover { color: #0f172a; gap: 12px; }
.back-btn:hover svg { transform: translateX(-3px); }

/* ── States ──────────────────────────────────────── */
.state-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: 1.25rem;
  text-align: center;
}
.loader-ring {
  width: 52px; height: 52px;
  border-radius: 50%;
  border: 3px solid rgba(184,134,11,0.15);
  border-top-color: #b8860b;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-text { font-size: 0.95rem; color: #64748b; }
.state-text.error { color: #dc2626; font-weight: 500; }
.state-icon { font-size: 3rem; }

/* ── Main layout ─────────────────────────────────── */
.detail-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* ── Image column ────────────────────────────────── */
.img-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 120px;
}

.img-frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid #e9edf2;
  box-shadow: 0 8px 40px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04);
}

.main-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}
.img-frame:hover .main-img { transform: scale(1.03); }

/* Stock ribbon */
.stock-ribbon {
  position: absolute;
  top: 16px; left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}
.ribbon-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.8;
}
.in-stock  { background: rgba(240,253,244,0.92); color: #16a34a; border: 1px solid rgba(22,163,74,0.2); }
.low-stock { background: rgba(255,251,235,0.92); color: #d97706; border: 1px solid rgba(217,119,6,0.2); }
.no-stock  { background: rgba(254,242,242,0.92); color: #dc2626; border: 1px solid rgba(220,38,38,0.2); }

/* Decorative corner */
.img-corner {
  position: absolute;
  bottom: 0; right: 0;
  width: 60px; height: 60px;
  background: linear-gradient(135deg, transparent 50%, rgba(184,134,11,0.12) 50%);
  pointer-events: none;
}

/* Trust badges */
.trust-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.trust-item {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e9edf2;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #475569;
  font-weight: 500;
}
.trust-item svg { width: 16px; height: 16px; color: #b8860b; flex-shrink: 0; }

/* ── Info column ─────────────────────────────────── */
.info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b8860b;
}

.product-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  line-height: 1.1;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: -0.5rem 0 0;
}

/* Price */
.price-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}
.price-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}
.price-value {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, #e9edf2, transparent);
}

/* Description */
.desc-block { display: flex; flex-direction: column; gap: 0.5rem; }
.desc-heading {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}
.desc-text {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.75;
  font-weight: 300;
}

/* Stock bar */
.stock-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stock-bar-wrap {
  height: 4px;
  background: #e9edf2;
  border-radius: 2px;
  overflow: hidden;
}
.stock-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(to right, #b8860b, #d4a017);
  transition: width 0.8s ease;
}
.stock-text {
  font-size: 0.8rem;
  font-weight: 600;
}
.stock-text.in-stock  { color: #16a34a; }
.stock-text.low-stock { color: #d97706; }
.stock-text.no-stock  { color: #dc2626; }

/* Quantity */
.qty-block { display: flex; flex-direction: column; gap: 0.75rem; }
.qty-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}
.qty-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.qty-btn {
  width: 38px; height: 38px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #0f172a;
  transition: all 0.2s;
  flex-shrink: 0;
}
.qty-btn svg { width: 16px; height: 16px; }
.qty-btn:hover:not(:disabled) {
  border-color: #b8860b;
  background: #fef9ec;
  color: #b8860b;
}
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  min-width: 2.5rem;
  text-align: center;
  line-height: 1;
}
.qty-total {
  font-size: 0.88rem;
  color: #64748b;
  margin-left: 0.5rem;
}
.qty-total strong { color: #0f172a; font-weight: 700; }

/* CTA buttons */
.cta-row {
  display: flex;
  gap: 0.875rem;
}

.btn-cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 15px 24px;
  background: #0f172a;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 16px rgba(15,23,42,0.18);
}
.btn-cart svg { width: 18px; height: 18px; flex-shrink: 0; }
.btn-cart:hover:not(:disabled) {
  background: #b8860b;
  box-shadow: 0 6px 24px rgba(184,134,11,0.35);
  transform: translateY(-1px);
}
.btn-cart.added {
  background: #059669;
  box-shadow: 0 4px 16px rgba(5,150,105,0.3);
}
.btn-cart:disabled:not(.added) {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-buynow {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 15px 24px;
  background: transparent;
  color: #0f172a;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  border: 1.5px solid #0f172a;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.btn-buynow svg { width: 16px; height: 16px; transition: transform 0.2s; }
.btn-buynow:hover:not(:disabled) {
  background: #0f172a;
  color: white;
}
.btn-buynow:hover:not(:disabled) svg { transform: translateX(3px); }
.btn-buynow:disabled {
  border-color: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Meta tags */
.meta-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: #f8fafc;
  border: 1px solid #e9edf2;
  border-radius: 100px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}
.meta-tag svg { width: 13px; height: 13px; }

/* ── Buttons (general) ───────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #b8860b, #d4a017);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(184,134,11,0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184,134,11,0.4);
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 1024px) {
  .detail-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2rem 1.5rem 4rem;
  }
  .img-col { position: static; }
}

@media (max-width: 640px) {
  .back-inner { padding: 0.75rem 1rem; }
  .cta-row { flex-direction: column; }
  .trust-row { gap: 0.5rem; }
  .trust-item { font-size: 0.7rem; }
  .product-name { font-size: 1.8rem; }
  .price-value { font-size: 2rem; }
}
</style>