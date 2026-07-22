<template>
  <div class="bg-white rounded-xl shadow p-5">
    <h2 class="text-xl font-bold mb-5">Services de l'hôtel</h2>

    <nav class="max-w-xs">
      <button
        v-for="service in services"
        :key="service.id"
        class="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-amber-50 hover:text-gray-900 transition-colors border-b border-gray-100 last:border-b-0"
        @click="handleClick(service)"
      >
        {{ service.titre }}
      </button>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { services, type Service } from '@/data/services'

const router = useRouter()

const handleClick = (service: Service) => {
  if (service.titre === 'Chambres') {
    router.push('/rooms')
  } else {
    router.push(`/service/${service.slug}`)
  }
}
</script>
