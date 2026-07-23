<template>
Developpement
  <div class="bg-white rounded-xl shadow p-5">
    <h2 class="text-xl font-bold mb-5">Liste des clients</h2>

    <div v-if="clients.length === 0" class="text-center text-gray-400 py-10">
      Aucun client enregistré pour l'instant.
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="client in clients"
        :key="client.id"
        class="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
        @click="router.push(`/customers/${client.id}`)"
      >
        <div
          class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-semibold shrink-0"
        >
          {{ client.nom.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="font-bold text-gray-800">
            {{ client.nom }} {{ client.prenom }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ client.telephone }}
          </p>
        </div>
        <span class="text-sm text-gray-400">{{ client.sexe }}</span>
=======
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
          :key="customer.id"
          class="p-5 md:grid md:grid-cols-4 gap-6 items-center border-b hover:bg-gray-50"
        >
          <div>
            <div class="text-gray-900 font-medium">
              {{ customer.name }}
            </div>
            <Badge tone="gray" class="mt-1">{{ customer.country }}</Badge>
          </div>
          <div class="text-gray-600 text-sm mt-2 md:mt-0">
            {{ customer.phone }}
          </div>
          <div class="text-gray-600 text-sm mt-2 md:mt-0">
            {{ customer.email }}
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
 production
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { clients } from '@/data/clients'

const router = useRouter()
=======
import { ref, computed } from 'vue'
import { customers as initialCustomers, type Customer } from '@/data/customers'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Badge from '@/components/ui/Badge.vue'

const searchQuery = ref('')
const showPopup = ref(false)
const isEditing = ref(false)
const editIndex = ref<number | null>(null)
const deleteIndex = ref<number | null>(null)
const customers = ref<Customer[]>(initialCustomers)

const emptyForm = (): Customer => ({
  id: 0,
  name: '',
  phone: '',
  email: '',
  country: '',
})
const form = ref<Customer>(emptyForm())

const filteredCustomers = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return customers.value.filter(
    (customer) => customer.name.toLowerCase().includes(search) || customer.country.toLowerCase().includes(search),
  )
})

const openAddPopup = () => {
  isEditing.value = false
  editIndex.value = null
  form.value = emptyForm()
  showPopup.value = true
}
const editCustomer = (customer: Customer, index: number) => {
  isEditing.value = true
  editIndex.value = index
  form.value = { ...customer }
  showPopup.value = true
}
const closePopup = () => {
  showPopup.value = false
}
const saveCustomer = () => {
  if (isEditing.value && editIndex.value !== null) {
    customers.value[editIndex.value] = { ...form.value }
  } else {
    customers.value.push({ ...form.value, id: customers.value.length + 1 })
  }
  closePopup()
}
const confirmDelete = (index: number) => {
  deleteIndex.value = index
}
const cancelDelete = () => {
  deleteIndex.value = null
}
const deleteCustomer = () => {
  if (deleteIndex.value !== null) {
    customers.value.splice(deleteIndex.value, 1)
    deleteIndex.value = null
  }
}
</script>
