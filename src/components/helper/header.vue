<template>
  <header class="flex justify-between items-center gap-4 bg-navy-600 px-6 py-4 shadow-md border-b border-gold-400/10">
    <div class="shrink-0">
      <div class="text-2xl font-bold text-sand-50 tracking-tight">
        {{ currentTitle }}
      </div>
      <p class="text-xs text-navy-200 mt-0.5 capitalize">{{ todayLabel }}</p>
    </div>

    <div ref="searchContainer" class="relative hidden md:block flex-1 max-w-md">
      <div class="relative">
        <Icon name="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-200" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un client ou une réservation..."
          class="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-sand-50 placeholder:text-navy-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white/15 transition"
          @focus="showResults = true"
        />
      </div>

      <Transition name="fade">
        <div
          v-if="showResults && searchQuery.trim() && searchResults.length > 0"
          class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-sand-200 overflow-hidden z-50"
        >
          <button
            v-for="result in searchResults"
            :key="`${result.type}-${result.id}`"
            type="button"
            class="w-full text-left px-4 py-3 text-sm hover:bg-sand-100 transition cursor-pointer flex items-center gap-3 border-b border-sand-100 last:border-0"
            @click="goToResult(result)"
          >
            <Icon :name="result.type === 'client' ? 'clients' : 'booking'" class="w-4 h-4 text-navy-200 shrink-0" />
            <div class="min-w-0">
              <p class="text-navy-500 font-medium truncate">{{ result.label }}</p>
              <p class="text-xs text-navy-300">{{ result.type === 'client' ? 'Client' : 'Réservation' }}</p>
            </div>
          </button>
        </div>
      </Transition>

      <Transition name="fade">
        <div
          v-if="showResults && searchQuery.trim() && searchResults.length === 0"
          class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-sand-200 px-4 py-3 text-sm text-navy-300 z-50"
        >
          Aucun résultat pour « {{ searchQuery }} ».
        </div>
      </Transition>
    </div>

    <div class="flex items-center gap-3 shrink-0">
      <button
        v-if="arrivalsToday > 0"
        type="button"
        class="bg-white/10 hover:bg-white/15 text-sand-50 rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600"
        @click="router.push('/planning')"
      >
        <Icon name="calendar" class="w-3.5 h-3.5" />
        {{ arrivalsToday }} arrivée{{ arrivalsToday > 1 ? 's' : '' }} aujourd'hui
      </button>

      <div class="relative">
        <button
          @click="showAdminMenu = !showAdminMenu"
          class="flex items-center gap-3 text-sand-50 hover:bg-white/5 rounded-xl pl-2 pr-3 py-1.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600"
        >
          <div
            class="w-9 h-9 rounded-full bg-gold-400 text-navy-600 flex items-center justify-center font-semibold text-sm shrink-0"
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
            class="w-4 h-4 text-navy-200 transition-transform duration-200"
            :class="{ 'rotate-180': showAdminMenu }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <Transition name="fade">
          <div
            v-if="showAdminMenu"
            class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-sand-200 overflow-hidden z-50"
          >
            <div class="px-4 py-3 border-b border-sand-200">
              <p class="text-sm font-medium text-navy-500">{{ userName }}</p>
              <p class="text-xs text-navy-300">{{ userEmail }}</p>
            </div>
            <button
              @click="logout"
              class="w-full text-left px-4 py-3 text-sm text-navy-400 hover:bg-sand-100 transition cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3H21" />
              </svg>
              Déconnexion
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clients'
import { useReservationsStore } from '@/stores/reservations'
import { useAuthStore } from '@/stores/auth'
import Icon from '@/components/ui/Icon.vue'

const router = useRouter()
const route = useRoute()

const clientsStore = useClientsStore()
const { clients } = storeToRefs(clientsStore)
const reservationsStore = useReservationsStore()
const { arrivalsToday } = storeToRefs(reservationsStore)
const authStore = useAuthStore()
const { user, role } = storeToRefs(authStore)

const userName = computed(() => user.value?.displayName || user.value?.email?.split('@')[0] || role.value || 'Utilisateur')
const userEmail = computed(() => user.value?.email ?? '')
const userInitials = computed(() =>
  userName.value
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2),
)

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const titles: Record<string, string> = {
  charts: 'Tableau de bord',
  rooms: 'Chambres',
  reservations: 'Réservations',
  'reservation-details': 'Détails de la réservation',
  planning: 'Planning',
  customers: 'Clients',
  'customer-details': 'Détails du client',
  service: 'Service',
  'service-details': 'Détails du service',
  staff: 'Personnel',
  admin: 'Administrateur',
}
const currentTitle = computed(() => titles[route.name as string] ?? 'Tableau de bord')
const todayLabel = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const showAdminMenu = ref(false)

interface SearchResult {
  type: 'client' | 'reservation'
  id: number
  label: string
}

const searchQuery = ref('')
const showResults = ref(false)
const searchContainer = ref<HTMLElement | null>(null)

const searchResults = computed<SearchResult[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []

  const clientResults: SearchResult[] = clients.value
    .filter((client) => `${client.nom} ${client.prenom}`.toLowerCase().includes(query))
    .map((client) => ({ type: 'client', id: client.id, label: `${client.nom} ${client.prenom}` }))

  const reservationResults: SearchResult[] = reservationsStore.reservations
    .filter((reservation) => reservation.name.toLowerCase().includes(query))
    .map((reservation) => ({ type: 'reservation', id: reservation.id, label: reservation.name }))

  return [...clientResults, ...reservationResults].slice(0, 5)
})

function goToResult(result: SearchResult) {
  if (result.type === 'client') {
    router.push({ name: 'customer-details', params: { id: result.id } })
  } else {
    router.push({ name: 'reservation-details', params: { id: result.id } })
  }
  searchQuery.value = ''
  showResults.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
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
