<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-sand-50/50 min-h-screen rounded-3xl page-enter-anim">
    <PageHeader title="Clients" subtitle="Gestion des clients de l'hôtel.">
      <template #actions>
        <BaseButton @click="openAddPopup">
          <Icon name="plus" class="w-4 h-4" />
          Nouveau client
        </BaseButton>
      </template>
    </PageHeader>

    <PageCard class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou numéro de pièce..."
        class="w-full md:w-96 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition"
      />
    </PageCard>

    <EmptyState
      v-if="filteredClients.length === 0"
      title="Aucun client trouvé"
      description="Essayez une autre recherche ou ajoutez un nouveau client."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-navy-300 uppercase rounded-t-2xl"
      >
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('nom')"
        >
          Nom et prénoms
          <SortIcon :active="sortKey === 'nom'" :direction="sortDirection" />
        </button>
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('telephone')"
        >
          Téléphone
          <SortIcon :active="sortKey === 'telephone'" :direction="sortDirection" />
        </button>
        <button
          type="button"
          class="flex items-center gap-1 text-left cursor-pointer hover:text-navy-400 transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          @click="toggleSort('nationalite')"
        >
          Nationalité
          <SortIcon :active="sortKey === 'nationalite'" :direction="sortDirection" />
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
          v-for="(client, index) in paginatedClients"
          :key="client.id"
          :style="{ transitionDelay: `${Math.min(index * 20, 200)}ms` }"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b hover:bg-sand-50 hover:shadow-sm transition-colors duration-150 cursor-pointer"
          @click="openDetails(client)"
        >
          <div class="flex items-center gap-3">
            <Avatar :name="`${client.nom} ${client.prenom}`" />
            <div>
              <div class="text-navy-500 font-medium text-left transition-colors duration-150 hover:text-navy-300 rounded">
                {{ client.nom }} {{ client.prenom }}
              </div>
              <Badge tone="gray" class="mt-1">{{ client.paysProvenance }}</Badge>
            </div>
          </div>
          <div class="text-navy-300 text-sm mt-2 md:mt-0">
            {{ client.telephone }}
          </div>
          <div class="text-navy-300 text-sm mt-2 md:mt-0">
            {{ client.nationalite }}
          </div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" title="Modifier" @click.stop="editClient(client)">
              <Icon name="edit" class="w-4 h-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" title="Supprimer" @click.stop="confirmDelete(client.id)">
              <Icon name="trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </TransitionGroup>
      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </template>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-navy-500 text-center mb-6">
        {{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
      </h3>
      <form @submit.prevent="saveClient" class="space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Identité</h4>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.nom"
                label="Nom"
                placeholder="MANGO"
                :invalid="!!errors.nom"
                :error="errors.nom"
              />
              <FormField
                v-model="form.prenom"
                label="Prénom"
                placeholder="Nazifath"
                :invalid="!!errors.prenom"
                :error="errors.prenom"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField v-model="form.sexe" label="Sexe">
                <option value="F">Féminin</option>
                <option value="M">Masculin</option>
              </SelectField>
              <FormField
                v-model="form.dateNaissance"
                type="date"
                label="Date de naissance"
                :invalid="!!errors.dateNaissance"
                :error="errors.dateNaissance"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.lieuNaissance"
                label="Lieu de naissance"
                placeholder="Cotonou"
                :invalid="!!errors.lieuNaissance"
                :error="errors.lieuNaissance"
              />
              <SelectField
                v-model="form.nationalite"
                label="Nationalité"
                :invalid="!!errors.nationalite"
                :error="errors.nationalite"
              >
                <option value="">Sélectionner une nationalité</option>
                <option v-for="nation in paysOptions" :key="nation" :value="nation">{{ nation }}</option>
              </SelectField>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Contact</h4>
          <div class="space-y-4">
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
              <FormField v-model="form.email" type="email" label="Adresse Email (optionnel)" placeholder="exemple@gmail.com" />
            </div>
            <FormField
              v-model="form.adresse"
              label="Adresse"
              placeholder="Fidjrossè"
              :invalid="!!errors.adresse"
              :error="errors.adresse"
            />
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-navy-400 mb-3 pb-2 border-b border-sand-200">Documents</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              v-model="form.typePiece"
              label="Type de pièce d'identité"
              placeholder="Passeport"
              :invalid="!!errors.typePiece"
              :error="errors.typePiece"
            />
            <FormField
              v-model="form.paysProvenance"
              label="Numéro de la pièce"
              placeholder="N°123456789"
              :invalid="!!errors.paysProvenance"
              :error="errors.paysProvenance"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
          <BaseButton type="submit">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
        </div>
      </form>
    </Modal>

    <Modal :model-value="deleteId !== null" size="sm" @update:model-value="cancelDelete">
      <h3 class="text-lg font-bold text-navy-500 mb-2">Supprimer ce client ?</h3>
      <p class="text-sm text-navy-300 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteClient">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores/clients'
import type { Client } from '@/data/clients'
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
const clientsStore = useClientsStore()
const { clients } = storeToRefs(clientsStore)

const PAGE_SIZE = 10

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const errors = ref<Record<string, string>>({})
const sortKey = ref<'nom' | 'telephone' | 'nationalite'>('nom')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

type ClientFormData = Omit<Client, 'id' | 'telephone' | 'dateEnregistrement'> & { phone: string; email: string }

const emptyForm = (): ClientFormData => ({
  nom: '',
  prenom: '',
  sexe: 'F',
  dateNaissance: '',
  nationalite: '',
  adresse: '',
  phone: '',
  email: '',
  typePiece: '',
  paysProvenance: '',
  lieuNaissance: '',
})
const form = ref<ClientFormData>(emptyForm())

const filteredClients = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return clients.value.filter(
    (client) =>
      client.nom.toLowerCase().includes(search) ||
      client.prenom.toLowerCase().includes(search) ||
      client.paysProvenance.toLowerCase().includes(search),
  )
})

const sortedClients = computed(() => {
  const dir = sortDirection.value === 'asc' ? 1 : -1
  return [...filteredClients.value].sort(
    (a, b) => String(a[sortKey.value]).localeCompare(String(b[sortKey.value]), 'fr') * dir,
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedClients.value.length / PAGE_SIZE)))

const paginatedClients = computed(() =>
  sortedClients.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
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

function validate(): boolean {
  errors.value = {}
  const requiredFields: Array<[keyof ClientFormData, string]> = [
    ['nom', 'Le nom est requis.'],
    ['prenom', 'Le prénom est requis.'],
    ['dateNaissance', 'La date de naissance est requise.'],
    ['lieuNaissance', 'Le lieu de naissance est requis.'],
    ['nationalite', 'La nationalité est requise.'],
    ['phone', 'Le téléphone est requis.'],
    ['adresse', "L'adresse est requise."],
    ['typePiece', 'Le type de pièce est requis.'],
    ['paysProvenance', 'Le numéro de la pièce est requis.'],
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
  errors.value = {}
  showPopup.value = true
}
const editClient = (client: Client) => {
  isEditing.value = true
  editId.value = client.id
  const { id, telephone, dateEnregistrement, ...rest } = client
  form.value = { ...rest, phone: telephone, email: rest.email ?? '' }
  errors.value = {}
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveClient = () => {
  if (!validate()) return
  const { phone, ...rest } = form.value
  if (isEditing.value && editId.value !== null) {
    clientsStore.update(editId.value, { ...rest, telephone: phone })
  } else {
    clientsStore.add({
      ...rest,
      telephone: phone,
      dateEnregistrement: new Date().toISOString().slice(0, 10),
    })
  }
  closePopup()
}
const confirmDelete = (id: number) => {
  deleteId.value = id
}
const cancelDelete = () => {
  deleteId.value = null
}
const deleteClient = () => {
  if (deleteId.value !== null) {
    clientsStore.remove(deleteId.value)
    deleteId.value = null
  }
}
const openDetails = (client: Client) => {
  router.push({ name: 'customer-details', params: { id: client.id } })
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
