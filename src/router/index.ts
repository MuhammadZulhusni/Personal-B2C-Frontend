import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public Routes
  { 
    path: '/',              
    name: 'home',
    component: () => import('@/views/HomeView.vue') 
  },
  { 
    path: '/products/:id',  
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue') 
  },
  { 
    path: '/cart',          
    name: 'cart',
    component: () => import('@/views/CartView.vue') 
  },
  
  // Auth Required Routes
  { 
    path: '/checkout',      
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/orders',        
    name: 'orders',
    component: () => import('@/views/OrderHistoryView.vue'), 
    meta: { requiresAuth: true } 
  },
  {
    path: '/payment/:orderId',
    name: 'payment',
    component: () => import('@/views/PaymentView.vue'),
    meta: { requiresAuth: true }
  },
  
  // Guest Routes (redirect if already logged in)
  { 
    path: '/login',         
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true }
  },
  { 
    path: '/register',      
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guest: true }
  },
  { 
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { guest: true }
  },
  { 
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPasswordView.vue'),
    meta: { guest: true }
  },

  // Admin Routes
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '', 
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboard.vue')
      },
      { 
        path: 'products',   
        name: 'admin-products',
        component: () => import('@/views/admin/AdminProductsView.vue') 
      },
      { 
        path: 'orders',     
        name: 'admin-orders',
        component: () => import('@/views/admin/AdminOrdersView.vue') 
      },
      { 
        path: 'analytics',     
        name: 'admin-analytics',
        component: () => import('@/views/admin/AdminAnalyticsView.vue') 
      },
      { 
        path: 'finance',     
        name: 'admin-finance',
        component: () => import('@/views/admin/AdminFinanceView.vue') 
      },
      { 
        path: 'profile',     
        name: 'admin-profile',
        component: () => import('@/views/admin/AdminProfileView.vue') 
      },
    ]
  },

  // 404 Catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guard
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize if not yet done
  if (!authStore.isInitialized) {
    await authStore.initialize()
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  // Check if route requires admin role
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return { name: 'home' }
  }
  
  // Redirect logged-in users away from guest routes
  if (to.meta.guest && authStore.isLoggedIn) {
    return { name: 'home' }
  }
  
  return true
})

export default router