import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[],
  }),
  getters: {
    totalItems:  (state) => state.items.reduce((n, i) => n + i.quantity, 0),
    totalAmount: (state) => state.items.reduce((n, i) => n + i.price * i.quantity, 0),
  },
  actions: {
    addToCart(product: CartItem) {
      const existing = this.items.find(i => i.id === product.id)
      existing ? existing.quantity++ : this.items.push({ ...product, quantity: 1 })
      this._persist()
    },
    increaseItem(productId: number) {
      const item = this.items.find(i => i.id === productId)
      if (item) item.quantity++
      this._persist()
    },
    decreaseItem(productId: number) {
      const item = this.items.find(i => i.id === productId)
      if (item && item.quantity > 1) item.quantity--
      else this.removeItem(productId)
      this._persist()
    },
    removeItem(productId: number) {
      this.items = this.items.filter(i => i.id !== productId)
      this._persist()
    },
    clearCart() {
      this.items = []
      localStorage.removeItem('cart')
    },
    _persist() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})