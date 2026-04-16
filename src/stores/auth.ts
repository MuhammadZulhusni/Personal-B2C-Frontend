import { defineStore } from 'pinia'
import api from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as null | { id: number; name: string; email: string; role: string },
    token: localStorage.getItem('token') || null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      const { data } = await api.post('/login', credentials)
      this.token = data.token
      this.user  = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user)) // 👈 add this
    },
    async register(credentials: { name: string; email: string; password: string; password_confirmation: string }) {
      const { data } = await api.post('/register', credentials)
      this.token = data.token
      this.user  = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user)) // 👈 add this
    },
    logout() {
      this.token = null
      this.user  = null
      localStorage.removeItem('token')
      localStorage.removeItem('user') // 👈 add this
    }
  }
})