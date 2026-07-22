<template>
  <div class="p-6" v-if="service">
    <button
      class="mb-4 text-sm font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
      @click="router.back()"
    >
      ← Retour
    </button>

    <div class="bg-white rounded-xl shadow overflow-hidden max-w-3xl">
      <img
        :src="service.image"
        :alt="service.titre"
        class="w-full h-72 object-cover"
      />
      <div class="p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
          {{ service.titre }}
        </h1>
        <p class="text-gray-600 leading-relaxed text-lg">
          {{ service.description }}
        </p>
      </div>
    </div>
  </div>

  <div v-else class="p-6">
    <p class="text-gray-500">Service introuvable.</p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { services } from '@/data/services'

const route = useRoute()
const router = useRouter()

const service = computed(() =>
  services.find((s) => s.slug === route.params.slug)
)
</script>
