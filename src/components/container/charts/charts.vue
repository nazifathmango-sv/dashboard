<template>
  <div class="min-h-screen w-full p-6 page-enter-anim">
    <div class="space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité de l'hôtel." />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
        >
          <div class="flex justify-between items-start">
            <p class="text-3xl font-bold text-navy-500 tabular-nums">{{ occupiedCount }}</p>
            <Icon name="bed" class="w-6 h-6 text-navy-200" />
          </div>
          <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Chambres occupées</p>
        </div>
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-3xl font-bold text-navy-500 tabular-nums">{{ occupiedCount }}</p>
              <div class="text-xs font-semibold text-navy-300 mt-0.5">occupées / {{ totalCount }}</div>
            </div>
            <Icon name="chart-bar" class="w-6 h-6 text-navy-200" />
          </div>
          <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">
            Capacité globale ({{ occupancyRate }}%)
          </p>
        </div>
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
        >
          <div class="flex justify-between items-start">
            <p class="text-3xl font-bold text-navy-500 tabular-nums">{{ arrivalsToday }}</p>
            <Icon name="rocket" class="w-6 h-6 text-navy-200" />
          </div>
          <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Arrivées attendues</p>
        </div>
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
        >
          <div class="flex justify-between items-start">
            <p class="text-3xl font-bold text-navy-500 tabular-nums">9.4</p>
            <Icon name="star" class="w-6 h-6 text-gold-400" />
          </div>
          <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Note moyenne avis</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-2xl shadow-sm p-5 border border-sand-200 transition-all duration-300 hover:shadow-md"
        >
          <h2 class="text-lg font-bold mb-5 text-navy-500">Statut des chambres (Aujourd'hui)</h2>
          <apexchart width="100%" height="260" type="pie" :options="roomPieOptions" :series="roomPieSeries" />
        </div>
        <div
          class="bg-white rounded-2xl shadow-sm p-5 border border-sand-200 transition-all duration-300 hover:shadow-md"
        >
          <h2 class="text-lg font-bold mb-5 text-navy-500">Taux d'occupation par type de chambre</h2>
          <apexchart width="100%" height="220" type="bar" :options="occupancyOptions" :series="occupancySeries" />
        </div>
      </div>
      <div
        class="bg-white rounded-2xl shadow-sm p-5 border border-sand-200 transition-all duration-300 hover:shadow-md"
      >
        <h2 class="text-lg font-bold mb-5 text-navy-500">Réservations mensuelles</h2>
        <apexchart
          width="100%"
          height="350"
          type="bar"
          :options="monthlyBookingOptions"
          :series="monthlyBookingSeries"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import Icon from '@/components/ui/Icon.vue'

const roomsStore = useRoomsStore()
const { rooms, occupiedCount, totalCount } = storeToRefs(roomsStore)
const reservationsStore = useReservationsStore()
const { arrivalsToday } = storeToRefs(reservationsStore)

const occupancyRate = computed(() => (totalCount.value ? Math.round((occupiedCount.value / totalCount.value) * 100) : 0))

const roomPieSeries = computed(() => [occupiedCount.value, totalCount.value - occupiedCount.value])
const roomPieOptions = computed(() => ({
  chart: { id: 'room-pie-chart' },
  labels: ['Occupées', 'Disponibles'],
  colors: ['#34505e', '#4f9d92'],
  legend: { position: 'bottom', labels: { colors: '#5f7885' } },
}))

const monthLabels = ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
const monthlyBookingSeries = computed(() => {
  const counts = new Array(12).fill(0)
  reservationsStore.reservations.forEach((reservation) => {
    const month = new Date(reservation.dateDebut).getMonth()
    counts[month] += 1
  })
  return [{ name: 'Réservations', data: counts }]
})
const monthlyBookingOptions = {
  chart: { id: 'reservation-chart', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: {
    categories: monthLabels,
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: { borderColor: '#f3ece0', xaxis: { lines: { show: false } } },
  colors: ['#c9a15a'],
}

const occupancySeries = computed(() => [
  { name: "Taux d'occupation (%)", data: rooms.value.map((room) => (room.statut === 'Complet' ? 100 : 0)) },
])
const occupancyOptions = computed(() => ({
  chart: { id: 'occupancy-rate-chart', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: '35%', borderRadius: 4 } },
  colors: ['#34505e'],
  grid: { show: false },
  xaxis: {
    categories: rooms.value.map((room) => room.titre),
    max: 100,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val + '%',
    style: { colors: ['#5f7885'] },
    offsetX: 10,
  },
}))
</script>
