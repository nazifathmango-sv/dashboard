<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Services de l'hôtel" subtitle="Découvrez l'ensemble des prestations proposées à nos clients." />

    <EmptyState
      v-if="services.length === 0"
      title="Aucun service disponible"
      description="Les services apparaîtront ici une fois ajoutés."
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        v-for="service in services"
        :key="service.id"
        class="group relative text-left rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        @click="handleClick(service)"
      >
        <div class="relative h-56 w-full overflow-hidden">
          <img
            :src="service.image"
            :alt="service.titre"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div class="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white p-2">
            <ServiceIcon :icon="service.icon" />
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-5">
            <h3 class="text-xl font-bold text-white mb-1">
              {{ service.titre }}
            </h3>
            <p class="text-sm text-white/80 line-clamp-2">
              {{ service.description }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { services, type Service } from '@/data/services'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ServiceIcon from '@/components/ui/ServiceIcon.vue'

const router = useRouter()

const handleClick = (service: Service) => {
  if (service.titre === 'Chambres') {
    router.push('/rooms')
  } else {
    router.push(`/service/${service.slug}`)
  }
}
</script>
