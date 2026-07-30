<template>
  <div
    v-if="reservation"
    class="p-6 max-w-6xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim space-y-6"
  >
    <PageHeader
      title="Détails de la réservation"
      subtitle="Gestion des informations client et du séjour."
      back-to
      @back="router.back()"
    >
      <template #actions>
        <Badge :tone="stayStatusTone(reservation.stayStatus)">{{ reservation.stayStatus }}</Badge>
      </template>
    </PageHeader>

    <!-- BANDEAU D'IDENTITÉ -->
    <PageCard padding="none" class="overflow-hidden">
      <div class="relative px-8 pt-8 pb-16 bg-navy-500">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.navy.400)_0%,transparent_60%)] opacity-60"
        ></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar :name="reservation.name" size="lg" class="ring-4 ring-navy-400/50 shrink-0" />
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wider text-gold-200/80">
              Réservation #{{ reservation.id }}
            </p>
            <h2 class="text-2xl font-bold text-white truncate">{{ reservation.name }}</h2>
            <p class="mt-1 text-sm text-navy-100">Client enregistré · {{ reservation.type }}</p>
          </div>
        </div>
      </div>

      <div class="relative -mt-8 mx-8 mb-8 rounded-2xl bg-white border border-sand-200 shadow-md overflow-hidden">
        <div class="grid grid-cols-2 lg:grid-cols-4 divide-y divide-sand-200 lg:divide-y-0 lg:divide-x lg:divide-sand-200">
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="phone" class="w-3.5 h-3.5 text-lagoon-500" /> Téléphone
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ reservation.phone }}</p>
          </div>
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="mail" class="w-3.5 h-3.5 text-lagoon-500" /> Email
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ reservation.email }}</p>
          </div>
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="id-card" class="w-3.5 h-3.5 text-lagoon-500" /> Pièce d'identité
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ reservation.identityCard }}</p>
          </div>
          <div class="p-5">
            <p class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-300">
              <Icon name="globe" class="w-3.5 h-3.5 text-lagoon-500" /> Pays
            </p>
            <p class="mt-1.5 font-semibold text-navy-500 truncate">{{ reservation.country }}</p>
          </div>
        </div>
      </div>
    </PageCard>

    <!-- SECTION SÉJOUR -->
    <PageCard>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 rounded-lg bg-lagoon-50 flex items-center justify-center">
          <Icon name="bed" class="w-4 h-4 text-lagoon-500" />
        </div>
        <h3 class="text-lg font-bold text-navy-500">Informations du séjour</h3>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Type</p>
          <p class="mt-2 font-bold text-navy-500">{{ reservation.type }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Arrivée</p>
          <p class="mt-2 font-bold text-navy-500">{{ formattedDateDebut }}</p>
        </div>
        <div class="p-4 rounded-xl bg-sand-50 border border-sand-200">
          <p class="text-xs font-semibold uppercase tracking-wider text-navy-300">Départ</p>
          <p class="mt-2 font-bold text-navy-500">{{ formattedDateFin }}</p>
        </div>
        <div class="p-4 rounded-xl bg-gold-50 border border-gold-100">
          <p class="text-xs font-semibold uppercase tracking-wider text-gold-600">Durée</p>
          <p class="mt-2 font-bold text-navy-500">
            {{ numberOfDays }} <span class="text-sm font-medium text-navy-300">jour{{ numberOfDays > 1 ? 's' : '' }}</span>
          </p>
        </div>
      </div>
    </PageCard>

    <!-- SECTION SUIVI DU SÉJOUR -->
    <PageCard>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
          <Icon name="chart-bar" class="w-4 h-4 text-navy-400" />
        </div>
        <h3 class="text-lg font-bold text-navy-500">Suivi du séjour</h3>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button
          v-for="step in stayStatusSteps"
          :key="step.value"
          type="button"
          class="flex-1 flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          :class="
            step.active
              ? 'border-navy-500 bg-navy-500 text-white shadow-md'
              : 'border-sand-200 bg-white hover:border-navy-200 hover:bg-sand-50 text-navy-400'
          "
          @click="setStatus(step.value)"
        >
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            :class="step.active ? 'bg-white/15' : 'bg-sand-100'"
          >
            <Icon :name="step.icon" class="w-4 h-4" :class="step.active ? 'text-white' : 'text-navy-300'" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold" :class="step.active ? 'text-white' : 'text-navy-500'">
              {{ step.label }}
            </p>
            <p class="text-xs" :class="step.active ? 'text-navy-100' : 'text-navy-300'">{{ step.hint }}</p>
          </div>
        </button>
      </div>
    </PageCard>

    <!-- SECTION ACTIONS / DANGER ZONE -->
    <PageCard class="border-coral-100 bg-coral-50/40">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-coral-50 flex items-center justify-center shrink-0">
            <Icon name="trash" class="w-4 h-4 text-coral-500" />
          </div>
          <div>
            <p class="text-sm font-semibold text-navy-500">Supprimer cette réservation</p>
            <p class="text-xs text-navy-300 mt-0.5">
              Cette action est définitive et retirera la réservation de la liste.
            </p>
          </div>
        </div>
        <BaseButton variant="danger" title="Supprimer la réservation" @click="confirmDelete = true">
          <Icon name="trash" class="w-4 h-4" />
          Supprimer
        </BaseButton>
      </div>
    </PageCard>

    <Modal v-model="confirmDelete" size="sm">
      <h3 class="text-lg font-bold text-navy-400 mb-2">Supprimer la réservation ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="confirmDelete = false">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteReservation">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <EmptyState title="Réservation introuvable" description="Cette réservation n'existe pas ou a été supprimée." />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationsStore } from '@/stores/reservations'
import type { StayStatus } from '@/data/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import PageCard from '@/components/ui/PageCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'
import Avatar from '@/components/ui/Avatar.vue'

const route = useRoute()
const router = useRouter()
const reservationsStore = useReservationsStore()

const reservationId = Number(route.params.id)
const confirmDelete = ref(false)

const reservation = computed(() => reservationsStore.getById(reservationId))

const numberOfDays = computed(() => {
  if (!reservation.value) {
    return 0
  }

  const debut = new Date(reservation.value.dateDebut)
  const fin = new Date(reservation.value.dateFin)

  const difference = fin.getTime() - debut.getTime()

  return Math.ceil(difference / (1000 * 60 * 60 * 24))
})

function stayStatusTone(status: StayStatus) {
  switch (status) {
    case 'Check-in':
      return 'blue'
    case 'En cours':
      return 'green'
    case 'Check-out':
      return 'amber'
    case 'À venir':
    default:
      return 'gray'
  }
}

function setStatus(status: StayStatus) {
  reservationsStore.setStayStatus(reservationId, status)
}

function deleteReservation() {
  reservationsStore.remove(reservationId)
  confirmDelete.value = false
  router.push({ name: 'reservations' })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formattedDateDebut = computed(() => (reservation.value ? formatDate(reservation.value.dateDebut) : ''))
const formattedDateFin = computed(() => (reservation.value ? formatDate(reservation.value.dateFin) : ''))

const stayStatusSteps = computed(() => [
  {
    value: 'Check-in' as StayStatus,
    label: 'Check-in',
    hint: 'Client arrivé',
    icon: 'booking',
    active: reservation.value?.stayStatus === 'Check-in',
  },
  {
    value: 'En cours' as StayStatus,
    label: 'En cours',
    hint: 'Séjour en cours',
    icon: 'bed',
    active: reservation.value?.stayStatus === 'En cours',
  },
  {
    value: 'Check-out' as StayStatus,
    label: 'Check-out',
    hint: 'Client parti',
    icon: 'chevron-right',
    active: reservation.value?.stayStatus === 'Check-out',
  },
])
</script>
