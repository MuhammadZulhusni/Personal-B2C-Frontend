// Business Logic
// These are reusable. You could use useCart() in ProductDetailView, CheckoutView, etc. without copying code.
import { ref, onMounted, onUnmounted } from 'vue'

export function useCarousel(totalSlides: number) {
  const currentSlide = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  const next = () => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
  }

  const prev = () => {
    currentSlide.value = currentSlide.value === 0 ? totalSlides - 1 : currentSlide.value - 1
  }

  const goTo = (i: number) => {
    currentSlide.value = i
  }

  onMounted(() => {
    interval = setInterval(next, 5000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { currentSlide, next, prev, goTo }
}

export function useCountdown() {
  const timeLeft = ref({ Days: '02', Hours: '12', Mins: '45', Secs: '30' })
  let interval: ReturnType<typeof setInterval> | null = null

  const update = () => {
    const now = new Date()
    const end = new Date()
    end.setDate(end.getDate() + 2)
    end.setHours(12, 45, 30)
    const diff = end.getTime() - now.getTime()
    if (diff > 0) {
      timeLeft.value = {
        Days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        Hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        Mins: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        Secs: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0'),
      }
    }
  }

  onMounted(() => {
    update()
    interval = setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { timeLeft }
}