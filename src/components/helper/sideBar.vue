<template>
  <div class="w-72 h-screen bg-gray-800 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
    <div>
      <div class="text-center mb-10 cursor-pointer">
        <h1 class="text-3xl font-extrabold tracking-wide">Sunbeach Hotel</h1>
        <div class="flex justify-center mt-4">
          <div class="w-24 h-1 bg-amber-200 rounded-full"></div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div v-for="section in sections" :key="section.label">
          <p class="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {{ section.label }}
          </p>
          <div class="flex flex-col gap-2">
            <template v-for="item in section.items" :key="item.name">
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
import { ref } from 'vue'
import Icon from '@/components/ui/Icon.vue'

const openMenu = ref<string | null>(null)

const toggleMenu = (name: string) => {
  openMenu.value = openMenu.value === name ? null : name
}

const sections = [
  {
    label: "Vue d'ensemble",
    items: [
      { name: 'Tableau de bord', icon: 'dashboard', path: '/charts' },
      { name: 'Planning', icon: 'calendar', path: '/planning' },
    ],
  },
  {
    label: 'Activité',
    items: [
      { name: 'Réservations', icon: 'booking', path: '/reservation' },
      { name: 'Clients', icon: 'clients', path: '/customers' },
    ],
  },
  {
    label: 'Établissement',
    items: [
      {
        name: 'Service',
        icon: 'service',
        children: [
          { name: 'Tous les services', path: '/service' },
          { name: 'Chambres', path: '/rooms' },
          { name: 'Restaurants', path: '/service/restaurants' },
          { name: 'Salle de Réception', path: '/service/salle-de-reception' },
          { name: 'Boite de Nuit', path: '/service/boite-de-nuit' },
          { name: 'Spa', path: '/service/spa' },
          { name: 'Salle de Jeux', path: '/service/salle-de-jeux' },
          { name: 'Salle de Sport', path: '/service/salle-de-sport' },
        ],
      },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { name: 'Personnel', icon: 'staff', path: '/staff' },
      { name: 'Administrateur', icon: 'admin', path: '/admin' },
    ],
  },
]
</script>
