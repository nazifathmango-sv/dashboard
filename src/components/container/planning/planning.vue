<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Planning" subtitle="Disponibilité des chambres jour par jour.">
      <template #actions>
        <BaseButton variant="secondary" size="sm" @click="shiftWindow(-windowSize)">← Précédent</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="goToToday">Aujourd'hui</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="shiftWindow(windowSize)">Suivant →</BaseButton>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded bg-gray-50 border border-gray-200"></span>
        Libre
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded bg-green-100 border-l-4 border-green-500"></span>
        Arrivée
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded bg-blue-100"></span>
        Occupée
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded bg-amber-100 border-r-4 border-amber-500"></span>
        Départ
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              class="sticky left-0 z-10 bg-white text-left font-semibold text-gray-500 uppercase text-xs px-4 py-3 border-b border-r border-gray-100 min-w-[180px]"
            >
              Chambre
            </th>
            <th
              v-for="day in days"
              :key="day"
              class="text-center font-semibold text-xs px-2 py-3 border-b border-gray-100 min-w-[64px]"
              :class="isToday(day) ? 'bg-amber-50 text-amber-700' : 'text-gray-500'"
            >
              {{ formatDayLabel(day) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id" class="border-b border-gray-50 last:border-0">
            <td
              class="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-100 font-medium text-gray-800"
            >
              {{ room.titre }}
            </td>
            <td
              v-for="day in days"
              :key="day"
              class="px-2 py-3 text-center"
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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { rooms } = storeToRefs(useRoomsStore())
const reservationsStore = useReservationsStore()

const windowSize = 14
const todayISO = new Date().toISOString().slice(0, 10)
const windowStart = ref(todayISO)

function addDaysISO(dateISO: string, amount: number) {
  const date = new Date(dateISO)
  date.setDate(date.getDate() + amount)
  return date.toISOString().slice(0, 10)
}

const days = computed(() => Array.from({ length: windowSize }, (_, i) => addDaysISO(windowStart.value, i)))

function shiftWindow(amount: number) {
  windowStart.value = addDaysISO(windowStart.value, amount)
}

function goToToday() {
  windowStart.value = todayISO
}

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
  if (!reservation) return 'bg-gray-50/60'
  if (reservation.dateDebut === dateISO) return 'bg-green-100 border-l-4 border-green-500'
  if (reservation.dateFin === dateISO) return 'bg-amber-100 border-r-4 border-amber-500'
  return 'bg-blue-100'
}

function cellTooltip(roomId: number, dateISO: string) {
  const reservation = reservationFor(roomId, dateISO)
  if (!reservation) return 'Libre'
  return `${reservation.name} — ${reservation.dateDebut} → ${reservation.dateFin}`
}
</script>
