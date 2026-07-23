<template>
  <div v-if="client" class="p-8 max-w-7xl mx-auto bg-[#f8f8f6] min-h-screen rounded-3xl">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 tracking-tight">
          Détails du client
        </h1>
        <p class="text-gray-500 mt-2">Informations enregistrées sur ce client.</p>
      </div>
      <button
        @click="router.back()"
        class="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
      >
        Retour
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Colonne de gauche : profil -->
      <div
        class="bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center text-white text-5xl font-semibold shadow-lg"
          >
            {{ client.nom.charAt(0) }}
          </div>

          <h2 class="mt-6 text-2xl font-semibold text-gray-900">
            {{ client.nom }} {{ client.prenom }}
          </h2>

          <p class="mt-3 text-sm text-gray-500">Client enregistré</p>
        </div>

        <div class="mt-10 space-y-6">
          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Téléphone</p>
            <p class="mt-1 font-medium text-gray-800">{{ client.telephone }}</p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Nationalité</p>
            <p class="mt-1 font-medium text-gray-800">{{ client.nationalite }}</p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Adresse</p>
            <p class="mt-1 font-medium text-gray-800">{{ client.adresse }}</p>
          </div>

          <div class="group hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Pays de provenance</p>
            <p class="mt-1 font-medium text-gray-800">{{ client.paysProvenance }}</p>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du client -->
      <div
        class="xl:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-2xl font-semibold text-gray-900 mb-10">Informations du client</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Sexe</p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.sexe }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Date de naissance</p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.dateNaissance }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Lieu de naissance</p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.lieuNaissance }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Type de pièce</p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.typePiece }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Date d'enregistrement</p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.dateEnregistrement }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500 text-xl">Client introuvable.</p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clients } from '@/data/clients'

const route = useRoute()
const router = useRouter()

const clientId = Number(route.params.id)

const client = computed(() => clients.find((c) => c.id === clientId))
</script>
