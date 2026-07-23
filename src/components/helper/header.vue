<template>
  <div class="flex justify-between items-center bg-gray-800 px-5 py-6 shadow-md">
    <div>
      <div class="text-3xl font-bold text-white">
        {{ currentTitle }}
      </div>
    </div>
    <div class="relative">
  <button
    @click="showAdminMenu = !showAdminMenu"
    class="flex items-center gap-2 text-white font-medium hover:text-gray-300 transition cursor-pointer"
  >
    Administrateur
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-4 h-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>

  </button>
  <div
    v-if="showAdminMenu"
    class="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
  >
   <button
  @click="logout"
  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
>
  Déconnexion
</button>
  </div>
</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.removeItem('token')
  router.push('/Login')
}
const route = useRoute()
const titles: Record<string, string> = {
  charts: 'Tableau De Bord',
  rooms: 'Rooms',
  reservations: 'Reservations',
  customers: 'Customers',
  service: 'Service',
  staff: 'Staff',
  'service-details': 'Service',
  'reservation-details': 'Détails de la réservation',
  'customer-details': 'Détails du client',
}
const currentTitle = computed(() => {
  return titles[route.name as string] || 'charts'
})
const showAdminMenu = ref(false)
</script>
