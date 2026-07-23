<template>
  <div class="w-72 h-screen bg-gray-800 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
    <div>
      <div class="text-center mb-10 cursor-pointer">
        <h1 class="text-3xl font-extrabold tracking-wide">Sunbeach Hotel</h1>
        <div class="flex justify-center mt-4">
          <div class="w-24 h-1 bg-amber-200 rounded-full"></div>
        </div>
      </div>

          <div v-else>
            <button
              type="button"
              class="w-full text-xl flex items-center justify-between gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 border-amber-200 hover:translate-x-2"
              @click="toggleMenu(item.name)"
            >
              <span class="flex items-center gap-4">
                <img :src="item.icon" class="w-6 h-6" />
                {{ item.name }}
              </span>
              <span class="text-sm">{{ openMenu === item.name ? '▲' : '▼' }}</span>
            </button>

            <div v-if="openMenu === item.name" class="flex flex-col gap-1 mt-1 ml-6">
              <router-link
                v-if="!item.children"
                :to="item.path"
                class="text-base flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 border-amber-200 hover:translate-x-1"
                active-class="text-gray-200 shadow-lg border border-b-4 border-amber-200"
              >
                <Icon :name="item.icon" class="w-6 h-6 transition-transform duration-300" />
                <div>{{ item.name }}</div>
              </router-link>

              <div v-else>
                <button
                  type="button"
                  class="w-full text-base flex items-center justify-between gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 border-amber-200 hover:translate-x-1"
                  @click="toggleMenu(item.name)"
                >
                  <span class="flex items-center gap-4">
                    <Icon :name="item.icon" class="w-6 h-6" />
                    {{ item.name }}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4 shrink-0 transition-transform duration-200"
                    :class="{ 'rotate-180': openMenu === item.name }"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                <div v-if="openMenu === item.name" class="flex flex-col gap-1 mt-1 ml-6">
                  <router-link
                    v-for="sub in item.children"
                    :key="sub.name"
                    :to="sub.path"
                    class="text-sm px-4 py-2 rounded-xl font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-colors"
                    active-class="text-gray-100 bg-gray-700"
                  >
                    {{ sub.name }}
                  </router-link>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

import chambre from '@/assets/icon/chambre.svg'
import clients from '@/assets/icon/clients.svg'
import reserve from '@/assets/icon/reserve.svg'
import tableau from '@/assets/icon/tableau.svg'
import service from '@/assets/icon/service.svg'


const roleUtilisateur = localStorage.getItem('roleUtilisateur')


const openMenu = ref<string | null>(null)

const toggleMenu = (name: string) => {
  openMenu.value = openMenu.value === name ? null : name
}



const menu = computed(() => {

  const menus = [

    {
      name: "Tableau de bord",
      icon: tableau,
      path: "/charts"
    },

    {
      name: "Clients",
      icon: clients,
      path: "/customers"
    },

    {
      name: "Service",
      icon: service,
      children: [
        { name: "Chambres", path: "/rooms" },
        { name: "Restaurants", path: "/service/restaurants" },
        { name: "Salle de Réception", path: "/service/salle-de-reception" },
        { name: "Boite de Nuit", path: "/service/boite-de-nuit" },
        { name: "Spa", path: "/service/spa" },
        { name: "Salle de Jeux", path: "/service/salle-de-jeux" },
        { name: "Salle de Sport", path: "/service/salle-de-sport" },
      ]
    },

    {
      name: "Reservation",
      icon: reserve,
      path: "/reservation"
    },

    {
      name: "Personnel",
      icon: service,
      path: "/staff"
    }

  ]
  if (roleUtilisateur === 'administrateur') {

    menus.push({
      name: "Administrateur",
      icon: service,
      path: "/admin"
    })

  }


  return menus

})

</script>
