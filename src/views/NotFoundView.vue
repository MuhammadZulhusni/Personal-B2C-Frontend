<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-slate-800 mb-4">404</h1>
      <p class="text-2xl text-slate-600 mb-8">Page Not Found</p>
      <p class="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink 
        to="/" 
        class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
      >
        Go Back Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>