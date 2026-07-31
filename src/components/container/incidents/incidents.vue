<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader
      title="Incidents"
      subtitle="Suivi des problèmes signalés par les clients pendant leur séjour."
    />
    <div class="mb-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-navy-300">
            Liste des incidents
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher  problème..."
            class="w-full sm:w-80 px-4 py-3 bg-sand-50 border border-sand-300 rounded-2xl text-sm text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition"
          />
        </div>
      </div>
    </div>

    <EmptyState
      v-if="filteredIncidents.length === 0"
      title="Aucun incident trouvé"
      description="Aucun incident ne correspond à votre recherche pour le moment."
    />
    <template v-else>
      <div class="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div class="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 bg-sand-50 text-xs font-semibold uppercase text-navy-300 tracking-wide">
          <div>Client</div>
          <div>Chambre</div>
          <div>Date</div>
          <div>Statut</div>
          <div>Problème</div>
        </div>

        <TransitionGroup
          tag="div"
          name="list-row"
          class="divide-y divide-sand-100"
        >
          <div
            v-for="(incident, index) in paginatedIncidents"
            :key="incident.id"
            :style="{ transitionDelay: `${Math.min(index * 20, 200)}ms` }"
            class="p-5 md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr_1.5fr] gap-4 bg-white hover:bg-sand-50 transition-colors duration-150"
          >
            <div class="space-y-1">
              <div class="font-semibold text-navy-600">{{ incident.client }}</div>
              <div class="text-sm text-navy-400 md:hidden">{{ incident.issue }}</div>
            </div>
            <div class="text-navy-500">{{ incident.room }}</div>
            <div class="text-navy-500">{{ incident.date }}</div>
            <div>
              <Badge :tone="statusTone(incident.status)">{{ incident.status }}</Badge>
            </div>
            <div>
              <div class="text-sm text-navy-500 hidden md:block">{{ incident.issue }}</div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" class="mt-6" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Icon from '@/components/ui/Icon.vue'
import Badge from '@/components/ui/Badge.vue'
import Pagination from '@/components/ui/Pagination.vue'
import type { Incident } from '@/data/incidents'
import { incidents as seedIncidents } from '@/data/incidents'

const PAGE_SIZE = 10
const searchQuery = ref('')
const currentPage = ref(1)

const filteredIncidents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return seedIncidents.filter((incident) => {
    if (!query) return true
    return [incident.client, incident.room, incident.issue, incident.status]
      .some((field) => field.toLowerCase().includes(query))
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredIncidents.value.length / PAGE_SIZE), 1))

const paginatedIncidents = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredIncidents.value.slice(start, start + PAGE_SIZE)
})

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
}

function statusTone(status: Incident['status']) {
  if (status === 'Ouvert') return 'red'
  if (status === 'En cours') return 'amber'
  return 'green'
}
</script>
