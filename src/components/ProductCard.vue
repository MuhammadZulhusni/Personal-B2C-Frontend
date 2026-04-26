<template>
  <article class="product-card" :class="{ 'is-added': justAdded, 'out-of-stock': product.stock === 0 }">

    <!-- Image area -->
    <div class="card-image-wrap" @click="router.push(`/products/${product.id}`)">
      <img
        :src="product.image"
        :alt="product.name"
        class="card-image"
        @error="onImgError"
      />

      <!-- Overlays -->
      <div class="card-image-overlay"></div>

      <!-- Stock badge -->
      <span v-if="product.stock === 0" class="stock-badge out">Out of Stock</span>
      <span v-else-if="product.stock <= 10" class="stock-badge low">Only {{ product.stock }} left</span>

      <!-- Quick-view hover action -->
      <div class="quick-view">
        <span>Quick View</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">

      <!-- Category tag if available -->
      <span v-if="product.category" class="card-category">{{ product.category }}</span>

      <h3 class="card-name" @click="router.push(`/products/${product.id}`)">
        {{ product.name }}
      </h3>

      <p class="card-desc">{{ product.description }}</p>

      <!-- Price row -->
      <div class="card-footer">
        <div class="card-price-wrap">
          <span class="card-price">RM {{ formatPrice(product.price) }}</span>
        </div>

        <div class="card-actions">
          <button
            class="btn-details"
            @click="router.push(`/products/${product.id}`)"
            aria-label="View details"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>

          <button
            class="btn-cart"
            :class="{ added: justAdded }"
            :disabled="product.stock === 0 || justAdded"
            @click="addToCart"
            :aria-label="justAdded ? 'Added!' : 'Add to cart'"
          >
            <!-- Default icon -->
            <svg v-if="!justAdded" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <!-- Check icon after add -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ justAdded ? 'Added!' : product.stock === 0 ? 'Sold Out' : 'Add' }}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- Added ripple -->
    <div v-if="justAdded" class="add-ripple"></div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const props = defineProps<{
  product: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    image: string
    category?: string
  }
}>()

const router    = useRouter()
const cartStore = useCartStore()
const justAdded = ref(false)

const formatPrice = (price: any): string => {
  const n = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f1f5f9/94a3b8?text=No+Image'
}

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

const addToCart = () => {
  if (props.product.stock === 0 || justAdded.value) return
  cartStore.addToCart(props.product)
  justAdded.value = true
  Toast.fire({
    icon: 'success',
    title: 'Added to cart!',
    text: props.product.name,
  })
  setTimeout(() => { justAdded.value = false }, 2200)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Card shell ──────────────────────────────────── */
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e9edf2;
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(.22,.68,0,1.2),
              box-shadow 0.28s ease,
              border-color 0.2s ease;
  font-family: 'DM Sans', sans-serif;
  cursor: default;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(15,23,42,0.11), 0 4px 12px rgba(15,23,42,0.06);
  border-color: #d4a017;
}

.product-card.out-of-stock {
  opacity: 0.72;
}

/* ── Image ───────────────────────────────────────── */
.card-image-wrap {
  position: relative;
  height: 210px;
  overflow: hidden;
  cursor: pointer;
  background: #f8fafc;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(.22,.68,0,1.1);
  display: block;
}

.product-card:hover .card-image {
  transform: scale(1.06);
}

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(15,23,42,0.18) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.product-card:hover .card-image-overlay { opacity: 1; }

/* Stock badges */
.stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}
.stock-badge.out {
  background: rgba(239,68,68,0.9);
  color: white;
}
.stock-badge.low {
  background: rgba(245,158,11,0.9);
  color: white;
}

/* Quick view hover */
.quick-view {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 0.04em;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(15,23,42,0.15);
}
.quick-view svg { width: 14px; height: 14px; }
.product-card:hover .quick-view {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Body ────────────────────────────────────────── */
.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.1rem 1.25rem 1.25rem;
  gap: 0.35rem;
}

.card-category {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #b8860b;
  margin-bottom: 0.1rem;
}

.card-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-name:hover { color: #b8860b; }

.card-desc {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  margin-top: 0.15rem;
}

/* ── Footer ──────────────────────────────────────── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
}

.card-price-wrap { display: flex; flex-direction: column; }

.card-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

/* ── Buttons ─────────────────────────────────────── */
.card-actions { display: flex; align-items: center; gap: 0.5rem; }

.btn-details {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.btn-details svg { width: 16px; height: 16px; }
.btn-details:hover {
  border-color: #b8860b;
  color: #b8860b;
  background: #fef9ec;
  transform: translateX(2px);
}

.btn-cart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #0f172a;
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.18s ease;
  white-space: nowrap;
  letter-spacing: 0.02em;
}
.btn-cart svg { width: 15px; height: 15px; flex-shrink: 0; }

.btn-cart:hover:not(:disabled) {
  background: #b8860b;
  box-shadow: 0 4px 16px rgba(184,134,11,0.35);
  transform: translateY(-1px);
}

.btn-cart.added {
  background: #059669;
  box-shadow: 0 4px 16px rgba(5,150,105,0.3);
  animation: cartBounce 0.4s cubic-bezier(.22,.68,0,1.4);
}

.btn-cart:disabled:not(.added) {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Ripple ──────────────────────────────────────── */
.add-ripple {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border: 2px solid #059669;
  animation: rippleOut 0.6s ease forwards;
  pointer-events: none;
}

/* ── Animations ──────────────────────────────────── */
@keyframes cartBounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.92); }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}

@keyframes rippleOut {
  0%   { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0;   transform: scale(1.04); }
}
</style>