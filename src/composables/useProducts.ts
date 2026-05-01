// Business Logic
// These are reusable. You could use useCart() in ProductDetailView, CheckoutView, etc. without copying code.
import { ref, computed, watch } from 'vue' 
import api from '@/api'
import { categoryCards } from '@/data/homeData'

export function useProducts() {
  const products = ref<any[]>([])
  const loading = ref(true)
  const error = ref('')
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('newest')
  const viewMode = ref<'grid' | 'list'>('grid')
  let searchDebounce: any = null

  const filteredProducts = computed(() => products.value)
  const paginatedProducts = computed(() => products.value)

  const visiblePages = computed(() => {
    const pages: number[] = []
    const max = 5
    let start = Math.max(1, currentPage.value - Math.floor(max / 2))
    let end = Math.min(totalPages.value, start + max - 1)
    if (end - start + 1 < max) start = Math.max(1, end - max + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  })

  const fetchProducts = async (page = 1) => {
    loading.value = true
    error.value = ''
    try {
      const params: Record<string, any> = { page, per_page: 12 }
      if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
      if (selectedCategory.value) params.category = selectedCategory.value
      if (sortBy.value !== 'newest') params.sort = sortBy.value
      else params.sort = 'newest'

      const { data } = await api.get('/products', { params })
      products.value = data.data || []
      currentPage.value = data.current_page || 1
      totalPages.value = data.last_page || 1
      totalItems.value = data.total || 0
    } catch {
      error.value = 'Failed to load products. Please try again.'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  const filterByCategory = (cat: string) => {
    selectedCategory.value = cat
    currentPage.value = 1
    fetchProducts(1)
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    sortBy.value = 'newest'
    currentPage.value = 1
    fetchProducts(1)
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      fetchProducts(page)
    }
  }

  const fetchCategoryCounts = async () => {
    try {
      const results = await Promise.all(
        categoryCards.map(cat =>
          api.get('/products', { params: { category: cat.name, per_page: 1 } })
        )
      )
      results.forEach((res, i) => {
        categoryCards[i].count = res.data.total ?? 0
      })
    } catch {
      // silently fail
    }
  }

  // Watchers
  watch(searchQuery, () => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      currentPage.value = 1
      fetchProducts(1)
    }, 400)
  })

  watch(selectedCategory, () => {
    currentPage.value = 1
    fetchProducts(1)
  })

  watch(sortBy, () => {
    currentPage.value = 1
    fetchProducts(1)
  })

  return {
    products, loading, error, currentPage, totalPages, totalItems,
    searchQuery, selectedCategory, sortBy, viewMode,
    filteredProducts, paginatedProducts, visiblePages,
    fetchProducts, filterByCategory, clearFilters, goToPage, fetchCategoryCounts
  }
}