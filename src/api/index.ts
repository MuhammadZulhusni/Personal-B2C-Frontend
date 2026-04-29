import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  },
})

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Don't set Content-Type for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  
  return config
})

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // CRITICAL FIX: Don't redirect on login, register, or forgot-password requests
    const publicEndpoints = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-reset-token', '/user']
    const isPublicEndpoint = publicEndpoints.some(endpoint => error.config.url?.includes(endpoint))
    
    if (error.response?.status === 401 && !isPublicEndpoint) {
      localStorage.removeItem('token')
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Always reject so components can handle errors
    return Promise.reject(error)
  }
)

export default api