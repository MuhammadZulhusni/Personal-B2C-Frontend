<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-slate-800">Reset Password</h1>
        <p class="text-slate-500 mt-2">Create a new password for your account</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div v-if="tokenInvalid" class="text-center">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-semibold text-slate-800 mb-2">Invalid or Expired Link</h3>
          <p class="text-slate-500 mb-6">This password reset link is invalid or has expired.</p>
          <RouterLink to="/forgot-password" class="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
            Request New Link
          </RouterLink>
        </div>

        <div v-else>
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-green-800">Password reset successful!</p>
                <p class="text-xs text-green-700 mt-1">Redirecting to login page...</p>
              </div>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-red-700">{{ error }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                :value="email" 
                type="email" 
                readonly 
                :disabled="loading || success"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div class="relative">
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  :disabled="loading || success"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  :disabled="loading || success"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                v-model="form.password_confirmation" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                :disabled="loading || success"
                class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                :class="passwordMismatch ? 'border-red-300' : 'border-gray-300'"
              />
              <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">Passwords do not match</p>
            </div>

            <button 
              type="submit"
              :disabled="loading || success || passwordMismatch"
              class="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const tokenInvalid = ref(false)

const form = ref({
  password: '',
  password_confirmation: ''
})

const passwordMismatch = computed(() => {
  return form.value.password && form.value.password_confirmation && 
         form.value.password !== form.value.password_confirmation
})

const verifyToken = async () => {
  try {
    await api.get('/verify-reset-token', {
      params: { email: email.value, token: token.value }
    })
    tokenInvalid.value = false
  } catch (e) {
    tokenInvalid.value = true
  }
}

const handleSubmit = async () => {
  if (passwordMismatch.value) {
    error.value = 'Passwords do not match'
    return
  }

  error.value = ''
  loading.value = true

  try {
    await api.post('/reset-password', {
      email: email.value,
      token: token.value,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    })

    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  token.value = route.query.token as string
  email.value = route.query.email as string

  if (!token.value || !email.value) {
    tokenInvalid.value = true
  } else {
    verifyToken()
  }
})
</script>