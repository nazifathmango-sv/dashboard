<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Planning" subtitle="Disponibilité des chambres jour par jour.">
      <template #actions>
        <div ref="filterContainer" class="relative inline-flex">
          <BaseButton
            variant="ghost"
            size="sm"
            @click="showFilterMenu = !showFilterMenu"
            :class="['rounded-full px-4 flex items-center gap-2', showFilterMenu ? 'bg-white text-navy-700 shadow-sm' : 'text-navy-400 hover:bg-white/80']"
          >
            <span>{{ filterOptions.find((option) => option.key === activeFilter)?.label || 'Filtrer' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </BaseButton>

          <Transition name="fade">
            <div
              v-if="showFilterMenu"
              class="absolute right-0 mt-2 w-40 rounded-2xl bg-white border border-sand-200 shadow-lg overflow-hidden z-50"
            >
              <button
                v-for="option in filterOptions"
                :key="option.key"
                type="button"
                class="w-full text-left px-4 py-3 text-sm hover:bg-sand-100 transition"
                :class="option.key === activeFilter ? 'bg-sand-50 font-semibold' : ''"
                @click="selectFilter(option.key)"
              >
                {{ option.label }}
              </button>
            </div>
          </Transition>
        </div>
      </template>
    </PageHeader>
    <PageCard padding="sm" class="mb-6">
      <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-navy-300">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-sand-50 border border-sand-200"></span>
          Libre
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-lagoon-100 border-l-4 border-lagoon-500"></span>
          Arrivée
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-navy-100"></span>
          Occupée
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-gold-100 border-r-4 border-gold-500"></span>
          Départ
        </div>
      </div>
    </PageCard>
    <div class="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-x-auto">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              class="sticky left-0 top-0 z-20 bg-white text-left font-semibold text-navy-300 uppercase text-xs px-4 py-3 border-b border-r border-sand-200 min-w-[180px]"
            >
              Chambre
            </th>
            <th
              v-for="day in days"
              :key="day"
              class="sticky top-0 z-10 bg-white text-center font-semibold text-xs px-2 py-3 border-b border-sand-200 min-w-[80px] transition-colors duration-150"
              :class="isToday(day) ? 'bg-gold-50 text-gold-600' : 'text-navy-300'"
            >
              {{ formatDayLabel(day) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="room in rooms"
            :key="room.id"
            class="group border-b border-sand-100 last:border-0 transition-colors duration-150"
          >
            <td
              class="sticky left-0 z-10 bg-white px-4 py-3 border-r border-sand-200 font-medium text-navy-500 transition-colors duration-150 group-hover:bg-sand-50"
            >
              {{ room.titre }}
            </td>
            <td
              v-for="day in days"
              :key="day"
              class="px-2 py-3 text-center transition-colors duration-150 group-hover:brightness-95"
              :class="cellClasses(room.id, day)"
              :title="cellTooltip(room.id, day)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import PageCard from '@/components/ui/PageCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
const { rooms } = storeToRefs(useRoomsStore())
const reservationsStore = useReservationsStore()
const windowSize = 21
const todayISO = new Date().toISOString().slice(0, 10)
const activeFilter = ref<'previous' | 'today' | 'next'>('today')
const showFilterMenu = ref(false)
const filterContainer = ref<HTMLElement | null>(null)
const filterOptions = [
  { key: 'previous', label: 'Précédent' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'next', label: 'Suivant' },
]

function addDaysISO(dateISO: string, amount: number) {
  const date = new Date(dateISO)
  date.setDate(date.getDate() + amount)
  return date.toISOString().slice(0, 10)
}

const days = computed(() => {
  const startDate =
    activeFilter.value === 'previous'
      ? addDaysISO(todayISO, -windowSize)
      : activeFilter.value === 'next'
      ? addDaysISO(todayISO, windowSize)
      : todayISO

  return Array.from({ length: windowSize }, (_, i) => addDaysISO(startDate, i))
})

function selectFilter(filterKey: 'previous' | 'today' | 'next') {
  activeFilter.value = filterKey
  showFilterMenu.value = false
}

function handleOutsideClick(event: MouseEvent) {
  if (filterContainer.value && !filterContainer.value.contains(event.target as Node)) {
    showFilterMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})

function isToday(dateISO: string) {
  return dateISO === todayISO
}
function formatDayLabel(dateISO: string) {
  const date = new Date(dateISO)
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' })
}
function reservationFor(roomId: number, dateISO: string) {
  return reservationsStore
    .reservationsForRoom(roomId)
    .find((reservation) => dateISO >= reservation.dateDebut && dateISO <= reservation.dateFin)
}
function cellClasses(roomId: number, dateISO: string) {
  const reservation = reservationFor(roomId, dateISO)
  if (!reservation) return 'bg-sand-50/60'
  if (reservation.dateDebut === dateISO) return 'bg-lagoon-100 border-l-4 border-lagoon-500'
  if (reservation.dateFin === dateISO) return 'bg-gold-100 border-r-4 border-gold-500'
  return 'bg-navy-100'
}
function cellTooltip(roomId: number, dateISO: string) {
  const reservation = reservationFor(roomId, dateISO)
  if (!reservation) return 'Libre'
  return `${reservation.name} — ${reservation.dateDebut} → ${reservation.dateFin}`
}
</script>
