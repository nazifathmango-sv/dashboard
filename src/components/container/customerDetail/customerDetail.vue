<template>
  <div
    v-if="client"
    class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim"
  >
    <PageHeader
      title="Détails du client"
      subtitle="Informations enregistrées sur ce client."
      back-to
      @back="router.back()"
    />

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div
        class="bg-white rounded-2xl shadow-sm p-6 border border-sand-200 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full bg-navy-500 flex items-center justify-center text-white text-4xl font-semibold shadow-sm"
          >
            {{ client.nom.charAt(0) }}
          </div>

          <h2 class="mt-5 text-2xl font-bold text-navy-500 text-center">
            {{ client.nom }} {{ client.prenom }}
          </h2>

          <Badge tone="gray" class="mt-3">Client enregistré</Badge>
        </div>

        <div class="mt-8 space-y-5">
          <div class="group border-b border-sand-200 pb-4 transition-all duration-200 hover:pl-1">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="phone" class="w-3.5 h-3.5" />
              Téléphone
            </p>
            <p class="mt-1 font-medium text-navy-500">{{ client.telephone }}</p>
          </div>

          <div
            v-if="client.email"
            class="group border-b border-sand-200 pb-4 transition-all duration-200 hover:pl-1"
          >
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="mail" class="w-3.5 h-3.5" />
              Email
            </p>
            <p class="mt-1 font-medium text-navy-500">{{ client.email }}</p>
          </div>

          <div class="group border-b border-sand-200 pb-4 transition-all duration-200 hover:pl-1">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="location" class="w-3.5 h-3.5" />
              Adresse
            </p>
            <p class="mt-1 font-medium text-navy-500">{{ client.adresse }}</p>
          </div>

          <div class="group transition-all duration-200 hover:pl-1">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="location" class="w-3.5 h-3.5" />
              Numéro de pièce
            </p>
            <p class="mt-1 font-medium text-navy-500">{{ client.paysProvenance }}</p>
          </div>
        </div>
      </div>

      <div
        class="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-sand-200 hover:shadow-md transition-shadow duration-300"
      >
        <h2 class="text-2xl font-bold text-navy-500 mb-6">Informations du client</h2>

        <div class="grid sm:grid-cols-2 gap-4">
          <div
            class="p-5 rounded-xl border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Sexe</p>
            <p class="mt-2 font-semibold text-navy-500 text-lg">{{ client.sexe }}</p>
          </div>

          <div
            class="p-5 rounded-xl border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Date de naissance
            </p>
            <p class="mt-2 font-semibold text-navy-500 text-lg">{{ client.dateNaissance }}</p>
          </div>

          <div
            class="p-5 rounded-xl border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="location" class="w-3.5 h-3.5" />
              Lieu de naissance
            </p>
            <p class="mt-2 font-semibold text-navy-500 text-lg">{{ client.lieuNaissance }}</p>
          </div>

          <div
            class="p-5 rounded-xl border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="id-card" class="w-3.5 h-3.5" />
              Type de pièce
            </p>
            <p class="mt-2 font-semibold text-navy-500 text-lg">{{ client.typePiece }}</p>
          </div>

          <div
            class="p-5 rounded-xl border border-sand-200 hover:border-sand-300 hover:bg-sand-50 transition-colors duration-200"
          >
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Date d'enregistrement
            </p>
            <p class="mt-2 font-semibold text-navy-500 text-lg">{{ client.dateEnregistrement }}</p>
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
import Badge from '@/components/ui/Badge.vue'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

const clientId = Number(route.params.id)

const client = computed(() => clientsStore.getById(clientId))
</script>
