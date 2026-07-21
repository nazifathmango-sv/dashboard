<template>
  <div class="">
  <div class="min-h-screen w-full  p-6">
    <div class="space-y-6 max-w-7xl mx-auto">
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
  <div class="bg-white p-5 rounded-xl shadow border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer min-h-[110px]">
    <div class="flex justify-between items-start">
      <p class="text-3xl font-black text-black">28</p>
      <img :src="bed" alt="Bed icon" class="w-6 h-6 object-contain">
    </div>
    <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">Chambres occupées</p>
  </div>
  <div class="bg-white p-5 rounded-xl shadow border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer min-h-[110px]">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-3xl font-black text-black">42</p>
        <div class="text-xs font-bold text-slate-700">actifs / 150</div>
      </div>
      <img :src="activitie" alt="activitie icon" class="w-6 h-6 object-contain">
    </div>
    <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">Capacité globale (28.0%)</p>
  </div>
  <div class="bg-white p-5 rounded-xl shadow border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer min-h-[110px]">
    <div class="flex justify-between items-start">
      <p class="text-3xl font-black text-black">14</p>
      <img :src="rocket" alt="rocket icon" class="w-6 h-6 object-contain">
    </div>
    <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">Arrivées attendues</p>
  </div>
  <div class="bg-white p-5 rounded-xl shadow border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer min-h-[110px]">
    <div class="flex justify-between items-start">
      <p class="text-3xl font-black text-black">9.4</p>
      <img :src="star" alt="Star icon" class="w-6 h-6 object-contain">
    </div>
    <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">Note moyenne avis</p>
  </div>
</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-xl shadow p-5 border border-transparent transition-all duration-300  hover:shadow-md"
        >
          <h2 class="text-xl font-bold mb-5 text-slate-700">Statut des chambres (Aujourd'hui)</h2>
          <apexchart
            width="100%"
            height="260"
            type="pie"
            :options="roomPieOptions"
            :series="roomPieSeries"
          />
        </div>
        <div
          class="bg-white rounded-xl shadow p-5 border border-transparent transition-all duration-300  hover:shadow-md"
        >
          <h2 class="text-xl font-bold mb-5 text-slate-700">Taux d'occupation par type de chambre</h2>
          <apexchart
            width="100%"
            height="220"
            type="bar"
            :options="occupancyOptions"
            :series="occupancySeries"
          />
        </div>
      </div>
      <div
        class="bg-white rounded-xl shadow p-5 border border-transparent transition-all duration-300  hover:shadow-md"
      >
        <h2 class="text-xl font-bold mb-5 text-slate-700">Réservations mensuelles</h2>
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
  </div>
</template>
<script setup lang="ts">
import activitie from '@/assets/icon/activities.svg'
import bed from '@/assets/icon/bed.svg'
import rocket from '@/assets/icon/rocket.svg'
import star from '@/assets/icon/star.svg'
const roomPieSeries = [45, 35, 15, 5]
const roomPieOptions = {
  chart: { id: 'room-pie-chart' },
  labels: ['Occupées', 'Disponibles', 'En nettoyage', 'En maintenance'],
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  legend: { position: 'bottom', labels: { colors: '#475569' } },
}
const monthlyBookingOptions = {
  chart: { id: 'reservation-chart', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin'],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: false } } },
  colors: ['#fbbf24'],
}
const monthlyBookingSeries = [{ name: 'Réservations', data: [30, 45, 35, 60, 80, 70] }]
const occupancySeries = [{ name: "Taux d'occupation (%)", data: [65, 80, 45, 30] }]
const occupancyOptions = {
  chart: { id: 'occupancy-rate-chart', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: '35%', borderRadius: 4 } },
  colors: ['#3b82f6'],
  grid: { show: false },
  xaxis: {
    categories: ['Standard', 'Double', 'Suite Royale', 'Suite Familiale'],
    max: 100,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val + '%'
    },
    style: { colors: ['#475569'] },
    offsetX: 10,
  },
}
</script>
