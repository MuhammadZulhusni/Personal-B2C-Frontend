// Static data 
// This data never changes. Separating it means can update slide images, categories, or location info without touching the main component.
export const carouselSlides = [
  {
    id: 1,
    badge: 'Limited Time Offer',
    badgeBg: 'rgba(251,191,36,0.15)',
    badgeColor: '#fbbf24',
    title: 'Shop the Latest',
    highlight: 'Trends & Styles',
    accentColor: '#f59e0b',
    description: 'Discover our curated collection of premium products at unbeatable prices. Free shipping on orders over RM 100.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=500&fit=crop'
  },
  {
    id: 2,
    badge: 'New Arrivals',
    badgeBg: 'rgba(59,130,246,0.15)',
    badgeColor: '#60a5fa',
    title: 'Summer Collection',
    highlight: 'Now Available',
    accentColor: '#3b82f6',
    description: 'Get ready for summer with our latest collection. Up to 30% off on selected items.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&h=500&fit=crop'
  },
  {
    id: 3,
    badge: 'Exclusive Deal',
    badgeBg: 'rgba(168,85,247,0.15)',
    badgeColor: '#c084fc',
    title: 'Premium Quality',
    highlight: 'Best Sellers',
    accentColor: '#a855f7',
    description: 'Shop our most popular items loved by thousands of customers worldwide.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&h=500&fit=crop'
  }
]

export const categoryCards = [
  { name: 'Electronics',     emoji: '⚡', count: 0, color: '#f59e0b' },
  { name: 'Fashion',         emoji: '👗', count: 0, color: '#ec4899' },
  { name: 'Sports',          emoji: '🏋️', count: 0, color: '#10b981' },
  { name: 'Books',           emoji: '📚', count: 0, color: '#6366f1' },
  { name: 'Toys',            emoji: '🎮', count: 0, color: '#f97316' },
  { name: 'Food & Beverages',emoji: '☕', count: 0, color: '#84cc16' },
  { name: 'Health & Beauty', emoji: '✨', count: 0, color: '#06b6d4' },
  { name: 'Automotive',      emoji: '🚗', count: 0, color: '#ef4444' },
]

export const vibeOptions = [
  { emoji: '🎉', label: 'Birthday Party' },
  { emoji: '💼', label: 'Work From Home' },
  { emoji: '🏋️', label: 'Fitness Goals' },
  { emoji: '🌴', label: 'Beach Vacation' },
  { emoji: '🎮', label: 'Gaming Night' },
  { emoji: '💝', label: 'Gift for Partner' },
  { emoji: '📚', label: 'Study Mode' },
  { emoji: '🍳', label: 'Home Cooking' },
]

export const locationData = {
  address: 'PARC 3, Residensi Pudu Alam Rekreasi, 5, Jalan Pudu Perdana, Taman Pertama, 56100 Kuala Lumpur, Malaysia',
  hours: 'Mon - Sat: 10:00 AM - 8:00 PM\nSun: 10:00 AM - 6:00 PM',
  contact: '+60 12-345 6789\nhello@minishop.com',
  mapsUrl: 'https://maps.app.goo.gl/tckRpQsLgKrsykQB9',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4061.7081054201035!2d101.7281918750462!3d3.121776953320148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc366d5edd2813%3A0xaad62a668c76756f!2sParc%203!5e1!3m2!1sen!2smy!4v1777475719857!5m2!1sen!2smy'
}