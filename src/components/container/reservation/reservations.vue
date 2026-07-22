<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center justify-between w-full gap-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom ou type..."
            class="w-96 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
          />

          <button
            @click="openAddPopup"
            class="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow-md transition cursor-pointer whitespace-nowrap"
          >
            Nouvelle réservation
          </button>
        </div>
      </div>
    </div>
    <div
      class="hidden md:grid grid-cols-5 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase"
    >
      <div>Nom et prénoms</div>
      <div>Type</div>
      <div>Date début</div>
      <div>Date fin</div>
      <div class="text-center">Actions</div>
    </div>
    <div class="bg-white rounded-b-2xl shadow-sm overflow-hidden">
      <div
        v-for="(reservation, index) in filteredReservations"
        :key="reservation.id"
        class="p-5 md:grid md:grid-cols-5 gap-6 items-center border-b hover:bg-gray-50"
      >
        <div>
          <div
            @click="openDetails(reservation)"
            class="text-gray-900 font-medium cursor-pointer hover:text-indigo-600 transition"
          >
            {{ reservation.name }}
          </div>
        </div>
        <div>
          <div class="px-3 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            {{ reservation.type }}
          </div>
        </div>
        <div class="text-gray-600 text-sm">
          {{ reservation.dateDebut }}
        </div>
        <div class="text-gray-600 text-sm">
          {{ reservation.dateFin }}
        </div>
        <div class="flex justify-center items-center gap-3">
          <button
            @click="editReservation(reservation, index)"
            class="flex items-center justify-center w-9 h-9 rounded-lg transition cursor-pointer hover:bg-gray-100"
            title="Modifier"
          >
            <img :src="Compose" alt="Modifier" class="w-5 h-5" />
          </button>

          <button
            @click="deleteReservation(index)"
            class="flex items-center justify-center w-9 h-9 rounded-lg transition cursor-pointer hover:bg-gray-100"
            title="Supprimer"
          >
            <img :src="Bin" alt="Supprimer" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showPopup"
      @click="closePopup"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        @click.stop
        class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-y-auto max-h-[90vh]"
      >
        <h3 class="text-xl font-bold text-gray-800 text-center mb-6">
          {{ isEditing ? 'Modifier la réservation' : "Fiche d'enregistrement client" }}
        </h3>
        <div @submit.prevent="saveReservation" class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase"> Nom et prénoms </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="MANGO Nazifath"
              class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase"> Téléphone </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="+229 01 00 00 00 00"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase"> Adresse Email </label>

              <input
                v-model="form.email"
                type="email"
                required
                placeholder="exemple@gmail.com"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase">
                N° Pièce d'identité
              </label>
              <input
                v-model="form.identityCard"
                type="text"
                required
                placeholder="B1234567"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase">
                Pays de résidence
              </label>
              <input
                v-model="form.country"
                type="text"
                required
                placeholder="Bénin"
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase">
              Type de réservation
            </label>
            <input
              v-model="form.type"
              type="text"
              required
              placeholder="Chambre / Salle de fête / Spa"
              class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase"> Date début </label>
              <input
                v-model="form.dateDebut"
                type="date"
                required
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase"> Date fin </label>
              <input
                v-model="form.dateFin"
                type="date"
                required
                class="w-full mt-1 px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-5">
            <button
              type="button"
              @click="closePopup"
              class="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white"
            >
              {{ isEditing ? 'Confirmer la modification' : 'Enregistrer & Réserver' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Compose from '@/assets/icon/compose.svg'
import Bin from '@/assets/icon/bin.svg'
const router = useRouter()
interface Reservation {
  id: number
  name: string
  identityCard: string
  country: string
  type: string
  dateDebut: string
  dateFin: string
}
const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editIndex = ref<number | null>(null)
const reservations = ref<Reservation[]>([
  {
    id: 1,
    name: 'MANGO Nazifath',
    identityCard: 'B1234567',
    country: 'Bénin',
    type: 'Chambre Luxe',
    dateDebut: '2026-07-20',
    dateFin: '2026-07-25',
  },
  {
    id: 2,
    name: 'KODJO Jean',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Salle de fête',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
  },
  {
    id: 3,
    name: 'KODJO Jean',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Restaurants',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
  },
])
const emptyForm = (): Reservation => ({
  id: 0,
  name: '',
  identityCard: '',
  country: '',
  type: '',
  dateDebut: '',
  dateFin: '',
})
const form = ref<Reservation>(emptyForm())
const filteredReservations = computed(() => {
  return reservations.value.filter((reservation) => {
    const search = searchQuery.value.toLowerCase()
    return (
      reservation.name.toLowerCase().includes(search) ||
      reservation.type.toLowerCase().includes(search)
    )
  })
})
const openAddPopup = () => {
  isEditing.value = false
  editIndex.value = null
  form.value = emptyForm()
  showPopup.value = true
}
const editReservation = (reservation: Reservation, index: number) => {
  isEditing.value = true
  editIndex.value = index
  form.value = { ...reservation }
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveReservation = () => {
  if (isEditing.value && editIndex.value !== null) {
    reservations.value[editIndex.value] = { ...form.value }
  } else {
    reservations.value.push({
      ...form.value,
      id: reservations.value.length + 1,
    })
  }
  closePopup()
}
const deleteReservation = (index: number) => {
  reservations.value.splice(index, 1)
}
const openDetails = (reservation: Reservation) => {
  router.push({
    name: 'reservation-details',
    params: {
      id: reservation.id,
    },
  })
}
</script>
