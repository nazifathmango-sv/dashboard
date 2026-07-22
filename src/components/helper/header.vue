<template>
  <header class="flex justify-between items-center bg-gray-800 px-6 py-4 shadow-md">
    <div class="text-2xl font-bold text-white tracking-tight">
      {{ currentTitle }}
    </div>

    <div class="relative">
      <button
        @click="showAdminMenu = !showAdminMenu"
        class="flex items-center gap-3 text-white hover:bg-white/5 rounded-xl pl-2 pr-3 py-1.5 transition cursor-pointer"
      >
        <div
          class="w-9 h-9 rounded-full bg-amber-200 text-gray-900 flex items-center justify-center font-semibold text-sm shrink-0"
        >
          {{ userInitials }}
        </div>
        <span class="font-medium text-sm">{{ userName }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-4 h-4 text-gray-300 transition-transform duration-200"
          :class="{ 'rotate-180': showAdminMenu }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <Transition name="fade">
        <div
          v-if="showAdminMenu"
          class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
        >
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
            <p class="text-xs text-gray-500">{{ userEmail }}</p>
          </div>
          <button
            @click="logout"
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3H21" />
            </svg>
            Déconnexion
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userName = 'Admin'
const userEmail = 'admin@sunbeachhotel.com'
const userInitials = computed(() =>
  userName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase(),
)

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const titles: Record<string, string> = {
  charts: 'Tableau de bord',
  rooms: 'Chambres',
  reservations: 'Réservations',
  'reservation-details': 'Détails de la réservation',
  customers: 'Clients',
  service: 'Service',
  'service-details': 'Détails du service',
  staff: 'Personnel',
  admin: 'Administrateur',
}
const currentTitle = computed(() => titles[route.name as string] ?? 'Tableau de bord')
const showAdminMenu = ref(false)
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
