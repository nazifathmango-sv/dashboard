<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <PageHeader title="Nos Chambres" subtitle="Aperçu des chambres et suites disponibles à l'hôtel." />

    <EmptyState
      v-if="rooms.length === 0"
      title="Aucune chambre disponible"
      description="Les chambres apparaîtront ici une fois ajoutées."
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        <div class="relative h-48 w-full overflow-hidden">
          <img
            :src="room.image"
            :alt="room.titre"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

          <div class="absolute top-3 right-3">
            <Badge :tone="room.statut === 'Disponible' ? 'green' : 'red'">{{ room.statut }}</Badge>
          </div>

          <h3 class="absolute bottom-4 left-5 text-xl font-bold text-white">
            {{ room.titre }}
          </h3>
        </div>

        <div class="p-5">
          <p class="text-sm text-gray-500 mb-4">
            {{ room.description }}
          </p>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Prix</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.prix }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Personnes</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.personnes }}</p>
            </div>
            <div class="bg-amber-50 rounded-lg p-2">
              <p class="text-xs text-gray-500">Lit</p>
              <p class="text-sm font-semibold text-gray-800">{{ room.lit }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { rooms } from '@/data/rooms'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
</script>
