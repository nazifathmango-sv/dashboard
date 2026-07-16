<template>
  <div
    class="w-72 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
    text-white p-6 shadow-2xl flex flex-col justify-between"
  >
    <div>
      <div class="text-center mb-10 cursor-pointer">
        <h1 class="text-3xl font-extrabold tracking-wide">
          Sunbeach Hotel
        </h1>
        <div class="flex justify-center mt-4">
          <div class="w-24 h-1 bg-amber-200 rounded-full"></div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <router-link
            v-for="item in menu"
          :key="item.name"
          :to="item.path"
          class=" text-lg
          flex items-center gap-4 px-4 py-3 rounded-2xl
          font-semibold text-gray-300
          transition-all duration-300
          hover:bg-gray-700 hover:text-white
          hover:translate-x-2
          "
          active-class="
           text-gray-900 shadow-lg
          "
        >
          <img
            :src="item.icon"
            class="w-6 h-6 transition-transform duration-300"
          />
          <div>
            {{item.name}}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import chambre from '@/assets/icon/chambre.svg'
import clients from '@/assets/icon/clients.svg'
import reserve from '@/assets/icon/reserve.svg'
import tableau from '@/assets/icon/tableau.svg'
import service from '@/assets/icon/service.svg'


const menu = [
  {
    name:"Tableau de bord",
    icon:tableau,
    path:"/"
  },

  {
    name:"Chambres",
    icon:chambre,
    path:"/chambres"
  },

  {
    name:"Réservations",
    icon:reserve,
    path:"/reservations"
  },

  {
    name:"Services",
    icon:service,
    path:"/services"
  },

  {
    name:"Clients",
    icon:clients,
    path:"/clients"
  },

  {
    name:"Personnel",
    icon:service,
    path:"/personnel"
  }

]

</script>
