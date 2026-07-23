<template>
  <div class="bg-white rounded-xl shadow p-5">
    <h2 class="text-xl font-bold mb-5">Liste des clients</h2>

    <div v-if="clients.length === 0" class="text-center text-gray-400 py-10">
      Aucun client enregistré pour l'instant.
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="client in clients"
        :key="client.id"
        class="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
        @click="router.push(`/customers/${client.id}`)"
      >
        <div
          class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold shrink-0"
        >
          {{ client.nom.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="font-bold text-gray-800">
            {{ client.nom }} {{ client.prenom }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ client.telephone }}
          </p>
        </div>
        <span class="text-sm text-gray-400">{{ client.sexe }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { clients } from '@/data/clients'

const router = useRouter()
</script>
