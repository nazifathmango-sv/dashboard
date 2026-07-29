<template>
  <div v-if="service" class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader :title="service.titre" back-to @back="router.back()" />

    <div class="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden mb-8">
      <img :src="service.image" :alt="service.titre" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
      <div class="absolute bottom-6 left-6 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white p-2.5">
          <ServiceIcon :icon="service.icon" />
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-white">{{ service.titre }}</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white rounded-3xl p-8 border border-sand-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <h3 class="text-lg font-semibold text-navy-500 mb-4">Présentation</h3>
        <p class="text-navy-300 leading-relaxed">
          {{ service.description }}
        </p>

        <h3 class="text-lg font-semibold text-navy-500 mt-8 mb-4">Caractéristiques</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="feature in service.caracteristiques"
            :key="feature"
            class="flex items-center gap-3 p-3 rounded-xl border border-sand-200 bg-sand-50/60 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-lagoon-50 text-lagoon-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            <span class="text-sm text-navy-400">{{ feature }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-3xl p-8 border border-sand-200 shadow-sm h-fit space-y-6 hover:shadow-md transition-shadow duration-300"
      >
        <h3 class="text-lg font-semibold text-navy-500">Informations pratiques</h3>

        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center text-gold-600 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-navy-200">Horaires</p>
            <p class="mt-1 font-medium text-navy-500">{{ service.horaires }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.827-.65 1.995-.833 3.061-.535" />
            </svg>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-navy-200">Tarif / Capacité</p>
            <p class="mt-1 font-medium text-navy-500">{{ service.info }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <EmptyState title="Service introuvable" description="Ce service n'existe pas ou a été retiré." />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ServiceIcon from '@/components/ui/ServiceIcon.vue'

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const service = computed(() => services.value.find((s) => s.slug === route.params.slug))
</script>
