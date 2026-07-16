<template>
  <HomeView />
   <div class="bg-white rounded-xl shadow p-5">

    <h2 class="text-xl font-bold mb-5">
      Réservations mensuelles
    </h2>

    <apexchart
      width="100%"
      height="350"
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script setup lang="ts">
import HomeView from '@/components/helper/homeView.vue'
const chartOptions = {

  chart:{
    id:"reservation-chart"
  },
  xaxis:{
    categories:[
      "Jan",
      "Fév",
      "Mars",
      "Avril",
      "Mai",
      "Juin"
    ]
  },
  colors:[
    "#fbbf24"
  ]

}
const series = [

  {
    name:"Réservations",
    data:[
      30,
      45,
      35,
      60,
      80,
      70
    ]
  }

]
</script>
