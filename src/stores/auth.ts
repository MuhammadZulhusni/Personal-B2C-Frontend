import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string | null
  avatar_url?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isInitialized = ref(false) // Add this

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 🔥 CRITICAL: Initialize auth state on app start
  async function initialize() {
    if (token.value && !user.value) {
      try {
        const { data } = await api.get('/user')
        user.value = data as User
      } catch (error) {
        // Token expired or invalid
        token.value = null
        user.value = null
        localStorage.removeItem('token')
      }
    }
    isInitialized.value = true
  }

  async function login(credentials: { email: string; password: string }) {
    try {
      const { data } = await api.post('/login', credentials)
      token.value = data.token
      user.value = data.user as User
      localStorage.setItem('token', data.token)
    } catch (error) {
      // Re-throw so the LoginView can catch it
      throw error
    }
  }

  async function register(formData: any) {
    const { data } = await api.post('/register', formData)
    token.value = data.token
    user.value = data.user as User
    localStorage.setItem('token', data.token)
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const { data } = await api.get('/user')
      user.value = data as User
    } catch {
      logout()
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore
    }
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  function updateUser(userData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    isInitialized,
    initialize,
    login,
    register,
    logout,
    fetchUser,
    updateUser,
  }
})