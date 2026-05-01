// Business Logic
// These are reusable. You could use useCart() in ProductDetailView, CheckoutView, etc. without copying code.
import { ref } from 'vue'
import api from '@/api'
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export function useAiStylist() {
  const cartStore = useCartStore()
  const selectedVibe = ref('')
  const customVibe = ref('')
  const aiLoading = ref(false)
  const aiError = ref('')
  const aiResults = ref<any[]>([])
  const aiCurrentVibe = ref('')

  const selectVibe = (label: string) => {
    selectedVibe.value = selectedVibe.value === label ? '' : label
    customVibe.value = ''
  }

  const runAiSuggest = async () => {
    const vibe = customVibe.value.trim() || selectedVibe.value
    if (!vibe || aiLoading.value) return

    aiLoading.value = true
    aiError.value = ''
    aiResults.value = []
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

  const onAiImgError = (e: Event) => {
    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f1f5f9/94a3b8?text=No+Image'
  }

  return {
    selectedVibe, customVibe, aiLoading, aiError, aiResults, aiCurrentVibe,
    selectVibe, runAiSuggest, addToCartAi, onAiImgError
  }
}

export function useCart() {
  const cartStore = useCartStore()

  const addToCart = (product: any) => {
    cartStore.addToCart(product)
    Toast.fire({ icon: 'success', title: 'Added to cart!', text: product.name })
  }

  return { addToCart }
}