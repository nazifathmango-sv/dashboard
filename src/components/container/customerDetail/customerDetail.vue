<template>
  <div v-if="client" class="p-8 max-w-7xl mx-auto bg-gray-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader
      title="Détails du client"
      subtitle="Informations enregistrées sur ce client."
      back-to
      @back="router.back()"
    />

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="phone" class="w-3.5 h-3.5" />
              Téléphone
            </p>
            <p class="mt-1 font-medium text-gray-800">{{ client.telephone }}</p>
          </div>

          <div v-if="client.email" class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="mail" class="w-3.5 h-3.5" />
              Email
            </p>
            <p class="mt-1 font-medium text-gray-800">{{ client.email }}</p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="location" class="w-3.5 h-3.5" />
              Adresse
            </p>
            <p class="mt-1 font-medium text-gray-800">{{ client.adresse }}</p>
          </div>

          <div class="group hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="location" class="w-3.5 h-3.5" />
              Pays de provenance
            </p>
            <p class="mt-1 font-medium text-gray-800">{{ client.paysProvenance }}</p>
          </div>
        </div>
      </div>

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
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Date de naissance
            </p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.dateNaissance }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="location" class="w-3.5 h-3.5" />
              Lieu de naissance
            </p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.lieuNaissance }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="id-card" class="w-3.5 h-3.5" />
              Type de pièce
            </p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.typePiece }}</p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Date d'enregistrement
            </p>
            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ client.dateEnregistrement }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <EmptyState title="Client introuvable" description="Ce client n'existe pas ou a été supprimé." />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientsStore } from '@/stores/clients'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Icon from '@/components/ui/Icon.vue'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

const clientId = Number(route.params.id)

const client = computed(() => clientsStore.getById(clientId))
</script>
