<template>
  <div
    class="w-72 h-screen bg-gray-800 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
  >

    <div>

      <!-- LOGO -->
      <div class="text-center mb-10 cursor-pointer">

        <h1 class="text-3xl font-extrabold tracking-wide">
          Sunbeach Hotel
        </h1>

        <div class="flex justify-center mt-4">
          <div class="w-24 h-1 bg-amber-200 rounded-full"></div>
        </div>

      </div>


      <!-- MENU -->
      <div class="flex flex-col gap-6">


        <div
          v-for="section in displayedSections"
          :key="section.label"
        >

          <p
            class="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            {{ section.label }}
          </p>


          <div class="flex flex-col gap-2">


            <template
              v-for="item in section.items"
              :key="item.name"
            >


              <!-- MENU SIMPLE -->
              <RouterLink
                v-if="!item.children"
                :to="item.path"
                class="text-base flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 hover:translate-x-1"
                active-class="text-gray-200 shadow-lg border border-b-4 border-amber-200"
              >

                <Icon
                  :name="item.icon"
                  class="w-6 h-6"
                />

                <div>
                  {{ item.name }}
                </div>

              </RouterLink>




              <!-- MENU AVEC SOUS MENU -->
              <div v-else>


                <button
                  type="button"
                  class="w-full text-base flex items-center justify-between gap-4 px-4 py-3 rounded-2xl font-semibold text-gray-300 transition-all duration-300 hover:border hover:border-amber-200 hover:translate-x-1"
                  @click="toggleMenu(item.name)"
                >

                  <span class="flex items-center gap-4">

                    <Icon
                      :name="item.icon"
                      class="w-6 h-6"
                    />

                    {{ item.name }}

                  </span>


                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{
                      'rotate-180': openMenu === item.name
                    }"
                  >

                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />

                  </svg>


                </button>



                <div
                  v-if="openMenu === item.name"
                  class="flex flex-col gap-1 mt-1 ml-6"
                >

                  <RouterLink
                    v-for="sub in item.children"
                    :key="sub.name"
                    :to="sub.path"
                    class="text-sm px-4 py-2 rounded-xl font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-colors"
                    active-class="text-gray-100 bg-gray-700"
                  >

                    {{ sub.name }}

                  </RouterLink>


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
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import Icon from '@/components/ui/Icon.vue'

const openMenu = ref<string | null>(null)

const toggleMenu = (name: string) => {
  openMenu.value = openMenu.value === name ? null : name
}

// récupérer le rôle connecté
const role = localStorage.getItem('role')

const sections = [
  {
    label: "Vue d'ensemble",
    items: [
      { name: 'Tableau de bord', icon: 'dashboard', path: '/charts' },
      { name: 'Planning', icon: 'calendar', path: '/charts/planning' },
    ],
  },
  {
    label: 'Activité',
    items: [
      { name: 'Réservations', icon: 'booking', path: '/charts/reservation' },
      { name: 'Clients', icon: 'clients', path: '/charts/customers' },
    ],
  },
  {
    label: 'Établissement',
    items: [{ name: 'Service', icon: 'service', children: [] }],
  },
  {
    label: 'Gestion',
    items: [
      { name: 'Personnel', icon: 'staff', path: '/charts/staff', role: ['administrateur'] },
      { name: 'Administrateur', icon: 'admin', path: '/charts/admin', role: ['administrateur'] },
    ],
  },
]

// services from Firestore (store will fallback to seed data until Firestore has docs)
const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const serviceChildren = computed(() => [
  { name: 'Tous les services', path: '/charts/service' },
  ...services.value.map((s: any) => ({ name: s.titre, path: `/charts/service/${s.slug}` })),
])

const displayedSections = computed(() =>
  sections.map((section) => {
    const items = section.items
      .map((item: any) => (item.name === 'Service' ? { ...item, children: serviceChildren.value } : item))
      .filter((item: any) => {
        if (!item.role) return true
        return item.role.includes(role || '')
      })

    return {
      ...section,
      items,
    }
  }),
)
</script>
