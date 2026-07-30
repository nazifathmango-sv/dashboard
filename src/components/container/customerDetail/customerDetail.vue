<template>
  <div
    v-if="client"
    class="p-6 max-w-6xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim space-y-6"
  >
    <PageHeader
      title="Détails du client"
      subtitle="Informations enregistrées sur ce client."
      back-to
      @back="router.back()"
    />

    <!-- BANDEAU D'IDENTITÉ -->
    <PageCard padding="none" class="overflow-hidden">
      <div class="relative px-8 pt-8 pb-16 bg-navy-500">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.navy.400)_0%,transparent_60%)] opacity-60"
        ></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar :name="`${client.nom} ${client.prenom}`" size="lg" class="ring-4 ring-navy-400/50 shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold uppercase tracking-wider text-gold-200/80">Client #{{ client.id }}</p>
            <h2 class="text-2xl font-bold text-white truncate">{{ client.nom }} {{ client.prenom }}</h2>
            <p class="mt-1 text-sm text-navy-100">{{ client.nationalite }}</p>
          </div>
          <Badge tone="gray" class="!bg-white/10 !text-white !border-white/20 shrink-0">Client enregistré</Badge>
        </div>
      </div>

      <div class="relative -mt-8 mx-8 mb-8 rounded-2xl bg-white border border-sand-200 shadow-md overflow-hidden">
        <div
          class="grid divide-y divide-sand-200 lg:divide-y-0 lg:divide-x lg:divide-sand-200"
          :class="client.email ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'"
        >
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="phone" class="w-3.5 h-3.5 text-lagoon-500" /> Téléphone
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ client.telephone }}</p>
          </div>
          <div class="p-5" v-if="client.email">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="mail" class="w-3.5 h-3.5 text-lagoon-500" /> Email
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ client.email }}</p>
          </div>
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="location" class="w-3.5 h-3.5 text-lagoon-500" /> Adresse
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ client.adresse }}</p>
          </div>
        </div>
      </div>
    </PageCard>

    <!-- SECTION ÉTAT CIVIL -->
    <PageCard>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 rounded-lg bg-lagoon-50 flex items-center justify-center">
          <Icon name="clients" class="w-4 h-4 text-lagoon-500" />
        </div>
        <h3 class="text-lg font-bold text-navy-500">État civil</h3>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Sexe</p>
          <p class="mt-2 font-bold text-navy-500">{{ client.sexe }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Date de naissance</p>
          <p class="mt-2 font-bold text-navy-500">{{ formatDate(client.dateNaissance) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Lieu de naissance</p>
          <p class="mt-2 font-bold text-navy-500">{{ client.lieuNaissance }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Nationalité</p>
          <p class="mt-2 font-bold text-navy-500">{{ client.nationalite }}</p>
        </div>
      </div>
    </PageCard>

    <!-- SECTION IDENTITÉ & ENREGISTREMENT -->
    <PageCard>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center">
          <Icon name="id-card" class="w-4 h-4 text-gold-600" />
        </div>
        <h3 class="text-lg font-bold text-navy-500">Identité & enregistrement</h3>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Type de pièce</p>
          <p class="mt-2 font-bold text-navy-500">{{ client.typePiece }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
            <Icon name="globe" class="w-3.5 h-3.5 text-navy-300" /> Pays de provenance
          </p>
          <p class="mt-2 font-bold text-navy-500">{{ client.paysProvenance }}</p>
        </div>
        <div class="p-4 rounded-xl bg-gold-50 border border-gold-100">
          <p class="text-xs font-semibold uppercase tracking-wider text-gold-600">Date d'enregistrement</p>
          <p class="mt-2 font-bold text-navy-500">{{ formatDate(client.dateEnregistrement) }}</p>
        </div>
      </div>
    </PageCard>
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
import PageCard from '@/components/ui/PageCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Icon from '@/components/ui/Icon.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/Avatar.vue'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

const clientId = Number(route.params.id)

const client = computed(() => clientsStore.getById(clientId))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
