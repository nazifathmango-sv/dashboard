<template>
  <div v-if="reservation" class="p-8 max-w-7xl mx-auto bg-gray-50/50 min-h-screen rounded-3xl page-enter-anim">
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
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div
        class="bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center text-white text-5xl font-semibold shadow-lg"
          >
            {{ reservation.name.charAt(0) }}
          </div>

          <h2 class="mt-6 text-2xl font-semibold text-gray-900">
            {{ reservation.name }}
          </h2>

          <p class="mt-3 text-sm text-gray-500">Client enregistré</p>
        </div>

        <div class="mt-10 space-y-6">
          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="phone" class="w-3.5 h-3.5" />
              Téléphone
            </p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.phone }}
            </p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="mail" class="w-3.5 h-3.5" />
              Email
            </p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.email }}
            </p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="id-card" class="w-3.5 h-3.5" />
              Pièce d'identité
            </p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.identityCard }}
            </p>
          </div>

          <div class="group hover:pl-2 transition-all duration-300">
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="location" class="w-3.5 h-3.5" />
              Pays
            </p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.country }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="xl:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
      >
        <h2 class="text-2xl font-semibold text-gray-900 mb-10">Informations du séjour</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="bed" class="w-3.5 h-3.5" />
              Type
            </p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.type }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Arrivée
            </p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.dateDebut }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Départ
            </p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.dateFin }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400">
              <Icon name="calendar" class="w-3.5 h-3.5" />
              Durée
            </p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ numberOfDays }} jours</p>
          </div>
        </div>

        <div class="mt-10">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Suivi du séjour</h3>
          <div class="flex flex-wrap gap-3">
            <BaseButton
              size="sm"
              :variant="reservation.stayStatus === 'Check-in' ? 'primary' : 'secondary'"
              @click="setStatus('Check-in')"
            >
              Marquer arrivé (check-in)
            </BaseButton>
            <BaseButton
              size="sm"
              :variant="reservation.stayStatus === 'En cours' ? 'primary' : 'secondary'"
              @click="setStatus('En cours')"
            >
              Marquer en cours
            </BaseButton>
            <BaseButton
              size="sm"
              :variant="reservation.stayStatus === 'Check-out' ? 'primary' : 'secondary'"
              @click="setStatus('Check-out')"
            >
              Marquer parti (check-out)
            </BaseButton>
          </div>
        </div>

        <div class="mt-10">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Observations</h3>

          <textarea
            rows="6"
            class="w-full rounded-2xl border border-gray-200 p-5 focus:outline-none focus:border-gray-900 transition resize-none"
            placeholder="Ajouter une remarque..."
          ></textarea>
        </div>
        <div class="flex justify-end gap-4 mt-10">
          <BaseButton variant="danger" title="Supprimer" @click="confirmDelete = true">
            <Icon name="trash" class="w-4 h-4" />
          </BaseButton>
        </div>
      </div>
    </div>

    <Modal v-model="confirmDelete" size="sm">
      <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer la réservation ?</h3>
      <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
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
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'

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
</script>
