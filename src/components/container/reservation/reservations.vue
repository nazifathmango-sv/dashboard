<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <PageHeader title="Réservations" subtitle="Gestion des réservations clients.">
      <template #actions>
        <BaseButton @click="openAddPopup">Nouvelle réservation</BaseButton>
      </template>
    </PageHeader>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou type..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
      />
    </div>

    <EmptyState
      v-if="filteredReservations.length === 0"
      title="Aucune réservation trouvée"
      description="Essayez une autre recherche ou créez une nouvelle réservation."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-5 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase rounded-t-2xl"
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
              class="text-gray-900 font-medium cursor-pointer hover:text-gray-600 transition"
            >
              {{ reservation.name }}
            </div>
          </div>
          <div>
            <Badge tone="blue">{{ reservation.type }}</Badge>
          </div>
          <div class="text-gray-600 text-sm">
            {{ reservation.dateDebut }}
          </div>
          <div class="text-gray-600 text-sm">
            {{ reservation.dateFin }}
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" @click="editReservation(reservation, index)">
              Modifier
            </BaseButton>
            <BaseButton size="sm" variant="danger" @click="confirmDelete(index)">Supprimer</BaseButton>
          </div>
        </div>
      </div>
    </template>

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
        <form @submit.prevent="saveReservation" class="space-y-4">
          <FormField v-model="form.name" label="Nom et prénoms" required placeholder="MANGO Nazifath" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-model="form.phone" type="tel" label="Téléphone" required placeholder="+229 01 00 00 00 00" />
            <FormField v-model="form.email" type="email" label="Adresse Email" required placeholder="exemple@gmail.com" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-model="form.identityCard" label="N° Pièce d'identité" required placeholder="B1234567" />
            <FormField v-model="form.country" label="Pays de résidence" required placeholder="Bénin" />
          </div>
          <FormField v-model="form.type" label="Type de réservation" required placeholder="Chambre / Salle de fête / Spa" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-model="form.dateDebut" type="date" label="Date début" required />
            <FormField v-model="form.dateFin" type="date" label="Date fin" required />
          </div>
          <div class="flex justify-end gap-3 pt-5">
            <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
            <BaseButton type="submit">
              {{ isEditing ? 'Confirmer la modification' : 'Enregistrer & Réserver' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="deleteIndex !== null"
      @click="cancelDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div @click.stop class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer la réservation ?</h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
          <BaseButton variant="danger" @click="deleteReservation">Supprimer</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'

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
const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editIndex = ref<number | null>(null)
const deleteIndex = ref<number | null>(null)
const reservations = ref<Reservation[]>([
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
])
const emptyForm = (): Reservation => ({
  id: 0,
  name: '',
  phone: '',
  email: '',
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
const confirmDelete = (index: number) => {
  deleteIndex.value = index
}
const cancelDelete = () => {
  deleteIndex.value = null
}
const deleteReservation = () => {
  if (deleteIndex.value !== null) {
    reservations.value.splice(deleteIndex.value, 1)
    deleteIndex.value = null
  }
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
