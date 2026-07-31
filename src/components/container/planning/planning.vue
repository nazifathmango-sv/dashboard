<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Planning" subtitle="Disponibilité des chambres jour par jour.">
      <template #actions>
        <div class="flex items-center gap-2">
          <BaseButton v-if="isRangeCustomized" variant="ghost" size="sm" @click="dateRange = defaultRange()">
            <Icon name="x-mark" class="w-3.5 h-3.5" />
            Réinitialiser
          </BaseButton>
          <DateRangePicker v-model="dateRange" />
        </div>
      </template>
    </PageHeader>

    <div
      v-if="isRangeTruncated"
      class="flex items-center gap-2 bg-gold-50 border border-gold-100 rounded-xl px-4 py-2.5 text-sm text-gold-600 mb-6"
    >
      <Icon name="calendar" class="w-4 h-4 shrink-0" />
      <span>
        Plage sélectionnée trop large ({{ requestedLength }} jours). Affichage limité aux
        {{ MAX_VISIBLE_DAYS }} premiers jours, du {{ formatDateFull(days[0] ?? '') }} au
{{ formatDateFull(days[days.length - 1] ?? '') }}.
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div
        class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-3xl font-bold text-navy-500 tabular-nums">
              {{ occupiedRoomsInRange }} <span class="text-sm font-medium text-navy-300">/ {{ rooms.length }}</span>
            </p>
            <p class="text-xs font-semibold text-navy-300 mt-0.5">{{ occupancyRateInRange }}% d'occupation</p>
          </div>
          <Icon name="bed" class="w-6 h-6 text-navy-200" />
        </div>
        <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Chambres occupées sur la période</p>
      </div>

      <div
        class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
      >
        <div class="flex justify-between items-start">
          <p class="text-3xl font-bold text-navy-500 tabular-nums">{{ arrivalsInRange }}</p>
          <Icon name="rocket" class="w-6 h-6 text-lagoon-400" />
        </div>
        <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Arrivées sur la période</p>
      </div>

      <div
        class="bg-white p-5 rounded-2xl shadow-sm border border-sand-200 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default min-h-[110px]"
      >
        <div class="flex justify-between items-start">
          <p class="text-3xl font-bold text-navy-500 tabular-nums">{{ departuresInRange }}</p>
          <Icon name="calendar" class="w-6 h-6 text-gold-400" />
        </div>
        <p class="text-sm font-semibold text-navy-300 mt-2 leading-tight">Départs sur la période</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-2xl shadow-sm p-5 border border-sand-200 transition-all duration-300 hover:shadow-md">
        <h2 class="text-lg font-bold mb-1 text-navy-500">Arrivées et départs par jour</h2>
        <p class="text-sm text-navy-300 mb-4">
        Du {{ formatDateFull(days[0] ?? '') }} au {{ formatDateFull(days[days.length - 1] ?? '') }}
        </p>
        <EmptyState
          v-if="arrivalsDeparturesTotal === 0"
          title="Aucune arrivée ni départ sur cette période"
          description="Essayez d'élargir la plage de dates sélectionnée."
        />
        <apexchart
          v-else
          width="100%"
          height="280"
          type="bar"
          :options="arrivalsDeparturesOptions"
          :series="arrivalsDeparturesSeries"
        />
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-5 border border-sand-200 transition-all duration-300 hover:shadow-md">
        <h2 class="text-lg font-bold mb-1 text-navy-500">Taux d'occupation par jour</h2>
        <p class="text-sm text-navy-300 mb-4">{{ rooms.length }} chambre{{ rooms.length > 1 ? 's' : '' }} au total</p>
        <apexchart width="100%" height="280" type="area" :options="occupancyRateOptions" :series="occupancyRateSeries" />
      </div>
    </div>

    <PageCard padding="sm" class="mb-6">
      <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-navy-300">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-sand-50 border border-sand-200"></span>
          Libre
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-sand-200 border border-sand-300"></span>
          À venir
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-lagoon-100 border-l-4 border-lagoon-500"></span>
          Check-in
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-navy-100 border border-navy-200"></span>
          En cours
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded bg-gold-100 border-r-4 border-gold-500"></span>
          Check-out
        </div>
        <span class="text-navy-200">•</span>
        <span>Cliquez sur une réservation pour voir le détail</span>
      </div>
    </PageCard>

    <div class="bg-white rounded-2xl shadow-sm border border-sand-200 overflow-x-auto">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              class="sticky left-0 top-0 z-20 bg-white text-left font-semibold text-navy-300 uppercase text-xs px-4 py-3 border-b border-r-2 border-sand-300 min-w-[180px]"
            >
              Chambre
            </th>
            <th
              v-for="day in days"
              :key="day"
              :style="{ minWidth: dayColumnMinWidth }"
              class="sticky top-0 z-10 text-center font-semibold text-xs px-2 py-3 border-b-2 transition-colors duration-150"
              :class="
                isToday(day)
                  ? 'bg-gold-50 text-gold-600 border-b-gold-400'
                  : isWeekend(day)
                    ? 'bg-sand-100/70 text-navy-300 border-b-sand-200'
                    : 'bg-white text-navy-300 border-b-sand-200'
              "
            >
              {{ formatDayLabel(day) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="room in rooms"
            :key="room.id"
            class="group border-b border-sand-100 last:border-0 transition-colors duration-150 odd:bg-sand-50/20 hover:bg-sand-50/30"
          >
            <td
              class="sticky left-0 z-10 bg-white px-4 py-3 border-r-2 border-sand-300 font-medium text-navy-500 transition-colors duration-150 group-hover:bg-sand-50 h-14"
            >
              {{ room.titre }}
            </td>
            <td
              v-for="day in days"
              :key="day"
              :style="{ minWidth: dayColumnMinWidth }"
              class="relative px-0 py-2 text-center align-middle transition-colors duration-150 border-b border-sand-100/70"
              :class="!reservationFor(room.id, day) ? (isWeekend(day) ? 'bg-sand-100/50' : 'bg-sand-50/40') : ''"
            >
              <button
                v-if="reservationFor(room.id, day)"
                type="button"
                class="w-full h-9 flex items-center px-2 cursor-pointer transition-all duration-150 hover:brightness-95 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400/40"
                :class="barClasses(reservationFor(room.id, day)!, day)"
                @click="openReservation(reservationFor(room.id, day)!)"
              >
                <span
                  v-if="
                    isStart(reservationFor(room.id, day)!, day) ||
                    isFirstVisible(reservationFor(room.id, day)!, day)
                  "
                  class="text-[0.7rem] font-semibold truncate leading-tight"
                  :class="statusPalette(reservationFor(room.id, day)!.stayStatus).text"
                >
                  {{ reservationFor(room.id, day)?.name }}
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-model="showDetail" size="sm">
      <template v-if="selectedReservation">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 class="text-lg font-bold text-navy-500">{{ selectedReservation.name }}</h3>
            <p class="text-sm text-navy-300">{{ selectedReservation.type }}</p>
          </div>
          <Badge :tone="stayStatusTone(selectedReservation.stayStatus)">{{ selectedReservation.stayStatus }}</Badge>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-2 text-navy-400">
            <Icon name="bed" class="w-4 h-4 text-navy-200" />
            <span>{{ selectedRoomTitle }}</span>
          </div>
          <div class="flex items-center gap-2 text-navy-400">
            <Icon name="calendar" class="w-4 h-4 text-navy-200" />
            <span>{{ formatDateFull(selectedReservation.dateDebut) }} → {{ formatDateFull(selectedReservation.dateFin) }}</span>
            <span class="text-navy-200">·</span>
            <span>{{ stayDuration(selectedReservation) }} nuit{{ stayDuration(selectedReservation) > 1 ? 's' : '' }}</span>
          </div>
          <div class="flex items-center gap-2 text-navy-400">
            <Icon name="phone" class="w-4 h-4 text-navy-200" />
            <span>{{ selectedReservation.phone }}</span>
          </div>
          <div class="flex items-center gap-2 text-navy-400">
            <Icon name="mail" class="w-4 h-4 text-navy-200" />
            <span>{{ selectedReservation.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-navy-400">
            <Icon name="location" class="w-4 h-4 text-navy-200" />
            <span>{{ selectedReservation.country }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-sand-200">
          <BaseButton variant="secondary" size="sm" @click="showDetail = false">Fermer</BaseButton>
          <BaseButton size="sm" @click="goToReservation">Voir la réservation</BaseButton>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import type { Reservation, StayStatus } from '@/data/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import PageCard from '@/components/ui/PageCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'
import DateRangePicker from '@/components/ui/DateRangePicker.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
const { rooms } = storeToRefs(useRoomsStore())
const reservationsStore = useReservationsStore()

const MAX_VISIBLE_DAYS = 30

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
function addDaysISO(dateISO: string, amount: number) {
  const date = new Date(dateISO)
  date.setDate(date.getDate() + amount)
  return date.toISOString().slice(0, 10)
}
function diffInDays(startISO: string, endISO: string) {
  const start = new Date(startISO)
  const end = new Date(endISO)
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}
function defaultRange() {
  return { start: todayISO(), end: addDaysISO(todayISO(), 13) }
}

const dateRange = ref<{ start: string; end: string }>(defaultRange())

const isRangeCustomized = computed(() => {
  const def = defaultRange()
  return dateRange.value.start !== def.start || dateRange.value.end !== def.end
})

const requestedLength = computed(() => diffInDays(dateRange.value.start, dateRange.value.end) + 1)
const isRangeTruncated = computed(() => requestedLength.value > MAX_VISIBLE_DAYS)

const days = computed(() => {
  const length = Math.min(requestedLength.value, MAX_VISIBLE_DAYS)
  return Array.from({ length }, (_, i) => addDaysISO(dateRange.value.start, i))
})

const isDense = computed(() => days.value.length > 14)
const dayColumnMinWidth = computed(() => (isDense.value ? '72px' : '96px'))

const showDetail = ref(false)
const selectedReservation = ref<Reservation | null>(null)

function isToday(dateISO: string) {
  return dateISO === todayISO()
}
function isWeekend(dateISO: string) {
  const day = new Date(dateISO).getDay()
  return day === 0 || day === 6
}
function formatDayLabel(dateISO: string) {
  const date = new Date(dateISO)
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' })
}
function formatDateFull(dateISO: string) {
  const date = new Date(dateISO)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function reservationFor(roomId: number, dateISO: string) {
  return reservationsStore
    .reservationsForRoom(roomId)
    .find((reservation) => dateISO >= reservation.dateDebut && dateISO <= reservation.dateFin)
}

function isStart(reservation: Reservation, dateISO: string) {
  return dateISO === reservation.dateDebut
}
function isEnd(reservation: Reservation, dateISO: string) {
  return dateISO === reservation.dateFin
}
function isFirstVisible(reservation: Reservation, dateISO: string) {
  return dateISO === days.value[0] && reservation.dateDebut < days.value[0]
}
function isLastVisible(reservation: Reservation, dateISO: string) {
  const lastDay = days.value[days.value.length - 1]
  return dateISO === lastDay && reservation.dateFin > lastDay
}

function statusPalette(status: StayStatus) {
  switch (status) {
    case 'Check-in':
      return { bg: 'bg-lagoon-100', border: 'border-l-4 border-lagoon-500', text: 'text-lagoon-500' }
    case 'En cours':
      return { bg: 'bg-navy-100', border: 'border border-navy-200', text: 'text-navy-500' }
    case 'Check-out':
      return { bg: 'bg-gold-100', border: 'border-r-4 border-gold-500', text: 'text-gold-600' }
    case 'À venir':
    default:
      return { bg: 'bg-sand-200', border: 'border border-sand-300', text: 'text-navy-400' }
  }
}

function barClasses(reservation: Reservation, dateISO: string) {
  const start = isStart(reservation, dateISO)
  const end = isEnd(reservation, dateISO)
  const firstVis = isFirstVisible(reservation, dateISO)
  const lastVis = isLastVisible(reservation, dateISO)

  const base = statusPalette(reservation.stayStatus)
  const rounded = [start ? 'rounded-l-lg' : 'rounded-l-none', end ? 'rounded-r-lg' : 'rounded-r-none'].join(' ')
  const truncated = [
    firstVis && !start ? 'border-l-2 border-dashed border-white/70' : '',
    lastVis && !end ? 'border-r-2 border-dashed border-white/70' : '',
  ].join(' ')

  return `${base.bg} ${base.border} ${rounded} ${truncated}`
}

function stayStatusTone(status: StayStatus) {
  switch (status) {
    case 'Check-in':
      return 'blue'
    case 'En cours':
      return 'green'
    case 'Check-out':
      return 'amber'
    case 'À venir':
    default:
      return 'gray'
  }
}
function stayDuration(reservation: Reservation) {
  const debut = new Date(reservation.dateDebut)
  const fin = new Date(reservation.dateFin)
  return Math.max(1, Math.round((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)))
}

function openReservation(reservation: Reservation) {
  selectedReservation.value = reservation
  showDetail.value = true
}
const selectedRoomTitle = computed(() => {
  if (!selectedReservation.value?.roomId) return 'Chambre non spécifiée'
  return rooms.value.find((room) => room.id === selectedReservation.value?.roomId)?.titre ?? 'Chambre inconnue'
})
function goToReservation() {
  if (!selectedReservation.value) return
  router.push({ name: 'reservation-details', params: { id: selectedReservation.value.id } })
}

const occupiedRoomIdsInRange = computed(() => {
  const ids = new Set<number>()
  rooms.value.forEach((room) => {
    const hasOccupation = days.value.some((day) => reservationsStore.occupancyForDate(room.id, day))
    if (hasOccupation) ids.add(room.id)
  })
  return ids
})
const occupiedRoomsInRange = computed(() => occupiedRoomIdsInRange.value.size)
const occupancyRateInRange = computed(() =>
  rooms.value.length ? Math.round((occupiedRoomsInRange.value / rooms.value.length) * 100) : 0,
)

const arrivalsInRange = computed(() => {
  const start = days.value[0]
  const end = days.value[days.value.length - 1]

  if (!start || !end) return 0

  return reservationsStore.reservations.filter(
    (r) => r.dateDebut >= start && r.dateDebut <= end,
  ).length
})
const departuresInRange = computed(() => {
  const start = days.value[0]
  const end = days.value[days.value.length - 1]

  if (!start || !end) return 0

  return reservationsStore.reservations.filter(
    (r) => r.dateFin >= start && r.dateFin <= end,
  ).length
})

const arrivalsPerDay = computed(() =>
  days.value.map((day) => reservationsStore.reservations.filter((r) => r.dateDebut === day).length),
)
const departuresPerDay = computed(() =>
  days.value.map((day) => reservationsStore.reservations.filter((r) => r.dateFin === day).length),
)
const arrivalsDeparturesTotal = computed(
  () => arrivalsPerDay.value.reduce((a, b) => a + b, 0) + departuresPerDay.value.reduce((a, b) => a + b, 0),
)

const arrivalsDeparturesSeries = computed(() => [
  { name: 'Arrivées', data: arrivalsPerDay.value },
  { name: 'Départs', data: departuresPerDay.value },
])

const arrivalsDeparturesOptions = computed(() => ({
  chart: {
    id: 'planning-arrivals-departures',
    toolbar: { show: false },
    stacked: false,
    animations: { enabled: true, speed: 200 },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: isDense.value ? '60%' : '40%',
      dataLabels: { position: 'top' },
    },
  },
  colors: ['#4f9d92', '#c9a15a'],
  xaxis: {
    categories: days.value.map((d) => formatDayLabel(d)),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#5f7885', fontSize: '11px' } },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    allowDecimals: false,
    labels: { style: { colors: '#5f7885' } },
  },
  grid: { borderColor: '#f3ece0', xaxis: { lines: { show: false } } },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: { colors: '#5f7885' },
    markers: { radius: 4 },
  },
  dataLabels: { enabled: false },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (val: number) => `${val} réservation${val > 1 ? 's' : ''}` },
  },
}))

function occupiedCountForDay(day: string) {
  return rooms.value.filter((room) => reservationsStore.occupancyForDate(room.id, day)).length
}
const occupancyRatePerDay = computed(() =>
  days.value.map((day) => (rooms.value.length ? Math.round((occupiedCountForDay(day) / rooms.value.length) * 100) : 0)),
)
const occupancyRateSeries = computed(() => [{ name: "Taux d'occupation", data: occupancyRatePerDay.value }])

const isTodayInRange = computed(() => days.value.includes(todayISO()))

const occupancyRateOptions = computed(() => ({
  chart: {
    id: 'planning-occupancy-rate',
    toolbar: { show: false },
    animations: { enabled: true, speed: 200 },
  },
  stroke: { curve: 'smooth', width: 2.5 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
  },
  colors: ['#34505e'],
  markers: {
    size: 4,
    colors: ['#fff'],
    strokeColors: '#34505e',
    strokeWidth: 2,
    hover: { size: 6 },
  },
  xaxis: {
    categories: days.value.map((d) => formatDayLabel(d)),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#5f7885', fontSize: '11px' } },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      formatter: (val: number) => `${val}%`,
      style: { colors: '#5f7885' },
    },
  },
  grid: { borderColor: '#f3ece0', xaxis: { lines: { show: false } } },
  dataLabels: { enabled: false },
  tooltip: {
    y: { formatter: (val: number) => `${val}% occupé` },
  },
  annotations: {
    xaxis: isTodayInRange.value
      ? [
          {
            x: formatDayLabel(todayISO()),
            borderColor: '#c9a15a',
            strokeDashArray: 4,
            label: {
              text: "Aujourd'hui",
              style: { color: '#fff', background: '#c9a15a', fontSize: '11px' },
              orientation: 'horizontal',
              textAnchor: todayISO() === days.value[0] ? 'start' : 'middle',
            },
          },
        ]
      : [],
  },
}))
</script>
