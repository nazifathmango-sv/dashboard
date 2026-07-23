<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl page-enter-anim">
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
        placeholder="Rechercher par nom ou pays..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
      />
    </PageCard>

    <EmptyState
      v-if="filteredClients.length === 0"
      title="Aucun client trouvé"
      description="Essayez une autre recherche ou ajoutez un nouveau client."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase rounded-t-2xl"
      >
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-gray-700" @click="toggleSort('nom')">
          Nom et prénoms
          <SortIcon :active="sortKey === 'nom'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-gray-700" @click="toggleSort('telephone')">
          Téléphone
          <SortIcon :active="sortKey === 'telephone'" :direction="sortDirection" />
        </button>
        <button type="button" class="flex items-center gap-1 text-left cursor-pointer hover:text-gray-700" @click="toggleSort('nationalite')">
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
  v-for="(customer, index) in filteredCustomers"
  :key="customer.id || index"
  class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b hover:bg-gray-50 transition-colors duration-200"
>
         <div>
  <div class="text-gray-900 font-medium">
    {{ customer.name || 'Nom indisponible' }}
  </div>

  <Badge tone="gray" class="mt-1">
    {{ customer.country || 'Non renseigné' }}
  </Badge>
</div>

<div class="text-gray-600 text-sm mt-2 md:mt-0">
  {{ customer.phone || '-' }}
</div>

<div class="text-gray-600 text-sm mt-2 md:mt-0">
  {{ customer.email || '-' }}
</div>
          <div class="flex md:justify-center items-center gap-3 mt-3 md:mt-0">
            <BaseButton size="sm" variant="secondary" title="Modifier" @click="editClient(client)">
              <Icon name="edit" class="w-4 h-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" title="Supprimer" @click="confirmDelete(client.id)">
              <Icon name="trash" class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </TransitionGroup>
      <Pagination v-model:current-page="currentPage" :total-pages="totalPages" />
    </template>

    <Modal v-model="showPopup" size="lg">
      <h3 class="text-xl font-bold text-gray-800 text-center mb-6">
        {{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
      </h3>
      <form @submit.prevent="saveClient" class="space-y-6">
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Identité</h4>
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
              <FormField
                v-model="form.nationalite"
                label="Nationalité"
                placeholder="Béninoise"
                :invalid="!!errors.nationalite"
                :error="errors.nationalite"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Contact</h4>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                v-model="form.phone"
                type="tel"
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
          <h4 class="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Documents</h4>
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
              label="Pays de provenance"
              placeholder="Bénin"
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
      <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer ce client ?</h3>
      <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
        <BaseButton variant="danger" @click="deleteClient">Supprimer</BaseButton>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'

import { db } from '@/firebase'

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


type Customer = {
  id: string
  name: string
  phone: string
  email: string
  country: string
}


const searchQuery = ref('')

const showPopup = ref(false)
const isEditing = ref(false)

const editIndex = ref<number | null>(null)
const deleteIndex = ref<number | null>(null)

const customers = ref<Customer[]>([])


const emptyForm = (): Customer => ({
  id: '',
  name: '',
  phone: '',
  email: '',
  typePiece: '',
  paysProvenance: '',
  lieuNaissance: '',
})


const form = ref<Customer>(emptyForm())


// Charger les clients depuis Firebase
const chargerClients = async () => {

  try {

    const snapshot = await getDocs(
      collection(db, "clients")
    )

    customers.value = snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Customer, 'id'>)
    }))


  } catch(error) {

    console.error(
      "Erreur chargement clients :",
      error
    )

  }

}


// Recherche
const filteredCustomers = computed(() => {

  const search = searchQuery.value.toLowerCase()

  return customers.value.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search) ||
      customer.country.toLowerCase().includes(search)
  )

})


// Ouvrir ajout
const openAddPopup = () => {

  isEditing.value = false
  editIndex.value = null

  form.value = emptyForm()

  showPopup.value = true

}


// Modifier
const editCustomer = (
  customer: Customer,
  index: number
) => {

  isEditing.value = true

  editIndex.value = index

  form.value = {
    ...customer
  }

  showPopup.value = true

}


// Fermer popup
const closePopup = () => {

  showPopup.value = false

  form.value = emptyForm()

}


// Ajouter / Modifier client
const saveCustomer = async () => {

  try {


    // Modification
    if(
      isEditing.value &&
      editIndex.value !== null
    ){

      const client = customers.value[editIndex.value]


      await updateDoc(
        doc(db, "clients", client.id),
        {
          name: form.value.name,
          phone: form.value.phone,
          email: form.value.email,
          country: form.value.country
        }
      )


    }

    // Ajout
    else {

      await addDoc(
        collection(db,"clients"),
        {
          name: form.value.name,
          phone: form.value.phone,
          email: form.value.email,
          country: form.value.country
        }
      )

    }


    await chargerClients()

    closePopup()


  } catch(error){

    console.error(
      "Erreur enregistrement client :",
      error
    )

  }

}



// Ouvrir confirmation suppression
const confirmDelete = (index:number) => {

  deleteIndex.value = index

}


// Annuler suppression
const cancelDelete = () => {

  deleteIndex.value = null

}



// Supprimer client
const deleteCustomer = async () => {


  if(deleteIndex.value === null)
    return


  try {


    const client =
      filteredCustomers.value[deleteIndex.value]


    await deleteDoc(
      doc(db,"clients",client.id)
    )


    await chargerClients()


    deleteIndex.value = null


  }
  catch(error){

    console.error(
      "Erreur suppression client :",
      error
    )

  }

}



// Chargement initial
onMounted(() => {

  chargerClients()

})

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
