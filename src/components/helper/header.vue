<template>
  <div class="flex justify-between items-center bg-gray-800 px-5 py-6 shadow-md">
    <div>
      <div class="text-3xl font-bold text-white">
        {{ currentTitle }}
      </div>
    </div>
    <div class="bg-gray-700 px-4 py-2 rounded-lg border border-gray-600">
      <span class="text-base font-bold text-white tracking-wide uppercase">Administrateur</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const titles: Record<string, string> = {
  charts: 'Tableau De Bord',
  rooms: 'Rooms',
  reservations: 'Reservations',
  customers: 'Customers',
  service: 'Service',
  staff: 'Staff',
}
const currentTitle = computed(() => {
  return titles[route.name as string] || 'charts'
})
</script>
