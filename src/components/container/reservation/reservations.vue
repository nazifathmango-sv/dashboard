<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Réservations" subtitle="Gestion des réservations clients.">
      <template #actions>
        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Nouvelle réservation
        </BaseButton>
      </template>
    </PageHeader>

    <PageCard class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou type..."
        class="w-full md:w-96 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm text-navy-400 placeholder:text-navy-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus:bg-white"
      />
    </PageCard>

    <EmptyState
      v-if="filteredReservations.length === 0"
      title="Aucune réservation trouvée"
      description="Essayez une autre recherche ou créez une nouvelle réservation."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-6 gap-3 px-6 py-4 bg-white border-b font-semibold text-sm text-navy-300 uppercase rounded-t-2xl"
      >
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer transition-colors duration-150 hover:text-navy-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" @click="toggleSort('name')">
          Nom et prénoms
          <SortIcon :active="sortKey === 'name'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer transition-colors duration-150 hover:text-navy-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" @click="toggleSort('type')">
          Type
          <SortIcon :active="sortKey === 'type'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer transition-colors duration-150 hover:text-navy-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" @click="toggleSort('dateDebut')">
          Date début
          <SortIcon :active="sortKey === 'dateDebut'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer transition-colors duration-150 hover:text-navy-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" @click="toggleSort('dateFin')">
          Date fin
          <SortIcon :active="sortKey === 'dateFin'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer transition-colors duration-150 hover:text-navy-400 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" @click="toggleSort('stayStatus')">
          Statut séjour
          <SortIcon :active="sortKey === 'stayStatus'" :direction="sortDirection" />
        </button>
        <div class="text-center">Actions</div>
      </div>
      <TransitionGroup
        tag="div"
        name="list-row"
        class="bg-white overflow-hidden"
        :class="totalPages > 1 ? '' : 'rounded-b-2xl shadow-sm'"
      >
        <div
          v-for="(reservation, index) in paginatedReservations"
          :key="reservation.id"
          :style="{ transitionDelay: `${Math.min(index * 20, 200)}ms` }"
          class="p-5 md:grid md:grid-cols-6 gap-3 items-center border-b border-l-4 hover:bg-sand-50 hover:shadow-sm transition-colors duration-150 cursor-pointer"
          :class="rowBorderClass(reservation)"
          @click="openDetails(reservation)"
        >
          <div class="flex items-center gap-3">
            <Avatar :name="reservation.name" />
            <div
              class="text-navy-500 font-medium transition-colors duration-150 hover:text-navy-300 text-left rounded"
            >
              {{ reservation.name }}
            </div>
          </div>
          <div>
            <Badge tone="blue">{{ reservation.type }}</Badge>
          </div>
          <div class="text-navy-300 text-sm">
            {{ reservation.dateDebut }}
          </div>
          <div class="text-navy-300 text-sm">
            {{ reservation.dateFin }}
          </div>
          <div>
            <Badge :tone="stayStatusTone(reservation.stayStatus)">{{ reservation.stayStatus }}</Badge>
          </div>
          <div class="flex md:justify-center items-center gap-2 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" title="Modifier" @click.stop="editReservation(reservation)">
              <Icon name="edit" class="w-4 h-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" title="Supprimer" @click.stop="confirmDelete(reservation.id)">
              <Icon name="trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </TransitionGroup>
      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </template>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-navy-500 text-center mb-6">
        {{ isEditing ? 'Modifier la réservation' : "Fiche d'enregistrement client" }}
      </h3>
      <form @submit.prevent="saveReservation" class="space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Client</h4>
          <div class="space-y-4">
            <FormField
              v-model="form.name"
              label="Nom et prénoms"
              placeholder="MANGO Nazifath"
              :invalid="!!errors.name"
              :error="errors.name"
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.phone"
                type="tel"
                inputmode="tel"
                pattern="^[0-9+()\-\s]+$"
                label="Téléphone"
                placeholder="+229 01 00 00 00 00"
                :invalid="!!errors.phone"
                :error="errors.phone"
              />
              <FormField
                v-model="form.email"
                type="email"
                label="Adresse Email"
                placeholder="exemple@gmail.com"
                :invalid="!!errors.email"
                :error="errors.email"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.identityCard"
                label="N° Pièce d'identité"
                placeholder="B1234567"
                :invalid="!!errors.identityCard"
                :error="errors.identityCard"
              />
              <SelectField
                v-model="form.country"
                label="Pays de provenance"
                :invalid="!!errors.country"
                :error="errors.country"
              >
                <option value="">Sélectionner un pays</option>
                <option v-for="pays in paysOptions" :key="pays" :value="pays">{{ pays }}</option>
              </SelectField>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Séjour</h4>
          <div class="space-y-4">
            <SelectField
              v-model="form.type"
              label="Type de réservation"
              :invalid="!!errors.type"
              :error="errors.type"
            >
              <option value="">Sélectionner un service</option>
              <option v-for="service in services" :key="service.id" :value="service.titre">{{ service.titre }}</option>
            </SelectField>
            <SelectField v-model="roomIdField" label="Chambre associée (optionnel)">
              <option value="">Aucune (prestation hors chambre)</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.titre }}</option>
            </SelectField>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.dateDebut"
                type="date"
                label="Date début"
                :invalid="!!errors.dateDebut"
                :error="errors.dateDebut"
              />
              <FormField
                v-model="form.dateFin"
                type="date"
                label="Date fin"
                :invalid="!!errors.dateFin"
                :error="errors.dateFin"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
          <BaseButton type="submit">
            {{ isEditing ? 'Confirmer la modification' : 'Enregistrer & Réserver' }}
          </BaseButton>
        </div>
      </form>
    </Modal>

    <Modal :model-value="deleteId !== null" size="sm" @update:model-value="cancelDelete">
      <h3 class="text-lg font-bold text-navy-500 mb-2">Supprimer la réservation ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteReservation">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReservationsStore } from '@/stores/reservations'
import { useRoomsStore } from '@/stores/rooms'
import { useServicesStore } from '@/stores/services'
import type { Reservation, StayStatus } from '@/data/reservations'
import PageHeader from '@/components/ui/PageHeader.vue'
import PageCard from '@/components/ui/PageCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SelectField from '@/components/ui/SelectField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Icon from '@/components/ui/Icon.vue'
import Avatar from '@/components/ui/Avatar.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SortIcon from '@/components/ui/SortIcon.vue'

const router = useRouter()
const reservationsStore = useReservationsStore()
const { reservations } = storeToRefs(reservationsStore)
const { rooms } = storeToRefs(useRoomsStore())
const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const paysOptions = [
  'Bénin',
  'Burkina Faso',
  'Côte d’Ivoire',
  'Mali',
  'Sénégal',
  'Togo',
  'Niger',
  'Guinée',
  'Gabon',
  'Cameroun',
  'France',
  'Belgique',
  'Suisse',
  'Canada',
  'Maroc',
  'Algérie',
  'Tunisie',
  'Espagne',
  'Italie',
  'Allemagne',
  'Royaume-Uni',
  'États-Unis',
  'Congo',
  'Rwanda',
  'Burundi',
  'Madagascar',
  'Maurice',
  'Île Maurice',
  'Autre',
]

const PAGE_SIZE = 10

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const roomIdField = ref<number | ''>('')
const errors = ref<Record<string, string>>({})
const sortKey = ref<'name' | 'type' | 'dateDebut' | 'dateFin' | 'stayStatus'>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

type ReservationFormData = Omit<Reservation, 'id' | 'stayStatus'>

const emptyForm = (): ReservationFormData => ({
  name: '',
  phone: '',
  email: '',
  identityCard: '',
  country: '',
  type: '',
  dateDebut: '',
  dateFin: '',
})
const form = ref<ReservationFormData>(emptyForm())

const filteredReservations = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return reservations.value.filter(
    (reservation) =>
      reservation.name.toLowerCase().includes(search) || reservation.type.toLowerCase().includes(search),
  )
})

const sortedReservations = computed(() => {
  const dir = sortDirection.value === 'asc' ? 1 : -1
  return [...filteredReservations.value].sort(
    (a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value]), 'fr') * dir,
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedReservations.value.length / PAGE_SIZE)))

const paginatedReservations = computed(() =>
  sortedReservations.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
)

watch(searchQuery, () => {
  currentPage.value = 1
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

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

function rowBorderClass(reservation: Reservation) {
  switch (reservation.stayStatus) {
    case 'Check-in':
    case 'En cours':
      return 'border-lagoon-500'
    case 'Check-out':
      return 'border-gold-500'
    case 'À venir':
    default:
      return 'border-sand-200'
  }
}

function validate(): boolean {
  errors.value = {}
  const requiredFields: Array<[keyof ReservationFormData, string]> = [
    ['name', 'Le nom est requis.'],
    ['phone', 'Le téléphone est requis.'],
    ['email', "L'email est requis."],
    ['identityCard', 'La pièce d’identité est requise.'],
    ['country', 'Le pays de provenance est requis.'],
    ['type', 'Le type de réservation est requis.'],
    ['dateDebut', 'La date de début est requise.'],
    ['dateFin', 'La date de fin est requise.'],
  ]
  for (const [field, message] of requiredFields) {
    if (!form.value[field]?.toString().trim()) {
      errors.value[field] = message
    }
  }
  if (form.value.phone && !/^[0-9+()\s-]+$/.test(form.value.phone.trim())) {
    errors.value.phone = 'Le téléphone ne doit contenir que des chiffres, espaces, parenthèses ou +.'
  }
  return Object.keys(errors.value).length === 0
}

const openAddPopup = () => {
  isEditing.value = false
  editId.value = null
  form.value = emptyForm()
  roomIdField.value = ''
  errors.value = {}
  showPopup.value = true
}
const editReservation = (reservation: Reservation) => {
  isEditing.value = true
  editId.value = reservation.id
  const { id, stayStatus, ...rest } = reservation
  form.value = { ...rest }
  roomIdField.value = reservation.roomId ?? ''
  errors.value = {}
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveReservation = () => {
  if (!validate()) return
  const payload = { ...form.value, roomId: roomIdField.value === '' ? undefined : Number(roomIdField.value) }
  if (isEditing.value && editId.value !== null) {
    reservationsStore.update(editId.value, payload)
  } else {
    reservationsStore.add(payload)
  }
  closePopup()
}
const confirmDelete = (id: number) => {
  deleteId.value = id
}
const cancelDelete = () => {
  deleteId.value = null
}
const deleteReservation = () => {
  if (deleteId.value !== null) {
    reservationsStore.remove(deleteId.value)
    deleteId.value = null
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
<style scoped>
.list-row-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.list-row-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>
