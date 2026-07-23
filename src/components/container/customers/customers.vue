<template>
  <div class="p-6 max-w-7xl mx-auto font-sans bg-gray-50/50 min-h-screen rounded-3xl">
    <PageHeader title="Clients" subtitle="Gestion des clients de l'hôtel.">
      <template #actions>
        <BaseButton @click="openAddPopup">Nouveau client</BaseButton>
      </template>
    </PageHeader>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou pays..."
        class="w-full md:w-96 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:bg-white transition"
      />
    </div>

    <EmptyState
      v-if="filteredCustomers.length === 0"
      title="Aucun client trouvé"
      description="Essayez une autre recherche ou ajoutez un nouveau client."
    />

    <template v-else>
      <div
        class="hidden md:grid grid-cols-4 gap-6 px-6 py-4 bg-white border-b font-semibold text-sm text-gray-500 uppercase rounded-t-2xl"
      >
        <div>Nom et prénoms</div>
        <div>Téléphone</div>
        <div>Email</div>
        <div class="text-center">Actions</div>
      </div>
      <div class="bg-white rounded-b-2xl shadow-sm overflow-hidden">
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
            <BaseButton size="sm" variant="secondary" @click="editCustomer(customer, index)">Modifier</BaseButton>
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
          {{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
        </h3>
        <form @submit.prevent="saveCustomer" class="space-y-4">
          <FormField v-model="form.name" label="Nom et prénoms" required placeholder="MANGO Nazifath" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField v-model="form.phone" type="tel" label="Téléphone" required placeholder="+229 01 00 00 00 00" />
            <FormField v-model="form.email" type="email" label="Adresse Email" required placeholder="exemple@gmail.com" />
          </div>
          <FormField v-model="form.country" label="Pays de résidence" required placeholder="Bénin" />
          <div class="flex justify-end gap-3 pt-5">
            <BaseButton type="button" variant="secondary" @click="closePopup">Annuler</BaseButton>
            <BaseButton type="submit">{{ isEditing ? 'Confirmer la modification' : 'Enregistrer' }}</BaseButton>
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
        <h3 class="text-lg font-bold text-gray-800 mb-2">Supprimer ce client ?</h3>
        <p class="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="cancelDelete">Annuler</BaseButton>
          <BaseButton variant="danger" @click="deleteCustomer">Supprimer</BaseButton>
        </div>
      </div>
    </div>
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
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'


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
  country: '',
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
