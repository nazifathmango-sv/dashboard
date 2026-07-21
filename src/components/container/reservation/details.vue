<template>
  <div v-if="reservation" class="p-8 max-w-7xl mx-auto bg-[#f8f8f6] min-h-screen rounded-3xl">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 tracking-tight">
          Détails de la réservation
        </h1>
        <p class="text-gray-500 mt-2">Gestion des informations client et du séjour.</p>
      </div>
      <button
        @click="router.back()"
        class="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
      >
        Retour
      </button>
    </div>
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
            <p class="text-xs uppercase tracking-wider text-gray-400">Téléphone</p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.phone }}
            </p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Email</p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.email }}
            </p>
          </div>

          <div class="group border-b pb-4 hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Pièce d'identité</p>

            <p class="mt-1 font-medium text-gray-800">
              {{ reservation.identityCard }}
            </p>
          </div>

          <div class="group hover:pl-2 transition-all duration-300">
            <p class="text-xs uppercase tracking-wider text-gray-400">Pays</p>

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
            <p class="text-xs uppercase tracking-wider text-gray-400">Type</p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.type }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Arrivée</p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.dateDebut }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Départ</p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">
              {{ reservation.dateFin }}
            </p>
          </div>

          <div
            class="p-6 rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300"
          >
            <p class="text-xs uppercase tracking-wider text-gray-400">Durée</p>

            <p class="mt-3 font-semibold text-gray-900 text-lg">{{ numberOfDays }} jours</p>
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
          <button
            class="px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Supprimer
          </button>

          <button
            class="px-7 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500 text-xl">Réservation introuvable.</p>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Reservation {
  id: number
  name: string
  phone: string
  email: string
  identityCard: string
  country: string
  type: string
  dateDebut: string
  dateFin: string
}

const reservations: Reservation[] = [
  {
    id: 1,
    name: 'MANGO Nazifath',
    phone: '+229 01 60 00 00 00',
    email: 'nazifath@example.com',
    identityCard: 'B1234567',
    country: 'Bénin',
    type: 'Chambre Luxe',
    dateDebut: '2026-07-20',
    dateFin: '2026-07-25',
  },
  {
    id: 2,
    name: 'KODJO Jean',
    phone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Salle de fête',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
  },
  {
    id: 3,
    name: 'KODJO Jean',
    phone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Restaurants',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
  },
]

const reservationId = Number(route.params.id)

const reservation = computed<Reservation | undefined>(() => {
  return reservations.find((item) => item.id === reservationId)
})

const numberOfDays = computed(() => {
  if (!reservation.value) {
    return 0
  }

  const debut = new Date(reservation.value.dateDebut)
  const fin = new Date(reservation.value.dateFin)

  const difference = fin.getTime() - debut.getTime()

  return Math.ceil(difference / (1000 * 60 * 60 * 24))
})
</script>
