<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled, 'navbar--open': isOpen }">
    <div class="navbar-inner">

      <!-- Brand -->
      <RouterLink to="/" class="brand" @click="isOpen = false">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span class="brand-name">Mini Shop</span>
      </RouterLink>

      <!-- Desktop nav links -->
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>

        <RouterLink
          v-if="authStore.isLoggedIn && !isAdmin"
          to="/orders"
          class="nav-link"
        >My Orders</RouterLink>

        <!-- Cart -->
        <RouterLink to="/cart" class="nav-link cart-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
      </div>

      <!-- Desktop auth section -->
      <div class="nav-auth">
        <!-- Logged in: regular user -->
        <template v-if="authStore.isLoggedIn && !isAdmin">
          <span class="greeting">Hi, {{ authStore.user?.name?.split(' ')[0] }} 👋</span>
          <button class="btn-logout" @click="handleLogout">Logout</button>
        </template>

        <!-- Logged in: admin -->
        <template v-else-if="authStore.isLoggedIn && isAdmin">
          <span class="greeting">Hi, {{ authStore.user?.name?.split(' ')[0] }} 👋</span>
          <RouterLink to="/admin" class="btn-admin">
            Admin Panel
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </RouterLink>
        </template>

        <!-- Guest -->
        <template v-else>
          <RouterLink to="/login" class="btn-login">Login</RouterLink>
          <RouterLink to="/register" class="btn-register">Register</RouterLink>
        </template>
      </div>

      <!-- Mobile right side -->
      <div class="mobile-right">
        <RouterLink to="/cart" class="mobile-cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
        </RouterLink>

        <button class="hamburger" @click="isOpen = !isOpen" :aria-expanded="isOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-show="isOpen" class="mobile-menu">
        <div class="mobile-menu-inner">

          <RouterLink to="/" class="mobile-link" @click="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </RouterLink>

          <RouterLink
            v-if="authStore.isLoggedIn && !isAdmin"
            to="/orders"
            class="mobile-link"
            @click="isOpen = false"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            My Orders
          </RouterLink>

          <div class="mobile-divider"></div>

          <!-- Logged in user -->
          <template v-if="authStore.isLoggedIn && !isAdmin">
            <div class="mobile-user">
              <div class="mobile-avatar">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</div>
              <div>
                <p class="mobile-user-name">{{ authStore.user?.name }}</p>
                <p class="mobile-user-role">Customer</p>
              </div>
            </div>
            <button class="mobile-logout" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Logout
            </button>
          </template>

          <!-- Admin -->
          <template v-else-if="authStore.isLoggedIn && isAdmin">
            <div class="mobile-user">
              <div class="mobile-avatar admin">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</div>
              <div>
                <p class="mobile-user-name">{{ authStore.user?.name }}</p>
                <p class="mobile-user-role admin">Administrator</p>
              </div>
            </div>
            <RouterLink to="/admin" class="mobile-admin-btn" @click="isOpen = false">
              Admin Panel →
            </RouterLink>
            <button class="mobile-logout" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Logout
            </button>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink to="/login" class="mobile-link" @click="isOpen = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              Login
            </RouterLink>
            <RouterLink to="/register" class="mobile-register" @click="isOpen = false">
              Create Account
            </RouterLink>
          </template>

        </div>
      </div>
    </Transition>

    <!-- Mobile backdrop -->
    <Transition name="fade">
      <div v-show="isOpen" class="mobile-backdrop" @click="isOpen = false"></div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const isOpen = ref(false)
const isScrolled = ref(false)

const isAdmin = computed(() => authStore.user?.role === 'admin')

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

/* ── Base navbar ─────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  font-family: 'DM Sans', sans-serif;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #0f172a;
  border-bottom: 1px solid transparent;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

/* When scrolled: fully opaque with shadow */
.navbar--scrolled {
  background: #ffffff;
  color: #0f172a;
  border-color: #e9edf2;
  box-shadow: 0 4px 24px rgba(15,23,42,0.07);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* ── Brand ───────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.brand-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #b8860b, #d4a017);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(184,134,11,0.35);
  flex-shrink: 0;
}
.brand-icon svg { width: 18px; height: 18px; color: #fff; }

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: inherit;
}

/* ── Desktop nav links ───────────────────────────── */
.nav-links {
  display: none;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  margin-left: 1rem;
}

@media (min-width: 768px) {
  .nav-links { display: flex; }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: inherit;
  opacity: 0.85;
  transition: opacity 0.2s, background 0.2s, color 0.2s;
  position: relative;
}

/* On dark (not scrolled) */
.navbar:not(.navbar--scrolled) .nav-link:hover {
  opacity: 1;
  background: #f1f5f9;
  color: #0f172a;
}
.navbar:not(.navbar--scrolled) .nav-link.router-link-active {
  opacity: 1;
  color: #b8860b;
  background: #fef9ec;
}

/* On light (scrolled) */
.navbar--scrolled .nav-link:hover {
  opacity: 1;
  background: #f1f5f9;
  color: #0f172a;
}
.navbar--scrolled .nav-link.router-link-active {
  opacity: 1;
  color: #b8860b;
  background: #fef9ec;
}

/* Cart link */
.cart-link { position: relative; }
.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 100px;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
}

/* ── Auth section ────────────────────────────────── */
.nav-auth {
  display: none;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .nav-auth { display: flex; }
}

.greeting {
  font-size: 0.85rem;
  font-weight: 500;
  color: inherit;
  opacity: 0.8;
  white-space: nowrap;
}

.btn-login {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  color: inherit;
  opacity: 0.85;
  transition: opacity 0.2s, background 0.2s;
}
.btn-login:hover { opacity: 1; background: #f1f5f9; }

.btn-register {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.01em;
  /* Default on dark hero */
  background: linear-gradient(135deg, #b8860b, #d4a017);
  color: white;
  box-shadow: 0 2px 8px rgba(184,134,11,0.3);
}
.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(184,134,11,0.45);
}

/* On scrolled (light bg), register stays gold — already looks great */
.navbar--scrolled .btn-register {
  background: linear-gradient(135deg, #b8860b, #d4a017);
  color: white;
}

.btn-admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  background: #0f172a;
  color: white;
  border: 1px solid #0f172a;
}
.btn-admin svg { width: 14px; height: 14px; transition: transform 0.2s; }
.btn-admin:hover { background: #1e293b; border-color: #1e293b; }
.btn-admin:hover svg { transform: translateX(3px); }

.navbar--scrolled .btn-admin {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
}
.navbar--scrolled .btn-admin:hover {
  background: #1e293b;
  border-color: #1e293b;
}

.btn-logout {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  font-family: 'DM Sans', sans-serif;
}
.btn-logout:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* ── Mobile controls ─────────────────────────────── */
.mobile-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

@media (min-width: 768px) {
  .mobile-right { display: none; }
}

.mobile-cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: 10px;
  color: inherit;
  transition: background 0.2s;
  text-decoration: none;
}
.mobile-cart svg { width: 22px; height: 22px; }
.mobile-cart:hover { background: #f1f5f9; }
.navbar--scrolled .mobile-cart:hover { background: #f1f5f9; }
.mobile-cart .cart-badge {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 16px; height: 16px;
  font-size: 0.6rem;
}

/* Hamburger */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px; height: 40px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  transition: background 0.2s;
}
.hamburger:hover { background: #f1f5f9; }
.navbar--scrolled .hamburger:hover { background: #f1f5f9; }

.hamburger span {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
  transform-origin: center;
}
.hamburger span:nth-child(2) { width: 75%; }

/* Animate to X when open */
.navbar--open .hamburger span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.navbar--open .hamburger span:nth-child(2) {
  opacity: 0; width: 0;
}
.navbar--open .hamburger span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Mobile drawer ───────────────────────────────── */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.4);
  backdrop-filter: blur(2px);
  z-index: 99;
}

.mobile-menu {
  position: fixed;
  top: 68px; right: 0;
  width: 300px;
  max-height: calc(100vh - 68px);
  overflow-y: auto;
  z-index: 100;
  background: white;
  border-left: 1px solid #e9edf2;
  box-shadow: -8px 0 32px rgba(15,23,42,0.12);
}

.mobile-menu-inner {
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.mobile-link svg { width: 18px; height: 18px; opacity: 0.6; flex-shrink: 0; }
.mobile-link:hover { background: #f8fafc; color: #0f172a; }
.mobile-link.router-link-active { background: #fef9ec; color: #b8860b; }
.mobile-link.router-link-active svg { opacity: 1; }

.mobile-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0.5rem 0;
}

.mobile-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.mobile-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a, #334155);
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.mobile-avatar.admin {
  background: linear-gradient(135deg, #b8860b, #d4a017);
}

.mobile-user-name { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
.mobile-user-role { font-size: 0.75rem; color: #64748b; margin-top: 1px; }
.mobile-user-role.admin { color: #b8860b; font-weight: 600; }

.mobile-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: none;
  background: #fef2f2;
  color: #dc2626;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  margin-top: 0.25rem;
}
.mobile-logout svg { width: 17px; height: 17px; opacity: 0.7; }
.mobile-logout:hover { background: #fee2e2; }

.mobile-admin-btn {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  background: #0f172a;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  margin-bottom: 0.25rem;
  transition: background 0.2s;
}
.mobile-admin-btn:hover { background: #1e293b; }

.mobile-register {
  display: block;
  padding: 13px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #b8860b, #d4a017);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 2px 10px rgba(184,134,11,0.3);
  transition: box-shadow 0.2s, transform 0.2s;
  margin-top: 0.25rem;
}
.mobile-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(184,134,11,0.4);
}

/* ── Transitions ─────────────────────────────────── */
.drawer-enter-active { transition: transform 0.3s cubic-bezier(.22,.68,0,1.1), opacity 0.25s ease; }
.drawer-leave-active { transition: transform 0.25s ease, opacity 0.2s ease; }
.drawer-enter-from { transform: translateX(100%); opacity: 0; }
.drawer-leave-to   { transform: translateX(100%); opacity: 0; }

.fade-enter-active { transition: opacity 0.25s ease; }
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Body offset ─────────────────────────────────── */
:global(body) { padding-top: 68px; }
</style>