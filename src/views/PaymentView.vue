<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Complete Your Payment</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      <p class="text-slate-500 mt-4">Loading payment options...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-red-600 font-medium mb-3">{{ error }}</p>
      <button 
        @click="router.push('/cart')"
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
      >
        Back to Cart
      </button>
    </div>

    <!-- Payment Form - Only show if order exists -->
    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Payment Methods -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Select Payment Method</h3>
          
          <div v-if="paymentMethods.length === 0" class="text-center py-8 text-slate-500">
            No payment methods available
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              @click="selectedMethod = method.id"
              :class="[
                'border-2 rounded-lg p-4 cursor-pointer transition-all',
                selectedMethod === method.id 
                  ? 'border-slate-800 bg-slate-50' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="method.id === 'card'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      <path v-else-if="method.id === 'bank_transfer'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">{{ method.name }}</p>
                    <p class="text-sm text-slate-500">{{ method.description }}</p>
                  </div>
                </div>
                <div 
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedMethod === method.id ? 'border-slate-800' : 'border-gray-300'
                  ]"
                >
                  <div 
                    v-if="selectedMethod === method.id"
                    class="w-3 h-3 bg-slate-800 rounded-full"
                  ></div>
                </div>
              </div>

              <!-- Bank Transfer Details -->
              <div v-if="selectedMethod === method.id && method.bank_details" class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm font-medium text-slate-700 mb-2">Bank Transfer Details:</p>
                <div class="space-y-1 text-sm text-slate-600">
                  <p><span class="font-medium">Bank:</span> {{ method.bank_details.bank_name }}</p>
                  <p><span class="font-medium">Account Number:</span> {{ method.bank_details.account_number }}</p>
                  <p><span class="font-medium">Account Name:</span> {{ method.bank_details.account_name }}</p>
                </div>
              </div>

              <!-- COD Extra Fee -->
              <div v-if="selectedMethod === method.id && method.extra_fee" class="mt-4">
                <p class="text-sm text-amber-600">
                  Additional fee: RM {{ method.extra_fee.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm text-slate-600">
              <span>Order ID:</span>
              <span class="font-medium">#{{ order.id }}</span>
            </div>
            
            <div class="flex justify-between text-sm text-slate-600">
              <span>Total Items:</span>
              <span>{{ order.items?.length || 0 }}</span>
            </div>
            
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between font-bold text-slate-800">
                <span>Total Amount:</span>
                <span>RM {{ formatPrice(order.total_amount) }}</span>
              </div>
            </div>
          </div>

          <button 
            @click="processPayment"
            :disabled="!selectedMethod || processing"
            class="w-full mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="processing" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ selectedMethod === 'bank_transfer' ? 'Confirm Payment' : 'Pay Now' }}
            </span>
          </button>

          <p class="text-xs text-slate-400 text-center mt-4">
            This is a demo payment system.
          </p>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-8 max-w-md text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
        <p class="text-slate-500 mb-6">Your order has been confirmed.</p>
        <div class="space-y-2">
          <button 
            @click="goToOrders"
            class="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            View My Orders
          </button>
          <button 
            @click="goToHome"
            class="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  processing_time: string
  bank_details?: {
    bank_name: string
    account_number: string
    account_name: string
  }
  extra_fee?: number
}

interface Order {
  id: number
  total_amount: number
  items: Array<{
    id: number
    price: number
    quantity: number
  }>
}

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId as string
const order = ref<Order | null>(null)
const paymentMethods = ref<PaymentMethod[]>([])
const selectedMethod = ref('')
const loading = ref(true)
const error = ref('')
const processing = ref(false)
const showSuccess = ref(false)

const formatPrice = (price: any): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
}

const fetchOrder = async () => {
  try {
    const { data } = await api.get(`/orders/${orderId}`)
    order.value = data
  } catch (err: any) {
    console.error('Failed to fetch order:', err)
    error.value = 'Failed to load order details. Please try again.'
    throw err
  }
}

const fetchPaymentMethods = async () => {
  try {
    const { data } = await api.get('/payment/methods')
    paymentMethods.value = data.methods
  } catch (err: any) {
    console.error('Failed to fetch payment methods:', err)
    // Use fallback methods
    paymentMethods.value = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: 'credit-card',
        description: 'Pay securely with your card',
        processing_time: 'Instant',
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        icon: 'cash',
        description: 'Pay when you receive your order',
        processing_time: 'On delivery',
        extra_fee: 5.00,
      }
    ]
  }
}

const processPayment = async () => {
  if (!selectedMethod.value || !order.value) return
  
  processing.value = true
  
  try {
    const { data } = await api.post('/payment/process', {
      order_id: order.value.id,
      payment_method: selectedMethod.value
    })
    
    if (data.success) {
      showSuccess.value = true
    } else {
      alert('Payment failed. Please try again.')
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Payment processing failed')
  } finally {
    processing.value = false
  }
}

const goToOrders = () => {
  router.push('/orders')
}

const goToHome = () => {
  router.push('/')
}

onMounted(async () => {
  if (!orderId) {
    error.value = 'No order ID provided'
    loading.value = false
    return
  }
  
  try {
    await Promise.all([fetchOrder(), fetchPaymentMethods()])
  } catch (err) {
    // Error already set in fetchOrder
  } finally {
    loading.value = false
  }
})
</script>