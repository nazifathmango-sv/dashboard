<template>
  <div
    class="w-72 h-screen bg-gray-800  to-gray-900
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
          class=" text-xl flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 border-amber-200  hover:translate-x-2 " active-class="text-gray-200 shadow-lg border border-b-4 border-amber-200">
          <img :src="item.icon" class="w-6 h-6 transition-transform duration-300" active-class=""/>
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
    path:"/charts"
  },
{
    name:"Clients",
    icon:clients,
    path:"/customers"
  },


  {
    name:"Service",
    icon:service,
    path:"/service"
  },
 {
    name:"Reservation",
    icon:reserve,
    path:"/reservation"
  },

  {
    name:"Personnel ",
    icon:service,
    path:"/staff"
  },
{
    name:"Administrateur ",
    icon:service,
    path:"/administrateur"
  }
]

</script>
