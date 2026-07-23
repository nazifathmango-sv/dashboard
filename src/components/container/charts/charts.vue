<template>
  <div class="min-h-screen w-full p-6">

    <div class="space-y-6 max-w-7xl mx-auto">

      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité de l'hôtel."
      />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          class="bg-white p-5 rounded-xl shadow border border-slate-100
          flex flex-col justify-between transition-all duration-300
          hover:shadow-md cursor-pointer min-h-[110px]"
        >

          <div class="flex justify-between items-start">

            <p class="text-3xl font-black text-black">
              {{ nombreChambres }}
            </p>

            <img
              :src="bed"
              alt="Bed icon"
              class="w-6 h-6 object-contain"
            />

          </div>


          <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">
            Chambres disponibles
          </p>


        </div>
        <div
          class="bg-white p-5 rounded-xl shadow border border-slate-100
          flex flex-col justify-between transition-all duration-300
          hover:shadow-md cursor-pointer min-h-[110px]"
        >

          <div class="flex justify-between items-start">


            <p class="text-3xl font-black text-black">
              {{ nombreClients }}
            </p>


            <img
              :src="activitie"
              alt="Clients icon"
              class="w-6 h-6 object-contain"
            />


          </div>


          <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">
            Clients enregistrés
          </p>


        </div>
        <div
          class="bg-white p-5 rounded-xl shadow border border-slate-100
          flex flex-col justify-between transition-all duration-300
          hover:shadow-md cursor-pointer min-h-[110px]"
        >

          <div class="flex justify-between items-start">


            <p class="text-3xl font-black text-black">
              {{ nombreReservations }}
            </p>


            <img
              :src="rocket"
              alt="Reservation icon"
              class="w-6 h-6 object-contain"
            />


          </div>


          <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">
            Réservations
          </p>


        </div>
        <div
          class="bg-white p-5 rounded-xl shadow border border-slate-100
          flex flex-col justify-between transition-all duration-300
          hover:shadow-md cursor-pointer min-h-[110px]"
        >

          <div class="flex justify-between items-start">


            <p class="text-3xl font-black text-black">
              9.4
            </p>


            <img
              :src="star"
              alt="Star icon"
              class="w-6 h-6 object-contain"
            />


          </div>


          <p class="text-sm font-bold text-slate-900 mt-2 leading-tight">
            Note moyenne avis
          </p>


        </div>


      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-xl shadow p-5
          border border-transparent transition-all duration-300 hover:shadow-md"
        >

          <h2 class="text-xl font-bold mb-5 text-slate-700">
            Statut des chambres (Aujourd'hui)
          </h2>


          <apexchart
            width="100%"
            height="260"
            type="pie"
            :options="roomPieOptions"
            :series="roomPieSeries"
          />

        </div>
        <div
          class="bg-white rounded-xl shadow p-5
          border border-transparent transition-all duration-300 hover:shadow-md"
        >

          <h2 class="text-xl font-bold mb-5 text-slate-700">
            Taux d'occupation par type de chambre
          </h2>


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
        class="bg-white rounded-xl shadow p-5
        border border-transparent transition-all duration-300 hover:shadow-md"
      >

        <h2 class="text-xl font-bold mb-5 text-slate-700">
          Réservations mensuelles
        </h2>


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

import { ref, onMounted } from 'vue'

import { db } from '@/firebase'

import {
  collection,
  getDocs
} from 'firebase/firestore'
import PageHeader from '@/components/ui/PageHeader.vue'
import activitie from '@/assets/icon/activities.svg'
import bed from '@/assets/icon/bed.svg'
import rocket from '@/assets/icon/rocket.svg'
import star from '@/assets/icon/star.svg'
const nombreClients = ref(0)

const nombreReservations = ref(0)

const nombreChambres = ref(0)
const chargerStatistiques = async () => {

  try {


    const clientsSnapshot = await getDocs(
      collection(db, 'clients')
    )


    const reservationsSnapshot = await getDocs(
      collection(db, 'reservations')
    )


    const chambresSnapshot = await getDocs(
      collection(db, 'chambres')
    )



    nombreClients.value = clientsSnapshot.size

    nombreReservations.value = reservationsSnapshot.size

    nombreChambres.value = chambresSnapshot.size



  } catch (error) {

    console.error(
      "Erreur chargement statistiques :",
      error
    )

  }

}
onMounted(() => {

  chargerStatistiques()

})
const roomPieSeries = ref([
  45,
  35,
  15,
  5
])


const roomPieOptions = {

  chart: {
    id: 'room-pie-chart'
  },


  labels: [
    'Occupées',
    'Disponibles',
    'En nettoyage',
    'En maintenance'
  ],


  legend: {
    position: 'bottom'
  }

}
const occupancySeries = ref([

  {
    name: "Taux d'occupation (%)",

    data: [
      65,
      80,
      45,
      30
    ]
  }

])



const occupancyOptions = {

  chart: {
    id: 'occupancy-rate-chart',

    toolbar: {
      show:false
    }
  },


  plotOptions: {

    bar: {

      horizontal:true,

      borderRadius:4,

      barHeight:'35%'

    }

  },


  xaxis: {

    categories:[
      'Standard',
      'Double',
      'Suite Royale',
      'Suite Familiale'
    ],

    max:100

  }


}

const monthlyBookingSeries = ref([

  {

    name:'Réservations',

    data:[
      30,
      45,
      35,
      60,
      80,
      70
    ]

  }

])




const monthlyBookingOptions = {

  chart:{

    id:'reservation-chart',

    toolbar:{
      show:false
    }

  },


  plotOptions:{

    bar:{

      borderRadius:4,

      columnWidth:'50%'

    }

  },


  xaxis:{

    categories:[
      'Jan',
      'Fév',
      'Mars',
      'Avril',
      'Mai',
      'Juin'
    ]

  }

}



</script>
