<template>
  <div class="min-h-screen text-slate-900" :class="isAdminRoute ? 'bg-gray-100' : 'bg-slate-50'">
    <!-- Only show NavBar for non-admin routes -->
    <NavBar v-if="!isAdminRoute" />

    <!-- Admin routes don't need the main wrapper padding -->
    <main 
      v-if="!isAdminRoute"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <RouterView />
    </main>
    
    <!-- Admin routes render directly without wrapper -->
    <RouterView v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>