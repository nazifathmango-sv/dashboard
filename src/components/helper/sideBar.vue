<template>
  <div
    class="w-72 h-screen bg-navy-600 text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-gold-400/10"
  >

    <div>
      <div class="text-center mb-10 cursor-pointer">

        <h1 class="text-3xl font-extrabold tracking-wide text-sand-50">
          Sunbeach Hotel
        </h1>

        <div class="flex justify-center mt-4">
          <div class="w-24 h-1 bg-gold-400 rounded-full"></div>
        </div>

      </div>


      <div class="flex flex-col gap-6">


        <div
          v-for="section in displayedSections"
          :key="section.label"
        >

          <p
            class="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-navy-200"
          >
            {{ section.label }}
          </p>


          <div class="flex flex-col gap-2">


            <template
              v-for="item in section.items"
              :key="item.name"
            >


              <RouterLink
                v-if="!item.children"
                :to="item.path"
                class="text-base flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-navy-100 border border-transparent transition-all duration-300 hover:border-gold-400/40 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600"
                active-class=""
                exact-active-class="!text-sand-50 bg-navy-500 shadow-lg border-gold-400/60 border-b-4"
              >

                <Icon
                  :name="item.icon"
                  class="w-6 h-6"
                />

                <div>
                  {{ item.name }}
                </div>

              </RouterLink>




              <div v-else>


                <button
                  type="button"
                  class="w-full text-base flex items-center justify-between gap-4 px-4 py-3 rounded-2xl font-semibold text-navy-100 border border-transparent transition-all duration-300 hover:border-gold-400/40 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600 cursor-pointer"
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
                    class="text-sm px-4 py-2 rounded-xl font-medium text-navy-200 hover:text-sand-50 hover:bg-navy-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-600"
                    active-class=""
                    exact-active-class="text-sand-50 bg-navy-500"
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
import { useAuthStore } from '@/stores/auth'
import Icon from '@/components/ui/Icon.vue'

const openMenu = ref<string | null>(null)

const toggleMenu = (name: string) => {
  openMenu.value = openMenu.value === name ? null : name
}

const { role } = storeToRefs(useAuthStore())

const sections = [
  {
    label: "Vue d'ensemble",
    items: [
      { name: 'Tableau de bord', icon: 'dashboard', path: '/charts' },
      { name: 'Planning', icon: 'calendar', path: '/charts/planning' },
      { name: 'Incidents', icon: 'booking', path: '/charts/incidents', role: ['administrateur'] },

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

const SERVICE_CATEGORIES = [
  { name: 'Chambres', category: 'bed' },
  { name: 'Restaurants', category: 'restaurant' },
  { name: 'Salle de Réception', category: 'party' },
  { name: 'Boite de Nuit', category: 'nightclub' },
  { name: 'Spa', category: 'spa' },
  { name: 'Salle de Jeux', category: 'games' },
  { name: 'Salle de Sport', category: 'sport' },
]

const serviceChildren = computed(() => [
  { name: 'Tous les services', path: '/charts/service' },
  ...SERVICE_CATEGORIES.map((c) => ({ name: c.name, path: `/charts/service?category=${c.category}` })),
])

const displayedSections = computed(() =>
  sections.map((section) => {
    const items = section.items
      .map((item: any) => (item.name === 'Service' ? { ...item, children: serviceChildren.value } : item))
      .filter((item: any) => {
        if (!item.role) return true
        return item.role.includes(role.value || '')
      })

    return {
      ...section,
      items,
    }
  }),
)
</script>
